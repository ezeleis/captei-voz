# Overnight Cloud Agent — Captei Connect IA (detailed)

**Paste this entire file into a Cursor Cloud Agent.**

> **Single-repo mode (GitHub cloud):** You are in **`captei-voz`** only. All paperwork lives under **`docs/connect-ia/`** at repo root. Ignore any `IntelMuCoCreate/` or `CRM/` paths — legal context is in `docs/IDEA-LOCK.md` and `docs/bmad/stress-test.md`.

---

## 0. Executive summary

| Field | Value |
|-------|--------|
| **Mission** | Finish Connect IA submission prep for **Captei** (captação-led omnichannel AI) |
| **Deadline** | Connect IA form + video: **20/09/2026 23:59** |
| **Secondary** | AssemblyAI hackathon **30/09/2026 11:00 EDT** (same repo, separate video) |
| **Repo (this workspace)** | `captei-voz` — product + paperwork |
| **Paperwork path** | `docs/connect-ia/` |
| **Git branch** | `feature/connect-ia-omnichannel` — Task 2 already committed (`b2382d4`) |
| **Out of scope** | Other repos (AlterEgo/MucoCreate audio plugin) — not in this clone |

**Task 2 (omnichannel compose) is DONE.** Verify build; skip section 4 unless regression found.

---

## 0.1 Product positioning (mandatory — apply to all copy)

**Strategy: captação-led, outreach + qualification-wide.**

Do **not** position as generic “CRM imobiliário” or “ferramenta de voz”. Do **not** position as ultra-narrow “só scraping FSBO”.

### One-liner (use everywhere)

> **Captei** — copiloto de IA para **captação e qualificação** de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado.

### Pain hierarchy (form + video + homepage — this order)

1. **Beachhead:** **Captação** = where agencies win or lose money (mandatos exclusivos).
2. **Daily friction:** Corretores lose deals on **bad outbound** — messy voice notes, weak follow-up across channels.
3. **Qualification gap:** Opted-in owners (“Quanto vale meu imóvel?”) need **instant, professional** response in PT/ES/EN.
4. **Platform fear:** Wrong automation **bans the WABA number** — agencies need governance, not spam bots.

### Form segment label

**PropTech B2B — captação e qualificação imobiliária (outreach omnichannel)**

### Say / avoid

| ✅ Say | ❌ Avoid |
|--------|----------|
| Copiloto de captação e qualificação | CRM completo |
| Outbound omnichannel com aprovação humana | Agente autônomo que prospecta sozinho |
| Do primeiro contato consentido ao follow-up | Automatizar WhatsApp para listas de portal |
| Imobiliárias 3–10 corretores, FLN beachhead | “Wrapper de AssemblyAI” as headline |

### Safe broadening line (video + form)

> “Começamos pela **captação** — o gargalo mais caro — mas a mesma mesa serve qualquer outbound qualificado: qualificação de lead, retorno a proprietário, follow-up entre canais.”

### Dual-track naming (same repo, different pitches)

| Program | Headline emphasis |
|---------|-------------------|
| **Connect IA** | Captei — captação + qualificação + omnichannel + MRR |
| **AssemblyAI hackathon** | Captei Voz — voice agent + compose desk (sponsor tech) |

**Apply positioning updates to these files:**

- `docs/connect-ia/inscricao/formulario-respostas.md`
- `docs/connect-ia/inscricao/video-roteiro.md` (opening + problem block)
- `docs/connect-ia/proposta/one-pager.md`
- `app/page.tsx` (homepage)
- `docs/connect-ia/pitch-deck-outline.md` (when created)

---

## 0.2 Provider abstraction addendum (scaffold only — do not break demo)

AssemblyAI is the **current adapter** (hackathon + demo). Captei must **not** read as permanently locked to one vendor.

**After Task 3 (homepage), execute Task 10:**

1. Create `captei-voz/lib/providers/types.ts` — interfaces only:

```typescript
// Conceptual — implement cleanly in TypeScript
export interface SttProvider { /* streaming transcribe */ }
export interface LlmRewriter { rewriteOmnichannel(...): Promise<OmnichannelDraft> }
export interface TtsRenderer { renderSpeech(text, voiceRef): Promise<AudioBuffer> }
export interface VoiceAgentProvider { /* live qualify session */ }
```

2. Create `captei-voz/docs/architecture/providers.md`:
   - Diagram: `compose/` + `consent/` (vendor-neutral) → `providers/*` adapters
   - **Today:** `lib/assemblyai/*` = default adapter
   - **Post-hackathon:** ElevenLabs (clone/TTS per IDEA-LOCK), optional OpenAI/Anthropic for rewrite
   - Env pattern: `CAPTEI_STT_PROVIDER=assemblyai` (document only; do not wire multi-provider routing tonight unless trivial)

3. **Do NOT** refactor working AssemblyAI calls into adapters tonight unless zero regression risk.
4. **Do NOT** add ElevenLabs SDK or new API keys tonight.
5. Connect IA pitch line: *“Stack multi-provedor; AssemblyAI na demo atual.”*

---

## 1. Preconditions

### 1.1 Verify Task 2 complete

```bash
git checkout feature/connect-ia-omnichannel
git status
git log -1 --oneline   # expect b2382d4 or later
```

Check files exist:

- `lib/assemblyai/rewrite-omnichannel.ts`
- `lib/assemblyai/rewrite-shared.ts`
- `lib/compose/channels.ts`
- `app/compose/[propertyId]/ComposeDesk.tsx` — tabs WhatsApp | E-mail | Áudio
- `app/api/rewrite/route.ts` — returns `whatsappText`, `emailSubject`, `emailBody`

Run:

```powershell
npm run typecheck
npm run build
```

Both must pass before other tasks.

### 1.2 Branch

```bash
git checkout feature/connect-ia-omnichannel
```

### 1.3 Environment

- `.env.local`: `ASSEMBLYAI_API_KEY`, `CORRETOR_FULL_NAME`, `CORRETOR_CRECI`
- Never commit secrets
- Deploy target: Vercel (`captei-voz.vercel.app`)

### 1.4 Legal guardrails (read before coding)

| File | Rule |
|------|------|
| `docs/IDEA-LOCK.md` | No cold WA; manual handoff only in MVP |
| `docs/bmad/stress-test.md` | Amendments A1–A4 approved; Track A/B legal |
| `docs/connect-ia/proposta/arquitetura-omnichannel.md` | Compliance levels |

**Never implement:** automated sender to scraped numbers, bulk portal scrape, WABA cold templates.

### 1.5 IP awareness (docs only — no code)

Pre-kick-off assets (before **07/10/2026**) stay with founders if inventoried. Program-generated IP may require SINOVA/UFSC licensing. Reference: `docs/connect-ia/programa/propriedade-intelectual.md`.

---

## 2. Task priority queue

| Priority | Task | Est. | Owner |
|----------|------|------|-------|
| P0 | Verify Task 2 + build | 15m | Agent |
| P1 | **Task 6b** — Apply positioning to form/video/one-pager | 30m | Agent |
| P1 | Task 3 — Homepage rebrand (positioning §0.1) | 45m | Agent |
| P1 | Task 10 — Provider scaffold (§0.2) | 30m | Agent |
| — | Task 1 — Sync docs | **SKIP** | Already in `docs/connect-ia/` |
| P2 | Task 4 — Diagram export asset | 30m | Agent |
| P2 | Task 5 — Pitch deck outline (positioning §0.1) | 45m | Agent |
| P2 | Task 6 — Update one-pager stage checkboxes | 15m | Agent |
| P3 | Task 7 — Deploy Vercel if creds | 20m | Agent |
| P3 | Task 8 — `/connect-ia` info page | 45m | Agent |
| **Required** | Task 9 — OVERNIGHT-HANDOFF.md | 15m | Agent |

Skip P3 if time runs out; never skip Task 9, Task 6b, or Task 10.

---

## 3. Task 1 — Sync Connect IA docs (**SKIP**)

Full tree already at `docs/connect-ia/`. Verify files present; update `docs/connect-ia/README.md` checklist only.

