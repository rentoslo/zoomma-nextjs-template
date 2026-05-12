# Arquitetura — Inteligência de Marca Zoomma

> **Documento técnico** que define como o sistema da [Inteligência de Marca](inteligencia-marca-overview.md) será implementado.
> Toda dúvida estrutural durante a implementação deve consultar este arquivo.

**Versão:** 1.0
**Data:** 2026-05-11
**Arquiteto responsável:** Winston (via BMad)
**Status:** Aprovado para implementação
**Documento de referência (negócio):** `docs/inteligencia-marca-overview.md`

---

## 1. Visão geral em uma frase

Um sistema de três camadas — **Biblioteca de Marca por cliente**, **Knowledge Base global da Zoomma** e **Caixa de Decisões operacional** — que transforma briefings em inteligência consultável, com validação humana inegociável e arquitetura SaaS-ready para profissionais da beleza.

---

## 2. Princípios arquiteturais

1. **Boring technology.** Postgres, Next.js, Supabase. Nada exótico.
2. **Validação humana é estado, não exceção.** Tudo que vem de IA passa pela Caixa antes de virar fato.
3. **Multi-tenant pela tabela `clients`.** Hoje a Zoomma gerencia N clientes; amanhã cada cliente faz login no SaaS — sem refatoração.
4. **Knowledge Base é global da Zoomma.** Sem tenant_id. Curadoria centralizada cria valor de rede.
5. **Anti-Frankenstein.** Compartilhado em `shared/`. Exclusivo no agente. Agente nunca importa outro agente — comunicação via tabela `tasks`.
6. **Rule of Three.** Não abstraio antes de ver o padrão repetir 3 vezes.

---

## 3. Modelo conceitual

```
┌─────────────────────────────────────────────────────────────┐
│  ZOOMMA (operadora — hoje agência, amanhã SaaS provider)    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  KNOWLEDGE BASE (global — alimenta todos)          │    │
│  │  • Técnico • Comportamento • Regulamentação        │    │
│  │  • Tendências • Próprio Zoomma • Concorrência     │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          │ vincula via                     │
│                          │ brand_knowledge_links           │
│                          ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  CLIENTES (tenants)                                │    │
│  │  ┌─────────────────┐  ┌─────────────────┐         │    │
│  │  │ Cliente A       │  │ Cliente B       │         │    │
│  │  │ ─────────────── │  │ ─────────────── │         │    │
│  │  │ Brand Library   │  │ Brand Library   │  ...    │    │
│  │  │  (7 blocos)     │  │  (7 blocos)     │         │    │
│  │  └─────────────────┘  └─────────────────┘         │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  CAIXA DE DECISÕES (operacional Zoomma)            │    │
│  │  • Sugestões de artigos • Drift • Brand updates    │    │
│  │  • Leads • Alertas                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Entidades e relações

| Entidade | Cardinalidade | Descrição |
|----------|---------------|-----------|
| `clients` | já existe | Profissional da beleza atendido pela Zoomma (vira tenant no SaaS) |
| `briefings` | 1:1 com cliente | Já existe — fonte da Biblioteca |
| `brand_library` | 1:1 com cliente | 7 blocos estruturados de inteligência |
| `knowledge_articles` | N (global) | Artigos curados pela Zoomma |
| `brand_knowledge_links` | N:N entre brand_library e knowledge_articles | Vincula artigos relevantes a cada cliente |
| `decision_inbox` | N | Itens pendentes de aprovação humana |
| `decision_log` | N | Auditoria append-only de decisões resolvidas |
| `brand_library_history` | N | Snapshots da Biblioteca para detecção de drift |
| `tasks` | já existe | Fila de trabalho dos agentes (reuso) |

---

## 5. Schema SQL completo

Migration: `supabase/migrations/003_inteligencia_marca.sql`

```sql
-- =============================================================
-- 003_inteligencia_marca.sql
-- Schema para Biblioteca de Marca + Knowledge Base + Caixa de Decisões
-- Idempotente — pode rodar 2 vezes sem quebrar.
-- =============================================================

-- ─── Habilitar extensões necessárias ──────────────────────────
create extension if not exists pgcrypto;       -- gen_random_uuid
create extension if not exists pg_trgm;        -- busca fuzzy

-- =============================================================
-- BIBLIOTECA DE MARCA — 1 por cliente, 7 blocos estruturados
-- =============================================================

