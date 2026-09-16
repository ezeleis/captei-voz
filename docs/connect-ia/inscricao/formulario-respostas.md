# Rascunho de respostas — Formulário Connect IA

**Formulário:** https://forms.gle/LSNnsPoCuKFNpdJY7  
**Iniciativa (nome oficial):** Captei  
**Pivot (15/09/2026):** substitui inscrição MucoCreate — ver [`../proposta/feasibility-scorecard.md`](../proposta/feasibility-scorecard.md)

---

## Dados do responsável pela proposta

| Campo | Resposta |
|-------|----------|
| Nome completo | Facundo Ezequiel Leis Pou |
| CPF | 244.743.228-35 |
| E-mail | _[preencher]_ |
| Telefone (WhatsApp) | _[preencher]_ |
| Cidade / UF | Florianópolis / SC |

---

## Dados do integrante 2 (se houver)

| Campo | Resposta |
|-------|----------|
| Nome completo | _[preencher]_ |
| CPF | _[preencher]_ |
| E-mail | _[preencher]_ |
| Papel na proposta | _[ex.: engenharia full-stack, gestora imobiliária, validação de mercado]_ |

---

## Identificação da proposta

**Nome da solução / iniciativa:**  
Captei

**Resumo em uma frase:**  
Captei — copiloto de IA para captação e qualificação de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado.

**Área / segmento:**  
PropTech B2B — captação e qualificação imobiliária (outreach omnichannel)

**Existe empresa constituída?**  
Não _(fase de validação — edital não exige CNPJ na inscrição)_.

---

## Problema ou oportunidade (critério — até 20 pts)

Imobiliárias de 3–10 corretores (beachhead: Florianópolis, Norte da Ilha) sentem a dor nesta ordem:

1. **Captação é o P&L.** Conquistar mandatos exclusivos de proprietários é onde a agência ganha ou perde dinheiro. Cada mandato perdido é comissão significativa — e o funil ainda vive em planilha + WhatsApp pessoal.
2. **Outbound ruim mata o primeiro contato.** Corretores perdem negócio no dia a dia: áudio longo que o dono não ouve até o fim, texto desorganizado, follow-up que some entre WhatsApp, e-mail e telefone.
3. **Qualificação sem velocidade.** Quem já optou (“Quanto vale meu imóvel?”) espera resposta **instantânea e profissional** em PT, ES ou EN. Demora = lead frio.
4. **Medo de plataforma, não de IA.** Automação errada **bane o número WhatsApp Business** da agência. Precisam de governança e aprovação humana — não de bot de spam.

**Público-alvo inicial:** corretores e imobiliárias em Florianópolis/SC — especialmente Norte da Ilha, com proprietários locais e estrangeiros (ES/EN).

**Evidência:** entrevistas com corretores parceiros _(inserir citação após [`../proposta/entrevistas-corretores.md`](../proposta/entrevistas-corretores.md))_.

---

## Solução proposta (critério — até 20 pts)

**Captei** é um copiloto de IA para **captação e qualificação** de proprietários — não um CRM completo, não um agente autônomo que prospecta sozinho.

Começamos pela **captação** — o gargalo mais caro — mas a mesma mesa serve qualquer outbound qualificado: qualificação de lead, retorno a proprietário, follow-up entre canais.

Quatro camadas, do primeiro contato **consentido** ao follow-up:

1. **Descobrir** — sinais públicos (FSBO, anúncios parados) priorizados por IA → worklist para o corretor (humano faz o primeiro contato).
2. **Atrair e qualificar** — funil “Quanto vale meu imóvel?” com opt-in explícito (Track A) → resposta instantânea em texto ou agente de voz ao vivo (PT/ES/EN).
3. **Compor** — corretor fala rough (PT/ES/EN) → IA gera texto WhatsApp, e-mail e áudio profissional → **aprovação humana obrigatória** → entrega canal-aware (handoff manual no MVP).
4. **Governar** — log de aprovação, CRECI, referência de consentimento — visível para a gestora.

