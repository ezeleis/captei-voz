# Captei Voz

**Status:** idea locked 2026-09-08, stress-tested and amended the same day.
Amendments A1–A4 approved — see `docs/bmad/stress-test.md`. Live qualify and
compose-desk TTS are in the repo.

AssemblyAI Voice Agent Hackathon (lablab, 1–30 Sep 2026) slice of Captei.  
Not Truquipoker. Not Connect IA / MucoCreate. Not cold WhatsApp captacão.

## One sentence

The corretor speaks a rough note in ES, EN, or PT. Captei Voz turns it into a professional Brazilian-Portuguese WhatsApp voice note plus text that they **approve** before anything is sent — and it can only reach owners who already **opted in** *and* wrote first.

> “Neutral” was dropped from this claim deliberately. AssemblyAI's only
> Portuguese voice is European-accented, so the claim has to match whichever
> voice survives the listen test. See `docs/bmad/stress-test.md`, claim 3.

## Hero (confirmed)

1. **Compose desk** — mic → AssemblyAI streaming STT → rewrite tone/register/language → verbatim stock-voice render → human approve → manual handoff.
2. **Consented live qualify** — Voice Agent session as if the owner already submitted “Quanto vale o meu imóvel?”, in PT, ES or EN.

Hero 2 gets built first. It is the one that reads as a *voice agent* rather than a voice-powered tool, and it is what the judging rubric rewards.

**Not in scope:** any automated WhatsApp sender; auto-send to Track B worklist / portal-scraped numbers. Voice **clone** is a later Captei upsell (not AssemblyAI — they have no cloning API, and no standalone TTS either).

## Next

Live qualify is working (`/qualify/demo`). Compose desk is at `/compose/demo`
— speak, rewrite in the owner language, render verbatim audio with the stock
voice for that language (`rafael` PT, `lola` ES, `michael` EN), approve.
Playback uses the continuous worklet on one AudioContext.

Need `ASSEMBLYAI_API_KEY` plus `CORRETOR_FULL_NAME` and `CORRETOR_CRECI` in
`.env.local` (and the same names on Vercel). Restart `npm run dev` after
changing env. No quotes unless the value has spaces.

Composed-note TTS runs in the browser (token from our server, greeting
verbatim). That is what lets the demo live on Vercel Hobby without a 10 s
serverless timeout.

After approve, compose offers WAV download, copy, and `wa.me` (text only —
WhatsApp cannot attach audio via URL). Demo script: `docs/DEMO-SCRIPT.md`.
Pitch pack (video, deck, description) is still open.

Analysis: `docs/bmad/` — `product-brief.md`, `stress-test.md`, `recommended-mvp.md`.
Legal rails: `docs/IDEA-LOCK.md` and `C:\Users\Admin\Projects\CRM\docs\captacao\`.