create table if not exists brand_library (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  
  -- 7 blocos como JSONB independentes (facilita query e evolução)
  identidade_visual jsonb not null default '{}'::jsonb,
  tom_de_voz jsonb not null default '{}'::jsonb,
  posicionamento jsonb not null default '{}'::jsonb,
  audiencia jsonb not null default '{}'::jsonb,
  catalogo_servicos jsonb not null default '{}'::jsonb,
  historico_operacional jsonb not null default '{}'::jsonb,
  metricas_metas jsonb not null default '{}'::jsonb,
  
  -- Metadata
  especialidades text[] not null default '{}',      -- ['microagulhamento', 'botox', ...]
  source_briefing_id uuid references briefings(id), -- de onde veio a primeira extração
  version int not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- 1 brand_library por cliente
  unique(client_id)
);

create index if not exists idx_brand_library_client on brand_library(client_id);
create index if not exists idx_brand_library_especialidades on brand_library using gin(especialidades);

-- =============================================================
-- HISTÓRICO DE BIBLIOTECA — snapshots para detecção de drift
-- =============================================================

create table if not exists brand_library_history (
  id uuid primary key default gen_random_uuid(),
  brand_library_id uuid not null references brand_library(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  snapshot jsonb not null,    -- estado completo da biblioteca naquele momento
  changed_blocks text[],      -- ['tom_de_voz', 'posicionamento']
  change_summary text,        -- resumo gerado por Claude do que mudou
  version int not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_brand_history_client on brand_library_history(client_id);
create index if not exists idx_brand_history_created on brand_library_history(created_at desc);

-- =============================================================
-- KNOWLEDGE BASE — global, da Zoomma
-- =============================================================

create table if not exists knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  
  -- Conteúdo
  title text not null,
  content text not null,                    -- conteúdo completo (texto, markdown)
  summary text,                              -- resumo curto gerado por Claude
  
  -- Classificação
  type text not null check (type in (
    'tecnico',           -- estudos, procedimentos
    'comportamento',     -- consumidor, mercado
    'regulamentacao',    -- Anvisa, FDA, normas
    'tendencias',        -- TikTok, lançamentos
    'proprio_zoomma',    -- copies vencedoras, calls
    'concorrencia'       -- outras clínicas/agências
  )),
  tags text[] not null default '{}',
  
  -- Origem
  source_type text not null check (source_type in ('manual', 'tavily', 'web_fetch', 'pdf_upload')),
  source_url text,                           -- URL original (se aplicável)
  source_metadata jsonb default '{}'::jsonb, -- author, publish_date, etc
  
  -- Curadoria
  approved_by uuid references auth.users(id),
  approved_at timestamptz,
  
  -- Busca full-text (gerada automaticamente)
  search_vector tsvector generated always as (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(content, '')), 'C')
  ) stored,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_knowledge_type on knowledge_articles(type);
create index if not exists idx_knowledge_tags on knowledge_articles using gin(tags);
create index if not exists idx_knowledge_search on knowledge_articles using gin(search_vector);
create index if not exists idx_knowledge_approved on knowledge_articles(approved_at desc) where approved_at is not null;

-- =============================================================
-- LINKS BIBLIOTECA ↔ KNOWLEDGE — quais artigos importam pra cada cliente
-- =============================================================

create table if not exists brand_knowledge_links (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  knowledge_id uuid not null references knowledge_articles(id) on delete cascade,
  reason text,                                -- "cliente faz microagulhamento"
  linked_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  
  unique(client_id, knowledge_id)
);

create index if not exists idx_brand_knowledge_client on brand_knowledge_links(client_id);
create index if not exists idx_brand_knowledge_knowledge on brand_knowledge_links(knowledge_id);

-- =============================================================
-- CAIXA DE DECISÕES — itens pendentes de validação humana
-- =============================================================

create table if not exists decision_inbox (
  id uuid primary key default gen_random_uuid(),
  
  -- Tipo da decisão
  type text not null check (type in (
    'article_suggestion',  -- artigo sugerido para Knowledge Base
    'drift_detected',      -- mudança detectada no perfil do cliente
    'brand_update',        -- sugestão de atualização na Brand Library
    'lead',                -- prospect captado pelo agente
    'alert'                -- alerta de performance
  )),
  
  -- Conteúdo
  title text not null,                        -- ex: "Novo artigo sobre microagulhamento"
  summary text not null,                      -- resumo curto para preview na lista
  payload jsonb not null,                     -- dados completos do item
  
  -- Contexto
  related_client_id uuid references clients(id) on delete set null,  -- opcional
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  source_agent text,                          -- 'knowledge_curator', 'drift_detector', etc
  source_task_id uuid references tasks(id),   -- task que originou
  
  -- Estado
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  resolved_by uuid references auth.users(id),
  resolved_at timestamptz,
  resolution_note text,                       -- nota opcional do sócio ao decidir
  
  -- Notificação
  notified_telegram boolean not null default false,
  notified_at timestamptz,
  
  created_at timestamptz not null default now(),
  expires_at timestamptz                       -- opcional (alertas expiram, sugestões não)
);

