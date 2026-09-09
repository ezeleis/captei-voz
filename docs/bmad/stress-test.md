---
date: 2026-09-08
workflow: _bmad/core/tasks/bmad-review-adversarial-general + bmm/1-analysis/research (domain)
status: ✅ RESOLVED — A1–A4 approved by the human 2026-09-08; IDEA-LOCK amended accordingly
inputs:
  - docs/IDEA-LOCK.md
  - README.md
  - CRM/docs/captacao/01-strategy.md
  - CRM/docs/captacao/02-legal-constraints.md
  - AssemblyAI docs (primary, fetched 2026-09-08)
  - Meta WhatsApp Business Platform docs + Business Messaging Policy (2026-09-08)
  - LGPD / ANPD / COFECI / CONAR / STJ primary sources (2026-09-08)
  - lablab.ai event page + rule book (2026-09-08)
---

# Captei Voz — Stress Test

Six claims, six verdicts. Then an adversarial pass, then the amendments that
need a human signature before anything is built.

**Bottom line.** The product is buildable, legal, and worth building. But
**one lock cannot be implemented as written** — not for caution's sake, for
mechanical reasons — and **one lock rests on a factual error about a vendor
voice**. Both are cheap to fix now and expensive to discover on 28 September.

---

## Verdict summary

| # | Claim under test | Verdict |
|---|---|---|
| 1 | "Approve then send" cures the WABA/LGPD risk for a portal-ad-only owner | ❌ **Fails.** Approval changes authorship, not consent. Track A/B split confirmed and must be hardened. |
| 2 | Cloud API can send audio we generated | ✅ **Yes — better than assumed.** True voice notes are supported. But **only inside an owner-initiated 24h window**, never as first contact. |
| 3 | Stock AssemblyAI voices can carry "neutral professional Portuguese" | ❌ **No.** The only PT voice is European-accented. This is **not** a rewrite-the-text problem. |
| 4 | Compose desk + consented Voice Agent is enough "voice agent" | ⚠️ **Conditionally.** Only if the live agent is the headline. The compose desk alone is not an agent by AssemblyAI's own definition. |
| 5 | Thinnest demo matching IDEA-LOCK | ✅ **Defined below.** Live agent first, compose desk second, no sender. |
| 6 | Clone-vs-AssemblyAI and browser-only-vs-token-server conflicts | ✅ **Both real, both resolved.** Plus a third conflict nobody listed, which is worse. |

---

## Claim 1 — Legal: does "approve then send" cure a portal-ad-only owner?

**VERDICT: No. The approval step does not touch the defect.** The Track A /
Track B split in `01-strategy.md` is confirmed, and it needs to be stated more
strongly than it currently is: **Track B contacts cannot receive a WhatsApp
voice note at all**, human-approved or otherwise.

### Why approval does not help

The human approval step is genuinely valuable, and it defends against two
things — but not this one.

| Risk | Does approval help? |
|---|---|
| CRECI ethics exposure (misleading communication) | **Yes.** It makes the corretor the author, which is exactly what COFECI's own draft AI rule demanded. |
| CDC art. 37 misleading-advertising exposure | **Yes.** A reviewed, approved message by a named professional is not an algorithm's misstatement. |
| **Meta opt-in requirement** | **No.** Not addressed at all. |
| **LGPD legal basis** | **No.** Not addressed at all. |

Meta's test is about **consent**, not authorship. The Business Messaging Policy
requires, conjunctively, that the person "**have given you their mobile phone
number**" and that "**you have received opt-in permission from the recipient**."
An owner who published a number in a portal ad gave it to the portal's
audience, not to your business, and expressed no permission to anyone. Both
prongs fail. Whether a human pressed approve before sending is not a variable in
that test.

Worth being precise about the evidence: Meta does **not** publish a sentence
saying "public numbers are not opt-in." The verdict follows deductively from the
affirmative two-part requirement. The deduction is strong — an affirmative
consent test cannot be satisfied by publication to a third party — but if
anyone asks for a literal Meta quotation banning scraped numbers, it does not
exist.

Enforcement is where this stops being theoretical. Quality rating is computed
from a trailing seven days of blocks, reports and mutes, and Meta acts "in our
sole discretion." Since October 2025 **messaging limits are enforced at the
business-portfolio level**, shared across every number in the portfolio. One
careless agency throttles every other tenant. That converts a per-customer
compliance question into a platform-architecture question the moment Captei Voz
has two customers.

### LGPD: grey, defensible, and not a licence

`02-legal-constraints.md` already has this right. Two additions from primary
research sharpen it.

**The purpose-congruence argument is stronger than the doc claims, in one
narrow lane.** ANPD's *Guia Orientativo — Legítimo Interesse* (Feb 2024) lists
the source and manner of collection, and the compatibility of original and
later purpose, as factors in *legítima expectativa*. An owner advertising a
property for sale has a legitimate expectation of being contacted **about
selling that property**. That is congruent. The expectation collapses the moment
the number is reused for anything else, retained after the ad is withdrawn, or
pooled into a base.

