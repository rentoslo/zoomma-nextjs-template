# Plano Mestre — Sistema de Agentes IA da Zoomma (v2, pós-revisão adversarial)

> **Status:** ✅ Decisões confirmadas em 2026-05-07. Pronto para iniciar Fase 0 (Smoke Test E2E).
> **Versão anterior:** `plano-mestre-v1.md`
> **Mapa de correções:** `revisao-achados-e-mitigacoes.md` (47 achados → 47 mitigações)

---

## 1. Contexto e Objetivo

**Zoomma** — agência de marketing consultivo estratégico para mercado da beleza (BR + hispano nos EUA). Operação enxuta: Rento (sócio + único programador), Bruno (sócio operacional), Camila e Paola (especialistas de domínio em estética/harmonização).

**Manual oficial de IA da Zoomma:**
- IA NUNCA inventa informações; pergunta quando falta
- Termos proibidos (PT/EN/ES): "fórmula secreta" / "guaranteed result" / "resultado garantizado", "explodir vendas", "dobrar faturamento" — lista trilíngue completa em `shared/forbidden-terms.json`
- Frase-chave de controle: *"A Zoomma não vende promessas. A Zoomma constrói crescimento com estratégia, clareza e responsabilidade."*

**Objetivo do sistema:** automatizar processos da Zoomma — começando por captação e atendimento estratégico/operacional — com aprovação humana onde for crítico, autonomia onde não for, e modularidade para evoluir.

**Foco inicial:** uso interno. Pode evoluir para produto/cliente.

---

## 2. Stack e Runtime

| Camada | Tecnologia | Onde roda |
|---|---|---|
| Site (painel web) | Next.js 14 App Router | Vercel |
| Bot Telegram + Orquestrador | Node.js (handler em Next.js API ou worker dedicado) | Vercel para webhooks; worker Railway para loops |
| **Agentes (workers persistentes)** | Node.js + TypeScript | **Railway** (containers de longa duração) |
| Jobs longos / scrape | Node.js + Apify SDK | Railway worker |
| Banco de dados | Supabase (Postgres 15 + Realtime + pgvector + Storage + Auth) | Cloud Supabase |
| LLM principal | Anthropic Claude (`claude-sonnet-4-6` default; `claude-opus-4-7` só Auditor camada 2 e Plano de Negócios) | API Anthropic |
| LLM fallback | OpenAI (`gpt-4o`) | via adaptador |
| LLM geração de posts | Google Gemini Pro (melhor qualidade disponível; chamadas via Batch API async = 50% desconto) | API Google AI |
| Scraping | Apify (Instagram Profile Scraper + Google Maps Scraper) | API Apify |
| Email | Resend | API Resend |
| Aprovação cliente | Pipefy (adapter primário) + LinkBased (fallback) | APIs externas |
| Mensageria operacional | Telegram Bot API | API Telegram |
| Publicação social | Meta Graph API | API Meta |
| Gestão de campanhas | Meta Ads MCP Server (`mcp.facebook.com/ads`) — oficial Meta, lançado 29/04/2026 | Meta Cloud |

**Decisão arquitetural-chave:** Vercel para tudo que é stateless e curto (HTTP). Railway para tudo que tem estado, fica em loop, ou precisa > 60s.

**Gemini via `shared/llm.ts`:** o adaptador LLM já existente recebe um terceiro provider (`gemini`). Nenhum agente importa o SDK do Google diretamente — tudo passa pelo adaptador. (Regra 1 anti-Frankenstein.)

**Modelos Gemini:**
- Texto/posts: sempre o melhor Pro disponível (ex.: `gemini-2.5-pro`). Atualizar model ID no adaptador quando surgir versão superior.
- **Imagens: `gemini-3-pro-image-preview`** — padrão fixo do projeto. Suporta text-to-image, edição, até 14 imagens de referência, resoluções até 4K. Batch API ativo (async, ~50% custo). Nota: toda imagem gerada inclui marca d'água SynthID invisível (padrão Google, sem impacto visual).
- Modo `batch` obrigatório para geração de posts e imagens (latência de minutos é aceitável; economia real de custo).

