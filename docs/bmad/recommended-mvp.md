---
date: 2026-09-08
status: PROPOSAL — do not implement until the amendments in stress-test.md are approved
scope: architecture, stack and file plan only. No application code in this document.
---

# Recommended MVP — Captei Voz

**Read `stress-test.md` first.** This plan assumes the three amendments
proposed there are approved. If they are rejected, this plan is wrong, because
two of them change what is technically buildable rather than merely what is
advisable.

Nothing here is an instruction to start coding. This is the target the first
implementation session should aim at once a human has signed off.

---

## 1. What the demo is

One deployed web app, used by a corretor, containing two screens that share one
consent gate.

**Screen 1 — Compose desk.** Hold to talk in Portuguese, Spanish or English.
Get back a transcript, a rewritten professional pt-BR message, and a rendered
audio note. Review all three against the original. Edit the text, re-render,
approve. On approval the note is written to an approval log and made available
for delivery. **Delivery is a manual handoff, not an automated send** — see §6.

**Screen 2 — Consented qualify.** A live AssemblyAI Voice Agent session that
qualifies an owner who arrived through the appraisal funnel. Real turn-taking,
real barge-in, and at least one tool call that writes the qualification back to
the database. This screen is what makes the submission a *voice agent* project
rather than a voice *pipeline* project.

**The gate.** Both screens resolve their target contact through the same query,
and that query cannot return a contact without a consent record. Screen 1
refuses to render for an unconsented contact, and the refusal is shown on
screen rather than hidden.

---

## 2. Stack

Chosen for one reason: the smallest number of moving parts that still lets a
server hold the API key, keep a WebSocket open for the length of an audio
render, and persist an approval log.

| Layer | Choice | Why this and not the alternative |
|---|---|---|
| App | **Next.js (App Router) + TypeScript** | One deployable serves the UI and the server routes. A separate SPA plus API would double the deploy surface for no gain at this size. |
| Runtime | **Node 20+, long-running server** (not serverless functions) | The audio render holds a WebSocket for roughly the duration of the note. Serverless request timeouts and cold starts make this fragile for no benefit. |
| Host | **Render** (or Fly.io) | AssemblyAI's own starters document a Render deploy, HTTPS is automatic — required, because `getUserMedia` only works on secure origins — and long-lived connections are supported. |
| DB | **Postgres (Neon) + Drizzle ORM** | Mirrors the CRM's stack so the schema can migrate into Fechou later. Drizzle keeps the `NOT NULL` consent columns honest at the type level. |
| STT | **AssemblyAI Universal-3.5 Pro, streaming** (`u3-rt-pro`) | Mandatory sponsor tech, and genuinely the right tool: it models Brazilian Portuguese as a dialect and code-switches across pt/es/en natively. **Streaming, not the pre-recorded endpoint** — both paths the hackathon sanctions are real-time, and no rule blesses batch transcription as the foundation of a submission. Push-to-talk capture would have been simpler on the async API; do it live anyway. |
| Rewrite | **AssemblyAI LLM Gateway** | Keeps the whole pipeline on sponsor infrastructure, which matters for judging. Note it is billed on tokens and is **not** covered by the free tier. |
| TTS | **AssemblyAI Voice Agent API, verbatim-greeting render** | The only AssemblyAI path to synthesised audio. See §4 — this is the load-bearing technical decision in the whole plan. |
| Live agent | **AssemblyAI Voice Agent API, browser integration** | Server mints the token, browser opens the socket. |
| Audio encode | **ffmpeg** → Ogg/Opus, **mono, ≤ 512 KB** | PCM out of the Voice Agent has to become a format WhatsApp accepts as a *voice note*. 512 KB is the real ceiling, not the 16 MB media limit — above it the play icon degrades to a download arrow. MIME must be `audio/ogg; codecs=opus`. |
| Styling | Tailwind | No opinion, just fast. |

**Deliberately excluded:** pg-boss, n8n, any queue, any auth provider, any
multi-tenancy, ElevenLabs, and any WhatsApp SDK. Each would add a deploy
target or a legal surface for something the demo does not need.

---

## 3. Repository layout