create index if not exists idx_decision_status on decision_inbox(status, created_at desc) where status = 'pending';
create index if not exists idx_decision_type on decision_inbox(type, status);
create index if not exists idx_decision_client on decision_inbox(related_client_id) where related_client_id is not null;
create index if not exists idx_decision_priority on decision_inbox(priority, created_at desc) where status = 'pending';

-- =============================================================
-- LOG DE DECISÕES — auditoria append-only
-- =============================================================

create table if not exists decision_log (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references decision_inbox(id) on delete cascade,
  action text not null check (action in ('approved', 'rejected', 'edited', 'expired')),
  actor_id uuid references auth.users(id),
  note text,
  payload_snapshot jsonb,                     -- snapshot do payload no momento da ação
  created_at timestamptz not null default now()
);

create index if not exists idx_decision_log_decision on decision_log(decision_id, created_at desc);
create index if not exists idx_decision_log_actor on decision_log(actor_id, created_at desc);

-- =============================================================
-- RLS — Row Level Security
-- Hoje: só service_role acessa (Zoomma é única operadora)
-- Futuro SaaS: adicionar policies por client_id quando profissional fizer login
-- =============================================================

alter table brand_library enable row level security;
alter table brand_library_history enable row level security;
alter table knowledge_articles enable row level security;
alter table brand_knowledge_links enable row level security;
alter table decision_inbox enable row level security;
alter table decision_log enable row level security;

-- Policy: service_role tem acesso total (Zoomma backend)
-- Idempotente via DO/EXCEPTION
do $$ begin
  create policy "service_role_all" on brand_library for all using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "service_role_all" on brand_library_history for all using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "service_role_all" on knowledge_articles for all using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "service_role_all" on brand_knowledge_links for all using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "service_role_all" on decision_inbox for all using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "service_role_all" on decision_log for all using (true);
exception when duplicate_object then null; end $$;

-- =============================================================
-- TRIGGERS — atualização automática de updated_at e snapshots
-- =============================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_brand_library_updated on brand_library;
create trigger trg_brand_library_updated
  before update on brand_library
  for each row execute function update_updated_at_column();

drop trigger if exists trg_knowledge_updated on knowledge_articles;
create trigger trg_knowledge_updated
  before update on knowledge_articles
  for each row execute function update_updated_at_column();

-- Trigger: ao atualizar brand_library, salvar snapshot no histórico
create or replace function snapshot_brand_library()
returns trigger as $$
begin
  insert into brand_library_history (
    brand_library_id, client_id, snapshot, version, changed_blocks
  ) values (
    old.id,
    old.client_id,
    jsonb_build_object(
      'identidade_visual', old.identidade_visual,
      'tom_de_voz', old.tom_de_voz,
      'posicionamento', old.posicionamento,
      'audiencia', old.audiencia,
      'catalogo_servicos', old.catalogo_servicos,
      'historico_operacional', old.historico_operacional,
      'metricas_metas', old.metricas_metas,
      'especialidades', old.especialidades
    ),
    old.version,
    array(
      select block from unnest(array[
        case when old.identidade_visual is distinct from new.identidade_visual then 'identidade_visual' end,
        case when old.tom_de_voz is distinct from new.tom_de_voz then 'tom_de_voz' end,
        case when old.posicionamento is distinct from new.posicionamento then 'posicionamento' end,
        case when old.audiencia is distinct from new.audiencia then 'audiencia' end,
        case when old.catalogo_servicos is distinct from new.catalogo_servicos then 'catalogo_servicos' end,
        case when old.historico_operacional is distinct from new.historico_operacional then 'historico_operacional' end,
        case when old.metricas_metas is distinct from new.metricas_metas then 'metricas_metas' end
      ]) as block where block is not null
    )
  );
  new.version = old.version + 1;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_brand_library_snapshot on brand_library;
create trigger trg_brand_library_snapshot
  before update on brand_library
  for each row execute function snapshot_brand_library();

