---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - README.md
  - docs/IDEA-LOCK.md
  - CRM/docs/captacao/01-strategy.md
  - CRM/docs/captacao/02-legal-constraints.md
  - AssemblyAI docs (llms.txt fetched 2026-09-08)
date: 2026-09-08
author: BMAD analyst pass (single-pass mode)
workflow: _bmad/bmm/workflows/1-analysis/create-product-brief (CRM install)
status: DRAFT — awaiting human approval on the IDEA-LOCK amendments in stress-test.md
---

# Product Brief: Captei Voz

> **How this was produced.** The BMAD `create-product-brief` workflow is normally
> collaborative, halting at an A/P/C menu after every section. This run was
> executed in single-pass mode because `docs/IDEA-LOCK.md` already encodes the
> decisions those menus exist to extract, and the standing instruction is to
> *challenge* the lock rather than reopen it. Every place where a real
> elicitation round would have been required is marked
> **[ASSUMPTION — confirm]**. Those are the only questions actually being put
> back to the human.

---

## Executive Summary

Captei Voz is a **compose desk for the voice note a corretor was already going
to send.** The corretor speaks a rough, unstructured note in Portuguese,
Spanish or English. Captei Voz transcribes it, rewrites it into professional
neutral Brazilian Portuguese, renders it as an audio note in a consistent
studio voice, and shows both the text and the audio to the corretor for
**approval before anything leaves the building**. It only ever targets property
owners who are already on a consent record.

The insight is narrow and specific to this market: in Brazilian real estate the
WhatsApp voice note is not a fallback channel, it is *the* channel. A corretor
who is persuasive in person routinely loses a captação because the three-minute
rambling voice note they sent at 21:40 sounded disorganised, regionally marked,
or simply too long to listen to. The corretor's problem is not that they lack
words. It is that the first take goes out unedited, because WhatsApp offers no
second take.

Captei Voz inserts the second take. It is a **draft-and-approve buffer on an
unbuffered channel**, and the approval step is simultaneously the product's
quality feature and its entire legal defence.

**What this brief does not claim.** Three of the mechanics assumed by
`IDEA-LOCK.md` do not survive verification against vendor documentation, and one
of them is load-bearing. See `stress-test.md`. This brief describes the product
as it can actually be built; the deltas from the lock are itemised there and
require sign-off.

---

## Core Vision

### Problem Statement

A corretor de imóveis in Florianópolis conducts most of their captação and
client relationship through WhatsApp voice notes. That channel has three
properties that work against them at once:

1. **It is unbuffered.** There is no draft state. You hold the button, you
   speak, you release, it is delivered. The corretor's worst take and only take
   are the same take.
2. **It is unstructured.** A note that should be four sentences —
   who I am, which property, what I can do for you, what I want next — arrives
   as two minutes of self-interruption, with the actual proposal at 1:40.
3. **It is monolingual in practice.** Florianópolis captação increasingly
   involves Spanish-speaking (Argentine, Uruguayan, Paraguayan) and
   English-speaking counterparties. A corretor fluent in speech but not in
   register switches into a language they handle less well and immediately
   sounds less competent than they are.

The corretor is therefore choosing, on every single outbound note, between
speed and professionalism. Today they pick speed, because the alternative is
typing — and typing a long message on a phone between property visits is worse
than sending a mediocre voice note.

### Problem Impact

The unit of loss is a **captação**: an exclusive or non-exclusive mandate to
sell a property. In the Norte da Ilha territory the strategy document
prioritises — Canasvieiras, Ingleses, Cachoeira do Bom Jesus, Jurerê — a single
captação is worth a commission measured in tens of thousands of reais. The
corretor does not lose these on price or on market knowledge. They lose them on
the first ninety seconds of contact, against a competitor whose first contact
happened to be tidier.

Secondary impacts, in descending order of how much anyone actually complains
about them:

