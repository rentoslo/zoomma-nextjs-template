# Inteligência de Marca Zoomma — Overview

> **Documento de referência** para o sistema central de inteligência da Zoomma.
> Funciona como PRD enxuto. Toda modificação futura deve consultar este documento
> antes de propor mudança estrutural.

**Versão:** 1.0
**Data:** 2026-05-11
**Status:** Aprovado para arquitetura
**Owners:** Rento (sócio técnico) + Bruno (sócio)
**Fase:** 1 (núcleo de inteligência)

---

## 1. Por quê (a dor real)

O onboarding de clientes hoje é caro e desorganizado. Cada cliente novo exige re-explicação de contexto. A entrega não é tão personalizada quanto a Zoomma é capaz de fazer. Resultado: tempo perdido + estratégias mais rasas do que poderiam ser.

Este sistema resolve a base do problema: construir, manter e consultar a **inteligência completa de cada cliente** — automatizada onde possível, validada pelos sócios sempre.

---

## 2. Visão de sucesso (3 meses)

Você pede pro sistema *"copy pro cliente X"* — e a resposta vem **precisa, personalizada e útil**, sem precisar explicar quem é o cliente. O sucesso final mora numa frase do cliente: *"o trabalho de vocês está me fazendo vender mais"*.

**Métrica chave:** redução do tempo de onboarding de novo cliente em ≥50% mantendo qualidade superior à manual.

---

## 3. Princípios

1. **Inteligência > Infraestrutura.** Construir o ouro (conhecimento estruturado) antes da interface de controle.
2. **Validação humana inegociável.** Nada entra na base sem aprovação de Rento ou Bruno.
3. **Dados são o ativo principal.** Knowledge Base é diferencial competitivo, não comodidade.
4. **SaaS-ready desde já.** Arquitetura multi-tenant no banco; SaaS futuro = mexer só em login/cobrança.
5. **Conhecimento próprio vale tanto quanto externo.** Calls, copies que converteram, padrões observados = ativos da Zoomma.

---

## 4. Quem usa

- **Interface direta:** Rento + Bruno (sócios).
- **Cliente final:** acionado por outros canais (Telegram, Pipefy) — não acessa o sistema.
- **Agentes IA:** consomem a inteligência para gerar entregáveis (copy, estratégia, propostas).

---

## 5. Os três sub-sistemas integrados

### 5.1 Biblioteca de Marca — núcleo por cliente

Estrutura com 7 blocos:

| Bloco | Conteúdo |
|-------|----------|
| Identidade visual | Logo, paleta de cores, tipografia, fotos de referência |
| Tom de voz | Palavras-chave, palavras-banidas, exemplos, formalidade |
| Posicionamento | Proposta de valor, diferenciais, "o que NÃO somos" |
| Audiência | Persona ideal, dores, objeções, jornada de compra |
| Catálogo de serviços | Oferta, preços, diferenciais técnicos |
| Histórico operacional | Sazonalidade, ticket médio, picos de venda |
| Métricas e metas | KPIs do cliente, objetivos |

**Origem:** briefing aprovado é a fonte zero. Sistema extrai automaticamente.

**Evolução:** agente detecta drift (mudança no perfil do cliente). Se for significativo, envia para Caixa de Decisões.

### 5.2 Knowledge Base — diferencial competitivo

Seis tipos de conhecimento:

| Tipo | Exemplo |
|------|---------|
| Técnico | Estudos sobre microagulhamento, artigos PubMed, manuais de procedimento |
| Comportamento de consumidor | Quem compra, por quê compra, como decide |
| Regulamentação | Anvisa, FDA, normas profissionais |
| Tendências | TikTok, lançamentos, hashtags do momento |
| **Conhecimento próprio Zoomma** ⭐ | Copies que converteram, calls vencedoras, padrões observados |
| Concorrência | O que outras clínicas/agências estão fazendo |

**Três modos de entrada (todos com validação humana):**

1. **Manual:** upload de PDF, link, texto direto.
2. **Semi-automática:** sistema detecta especialidade do cliente novo → busca artigos relevantes → mostra na Caixa de Decisões → sócio valida → entra na base.
3. **On-demand:** sócio pede *"quero artigos sobre X"* → sistema busca → categoriza → mostra → sócio valida → entra.

**Princípio inegociável:** nada entra sem aprovação. Qualidade > quantidade.

**Primeiro caso de uso (MVP):** microagulhamento. 5-10 artigos curados como prova de conceito.

### 5.3 Caixa de Decisões — interface unificada de validação

Tela inicial do dashboard. Concentra **decisões estruturais** (não entregáveis).

**O que ENTRA:**
- Artigos sugeridos pela busca (Knowledge Base)
- Drift detectado em clientes (perfil mudou)
- Atualizações sugeridas na Biblioteca de Marca
- Leads/prospects para adicionar ao CRM
- Alertas de performance (campanha caindo, lead frio)

**O que NÃO entra (fluxo separado):**
- Aprovação de copy, post, proposta, arte → **Pipefy + Telegram**

**Regra de ponte:** se durante aprovação de entregável for detectada mudança estrutural (ex: cliente alterou cor base da identidade visual), isso vira item na Caixa.

**Canais de validação:** interface web (controller) + Telegram. Sempre com resumo + opção de aprofundar individualmente.

---

## 6. Arquitetura

**Nível escolhido:** SaaS-ready Nível 2

**Visão SaaS (importante para não haver confusão):**

