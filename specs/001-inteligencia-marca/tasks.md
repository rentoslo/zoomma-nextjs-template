---
description: "Task list executável — Inteligência de Marca Zoomma"
---

# Tasks: Inteligência de Marca Zoomma

**Input**: Design documents from `/specs/001-inteligencia-marca/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md
**Source-of-truth docs**: [docs/inteligencia-marca-overview.md](../../docs/inteligencia-marca-overview.md), [docs/inteligencia-marca-arquitetura.md](../../docs/inteligencia-marca-arquitetura.md)

**Tests**: Não solicitados nesta fase. Validação humana por marco substitui testes automatizados (decisão consciente — Rule of Three).

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

## Formato

`- [ ] T### [P?] [Story?] Descrição com caminho do arquivo (≈tempo)`

- **[P]**: paralelizável (arquivos diferentes, sem dependência entre si)
- **[USn]**: pertence à user story n
- **⚠️**: ponto obrigatório de validação humana

## Path Conventions

Monorepo com 3 zonas:
- `shared/` — código compartilhado
- `agents/` — workers isolados
- `controller/src/` — Next.js (web + API)
- `supabase/migrations/` — schema

---

## User Stories (mapeamento de prioridades)

| Story | Prioridade | Cenário do spec | Marcos do quickstart | Tempo |
|-------|------------|-----------------|----------------------|-------|
| **US1** | **P1 (MVP)** 🎯 | Cenário A — Cliente novo entra (fluxo end-to-end completo) | #1, #2, #3, #4, #7, #8 (parte), #12 (parte) | ~24h |
| **US2** | P2 | Cenário B — Sócio pede conhecimento on-demand | #5, #6, #9, #10, #12 (parte) | ~12h |
| **US3** | P3 | Cenário C — Detecção de drift | #11 | ~4h |

**Total**: ~44h. MVP funcional (US1 + Setup + Foundational): ~27h.

---

## Phase 1: Setup (Shared Infrastructure) — ~1h

**Purpose**: Configuração de variáveis de ambiente e pré-requisitos externos.

- [ ] T001 Criar conta Tavily em https://tavily.com e copiar `TAVILY_API_KEY` (~10min)
- [ ] T002 [P] Adicionar `TAVILY_API_KEY` em `.env` (root do monorepo) (~2min)
- [ ] T003 [P] Adicionar `TAVILY_API_KEY` em `controller/.env.local` (~2min)
- [ ] T004 [P] Adicionar `TAVILY_API_KEY` no painel Vercel (env vars Sensitive) (~3min)
- [ ] T005 [P] Adicionar `TAVILY_API_KEY` no painel Railway (~3min)
- [ ] T006 [P] Gerar `CRON_SECRET` (`openssl rand -hex 32`) e adicionar no Vercel (~3min)
- [ ] T007 ⚠️ Validação humana: confirmar que `TAVILY_API_KEY` está nos 4 lugares + `CRON_SECRET` no Vercel

**Pronto quando**: todas as variáveis configuradas; comando `echo $TAVILY_API_KEY` retorna valor em qualquer ambiente.

---

## Phase 2: Foundational (Blocking Prerequisites) — ~2h

**Purpose**: Schema do banco precisa existir antes de qualquer code rodar.

**⚠️ CRITICAL**: Nenhuma user story pode começar até esta fase estar completa.

- [ ] T008 ⚠️ Verificar se migration `supabase/migrations/002_briefings.sql` já foi rodada no Supabase (pendência prévia). Se não, rodar agora. (~10min)
- [ ] T009 Criar arquivo `supabase/migrations/003_inteligencia_marca.sql` copiando o SQL completo da Seção 5 de [docs/inteligencia-marca-arquitetura.md](../../docs/inteligencia-marca-arquitetura.md) (~15min)
- [ ] T010 Rodar migration 003 no Supabase Dashboard (SQL Editor → colar → Run). Idempotente. (~10min)
- [ ] T011 ⚠️ Validação humana: no Supabase Dashboard, conferir que existem 7 tabelas (`brand_library`, `brand_library_history`, `knowledge_articles`, `brand_knowledge_links`, `decision_inbox`, `decision_log`) + 2 views (`brand_library_full`, `decision_inbox_summary`) + RLS habilitada em todas. (~10min)

