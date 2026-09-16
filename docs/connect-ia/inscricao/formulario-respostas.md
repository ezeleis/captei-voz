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
Copiloto de IA para captação imobiliária omnichannel — WhatsApp, e-mail e voz — com aprovação humana, consentimento LGPD/Meta e demos funcionais para corretores e imobiliárias.

**Área / segmento:**  
B2B SaaS / PropTech / IA aplicada ao imobiliário brasileiro (captação de imóveis).

**Existe empresa constituída?**  
Não _(fase de validação — edital não exige CNPJ na inscrição)_.

---

## Problema ou oportunidade (critério — até 20 pts)

**Captação** — conquistar mandatos exclusivos de proprietários — é o gargalo mais doloroso e mais lucrativo das imobiliárias brasileiras. Corretores perdem negócios quando:

- não priorizam oportunidades (particular, anúncio parado) a tempo;
- enviam áudios ou textos desorganizados no WhatsApp — o proprietário não ouve até o fim;
- o follow-up falha entre WhatsApp, e-mail e telefone;
- automações “fáceis” violam LGPD e política Meta e **banem o número WhatsApp Business** da agência.

**Impacto financeiro:** cada mandato perdido representa comissão significativa; imobiliárias de médio porte (3–10 corretores) operam com planilhas e WhatsApp pessoal, sem ferramenta de captação integrada.

**Público-alvo inicial:** corretores e imobiliárias em Florianópolis/SC — especialmente Norte da Ilha, com proprietários locais e estrangeiros (ES/EN).

**Evidência:** entrevistas com corretores parceiros _(inserir citação após [`../proposta/entrevistas-corretores.md`](../proposta/entrevistas-corretores.md))_.

---

## Solução proposta (critério — até 20 pts)

**Captei** orquestra captação em quatro camadas:

1. **Descobrir** — sinais públicos (FSBO, anúncios parados) priorizados por IA → worklist para o corretor.
2. **Atrair** — funil “Quanto vale meu imóvel?” com opt-in explícito (Track A).
3. **Compor e responder** — corretor fala rough (PT/ES/EN) → IA gera texto WhatsApp, e-mail e áudio profissional → **aprovação obrigatória** → entrega canal-aware.
4. **Governar** — log de aprovação, CRECI, referência de consentimento — visível para gestora.

**Diferencial:** não prometemos disparo frio automatizado para números de portal (proibido e banível). Automatizamos pesquisa, rascunho e cadências **após consentimento**.

**Estágio atual:** demo funcional (compose desk + agente de voz ao vivo) em https://captei-voz.vercel.app/; documentação legal/compliance (`CRM/docs/captacao/`); estratégia BMAD validada — **pré-incubação com protótipo**, alinhado ao Connect IA.

**O que pedimos:** validação de mercado com imobiliárias reais, BMC, piloto e pitch Demo Day — não investimento em caixa.

---

## Inteligência Artificial (critério — até 40 pts)

A IA é **núcleo da solução**:

| Aplicação de IA | Papel |
|-----------------|--------|
| **STT multilíngue** (AssemblyAI) | Captura fala do corretor em PT/ES/EN, code-switch, ruído de campo |
| **LLM rewrite** | Tom profissional, idioma do proprietário, disclosure CRECI/IA |
| **Voice Agent** | Qualificação conversacional ao vivo pós-opt-in |
| **Síntese de voz** | Nota de voz aprovada (stock voice + aviso) |
| **Scoring de sinais** | Prioriza imóveis com maior probabilidade de captação |
| **Orquestração multicanal** | Seleciona formato (texto / e-mail / voz) conforme estado de consentimento |

**Por que isso é IA aplicada, não wrapper:** restrições de plataforma (Meta WhatsApp, LGPD) exigem **decisão agentica** por canal — a IA adapta conteúdo e roteamento, não só gera texto genérico.

Roadmap: integração Fechou CRM, cadências Track C, Prince speed-to-lead, Divulga para aquisição.

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

- Repositório produto: `C:\Users\Admin\Projects\captei-voz`
- Paperwork: `IntelMuCoCreate/connect-ia/`
- IntelMuCoCreate (AlterEgo/MucoCreate): **fora desta inscrição** — desenvolvimento pausado para o edital
- Hackathon AssemblyAI (30/09): mesmo repo Captei — entrega separada