---

## 3. Arquitetura — Monorepo

```
C:\Zoomma_automations\
├── controller/                          ← Next.js App Router
│   ├── src/app/
│   │   ├── (dashboard)/                 ← painel web
│   │   ├── api/
│   │   │   ├── telegram/webhook/        ← Bot Telegram
│   │   │   ├── pipefy/webhook/          ← aprovações cliente
│   │   │   └── tasks/                   ← criação manual de tasks
│   │   └── ...
│   └── package.json
├── agents/
│   ├── _template/                       ← scaffold para novo agente
│   │   ├── index.ts
│   │   ├── agent.config.ts
│   │   └── README.md
│   ├── prospeccao/
│   ├── briefing/
│   ├── copywriter/
│   ├── auditor/                         ← NÃO é agente comum; roda inline
│   └── ...
├── workers/                             ← processo de longa duração (Railway)
│   ├── task-claimer.ts                  ← claim com SKIP LOCKED
│   ├── pipefy-poller.ts                 ← polling backup 60s
│   ├── budget-watcher.ts                ← monitor de tetos
│   └── inbox-sync.ts                    ← email/inbox backup
└── shared/
    ├── supabase.ts
    ├── types.ts
    ├── llm.ts                           ← adapter Anthropic/OpenAI + caching
    ├── auditor/
    │   ├── deterministic.ts             ← camada 1 (regex + Unicode)
    │   ├── llm-judge.ts                 ← camada 2 (LLM-as-judge)
    │   └── index.ts
    ├── approval/
    │   ├── PipefyAdapter.ts
    │   ├── LinkBasedAdapter.ts
    │   └── index.ts                     ← interface ClientApprovalProvider
    ├── schemas/                         ← Zod schemas
    │   ├── workflow.ts
    │   ├── task-input.ts
    │   ├── task-output.ts
    │   └── webhook-events.ts
    └── forbidden-terms.json             ← lista trilíngue PT/EN/ES
```

---

## 4. Comunicação (Supabase como Message Bus + Locks)

**Insight aplicado:** Realtime sozinho não basta. Race conditions e perda de eventos exigem locking explícito + polling de segurança.

```
[Controller] ──insere──→ tasks (status='pending')
                              ↓
                        Realtime push
                              ↓
[Worker /agents/X]
   ↓ BEGIN
   ↓ SELECT ... FOR UPDATE SKIP LOCKED LIMIT 1
   ↓ UPDATE tasks SET status='claimed', claimed_by=$worker, claim_lease_seconds=300
   ↓ COMMIT
   ↓ executa
   ↓ check budget (a cada chamada LLM)
   ↓ UPDATE tasks SET status='completed', output=$json
                              ↓
[Controller] detecta mudança → próximo passo (Auditor → Pipefy → Telegram)
```

**Garantias:**
- 2 workers nunca clamam a mesma task (`SKIP LOCKED`)
- Worker que cair libera lease em 5 min (timeout) — outro pode clamar
- `task-claimer.ts` faz polling backup a cada 60s (cinto + suspensório)
- Tasks `pending` há > 2min sem `started_at` viram alerta no Telegram

---

## 5. Memória do Sistema (CoALA)

### 5.1. Memória Semântica (`memory_semantic`)
- **Conteúdo:** Guia Zoomma, palavras proibidas, ofertas oficiais, biblioteca de marca por cliente
- **Manual versionado** em `manual_versions` — edição via UI dispara re-embedding automático
- **Indexação:** chunking contextual (Anthropic) — benchmark próprio antes de fixar (default fixed-size 512 com overlap 50; contextual ativado se beat o baseline em recall@5 com 20 queries reais)
- **pgvector** dentro do Supabase (até 1M vetores — mais que o suficiente)
- **Embedding model fixado** em `text-embedding-3-small`; mudar exige migração explícita