---

## 4. Task 2 — Omnichannel compose (SKIP unless regression)

Already implemented on `feature/connect-ia-omnichannel`. Only re-implement if files missing or build fails.

<details>
<summary>Reference spec (if rebuild needed)</summary>

### 4.1 API `POST /api/rewrite`

Request: `{ "transcript", "outputLang", "propertyLabel" }`

Response: `{ rewritten, whatsappText, emailSubject, emailBody, finalSpoken, identity, outputLang }`

### 4.2 UI tabs: WhatsApp | E-mail | Áudio

### 4.3 Page title: “Mesa multicanal”

</details>

---

## 5. Task 3 — Homepage rebrand

Files: `app/page.tsx`, `app/components/SiteHeader.tsx`

### Copy (must match §0.1 positioning)

- Product name: **Captei**
- Hero: copiloto de IA para **captação e qualificação** — WhatsApp, e-mail e voz
- Subline: compliance-first; aprovação humana; sem disparo frio
- Optional third line: “Começamos pelo mandato; a mesa serve todo outbound qualificado.”

### Three cards

1. **Qualificação ao vivo** → `/qualify/demo`
2. **Mesa multicanal** → `/compose/demo`
3. **Connect IA** (optional) → `/connect-ia` if Task 8 done

Keep Tailwind tokens (tide/clay/foam — Florianópolis desk aesthetic).

Footer: `Pré-incubação Connect IA · InPETU UFSC · Florianópolis`

---

## 6. Task 4 — Diagram for video slide

Source: `docs/connect-ia/proposta/arquitetura-omnichannel.md`

Create `docs/connect-ia/diagram-export.md`:

1. Mermaid block (copy)
2. ASCII fallback for screenshot
3. Video beats for 45s IA block (timing aligned to `video-roteiro.md`)

Optional: `public/connect-ia-architecture.svg` if clean without heavy deps.

---

## 7. Task 5 — Pitch deck outline

File: `docs/connect-ia/pitch-deck-outline.md`

| Slide | Title | Content |
|-------|-------|---------|
| 1 | Captei | One-liner §0.1 |
| 2 | Problema | Captação = revenue; then outbound/qualification friction; `[CORRETOR_QUOTE]` |
| 3 | Solução | Omnichannel + approval gate; captação beachhead |
| 4 | Demo | Screenshot `/compose/demo` tabs |
| 5 | Arquitetura | Track A/B + compose; provider adapters (AssemblyAI today) |
| 6 | IA | STT, LLM, Voice Agent, channel orchestration |
| 7 | Compliance | No cold WA; LGPD; CRECI disclosure |
| 8 | Mercado | FLN → SC; imobiliárias 3–10; MRR tiers |
| 9 | Tração | Demo live + CRECI founder + pilot corretores |
| 10 | Ask | Connect IA; Demo Day 03/02/2027 |

---

## 8. Task 6 — Update paperwork stage

In `docs/connect-ia/proposta/one-pager.md` and `docs/connect-ia/README.md`:

- Estágio atual: ✅ Mesa multicanal (WA + email + áudio)
- Positioning: captação-led (§0.1)

---

## 8b. Task 6b — Apply positioning to submission copy (mandatory)

Edit under `docs/connect-ia/`:

### `inscricao/formulario-respostas.md`

- **Resumo em uma frase:** use one-liner §0.1
- **Área / segmento:** PropTech B2B — captação e qualificação (outreach omnichannel)
- **Problema:** pain hierarchy §0.1 (4 bullets)
- **Solução:** lead with captação; include qualification + omnichannel; safe broadening line
- **IA:** keep table; add “orquestração multicanal conforme consentimento”

### `inscricao/video-roteiro.md`

- **[0:12 – Problema]:** captação first, then outbound mess, then qualification
- Add broadening line before IA block (~1:15)
- Keep compliance “sem disparo frio” line

### `proposta/one-pager.md`

- Align problema + solução headers with §0.1

Do not change CPF, names, or legal declarations.

---

## 9. Task 7 — Deploy