**Checkpoint**: Foundation pronta — User Stories podem começar.

---

## Phase 3: User Story 1 — Cliente novo entra (P1) 🎯 MVP — ~24h

**Goal**: Cliente novo é aprovado no briefing → sistema extrai automaticamente Biblioteca de Marca (7 blocos) → identifica especialidades → busca artigos via Tavily → cria itens na Caixa de Decisões → sócio aprova → artigos ficam vinculados ao cliente.

**Independent Test**: Aprovar briefing de um cliente teste (especialidade "microagulhamento") via UI existente → aguardar 60s → conferir que `brand_library` tem registro + `decision_inbox` tem itens pendentes + Telegram disparou notificação → aprovar 3 artigos via UI da Caixa → conferir que `knowledge_articles` + `brand_knowledge_links` foram populados.

### Subgrupo A — `shared/brand-library/` (~4h)

- [ ] T012 [P] [US1] Criar [shared/brand-library/types.ts](../../shared/brand-library/types.ts) copiando exatamente as interfaces de [contracts/brand-library.ts](contracts/brand-library.ts) (~20min)
- [ ] T013 [P] [US1] Criar [shared/brand-library/prompts.ts](../../shared/brand-library/prompts.ts) com prompt sistema longo descrevendo os 7 blocos + `cache_control: { type: 'ephemeral' }` para ativar prompt caching (~45min)
- [ ] T014 [US1] Criar [shared/brand-library/extractor.ts](../../shared/brand-library/extractor.ts) — função `extractBrandFromBriefing(briefingText, transcript): Promise<Partial<BrandLibrary>>` chamando Claude com `tool_use` retornando os 7 blocos em JSON estruturado. Modelo: `claude-sonnet-4-6`. Depende de T012, T013. (~1h30)
- [ ] T015 [US1] Criar [shared/brand-library/index.ts](../../shared/brand-library/index.ts) implementando as 5 funções da `BrandLibraryAPI`: `getClientBrand`, `getClientBrandBlock`, `updateBrandBlock`, `buildFromBriefing`, `getClientBrandWithKnowledge`. Depende de T012, T014. (~1h30)

### Subgrupo B — `shared/decision-inbox/` (~3h)

- [ ] T016 [P] [US1] Criar [shared/decision-inbox/types.ts](../../shared/decision-inbox/types.ts) copiando exatamente de [contracts/decision-inbox.ts](contracts/decision-inbox.ts) (~15min)
- [ ] T017 [US1] Criar [shared/decision-inbox/notifier.ts](../../shared/decision-inbox/notifier.ts) — função `notifyDecisionsViaTelegram(items: DecisionItem[])` agrupa por tipo, envia 1 mensagem resumo via `shared/telegram`, marca `notified_telegram=true` no banco. Depende de T016. (~45min)
- [ ] T018 [US1] Criar [shared/decision-inbox/index.ts](../../shared/decision-inbox/index.ts) implementando `DecisionInboxAPI`: `createDecision`, `listPending`, `approveDecision` (com efeitos colaterais por tipo), `rejectDecision`, `getSummary`. Depende de T016, T017. (~1h30)

### Subgrupo C — `shared/knowledge-base/` (~4h)

- [ ] T019 [P] [US1] Criar [shared/knowledge-base/types.ts](../../shared/knowledge-base/types.ts) copiando de [contracts/knowledge-base.ts](contracts/knowledge-base.ts) (~15min)
- [ ] T020 [P] [US1] Criar [shared/knowledge-base/tavily.ts](../../shared/knowledge-base/tavily.ts) — cliente HTTP fino via `fetch` nativo, endpoint `https://api.tavily.com/search`. Função: `tavilySearch(params): Promise<TavilyResult>`. (~45min)
- [ ] T021 [P] [US1] Criar [shared/knowledge-base/prompts.ts](../../shared/knowledge-base/prompts.ts) — prompts Claude para: classificar artigo em `KnowledgeType`, gerar `summary` curto, extrair `tags`. (~30min)
- [ ] T022 [US1] Criar [shared/knowledge-base/curator.ts](../../shared/knowledge-base/curator.ts) — função `curateArticle(tavilyResult): Promise<Partial<KnowledgeArticle>>` que recebe resultado Tavily e chama Claude para classificar/resumir/tagear. Depende de T019, T020, T021. (~1h)
- [ ] T023 [US1] Criar [shared/knowledge-base/index.ts](../../shared/knowledge-base/index.ts) implementando `KnowledgeBaseAPI`: `searchKnowledge` (Postgres full-text), `getArticle`, `approveArticle`, `linkArticleToClient`, `searchExternal` (Tavily), `suggestForClient`. Depende de T022. (~1h30)

