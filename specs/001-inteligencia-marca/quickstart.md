# Quickstart — Inteligência de Marca Zoomma

> Guia rápido para o Dev começar a implementação. Estimativa total: ~44h.
> MVP funcional em ~24h (marcos #1 a #8 + #12).

**Date**: 2026-05-11
**Branch**: `001-inteligencia-marca`
**Prerequisites**: Node 20+, npm, acesso ao Supabase, acesso ao Vercel, conta Tavily criada

---

## 0. Antes de começar

### 0.1 Pré-requisitos checados

- [ ] Branch `001-inteligencia-marca` ativa: `git status`
- [ ] Migration `002_briefings.sql` rodada no Supabase (pendência prévia)
- [ ] Conta Tavily criada em https://tavily.com → copiar `TAVILY_API_KEY`

### 0.2 Variável de ambiente nova

Adicionar a 3 lugares:
1. `.env` (root) — para workers
2. `controller/.env.local` — para Next.js
3. **Vercel env vars** (Sensitive) — para produção
4. **Railway env vars** — para workers em produção

```
TAVILY_API_KEY=tvly-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 0.3 Adicionar `CRON_SECRET` ao Vercel

Gerar string aleatória (`openssl rand -hex 32`) e adicionar como env var. Usar para autenticar chamadas do Vercel Cron.

---

## 1. Migração do schema (marco #1, ~1h)

### 1.1 Criar arquivo

```
supabase/migrations/003_inteligencia_marca.sql
```

Conteúdo: copiar exatamente da §5 de `docs/inteligencia-marca-arquitetura.md`.

### 1.2 Rodar no Supabase

Via dashboard Supabase → SQL Editor → colar conteúdo → Run.

Idempotente: pode rodar 2 vezes (uses `if not exists` + `do/exception`).

### 1.3 Validar

Esperado: 7 tabelas novas + 2 views + triggers. Conferir via:
```sql
select tablename from pg_tables where schemaname='public' and tablename like 'brand_%' or tablename like 'knowledge_%' or tablename like 'decision_%';
```

---

## 2. Módulo `shared/brand-library` (marco #2, ~4h)

### 2.1 Estrutura

```
shared/brand-library/
├── index.ts        # exports da API pública
├── extractor.ts    # extrai 7 blocos via Claude (tool_use)
├── prompts.ts      # prompt sistema cacheado (5x desconto)
└── types.ts        # interfaces (copiar de specs/001-.../contracts/brand-library.ts)
```

### 2.2 Implementação mínima

1. `types.ts` — copiar interfaces exatamente do contract.
2. `prompts.ts` — definir prompt sistema longo descrevendo os 7 blocos + cache_control.
3. `extractor.ts` — função `extractBrandFromBriefing(briefingText): Promise<Partial<BrandLibrary>>` chamando Claude com tool_use.
4. `index.ts` — implementar funções da API:
   - `getClientBrand(clientId)`
   - `getClientBrandBlock(clientId, block)`
   - `updateBrandBlock(clientId, block, value, actorId)`
   - `buildFromBriefing(clientId, briefingId)`
   - `getClientBrandWithKnowledge(clientId)`

### 2.3 Smoke test

```bash
npx tsx -e "
import { buildFromBriefing } from './shared/brand-library/index.ts'
await buildFromBriefing('CLIENT_ID_REAL', 'BRIEFING_ID_REAL')
console.log('OK')
"
```

Esperado: registro novo em `brand_library` com os 7 blocos populados.

---

## 3. Worker `brand-library-builder` (marcos #3-#4, ~6h)

### 3.1 Estrutura

```
agents/brand-library-builder/
├── package.json
├── index.ts        # loop de claim+process
└── handler.ts      # lógica do agente
```

### 3.2 Comportamento

1. Loop: `claim_next_task('brand-library-builder')` (RPC já existente).
2. Para cada task com `payload = { client_id, briefing_id }`:
   - Chama `buildFromBriefing()`.
   - Após sucesso, cria task pro `knowledge-curator` com `payload = { client_id, especialidades }`.
   - Atualiza status da task original.

### 3.3 Trigger inicial (Fluxo A — primeira validação real)

Adicionar em `controller/src/app/(dashboard)/clientes/[id]/briefing/briefing-form.tsx`:
- Após `salvarBriefing()` com `completed_at` definido, chamar `POST /api/brand-library` com `{ client_id, briefing_id }`.

### 3.4 Validação manual

Aprovar briefing de cliente teste → verificar logs do worker → conferir que `brand_library` foi populada.

---

## 4. Módulo `shared/knowledge-base` (marco #5, ~4h)

### 4.1 Estrutura

```
shared/knowledge-base/
├── index.ts
├── tavily.ts       # cliente HTTP fino
├── curator.ts      # busca + categoriza + resume
├── prompts.ts      # prompts de classificação por tipo
└── types.ts
```

### 4.2 Implementação mínima

1. `tavily.ts` — função `tavilySearch(params): Promise<TavilyResult>` usando `fetch` nativo. Endpoint: `https://api.tavily.com/search`. Auth: `api_key` no body.
2. `curator.ts` — recebe resultados Tavily, chama Claude para cada resultado: classifica `type`, gera `summary`, extrai `tags`.
3. `index.ts` — API completa:
   - `searchKnowledge(params)` — interno (Postgres full-text)
   - `searchExternal(params)` — Tavily + categorização (NÃO insere)
   - `approveArticle(params)` — usado pelo decision-inbox quando aprova
   - `linkArticleToClient(params)` — cria brand_knowledge_link
   - `suggestForClient(clientId)` — pega especialidades, chama searchExternal, cria decisions

### 4.3 Smoke test

```bash
npx tsx -e "
import { searchExternal } from './shared/knowledge-base/index.ts'
const r = await searchExternal({ query: 'microagulhamento estudos 2025', hint: 'tecnico', maxResults: 3 })
console.log(JSON.stringify(r.articles, null, 2))
"
```

Esperado: 3 sugestões com `title`, `content`, `summary`, `type`, `tags`, `source_url`.

---

## 5. Worker `knowledge-curator` (marco #6, ~4h)

### 5.1 Estrutura

```
agents/knowledge-curator/
├── package.json
├── index.ts
└── handler.ts
```

### 5.2 Comportamento

1. Claim tasks `knowledge-curator`.
2. Payload pode ser:
   - `{ client_id, especialidades }` — cliente novo, sugerir para cada especialidade
   - `{ query, type, max_results }` — busca on-demand pedida pelo sócio
3. Para cada sugestão: cria `decision_inbox` row com `type='article_suggestion'` + payload completo.
4. Ao terminar lote, chama `notifyDecisionsViaTelegram` (do decision-inbox).

### 5.3 Validação manual

Após Fluxo A: confirmar que decisões aparecem na tabela `decision_inbox` + notificação chega no Telegram.

---

## 6. Módulo `shared/decision-inbox` (marco #7, ~3h)

### 6.1 Estrutura

```
shared/decision-inbox/
├── index.ts
├── notifier.ts     # agrupa por tipo, envia 1 mensagem resumo Telegram
└── types.ts
```

### 6.2 Implementação mínima

1. `index.ts` — API completa (criar, listar, aprovar, rejeitar, summary).
2. `approveDecision` é o **coração**: para cada `type`, faz o efeito colateral correto (insere artigo, atualiza brand_library, etc).
3. `notifier.ts` — reusa `shared/telegram` para enviar mensagem agrupada.

### 6.3 Smoke test

Criar decisão manualmente:
```sql
insert into decision_inbox (type, title, summary, payload, priority, source_agent)
values ('article_suggestion', 'Teste', 'Resumo teste', '{}'::jsonb, 'normal', 'test');
```

Chamar `getSummary()` — esperado: total_pending >= 1.

---

## 7. Controller: dashboard inicial + Caixa (marco #8, ~6h)

### 7.1 Alterar `controller/src/app/(dashboard)/page.tsx`

Adicionar card "Caixa de Decisões" mostrando:
- Total pendente
- Breakdown por tipo
- Link "Ver todos" → `/caixa`

### 7.2 Criar `/caixa/page.tsx`

Lista filtrada por tipo/prioridade, botões aprovar/rejeitar inline + batch.

### 7.3 Criar `/caixa/[id]/page.tsx`

Detalhe do item, payload completo formatado por tipo, ações de aprovar/rejeitar com note opcional.

### 7.4 Endpoints API:

- `GET /api/decisions` (list)
- `GET /api/decisions/[id]` (detail)
- `POST /api/decisions/[id]/approve`
- `POST /api/decisions/[id]/reject`
- `POST /api/decisions/batch-approve`

### 7.5 Validação manual

Aprovar uma decisão de tipo `article_suggestion` → conferir que artigo foi criado em `knowledge_articles` + log em `decision_log`.

---

## 8. UI Knowledge Base + Biblioteca de Marca (marcos #9-#10, ~10h)

### 8.1 `/conhecimento/page.tsx`

Lista de artigos aprovados, filtros por type/tags, busca full-text.

### 8.2 `/conhecimento/novo/page.tsx`

Form de upload manual (PDF/URL/texto + title + type + tags). POST `/api/knowledge/upload`.

### 8.3 `/conhecimento/buscar/page.tsx`

Form: query + type hint → POST `/api/knowledge/search` → "X sugestões prontas na Caixa".

### 8.4 `/clientes/[id]/biblioteca/page.tsx`

Tab nova no detalhe do cliente. Mostra os 7 blocos formatados + linked knowledge.

### 8.5 Validação manual

Subir um PDF de microagulhamento, criar artigo. Visitar tab da Biblioteca de cliente — ver linked_knowledge populado.

---

## 9. Drift Detector + Vercel Cron (marco #11, ~4h)

### 9.1 Agente

```
agents/drift-detector/
├── handler.ts      # MVP: detecta mudança de especialidade ou serviços
```

MVP simples: compara `especialidades` atual com snapshot mais recente em `brand_library_history`. Se diferente → cria decision.

### 9.2 Endpoint `/api/cron/drift-detection`

- Verifica `Authorization: Bearer ${CRON_SECRET}`.
- Para cada cliente ativo, chama o handler.
- Retorna stats.

### 9.3 `vercel.json` na raiz do controller

```json
{
  "crons": [
    { "path": "/api/cron/drift-detection", "schedule": "0 6 * * *" }
  ]
}
```

---

## 10. Curadoria inicial — microagulhamento (marco #12, ~2h)

### 10.1 Validação UX end-to-end

1. Acessar `/conhecimento/buscar` → buscar "microagulhamento estudos 2025".
2. Aguardar notificação Telegram com X sugestões.
3. Abrir Caixa de Decisões, revisar cada sugestão.
4. Aprovar 5-10 com fonte confiável; rejeitar resto com nota explicativa.
5. Confirmar que artigos aprovados aparecem em `/conhecimento`.
6. Criar cliente teste com serviço "microagulhamento" → aprovar briefing → conferir Fluxo A completo:
   - Biblioteca criada ✓
   - Especialidades detectadas (`['microagulhamento']`) ✓
   - Knowledge Curator sugeriu mais artigos ✓
   - Decisões na Caixa ✓
   - Aprovação cria brand_knowledge_links ✓
   - Tab Biblioteca do cliente mostra artigos linkados ✓

**MVP entregue. ✅**

---

## Marcos de checkpoint humano

| Após marco | O sócio deve testar |
|------------|---------------------|
| #1 | Conferir tabelas criadas no Supabase Dashboard |
| #4 | Aprovar briefing real → Biblioteca aparece populada |
| #6 | Caixa recebe sugestões; Telegram dispara |
| #8 | Aprovar item na Caixa via UI → efeito colateral acontece |
| #10 | Tab Biblioteca do cliente mostra dados completos + linked knowledge |
| #12 | Validação UX completa do MVP |

---

## Comandos úteis

```bash
# Typecheck do monorepo
npm run typecheck

# Rodar worker localmente
npm run --workspace agents/brand-library-builder dev

# Testar webhook Telegram localmente
npm run telegram:poll

# Aplicar migration localmente (se Supabase CLI configurada)
supabase db push
```

---

## Troubleshooting

**Worker não pega tasks**: confere se `agent_slug` na task = slug usado no `claim_next_task`.
**Tavily 401**: confere `TAVILY_API_KEY` no env do worker.
**Cron não dispara**: confere `vercel.json` no diretório correto + redeploy.
**Telegram não chega**: já validado em produção; confere `TELEGRAM_BOT_TOKEN` no Vercel.
**Migration falha**: verifica se `pgcrypto` está habilitada (a migration habilita, mas pode haver permissão).

---

## Next: gerar tasks executáveis

Após este quickstart estar absorvido, invocar `/speckit-tasks` → gera `tasks.md` com lista de tarefas atômicas em ordem.