### 5.2. Memória Episódica (`events`)
- Linha do tempo: briefings, decisões, conversas, eventos de sistema
- Indexada por `(client_id, created_at)`
- Retenção: 18 meses; depois arquiva (não deleta)

### 5.3. Memória Procedural (`playbooks`)
- Few-shot dinâmico: copies aprovadas, workflows que deram certo
- **Cold start mínimo: 50 itens por categoria principal** antes de virar a chave
- Mês 1-2 marcados como "lite" no painel — agentes ficam mais conservadores

### 5.4. Pipeline de re-embedding
- Edição de Manual ou Biblioteca de Marca via UI → enfileira em `embedding_pending`
- Worker processa com backoff exponencial
- `memory_semantic.embedding NOT NULL` — banco rejeita inserção sem embedding gerado

---

## 6. Orquestrador (NOT-block)

**Identidade:**
> "Eu NÃO sou copywriter. NÃO sou designer. NÃO sou analista. Eu coordeno. Trabalho especializado é delegado."

**Responsabilidades:**
- Recebe pedidos (Telegram, painel, webhook Pipefy)
- Decompõe em tasks atômicas
- Cria registros em `tasks` com `agent_version_id` capturado no momento
- Monitora progresso
- Escala para humano em: timeout, budget exceeded, falha repetida (3x), conflito

**O orquestrador NUNCA** chama LLM diretamente para gerar conteúdo.

---

## 7. Auditor da Marca (3 camadas com fail-closed)

### Camada 1 — Determinística
- Normalização Unicode NFKC + remoção zero-width chars
- Detector de idioma (PT/EN/ES) → aplica lista de proibidas correspondente
- Fuzzy match Levenshtein para leetspeak (`f🔥rmula`, `g4r4ntid0`)
- Regex de formato (CTA presente, limites de tamanho)
- **Custo: 0**

### Camada 2 — LLM-as-judge (`claude-opus-4-7`)
- Carrega: Manual Zoomma (cached) + Biblioteca de Marca do cliente (cached) + conteúdo a auditar (fresh)
- **Prompt caching ativo** — entrada cached é 5x mais barata
- Devolve `APROVADO` ou `REJEITADO + razão específica + sugestão`
- **Fail-closed:** timeout/erro → tenta OpenAI; se ambos falham → "Atenção Humana"
- **Calibração obrigatória:** seed de 30 aprovadas + 30 rejeitadas; precision mensurada e revisada mensalmente

### Camada 3 — Humana
- Você ou Bruno (ou Camila/Paola para conteúdo clínico)
- UI de revisão mostra: conteúdo, veredito Camada 1, veredito Camada 2 com razão
- Decisão registrada em `approvals` com versão exata do auditor usada

**Threshold inicial conservador:** humano sempre revisa. Afrouxa só após 3 meses com precision Camada 2 ≥ 95%.

---

## 8. Anatomia de um Funcionário

### 8.1. Identidade (`agents`)
```
slug, name, category, autonomy, requires_auditor, runtime ('vercel-fn'|'worker'|'cron'), version, active
```

### 8.2. Workflow (`agents.workflow JSONB`)
- **v1: editor JSON cru com validação Zod + diff visual** (não node-based — fora do escopo)
- Schema em `shared/schemas/workflow.ts`
- Estrutura:
```json
{
  "steps": [
    { "id": "fetch_briefing", "tool": "supabase", "input_from": "task.input.client_id" },
    { "id": "generate", "tool": "llm", "rules_ref": "agent.instructions" },
    { "id": "audit", "tool": "auditor", "fail_action": "halt" },
    { "id": "approve_internal", "channel": "telegram", "required": true }
  ]
}
```

### 8.3. Instruções e regras (`agents.instructions TEXT`)
Estrutura padronizada (todo agente):
```
PAPEL
SEMPRE FAÇA
NUNCA FAÇA
FORMATO DE ENTREGA
CRITÉRIOS DE QUALIDADE
```