### Subgrupo D — Workers (~6h)

- [ ] T024 [P] [US1] Criar pasta [agents/brand-library-builder/](../../agents/brand-library-builder/) com `package.json` + `index.ts` (loop de claim) + `handler.ts` (chama `buildFromBriefing` do shared, depois enfileira task pro knowledge-curator com `payload={client_id, especialidades}`). Depende de T015. (~3h)
- [ ] T025 [P] [US1] Criar pasta [agents/knowledge-curator/](../../agents/knowledge-curator/) com `package.json` + `index.ts` + `handler.ts`. Payload suportado: `{ client_id, especialidades }` (cliente novo) ou `{ query, type?, max_results?, client_id_link? }` (on-demand). Para cada sugestão, cria item em `decision_inbox`. Ao terminar, chama `notifyDecisionsViaTelegram`. Depende de T018, T023. (~3h)

### Subgrupo E — Integração com briefing existente (~1h)

- [ ] T026 [US1] Modificar [controller/src/app/(dashboard)/clientes/[id]/briefing/briefing-form.tsx](../../controller/src/app/(dashboard)/clientes/[id]/briefing/briefing-form.tsx) — após `salvarBriefing()` com `completed_at`, chamar `POST /api/brand-library` com `{ client_id, briefing_id }`. (~20min)
- [ ] T027 [P] [US1] Criar [controller/src/app/api/brand-library/route.ts](../../controller/src/app/api/brand-library/route.ts) — POST que cria task `brand-library-builder` no Supabase. (~30min)

### Subgrupo F — API + UI Caixa de Decisões (~7h)

- [ ] T028 [P] [US1] Criar [controller/src/app/api/decisions/route.ts](../../controller/src/app/api/decisions/route.ts) — `GET` com filtros `?status&type&priority&client_id`. Usa `listPending` + `getSummary`. (~45min)
- [ ] T029 [P] [US1] Criar [controller/src/app/api/decisions/[id]/route.ts](../../controller/src/app/api/decisions/[id]/route.ts) — `GET` detail. (~30min)
- [ ] T030 [P] [US1] Criar [controller/src/app/api/decisions/[id]/approve/route.ts](../../controller/src/app/api/decisions/[id]/approve/route.ts) — `POST` aprova + efeito colateral. (~45min)
- [ ] T031 [P] [US1] Criar [controller/src/app/api/decisions/[id]/reject/route.ts](../../controller/src/app/api/decisions/[id]/reject/route.ts) — `POST` rejeita. (~30min)
- [ ] T032 [US1] Modificar [controller/src/app/(dashboard)/page.tsx](../../controller/src/app/(dashboard)/page.tsx) — adicionar Card "Caixa de Decisões" no topo com total pendente + breakdown por tipo + link "Ver todos". (~1h30)
- [ ] T033 [P] [US1] Criar [controller/src/app/(dashboard)/caixa/page.tsx](../../controller/src/app/(dashboard)/caixa/page.tsx) — lista filtrada (type, priority), botões aprovar/rejeitar inline. (~1h30)
- [ ] T034 [P] [US1] Criar [controller/src/app/(dashboard)/caixa/[id]/page.tsx](../../controller/src/app/(dashboard)/caixa/[id]/page.tsx) — detalhe do item, payload formatado por tipo, ações com `note` opcional. (~1h30)

### Subgrupo G — Validação end-to-end (~1h)

