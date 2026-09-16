# Captei

**Connect IA** — copiloto de IA para captação e qualificação imobiliária
(WhatsApp, e-mail, voz). Compliance-first: aprovação humana, sem disparo frio.

**Demo:** https://captei-voz.vercel.app/  
**Programa:** InPETU Connect IA (Edital 02/2026) — docs em `docs/connect-ia/`.

## O que é

O corretor fala rough em PT, ES ou EN. O Captei devolve texto para WhatsApp,
e-mail e áudio profissional — só depois de **aprovar**. Proprietários só entram
por consentimento (Track A) ou contato humano (Track B).

| Tela | Rota | Função |
|------|------|--------|
| Qualificação ao vivo | `/qualify/demo` | Voice Agent com proprietário que já optou in |
| Mesa de composição | `/compose/demo` | STT → rewrite → WhatsApp / e-mail / áudio |
| Connect IA | `/connect-ia` | Resumo do programa e arquitetura |

## Stack (MVP)

- **AssemblyAI** — streaming STT, Voice Agent, LLM Gateway (adapter atual)
- **Next.js 15** — deploy Vercel
- Regras de produto: `docs/IDEA-LOCK.md`
- Compliance captacao: `C:\Users\Admin\Projects\CRM\docs\captacao\`

## Desenvolvimento local

```powershell
npm install
cp .env.example .env.local   # ASSEMBLYAI_API_KEY, CORRETOR_FULL_NAME, CORRETOR_CRECI
npm run dev
```

Restart `npm run dev` after changing env. No quotes unless values have spaces.

Composed-note TTS runs in the browser (token from server). After approve: WAV
download, copy, and `wa.me` (text only — WhatsApp cannot attach audio via URL).

## Documentação

| Pasta | Conteúdo |
|-------|----------|
| `docs/connect-ia/` | Inscrição, proposta, IP (canonical) |
| `docs/bmad/` | Product brief, stress-test, MVP |
| `docs/architecture/` | Provider adapters |
| `docs/archive/` | Artefatos históricos (hackathon, agent handoffs) |

Roteiro demo vídeo Connect IA: `docs/connect-ia/demo-script.md`.