### 8.4. Versionamento (`agents_versions`)
- Toda mudança em `instructions` ou `workflow` gera versão imutável com nota
- `tasks.agent_version_id` capturado no claim — task **completa na versão em que iniciou** mesmo que reverta no meio
- Conflito otimista: edição simultânea por 2 pessoas mostra diff lado a lado + escolha manual

### 8.5. Schemas de input/output (Zod, obrigatório)
- Cada agente expõe `inputSchema` e `outputSchema` em `agent.config.ts`
- Validação em runtime no claim e na entrega
- `tasks.schema_version` rastreia versão do schema usado

### 8.6. Tipo do funcionário
- `kind`: `'ai'` | `'human'` | `'mixed'`
- Humano: tabela `human_tasks` espelha `tasks`; UI "Minhas Tarefas"; entrega via formulário (upload arquivo + nota) — sem isso, status não vai a `done`

---

## 9. Catálogo de Skills

### 9.1. 7 categorias seed (fixture obrigatório no setup)
| Categoria | Conteúdo |
|---|---|
| Captação | Prospecção, SDR, diagnóstico de lead, proposta |
| Estratégia | Briefing, posicionamento, plano de negócios, calendário |
| Produção | Copywriting, roteiro, imagem, vídeo |
| Qualidade | Revisão, auditoria, checklist |
| Entrega | Agendamento, publicação, envio |
| Análise | Relatórios, métricas, diagnóstico |
| Operações | Onboarding, financeiro, gestão interna |

### 9.2. Auto-categorização
- LLM escolhe **entre as 7 categorias seed** — não inventa
- Adicionar 8ª categoria é ação manual explícita

---

## 10. Interfaces

### 10.1. Navegador (configurar e revisar)

**Telas:**
1. Painel Geral
2. Pipeline de Captação (funil de leads)
3. Clientes (ficha, regras, biblioteca, timezone IANA)
4. **Serviços do Cliente** ← nova tela fundamental (ver 10.1.1)
5. Agenda Editorial Visual
6. Fila de Aprovações (interna + Pipefy + cliente)
7. Funcionários (lista, criação via Ficha de Admissão)
8. Catálogo de Skills (por categoria)
9. Log de Execuções
10. **Inbox** (espelho de todos alertas Telegram — recuperação se Bruno offline)
11. **Manual da Zoomma** (editor versionado com re-embedding automático)
12. **Custos** (dashboard granular: tokens cached vs fresh, por cliente, por dia)

**Ficha de Admissão (7 perguntas):** identidade, kind (ai/humano), clientes atendidos, input necessário, output entregue, autonomia, restrições.

### 10.1.1. Tela — Serviços do Cliente

Acessada dentro da ficha de cada cliente. Define o que o sistema executa para aquele cliente, em qual periodicidade e em qual modo.

**Estrutura em blocos por categoria:**
- 🎯 Estratégia | 🔍 Captação | ✍️ Criação de Conteúdo | 📱 Publicação | 📊 Campanhas Pagas

**Cada atividade expõe três controles:**
1. **Ativar/desativar** — se está no escopo desse cliente
2. **Modo: Auto ou Humano** — quem executa
3. **Periodicidade** — diária, semanal, mensal, por evento, personalizada (cron)
4. **⚙ Configurar** — abre painel lateral com settings específicos para esse cliente+agente

**Modo Humano — comportamento do sistema:**
- Cria `human_tasks` no horário configurado
- Notifica Rento/Bruno no Telegram com link direto para o procedimento
- Exibe no painel o **cartão de procedimento**: passos obrigatórios + checklist de qualidade Zoomma
- Botão "Pedir ajuda ao Agente" disponível mesmo em modo humano (aciona agente pontualmente)
- Ao marcar concluído, registra em `events` com autoria humana (rastreabilidade total)