- [ ] T035 ⚠️ [US1] **Validação humana**: criar cliente teste com serviço "microagulhamento", subir transcrição de briefing fictícia → aprovar via UI → aguardar 60s → conferir manualmente:
  - `brand_library` populada com 7 blocos
  - `especialidades` contém `['microagulhamento']`
  - `decision_inbox` tem ≥3 itens `article_suggestion`
  - Telegram recebeu notificação
  - Aprovar 3 itens via `/caixa/[id]`
  - `knowledge_articles` ganhou 3 registros aprovados
  - `brand_knowledge_links` tem 3 links pro cliente
  - `decision_log` registrou as 3 aprovações

**Checkpoint US1**: MVP funcional. Pode ser entregue/demo. ✅

---

## Phase 4: User Story 2 — Sócio pede conhecimento on-demand (P2) — ~12h

**Goal**: Sócio (via interface web) pede "quero artigos sobre X" → sistema busca via Tavily, categoriza → itens aparecem na Caixa para validação → aprovação alimenta a Knowledge Base.

**Independent Test**: Acessar `/conhecimento/buscar` → buscar "microagulhamento estudos 2025" → aguardar 30s → conferir que 5-10 itens apareceram na Caixa → aprovar 5 (batch) → conferir que aparecem em `/conhecimento`.

### Subgrupo A — Endpoints de busca/upload (~3h)

- [ ] T036 [P] [US2] Criar [controller/src/app/api/knowledge/search/route.ts](../../controller/src/app/api/knowledge/search/route.ts) — `POST` cria task `knowledge-curator` com payload de busca on-demand. (~1h)
- [ ] T037 [P] [US2] Criar [controller/src/app/api/knowledge/upload/route.ts](../../controller/src/app/api/knowledge/upload/route.ts) — `POST` multipart, aceita PDF/URL/texto. Insere artigo direto em `knowledge_articles` com `approved_at` (upload manual = pré-aprovado). (~1h30)
- [ ] T038 [P] [US2] Criar [controller/src/app/api/decisions/batch-approve/route.ts](../../controller/src/app/api/decisions/batch-approve/route.ts) — aprova vários `decisionIds` em uma única transação. (~45min)

### Subgrupo B — UI Knowledge Base (~5h)

- [ ] T039 [P] [US2] Criar [controller/src/app/(dashboard)/conhecimento/page.tsx](../../controller/src/app/(dashboard)/conhecimento/page.tsx) — lista de artigos aprovados, filtros por type/tags, busca full-text via `searchKnowledge`. (~2h)
- [ ] T040 [P] [US2] Criar [controller/src/app/(dashboard)/conhecimento/novo/page.tsx](../../controller/src/app/(dashboard)/conhecimento/novo/page.tsx) — formulário upload manual (PDF/URL/texto + title + type + tags). POST para `/api/knowledge/upload`. (~1h30)
- [ ] T041 [P] [US2] Criar [controller/src/app/(dashboard)/conhecimento/buscar/page.tsx](../../controller/src/app/(dashboard)/conhecimento/buscar/page.tsx) — form (query + type + max_results) → POST `/api/knowledge/search` → mostra "X sugestões prontas na Caixa". (~1h30)

### Subgrupo C — UI Biblioteca de Marca (~3h)

- [ ] T042 [US2] Criar [controller/src/app/(dashboard)/clientes/[id]/biblioteca/page.tsx](../../controller/src/app/(dashboard)/clientes/[id]/biblioteca/page.tsx) — tab nova no detalhe do cliente. Renderiza os 7 blocos formatados + lista de `linked_knowledge` (usa view `brand_library_full`). (~2h30)
- [ ] T043 [US2] Adicionar tab "Biblioteca" em [controller/src/app/(dashboard)/clientes/[id]/client-tabs.tsx](../../controller/src/app/(dashboard)/clientes/[id]/client-tabs.tsx) (~30min)

### Subgrupo D — Validação on-demand (~1h)

- [ ] T044 ⚠️ [US2] **Validação humana**: acessar `/conhecimento/buscar` → buscar "microagulhamento" → curar 5-10 artigos:
  - Itens aparecem na Caixa em ≤30s
  - Telegram notifica
  - Aprovar 5 em batch
  - Rejeitar 2 com nota explicativa ("fonte fraca")
  - Conferir que 5 artigos aparecem em `/conhecimento`
  - Visitar tab Biblioteca do cliente teste — ver linked_knowledge populado