**The nearest enforcement precedent runs against the naive reading.** ANPD's
only pecuniary sanction against a private company — Telekall Infoservice, July
2023 — concerned **WhatsApp contact lists** for message blasts, and the
company's defence was precisely that the data was collected from the open
internet and therefore needed no legal basis. ANPD rejected it, citing Art. 7
(no legal basis) and Art. 41 (no DPO). The fine was small (R$ 14,400, capped at
2% of turnover for a microempresa) and the facts are not on all fours — it
punished list commercialisation, not a professional calling about an ad he
read. But it forecloses "publicly available, therefore unregulated."

Also note the enforcement climate changed this year: **Lei 15.352/2026** turned
ANPD into a full agency with 200 career enforcement posts. The 2023–2025
baseline is not the forward baseline.

### Confirmed split, restated harder

| | Track A | Track B |
|---|---|---|
| Origin | "Quanto vale o meu imóvel?" form, explicit opt-in | Public ad signal |
| Personal data stored at discovery | Yes, with consent record | **None** |
| Automated cadence | Permitted (Track C, gated) | **Never** |
| **WhatsApp voice note** | **Only inside an owner-initiated window** — see Claim 2 | **Never, by any mechanism** |
| Human first contact | n/a | Phone call, or the portal's own form |
| Compose desk usable? | Yes | **No** — and the gate must make this impossible, not merely discouraged |

**Design consequence.** `lib/consent/gate.ts` is not a policy checkpoint, it is
the product's load-bearing wall. If any second code path can resolve a
destination phone number, the guarantee is gone. Track B signals must live in a
table that holds no personal data at all, exactly as `03-data-model.md`
specifies.

### Required additions not currently anywhere in this repo

These come from the LGPD side and are cheap now, painful later:

- A **documented LIA** (the Guia's three phases) for any ad-sourced number.
- A **published DPO/encarregado channel** — Art. 41. The exact omission that
  drew the advertência in Telekall.
- **ROPA** — Art. 37.
- **Opt-out honoured immediately and permanently**, and deletion cascading
  across signals, drafts, audio and approvals.
- **Opt out of AssemblyAI's model improvement program and set a short TTL.** By
  default submitted files may be used for training after redaction. Owner audio
  and corretor audio leaving Brazil for a US processor is an international
  transfer question (Art. 33) that IDEA-LOCK does not mention; AssemblyAI
  offers a DPA and EU residency, but **not** Brazilian residency.

---

## Claim 2 — Meta: voice notes vs templates vs the 24h window

**VERDICT: Yes, the Cloud API can send audio we generated, and it can render as
a genuine voice note. It is not restricted to the corretor's phone.** But the
delivery window is narrow and IDEA-LOCK's flow has no step that opens it.

### The good news, which is better than the lock assumed

Meta shipped `audio.voice: true` on **16 October 2025**. An audio message sent
with that flag renders in the recipient's client as a real push-to-talk voice
note: play icon, waveform, profile image with a microphone glyph, automatic
download, and optional on-device transcription. This is a genuine primitive, not
a workaround, and it means the compose desk's output is indistinguishable in
form from a note the corretor thumbed himself.

Constraints that shape the encoder, all verified:

- **OGG/Opus, mono, and ≤ 512 KB** for the voice-note rendering. The 16 MB
  media ceiling is irrelevant — above 512 KB the play icon degrades to a
  download arrow and the native feel is gone.
- The `voice` flag is **silently ignored** on non-Opus files. You ship a
  degraded experience with no error.
- The MIME string must be `audio/ogg; codecs=opus`. A bare `audio/opus` — which
  is what a browser `MediaRecorder` emits by default — is rejected with error
  `131053`.
- Bonus worth designing for: since **17 March 2026** voice messages emit a
  `played` webhook on first playback. That is a read receipt for audio, and it
  is exactly the instrument needed to measure the brief's deciding metric,
  owner-side playback.

### The blocker

**AUDIO is not a supported template header type.** Template headers are TEXT,
IMAGE, VIDEO, GIF, DOCUMENT or LOCATION. There is no AUDIO enum anywhere in the
template schema. And templates are, in Meta's words, the only message type that
can be sent outside a customer service window.

Those two facts compose into something IDEA-LOCK does not account for:

> **A voice note can only ever be delivered inside an open 24-hour customer
> service window. There is no configuration in which it can open a
> conversation.**

The window opens **only** on an inbound user message or an inbound WhatsApp
call, and resets on each subsequent one. A business-initiated template does not
open it — only the owner's reply does.

**This is the finding that breaks the lock.** `IDEA-LOCK.md` reads
"Compose desk | Corretor speech → … → approve → **send**". There is no step
between approve and send that opens a window, and consent alone does not open
one. Even a fully consented Track A owner cannot be sent a voice note until they
have messaged first. As written, the compose desk cannot make first contact by
voice note — ever, for anyone.

### The fix, and it is elegant

The owner has to speak first, so **design the funnel so that they do**, and pick
the variant that is also free:

Meta's **Free Entry Point** window is opened by a Click-to-WhatsApp ad or a
Facebook Page CTA button, runs **72 hours**, and **all message types inside it
are free**. Divulga already publishes the appraisal offer to Instagram and
Facebook. So:

```
Divulga  ──Click-to-WhatsApp ad──▶  owner taps, sends first message
                                              │
                              72h Free Entry Point window opens
                                              │
                          consent recorded ──▶ compose desk may send audio
                                              │
                                    Prince answers in seconds
```

This is strictly better than the locked flow on four axes at once: it is
policy-compliant, it opens a 72-hour rather than 24-hour window, the messages
inside it are free, and it reuses a product that already exists. The
alternative — a `wa.me` click-to-chat link at the end of the appraisal form —
also works and opens a 24-hour window, but is not free after 1 October.

### One more thing nobody costed

**Free-form service messages stop being free on 1 October 2026** — three weeks
from now. Every voice note is by definition a free-form service message.
From that date they are billed per message at the per-market rate under a new
`SERVICE` category, with a **free allowance of 1,000 service messages per
business phone number per month**, non-rolling. Generous for a pilot, thin at
scale, and **per phone number** — which is a second, independent argument for
provisioning a number per agency rather than sharing one.

Also on the calendar: Brazilian WABAs must migrate to BRL billing by 30 June
2027, after which Meta stops delivering messages for non-BRL accounts.

### Does Meta require disclosing AI-generated voice?

**No.** The Business Messaging Policy contains no AI-disclosure clause, and a
keyword search of the changelog for `AI-generated`, `synthetic` and `disclos*`
returns nothing. Meta's "AI Info" labelling program covers Facebook, Instagram
and Threads — feed and ads — not WhatsApp business messaging.

What Meta *does* mandate is an **escalation path**: automation inside the 24h
window is allowed but must come with "prompt, clear, and direct escalation
paths" to a human. The compose desk satisfies this trivially, since a human
approves every message — but a reachable-human affordance still has to be
exposed to the owner.

This is a proven absence of a rule, not a permission. Two adjacent items make
silence risky rather than safe:

- **Impersonation clauses do reach natural persons.** The Business Terms of
  Service forbid impersonating "any person," and the Messaging Policy
  specifically forbids speaking "in the voice of another business or entity
  without permission." Own-voice-with-documented-consent is defensible; a voice
  bound to anyone other than the consenting corretor is a violation. If the
  clone tier ever ships, **each voice model must be immutably bound to the
  consenting user's identity** — corretor A's voice must be unselectable by
  corretor B. That is a technical block, not a terms clause.
- **Brazil is named in Meta's "AI Providers" restriction**, effective 11 March
  2026, and unlike the EU the charges were not withdrawn. The restriction targets
  providers whose AI is the primary rather than incidental functionality.
  A real-estate CRM with an ancillary transcription-and-rewrite feature should
  fall outside it — but the determination is Meta's sole discretion, and Brazil
  is the only market. **Position and document the product as a real-estate CRM
  with ancillary AI, not as an AI product.**

---

## Claim 3 — Accent: can stock voices carry "neutral professional Portuguese"?

**VERDICT: No, and this is not a rewrite-the-text problem. It is the most
serious factual error in IDEA-LOCK.**

`IDEA-LOCK.md` says: "Hackathon uses stock Voice Agent voice (e.g. `rafael` for
PT)."

AssemblyAI's Voice Agent voices table lists **exactly one** Portuguese voice,
`rafael`, with a **🇵🇹 European Portuguese** native accent. The supported-output-
languages page lists Portuguese as 🇵🇹. There is no Brazilian Portuguese voice,
and the published roadmap of forthcoming languages — Hindi, Turkish, Dutch,
Swedish, Norwegian, Danish, Finnish, Vietnamese, Arabic, Hebrew, Japanese,
Chinese — **does not add one**.

The asymmetry is almost ironic. On the recognition side, Universal-3.5 Pro
explicitly models Brazilian Portuguese as a dialect, "including colloquial
expressions, local vocabulary, and accent-specific pronunciation patterns." The
pipeline as locked therefore **listens Brazilian and speaks Iberian.**

### Why rewriting the text cannot fix it

Rewriting operates on lexicon, morphology and register. It can choose *celular*
over *telemóvel*, *você* over *tu*, and gerunds over the infinitive
construction. Those are real gains and worth having.