- **Owner-side attrition.** A long, rambling first note from an unknown number
  gets abandoned mid-playback. There is no second impression.
- **Brand inconsistency at the agency.** Every corretor sounds like a different
  company. The gestor has no lever on outbound quality because there is no
  artefact to review — the message is gone before anyone else sees it.
- **Foreign-language leads quietly deprioritised.** Corretores route around
  what they are not fluent in. The lead is not lost visibly; it is simply
  never followed up as hard.

### Why Existing Solutions Fall Short

| What exists today | Why it does not solve this |
|---|---|
| Recording the note again, manually | The corretor is between visits. Take two is rare; take three does not happen. This is the real incumbent, and it loses on friction. |
| Typing the message instead | Slower than speaking, and it discards the warmth that makes voice work in this market. Converts a voice-native seller into a worse writer. |
| Generic AI writing assistants (ChatGPT and similar) | Text in, text out. They do not close the loop back to *audio*, so the corretor still has to read the polished text aloud — reintroducing exactly the delivery problem, now with stilted read-aloud phrasing on top. |
| WhatsApp Business quick replies / saved templates | Static, visibly canned, and text-only. Useless for anything property-specific, which is everything that matters in captação. |
| Generic voice-note transcription tools | Solve the listener's problem (I don't want to listen), not the sender's problem (I don't want to sound like this). |
| CRM bulk-cadence tools with WhatsApp automation | Solve a different problem, and solve it illegally for cold owners — see `02-legal-constraints.md`. The channel-ban risk is carried by the same number that holds the agency's real client conversations. |

The gap is consistent: **nothing gives a voice-first seller a voice-first draft
state.** Everything either keeps them in voice with no editing, or moves them to
text and abandons the channel that works.

### Proposed Solution

Two surfaces, sharing one consent spine.

**1. The compose desk** — the product.

The corretor opens a property, taps the mic, and talks the way they already
talk. Captei Voz then:

- transcribes the note with AssemblyAI Universal-3.5 Pro, which handles
  Portuguese, Spanish and English with native code-switching, and explicitly
  models Brazilian Portuguese as a dialect rather than as generic Portuguese;
- rewrites it to a chosen **register and target language** — not a translation
  and not a summary, a register transfer: same intent, same specifics,
  professional structure, ~35 seconds instead of ~2 minutes;
- renders the approved text to audio in one consistent stock voice, verbatim;
- presents text and audio side by side with the original, and **holds**.

Nothing sends. The corretor reads, listens, edits the text if they want,
re-renders, and presses send — or discards. The approval event is recorded
against the property and the contact.

**2. Consented live qualify** — the proof that the spine is real.

When an owner has already raised their hand through the "Quanto vale o meu
imóvel?" appraisal funnel, an AssemblyAI Voice Agent session conducts the
qualification conversation: confirms the property, purpose, timeline and
expectation, and writes the result back. This is a genuine bidirectional voice
agent with tools, and it exists in the product precisely because it is the one
place a live agent is defensible — the owner initiated, the consent is on file.

**The spine.** Both surfaces read from the same consent record and neither can
address a contact that lacks one. That constraint is not a policy document, it
is a `NOT NULL` column inherited from the CRM (`consent_source`, `consent_at`),
and it is why the compose desk cannot be pointed at a scraped number even by
mistake.

### Key Differentiators

1. **Voice in, voice out, with a human gate in the middle.** The competitive
   set either removes the human (automation, which is banned here) or removes
   the voice (text assistants, which abandon the channel). Holding both is the
   product.
2. **Register transfer, not translation.** The valuable transformation is
   `rough spoken PT/ES/EN → professional written pt-BR → spoken pt-BR`. The
   hard part is the middle arrow, and it is a real-estate-specific,
   Brazil-specific problem: the output has to sound like a competent Brazilian
   professional, not like a translated brochure.