-- =============================================================
-- VIEWS — facilitam queries dos agentes
-- =============================================================

-- View: brand library com knowledge linked já pronto
create or replace view brand_library_full as
select 
  bl.*,
  c.name as client_name,
  coalesce(
    (select jsonb_agg(jsonb_build_object(
      'id', ka.id,
      'title', ka.title,
      'summary', ka.summary,
      'type', ka.type,
      'tags', ka.tags,
      'reason', bkl.reason
    ))
    from brand_knowledge_links bkl
    join knowledge_articles ka on ka.id = bkl.knowledge_id
    where bkl.client_id = bl.client_id
      and ka.approved_at is not null
    ), '[]'::jsonb
  ) as linked_knowledge
from brand_library bl
join clients c on c.id = bl.client_id;

-- View: pending decisions com cliente + contagem por tipo
create or replace view decision_inbox_summary as
select
  type,
  priority,
  count(*) as count,
  min(created_at) as oldest,
  max(created_at) as newest
from decision_inbox
where status = 'pending'
group by type, priority;
```

---

## 6. Estrutura de pastas

```
arquiteto_projetos/
├── shared/                                  # código compartilhado entre agentes
│   ├── supabase.ts                          # já existe
│   ├── telegram/                            # já existe
│   ├── brand-library/                       # NOVO
│   │   ├── index.ts                         # API pública: getClientBrand, updateBlock, etc
│   │   ├── extractor.ts                     # extrai 7 blocos do briefing via Claude
│   │   ├── types.ts                         # interfaces TS dos 7 blocos
│   │   └── prompts.ts                       # prompts de extração
│   ├── knowledge-base/                      # NOVO
│   │   ├── index.ts                         # API pública: search, getById, link, etc
│   │   ├── tavily.ts                        # cliente Tavily API
│   │   ├── curator.ts                       # busca + categoriza + resume
│   │   ├── types.ts                         # interfaces TS
│   │   └── prompts.ts                       # prompts de categorização/resumo
│   └── decision-inbox/                      # NOVO
│       ├── index.ts                         # API: create, list, approve, reject
│       ├── notifier.ts                      # envia notificação via Telegram
│       └── types.ts
│
├── agents/                                  # cada agente é isolado
│   ├── brand-library-builder/               # NOVO — extração inicial
│   │   ├── index.ts                         # worker (consome task)
│   │   ├── handler.ts                       # lógica do agente
│   │   └── package.json
│   ├── knowledge-curator/                   # NOVO — busca + sugere
│   │   ├── index.ts
│   │   ├── handler.ts
│   │   └── package.json
│   └── drift-detector/                      # NOVO — análise periódica
│       ├── index.ts
│       ├── handler.ts
│       └── package.json
│
├── controller/                              # Next.js — UI
│   └── src/app/
│       ├── (dashboard)/
│       │   ├── page.tsx                     # ALTERAR — incluir Caixa de Decisões
│       │   ├── caixa/                       # NOVO — Caixa de Decisões expandida
│       │   │   ├── page.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── conhecimento/                # NOVO — Knowledge Base
│       │   │   ├── page.tsx                 # lista artigos
│       │   │   ├── novo/page.tsx            # upload manual
│       │   │   └── buscar/page.tsx          # on-demand search
│       │   └── clientes/[id]/
│       │       └── biblioteca/              # NOVO — tab biblioteca de marca
│       │           └── page.tsx
│       └── api/
│           ├── brand-library/route.ts       # NOVO — trigger extração manual
│           ├── knowledge/                   # NOVO — endpoints knowledge base
│           │   ├── search/route.ts          # busca on-demand
│           │   └── upload/route.ts          # upload manual
│           ├── decisions/                   # NOVO — endpoints caixa
│           │   ├── route.ts                 # list pending
│           │   └── [id]/route.ts            # approve/reject
│           └── cron/                        # NOVO — Vercel Cron
│               └── drift-detection/route.ts
│
└── supabase/
    └── migrations/
        └── 003_inteligencia_marca.sql       # NOVO
```

---

## 7. Interfaces TypeScript principais

### `shared/brand-library/types.ts`

```typescript
export interface IdentidadeVisual {
  logo_url?: string
  paleta_cores: { hex: string; nome?: string; uso?: string }[]
  tipografia: { fonte: string; uso: 'titulo' | 'corpo' | 'destaque' }[]
  referencias_visuais?: string[]
  estilo: 'minimalista' | 'sofisticado' | 'vibrante' | 'natural' | 'medico' | string
}

