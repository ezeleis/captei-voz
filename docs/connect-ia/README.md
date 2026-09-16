# Connect IA — Captei

Documentação e inscrição para o **Programa de Pré-Incubação InPETU Connect IA** (Edital nº 02/2026/InPETU hub/CTC/UFSC).

**Canonical copy for cloud agent:** this folder (`docs/connect-ia/`) in the **captei-voz** repo. Mirror may exist in `IntelMuCoCreate/connect-ia/`.

**Pivot (15/09/2026):** inscrição **Captei** — captação e qualificação, outreach omnichannel.

| Campo | Valor |
|-------|--------|
| **Nome no formulário** | Captei |
| **One-liner** | Copiloto de IA para captação e qualificação de proprietários, com outreach omnichannel (WhatsApp, e-mail, voz) e compliance integrado |
| **Segmento** | PropTech B2B — captação e qualificação imobiliária (outreach omnichannel) |
| **Demo** | https://captei-voz.vercel.app/ |
| **Repo produto** | `C:\Users\Admin\Projects\captei-voz` |
| **Prazo inscrição** | Até **20/09/2026, 23:59** |

## Links oficiais

- [Formulário](https://forms.gle/LSNnsPoCuKFNpdJY7)
- [InPETU oportunidades](https://inpetuhub.sites.ufsc.br/category/oportunidades/)
- Edital PDF: `C:\Users\Admin\Projects\1719435285478.pdf`
- contato@inpetu.com.br

## Equipe formal (máx. 2)

| Papel | Nome | CPF |
|-------|------|-----|
| Representante | Facundo Ezequiel Leis Pou | 244.743.228-35 |
| Integrante 2 | _[preencher]_ | _[preencher]_ |

## Estrutura

```
connect-ia/
├── README.md
├── OVERNIGHT-HANDOFF.md              ← checklist da manhã
├── OVERNIGHT-CLOUD-AGENT-PROMPT.md
├── diagram-export.md
├── pitch-deck-outline.md
├── inscricao/
│   ├── formulario-respostas.md
│   ├── video-roteiro.md
│   └── video-checklist.md
├── proposta/
│   ├── one-pager.md
│   ├── criterios-avaliacao.md
│   ├── feasibility-scorecard.md
│   ├── arquitetura-omnichannel.md
│   └── entrevistas-corretores.md
└── programa/
    ├── cronograma.md
    ├── obrigacoes.md
    └── propriedade-intelectual.md
```

## Checklist submissão (20/09)

### Feito nesta passagem (agente)

- [x] Posicionamento captação-led no formulário, roteiro e one-pager
- [x] Homepage Captei (captação e qualificação) + `/connect-ia`
- [x] Mesa multicanal (Task 2) — verificar deploy público
- [x] Scaffold multi-provedor (`lib/providers/types.ts`)
- [x] Diagrama + outline do deck

### Humano (manhã)

- [ ] 2 entrevistas corretores + citação no vídeo
- [ ] Vídeo ≤ 3 min gravado ([`inscricao/video-roteiro.md`](inscricao/video-roteiro.md))
- [ ] Formulário preenchido ([`inscricao/formulario-respostas.md`](inscricao/formulario-respostas.md))
- [ ] Integrante 2 confirmado
- [ ] Link vídeo testado (aba anônima)
- [ ] Presença presencial FLN confirmada ([`programa/cronograma.md`](programa/cronograma.md))
- [ ] Submit https://forms.gle/LSNnsPoCuKFNpdJY7 antes de 20/09 23:59

Detalhe ordenado: [`OVERNIGHT-HANDOFF.md`](OVERNIGHT-HANDOFF.md).

## Status

| Artefato | Status |
|----------|--------|
| One-pager Captei | Pronto — posicionamento captação-led |
| Formulário rascunho | Pronto — one-liner + hierarquia de dor |
| Roteiro vídeo | Pronto — falta citação entrevista |
| Pitch deck outline | Pronto |
| Diagrama export | Pronto (`diagram-export.md` + SVG) |
| Feasibility scorecard | Pronto |
| Entrevistas corretores | Pendente |
| Vídeo gravado | Pendente |
| Inscrição enviada | Pendente |
| Demo omnichannel (WA / e-mail / áudio) | ✅ Implementado (`/compose/demo`) |
| Homepage rebrand | ✅ Captei · captação e qualificação |
| Página `/connect-ia` | ✅ |
| Provider scaffold | ✅ Tipos + docs; AssemblyAI continua sendo o adapter |

## Paralelo

- **AssemblyAI Hackathon** (30/09/2026): mesmo repo `captei-voz` — headline **Captei Voz** (voice agent + compose desk); vídeo 3–5 min separado.