Proposed. Nothing in this tree exists yet.

```text
captei-voz/
  docs/
    IDEA-LOCK.md
    BMAD-WINDOW-PROMPT.md
    bmad/
      product-brief.md
      stress-test.md
      recommended-mvp.md
  app/
    layout.tsx
    page.tsx                        # landing: pick a property, pick a screen
    compose/[propertyId]/page.tsx   # Screen 1 — compose desk
    qualify/[contactId]/page.tsx    # Screen 2 — consented live qualify
    api/
      stt-token/route.ts            # mint Streaming STT temp token (server only)
      rewrite/route.ts              # transcript -> professional pt-BR
      render/route.ts               # approved text -> Ogg/Opus voice note
      voice-token/route.ts          # mint Voice Agent temp token (server only)
      approve/route.ts              # write the approval record
  lib/
    assemblyai/
      stt.ts                        # streaming transcription client
      rewrite.ts                    # LLM Gateway client + the register prompt
      render.ts                     # verbatim TTS render over the WS
      token.ts                      # GET /v1/token wrapper
      agent.ts                      # create/update the qualify agent
    audio/
      encode.ts                     # PCM16 24k -> Ogg/Opus via ffmpeg
    consent/
      gate.ts                       # THE gate. Single choke point.
    disclosure.ts                   # synthetic-voice disclosure + CRECI block
  db/
    schema/
      contacts.ts
      properties.ts
      compose_drafts.ts
      approvals.ts
      qualify_sessions.ts
    migrations/
  public/
    pcm-processor.js                # AudioWorklet for mic capture
  .env.example                      # placeholder names only, never values
  agents/
    qualify-owner.jsonc             # Voice Agent config, committed
```

Two conventions worth fixing now because they are hard to retrofit:

- **`lib/consent/gate.ts` is the only module allowed to resolve a phone number
  or a contact for outbound purposes.** Everything else takes an already-gated
  object. If a second code path can resolve a destination, the guarantee is
  gone.
- **`agents/qualify-owner.jsonc` is committed, secrets are substituted at
  publish time.** Following AssemblyAI's starter convention, `${VAR}` in the
  agent file is filled from the environment at publish. The JSON stays safe to
  commit; the values never enter the repo.

---

## 4. The render path — the one decision to get right

AssemblyAI **does not sell standalone text-to-speech.** Its own FAQ says so
directly: TTS exists only inside the Voice Agent API pipeline. IDEA-LOCK's
compose-desk step "stock PT voice" therefore has no obvious implementation.

There is a clean way through, and it depends on one documented property of the
`greeting` field:

> "The greeting is sent straight to the TTS engine. It is not run through the
> LLM first. Whatever string you put here is exactly what the user hears, word
> for word."

So the render is: open a Voice Agent WebSocket with a server-minted token, send
one `session.update` carrying the approved text as `greeting` and the chosen
`voice`, wait for `session.ready`, collect the `reply.audio` frames the greeting
produces, send `session.end`, then encode the collected PCM to Ogg/Opus.

Why this is the right choice and not a hack in the pejorative sense:

- **It is deterministic.** The greeting bypasses the LLM, so the audio says
  exactly the text the corretor approved. Any route that goes through
  `reply.create` or the system prompt reintroduces paraphrasing — which would
  mean the corretor approves one text and the owner hears another. That is
  unacceptable for a product whose entire defence is the approval step.
- **It keeps AssemblyAI load-bearing** for the hackathon, rather than
  outsourcing the voice to a third party.

Constraints this imposes, all of which must be designed around rather than
discovered later:

| Constraint | Consequence |
|---|---|
| Audio streams at roughly playback rate | A 35-second note takes ~35 seconds to render. The compose desk needs a visible progress state, and the brief's "< 15 s to previewable draft" target cannot include the render. Show the *text* immediately and let the audio arrive after. |
| Billed on WebSocket-open wall-clock, not audio seconds | Every render costs ~its own duration at the Voice Agent rate. Cheap per note; ruinous if a session leaks. |
| Unclosed sessions bill for up to 3 hours | `session.end` in a `finally` block, non-negotiable. A leaked render loop can eat a large share of the $50 free credit. |
| Output is PCM 24 kHz (or 8 kHz μ-law) only | ffmpeg must be present in the deploy image. Verify on the host before building anything else. |
| Greeting length limit is undocumented | **Verify empirically before committing to this path.** If long greetings are truncated, notes must be chunked and concatenated. This is the single biggest unknown in the plan. |

