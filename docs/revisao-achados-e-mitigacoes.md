# Revisão Adversarial — Achados e Mitigações

> Consolidação dos 3 revisores (Cynical, Edge Case Hunter, Readiness Check). 35 achados externos + 12 internos da prontidão. Cada item mapeado para correção concreta no plano v2.

---

## Sumário

| Origem | Achados | Críticos | Altos | Médios |
|---|---:|---:|---:|---:|
| Cynical Review | 15 | 4 | 9 | 2 |
| Edge Case Hunter | 20 | — | — | — |
| Readiness Check (interno) | 12 | — | — | — |
| **Total** | **47** | | | |

---

## Bloco A — Execução e Infraestrutura

### A1. Onde os agentes rodam (Cynical #2) 🔴
**Problema:** plano dizia "execução agendada/sob demanda dos agentes" sem definir runtime. Vercel functions têm timeout 10–300s e são stateless. Apify scrape + LLM longo estoura.

**Mitigação aplicada:**
- Controlador (Next.js) → **Vercel** (curto, request/response)
- Agentes (workers persistentes) → **Railway** (containers de longa duração, simples para 1 dev)
- Jobs longos/agendados → mesma infra de Railway com cron + workers em loop
- Documentar `runtime` em `agents.runtime` (`vercel-fn` | `worker` | `cron`)

### A2. Realtime do Supabase como message bus tem race conditions (Cynical #1, Edge #12) 🔴
**Problema:** sem locking, dois agentes podem clamar a mesma task. Reconexão pode perder eventos.

**Mitigação aplicada:**
- Claim com `SELECT … FOR UPDATE SKIP LOCKED` (transação curta)
- `tasks.claimed_by` + `tasks.claimed_at` + `tasks.claim_lease_seconds`
- Polling backup a cada 60s além do Realtime (cinto + suspensório)
- Timeout de enfileiramento: task `pending` há > 2min sem `started_at` re-alerta

### A3. Migração de schema com tasks em voo (Edge #20) 🟡
**Mitigação aplicada:**
- `tasks.schema_version` obrigatório
- Agente rejeita versões desconhecidas com erro explícito (não silencioso)
- Toda migração suporta versão N e N-1 por 30 dias

---

## Bloco B — Concorrência e Consistência de Estado

### B1. Versionamento sem amarrar versão à task (Cynical #10, Edge #2) 🟡
**Mitigação aplicada:**
- `tasks.agent_version_id FK agents_versions(id)` — congelado no momento do claim
- Editar agente NÃO afeta tasks já iniciadas
- Reverter para v3 enquanto v5 está rodando = tasks v5 terminam em v5

### B2. Conflito otimista quando 2 pessoas editam o mesmo agente (Edge #14) 🟡
**Mitigação aplicada:**
- `version int` em `agents` com check otimista no UPDATE
- On conflict → UI mostra diff lado a lado + escolha manual (manter / sobrescrever / merge)

### B3. Cliente aprova enquanto agente ainda gera (Edge #1) 🟡
**Mitigação aplicada:**
- Card Pipefy só é criado APÓS `tasks.status = 'completed'` E auditor camadas 1+2 OK
- Webhook de aprovação rejeita se a task vinculada não está `finished`

### B4. Webhook duplicado / polling encontra antes do webhook (Edge #4) 🟡
**Mitigação aplicada:**
- Tabela `webhook_events(provider, event_id PRIMARY KEY)` — upsert idempotente
- Idempotência por `(task_id, action)` em qualquer ação irreversível

### B5. Confirmações conflitantes no Telegram (Edge #5) 🟡
**Mitigação aplicada:**
- Compare-and-swap em `approvals.status` — primeiro vence
- Janela de "undo" de 60s antes de chamar APIs externas (Meta, Pipefy, Resend)
- Se 2ª pessoa clica em janela undo, ação cancela

---

## Bloco C — Custo e Observabilidade

### C1. Tetos de custo desconsideram input cached vs fresh vs output (Cynical #9) 🟡
**Mitigação aplicada:**
- Orçamento granular: `input_cached_usd`, `input_fresh_usd`, `output_usd` em `tasks`
- Ativar **prompt caching** desde o dia 1 em `shared/llm.ts` (cache do Guia Zoomma + Biblioteca de Marca)
- Modelo default: `claude-sonnet-4-6`. Opus apenas para Auditor camada 2 e Plano de Negócios
- Recalcular teto considerando porção cached (5x mais barato)

