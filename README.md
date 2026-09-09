# Captei Voz

**Status:** idea locked 2026-09-08, stress-tested and amended the same day.
Amendments A1–A4 approved — see `docs/bmad/stress-test.md`. Skeleton and live
qualify screen are in the repo; composed-note TTS still waits on the listen
test.

AssemblyAI Voice Agent Hackathon (lablab, 1–30 Sep 2026) slice of Captei.  
Not Truquipoker. Not Connect IA / MucoCreate. Not cold WhatsApp captacão.

## One sentence

The corretor speaks a rough note in ES, EN, or PT. Captei Voz turns it into a professional Brazilian-Portuguese WhatsApp voice note plus text that they **approve** before anything is sent — and it can only reach owners who already **opted in** *and* wrote first.

> “Neutral” was dropped from this claim deliberately. AssemblyAI's only
> Portuguese voice is European-accented, so the claim has to match whichever
> voice survives the listen test. See `docs/bmad/stress-test.md`, claim 3.

## Hero (confirmed)

1. **Compose desk** — mic → AssemblyAI streaming STT → rewrite tone/register/language → verbatim stock-voice render → human approve → manual handoff.
2. **Consented live qualify** — Voice Agent session as if the owner already submitted “Quanto vale o meu imóvel?”

Hero 2 gets built first. It is the one that reads as a *voice agent* rather than a voice-powered tool, and it is what the judging rubric rewards.

**Not in scope:** any automated WhatsApp sender; auto-send to Track B worklist / portal-scraped numbers. Voice **clone** is a later Captei upsell (not AssemblyAI — they have no cloning API, and no standalone TTS either).

## Next

Skeleton is in the repo. Live qualify (`/qualify/demo`) is the first real
screen: Voice Agent in the browser, tool write-back, `session.end` on hangup.

To run it you still need `ASSEMBLYAI_API_KEY` in `.env.local` (copy
`.env.example`). `DATABASE_URL` and `QUALIFY_AGENT_ID` are optional for the
seeded demo.

Before relying on `rafael` for composed notes, the listen test and
greeting-length test in `docs/bmad/recommended-mvp.md` §9 still have to pass.

Analysis: `docs/bmad/` — `product-brief.md`, `stress-test.md`, `recommended-mvp.md`.
Legal rails: `docs/IDEA-LOCK.md` and `C:\Users\Admin\Projects\CRM\docs\captacao\`.