3. **Compliance as a feature the buyer can see.** Every other captação tool in
   this space sells reach. Reach is what gets the WABA number banned. Captei
   Voz sells the opposite and can prove it: an approval log, a consent
   provenance trail, and a hard architectural refusal to send first contact.
   The gestor buying this is buying insurance.
4. **It composes with an existing stack rather than replacing one.** Divulga
   publishes the appraisal offer, Prince answers in seconds, Fechou holds the
   contact, Captei Voz composes the outbound. No new orchestrator, no new
   subscription, no n8n.
5. **Territorial and vertical specificity.** "Neutral professional Portuguese
   for Norte da Ilha real estate" is a defensible niche. A general-purpose voice
   rewriter is not.

**The honest counter-case.** The core transformation is a transcribe → LLM →
speak chain, and none of those three links is proprietary. The moat is not the
pipeline; it is the consent spine, the CRM integration, and the domain-tuned
rewrite. Anyone claiming the pipeline itself is defensible is wrong, and the
brief should not pretend otherwise. **[ASSUMPTION — confirm]** that the intended
moat is distribution-and-integration rather than technology.

---

## Target Users

### Primary — Rafael, corretor associado, 34, Norte da Ilha

**Situation.** CRECI-SC registered, associated with a mid-size agency, works
Canasvieiras and Ingleses. Six to ten property visits a week. Lives in the car
and in WhatsApp. Between 40 and 60 voice notes sent per day across owners,
buyers and colleagues.

**Capability profile.** Excellent in person — reads a room, closes. Writes
poorly and knows it: his written messages are short and blunt because anything
longer exposes spelling and register problems. Functional but not confident
Spanish, which matters because a third of his buyer-side traffic in high season
is Argentine.

**What he actually feels.** Not "I wish I sounded more professional." What he
feels is *the specific memory of a captação he lost to a competitor* and a
suspicion that his first message was the reason. He is status-sensitive about
sounding unpolished and will not describe this as his problem out loud.

**Why he adopts.** It is faster than his current workaround (re-record) and
removes a fear he has not admitted. Not because it is AI.

**Why he churns.** If it takes more than about fifteen seconds from release-mic
to ready-to-send, he stops opening it. If the output sounds robotic or foreign,
he decides it makes him look worse than his own rough note did — and he is
right, and he will not come back.

**Journey.** Leaves a property in Ingleses → opens the property record → holds
mic, talks 90 seconds about what he saw and what he can do → gets back 35
seconds of clean audio plus the text → skims the text, fixes the price he
misspoke → sends → the approval is logged against the property.

### Secondary — Juliana, gestora / broker responsável, 46

**Situation.** Runs the agency. Holds the CRECI-PJ registration and, critically,
**owns the WABA phone number** that every corretor's conversations run through.

**What she actually feels.** Two things, and they are both fear rather than
ambition. First, she cannot see or influence outbound quality — she finds out
what her team said only when it goes wrong. Second, she has heard about numbers
being restricted and does not fully understand her exposure.

**Why she buys.** The approval log and the consent trail. She is the economic
buyer and she is buying governance, not eloquence. **[ASSUMPTION — confirm]**
that the gestora is the buyer and the corretor is the user; pricing and
onboarding depend entirely on this and it is currently unstated in IDEA-LOCK.

**Why she blocks.** If the tool can be pointed at a purchased list, she will not
sign — she recognises that as her number's death warrant. The product's refusal
to do that has to be visible to her in the first demo, not buried in docs.

### Third party, not a user — the proprietário

**Never logs in. Determines whether the product works.**

Receives a voice note about their own property. Their reaction is the only real
metric. Three things get the note discarded:

- an accent that reads as *foreign* — this market treats European Portuguese as
  audibly not-from-here, and telemarketing has trained everyone to hang up on
  it;
- a delivery that reads as *synthetic* — uncanny, over-smooth, no breath;
- **finding out later that it was synthetic and not being told.** This is the
  reputational tail risk of the entire product, and it lands on the corretor and
  the agency, not on the vendor.