It cannot touch phonology or prosody, which is where the accent actually lives:
the European reduction of unstressed vowels, the palatalised coda, the
different rhythm class. A pt-PT voice reading perfectly idiomatic pt-BR text
still sounds Portuguese to a Brazilian listener, in about two seconds.

That matters more here than it would in most markets. The recipient is a
property owner in Florianópolis receiving an unsolicited-feeling voice note
about their own property, and Brazilian consumers have been trained by years of
call-centre traffic to hang up on audibly foreign Portuguese. The product's
central claim and its most likely failure mode are the same sentence.

### The legal footnote, which is not the main problem

"Português neutro e profissional" survives as marketing copy — it describes a
verifiable property of the output and promises no outcome. So the exposure here
is commercial, not legal.

But two adjacent claims are not fine, and one of them is in the README's
neighbourhood:

- **"Sounds like you" / "soa como você" applied to a stock voice is
  straightforwardly illegal** — false as to an essential characteristic of the
  service, CDC art. 37 §1, strict liability, no intent required. It is
  legitimate *only* on a clone tier, plainly scoped. This copy must never
  appear on a stock-voice surface.
- **"100% em conformidade com a LGPD"** and any published conversion figure
  ("+X% de resposta") should be avoided. Under CDC art. 30 the offer becomes a
  binding contractual term enforceable under art. 35, and LGPD compliance
  depends on the corretor's conduct, which the vendor does not control.

### Required action before any build

A **listen test**, costing an afternoon. Put three realistic composed notes
through `rafael` in the Voice Agent playground and play them cold to at least
two Brazilian listeners, asking only: *where is this person from, and would you
call them back?*

- **Passes** → proceed all-AssemblyAI, and replace "neutral" with a claim the
  voice can actually carry.
- **Fails** → keep AssemblyAI for STT and the live agent, add a pt-BR voice from
  a third party for the composed note. This is the architecture AssemblyAI's own
  Pipecat and LiveKit integration docs describe — their STT paired with Cartesia
  or ElevenLabs TTS — so it is a sanctioned pattern, not a defection. And per
  Claim 4, the Voice Agent API is **not** mandatory for this hackathon anyway.

Do not skip this test, and do not let the demo script hide the answer by only
ever showing the text.

---

## Claim 4 — Hackathon fit: is this enough "voice agent"?

**VERDICT: Conditionally yes — but only if the live consented agent is the
headline. The compose desk on its own is not an agent by AssemblyAI's own
published definition, and a submission led by it will be judged as a voice-
powered tool.**

### What AssemblyAI itself says an agent is

Every definition they publish is built on a loop. From their own blog: "Strip
away the framework names and a voice agent is **a loop**. A person says
something… A language model reads the text and decides what to say… That
response gets turned back into audio. Then it **waits for the next thing the
person says and does it all again** — ideally in about a second."

The recurring load-bearing elements are multi-turn, sub-second latency, turn
detection, interruption/barge-in, and tool calling.

Measured against that:

| | Loop | Turn detection | Barge-in | Tools | Reads as an agent? |
|---|---|---|---|---|---|
| Compose desk (STT → rewrite → TTS → approve) | ✗ | ✗ | ✗ | ✗ | **No** |
| Consented live qualify | ✓ | ✓ | ✓ | ✓ | **Yes** |

Note that a chained STT → LLM → TTS pipeline is *explicitly endorsed* by
AssemblyAI as a legitimate voice-agent architecture. The pipeline shape is not
the problem. **The absence of a conversational loop is.**

### The good news: human-in-the-loop is not disqualifying

Three submissions already on the board do exactly this pattern, and one is
uncomfortably close to Captei Voz. **QuoteReady**, submitted 8 September, is
"a voice intake assistant that turns vague home-service enquiries into
reviewable request drafts… the caller must approve the current version before
downloading." Also **Playtest Pal** ("editable report with exact transcript
evidence") and **Voice Action Gate** ("cannot execute an irreversible action
unless every argument can be traced back to words the user actually said").

What all three share is instructive: **the human-approval step is framed as a
governance and trust feature layered on top of a real conversation**, not as a
substitute for one. That is the accepted way to run this pattern here, and it is
precisely the framing Captei Voz should adopt — approval as the trust layer over
the agent, not approval instead of the agent.

The competitive read is that the pattern is crowded rather than risky. Captei
Voz's differentiation has to come from the vertical and the compliance spine,
not from the novelty of human approval.

### What the judging actually rewards

Four criteria, exact wording: **Application of Technology**, **Presentation**,
**Business Value**, **Originality**. No weights are published anywhere on the
event page or in the rule book — unlike sibling events on the same platform,
which do publish them. Assume 25/25/25/25.

Two of the four are business and pitch criteria, not engineering. That is worth
internalising: a technically strong submission with a weak deck loses half the
scorecard.

Mechanical scoring traps, all confirmed in the rule book:

- A **missing or broken demo link, or a private repo, caps Application of
  Technology at 2–3** regardless of code quality. A public interactive URL and a
  public GitHub repo are both mandatory.
- A **video under 3 minutes scores 2 ("Limited")** on Presentation; the maximum
  is 5. Target 3.5–4.5 minutes, and the rubric expects market analysis and a
  revenue model **inside the video**.
- Submissions must be **original and MIT-compliant** — the repo needs an MIT
  licence file.

Historical pattern across three prior AssemblyAI events: winners were either a
real-time conversational agent with a visible latency story, or a platform that
made agents easy for others. Latency gets cited by name in AssemblyAI's own
write-ups ("sub-300ms", "250-millisecond timing precision"). **No compose-and-
approve tool has ever won one of these.** The 2024 NYC winner, Dealty, is the
closest analogue to this project — real-estate deal capture using streaming STT
with entities populating a UI live.

### Two corrections to IDEA-LOCK's hackathon assumptions

**The deadline is 30 September at 11:00 EDT, not end of day.** The event page
countdown and schedule both confirm it. If the plan assumed end-of-day, it is
budgeting roughly thirteen hours that do not exist.

**The Voice Agent API is not mandatory.** The event offers two explicitly equal
paths: the Voice Agent API, or the **Realtime Speech-to-Text API** with "bring
your own orchestration… bring your own LLM and text-to-speech." This materially
de-risks Claim 3 — a third-party pt-BR TTS voice is fully compatible with the
rules.

But note the load-bearing word in both paths: **real-time**. There is no
sanctioned path that blesses async/batch pre-recorded transcription as the
foundation of a submission. **The compose desk should use streaming STT, not the
pre-recorded endpoint**, even though pre-recorded would be simpler for a
push-to-talk capture. This is a real change to the plan.

Operational notes for demo survival: the free tier allows only **5 new streams
per minute** (pay-as-you-go allows 100), which is the constraint that bites when
judges hit a public URL at once. The $50 free credit is about 11 hours of Voice
Agent session time, billed on socket-open duration including idle. Claim the
credits through the event's dedicated signup link — if an account already exists,
log out and back in through that link, or the grant may not attach.

---

## Claim 5 — Scope to 30 September: the thinnest demo that still matches IDEA-LOCK

**VERDICT: One deployed app, two screens, no sender.** Detailed build order is
in `recommended-mvp.md`; this is the scope verdict and the reasoning.

**In scope:**

1. **Consented live qualify** — a real Voice Agent session in the browser via a
   server-minted token, with turn-taking, barge-in and at least one tool call
   writing the qualification back. **Built first.** This is the artefact that
   makes the submission legible as a voice-agent project.
2. **Compose desk** — streaming STT (pt/es/en, code-switching) → register-and-
   language rewrite → verbatim audio render → side-by-side review against the
   original → editable text → re-render → explicit approve.
3. **Consent gate**, refusing to resolve any contact without a consent record,
   with the refusal visible on screen.
4. **Approval log** — who, when, which property, which consent record, original
   transcript, final text, disclosure text used.
5. **Disclosure and identification** in every composed note.

**Out of scope, each for a stated reason:**

- **Any WhatsApp send.** Instructed; plus the window plumbing is a real
  subsystem; plus a WABA number with Meta Business verification and display-name
  approval takes days and is outside our control. Delivery is a download plus an
  optional `wa.me` handoff that sends nothing by itself.
- **Track B anything** — scraper, discovery, scoring, worklist.
- **Voice cloning.** Out by lock, and impossible on AssemblyAI regardless.
- **Automated cadence**, auth, RBAC, multi-tenancy, billing.
- **Anything from Shipaton.** Closed.

**The cut order, if the calendar tightens:** cut the compose desk's *audio*
before cutting the live agent. A submission with a working voice agent and a
text-only compose desk is coherent. A submission with a polished compose desk
and no agent is a text tool with a microphone, and Claim 4 says it will be
judged as one.

**Honest scope warning.** As of today there are 22 days minus one morning, the
repo contains five files, and the CRM this is meant to compose with is at Epic 1
with no leads table. Two hero features is ambitious. One hero feature plus a
credible second screen is achievable.

---

## Claim 6 — Conflicts

Two were named. Both are real, both resolve. **A third, unnamed one is worse
than either.**

### 6a — Voice clone vs AssemblyAI: no conflict, and deeper than stated

AssemblyAI has no voice-cloning API. IDEA-LOCK already puts cloning out of the
hackathon, so there is no conflict to resolve — the lock is correct.

But the research surfaced something the lock did not anticipate: **AssemblyAI
does not offer standalone text-to-speech at all.** Their FAQ is explicit: "TTS
is available as part of the Voice Agent API pipeline… AssemblyAI does not offer
standalone text-to-speech as a separate service."