**Checkpoint US2**: Knowledge Base on-demand operacional + UI completa. ✅

---

## Phase 5: User Story 3 — Detecção de drift (P3) — ~4h

**Goal**: Cron diário roda análise de cada cliente → detecta mudança significativa → cria item na Caixa para sócio aprovar/rejeitar.

**Independent Test**: Modificar manualmente `especialidades` de um cliente no Supabase para simular drift → chamar endpoint `/api/cron/drift-detection` com `Authorization: Bearer ${CRON_SECRET}` → conferir item `drift_detected` na Caixa.

- [ ] T045 [P] [US3] Criar [agents/drift-detector/](../../agents/drift-detector/) — `package.json` + `index.ts` + `handler.ts`. MVP simples: compara `especialidades` atuais vs snapshot mais recente em `brand_library_history`. Se diferente → cria `decision_inbox` com type='drift_detected'. (~1h30)
- [ ] T046 [P] [US3] Criar [controller/src/app/api/cron/drift-detection/route.ts](../../controller/src/app/api/cron/drift-detection/route.ts) — valida `Authorization: Bearer ${CRON_SECRET}`, itera clientes ativos, chama handler. Retorna stats. (~1h)
- [ ] T047 [P] [US3] Adicionar configuração de cron em [controller/vercel.json](../../controller/vercel.json):
  ```json
  {
    "crons": [
      { "path": "/api/cron/drift-detection", "schedule": "0 6 * * *" }
    ]
  }
  ```
  (~10min)
- [ ] T048 ⚠️ [US3] **Validação humana**: forçar drift em cliente teste (alterar especialidades direto no SQL ou via UI) → chamar endpoint manualmente → conferir item `drift_detected` na Caixa com `change_summary` gerado por Claude. Aguardar primeira execução automática no dia seguinte às 03h BRT. (~1h)

**Checkpoint US3**: Drift detection automático funcionando. ✅

---

## Phase 6: Polish & Cross-Cutting Concerns — ~2h

**Purpose**: Limpeza, documentação, validação geral.

- [ ] T049 [P] Rodar `npm run typecheck` no monorepo. Resolver qualquer erro de tipos. (~30min)
- [ ] T050 [P] Atualizar [CLAUDE.md](../../CLAUDE.md) na seção "Arquitetura de pastas" para incluir `shared/brand-library`, `shared/knowledge-base`, `shared/decision-inbox`, `agents/brand-library-builder`, `agents/knowledge-curator`, `agents/drift-detector`. (~15min)
- [ ] T051 Rodar [quickstart.md](quickstart.md) completo do início ao fim como smoke test final. Cada passo deve funcionar sem ajustes. (~45min)
- [ ] T052 Limpar console.log/comments temporários nos arquivos modificados. (~15min)
- [ ] T053 ⚠️ Validação humana final: revisar a lista de critérios de aceitação em [spec.md §Acceptance Criteria](spec.md) — todos marcados como ✅. (~10min)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
   ↓
Phase 2 (Foundational) ⚠️ BLOCKER
   ↓
Phase 3 (US1 / MVP) ────┐
   ↓                    │
Phase 4 (US2) ──────────┤  (US2 e US3 podem rodar em paralelo após US1)
Phase 5 (US3) ──────────┘
   ↓
Phase 6 (Polish)
```

### Dentro de US1 (Phase 3)

- Subgrupos A, B, C podem rodar em **paralelo** (são `shared/` independentes)
- Subgrupos D (workers) dependem de A, B, C completos
- Subgrupos E, F dependem de A, B, C completos
- Subgrupo G (validação) é o último

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 paralelos
- **Phase 3 Subgrupo A**: T012, T013 paralelos; T014 depende deles; T015 depende de T014
- **Phase 3 Subgrupo B**: T016 paralelo; T017 depende; T018 depende
- **Phase 3 Subgrupo C**: T019, T020, T021 paralelos; T022 depende; T023 depende
- **Phase 3 Subgrupos D, E, F**: podem rodar em paralelo entre si após A/B/C
- **Phase 4 Subgrupos A, B**: paralelos entre si
- **Phase 5**: T045, T046, T047 paralelos entre si

---

## Parallel Example: US1 Subgrupo A (`shared/brand-library/`)

```bash
# T012 e T013 podem rodar em paralelo (arquivos diferentes):
Task: "Criar shared/brand-library/types.ts copiando de contracts/brand-library.ts"
Task: "Criar shared/brand-library/prompts.ts com prompt sistema cacheado"