export interface TomDeVoz {
  palavras_chave: string[]
  palavras_banidas: string[]
  exemplos_aprovados: string[]
  formalidade: 'casual' | 'neutro' | 'formal'
  emocao_predominante: string
}

export interface Posicionamento {
  proposta_valor: string
  diferenciais: string[]
  o_que_nao_somos: string[]
  publico_que_evitamos?: string[]
}

export interface Audiencia {
  persona_principal: {
    nome: string
    idade_faixa: string
    renda_faixa: string
    profissao_tipo: string
    dores: string[]
    desejos: string[]
    objecoes: string[]
  }
  personas_secundarias?: Audiencia['persona_principal'][]
  jornada_compra: { etapa: string; descricao: string }[]
}

export interface CatalogoServicos {
  servicos: {
    nome: string
    especialidade: string  // ex: "microagulhamento" — usado para link com knowledge
    descricao: string
    preco_faixa?: string
    diferenciais_tecnicos: string[]
  }[]
}

export interface HistoricoOperacional {
  sazonalidade?: { mes: string; tipo: 'pico' | 'baixa' | 'normal'; nota?: string }[]
  ticket_medio?: number
  picos_venda?: string[]
}

export interface MetricasMetas {
  kpis: { nome: string; valor_atual?: string; meta?: string }[]
  objetivos_curto_prazo: string[]
  objetivos_longo_prazo: string[]
}

export interface BrandLibrary {
  id: string
  client_id: string
  identidade_visual: IdentidadeVisual
  tom_de_voz: TomDeVoz
  posicionamento: Posicionamento
  audiencia: Audiencia
  catalogo_servicos: CatalogoServicos
  historico_operacional: HistoricoOperacional
  metricas_metas: MetricasMetas
  especialidades: string[]
  source_briefing_id?: string
  version: number
  created_at: string
  updated_at: string
}
```

### `shared/knowledge-base/types.ts`

```typescript
export type KnowledgeType =
  | 'tecnico'
  | 'comportamento'
  | 'regulamentacao'
  | 'tendencias'
  | 'proprio_zoomma'
  | 'concorrencia'

export type SourceType = 'manual' | 'tavily' | 'web_fetch' | 'pdf_upload'

export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  summary: string | null
  type: KnowledgeType
  tags: string[]
  source_type: SourceType
  source_url: string | null
  source_metadata: Record<string, unknown>
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface BrandKnowledgeLink {
  id: string
  client_id: string
  knowledge_id: string
  reason: string | null
  linked_by: string | null
  created_at: string
}
```

### `shared/decision-inbox/types.ts`

```typescript
export type DecisionType =
  | 'article_suggestion'
  | 'drift_detected'
  | 'brand_update'
  | 'lead'
  | 'alert'

export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export interface DecisionItem {
  id: string
  type: DecisionType
  title: string
  summary: string
  payload: Record<string, unknown>
  related_client_id: string | null
  priority: 'low' | 'normal' | 'high'
  source_agent: string | null
  source_task_id: string | null
  status: DecisionStatus
  resolved_by: string | null
  resolved_at: string | null
  resolution_note: string | null
  notified_telegram: boolean
  notified_at: string | null
  created_at: string
  expires_at: string | null
}
```

---

## 8. Contratos das APIs públicas (o que outros agentes vão consumir)

### `shared/brand-library/index.ts`

```typescript
// Lê a Biblioteca de Marca de um cliente (objeto completo)
export async function getClientBrand(clientId: string): Promise<BrandLibrary | null>

// Lê apenas um bloco específico (otimização — quando agente só precisa do tom de voz)
export async function getClientBrandBlock<K extends keyof BrandLibrary>(
  clientId: string,
  block: K
): Promise<BrandLibrary[K] | null>

// Atualiza um bloco (dispara snapshot automático via trigger)
export async function updateBrandBlock<K extends keyof BrandLibrary>(
  clientId: string,
  block: K,
  value: BrandLibrary[K],
  actorId: string
): Promise<void>

// Cria a Biblioteca inicial a partir de briefing aprovado
export async function buildFromBriefing(
  clientId: string,
  briefingId: string
): Promise<BrandLibrary>

// Lê com knowledge linked (view brand_library_full)
export async function getClientBrandWithKnowledge(
  clientId: string
): Promise<BrandLibrary & { linked_knowledge: LinkedKnowledge[] } | null>
```

### `shared/knowledge-base/index.ts`

```typescript
// Busca interna (full-text + tags)
export async function searchKnowledge(params: {
  query?: string
  types?: KnowledgeType[]
  tags?: string[]
  limit?: number
}): Promise<KnowledgeArticle[]>

