# Captei — One-pager (Connect IA)

**Programa:** InPETU Connect IA · Edital 02/2026  
**Nome no formulário:** Captei  
**Segmento:** PropTech B2B — captação e qualificação imobiliária (outreach omnichannel)  
**Contato:** Facundo Ezequiel Leis Pou — _[e-mail / telefone]_

**One-liner:** Captei — copiloto de IA para **captação e qualificação** de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado.

---

## Problema

Imobiliárias de 3–10 corretores (beachhead Florianópolis) sentem a dor nesta ordem:

1. **Captação = receita.** Conquistar mandatos exclusivos de proprietários é onde a agência ganha ou perde dinheiro.
2. **Outbound ruim no dia a dia.** Áudio longo no WhatsApp, texto desorganizado, follow-up que some entre WhatsApp, e-mail e telefone.
3. **Qualificação sem velocidade.** Quem já optou (“Quanto vale meu imóvel?”) precisa de resposta instantânea e profissional em PT/ES/EN.
4. **Medo de plataforma.** Automação errada **bane o número WABA** — a agência precisa de governança, não de bot de spam.

**Quem sente primeiro:** corretores autônomos e imobiliárias de 3–10 pessoas em mercados costeiros (ex.: Norte da Ilha, Florianópolis) — alto volume de proprietários estrangeiros (ES/EN) e forte dependência de WhatsApp.

**Evidência:** entrevistas com corretores parceiros _(inserir citações após [`entrevistas-corretores.md`](entrevistas-corretores.md))_.

---

## Solução

**Captei** — copiloto de IA para **captação e qualificação**, outbound omnichannel **com aprovação humana**. Não é CRM completo; não é agente autônomo que prospecta sozinho.

Começamos pela **captação** — o gargalo mais caro — mas a mesma mesa serve qualquer outbound qualificado: qualificação de lead, retorno a proprietário, follow-up entre canais.

| Etapa | O que faz |
|-------|-----------|
| **Descobrir** | Sinais públicos (FSBO, anúncios parados) → fila priorizada para o corretor |
| **Atrair** | Funil “Quanto vale meu imóvel?” com opt-in explícito (Track A) |
| **Qualificar** | Agente de voz ao vivo (PT/ES/EN) + resposta instantânea em texto |
| **Compor** | Corretor fala rough → IA devolve texto WhatsApp, e-mail e áudio profissional → **aprovação humana** |
| **Entregar** | Só em canais/janelas permitidas (consentimento + política Meta); handoff manual no MVP |
| **Governar** | Log de aprovação, CRECI, consentimento — visível para a gestora |

**Não prometemos:** disparo frio automatizado para números de portal. Isso mata o WABA. Captei automatiza o que é legal; humano ou opt-in onde a lei exige.

---

## AI wedge (40% da nota — núcleo)

```
[Sinais públicos] → score → worklist (humano telefona)
[Opt-in Track A] → Voice Agent + LLM qualify
[Corretor fala] → STT → rewrite tom/registro/idioma → {texto WA | e-mail | áudio}
                              ↓
                    aprovação humana → entrega canal-aware → CRM
```

Stack **multi-provedor**; AssemblyAI na demo atual. `compose/` e `consent/` são vendor-neutral; `providers/*` são adaptadores.

| Aplicação de IA | Papel |
|-----------------|--------|
| **STT multilíngue** (pt/es/en) | Captura intenção do corretor em condições reais (ruído, code-switch) |
| **LLM rewrite** | Registro profissional, idioma do proprietário, disclosure CRECI |
| **Voice Agent** | Qualificação ao vivo pós-consentimento |
| **Síntese de voz** | Nota de voz aprovada (voz stock + aviso de IA) |
| **Scoring de sinais** | Prioriza imóveis com maior chance de captação |
| **Orquestração multicanal conforme consentimento** | Escolhe formato (texto / e-mail / voz) e o que pode ser automatizado |

A IA não substitui o corretor — **amplifica** a qualidade do outbound e reduz o tempo entre intenção e mensagem profissional.

---

## Estágio atual

| Entregue | Pendente (programa) |
|----------|------------------------|
| ✅ Mesa multicanal (WA + e-mail + áudio) + qualify demo (`captei-voz.vercel.app`) | Redeploy Vercel se a URL pública ainda não mostrar as três abas |
| BMAD: product brief, stress-test legal, IDEA-LOCK | Entrevistas gravadas + citações no vídeo |
| Estratégia captação + LGPD (`CRM/docs/captacao/`) | Piloto com 1 imobiliária FLN |
| Fundador CRECI + rede de corretores | BMC, pricing, integração Fechou CRM |
| Scaffold multi-provedor (`lib/providers/types.ts`) | Roteamento `CAPTEI_*_PROVIDER` (pós-hackathon) |

**Posicionamento:** captação-led — pré-incubação com **demo funcional** — honesto e acima da média do edital.

---

## Ask (o que queremos do programa)

- Validar problema e BMC com **imobiliárias reais** (Teste de Mercado nov/2026).
- Mentoria em **IA aplicada + go-to-market B2B** local → escalável.
- Estruturar piloto pago e pitch Demo Day (**03/02/2027**).
- Presença Florianópolis: kick-off **07/10/2026** e marcos presenciais.

**Não pedimos:** aporte financeiro (edital não prevê).

---

## Modelo de receita (resumo)

B2B SaaS — assinatura mensal por porte + assento + uso de minutos de agente de voz.

| Tier | Faixa |
|------|--------|
| Starter (corretor solo) | R$ 99–149/mês |
| Agência (3–10) | R$ 299–499/mês |
| Profissional (10+) | R$ 699–999/mês |

Detalhe: [`feasibility-scorecard.md`](feasibility-scorecard.md).

---

## Equipe formal (máx. 2)

| | Nome | Foco |
|---|------|------|
| Representante | Facundo Ezequiel Leis Pou (CRECI) | Produto, captação, vídeo, pilotos |
| Integrante 2 | _[preencher]_ | _[ex.: engenharia, gestora imobiliária, validação]_ |

---

## Links

- Formulário: https://forms.gle/LSNnsPoCuKFNpdJY7
- Demo: https://captei-voz.vercel.app/
- Repo produto: `C:\Users\Admin\Projects\captei-voz`
- Estratégia captação: `C:\Users\Admin\Projects\CRM\docs\captacao\`
- Edital: `C:\Users\Admin\Projects\1719435285478.pdf`