**Configuração individual do agente (⚙):**
- Instruções adicionais por cliente (append ao prompt base do agente)
- Modelo de IA (override por cliente — ex: Opus para cliente premium)
- Limite de custo por execução
- Notificações específicas

**Schema novo (2 tabelas):**
```sql
service_catalog (
  slug, name, category, sort_order,
  default_agent_slug,       -- null = atividade humana por natureza
  human_procedure text,     -- markdown: passo-a-passo para execução humana
  human_standard text,      -- checklist de qualidade padrão Zoomma
  default_periodicity,      -- sugestão de periodicidade
  default_mode              -- 'auto' | 'human'
)

client_services (
  id, client_id, service_slug,
  is_active bool,
  execution_mode,           -- 'auto' | 'human'
  periodicity,              -- 'daily' | 'weekly' | 'monthly' | 'on-demand' | 'custom'
  periodicity_config jsonb, -- { day_of_week: 1, time: '09:00' } ou cron
  agent_config jsonb,       -- overrides por cliente (model, extra_instructions, cost_limit)
  created_at, updated_at
)
```

### 10.2. Telegram (operar e consultar)

**Whitelist DUPLA:** `user_id` E `chat_id` privado. Mensagens em grupos rejeitadas.
**Token rotativo 24h** para ações destrutivas.

**Comandos:** `/leads`, `/pendentes`, `/cliente [nome]`, `/manual` (registra ação humana fora do fluxo), `/inbox-resync`, `/status [task_id]`.

**Confirmações:** primeiro voto vence (CAS). Janela undo de 60s antes de chamar APIs externas.

**Consultas em linguagem natural:** "O que está pendente hoje?", "Maria já aprovou?", etc.

### 10.3. Email (backup)
- Resend envia digest diário 8h ao Rento e Bruno: pendências + alertas críticos das últimas 24h
- Modo "Bruno em viagem" ativável manualmente: digest a cada 6h

---

## 11. Cliente — Aprovação

**Único ponto de contato:** abstração `ClientApprovalProvider`.

### 11.1. PipefyAdapter (v1)
- Card criado APÓS task `completed` E auditor camadas 1+2 OK
- Webhook + polling 60s (idempotência por `webhook_events.event_id`)
- Validação de payload: ajuste com < 3 chars úteis pede esclarecimento humano
- Saúde do Pipefy monitorada; outage > 1h → alerta Telegram

### 11.2. LinkBasedAdapter (fallback)
- Link único enviado por email/WhatsApp
- Form Supabase com auth por token
- Pronto para uso se Pipefy ficar indisponível ou política de preço mudar

### 11.3. Janela "amendable" (24h pós-aprovação)
- Cliente pode pedir mudança nesse intervalo, sistema cancela e refaz
- Após 24h: pedido vira "Reagendamento Solicitado" — task explícita com Telegram

---

## 12. Autonomia por Tipo de Tarefa

| Tarefa | Autonomia | Confirmação |
|---|---|---|
| Captação de leads (Apify) | Total | — |
| Análise de mercado / diagnóstico | Total | — |
| Relatórios internos | Total | — |
| Geração de copy/artes | Aprovação interna | Camadas 1+2+3 |
| Conteúdo clínico/estético | Aprovação interna | Camadas 1+2+3 (cliente aprova via Pipefy) |
| Envio para cliente (Pipefy) | Aprovação interna obrigatória | Camadas 1+2+3 |
| Agendamento Meta | Confirmação dupla Telegram | + janela undo 60s |

---

## 13. Schema Supabase Completo

