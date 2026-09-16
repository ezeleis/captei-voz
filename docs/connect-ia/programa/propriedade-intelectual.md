# Propriedade intelectual — Captei (Connect IA)

Fonte: Edital §14 — `C:\Users\Admin\Projects\1719435285478.pdf`

**Resumo:** IP criada **durante** o programa → titularidade UFSC. Ativos **pré-existentes** comprovados → titulares originais (§14.3).

---

## Regra prática Captei

| Situação | Titularidade |
|----------|--------------|
| Código/docs **antes do kick-off 07/10/2026** | Participantes |
| Melhorias **nas atividades do programa** | UFSC (salvo orientação formal) |
| IP de terceiros (AssemblyAI, Meta) | Licenças dos provedores |

---

## Inventário pré-existente (Captei)

Data referência: **inscrição set/2026**.

### captei-voz (`C:\Users\Admin\Projects\captei-voz`)

| Ativo | Caminho | Descrição |
|-------|---------|-----------|
| Compose desk | `app/compose/` | STT → rewrite → render áudio |
| Qualify agent | `app/qualify/` | Voice Agent AssemblyAI |
| API routes | `app/api/` | stt-token, rewrite, render, voice-token |
| BMAD docs | `docs/bmad/` | product-brief, stress-test, recommended-mvp |
| IDEA-LOCK | `docs/IDEA-LOCK.md` | Regras compliance Track A/B |
| Deploy | captei-voz.vercel.app | Demo pública |

### CRM captação (`C:\Users\Admin\Projects\CRM\docs\captacao\`)

| Ativo | Descrição |
|-------|-----------|
| 01-strategy.md | Track A/B/C, roadmap |
| 02-legal-constraints.md | LGPD, Meta, portal ToS |
| 03-data-model.md | Schema prospecting_signals, contacts |
| 04-decisions-local | Decisões LGPD locais |

### Connect IA paperwork (`docs/connect-ia/` — canonical)

| Ativo | Descrição |
|-------|-----------|
| one-pager, formulário, roteiro | Inscrição Captei |
| feasibility-scorecard | Análise pivot |
| baseline IP tag | `programa/propriedade-intelectual.md` |

Espelho: `IntelMuCoCreate/connect-ia/`.

### Fora desta inscrição (pré-existentes, outros produtos)

| Ativo | Repo | Nota |
|-------|------|------|
| IntelMuCoCreate / AlterEgo | IntelMuCoCreate | Plugin áudio — pausado para edital |
| Prince, Divulga | Projects/ | Composição futura Captei stack |

---

## Nomenclatura

| Nome | Uso |
|------|-----|
| **Captei** | Inscrição Connect IA |
| captei-voz | Nome do repositório / deploy Vercel |
| Fechou | CRM plataforma (integração futura) |

---

## Pós-kick-off (template)

| Data | Entregável | Criado no programa? |
|------|------------|---------------------|
| _[ ]_ | _[ ]_ | S/N |

Confirmar com SINOVA/UFSC antes de comercializar IP gerada no programa.

---

## Baseline pré-programa (Connect IA)

| Campo | Valor |
|-------|-------|
| Tag Git | `connect-ia-baseline-2026-09-16` |
| Commit | `b52149057d05cd96a71fcf12509d326c68634dab` |
| Data | 2026-09-16 |
| Titular | Participantes (pré-kick-off 07/10/2026) |
| Repositório | `github.com/ezeleis/captei-voz` |

Recuperar código: `git checkout connect-ia-baseline-2026-09-16`