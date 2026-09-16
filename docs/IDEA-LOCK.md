# Captei — idea lock (2026-09-08)

Confirmed in the Truquipoker/Shipaton close-out chat.

> **Amended 2026-09-08 after BMAD stress-test.** Amendments A1–A4 approved by
> the human. Rationale and evidence in `docs/bmad/stress-test.md`. A1 was not a
> preference — the original wording was not implementable.

## Product

| Layer | Rule |
|--------|------|
| Track A | “Quanto vale o meu imóvel?” + explicit opt-in → only path for automated cadence. **The form terminates in a Click-to-WhatsApp handoff so the owner initiates, opening Meta’s 72-hour Free Entry Point window** |
| Track B | Public-signal worklist → human first contact (call / portal form). No WhatsApp automation. **No voice note, ever, by any mechanism** |
| Compose desk | Corretor speech (ES/EN/PT) → professional PT-BR (or owner language) text + audio → approve → **deliver only inside an open, owner-initiated WhatsApp window. Never as first contact.** MVP delivery is manual handoff (download or `wa.me`); no automated sender is built |
| Live qualify | AssemblyAI Voice Agent after consent exists. Owner language is selected on the desk (PT / ES / EN); greeting, STT `language_codes`, system prompt and stock voice match that pick |
| Clone | Out of MVP. ElevenLabs + corretor consent later. MVP uses **stock** Voice Agent voices matched to language: **`rafael`** (PT), **`lola`** (ES), **`michael`** (EN, US) — compose and live qualify. Docs list `rafael` as 🇵🇹; **listen test 2026-09-09 (project owner, Brazilian ear): sounded Brazilian, not European.** Never claim “soa como você” on a stock voice. |
| Disclosure | Every composed note discloses synthetic voice **in the audio itself**, carries the corretor’s full name and CRECI number in a **non-editable** block, and offers a human-reply affordance. Approvals logged with timestamps, retained 5 years. **“Soa como você” is never used for a stock voice** |

**Why “send” became “deliver in an open window”.** AUDIO is not a supported
WhatsApp template header type, and templates are the only message type
permitted outside a service window. Audio is therefore free-form-only, and the
window opens solely on an inbound message or call from the owner. Consent does
not open it. This is mechanical, not cautious.

**Claims that must not be made:** “soa como você” on a stock voice (CDC art. 37
§1, strict liability), “100% em conformidade com a LGPD”, and any published
conversion figure (CDC art. 30 makes the offer a binding contractual term).

## AssemblyAI (adapter atual)

- STT: Universal-3.5 Pro (`speech_model` realtime singular / `speech_models` pre-recorded array). Languages: `pt`, `es`, `en`, code-switch. Recognises Brazilian Portuguese as a dialect without a dialect code.
- **Use streaming STT, not the pre-recorded endpoint** for live compose.
- Voice Agent API for the live demo. **Auth differs per endpoint and the docs are inconsistent: bare key on `POST /v1/agents` and `GET /v1/sessions`, `Bearer` on `GET /v1/token`. Verify each by hand before writing a client.**
- Never put the API key in the browser. Temp token server-side. **A server is therefore mandatory — there is no browser-only configuration.**
- **End sessions explicitly: `session.end` for the Voice Agent API, `Terminate` for Streaming STT.** Never just close the socket — the 30-second resume grace window is billable and an abandoned session bills up to 3 hours.
- **AssemblyAI sells no standalone TTS.** Synthesis exists only inside the Voice Agent pipeline. Render approved text verbatim via the inline `greeting` field, which is documented as bypassing the LLM and going straight to TTS word for word.
- Fetch `https://www.assemblyai.com/docs/llms.txt` before writing API code.

## Adjacent Captei stack (do not import blindly)

- CRM / Fechou: `C:\Users\Admin\Projects\CRM`
- Captação strategy + legal: `CRM/docs/captacao/`
- Prince (speed-to-lead): `C:\Users\Admin\Projects\Prince`
- Divulga: `C:\Users\Admin\Projects\Divulga`

## Histórico

Contest lablab / AssemblyAI (não submetido): `docs/archive/hackathon-2026/contest.md`.