**Diferencial:** não prometemos disparo frio automatizado para números de portal (proibido e banível). Automatizamos pesquisa, rascunho e cadências **após consentimento**.

**Estágio atual:** demo funcional — mesa multicanal (WhatsApp + e-mail + áudio) + agente de voz ao vivo — em https://captei-voz.vercel.app/; documentação legal/estratégia (`CRM/docs/captacao/`); estratégia BMAD validada — **pré-incubação com protótipo**, alinhado ao Connect IA.

**Stack:** multi-provedor; AssemblyAI na demo atual.

**O que pedimos:** validação de mercado com imobiliárias reais, BMC, piloto e pitch Demo Day — não investimento em caixa.

---

## Inteligência Artificial (critério — até 40 pts)

A IA é **núcleo da solução**:

| Aplicação de IA | Papel |
|-----------------|--------|
| **STT multilíngue** (demo: AssemblyAI) | Captura fala do corretor em PT/ES/EN, code-switch, ruído de campo |
| **LLM rewrite** | Tom profissional, idioma do proprietário, disclosure CRECI/IA |
| **Voice Agent** | Qualificação conversacional ao vivo pós-opt-in |
| **Síntese de voz** | Nota de voz aprovada (stock voice + aviso) |
| **Scoring de sinais** | Prioriza imóveis com maior probabilidade de captação |
| **Orquestração multicanal conforme consentimento** | Escolhe formato (texto / e-mail / voz) e o que pode ser automatizado segundo o estado de consentimento |

**Por que isso é IA aplicada, não wrapper:** restrições de plataforma (Meta WhatsApp, LGPD) exigem **decisão agentica** por canal — a IA adapta conteúdo e roteamento, não só gera texto genérico. A demo atual usa AssemblyAI; a arquitetura é de adaptadores (`compose/` + `consent/` vendor-neutral → `providers/*`).

Roadmap: integração Fechou CRM, cadências Track C, Prince speed-to-lead, Divulga para aquisição; TTS/clone ElevenLabs pós-MVP.

---

## Equipe e comprometimento (critério — até 20 pts)

**Representante:** Facundo Ezequiel Leis Pou — CRECI, produto, captação, rede de corretores FLN, vídeo e contato InPETU.

**Integrante 2:** _[nome — ex.: engenharia ou gestora imobiliária]_.

**Disponibilidade:**

- Mínimo **5 h/semana** (Anexo IV).
- **75%** presença nas atividades.
- Presenciais: kick-off **07/10**, **29–30/10**, **11/11**, **02/12**, **20/01**, pitch **27/01**, Demo Day **03/02/2027**.

**Motivação Connect IA:** hub UFSC/InPETU em Florianópolis; IA aplicada a problema de receita real; metodologia BMC + teste de mercado combina com piloto imobiliário local.

---

## Vídeo de apresentação

| Campo | Resposta |
|-------|----------|
| Link do vídeo | _[YouTube / Drive — após gravação]_ |
| Duração | ≤ 3:00 |
| Apresentador | Facundo Ezequiel Leis Pou |

Roteiro: [`video-roteiro.md`](video-roteiro.md).

---

## Declarações

- [ ] Li e aceito o Edital nº 02/2026 e anexos.
- [ ] Tenho 18+ anos e documento válido no Brasil.
- [ ] Informações verdadeiras; link de vídeo acessível.
- [ ] Ciente: IP criada **durante** o programa → UFSC (cláusula 14); pré-existentes no inventário [`../programa/propriedade-intelectual.md`](../programa/propriedade-intelectual.md).

---

## Notas internas

- Repositório produto: `C:\Users\Admin\Projects\captei-voz` (`github.com/ezeleis/captei-voz`)
- Paperwork canonical: `captei-voz/docs/connect-ia/` — espelho: `IntelMuCoCreate/connect-ia/`
- IntelMuCoCreate (AlterEgo/MucoCreate): **fora desta inscrição** — desenvolvimento pausado para o edital
