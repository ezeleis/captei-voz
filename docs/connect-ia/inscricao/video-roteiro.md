# Roteiro de vídeo — Captei (≤ 3 min)

**Apresentador:** Facundo Ezequiel Leis Pou (CRECI) — representante  
**Formato:** horizontal (16:9), áudio e imagem nítidos  
**Tom:** falado, direto, pt-BR

**Meta de tempo:** ~2 min 40 s – 2 min 55 s

**Demo URL (opcional na tela):** https://captei-voz.vercel.app/

**One-liner (se precisar condensar):**  
Captei — copiloto de IA para captação e qualificação de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado.

---

## Cena sugerida

- Câmera no proponente (peito/cabeça), fundo neutro ou escritório.
- **0:55–1:20:** gravação de tela — homepage Captei + abas da mesa multicanal (WhatsApp | E-mail | Áudio) OU qualify ao vivo.
- **1:25–2:10:** slide ou página `/connect-ia` com diagrama omnichannel ([`../proposta/arquitetura-omnichannel.md`](../proposta/arquitetura-omnichannel.md); export [`../diagram-export.md`](../diagram-export.md)).
- Sem música alta; voz sempre legível.

---

## Texto falado (copiar e ensaiar)

**[0:00 – Abertura]**

Olá. Eu sou **Facundo Leis**, corretor e proponente da iniciativa **Captei**. Vou apresentar nossa proposta para o Connect IA em menos de três minutos.

**[0:12 – Problema]**

No imobiliário, **captação** — conquistar o mandato exclusivo do proprietário — é onde a agência ganha ou perde dinheiro. No dia a dia, o corretor perde negócio no **outbound**: áudio longo no WhatsApp que ninguém ouve até o fim, texto desorganizado, follow-up que some entre WhatsApp, e-mail e telefone. Quem já pediu avaliação — “Quanto vale meu imóvel?” — espera resposta **instantânea e profissional** em português, espanhol ou inglês. E quando alguém tenta automatizar disparo frio, o número WhatsApp Business da imobiliária **cai** — junto com as conversas de clientes reais.

_[INSERIR citação de entrevista — ex.: “Um corretor parceiro me disse: ‘Mando o áudio às dez da noite e no dia seguinte ele nem ouviu.’”]_

**[0:50 – Solução]**

O **Captei** é um copiloto de IA para **captação e qualificação** de proprietários, com outreach omnichannel — WhatsApp, e-mail e voz — e compliance integrado. O corretor fala rough; a IA devolve texto, e-mail e áudio profissional. Nada sai sem **aprovação humana** e registro para a gestora. Automatizamos o que a lei e a Meta permitem; humano onde é obrigatório. **Sem disparo frio.**

**[1:15 – Ampliação]**

Começamos pela **captação** — o gargalo mais caro — mas a mesma mesa serve qualquer outbound qualificado: qualificação de lead, retorno a proprietário, follow-up entre canais.

**[1:25 – IA no centro — ≥ 45 s]**

A **Inteligência Artificial é o motor**, não marketing. Stack **multi-provedor**; AssemblyAI na demo atual:

- **STT multilíngue** captura o que o corretor fala em condições reais.
- **LLM** reescreve tom, registro e idioma do proprietário, com CRECI e aviso de voz digital.
- **Agente de voz** qualifica ao vivo quem já optou pelo funil “Quanto vale meu imóvel?”.
- **Orquestração de canal** decide texto, e-mail ou nota de voz **conforme o consentimento** — porque WhatsApp frio automatizado é proibido e nós **não fazemos isso**.

Já temos **demo funcional** deployada — mesa com três canais e qualificação ao vivo. Estamos em pré-incubação honesta, prontos para validar com imobiliárias em Florianópolis.

**[2:10 – Estágio + mercado]**

Santa Catarina tem milhares de imobiliárias; Florianópolis cresce em volume e tem proprietários estrangeiros. Começamos no Norte da Ilha, com corretores que já validam a dor comigo. Queremos o Connect IA para **teste de mercado**, BMC e mentoria em IA aplicada — não aporte em caixa.

**[2:35 – Fechamento]**

Obrigado. **Captei**: captação e qualificação, omnichannel, com IA e compliance no centro. Até lá.

---

## Contagem

| Bloco | ~Palavras |
|-------|-----------|
| Texto completo (sem placeholder citação) | ~390 |
| Tempo @ 135–145 pal/min | **2:40 – 2:55** |

Substituir bloco _[INSERIR citação]_ após entrevistas ([`../proposta/entrevistas-corretores.md`](../proposta/entrevistas-corretores.md)). Se o ensaio passar de 2:55, cortar a frase de mercado (“Santa Catarina tem milhares…”) — não cortar o bloco de IA nem “sem disparo frio”.

---

## Beats visuais (diagrama omnichannel)

Mostrar na tela durante bloco IA (1:25–2:10):

1. **Track A:** Divulga → landing opt-in → Voice Agent  
2. **Compose:** mic → STT → LLM → {WA | email | áudio} → aprovação  
3. **Track B:** sinais → worklist → humano telefona  
4. **CRM:** log + consent_ref  
5. **Providers:** `compose/` + `consent/` → adaptadores (AssemblyAI hoje)

Exportar diagrama de [`arquitetura-omnichannel.md`](../proposta/arquitetura-omnichannel.md) — ver [`diagram-export.md`](../diagram-export.md).

---

## Checklist roteiro

- [ ] Citação real de corretor inserida
- [ ] Bloco IA ≥ 45 segundos no ensaio
- [ ] Menção explícita: sem disparo frio WA
- [ ] Linha de ampliação (captação → outbound qualificado) ~1:15
- [ ] Demo URL ou screenshot incluído (abas WhatsApp | E-mail | Áudio)
- [ ] Duração total ≤ 3:00