Design consequence, and it is not optional: **the note discloses that it was
composed with AI assistance and approved by a named corretor with their CRECI
number.** Disclosure is treated here as a product requirement rather than a
legal minimum, because the failure mode it prevents is commercial. See
`stress-test.md` for the legal analysis.

---

## Success Metrics

### The one that decides everything

**Owner-side playback completion rate** on Captei-composed notes versus the
corretor's own raw notes. If owners do not listen to the end, nothing else in
this document matters. Everything else is a proxy.

### Product metrics

| Metric | Target | Why this number |
|---|---|---|
| Mic-release → previewable draft | < 15 s p50, < 30 s p95 | Rafael's attention budget. Above this he reverts to raw notes. Note that audio rendering runs at roughly playback speed, so a 35 s note costs ~35 s of render — this budget is tight and is a real design constraint, not a nicety. |
| Approval rate without text edits | > 60 % | Measures rewrite quality. Below this the corretor is doing the work anyway. |
| Discard rate | < 10 % | Above this the rewrite is actively wrong. |
| Send rate of previewed drafts | > 80 % | Drafted-but-not-sent means the output is not trusted. |
| Owner playback completion | ≥ 1.5× the raw-note baseline | The point of the product. Requires baseline instrumentation first. Measurable once delivery exists: WhatsApp emits a `played` webhook on first playback of a voice message, so this is a real instrument rather than a proxy. |
| Transcription accuracy, pt-BR field audio | qualitative pass, in-car noise | Real conditions include road noise and wind. |

### Business objectives

| Objective | Measure |
|---|---|
| Captação win rate | Mandates signed / first contacts made, versus pre-adoption baseline |
| Corretor retention of the habit | Weekly active corretores at week 4 ≥ 50 % of week 1 |
| Governance value delivered | 100 % of outbound composed notes carry an approval record and a consent reference |
| Channel safety | Zero WABA quality-rating downgrades attributable to composed notes |

### Anti-metrics — deliberately not optimised

- **Volume of notes sent.** Optimising this converts the product into the thing
  that gets the number banned. It is not a growth metric here; a sharp rise is
  an incident to investigate.
- **Contacts reached.** Same reason. Reach is the competitor's metric.

### Hackathon-specific success (deadline 2026-09-30, 11:00 EDT)

Separate from product success and should not be confused with it: a judge
watching a four-minute video believes (a) this is a real voice agent, (b) it
solves a real problem for a real person, and (c) AssemblyAI is doing the
load-bearing work rather than being name-checked. Note that two of the four
judging criteria are business and pitch criteria, so the deck and the video
carry as much weight as the build. See `stress-test.md` claim 4.

---

## MVP Scope

### Core Features

1. **Compose desk.** Mic capture → AssemblyAI STT (pt/es/en, code-switching) →
   register-and-language rewrite → verbatim audio render → side-by-side review
   of original, text and audio → editable text → re-render → explicit approve.
2. **Approval and provenance record.** Who approved, when, which property,
   which consent record, original transcript and final text retained. This is
   the artefact the gestora buys and the artefact that defends the send.
3. **Consent gate.** The compose desk cannot resolve a destination that has no
   `consent_source` / `consent_at`. Enforced at the query layer, not in the UI.
4. **Consented live qualify.** A Voice Agent session, browser-delivered via a
   server-minted temporary token, for owners who came through the appraisal
   funnel. Tool-calling writes the qualification result back.
5. **AI-assistance disclosure**, carried in both the audio and the text, with
   the corretor's name and CRECI.

### Out of Scope for MVP

Explicitly, and each for a stated reason:

- **Sending to Track B / portal-sourced numbers.** Prohibited. Not a
  prioritisation call.