**Fallback, if the greeting path fails verification.** Use AssemblyAI for STT
and the live agent, and a third-party TTS for the composed note — which is the
architecture AssemblyAI's own Pipecat and LiveKit integration docs describe,
pairing their STT with Cartesia or ElevenLabs. This also happens to solve the
accent problem in §5. It costs some "all-AssemblyAI" narrative purity and buys
a pt-BR voice. Decide only after the greeting test.

---

## 5. The voice, and the accent problem

AssemblyAI's Voice Agent speaks six output languages. Its only Portuguese voice
is `rafael`, listed with a **🇵🇹 European Portuguese** native accent. There is
no Brazilian Portuguese voice, and the roadmap list of coming languages does
not add one.

This is not a detail. The product's headline claim is "neutral professional
Portuguese" delivered to Brazilian property owners, and rewriting the text does
not change the phonology of the voice reading it. Text rewriting fixes
vocabulary and register; it cannot make an Iberian voice sound Brazilian.

**Required before any build:** a listen test. Put three realistic composed
notes through `rafael` in the Voice Agent playground and play them to at least
two Brazilian listeners cold, asking only "where is this person from and would
you call them back?" This costs an afternoon and determines the architecture.

Then, depending on the answer:

- **Passes** — proceed all-AssemblyAI as in §4, and drop the word "neutral"
  in favour of a claim the voice can actually carry.
- **Fails** — keep AssemblyAI for STT and the live agent, and add a pt-BR TTS
  voice from a third party for the composed note, per the documented
  Pipecat/LiveKit pattern. AssemblyAI remains the core of the submission.

Do not skip this test and do not let the demo script hide it by only ever
showing the text.

---

## 6. Delivery — explicitly not a WhatsApp sender

**No WhatsApp Cloud API integration in this MVP.** This is a scope decision
with three independent justifications, any one of which would be sufficient:

1. **Instructed.** No WhatsApp senders are to be written.
2. **Legally constrained.** Free-form audio can only reach an owner inside an
   owner-initiated service window. The plumbing that opens that window
   correctly is a real subsystem, not a demo detail, and building it badly is
   how the agency's number gets restricted.
3. **Operationally impossible in the window.** A WABA number, Meta Business
   verification and display-name approval take days and are outside our
   control.

Worth recording for the post-hackathon build, because it is better news than
assumed: Meta shipped an `audio.voice: true` flag on 16 October 2025 that makes
a business-sent audio message render as a **genuine push-to-talk voice note** —
waveform, play icon, microphone glyph, auto-download. So the composed note can
eventually look exactly like one the corretor thumbed himself. Since 17 March
2026 voice messages also emit a `played` webhook on first playback, which is
precisely the instrument needed to measure the product brief's deciding metric.
Neither changes the MVP scope; both change what the roadmap is aiming at.

**And design the funnel for the free window.** Meta's Free Entry Point — opened
by a Click-to-WhatsApp ad or a Facebook Page CTA — runs 72 hours and every
message type inside it is free. Divulga already publishes to Instagram and
Facebook. Routing Track A acquisition through a Click-to-WhatsApp ad therefore
gets a longer window, a free one, and an owner-initiated conversation, all from a
product that already exists. This matters more from 1 October 2026, when
free-form service messages stop being free (1,000 per number per month
thereafter, non-rolling).

What the MVP does instead, on approval:

- writes the approval record;
- makes the rendered `.ogg` available to the corretor to download or play;
- optionally offers a `wa.me` click-to-chat deep link that **opens a
  conversation for the human to complete**. This sends nothing by itself, which
  is precisely the property that makes it acceptable.

The last hop stays human. That is the same boundary `01-strategy.md` draws for
Track B, applied one layer higher, and it should be stated on screen rather
than buried — the gestora needs to see it.

### What every composed note must carry

