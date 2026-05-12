# Implementation Plan: Inteligência de Marca Zoomma

**Branch**: `001-inteligencia-marca` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-inteligencia-marca/spec.md`
**Architecture reference**: [`docs/inteligencia-marca-arquitetura.md`](../../docs/inteligencia-marca-arquitetura.md)

---

## Summary

Construir três sub-sistemas integrados (Biblioteca de Marca + Knowledge Base + Caixa de Decisões) que transformam o briefing aprovado de cada cliente em inteligência consultável, com validação humana inegociável e arquitetura SaaS-ready para profissionais da beleza. Abordagem técnica: 3 workers em Railway + endpoints no controller Next.js + 7 tabelas novas no Supabase + cliente Tavily para busca web; tudo conectado via tabela `tasks` (anti-Frankenstein).

## Technical Context

**Language/Version**: TypeScript 5.x (Node 20+)
**Primary Dependencies**: Next.js 14, @supabase/supabase-js, @anthropic-ai/sdk, dotenv, zod, undici/fetch nativo, node-telegram-bot-api (ou wrapper interno em shared/telegram)
**Storage**: Supabase (Postgres + RLS) — tabelas: `brand_library`, `brand_library_history`, `knowledge_articles`, `brand_knowledge_links`, `decision_inbox`, `decision_log`; tabelas existentes reutilizadas: `clients`, `briefings`, `tasks`, `events`
**External APIs**: Tavily (`https://api.tavily.com/search`), Anthropic (`claude-sonnet-4-6` para extração, `claude-opus-4-7` opcional), Telegram Bot API (já em produção)
**Testing**: Smoke tests manuais por marco (validação humana via UI); typecheck via `tsc --noEmit`; sem testes automatizados nesta fase (decisão consciente — Rule of Three)
**Target Platform**: Web (Vercel — controller Next.js) + Workers Node.js (Railway) + Cron (Vercel Cron)
**Project Type**: Web application monorepo com workers (controller + agents + shared)
**Performance Goals**: Extração de Biblioteca ≤ 30s; busca Tavily ≤ 10s; dashboard inicial render ≤ 2s p95; cron de drift completa todos os clientes em ≤ 5min
**Constraints**: Custo Tavily ≤ $1/mês com volume previsto; Anthropic ≤ $10/mês com prompt caching ativo; sem timeout de 10s da Vercel para tasks de longa duração (=> Railway workers)
**Scale/Scope**: 7 tabelas novas + 3 workers + ~10 endpoints + ~6 páginas/tabs no controller; total ~44h de trabalho estimado; MVP funcional em ~24h

## Constitution Check

*Constitution file ainda é template (placeholder). Usamos como guarda-corpo lógico:*

1. **Anti-Frankenstein 1 — Compartilhado em `shared/`**:
   - ✅ `shared/brand-library/`, `shared/knowledge-base/`, `shared/decision-inbox/` são módulos compartilhados.
   - ✅ Nenhuma lógica do agente A vive dentro do diretório do agente B.

2. **Anti-Frankenstein 2 — Agentes não importam outros agentes**:
   - ✅ `brand-library-builder` cria task pra `knowledge-curator` via tabela `tasks` — não importa código direto.
   - ✅ `drift-detector` opera independente, cria items na Caixa.

3. **Anti-Frankenstein 3 — Fase fechada antes da próxima**:
   - ✅ Esta é Fase 1; não começamos Fase 2 (agentes de captação) até esta estar estável.

4. **Especialização de agentes (um agente = uma responsabilidade)**:
   - ✅ `brand-library-builder` — extrai a Biblioteca (uma coisa).
   - ✅ `knowledge-curator` — busca/categoriza artigos (uma coisa).
   - ✅ `drift-detector` — detecta mudanças (uma coisa).

5. **Validação humana inegociável**:
   - ✅ Todo output dos agentes passa pela `decision_inbox` antes de virar fato.

**Resultado: GATES OK. Sem violações.**

## Project Structure

### Documentation (this feature)

```
specs/001-inteligencia-marca/
├── plan.md              # Este arquivo
├── spec.md              # Specification (já criado)
├── research.md          # Phase 0 — decisões técnicas consolidadas
├── data-model.md        # Phase 1 — entidades e schema
├── quickstart.md        # Phase 1 — guia rápido pro dev começar
├── contracts/           # Phase 1 — interfaces TS + API endpoints
│   ├── brand-library.ts
│   ├── knowledge-base.ts
│   ├── decision-inbox.ts
│   └── http-api.md
└── tasks.md             # Phase 2 — gerado por /speckit-tasks (depois)
```

### Source Code (repository root)

