# Data Model — Inteligência de Marca Zoomma

> Modelo de dados deste feature. Schema SQL completo está em [`docs/inteligencia-marca-arquitetura.md`](../../docs/inteligencia-marca-arquitetura.md) §5.
> Migration: `supabase/migrations/003_inteligencia_marca.sql` (a ser criada na implementação).

**Date**: 2026-05-11

---

## Visão geral

7 tabelas novas + 2 views + 2 triggers. Reutiliza tabelas existentes: `clients`, `briefings`, `tasks`, `events`.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  TABELAS EXISTENTES (reuso, sem alteração)                               │
│  • clients     — profissional da beleza (tenant_id no SaaS futuro)       │
│  • briefings   — origem da Biblioteca de Marca                           │
│  • tasks       — fila de comunicação entre agentes                       │
│  • events      — log operacional                                         │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│  TABELAS NOVAS (Inteligência de Marca)                                   │
│                                                                            │
│  brand_library                  ← 1:1 com clients                         │
│    └── brand_library_history    ← snapshots (drift detection)             │
│                                                                            │
│  knowledge_articles             ← global, da Zoomma                       │
│    └── brand_knowledge_links    ← N:N com clients                         │
│                                                                            │
│  decision_inbox                 ← itens pendentes de aprovação            │
│    └── decision_log             ← auditoria append-only                   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Entidades

### 1. `brand_library` — Biblioteca de Marca

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | identificador interno |
| client_id | uuid FK clients | tenant; 1 brand_library por cliente (UNIQUE) |
| identidade_visual | jsonb | bloco 1 (logo, paleta, tipografia, estilo) |
| tom_de_voz | jsonb | bloco 2 (palavras-chave, banidas, exemplos, formalidade) |
| posicionamento | jsonb | bloco 3 (proposta valor, diferenciais) |
| audiencia | jsonb | bloco 4 (persona, dores, jornada) |
| catalogo_servicos | jsonb | bloco 5 (serviços, preços, diferenciais técnicos) |
| historico_operacional | jsonb | bloco 6 (sazonalidade, ticket médio) |
| metricas_metas | jsonb | bloco 7 (KPIs, objetivos) |
| especialidades | text[] | extraído de catalogo_servicos para link com Knowledge |
| source_briefing_id | uuid FK briefings | origem da primeira extração |
| version | int | incrementado por trigger em cada UPDATE |
| created_at | timestamptz | |
| updated_at | timestamptz | atualizado por trigger |

**Validation rules**:
- 1 brand_library por client (UNIQUE constraint)
- Os 7 blocos têm `default '{}'::jsonb` — partial extraction permitida
- `especialidades` é gerada pelo agente, alimenta `brand_knowledge_links`

**State transitions**: criada em `INSERT` (agente Brand Library Builder); evolui via `UPDATE` (mudança aprovada pelo sócio); snapshot automático em cada UPDATE.

### 2. `brand_library_history` — snapshots para drift

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | |
| brand_library_id | uuid FK | |
| client_id | uuid FK | denormalizado para query eficiente |
| snapshot | jsonb | estado completo antes do UPDATE |
| changed_blocks | text[] | quais dos 7 blocos mudaram |
| change_summary | text | resumo gerado por Claude (opcional) |
| version | int | versão do snapshot (= version anterior) |
| created_at | timestamptz | |

**Origem**: trigger `trg_brand_library_snapshot` (BEFORE UPDATE em `brand_library`).

### 3. `knowledge_articles` — Knowledge Base global

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | |
| title | text | obrigatório |
| content | text | conteúdo completo (markdown ou texto puro) |
| summary | text | resumo curto gerado por Claude |
| type | text CHECK | um dos 6: 'tecnico', 'comportamento', 'regulamentacao', 'tendencias', 'proprio_zoomma', 'concorrencia' |
| tags | text[] | classificação livre |
| source_type | text CHECK | 'manual', 'tavily', 'web_fetch', 'pdf_upload' |
| source_url | text | URL original, se aplicável |
| source_metadata | jsonb | autor, data publicação, etc |
| approved_by | uuid FK auth.users | sócio que aprovou |
| approved_at | timestamptz | quando aprovado |
| search_vector | tsvector GENERATED | full-text search (peso A=title, B=summary, C=content) |
| created_at | timestamptz | |
| updated_at | timestamptz | trigger |

**Validation rules**:
- `type` restrito por CHECK constraint
- Artigo só fica "ativo" quando `approved_at IS NOT NULL`
- Queries de produção devem filtrar `WHERE approved_at IS NOT NULL`