// Lê um artigo
export async function getArticle(id: string): Promise<KnowledgeArticle | null>

// Insere artigo aprovado (chamado após aprovação na Caixa)
export async function approveArticle(params: {
  decisionId: string
  approverId: string
}): Promise<KnowledgeArticle>

// Vincula artigo a um cliente
export async function linkArticleToClient(params: {
  clientId: string
  articleId: string
  reason: string
  linkedBy: string
}): Promise<void>

// Busca externa via Tavily (gera sugestões — não insere)
export async function searchExternal(params: {
  query: string
  hint?: KnowledgeType  // tipo provável
  maxResults?: number
}): Promise<{ articles: Partial<KnowledgeArticle>[]; queryUsed: string }>

// Curadoria semi-automática: detecta especialidades do cliente e sugere
export async function suggestForClient(clientId: string): Promise<{
  suggested: number
  decisionItemIds: string[]
}>
```

### `shared/decision-inbox/index.ts`

```typescript
// Cria item na caixa
export async function createDecision(item: Omit<DecisionItem,
  'id' | 'status' | 'resolved_by' | 'resolved_at' | 'resolution_note' |
  'notified_telegram' | 'notified_at' | 'created_at'
>): Promise<DecisionItem>

// Lista itens pendentes
export async function listPending(filters?: {
  type?: DecisionType
  clientId?: string
  priority?: 'low' | 'normal' | 'high'
}): Promise<DecisionItem[]>

// Aprova (com efeito colateral: aplica a mudança e move pro log)
export async function approveDecision(params: {
  decisionId: string
  actorId: string
  note?: string
}): Promise<void>

// Rejeita
export async function rejectDecision(params: {
  decisionId: string
  actorId: string
  note?: string
}): Promise<void>

// Resumo para dashboard inicial (contagens por tipo/prioridade)
export async function getSummary(): Promise<{
  total_pending: number
  by_type: Record<DecisionType, number>
  by_priority: Record<'low' | 'normal' | 'high', number>
  oldest_pending: string | null
}>
```

---

## 9. Fluxos detalhados

### Fluxo A — Cliente novo entra (extração automática)

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Usuário aprova briefing na UI                             │
│    POST /api/briefings/[id]/approve                          │
│                                                               │
│ 2. Server action salva briefing e cria task:                 │
│    INSERT INTO tasks (agent_slug='brand-library-builder',    │
│                       payload={client_id, briefing_id})      │
│                                                               │
│ 3. Worker brand-library-builder (Railway) faz claim:         │
│    SELECT claim_next_task('brand-library-builder')           │
│                                                               │
│ 4. Handler:                                                  │
│    a) Lê briefing aprovado (transcript + answers)            │
│    b) Chama Claude com prompt estruturado → 7 blocos JSON    │
│    c) INSERT INTO brand_library (...)                        │
│    d) Identifica especialidades (catalogo_servicos)          │
│    e) Cria task → knowledge-curator (sugerir artigos)        │
│                                                               │
│ 5. Worker knowledge-curator:                                 │
│    a) Pra cada especialidade do cliente:                     │
│       i) Busca Tavily: "microagulhamento estudos 2026"      │
│       ii) Pra cada resultado: gera summary+tags via Claude  │
│       iii) Cria item em decision_inbox                      │
│    b) Notifica via Telegram: "5 artigos pra revisar"        │
│                                                               │
│ 6. Sócio entra no dashboard → vê Caixa → aprova/rejeita      │
│                                                               │
│ 7. Aprovação:                                                │
│    a) INSERT INTO knowledge_articles                         │
│    b) INSERT INTO brand_knowledge_links                      │
│    c) INSERT INTO decision_log                               │
│    d) UPDATE decision_inbox SET status='approved'            │
└──────────────────────────────────────────────────────────────┘
```

### Fluxo B — Sócio pede on-demand

```
1. Sócio: via web ou Telegram → "quero artigos sobre lash lifting"
2. Endpoint: POST /api/knowledge/search { query, type?, clientId? }
3. searchExternal() chama Tavily
4. Pra cada resultado: Claude gera summary + tags + classifica tipo
5. Cria item em decision_inbox (type='article_suggestion')
6. UI mostra "5 sugestões prontas para revisar" + link pra Caixa
7. Aprovação igual ao Fluxo A passo 7
```