```bash
npm run build
# git push if Vercel auto-deploy linked
```

Verify https://captei-voz.vercel.app/compose/demo shows three tabs after deploy.

If no deploy access: document in handoff.

---

## 10. Task 8 — Optional `/connect-ia` page

Simple Next.js page:

- One-paragraph pitch (§0.1 one-liner + pain hierarchy short)
- Link to diagram
- Link to Google Form: https://forms.gle/LSNnsPoCuKFNpdJY7
- “Estágio: pré-incubação com demo”

No new dependencies.

---

## 11. Task 9 — Handoff (mandatory)

Write `docs/connect-ia/OVERNIGHT-HANDOFF.md`:

```markdown
# Overnight handoff — YYYY-MM-DD

## Completed
- [ ] items with file paths

## Positioning applied
- [ ] formulario-respostas.md
- [ ] video-roteiro.md
- [ ] one-pager.md
- [ ] homepage

## Provider scaffold
- [ ] lib/providers/types.ts
- [ ] docs/architecture/providers.md

## Verified
- [ ] npm run build exit 0
- [ ] /compose/demo — three tabs

## Blocked
- [ ] item — reason — suggested fix

## Human morning (ordered)
1. Entrevistas: entrevistas-corretores.md (2+ corretores)
2. Insert quote → video-roteiro.md
3. Record video ≤ 3 min (face + screen demo + diagram)
4. Confirm integrante 2 → formulario-respostas.md
5. Submit https://forms.gle/LSNnsPoCuKFNpdJY7 before 20/09 23:59
6. Review branch feature/connect-ia-omnichannel; merge if OK

## Git
- Branch: feature/connect-ia-omnichannel
- Commits: [list SHAs]

## Deploy URL
## Env vars required for demo
```

Commit all work on `feature/connect-ia-omnichannel`. **Do not push** unless remote credentials explicitly available.

---

## 12. Task 10 — Provider abstraction scaffold (mandatory)

See **§0.2** for full spec.

Deliverables:

- [ ] `lib/providers/types.ts`
- [ ] `docs/architecture/providers.md`
- [ ] One comment in `lib/assemblyai/rewrite.ts` pointing to adapter pattern (optional, minimal)

**Success:** docs + types exist; AssemblyAI demo still works; `npm run build` passes.

---

## 13. Commit message style

```
docs(connect-ia): apply captação-led positioning to form and video script

feat(home): rebrand Captei as captação e qualificação copilot

docs(architecture): scaffold multi-provider adapter pattern

docs(connect-ia): sync submission pack and overnight handoff
```

---

## 14. Explicit out of scope

- Other repos (MucoCreate/AlterEgo audio plugin — not in this clone)
- WhatsApp Cloud API automated send
- Portal scraping pipeline
- Prince / Divulga code changes (reference only in docs)
- ElevenLabs SDK integration tonight
- Full provider routing / env switching tonight
- AssemblyAI hackathon video/deck (30/09) unless time remains after P1–P2

---

## 15. Success definition

Morning human should:

1. Open `OVERNIGHT-HANDOFF.md` and follow checklist
2. See **Captei** branding + **captação e qualificação** positioning on homepage
3. Demo **three-channel compose** on deployed or local URL
4. Have submission docs with positioning applied (form + video script + one-pager)
5. Have provider scaffold docs (not locked to AssemblyAI in narrative)
6. Only need: interviews, video recording, form submit

---

## 16. Reference file index

| Path | Purpose |
|------|---------|
| `docs/IDEA-LOCK.md` | Product rules |
| `docs/bmad/stress-test.md` | Legal stress test |
| `docs/connect-ia/inscricao/formulario-respostas.md` | Form answers |
| `docs/connect-ia/inscricao/video-roteiro.md` | Video script |
| `docs/connect-ia/proposta/feasibility-scorecard.md` | Gemini analysis |
| `docs/connect-ia/programa/propriedade-intelectual.md` | IP inventory |
| `docs/connect-ia/OVERNIGHT-CLOUD-AGENT-PROMPT.md` | This file |

---

**End of overnight prompt.**
