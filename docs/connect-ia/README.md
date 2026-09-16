# Connect IA — Captei (product repo)

Paperwork master copies live in `IntelMuCoCreate/connect-ia/`. This folder tracks **product-side** Connect IA deliverables.

**Deadline:** 20/09/2026 23:59  
**Demo:** https://captei-voz.vercel.app/

## Implementation status

| Item | Status |
|------|--------|
| Omnichannel compose (WA + email + áudio) | ✅ Task 2 — branch local |
| Homepage Captei rebrand | 🔜 Overnight Task 3 |
| Doc sync from IntelMuCoCreate | 🔜 Overnight Task 1 |
| Pitch deck outline | 🔜 Overnight Task 5 |
| Vídeo Connect IA (≤ 3 min) | 👤 Human |
| Entrevistas corretores | 👤 Human |

## Test omnichannel compose

1. `npm run dev` with `.env.local` (`ASSEMBLYAI_API_KEY`, `CORRETOR_*`)
2. Open `/compose/demo`
3. Falar rascunho → **Canais de entrega**: WhatsApp | E-mail | Áudio
4. Aprovar → copiar manualmente (sem auto-send)

## Do not

- Cold WhatsApp automation (`docs/IDEA-LOCK.md`)
- Modify `IntelMuCoCreate/Source/` (AlterEgo — separate track)
