# Compose voice language + jury UI

date: 2026-09-14
status: implementing in this session
surfaces: `/`, `/compose/demo`, `/qualify/demo`

## 1. Problem

### Voice (bug)

The compose desk rewrite path already honours **Recado em** (`outputLang` → `rewriteDraft` → `assembleFinalNote`). The WAV does not.

`ComposeDesk.renderAudio` always calls `renderVerbatimInBrowser(text, QUALIFY_VOICE_ID)` with `rafael`. AssemblyAI stock voices are language-specific: `rafael` is the Portuguese voice. English or Spanish text through `rafael` is Portuguese-accented speech of another language — the “faulty Portuguese English” heard in testing.

Qualify stays on `rafael`. That screen is Portuguese-only by design.

### UI

The app is a Tailwind starter: `neutral-50` paper, `neutral-900` buttons, system sans. Fine for building, weak for a lablab jury who will watch a 3–5 minute video of these three screens.

## 2. Decision (voice)

Catalog fetched 2026-09-14 from
https://www.assemblyai.com/docs/voice-agents/voice-agent-api/voices

| Recado em | Voice ID | Why |
|-----------|----------|-----|
| `pt` | `rafael` | Only Portuguese voice. Keep the 2026-09-09 Brazilian-ear listen test. Qualify unchanged. |
| `es` | `lola` | Only Spanish voice. Female — gender cannot match `rafael`. |
| `en` | `michael` | US English, professional register. Coastal-Brazil foreign owners more often hear US than UK. |

Still stock voices. Still disclosed in the audio. Still never “soa como você”. Clone remains out of hackathon.

IDEA-LOCK Clone row is amended: `rafael` is no longer the compose voice for every language.

Render uses `noteLang` (language of the approved text), not the picker. Changing **Recado em** after a rewrite does not retarget TTS until the corretor rewrites.

## 3. Decision (visual)

70 / 20 / 10 on a Florianópolis desk, not an AI-purple SaaS template.

| Role | % | Token | Hex | Use |
|------|---|-------|-----|-----|
| Dominant | 70 | `paper` / `foam` / `sand` | `#F4EFE6` / `#FAF7F2` / `#E8DFD2` | Page, cards, fields |
| Secondary | 20 | `ink` / `tide` | `#1A3C3A` / `#2F6F6A` | Type, nav, secondary controls, live qualify chrome |
| Accent | 10 | `clay` | `#C45C26` | Primary CTAs only (Iniciar, Falar, Gerar áudio) |

Type: **Fraunces** (display) + **Source Sans 3** (UI, Latin-ext for PT/ES). Light theme locked for the demo video.

Qualify is the headline product (stress-test claim 4). Home lists it first.

## 4. Plan

1. `lib/assemblyai/voices.ts` — `voiceForNoteLang`
2. Wire compose + `/api/render` to that map; show the voice id in the desk
3. Tokenised theme in `globals.css` + `next/font` in layout
4. Restyle home, compose, qualify (shared header)
5. Amend IDEA-LOCK / README / DEMO-SCRIPT copy that said “always rafael”
6. Typecheck + browser pass on the three routes
7. Human listen test: EN and ES WAV vs PT (cannot be fully automated)

## 5. Test plan

- [x] **Recado em English**: helper names `michael`; Recado chip is ink, Vou falar stays PT
- [x] **Recado em Português**: helper names `rafael`
- [x] **Recado em Español**: helper names `lola`
- [ ] Changing the picker without rewriting does not change the named render voice of an existing recado (needs a rewritten note)
- [x] Qualify screen chrome still Portuguese; `rafael` not changed in qualify-config
- [x] Home, compose, qualify look consistent; clay is only on primary actions
- [x] Narrow viewport: header wraps; no horizontal overflow on qualify
- [x] Seeded amber banners still readable
- [x] Light theme locked (`color-scheme: light`)
- [ ] **Human listen test:** EN WAV with `michael` is English, ES WAV with `lola` is Spanish, PT still `rafael` — cannot automate TTS in this session

Hydration overlay in the Cursor browser is a false positive: it diffs `data-cursor-ref` attributes the automation injects before React hydrates. Not a product bug.

## 6. Out of scope

Ogg/Opus, Cloud API send, approval persistence, BMAD install. Jury video still follows `docs/DEMO-SCRIPT.md`.