Four elements, specified because COFECI's own draft AI rule (Res. 1.551/2025
art. 49, annulled on unrelated registry-competence grounds but the clearest
statement of regulatory expectation available) spelled out three of them:

1. **Synthetic-voice disclosure inside the audio**, not only in a text caption
   the owner may never read. Six words at the top is enough — *"Mensagem gravada
   com voz digital."*
2. **The corretor's full name and CRECI number**, in a **non-editable,
   non-skippable** block populated from the verified profile. Not a template
   variable he can delete. Res. COFECI 1.065/2007 makes this mandatory in
   professional communication, and CRECI-SC's fiscalization scope explicitly
   covers any medium directed at the real-estate market.
3. **A human-reply affordance** — "responda a qualquer momento e eu falo
   diretamente com você." Also satisfies Meta's escalation-path requirement.
4. **A timestamped approval record, retained five years.**

And one prohibition: **never simulate a human identity.** No invented assistant
or secretary persona. That is the line where consumer-law exposure stops being
arguable.

---

## 7. Data model sketch

Shapes and constraints only.

**`contacts`** — mirrors the CRM deliberately, including the constraint that
does the work: `consent_source` and `consent_at` both `NOT NULL`. A scraped
number cannot be inserted without fabricating a consent record, which is the
point. Plus `whatsapp_opted_out` defaulting to false.

**`properties`** — the captação subject. Neighbourhood, type, and an optional
public-ad provenance (`source_url`, `portal`, `captured_at`) for later Track B
use. Holds no personal data.

**`compose_drafts`** — one row per attempt: source audio reference, detected
input language, raw transcript, rewritten text, target language and register,
rendered audio reference, and status. Keeping the raw transcript alongside the
rewrite is what lets anyone later audit whether the rewrite changed the
corretor's meaning.

**`approvals`** — who approved, when, which draft, which contact, which consent
record was relied on, and the disclosure text used. Append-only. This is the
artefact the gestora buys.

**`qualify_sessions`** — the Voice Agent `session_id`, the contact, the
qualification result written by the tool call, and a reference to the recording.

Two cross-cutting requirements from `02-legal-constraints.md` that must be
built in from the first migration rather than added later:

- **Deletion cascades.** A titular deletion request must remove drafts, audio,
  approvals and qualify sessions, not just the contact row. Retrofitting this is
  painful; designing for it is nearly free.
- **Provenance is mandatory** on anything derived from a public ad.

---

## 8. Configuration and secrets

`.env.example` carries **names with empty values only**. The existing
`.gitignore` already excludes `.env` and `.env.*` while allowing
`.env.example`, so the safe pattern is already in place — keep it.

| Variable | Where it may exist | Notes |
|---|---|---|
| `ASSEMBLYAI_API_KEY` | Server only | Never reaches the browser. Every browser session uses a short-lived token minted server-side. |
| `DATABASE_URL` | Server only | |
| `QUALIFY_AGENT_ID` | Server, safe to log | Output of publishing the agent. |
| `PUBLIC_APP_URL` | Public | |

Additional operational settings that are security decisions rather than
preferences:

- **Opt out of the model improvement program** in the AssemblyAI dashboard's
  Data Controls, and **set a short TTL**. By default submitted files may be used
  for training after redaction. Owner audio should not be in that set.
- **Token lifetimes short** — 60 to 300 seconds, single-use, fetched fresh
  immediately before every connection including resumes.
- **Never commit an agent file containing a literal secret.** Use `${VAR}`
  substitution at publish time.

---

## 9. Build order

Sequenced so that each step kills the project early if it is going to die at
all. Steps 0 and 1 are investigations, not implementation, and should happen
before the human approves a build.