- **Any automated cadence or sequence.** Track C, gated on consent, later.
- **Voice cloning of the corretor.** Out of the hackathon by lock, and
  additionally impossible with AssemblyAI, which offers no cloning API. A later
  Captei upsell on a different vendor, with corretor consent and a distinct
  legal analysis.
- **Portal scraping, discovery, and signal scoring.** Belongs to the CRM's
  Epic 12, needs Epic 3 first, and is not needed to prove this product.
- **Owner-side inbound handling and full WhatsApp inbox.** CRM Epic 6.
- **Multi-tenant billing, RBAC, agency onboarding.** Needs CRM Epic 2.
- **Anything from Shipaton / Play / RevenueCat.** Closed. Not in this repo.

### MVP Success Criteria

The MVP is validated if, with one pilot agency:

1. A corretor composes and sends at least twenty notes across two weeks
   without being asked to.
2. At least 60 % of those go out with no text editing.
3. At least one owner conversation demonstrably continues after a composed
   note, and the corretor attributes it to the note.
4. The gestora can pull the approval log unprompted and finds it sufficient.
5. Zero sends to a contact without consent — verified in the data, not asserted.

Failing 1 means it is too slow. Failing 2 means the rewrite is wrong. Failing 3
means the accent or delivery is wrong. Failing 5 means the gate leaks and the
product should be stopped.

### Future Vision

- **Corretor voice clone** as a paid upsell, on a vendor that supports it, with
  recorded consent and a revocation path.
- **Owner-language output** for the Spanish- and English-speaking
  counterparties Florianópolis actually has.
- **Composed-note templates per captação stage**, learned from what actually
  gets replies.
- **Feeding the CRM's captação epic** once Track A volume justifies Track B
  discovery — the worklist becomes the compose desk's queue, still with a human
  making first contact by phone.
- **Register transfer as the platform primitive** across Prince and Divulga:
  the same rough-in / polished-out gate for any outbound channel.

---

## Open Questions Requiring Human Input

These are the elicitation rounds that single-pass mode skipped. They are not
blockers for the stress-test verdicts, but they are blockers for a PRD.

> **Resolved 2026-09-08: the project owner holds a CRECI of their own.** That
> changes three things and all of them are favourable. The primary persona is
> not a researched invention — it is the builder, which is the strongest
> position to design a professional tool from. The mandatory identification
> block has a real registration behind it, so the demo shows a genuine licensed
> corretor approving genuine messages rather than a fabricated persona. And it
> partially answers item 2 below: there is a first corretor. The CRECI number
> itself belongs in the verified-profile record or environment config, **never
> committed to the repo**.

1. **Buyer vs. user.** Is the gestora the economic buyer? Pricing, onboarding
   and the entire governance framing depend on it. Note that a CRECI-holding
   founder may be tempted to build for themselves and skip this question; the
   governance features that make the product sellable are bought by the gestora,
   not by the corretor.
2. **Pilot agency.** Beyond the founder — which agency, and do they already run
   appraisal-request traffic? `01-strategy.md` open question 1 is still open,
   and Track A's value depends on the answer.
3. **Whose WABA number** carries composed notes during the pilot — the agency's
   production number or a dedicated one? Testing on the production number puts
   the agency's live client conversations at risk.
4. **Baseline instrumentation.** Owner playback completion is the deciding
   metric and there is no baseline for raw notes. Can the pilot agency provide
   one, or is the metric aspirational?
5. **Disclosure wording.** The AI-assistance disclosure has to be acceptable to
   the gestora commercially as well as defensible legally. Who signs off?

---

## Related Documents

- `docs/IDEA-LOCK.md` — the decisions this brief was built on
- `docs/bmad/stress-test.md` — verdicts on the six claims, and the amendments
  this brief already assumes
- `docs/bmad/recommended-mvp.md` — stack and file plan for after approval
- `CRM/docs/captacao/01-strategy.md`, `02-legal-constraints.md` — the legal rails
