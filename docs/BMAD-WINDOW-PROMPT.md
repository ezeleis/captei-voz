# Paste this in a new Cursor window

Open folder: `C:\Users\Admin\Projects\captei-voz`

---

You are running **BMAD analysis** to **stress-test** Captei Voz before any implementation.

## Read first (do not skip)

- `README.md`
- `docs/IDEA-LOCK.md`
- `C:\Users\Admin\Projects\CRM\docs\captacao\01-strategy.md`
- `C:\Users\Admin\Projects\CRM\docs\captacao\02-legal-constraints.md`
- Edital is unrelated. This is **not** Connect IA.

If BMAD create-product-brief / adversarial review / domain-research skills exist in this repo or the user’s BMAD install, **load and follow them**. If BMAD is not installed here yet, install or copy the minimum BMM analysis workflows, then run:

1. Product brief (collaborative, but treat IDEA-LOCK as already decided — challenge it, don’t reopen Shipaton)
2. Adversarial / red-team pass
3. Domain: Meta WhatsApp, LGPD, CRECI, voice-clone advertising claims, AssemblyAI vs TTS/clone

## Stress-test these claims (must produce a written verdict)

1. **Legal:** Is “approve then send WhatsApp audio” still a WABA/LGPD risk if the owner only exists on a portal ad? Confirm Track A vs Track B split.
2. **Meta:** Voice notes vs templates vs 24h window. Can a Cloud API send **audio** we generated, or only the corretor’s phone?
3. **Accent:** “Neutral professional Portuguese” — can stock AssemblyAI Voice Agent voices carry that claim, or is it a rewrite-the-text problem only?
4. **Hackathon fit:** Is compose desk + consented Voice Agent enough “voice agent” for lablab/AssemblyAI, or will judges see STT+rewrite as not an agent?
5. **Scope to 30 Sep:** What is the thinnest demo that still matches IDEA-LOCK?
6. **Conflicts:** Voice clone vs AssemblyAI (no clone API). Browser-only vs Voice Agent (needs token server).

## Outputs (write into this repo)

```text
docs/bmad/
  product-brief.md
  stress-test.md          # verdicts on the 6 claims
  recommended-mvp.md      # files/stack for after approval, no code yet
```

Do **not** write application code, WhatsApp senders, scrapers, or voice-clone pipelines.  
Do **not** put secrets in the repo.

If a lock in IDEA-LOCK is illegal or unwinnable, propose the smallest change and stop for human approval.

---