So the compose desk's step "stock PT voice" — hero feature 1, the core of the
product — has **no endpoint behind it**. This was not on anyone's conflict list
and it is the biggest technical gap in the lock.

**Resolution, and it is clean.** The `greeting` field is documented as bypassing
the LLM entirely:

> "The greeting is sent straight to the TTS engine. It is not run through the
> LLM first. Whatever string you put here is exactly what the user hears, word
> for word."

So a render is: open a Voice Agent socket with a server-minted token, send one
`session.update` carrying the approved text as `greeting` plus the chosen
`voice`, collect the resulting `reply.audio` frames, `session.end`, then encode
PCM16/24 kHz to Ogg/Opus mono under 512 KB.

Why the greeting and not `reply.create`: **determinism**. `reply.create` and the
system prompt both route through the LLM, which would mean the corretor approves
one text and the owner hears a paraphrase of it. For a product whose entire
defence is the approval step, that is disqualifying. The greeting path is the
only one where approved text and spoken text are provably identical.

Costs and unknowns this imposes:

- Audio streams at roughly playback rate, so a 35-second note takes ~35 seconds
  to render, billed on wall-clock socket time. The brief's "< 15 s to previewable
  draft" cannot include the render — show text immediately, let audio follow.
- **Greeting length limits are undocumented.** This is the single biggest
  unknown in the plan and must be tested before anything is built. If long
  greetings truncate, notes must be chunked and concatenated.
- Unclosed sessions bill up to three hours. `session.end` in a `finally` block.

### 6b — Browser-only vs Voice Agent: confirmed impossible

**A server is mandatory.** The browser integration requires the server to call
`GET /v1/token` with the API key and hand the browser a short-lived single-use
token. There is no browser-only configuration, and there should not be — the
alternative is shipping the API key to the client.

Consequences: a long-running Node process (not serverless functions, because the
render holds a socket for the length of the note); HTTPS, because `getUserMedia`
only works on secure origins; tokens of 60–300 seconds fetched fresh before
every connection including resumes; and Chromium for the demo, since Firefox
loses echo cancellation and Safari garbles audio at a forced 24 kHz context.

### 6c — The unnamed conflict: IDEA-LOCK's API notes are wrong in two places

Small, but they cost a day of 401s and a runaway bill if followed literally.

- **`Terminate` is the wrong event.** IDEA-LOCK says "Always `Terminate`
  realtime sessions." `Terminate` belongs to the Streaming STT API. The Voice
  Agent API uses **`session.end`**. Closing a Voice Agent socket without it
  leaves a **billable 30-second resume grace window**, and an abandoned session
  auto-closes at three hours and bills for three hours.
- **The auth header is inconsistent.** IDEA-LOCK and `AGENTS.md` both say Voice
  Agent uses `Authorization: Bearer`. The docs show a **bare key** on
  `POST /v1/agents` and on `GET /v1/sessions`, and **`Bearer`** on
  `GET /v1/token`. One of these will 401 in the demo. Verify each endpoint by
  hand before writing a client.

---

## Adversarial pass

Per the BMAD adversarial review task: reviewed with the assumption that problems
exist. Eighteen findings, ordered by how much damage they do. Items already
covered above are stated once and cross-referenced.

**Fatal or near-fatal**

1. **The compose desk has no TTS endpoint.** Hero feature 1's rendering step
   does not exist as an API. See 6a. Mitigable, but nobody had noticed.
2. **The only Portuguese voice is European.** The headline claim is contradicted
   by the vendor's own voice table. See Claim 3.
3. **"Approve then send" cannot make first contact.** Audio is not template-able
   and the window opens only on inbound contact. See Claim 2.
4. **The consent spine it depends on does not exist yet.** Track A is a landing
   page plus a table in the CRM, which is at Epic 1 with Epic 3 unstarted. So the
   "only ever to consented owners" guarantee has nothing real to read from, and
   the demo must seed synthetic consent. Faking consent in a demo whose thesis is
   consent is a judging risk and an honesty risk. Seed it visibly, label it as
   seeded.

**Serious**

5. **The headline feature is the non-agent one.** See Claim 4. If the compose
   desk leads, judges score a pipeline against an agent rubric.
6. **Two heroes, 22 days minus a morning, five files in the repo.** See Claim 5.
7. **The deadline is 11:00 EDT, not midnight.** Thirteen hours of assumed budget
   that do not exist.
8. **The compose desk was planned on pre-recorded STT; the event expects
   real-time.** Neither sanctioned path blesses batch transcription as the
   foundation. Switch to streaming.
9. **Render is real-time and billed on wall-clock.** Breaks the sub-15-second
   draft target and makes "fast" false as stated. See 6a.
10. **Billing footguns compound.** Socket-open billing, idle billed, 30-second
    grace window billable, three-hour auto-close at full charge, and a free tier
    of ~11 agent-hours. A leaked render loop during demo prep is a real risk.
