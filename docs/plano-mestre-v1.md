# Plano Mestre — Sistema de Agentes IA da Zoomma (v1, pré-revisão)

> Documento auto-suficiente para revisão adversarial. Contém todo o contexto, decisões e plano de execução.

---

## 1. Contexto da empresa

**Zoomma** é uma agência de marketing consultivo estratégico para o mercado da beleza (brasileiros e hispanos nos EUA). Posicionamento forte e disciplinado: anti-promessas vazias, anti-marketing genérico. Tom profissional/estratégico/didático. Inspirações cristãs (sem discurso religioso explícito).

**Operação:**
- 2 sócios: Rento (programador) + Bruno
- Camila e Paola: atuam no setor de beleza (estética/harmonização) — não programam, não operam o sistema diretamente
- Visão: 50–60 clientes ativos, ticket médio USD 600
- Prevê desenvolver cursos, treinamentos e produtos educacionais no futuro

**Manual oficial de IA da Zoomma** (regras absolutas):
- IA NUNCA inventa informações (números, métricas, prazos)
- Se dado não está no Guia, IA pergunta antes de produzir
- Lista de termos proibidos: "fórmula secreta", "resultado garantido", "explodir vendas", "dobrar faturamento"
- Nunca prometer faturamento, lucro ou número de clientes
- Frase-chave de controle: "A Zoomma não vende promessas. A Zoomma constrói crescimento com estratégia, clareza e responsabilidade."

---

## 2. Objetivo do sistema

Construir um sistema interno de agentes IA que automatize processos da Zoomma — começando por **captação de leads** e **atendimento estratégico/operacional de clientes** — com aprovação humana onde for crítico, totalmente autônomo onde não for, e fácil de evoluir adicionando novos agentes ao longo do tempo.

**Foco inicial:** uso interno (Rento + Bruno). Pode evoluir para produto/cliente no futuro.

---

## 3. Stack técnica

| Camada | Tecnologia |
|---|---|
| Frontend/Backend | Next.js 14 (App Router) — apenas no Controlador |
| Agentes individuais | Node.js + TypeScript scripts simples |
| Banco de dados | Supabase (Postgres + Auth + Realtime + pgvector) |
| IA | Anthropic Claude (principal), OpenAI/Gemini (alternativas) |
| Scraping | Apify |
| Email | Resend |
| Bot mensagens | Telegram Bot |
| Aprovação cliente | Pipefy (API + webhook) |
| Deploy | Vercel (Controlador) + execução agendada/sob demanda dos agentes |

---

## 4. Arquitetura geral

### 4.1. Estrutura de pastas (monorepo)

```
C:\Zoomma_automations\
├── controller/              ← Next.js: site + Bot Telegram + Orquestrador
├── agents/
│   ├── _template/           ← modelo para criar novos agentes
│   ├── prospeccao/
│   ├── briefing/
│   └── copywriter/
└── shared/
    ├── supabase.ts          ← cliente compartilhado
    ├── types.ts             ← interfaces TypeScript
    ├── auditor.ts           ← Auditor da Marca
    └── llm.ts               ← adaptador para Anthropic/OpenAI
```

### 4.2. Comunicação entre componentes

Supabase como **message bus**:
- Controlador insere tarefa em `tasks` (status: `pending`)
- Agente respectivo monitora via Supabase Realtime
- Agente executa, escreve resultado em `tasks.output` como JSON, atualiza status
- Controlador detecta mudança de status e decide próximo passo

Sem filas externas (Redis, SQS). Sem mensageria. Tudo via Postgres.

---

## 5. Memória do sistema (framework CoALA)

### 5.1. Memória Semântica
**O que é:** fatos fixos da marca.
**Conteúdo:** Guia Comercial Zoomma, palavras proibidas, ofertas oficiais, tom de voz, biblioteca de marca por cliente.
**Onde:** tabela `memory_semantic` no Supabase + pgvector para busca por similaridade.
**Indexação:** chunking contextual (Anthropic) — adiciona contexto a cada chunk antes de embedar (reduz falhas de retrieval ~35%).

### 5.2. Memória Episódica
**O que é:** linha do tempo do que aconteceu.
**Conteúdo:** briefings passados, decisões aprovadas/rejeitadas, conversas com cliente, eventos do sistema.
**Onde:** tabela `events` (timestamped, indexada por cliente + tempo).

### 5.3. Memória Procedural
**O que é:** o que funcionou (few-shot dinâmico).
**Conteúdo:** copies aprovadas, workflows que deram certo, padrões de sucesso.
**Onde:** tabela `playbooks`.

---

## 6. Orquestrador (NOT-block pattern)