### Fluxo C — Detecção de drift (cron diário)

```
1. Vercel Cron dispara 03:00 BRT: GET /api/cron/drift-detection
2. Pra cada cliente ativo:
   a) Lê brand_library atual
   b) Lê últimas atividades (placeholder por enquanto — depois: posts, mudanças, etc)
   c) Claude analisa: "houve mudança significativa?"
   d) Se sim: cria item em decision_inbox (type='drift_detected')
3. Notifica via Telegram (summary do dia)
```

---

## 10. Decisões técnicas detalhadas

### 10.1 Busca web — Tavily

**Cliente:** `shared/knowledge-base/tavily.ts`

```typescript
// Cliente fino, sem SDK (chama HTTP direto)
const TAVILY_ENDPOINT = 'https://api.tavily.com/search'

export async function tavilySearch(params: {
  query: string
  searchDepth?: 'basic' | 'advanced'
  maxResults?: number
  includeRawContent?: boolean
}): Promise<TavilyResult>
```

**Variável de ambiente nova:** `TAVILY_API_KEY` (adicionar a `.env`, Vercel, Railway)

**Custo previsto:** ~$0.008/busca. Cliente novo = ~20 buscas = ~$0.16. Negligível.

### 10.2 Extração da Biblioteca via Claude

**Estratégia:** uma única chamada com `tool_use` retornando os 7 blocos estruturados.

**Modelo:** `claude-sonnet-4-6` (equilíbrio custo/qualidade). Pode migrar pra Opus se qualidade ficar insuficiente.

**Prompt cacheado:** os 7 blocos com suas estruturas são prompt sistema longo, idealmente cacheado (5x desconto via prompt caching da Anthropic).

### 10.3 Busca interna — full-text (não pgvector ainda)

Postgres `tsvector` com peso (`A`=title, `B`=summary, `C`=content) + índice GIN.

Query típica:
```sql
select * from knowledge_articles
where search_vector @@ websearch_to_tsquery('portuguese', 'microagulhamento')
  and approved_at is not null
order by ts_rank(search_vector, websearch_to_tsquery('portuguese', 'microagulhamento')) desc
limit 10;
```

**Gatilho de migração pra pgvector:** quando passar de ~500 docs OU agentes pedirem "trechos similares a esse texto" (RAG real).

### 10.4 Notificação Telegram

Reuso de `shared/telegram/index.ts` (já existe). Função nova: `shared/decision-inbox/notifier.ts`:

```typescript
export async function notifyDecisionsViaTelegram(items: DecisionItem[]): Promise<void>
```

Comportamento:
- Agrupa por tipo
- Envia 1 mensagem resumo: "📥 *Caixa de Decisões — 5 itens novos*"
- Botões inline: "Ver tudo" → link pro dashboard
- Marca `notified_telegram=true` no banco

### 10.5 Cron — Vercel Cron Jobs

Configurar em `vercel.json`:
```json
{
  "crons": [
    { "path": "/api/cron/drift-detection", "schedule": "0 6 * * *" }
  ]
}
```
(06h UTC = 03h BRT)

### 10.6 Workers — Railway

Reuso da arquitetura existente:
- `workers/brand-library-builder/` (long-running, faz claim de tasks)
- `workers/knowledge-curator/` (idem)

Comunicação **somente via tabela `tasks`** — agente A nunca importa código de agente B.

### 10.7 Multi-tenant Nível 2 — preparação para SaaS

Hoje, RLS é simples: `service_role` tem acesso total. No SaaS futuro:

1. Adiciona Supabase Auth pros profissionais da beleza
2. Cada user fica vinculado a um `client_id` (tabela `client_users`)
3. RLS policies viram: `using (client_id = auth.client_id())`
4. Brand library, links, etc. ficam isolados por tenant automaticamente
5. Knowledge base permanece global (sem RLS por client — todos veem)

**Migração estimada para SaaS:** ~3 dias (auth + policies + cobrança). Schema atual já suporta.

---

## 11. Cronograma de implementação (ordem para o Dev)