**Search**: índice GIN em `search_vector` permite `websearch_to_tsquery('portuguese', '...')`.

### 4. `brand_knowledge_links` — relação Cliente ↔ Artigo

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | |
| client_id | uuid FK clients | |
| knowledge_id | uuid FK knowledge_articles | |
| reason | text | "cliente faz microagulhamento" |
| linked_by | uuid FK auth.users | quem aprovou o link |
| created_at | timestamptz | |

**Constraint**: UNIQUE(client_id, knowledge_id) — evita link duplicado.

### 5. `decision_inbox` — Caixa de Decisões

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | |
| type | text CHECK | 'article_suggestion', 'drift_detected', 'brand_update', 'lead', 'alert' |
| title | text | preview na lista |
| summary | text | resumo curto |
| payload | jsonb | dados completos do item |
| related_client_id | uuid FK clients NULL | opcional |
| priority | text CHECK | 'low', 'normal', 'high' |
| source_agent | text | 'knowledge_curator', 'drift_detector', etc |
| source_task_id | uuid FK tasks | task que originou |
| status | text CHECK | 'pending', 'approved', 'rejected', 'expired' |
| resolved_by | uuid FK auth.users | sócio que resolveu |
| resolved_at | timestamptz | |
| resolution_note | text | nota opcional |
| notified_telegram | boolean | default false |
| notified_at | timestamptz | |
| created_at | timestamptz | |
| expires_at | timestamptz NULL | itens com prazo (alertas) |

**State transitions**:
- `pending` → `approved` (efeito colateral: aplica mudança)
- `pending` → `rejected` (efeito colateral: registra log)
- `pending` → `expired` (cron de cleanup, opcional)

**Payload por tipo**:
- `article_suggestion`: `{ article: Partial<KnowledgeArticle>, suggested_links: [{ client_id, reason }] }`
- `drift_detected`: `{ client_id, changed_blocks, before, after, change_summary }`
- `brand_update`: `{ client_id, block, current_value, suggested_value, reason }`
- `lead`: `{ name, contact, source, raw_data }`
- `alert`: `{ severity, metric, current_value, threshold, suggested_action }`

### 6. `decision_log` — auditoria append-only

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid PK | |
| decision_id | uuid FK decision_inbox | |
| action | text CHECK | 'approved', 'rejected', 'edited', 'expired' |
| actor_id | uuid FK auth.users | |
| note | text | |
| payload_snapshot | jsonb | snapshot do payload no momento |
| created_at | timestamptz | |

**Pattern**: append-only — sem UPDATE/DELETE. Garante auditoria imutável.

---

## Views

### `brand_library_full`

Brand library + knowledge linked já agregado. Agentes futuros consultam UMA view.

```sql
select
  bl.*,
  c.name as client_name,
  jsonb_agg(...) as linked_knowledge  -- artigos aprovados linkados
from brand_library bl
join clients c on c.id = bl.client_id
-- left join brand_knowledge_links + knowledge_articles
```

### `decision_inbox_summary`

Contagem agregada para dashboard inicial. Usada pelo card "Caixa de Decisões".

```sql
select type, priority, count(*), min(created_at), max(created_at)
from decision_inbox
where status = 'pending'
group by type, priority;
```

---

## Triggers

### `trg_brand_library_snapshot`
- Quando: `BEFORE UPDATE ON brand_library`
- Faz: insere snapshot em `brand_library_history` + incrementa `version` + calcula `changed_blocks`.

### `trg_brand_library_updated` / `trg_knowledge_updated`
- Quando: `BEFORE UPDATE`
- Faz: atualiza `updated_at = now()`.

---

## RLS (Row Level Security)

Todas tabelas têm RLS habilitado. Policy hoje: `service_role` tem acesso total (Zoomma backend).

```sql
create policy "service_role_all" on <tabela> for all using (true);
```

**Migração futura para SaaS**: adicionar policies por `client_id` quando profissionais fizerem login direto. Knowledge Base permanece sem RLS por client (todos veem).

---

## Volume estimado (12 meses)

| Tabela | Linhas estimadas | Notas |
|--------|------------------|-------|
| `brand_library` | ~50 (1 por cliente Zoomma) | crescimento lento |
| `brand_library_history` | ~500 (10 updates/cliente) | drift + edits |
| `knowledge_articles` | ~200-500 | curadoria contínua |
| `brand_knowledge_links` | ~1000 (10 links/cliente médio) | |
| `decision_inbox` | ~5000 (auto-expire 30 dias) | + alta rotatividade |
| `decision_log` | ~20000 | append-only |

Todos os volumes confortáveis para Postgres + Supabase free tier por bastante tempo.