O Orquestrador **nunca executa trabalho**. Apenas:
- Recebe pedido (do Telegram ou do site)
- Decompõe em tarefas
- Delega aos agentes apropriados
- Monitora o progresso
- Escala para humano quando necessário

**Identidade explícita:**
> "Eu NÃO sou um copywriter. Eu NÃO sou um designer. Eu NÃO sou um analista. Eu coordeno. Se a tarefa requer trabalho especializado, eu delego."

---

## 7. Auditor da Marca (3 camadas)

Antes de qualquer entrega ao cliente:

**Camada 1 — Determinística (sem IA):**
- Lista de palavras proibidas (regex)
- Limites de tamanho
- Formato obrigatório (CTA, estrutura)

**Camada 2 — IA (LLM-as-judge):**
- Carrega o Guia Zoomma como contexto
- Analisa: tom, posicionamento, alinhamento
- Devolve `APROVADO` ou `REJEITADO + razão`

**Camada 3 — Humana:**
- Você ou Bruno revisam só o que passou nas camadas 1 e 2
- Última palavra antes de ir ao cliente

---

## 8. Anatomia de um funcionário

Cada funcionário tem 3 camadas de configuração:

### 8.1. Identidade (Supabase, editável no navegador)
```
Nome, descrição, categoria, autonomia, requires_auditor
```

### 8.2. Fluxo de trabalho (Supabase, JSON, editor visual no navegador)
Sequência de passos. Editável arrastando, adicionando, removendo.

### 8.3. Instruções e regras (Supabase, texto markdown, editor no navegador)
Estrutura padronizada para todo funcionário:
```
PAPEL
SEMPRE FAÇA
NUNCA FAÇA
FORMATO DE ENTREGA
```

**Histórico de versões:** toda mudança gera nova versão com nota explicativa. Reversível a qualquer momento.

**Tipos de funcionário:** IA, humano (designer, videomaker, etc), ou misto. Sistema agnóstico à origem do conteúdo.

---

## 9. Catálogo de skills (categorias)

| Categoria | Conteúdo |
|---|---|
| Captação | Prospecção, SDR, diagnóstico de lead, proposta |
| Estratégia | Briefing, posicionamento, plano de negócios, calendário |
| Produção | Copywriting, roteiro, imagem, vídeo |
| Qualidade | Revisão, auditoria, checklist |
| Entrega | Agendamento, publicação, envio |
| Análise | Relatórios, métricas, diagnóstico |
| Operações | Onboarding, financeiro, gestão interna |

**Auto-categorização:** ao criar skill nova, sistema sugere categoria com base na descrição (LLM). Usuário confirma ou corrige.

---

## 10. Interfaces

### 10.1. Navegador (configurar e revisar)

**Telas:**
1. Painel Geral
2. Pipeline de Captação (funil de leads)
3. Clientes (ficha completa, regras, biblioteca de marca)
4. Agenda Editorial Visual
5. Fila de Aprovações (internas + cliente via Pipefy)
6. Funcionários (lista, criação via Ficha de Admissão)
7. Catálogo de Skills (por categoria)
8. Log de Execuções (auditoria completa)

**Ficha de Admissão (criação guiada de funcionário) — 7 perguntas:**
1. Qual o papel?
2. IA ou humano?
3. Para quais clientes trabalha?
4. O que precisa receber para começar?
5. O que entrega ao terminar?
6. Precisa de aprovação? (sempre/às vezes/nunca)
7. O que NUNCA pode fazer?

### 10.2. Telegram (operar e consultar)

**Ações:**
- Pedir execução de tarefas
- Confirmar agendamentos (botões SIM/NÃO)
- Comandos: `/leads`, `/pendentes`, `/cliente [nome]`, `/manual`

**Consultas em linguagem natural:**
- "O que está pendente hoje?"
- "Maria já aprovou as artes?"
- "Qual o plano da Maria para junho?"
- "Tem algo atrasado?"

**Alertas push:**
- Cliente aprovou no Pipefy
- Agente terminou tarefa
- Lead novo captado
- Algo atrasado

---

## 11. Cliente — interação

Cliente NUNCA acessa o sistema interno. Único ponto de contato: **Pipefy**.
- Sistema cria card no Pipefy com preview (artes, calendário, plano)
- Cliente aprova ou solicita ajuste no Pipefy
- Webhook avisa o sistema
- Sistema notifica Rento/Bruno no Telegram

---

## 12. Modo de autonomia por tipo de tarefa

| Tipo de tarefa | Autonomia |
|---|---|
| Captação de leads | Total — roda em background |
| Análise de mercado / diagnóstico | Total — roda em background |
| Geração de relatórios internos | Total |
| Geração de copy / artes | Aprovação interna obrigatória |
| Agendamento Meta | Confirmação dupla no Telegram |
| Envio para cliente (Pipefy) | Aprovação interna obrigatória |