```sql
-- Núcleo
clients (id, name, status, timezone TEXT NOT NULL, active_agents jsonb,
         brand_library jsonb, deleted_at, created_at)

agents (id, slug UNIQUE, name, category, autonomy, requires_auditor,
        runtime, kind, workflow jsonb, instructions text,
        input_schema jsonb, output_schema jsonb,
        version int, active bool, created_at, updated_at)

agents_versions (id, agent_id, version, instructions, workflow,
                 input_schema, output_schema, change_note,
                 changed_by, changed_at)

tasks (id, agent_slug, agent_version_id FK, client_id, status,
       input jsonb, output jsonb, schema_version int,
       claimed_by, claimed_at, claim_lease_seconds,
       cost_usd numeric, input_cached_usd, input_fresh_usd, output_usd,
       retry_count, error,
       created_at, started_at, finished_at)

human_tasks (id, task_id FK, assigned_to, status, deliverable_url,
             notes, claimed_at, delivered_at)

-- Memória CoALA
memory_semantic (id, client_id, type, content, embedding vector(1536) NOT NULL,
                 metadata jsonb, embedding_model TEXT, created_at)

events (id, client_id, agent_slug, task_id, event_type, content jsonb, created_at)

playbooks (id, client_id, category, title, content,
           embedding vector(1536) NOT NULL, success_score, created_at)

manual_versions (id, version, content, changelog, embedded_at, created_at)

-- Aprovação e fluxo
approvals (id, task_id, type ('internal'|'domain'|'client'),
           status, approver_id, decided_at, notes)

webhook_events (provider, event_id, payload jsonb, processed_at,
                PRIMARY KEY (provider, event_id))

pipefy_outbox (id, task_id, payload, attempts, last_error, scheduled_at, sent_at)

embedding_pending (id, target_table, target_id, content, attempts, created_at)

-- Operacional
budget_ledger (id, task_id, client_id, model, input_cached_tokens,
               input_fresh_tokens, output_tokens, cost_usd, occurred_at)

domain_experts (user_id, categories text[], active)

skills (id, name, description, category, capabilities, created_at)

users (id, telegram_user_id, telegram_chat_id, email, role, active)
```

**RLS habilitado em TODAS as tabelas com `client_id`.** Toda query de agente passa `client_id` no contexto auth do Postgres.

---

## 14. Plano de Execução (4–6 meses, com buffers)

### Fase 0 — Setup e Smoke Test (semana 1)
- Criar repositório `Zoomma_automations` (monorepo)
- Schema Supabase completo + RLS + seeds (7 categorias, lista trilíngue de proibidas)
- `shared/llm.ts` com prompt caching ativo
- Auditor camadas 1+2 com seed de 30+30 calibração
- Smoke test E2E: briefing fictício → 1 copy → auditor → aprovação simulada → status `done`

### Fase 1 — Núcleo (semanas 2–5)
- Bot Telegram (whitelist dupla, token rotativo, 5 comandos básicos)
- Painel web: Painel Geral, Clientes, Funcionários, Inbox
- **Tela Serviços do Cliente** — configuração de atividades por cliente (blocos por categoria, toggle Auto/Humano, periodicidade, ⚙ por agente); seed do `service_catalog` com todos os agentes planejados
- **Agente Briefing** — conduz entrevista estruturada com o cliente e extrai informações do projeto
- **Agente Biblioteca de Marca** — recebe o briefing aprovado e constrói/atualiza a biblioteca de marca do cliente (memória semântica no Supabase)
- 1 cliente real seedeado (Biblioteca + 50 copies históricas + serviços configurados)
- Auditor com precision mensurada ≥ 90%
- Manual versionado + re-embedding pipeline

### Fase 2 — Captação (semanas 6–13)
- **Agente Prospecção Instagram** — scraping de perfis via Apify (Instagram Profile Scraper); entrega lista de leads normalizada
- **Agente Prospecção Google Maps** — scraping de estabelecimentos via Apify (Google Maps Scraper); entrega lista de leads normalizada
- **Agente Deduplicador de Leads** — recebe listas das duas prospecções e remove duplicatas (normalização de nome/telefone/email); única responsabilidade: garantir lista limpa
- **Agente SDR** — escreve mensagens de abordagem trilíngues (PT/EN/ES) personalizadas por lead
- **Agente Diagnóstico Comercial** — analisa o perfil do lead e identifica dores, oportunidades e fit com a Zoomma
- **Agente Proposta Comercial** — gera proposta comercial personalizada com base no diagnóstico aprovado
- Pipeline de Captação visual no painel