# Depois, T014 (depende de ambos):
Task: "Criar shared/brand-library/extractor.ts"

# Por fim, T015 (depende de T014):
Task: "Criar shared/brand-library/index.ts com API completa"
```

---

## Implementation Strategy

### MVP First (apenas US1)

1. ✅ Completar Phase 1 (Setup) — ~1h
2. ✅ Completar Phase 2 (Foundational) — ~2h  
3. ✅ Completar Phase 3 (US1) — ~24h
4. ⚠️ **STOP & VALIDATE**: T035 — testar Fluxo A end-to-end com cliente real
5. **Deploy/Demo MVP!** (Total acumulado: ~27h)

### Incremental Delivery

1. **Sprint 1 (~27h)**: Setup + Foundational + US1 → MVP
2. **Sprint 2 (~12h)**: US2 → Knowledge Base on-demand + UI completa
3. **Sprint 3 (~4h)**: US3 → Drift detection
4. **Sprint 4 (~2h)**: Polish

### Solo Dev Strategy (você)

Sequencial, respeitando dependências. Pause em cada `⚠️` para validar manualmente antes de seguir.

---

## Anti-Frankenstein Compliance

✅ **Regra 1** — Compartilhado em `shared/`:
- `shared/brand-library/`, `shared/knowledge-base/`, `shared/decision-inbox/` são consumidos por workers + controller.

✅ **Regra 2** — Agentes não importam outros agentes:
- `brand-library-builder` enfileira task pro `knowledge-curator` via tabela `tasks` (T024).
- `drift-detector` opera independente (T045).
- Nenhum `import` cruzado entre `agents/X/` e `agents/Y/`.

✅ **Regra 3** — Fase fechada antes da próxima:
- US2 e US3 só começam após US1 validado.
- Fase 2 (captação) só começa após esta toda estável.

✅ **Especialização**:
- `brand-library-builder` = extrai a Biblioteca (uma coisa).
- `knowledge-curator` = busca/categoriza artigos (uma coisa).
- `drift-detector` = detecta mudanças (uma coisa).

---

## Validation Checkpoints (⚠️ obrigatórios)

| Task | O que validar |
|------|---------------|
| T007 | Variáveis de ambiente em todos os ambientes |
| T011 | Schema do Supabase criado corretamente |
| T035 | Fluxo A completo end-to-end (cliente novo → Biblioteca → Caixa → aprovação) |
| T044 | Fluxo B completo (busca on-demand → curadoria → Knowledge Base) |
| T048 | Fluxo C (drift detection automático) |
| T053 | Acceptance criteria da spec.md todos ✅ |

---

## Notas

- Tarefas marcadas com `[P]` são paralelizáveis: arquivos diferentes, sem dependência mútua.
- Critérios de "pronto" embutidos em cada task (caminho exato + comportamento esperado).
- Commit após cada subgrupo da Phase 3 (5-7 commits em US1).
- Pode parar em qualquer checkpoint ⚠️ para validar.
- Se algo quebrar: identificar a task que introduziu, reverter, corrigir, retomar.

---

## Resumo de tarefas

| Phase | Tasks | Tempo total | Validação humana |
|-------|-------|-------------|------------------|
| 1 — Setup | T001-T007 (7 tasks) | ~1h | T007 |
| 2 — Foundational | T008-T011 (4 tasks) | ~2h | T011 |
| 3 — US1 (MVP) 🎯 | T012-T035 (24 tasks) | ~24h | T035 |
| 4 — US2 | T036-T044 (9 tasks) | ~12h | T044 |
| 5 — US3 | T045-T048 (4 tasks) | ~4h | T048 |
| 6 — Polish | T049-T053 (5 tasks) | ~2h | T053 |
| **Total** | **53 tasks** | **~45h** | **6 checkpoints** |