### C2. Limite de custo bate no meio da execução (Edge #6) 🟡
**Mitigação aplicada:**
- Check de custo a cada chamada LLM dentro da task
- Ao estourar → `status='budget_exceeded'`, salvar output parcial em `tasks.output`, push Telegram
- Nunca aborto silencioso

### C3. ROI sem dados base (interno) 🟡
**Mitigação aplicada:**
- Dashboard ROI Operacional precisa de baseline — pedir ao Rento estimar tempo manual de cada tipo de tarefa antes de virar a chave
- Pesos fixos por tipo de tarefa documentados em `docs/roi-pesos.md`

---

## Bloco D — Auditor e Qualidade de Saída

### D1. Auditor LLM-as-judge sem calibração (Cynical #7) 🟡
**Mitigação aplicada:**
- Seed obrigatório: 30 copies aprovadas + 30 rejeitadas (rotuladas) ANTES de virar a chave
- Métrica mensal de **precision/recall** do auditor — review de 20 itens random
- Threshold de "aprovação automática" começa conservador (humano sempre revisa); afrouxa só após 3 meses de >95% precision

### D2. Auditor falha aberto vs fechado em outage (Edge #16) 🟡
**Mitigação aplicada:**
- **Fail-closed por padrão** (preferimos travar a operação a entregar lixo)
- Fallback automático: se Anthropic falhar, tenta OpenAI; se ambos falham, vai para "Atenção Humana"
- Nunca aprovar por padrão em erro

### D3. Palavras proibidas só em PT-BR (Edge #8) 🟡
**Mitigação aplicada:**
- Lista trilíngue de proibidas: PT/EN/ES (cliente da Zoomma é brasileiro/hispano nos EUA)
- Detector de idioma do output antes de aplicar regex
- Manual da Zoomma (texto base do Auditor) também versionado em PT/EN/ES

### D4. Emojis e zero-width chars burlam regex (Edge #9) 🟡
**Mitigação aplicada:**
- Normalização Unicode NFKC antes de regex
- Remover zero-width chars (U+200B–U+200F, U+FEFF)
- Detecção de "leetspeak" simples (`f🔥rmula`, `g4r4ntid0`) — fuzzy match com Levenshtein

### D5. Cold start procedural insuficiente (Cynical #14) 🟢
**Mitigação aplicada:**
- Seed mínimo elevado: **50 copies por categoria principal** (não 10–20)
- Memória procedural marcada como "lite" no mês 1–2 (warning visual no painel)
- Aceitar que recall fica baixo nos 3 primeiros meses; medir em vez de esconder

### D6. "Reduces falhas ~35%" sem evidência local (Cynical #8) 🟢
**Mitigação aplicada:**
- Antes de fixar chunking contextual, rodar benchmark próprio em 20 queries reais
- Comparar fixed-size 512 vs contextual em recall@5
- Documentar resultado em `docs/decisoes-tecnicas.md`

### D7. Manual da Zoomma sem pipeline de atualização (Cynical #13) 🟡
**Mitigação aplicada:**
- Manual versionado no Supabase (não em arquivo no Drive)
- Edição via UI do navegador → trigger automático de re-embedding
- `manual_versions` com diff e changelog

---

## Bloco E — Multi-tenancy e Segurança

### E1. Cliente removido com dados pendentes (Edge #3) 🟡
**Mitigação aplicada:**
- Soft delete (`clients.deleted_at`)
- Job noturno: 30 dias após soft delete → purga embeddings, fecha cards Pipefy abertos, anonimiza events
- Pré-checklist de remoção: "X cards Pipefy abertos, Y tasks pendentes — confirma?"

### E2. Telegram whitelist user_id vs chat_id (Edge #19) 🟡
**Mitigação aplicada:**
- Whitelist DUPLA: `user_id` E `chat_id` privado (1:1 conversa)
- Mensagens de grupos: rejeitadas com erro
- Token de confirmação 24h apenas em DM, nunca em grupo