```
arquiteto_projetos/
├── shared/                                  # Compartilhado entre agentes
│   ├── supabase.ts                          # existente
│   ├── telegram/                            # existente
│   ├── briefing/                            # existente
│   ├── brand-library/                       # NOVO
│   │   ├── index.ts                         # API: getClientBrand, updateBlock, buildFromBriefing
│   │   ├── extractor.ts                     # extrai 7 blocos do briefing via Claude
│   │   ├── prompts.ts                       # prompt sistema cacheado
│   │   └── types.ts                         # IdentidadeVisual, TomDeVoz, ...
│   ├── knowledge-base/                      # NOVO
│   │   ├── index.ts                         # API: searchKnowledge, approveArticle, suggestForClient
│   │   ├── tavily.ts                        # cliente HTTP fino para Tavily
│   │   ├── curator.ts                       # busca + categoriza + resume via Claude
│   │   ├── prompts.ts                       # prompts de categorização
│   │   └── types.ts                         # KnowledgeArticle, BrandKnowledgeLink, ...
│   └── decision-inbox/                      # NOVO
│       ├── index.ts                         # API: createDecision, listPending, approve, reject
│       ├── notifier.ts                      # envia notificação Telegram (reusa shared/telegram)
│       └── types.ts                         # DecisionItem, DecisionType, ...
│
├── agents/                                  # Cada agente isolado
│   ├── brand-library-builder/               # NOVO
│   │   ├── index.ts                         # worker (consome task)
│   │   ├── handler.ts                       # lógica do agente
│   │   └── package.json
│   ├── knowledge-curator/                   # NOVO
│   │   ├── index.ts
│   │   ├── handler.ts
│   │   └── package.json
│   └── drift-detector/                      # NOVO
│       ├── index.ts
│       ├── handler.ts
│       └── package.json
│
├── controller/                              # Next.js — UI
│   └── src/app/
│       ├── (dashboard)/
│       │   ├── page.tsx                     # ALTERAR — incluir resumo Caixa de Decisões
│       │   ├── caixa/                       # NOVO
│       │   │   ├── page.tsx                 # lista completa
│       │   │   └── [id]/page.tsx            # detalhe + ações aprovar/rejeitar
│       │   ├── conhecimento/                # NOVO
│       │   │   ├── page.tsx                 # lista artigos da Knowledge Base
│       │   │   ├── novo/page.tsx            # upload manual
│       │   │   └── buscar/page.tsx          # on-demand search
│       │   └── clientes/[id]/
│       │       └── biblioteca/page.tsx      # NOVO — tab da Biblioteca de Marca
│       └── api/
│           ├── brand-library/route.ts       # NOVO — trigger extração manual
│           ├── knowledge/
│           │   ├── search/route.ts          # NOVO — busca on-demand
│           │   └── upload/route.ts          # NOVO — upload manual
│           ├── decisions/
│           │   ├── route.ts                 # NOVO — list pending
│           │   └── [id]/route.ts            # NOVO — approve/reject
│           └── cron/
│               └── drift-detection/route.ts # NOVO — Vercel Cron
│
└── supabase/migrations/
    ├── 002_briefings.sql                    # existente (pendente de execução)
    └── 003_inteligencia_marca.sql           # NOVO
```

**Structure Decision**: Monorepo com 3 zonas distintas:
- `shared/` = código reusável entre múltiplos consumidores (workers + controller)
- `agents/` = workers isolados, um por responsabilidade
- `controller/` = aplicação Next.js (web app)

Esta estrutura já estava estabelecida no projeto. Apenas adicionamos novos módulos seguindo o padrão. Anti-Frankenstein garantido pela tabela `tasks` como único canal de comunicação entre agentes.

## Complexity Tracking

*Sem violações — não preenchido.*

---

## Phase 0: Research (consolidação de decisões já tomadas)

Output: [`research.md`](./research.md) — todas as decisões técnicas foram tomadas em conversa com Winston (arquiteto) e documentadas. Não há `NEEDS CLARIFICATION` pendentes.

## Phase 1: Design & Contracts

Outputs:
- [`data-model.md`](./data-model.md) — entidades + schema SQL referenciado
- [`contracts/`](./contracts/) — interfaces TypeScript + contratos HTTP
- [`quickstart.md`](./quickstart.md) — guia rápido para o Dev iniciar implementação

## Phase 2: Tasks (NÃO criado por este comando)

Será gerado por `/speckit-tasks` — lista executável de tarefas em ordem de dependência.

---

## Estimated Effort

Detalhado na seção 11 do documento de arquitetura. Resumo:

| Macro | Tempo | Cobertura |
|-------|-------|-----------|
| Fundação (migrations + shared/brand-library) | 5h | #1, #2 |
| Worker brand-library-builder + Fluxo A end-to-end | 6h | #3, #4 |
| Knowledge Base (shared + worker + Tavily) | 8h | #5, #6 |
| Caixa de Decisões (shared + UI dashboard) | 9h | #7, #8 |
| UI Knowledge Base + Biblioteca de Marca | 10h | #9, #10 |
| Drift detector + Vercel Cron | 4h | #11 |
| Curadoria inicial microagulhamento (validação UX completa) | 2h | #12 |
| **Total** | **~44h** | 12 marcos |

**MVP funcional (entrega mínima validável):** ~24h cobrindo marcos #1-#8 + #12.