---

## 13. Schema Supabase (tabelas principais)

```sql
clients (
  id, name, status, active_agents jsonb, brand_library jsonb, created_at
)

agents (
  id, slug, name, category, autonomy, requires_auditor,
  workflow jsonb, instructions text, version int, active bool
)

agents_versions (
  id, agent_id, version, instructions, workflow, change_note,
  changed_by, changed_at
)

tasks (
  id, agent_slug, client_id, status, input jsonb, output jsonb,
  cost_usd, retry_count, error, created_at, started_at, finished_at
)

memory_semantic (
  id, client_id, type, content, embedding vector, metadata jsonb
)

events (
  id, client_id, agent_slug, task_id, event_type, content jsonb, created_at
)

playbooks (
  id, client_id, category, title, content, embedding, success_score
)

skills (
  id, name, description, category, capabilities, created_at
)

approvals (
  id, task_id, type (internal/client), status, approver, decided_at, notes
)
```

RLS habilitado em todas tabelas com `client_id`.

---

## 14. Plano de execução em fases

### Fase 1 — Núcleo (semanas 1–2)
- Schema Supabase com RLS
- Auditor da Marca (3 camadas)
- Bot Telegram básico
- Agente Briefing + Biblioteca de Marca
- Site Next.js (telas: Painel, Clientes, Funcionários)

### Fase 2 — Captação (semanas 3–5)
- Agente Prospecção (via Apify)
- Agente SDR (mensagens de abordagem)
- Agente Diagnóstico Comercial
- Agente Proposta Comercial

### Fase 3 — Entrega para cliente (semanas 6–10)
- Agente Plano de Negócios/Marketing
- Agente Calendário Editorial
- Agente Copywriter
- Integração Pipefy (criação de card + webhook)
- Agente Agendamento Meta

---

## 15. Lacunas críticas identificadas (12) e mitigação prevista

1. **Funcionário trava no meio:** prazo máximo + retentativa exponencial (3x: 1m, 5m, 15m) + fila "Atenção Humana".
2. **Loop infinito de custos:** teto por tarefa ($0.50), por cliente/dia ($5), por sistema/dia ($50). Modo seguro automático.
3. **Webhook Pipefy falha:** webhook + polling backup a cada 10min. Deduplicação. Monitor de saúde.
4. **Vazamento entre clientes:** RLS Postgres no dia 1. `client_id` obrigatório em toda execução.
5. **Auditor alucina:** 3 camadas (determinística + IA + humana). Camada 1 pega 60%, Camada 2 pega 30%, Camada 3 pega 10%.
6. **Cliente muda de ideia:** janela de 24h "amendable" antes do agendamento real. Histórico completo de versões.
7. **Sistema engessa o manual:** tipo de tarefa "Manual" — registra ação humana sem passar pelo fluxo.
8. **Cold start sem dados:** etapa de seeding obrigatória — popula 10–20 copies antigos, Guia Zoomma, briefings históricos.
9. **Não sabe se vale a pena:** dashboard ROI Operacional (tarefas, taxa qualidade, custo, horas economizadas).
10. **Telegram inseguro:** whitelist IDs. Token de confirmação rotativo (24h) para ações destrutivas. Log completo.
11. **Tudo dependente de Rento:** Manual de Operação auto-gerado. Memória de projeto sempre atualizada. Procedimentos de emergência.
12. **Vendor lock-in:** camadas de adaptador (`gerarTexto()`, `enviarParaAprovacao()`). Trocar fornecedor = mudar 1 função.

---

## 16. O que está fora de escopo (decidido explicitamente)

- Cliente operando o sistema diretamente (só via Pipefy)
- Dashboard mobile (Telegram cobre)
- Integração com outros canais além de Telegram + Pipefy + Meta (na v1)
- Multi-língua (sistema todo em PT-BR; conteúdo gerado pode ser PT/EN/ES conforme cliente)
- Pagamentos / cobrança (gestão interna fica fora)
- Multi-organização (Zoomma é a única organização operadora; clientes são tenants leitores via Pipefy)

---

## 17. Princípios não-negociáveis

1. **IA nunca decide sozinha em ações irreversíveis.** Postar, agendar, enviar email, fechar negócio — tudo passa por humano.
2. **Manual da Zoomma é fonte única de verdade.** Auditor compara contra ele.
3. **Modularidade total:** novo agente = copiar `_template`, configurar 2 arquivos, sistema detecta.
4. **Operacional > sofisticado:** preferir solução simples que funciona à elegante que talvez funcione.
5. **Tudo audita:** quem fez o quê, quando, por que, com que custo.

---

Fim do plano mestre v1. Aguardando revisão adversarial.