### Fase 3 — Entrega (semanas 14–25, **stretch**)
- **Agente Estrategista de Marketing** ← *pré-requisito de toda a Fase 3; executado primeiro para cada cliente* — análise estratégica profunda: posicionamento, público-alvo, proposta de valor única, canais prioritários, gaps de mercado, diferencial competitivo, objetivos 3/6/12 meses; usa Opus; output alimenta todos os agentes de planejamento e produção abaixo
- **Agente Plano de Negócios** — gera documento de plano estratégico de negócios com base na estratégia aprovada (Opus)
- **Agente Plano de Marketing** — gera documento de plano de marketing com base no plano de negócios aprovado (Opus)
- **Agente Calendário Editorial** — gera calendário editorial mensal com base no plano de marketing aprovado
- **Agente Copywriter Estratégico** — escreve copies longas (landing pages, emails, apresentações); conteúdo de maior profundidade estratégica; distinto do copywriter de posts
- **Agente Copywriter de Posts** — ultra-especializado em textos curtos, legendas e copies para redes sociais; usa Gemini Pro via Batch API async; não toca em imagens
- **Agente Prompt de Imagem** — ultra-especializado em traduzir briefing/copy em prompt técnico otimizado para geração de imagem; não chama API de imagem
- **Agente Gerador de Imagens** — recebe prompt pronto do Agente Prompt de Imagem e chama `gemini-3-pro-image-preview` via Batch API; não cria prompts, só executa a geração
- PipefyAdapter completo + LinkBasedAdapter fallback
- **Agente Postagem Meta** — publica posts orgânicos no Instagram/Facebook via Meta Graph API; confirmação dupla no Telegram + janela undo 60s
- **Agente Campanhas Meta** — gerencia anúncios via Meta Ads MCP Server oficial (mcp.facebook.com/ads); cria, edita, pausa campanhas, ajusta orçamentos e analisa métricas *(se crescer demais: dividir em Operacional vs Analítico)*
- Domain Expert flow (opcional — schema preparado, ativação quando necessário)
- ROI Dashboard

**Buffer de 30% embutido em cada fase. Fase 3 marcada como stretch — pode escorregar para 7º mês.**

---

## 15. Critérios de Aceite por Fase

### Fase 0 (Smoke test)
- Smoke test E2E passa sem intervenção manual
- Schema Supabase aplicado com RLS testado (não-cliente não acessa dados de cliente)
- Prompt caching ativo (medido via response headers Anthropic)

### Fase 1
- Bot Telegram + painel + Briefing funcionando
- 1 cliente real seedeado
- Auditor precision ≥ 90% em 30 itens rotulados (medida)
- ROI baseline coletado (tempo manual de cada tarefa)

### Fase 2
- 10 leads reais captados via Apify
- 1 proposta gerada e aprovada manualmente sem retrabalho
- Diagnóstico Comercial < 5 min wall-clock
- 0 incidentes de mensagem duplicada (dedupe funcionando)

### Fase 3
- 1 cliente real recebe calendário aprovado e agendado via sistema
- 0 incidentes de palavra proibida em produção
- ROI dashboard mostra horas mensuradas economizadas
- 30 dias sem intervenção manual em fluxo de captação

---

## 16. SLA e Capacidade Humana

**Capacidade-base documentada:**
- ~30 itens/dia/sócio para revisão (Camada 3)
- Backlog > 1 dia de capacidade → bloquear novos jobs OU subir prioridade automaticamente

**Antes de aceitar cliente N+1:**
- Calcular `volume_estimado_mensal × tempo_médio_revisão`
- Comparar com capacidade restante (Rento + Bruno)
- Bloquear ou contratar capacidade extra

**Auditor Camada 2 calibrado** reduz volume humano — esse é o vetor de escala.

---

## 17. Princípios Não-Negociáveis

