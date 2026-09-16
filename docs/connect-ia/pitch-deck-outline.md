# Pitch deck outline — Captei (Connect IA)

Uso: 10 slides, Demo Day / inscrição. Headline Connect IA = **captação + qualificação + omnichannel + MRR** (não “wrapper de AssemblyAI”).

**One-liner:** Captei — copiloto de IA para captação e qualificação de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado.

**Segmento:** PropTech B2B — captação e qualificação imobiliária (outreach omnichannel).

---

## Slide 1 — Captei

- Logo + **Captei**
- One-liner acima
- Sublinha: compliance-first · aprovação humana · sem disparo frio
- Rodapé: Pré-incubação Connect IA · InPETU UFSC · Florianópolis

---

## Slide 2 — Problema

Ordem da hierarquia de dor (não inverter):

1. **Captação = receita.** Mandatos exclusivos são onde a agência ganha ou perde dinheiro.
2. **Outbound ruim no dia a dia.** Áudio bagunçado, follow-up fraco entre WhatsApp, e-mail e voz.
3. **Qualificação sem velocidade.** Quem já optou (“Quanto vale meu imóvel?”) precisa de resposta instantânea em PT/ES/EN.
4. **Medo de plataforma.** Automação errada bane o WABA.

`[CORRETOR_QUOTE]` — inserir após [`proposta/entrevistas-corretores.md`](proposta/entrevistas-corretores.md). Placeholder: *“Mando o áudio às dez da noite e no dia seguinte ele nem ouviu.”*

Beachhead: imobiliárias 3–10 corretores, Norte da Ilha / FLN.

---

## Slide 3 — Solução

- Copiloto (não CRM completo; não agente autônomo que prospecta sozinho).
- **Mesa omnichannel + gate de aprovação humana.**
- Beachhead: captação. Ampliação: “Começamos pela captação — o gargalo mais caro — mas a mesma mesa serve qualquer outbound qualificado: qualificação de lead, retorno a proprietário, follow-up entre canais.”
- Do primeiro contato **consentido** ao follow-up.

Visual: três colunas WhatsApp | E-mail | Áudio → selo “você aprova”.

---

## Slide 4 — Demo

Screenshot de `/compose/demo` com as três abas (WhatsApp | E-mail | Áudio).

Segundo frame (opcional): `/qualify/demo` — Voice Agent pós-opt-in.

URL: https://captei-voz.vercel.app/

---

## Slide 5 — Arquitetura

- Track A: Divulga → landing opt-in → Voice Agent
- Track B: sinais → worklist → **humano** telefona (sem WA frio)
- Compose: mic → STT → LLM → {WA | e-mail | áudio} → aprovação
- **Provider adapters:** `compose/` + `consent/` vendor-neutral; `providers/*`; **AssemblyAI hoje**
- Asset: [`diagram-export.md`](diagram-export.md) / `/connect-ia-architecture.svg`

---

## Slide 6 — IA

| Camada | Papel |
|--------|--------|
| STT | Fala do corretor PT/ES/EN |
| LLM | Tom, idioma, CRECI |
| Voice Agent | Qualificação ao vivo |
| Orquestração | Canal conforme consentimento |

*Stack multi-provedor; AssemblyAI na demo atual.*

Bloco ≥ 45 s no vídeo — este slide é o visual.

---

## Slide 7 — Compliance

- **Sem disparo frio** no WhatsApp; portal ≠ opt-in
- LGPD: base legal + registro de consentimento
- CRECI no recado (bloco não editável) + aviso de voz digital
- IDEA-LOCK + stress-test BMAD (A1–A4)
- Handoff manual no MVP (`wa.me` / copiar / WAV)

---

## Slide 8 — Mercado

- FLN (Norte da Ilha) → Santa Catarina
- Imobiliárias **3–10 corretores**
- MRR: Starter R$ 99–149 · Agência R$ 299–499 · Profissional R$ 699–999
- Proprietários ES/EN como vantagem costeira, não como produto separado

---

## Slide 9 — Tração

- Demo live: qualify + mesa multicanal
- Fundador CRECI + rede de corretores FLN
- Piloto: 1 imobiliária (a nomear após entrevistas)
- Docs legais/estratégia já escritos (`CRM/docs/captacao/`)

Não inventar métricas de conversão (CDC art. 30).

---

## Slide 10 — Ask

- **Connect IA** — teste de mercado, BMC, mentoria em IA aplicada
- Kick-off 07/10/2026 · Demo Day **03/02/2027**
- Não pedimos aporte em caixa (edital não prevê)
- Presença presencial Florianópolis

Fecho: *Captei — captação e qualificação, omnichannel, com IA e compliance no centro.*
