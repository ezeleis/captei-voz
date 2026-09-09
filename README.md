# Captei Voz

**Status:** idea locked 2026-09-08, stress-tested and amended the same day.
Amendments A1–A4 approved — see `docs/bmad/stress-test.md`. Three verification
tests must pass before any application code is written (`recommended-mvp.md` §9).

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

BMAD analysis is done. Before any application code, three tests (about a day):

1. **Listen test** — play `rafael` output to Brazilian listeners cold.
2. **Greeting-length test** — confirm the verbatim render path holds a full note.
3. **Auth header check** — per endpoint, by hand.

Then build in the order set out in `docs/bmad/recommended-mvp.md` §9.

Analysis: `docs/bmad/` — `product-brief.md`, `stress-test.md`, `recommended-mvp.md`.
Legal rails: `docs/IDEA-LOCK.md` and `C:\Users\Admin\Projects\CRM\docs\captacao\`.