| # | Step | Kills the project if |
|---|---|---|
| 0 | **Accent listen test** (§5) and **greeting-length test** (§4). No repo changes. | Both fail and there is no acceptable TTS route. |
| 1 | Verify the auth header on each endpoint by hand. IDEA-LOCK and the docs disagree — the docs show a bare key on `/v1/agents` and `Bearer` on `/v1/token`. | — but silently costs a day of 401s if skipped. |
| 2 | Skeleton app, deployed, HTTPS, ffmpeg confirmed present on the host. | Host cannot run ffmpeg or hold a WebSocket. |
| 3 | Token endpoint + Screen 2 (live qualify), including one tool call. **Do the agent first**, because it is the part that makes this a voice-agent submission and the part most likely to surprise. | Voice Agent is unavailable or unusable from the browser. |
| 4 | STT + rewrite, text only, no audio. Screen 1 renders text and stops. | Rewrite quality is bad — visible immediately and cheap to test. |
| 5 | Render path + Opus encode. Audio appears in Screen 1. | The greeting render does not work at length; fall back per §4. |
| 6 | Consent gate, approval log, disclosure. | — but skipping it removes the reason the product exists. |
| 7 | Seed data, demo script, recording, deck. | Runs out of time. |

If the calendar tightens, **cut Screen 1's audio before cutting Screen 2.** A
submission with a working voice agent and a text-only compose desk is coherent.
A submission with a polished compose desk and no agent is a text tool with a
microphone, and it will be judged as one.

**The hard stop is 30 September at 11:00 EDT**, not end of day. Anything that
assumes a midnight deadline is budgeting about thirteen hours that do not exist.

---

## 10. Submission mechanics

Separate from engineering, and each item below is a mechanical scoring cap in
the published rule book rather than a matter of taste. These are the cheapest
points available and the easiest to lose on the last morning.

| Requirement | Detail |
|---|---|
| **Public GitHub repo** | Mandatory. A private repo explicitly lowers the score. |
| **MIT licence** | Submissions must be "original and MIT-compliant" — add `LICENSE`. |
| **Deployed public URL** | Mandatory, and judges must be able to interact with it. A dead or broken demo link **caps Application of Technology at 2–3 regardless of code quality.** |
| **Video** | MP4, **maximum 5 minutes and over 3** — under 3 minutes is scored "Limited". Target 3.5–4.5. The rubric expects market analysis and a revenue model *inside the video*, not just a product demo. |
| **PDF deck** | Mandatory. |
| **Long description** | At least 100 words: problem, solution, target audience, unique features. |
| **Cover image** | PNG/JPG, 16:9. |
| **Registration** | Both the lablab platform **and** the lablab Discord. |
| **Credits** | Claim through the event's dedicated signup link. If an account already exists, log out and back in via that link or the grant may not attach. |

Two engineering consequences that follow from the demo URL being judged cold,
possibly days after submission:

- **Free-tier streaming concurrency is 5 new streams per minute** (100 on
  pay-as-you-go). Judges arriving together will be throttled. Add a card, or
  gate the live agent behind a queue with an honest waiting state.
- **A demo that dies on an exhausted balance scores as a broken link.** $50 is
  roughly 11 hours of Voice Agent time, billed on socket-open duration including
  idle. Set a billing alert, and make sure `session.end` runs in a `finally`.

Judging is on four equally-assumed criteria — Application of Technology,
Presentation, Business Value, Originality. No weights are published for this
event. Note that **two of the four are business and pitch criteria**, so a
technically strong submission with a weak deck loses half the scorecard.

---

## 11. What is not being built, restated

Because scope creep here has a legal cost and not just a schedule cost:

- No WhatsApp sender, no Cloud API integration, no template management.
- No portal scraper, no discovery, no signal scoring, no Track B worklist.
- No voice cloning, no ElevenLabs, no corretor voice enrolment.
- No automated cadence or follow-up sequence of any kind.
- No auth, RBAC, multi-tenancy or billing.
- Nothing from Shipaton, Play Store or RevenueCat.
- No secrets in the repository.

---

## 12. Open items for the approving human

1. **Approve or reject the three amendments** in `stress-test.md`. Items 4, 5
   and 6 of this plan depend on them.
2. **Authorise the two pre-build tests** in step 0. They cost roughly a day and
   they determine the architecture.
3. **Confirm the fallback TTS position.** If the accent test fails, is a
   third-party pt-BR voice acceptable for the composed note, given AssemblyAI
   still carries STT and the live agent?
4. **Confirm the delivery boundary.** Download plus `wa.me` handoff, with no
   automated send, for this MVP.
