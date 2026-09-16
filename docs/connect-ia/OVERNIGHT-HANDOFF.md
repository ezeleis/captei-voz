# Overnight handoff — 2026-09-16

## Completed

- [x] Verified Task 2 (omnichannel compose) on `feature/connect-ia-omnichannel` (`b2382d4`) — `lib/assemblyai/rewrite-omnichannel.ts`, `lib/compose/channels.ts`, tabs WhatsApp | E-mail | Áudio, `POST /api/rewrite` returns `whatsappText` / `emailSubject` / `emailBody`
- [x] Task 6b — positioning captação-led: `docs/connect-ia/inscricao/formulario-respostas.md`, `docs/connect-ia/inscricao/video-roteiro.md`, `docs/connect-ia/proposta/one-pager.md`
- [x] Task 3 — homepage rebrand: `app/page.tsx`, `app/components/SiteHeader.tsx`, `app/layout.tsx`
- [x] Task 8 — `/connect-ia` info page: `app/connect-ia/page.tsx`
- [x] Task 10 — provider scaffold: `lib/providers/types.ts`, `docs/architecture/providers.md`, comment in `lib/assemblyai/rewrite.ts`
- [x] Task 1 — Connect IA pack already in `docs/connect-ia/`; README checklist updated
- [x] Task 4 — `docs/connect-ia/diagram-export.md` + `public/connect-ia-architecture.svg`
- [x] Task 5 — `docs/connect-ia/pitch-deck-outline.md`
- [x] Task 6 — one-pager stage: ✅ Mesa multicanal (WA + e-mail + áudio)

## Positioning applied

- [x] formulario-respostas.md — one-liner §0.1, segmento PropTech B2B, hierarquia de dor, linha de ampliação
- [x] video-roteiro.md — captação → outbound → qualificação; ampliação ~1:15; sem disparo frio
- [x] one-pager.md — problema/solução/estágio alinhados
- [x] homepage — Captei · captação e qualificação · três cards

## Provider scaffold

- [x] lib/providers/types.ts — `SttProvider`, `LlmRewriter`, `TtsRenderer`, `VoiceAgentProvider`
- [x] docs/architecture/providers.md — diagrama + env documentado (`CAPTEI_STT_PROVIDER=assemblyai`)
- [x] AssemblyAI calls **not** refactored into adapters (zero-regression)

## Verified

- [x] `npm run typecheck` exit 0
- [x] `npm run build` exit 0 (includes `/`, `/connect-ia`, `/compose/[propertyId]`)
- [x] Local `/` — Captei hero + three cards + footer (desktop and ~390px)
- [x] Local `/compose/demo` — Mesa multicanal loaded (tabs appear after rewrite; no API key in this env)
- [x] Local `/connect-ia` — pitch + links
- [x] Local `/qualify/demo` — no header regression
- [ ] Production https://captei-voz.vercel.app/ still serves the **old** homepage (`Captei Voz`); `/connect-ia` is 404 until this branch deploys

## Blocked

- [x] `IntelMuCoCreate/connect-ia/` — **not mounted** in this cloud workspace (only `captei-voz`). Positioning was applied to `docs/connect-ia/` (canonical per README). Human: copy the same files onto `connect-ia-captei-pivot` if that repo still needs a commit. Do not touch `IntelMuCoCreate/Source/` or `CMakeLists.txt`.
- [x] Vercel deploy — no Vercel CLI token / project link in this environment. Push to `origin` should trigger auto-deploy **if** the GitHub ↔ Vercel project is still connected. Human: open https://captei-voz.vercel.app/compose/demo and confirm three tabs after merge/deploy.
- [x] Interviews / integrante 2 / video recording — human-only (see morning list).
- [x] Secrets — `.env.local` not present here (`ASSEMBLYAI_API_KEY`, `CORRETOR_FULL_NAME`, `CORRETOR_CRECI`). Local demo of rewrite/TTS needs those; pages still render.

## Human morning (ordered)

1. Entrevistas: `docs/connect-ia/proposta/entrevistas-corretores.md` (2+ corretores)
2. Insert quote → `docs/connect-ia/inscricao/video-roteiro.md`
3. Record video ≤ 3 min (face + screen demo + diagram). Beats: `docs/connect-ia/diagram-export.md`
4. Confirm integrante 2 → `docs/connect-ia/inscricao/formulario-respostas.md`
5. Submit https://forms.gle/LSNnsPoCuKFNpdJY7 before **20/09/2026 23:59**
6. Review PR into `feature/connect-ia-omnichannel`; merge if OK. Then merge that branch to `main` when ready to ship the demo.

## Git

- Base branch: `feature/connect-ia-omnichannel` (Task 2 at `b2382d4`; docs pack at `ae42af6`)
- Working branch: `cursor/connect-ia-submission-edb4`
- Commits:
  - `05deb65` docs(connect-ia): apply captação-led positioning to form and video script
  - `1065013` feat(home): rebrand Captei as captação e qualificação copilot
  - `23905b3` docs(architecture): scaffold multi-provider adapter pattern
  - `c03a156` docs(connect-ia): sync submission pack and overnight handoff

## Deploy URL

- Intended: https://captei-voz.vercel.app/
- Compose (three tabs): https://captei-voz.vercel.app/compose/demo
- Qualify: https://captei-voz.vercel.app/qualify/demo
- Connect IA page (this PR): https://captei-voz.vercel.app/connect-ia
- Architecture SVG: https://captei-voz.vercel.app/connect-ia-architecture.svg
- This cloud agent could not confirm the production deploy.

## Env vars required for demo

| Name | Where | Notes |
|------|--------|--------|
| `ASSEMBLYAI_API_KEY` | server only | STT token, Voice Agent token, LLM Gateway |
| `CORRETOR_FULL_NAME` | server | CRECI block |
| `CORRETOR_CRECI` | server | CRECI block |
| `PUBLIC_APP_URL` | server | public base URL |
| `DATABASE_URL` | server | optional for demo (`/qualify/demo` and `/compose/demo` use seeded consent) |
| `QUALIFY_AGENT_ID` | server | optional; inline config if unset |
| `CAPTEI_STT_PROVIDER` etc. | — | **documented only**, not wired |

Never commit secrets. Never put the API key in client-side code.
