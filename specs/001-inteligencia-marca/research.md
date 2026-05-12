# Research — Inteligência de Marca Zoomma

> Consolidação das decisões técnicas tomadas durante o discovery e a arquitetura.
> Todas as decisões já foram revisadas com o sócio. Sem `NEEDS CLARIFICATION` pendentes.

**Date**: 2026-05-11
**Source conversations**: discovery com John (PM) + arquitetura com Winston (Architect)

---

## Decisão 1 — Knowledge Base: global vs por tenant

**Decision**: Knowledge Base **global** (sem `tenant_id`). Curadoria única feita pela Zoomma.

**Rationale**:
- Visão SaaS futura é B2C para profissionais da beleza, não B2B para outras agências.
- Zoomma continua sendo a curadora central mesmo no SaaS — única fonte de verdade da base.
- Profissionais consomem; não curam.
- Simplifica RLS (sem isolamento de leitura entre tenants).

**Alternatives considered**:
- *Híbrido (global + por tenant)*: rejeitado após correção do user — não há outros tenants curando.
- *Por tenant total*: rejeitado — duplicaria curadoria entre profissionais; mata efeito de rede.

---

## Decisão 2 — Busca semântica no MVP

**Decision**: **Não** usar pgvector no MVP. Postgres full-text search (`tsvector`) com pesos (A=title, B=summary, C=content) + índice GIN.

**Rationale**:
- Volume previsto no MVP: 5-10 artigos (microagulhamento). Crescimento até ~500 artigos cabe em full-text confortavelmente.
- pgvector adiciona dependência de geração de embeddings (custo + latência) sem benefício neste volume.
- Postgres permite migração incremental (`alter table add column embedding vector(1536)`) sem mexer no resto.

**Gatilho para migração**: passar de ~500 artigos OU agentes futuros pedindo RAG real ("trechos similares a este texto").

**Alternatives considered**:
- *pgvector desde o dia 1*: rejeitado — over-engineering para o volume previsto.
- *Elasticsearch dedicado*: rejeitado — viola "boring technology"; adiciona infra.

---

## Decisão 3 — Ferramenta de busca web

**Decision**: **Tavily** (`https://api.tavily.com/search`) como motor principal. Web fetch direto para URLs específicas que o sócio mandar manualmente.

**Rationale**:
- Tavily foi projetada para alimentar agentes IA — retorna conteúdo já extraído e limpo.
- Custo desprezível para o volume: ~$0.008/busca × 20 buscas por cliente novo = $0.16.
- Reduz código necessário (sem scraping, parsing de HTML, rate limiting).

**Alternatives considered**:
- *Brave Search* (~$5/1000): mais barata, mas retorna só URL+snippet — pós-processamento maior.
- *Perplexity API* (token-based): excelente para resposta direta, mas overkill para "trazer artigos".
- *Web fetch puro* ($0): trabalho de scraping enorme; viola "boring technology" para esse caso.

**Variável de ambiente nova**: `TAVILY_API_KEY` (adicionar em `.env`, Vercel e Railway).

---

## Decisão 4 — Estrutura da Caixa de Decisões

**Decision**: Tabela única `decision_inbox` com colunas `type` (enum) + `payload jsonb`.

**Rationale**:
- UI naturalmente unifica (uma lista no dashboard).
- 5 tabelas separadas (uma por tipo) gerariam complexidade desnecessária na consulta agregada.
- Tipos já validados via CHECK constraint no Postgres.

**Alternatives considered**:
- *Uma tabela por tipo*: rejeitado — duplicação de queries e código UI.
- *jsonb sem `type` column*: rejeitado — perde índice e validação.

---

## Decisão 5 — Modelo de extração da Biblioteca via Claude

**Decision**: Uma única chamada para `claude-sonnet-4-6` com prompt sistema longo (estrutura dos 7 blocos) + briefing como user message. Saída via `tool_use` retornando JSON estruturado dos 7 blocos.

**Rationale**:
- Prompt caching (5x desconto) é eficaz: o prompt sistema é repetido para todo cliente novo.
- Sonnet 4.6 dá qualidade suficiente; pode migrar pra Opus 4.7 caso aceite-se custo maior.
- `tool_use` garante saída estruturada (sem parse fragile).

**Alternatives considered**:
- *7 chamadas separadas (uma por bloco)*: rejeitado — custo 7x e mais lento.
- *GPT-4o*: rejeitado — projeto padroniza Anthropic; OpenAI é apenas fallback (Apêndice CLAUDE.md).

---

## Decisão 6 — Storage de documentos

**Decision**: Armazenar documento inteiro em `content TEXT` + `summary TEXT` (curto, gerado por Claude) + `tags TEXT[]`. **Sem chunking** ainda.