| # | Marco | Tempo estimado | Dependência |
|---|-------|----------------|-------------|
| 1 | Migration 003 rodando no Supabase | 1h | Migration 002 (briefings) |
| 2 | `shared/brand-library/` — extractor + types + API básica | 4h | #1 |
| 3 | `agents/brand-library-builder/` — worker funcional | 4h | #2 |
| 4 | Triggar Fluxo A end-to-end com cliente real (microagulhamento) | 2h | #3 |
| 5 | `shared/knowledge-base/` — Tavily client + curator | 4h | #1 |
| 6 | `agents/knowledge-curator/` — worker funcional | 4h | #5 |
| 7 | `shared/decision-inbox/` — API + notifier | 3h | #1 |
| 8 | Controller: UI da Caixa no dashboard inicial | 6h | #7 |
| 9 | Controller: UI da Knowledge Base (lista, upload, busca on-demand) | 6h | #5, #7 |
| 10 | Controller: aba Biblioteca de Marca no detalhe do cliente | 4h | #2 |
| 11 | `agents/drift-detector/` + Vercel Cron | 4h | #7 |
| 12 | Curar 5-10 artigos de microagulhamento (validação manual da UX completa) | 2h | #6, #9 |

**Total estimado:** ~44 horas (5-6 dias úteis de trabalho focado).

**Marco crítico (MVP funcional):** itens #1 a #4 + #5 a #8 + #12 = ~24h. Resto é polimento + drift.

---

## 12. Riscos arquiteturais e mitigações

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|-------|---------------|---------|-----------|
| R1 | Tavily retorna resultados de baixa qualidade (blogs SEO sem fonte) | Média | Alto | Filtrar por domínios (PubMed, sites .edu, .gov, revistas especializadas). Curator dá score de qualidade antes de criar decision. |
| R2 | Caixa de Decisões vira inbox infinito (alta entropia) | Média | Alto | (a) Priority obrigatória; (b) Auto-expire em 30 dias se não decidido; (c) Notificações agrupadas, não 1 por item. |
| R3 | Schema dos 7 blocos não cobre cliente atípico | Baixa | Médio | Blocos são JSONB — extensão fácil sem migration. Validação por Zod nas interfaces, não no banco. |
| R4 | Drift detection gera muito falso positivo | Alta | Médio | MVP: drift começa simples (mudança de especialidade ou novo serviço). Análise comportamental avançada só na Fase 2. |
| R5 | Custo de Claude inflado por extração repetida | Baixa | Médio | Prompt caching (5x desconto). Re-extração só por solicitação manual ou drift confirmado. |
| R6 | Migração futura pra pgvector trava o sistema | Baixa | Médio | Estrutura permite coexistir (adicionar coluna `embedding vector(1536)` sem mexer no resto). Migração incremental. |
| R7 | Conflito entre versão atual de brand_library e edits paralelos | Baixa | Baixo | Coluna `version` + optimistic locking nos updates da UI. |

---

## 13. O que vem depois (fora do escopo desta fase)

- Embeddings + pgvector para busca semântica real (Fase 2 quando agentes pedirem RAG)
- Captura automatizada de transcrição de calls em produção (hoje começa com upload manual)
- Login pra profissionais da beleza (Fase SaaS)
- API pública pra integrações (Fase SaaS)
- Análise de drift via Instagram/posts do cliente (hoje começa com cron simples)
- Cobrança e planos (Fase SaaS)

---

## 14. Próximos passos

1. ✅ Arquitetura definida (este documento)
2. ⏳ Plano de implementação detalhado — Spec-Kit (`speckit-plan`)
3. ⏳ Tasks acionáveis — Spec-Kit (`speckit-tasks`)
4. ⏳ Implementação — Dev (`bmad-agent-dev`)
5. ⏳ Validação — `bmad-check-implementation-readiness`

---

## 15. Glossário rápido (para consulta)

| Termo | Significado prático |
|-------|---------------------|
| **Tenant** | Dono dos dados isolados. Hoje a Zoomma é tenant único; no SaaS, cada profissional é um tenant. |
| **RLS** | Regra de segurança no Postgres que diz "quem pode ler/escrever cada linha". |
| **JSONB** | Coluna que guarda JSON com índice eficiente. Usamos pros 7 blocos. |
| **Full-text search** | Busca por palavras dentro de texto (sem entender semântica). O que usamos no MVP. |
| **pgvector / embeddings** | Busca por similaridade semântica. Usaremos no futuro. |
| **Tavily** | API de busca na web especializada em alimentar agentes IA. Retorna conteúdo limpo. |
| **Drift** | Mudança no perfil do cliente ao longo do tempo. |
| **Caixa de Decisões** | Inbox de itens estruturais que precisam aprovação humana. |
| **Worker** | Processo background que processa tasks da fila. Roda no Railway. |
| **Vercel Cron** | Agenda que dispara endpoints HTTP em horários definidos. |