11. **Free-tier concurrency is 5 new streams/minute.** Judges arriving together
    on a public URL will be throttled. This is a submission-quality risk, not
    just an ops note.
12. **LGPD international transfer is unaddressed.** Audio goes to a US
    processor, and by default may be used for model training. No mention of the
    Data Controls opt-out, TTL, or a DPA anywhere in the repo. Art. 33.

**Worth fixing before it becomes expensive**

13. **Disclosure is absent from IDEA-LOCK entirely.** Neither README nor
    IDEA-LOCK mentions telling the owner the audio is synthetic. See the
    amendments — COFECI wrote this rule already.
14. **No CRECI identification requirement anywhere.** Res. COFECI 1.065/2007
    makes name + CRECI mandatory in professional communication, and CRECI-SC's
    own fiscalization scope explicitly covers "qualquer outro meio de
    comunicação direcionada ao mercado imobiliário." Make the identification
    block non-editable and non-skippable, populated from the verified profile.
15. **"Neutral" is unexamined.** Neutral relative to what? Brazilian Portuguese
    is strongly regionally marked, and a Florianópolis owner might respond
    *better* to a Sul-marked voice than to a São Paulo-neutral one. The claim is
    asserted with no evidence and may be optimising against the actual goal.
16. **README and IDEA-LOCK disagree on output language.** README says
    "neutral-Portuguese"; IDEA-LOCK says "professional PT-BR (or owner
    language)." Owner-language output is a different feature with different
    voices (`lola` for Spanish, the English set) and only one is scoped.
17. **Portfolio-level messaging limits make this a multi-tenancy problem.**
    Since October 2025 all numbers in a portfolio share one limit, so one
    careless agency throttles the rest. Argues for a number per agency, which
    also aligns with the 1,000-free-service-messages-per-number allowance.
18. **No MIT licence, no deck, no video plan, no deployed URL in the plan.**
    Each is a mechanical scoring cap under the rule book. Cheap, and easy to
    forget at 10:00 on the 30th.

---

## ✅ Amendments to IDEA-LOCK — approved 2026-09-08

Per instruction: where a lock is illegal or unwinnable, propose the smallest
change and stop. **A1 was the one that could not be implemented as written.**
The rest are smaller.

**All four were approved and are now merged into `docs/IDEA-LOCK.md`.** The
proposals are kept below as the record of what changed and why.

### A1 — Compose desk: `approve → send` becomes `approve → deliver in an open window`

*Reason: unwinnable as written.* Audio cannot be a template, so a voice note can
only be delivered inside an owner-initiated 24h window. No amount of consent
opens that window.

**Current:**
> Compose desk | Corretor speech (ES/EN/PT) → professional PT-BR (or owner
> language) text + audio → approve → send

**Proposed:**
> Compose desk | Corretor speech (ES/EN/PT) → professional PT-BR (or owner
> language) text + audio → approve → **deliver only inside an open,
> owner-initiated WhatsApp window. Never as first contact. In the hackathon MVP,
> delivery is a manual handoff (download or `wa.me`); no automated sender is
> built.**

**Consequential addition to Track A:**
> Track A | "Quanto vale o meu imóvel?" + explicit opt-in → only path for
> automated cadence. **The form terminates in a Click-to-WhatsApp handoff so the
> owner initiates, which opens Meta's 72-hour Free Entry Point window.**

### A2 — Voice: `rafael` becomes conditional on a listen test

*Reason: factual error.* `rafael` is European Portuguese; there is no pt-BR
voice and none on the roadmap.

**Current:**
> Clone | … Hackathon uses stock Voice Agent voice (e.g. `rafael` for PT)

**Proposed:**
> Clone | … Hackathon uses a stock voice. **AssemblyAI's only Portuguese voice
> (`rafael`) is European-accented and must pass a Brazilian listen test before
> being adopted. If it fails, a third-party pt-BR TTS voice is used for the
> composed note, with AssemblyAI retaining STT and the live agent — a path the
> hackathon rules expressly permit, since the Voice Agent API is not
> mandatory.** Drop "neutral" from external claims in favour of a claim the
> chosen voice can carry.

### A3 — Add a disclosure and identification rule

*Reason: not illegal today, but the sector regulator already wrote this rule,
and the mitigation is one sentence of audio.*

COFECI **Resolução 1.551/2025, art. 49** required an AI agent to identify
itself "clara e inequivocamente" as AI, state the responsible corretor's full
name and CRECI number, and offer a visible human-handoff mechanism, with
five-year auditable interaction logs. The resolution was annulled in February
2026 and the annulment held on appeal in September 2026 — but **on
registry-competence grounds having nothing to do with art. 49**, and COFECI
itself argued for selective rather than total invalidation. It is the clearest
available statement of what the profession's regulator expects, and a CRECI-SC
ethics panel can reach the same result today through Res. 326/92 art. 5.