1. **IA nunca decide sozinha em ações irreversíveis.** Postar, agendar, enviar — sempre humano.
2. **Manual da Zoomma é fonte única de verdade.** Versionado no sistema, não no Drive.
3. **Modularidade total:** novo agente = copiar `_template`, configurar 2 arquivos, sistema detecta.
4. **Operacional > sofisticado:** simples-que-funciona vence elegante-que-talvez.
5. **Tudo audita:** quem fez o quê, quando, com qual versão de prompt, com que custo.
6. **Fail-closed em qualidade.** Auditor offline → para a operação. Não entrega lixo.
7. **Vendor abstraction onde dói.** LLM, Aprovação Cliente, Mensageria — todos atrás de interface.
8. **Versão congelada na execução.** Tarefa termina na versão em que começou.

---

## 18. Decisões Confirmadas (2026-05-07)

1. ✅ **Railway** — free tier aprovado para começar. Railway free = $5 crédito/mês, suficiente para volume inicial. Vercel continua para painel + webhooks curtos. Railway para workers persistentes (timeout Vercel não comporta workers longos).
2. ✅ **Pipefy** — plano Starter pago (membro). API + webhook disponíveis. Reconfigurações necessárias de actor já existente (Instagram Profile Scraper — ver item 3).
3. ✅ **Apify** — conta ativa, usa Instagram Profile Scraper (ator antigo). Precisará de revisão/reconfiguração na Fase 2. Actor mapeado: Instagram Profile Scraper. Google Maps Scraper a verificar.
4. ✅ **Email** — Resend confirmado.
5. ✅ **Domínio** — localhost no início. URL de produção configurada mas não publicada (engatilhada). Subdomínio Zoomma quando fizer sentido.
6. ✅ **Telegram** — Rento ID: `1228469717` (whitelist inicial). Bruno adicionado depois quando estiver pronto.
7. ✅ **Domain Experts** — Camila e Paola NÃO participam do fluxo de aprovação técnica. Responsabilidade final de aprovação é do cliente via Pipefy. Tabela `domain_experts` mantida no schema para uso futuro opcional.

---

## 19. Dívida Técnica Acumulada

Itens conhecidos que foram conscientemente adiados. Devem ser endereçados antes do final da fase em que foram criados, salvo justificativa explícita.

### Fase 1
- **DT-1.1 — RLS via auth real no controller.** Hoje todos os Server Components usam `service_role` (bypass RLS). Funcional para MVP interno (só Rento + Bruno acessam), mas viola o princípio "RLS habilitado em TODAS as tabelas com client_id". Resolução: implementar Supabase Auth + middleware Next.js + trocar `createAdminClient` por `createClient` (server, anon + cookies) em Server Components; manter `admin` apenas em route handlers e server actions de operações de sistema.
- **DT-1.2 — Auth login screen.** Sistema hoje é aberto. Resolver junto com DT-1.1.

---

## 20. Próximo Passo Concreto

**Fase 0 (Smoke Test E2E) — pronta para iniciar.**

Objetivo da Fase 0: validar que os blocos fundamentais se comunicam antes de construir qualquer agente de negócio.

**Checklist Fase 0:**
- [ ] Supabase: schema base criado (tabelas `tasks`, `agents`, `clients`, `events`)
- [ ] Railway: worker Node.js rodando, polling `tasks` via Supabase Realtime
- [ ] Controller (Next.js): API route que insere task e aguarda resposta
- [ ] Auditor da Marca: camada 1 (regex) + camada 2 (LLM) funcionando
- [ ] Telegram: bot envia notificação quando task completa
- [ ] Pipefy: card criado e webhook recebido
- [ ] Smoke test E2E: inserir task → worker executa → auditor valida → Telegram notifica → Pipefy recebe card

Critério de aceite: todo o fluxo acima completo sem intervenção manual = autorização para Fase 1.

Não escrevo nenhuma linha de código antes das 7 respostas. Esse é o último portão.