O SaaS futuro **NÃO é B2B para outras agências de marketing**. É um SaaS especializado **para profissionais da beleza** (clínicas, esteticistas, harmonizadores) — Brasil e exterior. Sistema de gestão + agendamento + marketing inteligente.

- **Hoje:** Zoomma presta serviço; "clientes Zoomma" = profissionais da beleza.
- **Amanhã:** O SaaS é vendido diretamente a esses profissionais. Eles viram usuários autenticados do sistema. A Zoomma continua sendo a curadora central da inteligência.

**Implicação no schema:**

- `clients.id` é a chave-tenant. Cada profissional será um `client` que vira tenant no SaaS futuro.
- **Knowledge Base é da Zoomma sempre** (uma única curadora). Não tem tenant_id — alimenta todos os clientes.
- **Brand Library tem `client_id`** (cada profissional tem sua marca isolada).
- **Caixa de Decisões é operacional Zoomma** (sem tenant_id; com `related_client_id` opcional).
- Migrar pra SaaS = adicionar autenticação do profissional + cobrança. O core do banco não muda.

**Stack:**
- Next.js 14 (App Router) — controller web
- Supabase (Postgres + Auth + RLS) — banco e segurança
- Anthropic Claude — extração e geração
- Tavily — busca web especializada em alimentar agentes IA
- Postgres full-text search — busca interna no MVP (pgvector adicionado quando necessário)

---

## 7. Fluxos chave (alto nível)

### Fluxo A: Cliente novo entra
1. Briefing é criado e aprovado (agente Briefing já existente)
2. Agente Biblioteca de Marca extrai 7 blocos automaticamente do briefing
3. Sistema detecta especialidades do cliente (ex: microagulhamento)
4. Agente Knowledge Curator busca artigos relevantes para essas especialidades
5. Artigos aparecem na Caixa de Decisões para validação dos sócios
6. Após aprovação, artigos são vinculados à Biblioteca do cliente
7. Outros agentes (Fase 2/3) podem agora gerar entregáveis personalizados

### Fluxo B: Sócio pede conhecimento on-demand
1. Sócio pede *"quero artigos sobre [tema]"* (interface web ou Telegram)
2. Agente Knowledge Curator busca, categoriza, resume
3. Resultados aparecem na Caixa de Decisões
4. Sócio aprova/rejeita (em lote ou individual)
5. Aprovados entram na base com categoria + tags

### Fluxo C: Drift de cliente
1. Agente monitora sinais (novos posts, mudanças no briefing, performance)
2. Detecta mudança significativa (ex: novo serviço, troca de paleta)
3. Cria item na Caixa de Decisões com resumo da mudança
4. Sócio aprova → Biblioteca de Marca atualiza
5. Sócio rejeita → fica registrado mas não aplica

---

## 8. Critérios de aceitação (DoD)

- [ ] Biblioteca de Marca criada automaticamente a partir de briefing aprovado
- [ ] Os 7 blocos populados com conteúdo extraído pelo agente
- [ ] Outros agentes conseguem ler a Biblioteca via função simples
- [ ] Knowledge Base aceita upload manual (PDF, link, texto)
- [ ] Knowledge Base aceita busca on-demand validada
- [ ] Knowledge Base detecta especialidade de novo cliente e sugere artigos
- [ ] Caixa de Decisões mostra itens pendentes no dashboard inicial
- [ ] Caixa de Decisões permite aprovar/rejeitar em lote e individual
- [ ] Caixa de Decisões enviou notificações via Telegram
- [ ] Schema do banco é multi-tenant desde a primeira versão
- [ ] 5-10 artigos sobre microagulhamento curados e funcionando

---

## 9. Fora do escopo desta fase

- Geração de copy/post/proposta (Fase 2/3)
- Aprovação de entregáveis ao cliente (Pipefy/Telegram já existente)
- Onboarding de outras agências (Fase futura SaaS)
- API pública (Fase futura SaaS)
- Captura automatizada de dados de calls em produção (etapa posterior — começa com upload manual de transcrições)

---

## 10. Próximos passos

1. ✅ Discovery completo (este documento)
2. ⏳ Arquitetura — Winston (`bmad-agent-architect`)
3. ⏳ Plano de implementação — Spec-Kit (`speckit-plan` + `speckit-tasks`)
4. ⏳ Implementação — Dev (`bmad-agent-dev`)
5. ⏳ Verificação — `bmad-check-implementation-readiness`

---

## 11. Histórico de decisões

| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-05-11 | SaaS-ready Nível 2 | Embrião de SaaS B2C para profissionais da beleza (NÃO para outras agências). `clients.id` será o tenant_id do SaaS futuro. |
| 2026-05-11 | Knowledge Base é global (sem tenant_id) | Zoomma é única curadora; alimenta todos os clientes/futuros usuários SaaS |
| 2026-05-11 | Tavily como motor de busca web | Especializada em alimentar agentes IA; retorna conteúdo já extraído |
| 2026-05-11 | Full-text search no MVP (pgvector depois) | Postgres nativo serve para ~500 docs; migração pra vetores é tranquila quando precisar |
| 2026-05-11 | Caixa de Decisões separada de Pipefy/Telegram | Estrutural ≠ Entregável |
| 2026-05-11 | Validação humana sempre | Qualidade > velocidade |
| 2026-05-11 | Microagulhamento como primeiro caso | Procedimento concreto que clientes Zoomma realmente fazem |
| 2026-05-11 | Conhecimento próprio Zoomma é tipo de Knowledge | Diferencial competitivo da empresa |