**Proposed new row:**
> Disclosure | Every composed note discloses synthetic voice in the **audio
> itself** (not only in a caption), carries the corretor's full name and CRECI
> number in a **non-editable** block, and offers a human-reply affordance.
> Approvals are logged with timestamps and retained five years. "Soa como você"
> is never used for a stock voice.

### A4 — Correct two API facts

*Reason: wrong as written; costs money and debugging time.*

**Current:**
> - Always `Terminate` realtime sessions.
> - Voice Agent API for the live demo (`Authorization: Bearer` on that product only)

**Proposed:**
> - Always end sessions explicitly: **`session.end` for the Voice Agent API**,
>   `Terminate` for Streaming STT. Never just close the socket — the 30-second
>   resume grace window is billable and an abandoned session bills up to 3 hours.
> - **Auth differs per endpoint and the docs are inconsistent: bare key on
>   `POST /v1/agents` and `GET /v1/sessions`, `Bearer` on `GET /v1/token`.
>   Verify each by hand.**
> - **Use streaming STT, not the pre-recorded endpoint** — the hackathon's
>   sanctioned paths are both real-time.
> - **Deadline is 2026-09-30 at 11:00 EDT**, not end of day.

---

## What happens next

A1–A4 are accepted and merged. Before any application code, in order:

1. **Listen test** on `rafael` with Brazilian listeners (Claim 3).
2. **Greeting-length test** to validate the render path (6a).
3. **Auth header check** on each endpoint by hand (6c).

Those three cost about a day between them and each one can invalidate a
different part of the plan. `recommended-mvp.md` §9 sequences the build after
them.

---

## Sources

**AssemblyAI** (primary, fetched 2026-09-08): docs index `llms.txt`; FAQ "Do you
offer voice-to-voice or text-to-speech (TTS)?"; Voice Agent API voices,
supported languages, greeting, audio format, events reference, browser
integration; pre-recorded supported languages; billing and pricing; data
retention and model training; Pipecat and LiveKit integration guides.

**Meta / WhatsApp**: Business Messaging Policy; Business Terms of Service
(Acceptable Use); Messaging Guidelines; Cloud API audio messages and media
reference; template components; send-messages / service messages; pricing
(incl. the 1 Oct 2026 service-message change and AI Providers); changelog
entries of 16 Oct 2025 (`audio.voice`) and 17 Mar 2026 (`played` webhook);
messaging-limit and quality-rating help pages.

**Brazil**: Lei 13.709/2018 (LGPD) arts. 6, 7 §§3–4 & IX, 9, 10, 11, 18, 33, 37,
41; Lei 15.352/2026 (ANPD as agency); ANPD *Guia Orientativo — Legítimo
Interesse* (2024); ANPD Nota Técnica 23/2025 (biometrics) and Radar Tecnológico
— Biometria; ANPD Telekall Infoservice sanction (2023); Resoluções COFECI
1.065/2007 (+1.402/2017), 458/95 (+1.404/2018), 326/92, 315/91, 492/96, and
1.551/2025 art. 49 (annulled — 21ª Vara Federal Cível/DF 19/02/2026; TRF1
suspension denied Sept 2026); Res. COFECI 1.336/2014 is **AML/COAF, not
advertising**; CRECI-SC fiscalization scope; CONAR Representação 134/23
(Volkswagen / Elis Regina, arquivado 13×7) and the 2026 influencer guide; CDC
arts. 6 III, 7, 14, 25, 30, 31, 35, 37 §§1–3; STJ REsp 1.634.851/SP (voice as
personality right), Súmula 403, and the teoria finalista mitigada line; CC art.
20; TSE Res. 23.610/2019 arts. 9º-B/9º-C as amended by 23.732/2024 and
23.755/2026 (**electoral only**); PL 2338/2023 status (Câmara, awaiting
rapporteur's parecer, no vote before the Oct 2026 elections).

**Hackathon**: lablab.ai AssemblyAI Voice Agent Hackathon event page (Sep 1–30
2026, deadline Sep 30 11:00 EDT, $10k across 5 equal winners, four judging
criteria, two sanctioned technology paths); lablab Hackathon Rule Book and
Submission Guidelines; Terms of Use §§3A, 4C–D, 16; live submissions QuoteReady,
Playtest Pal, Voice Action Gate; prior AssemblyAI event winner write-ups
(DEV.to Aug 2025, SF Sept 2025, NYC Dec 2024).

**Caveats.** No judging weights are published for this event. Meta publishes no
sentence literally banning scraped numbers — the verdict is deductive. ANPD has
issued no guidance specific to real-estate classified ads, and biometric-data
regulation is on its 2025–2026 agenda without a final norm. COFECI art. 49 is
not binding today. No Brazilian precedent exists on AI-voice-product marketing
claims specifically.
