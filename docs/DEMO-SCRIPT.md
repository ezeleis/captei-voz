# Demo script — Captei Voz

Record in Chrome, headset on, on https://captei-voz.vercel.app/
Target: **3:20–4:40**. Under 5:00, over 3:00. MP4, under 300 MB.
Qualify first. That is the voice agent. Compose is the second screen.

Do **not** say: “soa como você”, “100% LGPD”, “we send WhatsApp automatically”,
or any conversion percentage.

---

## 0:00–0:25 — Problem

In Florianópolis a lot of owners are Spanish- or English-speaking. The
corretor thinks in Portuguese, types slowly, and the voice note that would
actually get a reply never goes out. Meanwhile the owner who asked “quanto
vale o meu imóvel?” is waiting, and a cold WhatsApp blast to a portal number
would burn the agency’s WABA.

## 0:25–0:45 — What it is

Captei Voz is a desk for a licensed broker. Two screens, one consent gate.

1. **Live qualify** — an AssemblyAI Voice Agent talks to an owner who already
   opted in.
2. **Compose** — the broker speaks a rough note in PT, ES or EN; the owner
   gets a professional note in *their* language, spoken by a disclosed stock
   voice, only after the broker approves.

Nothing is sent by a bot.

## 0:45–2:15 — Screen 2: qualify (headline)

Open `/qualify/demo`. Pick **Conversar em** Português (or English on camera if
that is clearer). Click **Iniciar conversa**. Wait for the greeting (AI
disclosure + CRECI).

Owner lines (you, second voice or a second take) — match the language you picked:

- “Sim, é o apartamento na Virgílio Várzea.”
- “Apartamento, uns cinquenta metros.”
- “Quero vender, sem pressa.”
- “Acho que uns oitocentos mil, mas o corretor que vê.”

Show the qualification card on screen. Encerrar.
One sentence: barge-in works; the agent does not invent a price.

## 2:15–3:25 — Screen 1: compose + handoff

Open `/compose/demo`. Set **Vou falar em** Português, **Recado em** Español
(or English if that is clearer on camera).

Speak ~15 seconds, facts only. Example:

> “Maria, o apto de cinquenta metros na Virgílio Várzea, pedindo oitocentos,
> janela aberta, posso passar amanhã de manhã pra medir.”

Stop. Show original vs rewrite. Point at the spoken disclosure + CRECI block
— not editable. Name the stock voice on screen (`lola` / `michael` / `rafael`
matches **Recado em**). **Gerar áudio**, **Ouvir**, **Aprovar**. Then **Baixar WAV**
and **Abrir WhatsApp**. Say this once:

> WhatsApp cannot attach audio through a link. The broker downloads the file
> and drops it into a chat the owner already opened. A native voice note
> through Cloud API is the production path — same rule, same window.

## 3:25–4:00 — Why this is legal enough to sell

- Voice notes only after the owner wrote first. Audio is not a template.
- Portal-scraped numbers never get a voice note. That is the product, not a
  footnote.
- Stock voice, disclosed in the audio. We will not claim it sounds like the
  broker. Clone is a later, consented upsell — not this submission.

## 4:00–4:35 — Market, money, next

- Buyer: imobiliária / gestora in coastal Brazil with foreign owners. First
  customer is the submitting broker.
- Revenue later: per-seat desk + usage on Voice Agent minutes. Not billed
  in the hackathon.
- Next: Ogg/Opus encode, Cloud API send inside an open window, approval log
  in Postgres, clone off-hackathon.

Close on the live URL and the public repo. Credit AssemblyAI (streaming STT,
Voice Agent, LLM Gateway).

---

## Shot list

| Time | Shot |
|---|---|
| 0:00 | Homepage, two desk cards |
| 0:45 | Qualify language picker + Iniciar |
| 1:10 | Headset, greeting audio |
| 1:40 | Transcript + qualification card |
| 2:15 | Compose language pickers |
| 2:40 | Original / rewrite split |
| 3:00 | Play + approve + download + wa.me |

## If something fails on camera

- Mic permission: Chrome site settings, reload once.
- “Gerando áudio…” > 30 s: say “synthesis takes about as long as the note”
  and cut to a pre-rendered take.
- Concurrent-session error: “free tier is five streams a minute; this is the
  wait the production desk will surface.” Do not debug live.