**Rationale**:
- Sem embeddings (Decisão 2), chunks não trazem benefício.
- Summary curto permite preview rápido na UI da Caixa.
- Tags estruturadas permitem filtro eficiente.

**Migração futura**: ao introduzir pgvector, adicionar tabela `knowledge_chunks` com FK para artigo, sem mexer na estrutura atual.

---

## Decisão 7 — Detecção de drift

**Decision**: Cron diário às 03h BRT (06h UTC) via **Vercel Cron** + botão "reavaliar agora" sob demanda no dashboard.

**Rationale**:
- Cron diário é previsível, sem sobrecarga.
- 03h BRT = momento de baixo tráfego.
- Sob demanda atende quando sócio sente que algo mudou (post novo, conversa de venda).

**Alternatives considered**:
- *Trigger em tempo real*: rejeitado — complexo, pode disparar muito.
- *Sem cron (só sob demanda)*: rejeitado — depende do sócio lembrar.

---

## Decisão 8 — Onde rodam os agentes

**Decision**:
- **Brand Library Builder** (Claude rápido): worker no **Railway** (consome task da fila).
- **Knowledge Curator** (Tavily + Claude, várias chamadas): worker no **Railway**.
- **Drift Detector** (cron): endpoint Next.js em **Vercel** + **Vercel Cron**.

**Rationale**:
- Vercel functions têm timeout de 10s no plano hobby / 60s pro. Extração com Tavily pode passar — Railway permite background sem timeout.
- Vercel Cron é gratuito e suficiente para drift (job curto, paralelo por cliente).
- Workers Railway consomem task via `claim_next_task` (RPC já existente no Supabase).

**Alternatives considered**:
- *Tudo na Vercel*: rejeitado — risco de timeout em jobs longos.
- *Tudo no Railway*: rejeitado — perde a simplicidade do Vercel Cron.

---

## Decisão 9 — Multi-tenant Nível 2 hoje

**Decision**:
- Usar `clients.id` como tenant_id natural (sem coluna extra).
- RLS habilitada em todas tabelas novas; policy hoje: `service_role` tem acesso total.
- Brand Library + Brand Knowledge Links têm `client_id` (isolam por profissional).
- Knowledge Base **não tem** tenant_id (global da Zoomma).
- Decision Inbox tem `related_client_id` opcional (operacional Zoomma).

**Rationale**:
- Migração SaaS futura = adicionar Supabase Auth para profissionais + policies por `client_id`. Sem refatoração de schema.

**Alternatives considered**:
- *Schema separado por tenant*: rejeitado — sobre-engenharia para o estágio atual.
- *Sem RLS*: rejeitado — habilita o caminho para SaaS sem custo adicional.

---

## Decisão 10 — Trigger de snapshot da Biblioteca

**Decision**: Trigger `BEFORE UPDATE` em `brand_library` salva snapshot do estado anterior em `brand_library_history`, identifica quais blocos mudaram, incrementa `version`.

**Rationale**:
- Drift detection consulta histórico diretamente — sem precisar comparar manualmente.
- Auditoria fica automática (não depende do código de aplicação lembrar).
- Versão monotônica permite optimistic locking se necessário no futuro.

**Alternatives considered**:
- *Snapshot manual no código*: rejeitado — pode esquecer ou pular em caminhos novos.
- *Sem snapshot*: rejeitado — drift detection precisa de comparação histórica.

---

## Decisão 11 — Convenção de naming TypeScript

**Decision**:
- Interfaces TS usam PascalCase: `BrandLibrary`, `KnowledgeArticle`, `DecisionItem`.
- Funções públicas: camelCase verbal: `getClientBrand`, `approveDecision`, `searchKnowledge`.
- Tipos enum-like: string literal union: `type DecisionType = 'article_suggestion' | ...`.
- Português apenas em colunas semânticas dos 7 blocos (`identidade_visual`, `tom_de_voz`) — alinha com vocabulário de negócio do sócio.

**Rationale**:
- Snake_case em coluna SQL é convenção Postgres.
- Português em blocos da Biblioteca evita tradução constante na conversa do sócio.

---

## Open questions

Nenhuma. Todas as decisões foram tomadas e revisadas.

## Implicações para o próximo passo (data-model.md + contracts/)

- Data model deriva diretamente do schema SQL já consolidado em `docs/inteligencia-marca-arquitetura.md` §5.
- Contracts derivam diretamente das interfaces TS já consolidadas em `docs/inteligencia-marca-arquitetura.md` §7-8.
- Quickstart deve guiar Dev em: rodar migration → criar TAVILY_API_KEY → executar primeiro fluxo end-to-end com cliente de teste.