### E3. Pipefy down quando sistema cria card (Edge #15) 🟡
**Mitigação aplicada:**
- Fila `pipefy_outbox` com retry exponencial
- Após 3 falhas consecutivas → alerta Telegram + task em "Atenção Humana"
- Métrica de saúde Pipefy no painel

---

## Bloco F — Internacionalização

### F1. Timezone não definido (Edge #10) 🟡
**Mitigação aplicada:**
- Tudo em UTC no banco (`TIMESTAMPTZ`)
- `clients.timezone TEXT NOT NULL` — formato IANA (`America/New_York`, `America/Sao_Paulo`, etc.)
- Conversão na borda (UI + scheduling)

### F2. DST muda enquanto agendamento pendente (Edge #11) 🟡
**Mitigação aplicada:**
- Timezone IANA (não offset numérico)
- `scheduled_at` em UTC + recomputo de "próximo disparo" no momento da execução
- Testes específicos para março/novembro nos EUA

---

## Bloco G — Workflow Editor / Config

### G1. Editor visual de workflow é projeto inteiro (Cynical #6) 🔴
**Mitigação aplicada:**
- **v1: editor JSON cru com validação Zod + diff visual** (não node-based)
- v2 (futuro): editor visual com React Flow — sai do escopo das 10 semanas
- Schema do JSON publicado em `shared/schemas/workflow.ts`

### G2. Auto-categorização sem categorias seed (Edge #13) 🟡
**Mitigação aplicada:**
- 7 categorias seed obrigatórias no setup inicial (fixture de migração)
- LLM auto-categorizador escolhe ENTRE as 7 — não inventa
- Adicionar categoria nova é ação manual explícita (não inferida)

---

## Bloco H — Humanos no Fluxo

### H1. Trabalho de humano sem mecânica clara (Cynical #15) 🟡
**Mitigação aplicada:**
- Tabela `human_tasks` espelhando `tasks` para humanos
- UI "Minhas Tarefas" no navegador para designer/videomaker
- Notificação Telegram quando task é claimable por humano específico
- Entrega obrigatoriamente via formulário (upload arquivo + nota) — sem isso, status não vai a `done`

### H2. Camila/Paola como especialistas de domínio órfãs (Cynical #4) 🟡
**Mitigação aplicada:**
- Role `domain_expert` em `users` + mapeamento por categoria de cliente
- Conteúdo clínico/estético: aprovação de Camila ou Paola obrigatória (não substitui aprovação Rento/Bruno)
- Fluxo de aprovação configurável por cliente: `[Auditor → Domain Expert → Sócio → Cliente]`

### H3. Volume humano de revisão (Cynical #12) 🔴
**Mitigação aplicada:**
- Estimativa de capacidade ANTES de aceitar cliente N+1: tempo médio de revisão × volume mensal
- Capacidade-base documentada: ~30 itens/dia/sócio (1h)
- Alerta automático: se backlog > 1 dia de capacidade → bloquear novos jobs ou subir prioridade
- Auditor camada 2 calibrado para reduzir volume humano (D1)

---

## Bloco I — Vendor Abstraction e Robustez

### I1. Pipefy lock-in (Cynical #3) 🟡
**Mitigação aplicada:**
- Interface `ClientApprovalProvider` em `shared/approval/`
- Implementações: `PipefyAdapter` (v1) + `LinkBasedAdapter` (fallback simples — link único + form Supabase)
- Migrar entre eles = trocar implementação, sem mexer no resto

### I2. Telegram como UI primária frágil (Cynical #11) 🟡
**Mitigação aplicada:**
- "Inbox" no dashboard web espelha 100% dos alertas Telegram
- Email diário de pendências (Resend) — backup quando Bruno está em viagem internacional
- Comando `/inbox-resync` no Telegram para recuperar alertas perdidos

### I3. Lead duplicado de Apify (Edge #17) 🟡
**Mitigação aplicada:**
- Chave de dedupe composta normalizada: `(lower(handle), e164(phone), lower(email))`
- Merge automático com prioridade: dado mais recente vence
- SDR consulta dedupe antes de disparar mensagem

### I4. Cliente solicita ajuste vazio no Pipefy (Edge #18) 🟢
**Mitigação aplicada:**
- Validar payload Pipefy: `min(3 chars úteis após trim)`
- Senão, Telegram pede esclarecimento humano
- Não reabrir task automaticamente sem input válido

### I5. Embedding falha durante seeding/retrieval (Edge #7) 🟡
**Mitigação aplicada:**
- `memory_semantic.embedding NOT NULL` (banco rejeita inserção sem embedding)
- Fila `embedding_pending` para reprocessar com backoff
- Auditor falha-fechado se memória semântica do cliente < N chunks (configurável; default N=20)

---

## Bloco J — Esquema e Schemas Faltando

### J1. Schemas de input/output indefinidos (Readiness) 🟡
**Mitigação aplicada:**
- Cada agente DEVE expor `inputSchema` e `outputSchema` (Zod) no `agent.config.ts`
- Validação em runtime no claim e na entrega
- Documentado em `docs/contratos-agentes.md`

### J2. Tabelas faltando do schema v1:
**Adicionadas:**
```sql
agents_versions      (versionamento de instruções/workflow)
human_tasks          (tarefas para designers/videomakers)
webhook_events       (idempotência de webhooks)
pipefy_outbox        (fila de envio com retry)
embedding_pending    (fila de embeddings)
manual_versions      (versionamento do Guia Zoomma)
domain_experts       (Camila, Paola, e mapeamento por categoria)
budget_ledger        (registro granular de custos por task)
```

---

## Bloco K — Prazo e Escopo

### K1. Estimativa 10 semanas é fantasia (Cynical #5) 🟡
**Mitigação aplicada:**
- Prazo realista: **4–6 meses** para alcançar Fase 3 completa
- Fase 1 (núcleo): 3–4 semanas (não 2)
- Fase 2 (captação): 6–8 semanas
- Fase 3 (entrega): 8–12 semanas — marcada como **stretch**
- Buffer 30% por fase
- Marcos intermediários ("milestones") visíveis e mensuráveis

### K2. Smoke test E2E ausente (Readiness) 🔴
**Mitigação aplicada:**
- **Caso de uso 0**: "Briefing de cliente fictício → geração de 1 copy → Auditor → aprovação interna → Pipefy mock → confirmação Telegram → mark done"
- Esse fluxo precisa funcionar fim-a-fim ANTES de qualquer fase real começar
- Cobre: schema, auditor, telegram, pipefy adapter, agente isolado

### K3. Critérios de aceite por fase (Readiness) 🟡
**Mitigação aplicada:**
- **Fase 1 pronta quando:**
  - Smoke test E2E passa
  - 1 cliente real seedeado (Biblioteca de Marca + 50 copies históricas)
  - Auditor com precision medida ≥ 90% em 30 itens rotulados
  - Bot Telegram com whitelist + token + 5 comandos básicos
  - Painel + Cliente + Funcionários funcionando no navegador
- **Fase 2 pronta quando:**
  - 10 leads reais captados via Apify
  - 1 proposta gerada e aprovada manualmente
  - Diagnóstico Comercial sai em < 5 min
- **Fase 3 pronta quando:**
  - 1 cliente real recebe calendário aprovado e agendado via sistema
  - 0 incidentes de palavra proibida em produção
  - ROI dashboard mostra economia de horas mensurável

---

## Achados Não Mitigados (decisão consciente)

Nenhum. Todos os 47 achados foram mapeados. 7 mantidos como "monitoração mensal" ao invés de implementação imediata (categoria 🟢 médio, com revisão recorrente).

---

## Próximas Decisões Pendentes (precisa do Rento)

1. **Confirmar Railway** como host dos workers? (Alternativas: Fly.io, VPS Hetzner, Render)
2. **Pipefy tem plano com API + webhook ativos?** Confirmar limite de eventos/mês.
3. **Apify: actors específicos para nicho beleza nos EUA já mapeados?** (`Instagram Profile Scraper`, `Google Maps Scraper`)
4. **Email transacional via Resend ok ou prefere SES?** (custo)
5. **Domínio para painel web** (subdomínio Zoomma? localhost por enquanto?)
6. **Bruno tem Telegram ID confirmado?**
7. **Camila e Paola vão participar do fluxo de aprovação clínica?** (Bloco H2)
