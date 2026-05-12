# Feature Specification: Inteligência de Marca Zoomma

**Branch**: `001-inteligencia-marca` | **Date**: 2026-05-11
**Status**: Approved for implementation
**Sources of truth**:
- Business: [`docs/inteligencia-marca-overview.md`](../../docs/inteligencia-marca-overview.md)
- Technical: [`docs/inteligencia-marca-arquitetura.md`](../../docs/inteligencia-marca-arquitetura.md)

---

## Summary

Sistema central de inteligência da Zoomma composto por três sub-sistemas integrados:

1. **Biblioteca de Marca** — núcleo por cliente com 7 blocos estruturados extraídos automaticamente do briefing aprovado
2. **Knowledge Base** — base global da Zoomma com 6 tipos de conhecimento (técnico, comportamento, regulamentação, tendências, próprio Zoomma, concorrência); 3 modos de entrada (manual, semi-automático com validação, on-demand com validação)
3. **Caixa de Decisões** — interface unificada de validação humana para itens estruturais (artigos sugeridos, drift de cliente, atualizações de marca, leads, alertas)

## User Scenarios

### Cenário A — Cliente novo entra
Sócio aprova briefing → sistema extrai automaticamente os 7 blocos da Biblioteca → identifica especialidades → busca artigos relevantes via Tavily → cria itens na Caixa de Decisões para validação dos sócios → após aprovação, artigos ficam vinculados ao cliente.

### Cenário B — Sócio pede conhecimento on-demand
Sócio (interface web ou Telegram): *"quero artigos sobre microagulhamento"* → sistema busca, categoriza, resume → itens aparecem na Caixa → sócio aprova/rejeita em lote ou individual → aprovados entram na Knowledge Base.

### Cenário C — Drift de cliente
Cron diário (03h BRT) roda análise de cada cliente ativo → detecta mudanças significativas → cria itens na Caixa de Decisões → sócio aprova/rejeita → Biblioteca atualiza ou não.

## Functional Requirements

- FR-01: Biblioteca de Marca extraída automaticamente do briefing aprovado (7 blocos)
- FR-02: Knowledge Base aceita upload manual (PDF, link, texto)
- FR-03: Knowledge Base aceita busca on-demand com validação humana
- FR-04: Sistema detecta especialidade de cliente novo e sugere artigos
- FR-05: Caixa de Decisões mostra itens pendentes no dashboard inicial
- FR-06: Caixa permite aprovação/rejeição em lote e individual
- FR-07: Notificação via Telegram quando há itens novos na Caixa
- FR-08: Outros agentes leem a Biblioteca via função `getClientBrand(clientId)`
- FR-09: Schema multi-tenant via `client_id` desde o dia 1
- FR-10: Histórico de decisões (auditoria append-only)
- FR-11: Snapshot automático da Biblioteca em cada atualização (para drift)
- FR-12: 5-10 artigos sobre microagulhamento curados como MVP de prova

## Non-Functional Requirements

- NFR-01: Validação humana inegociável — nada entra na base sem aprovação
- NFR-02: Linguagem acessível na documentação (sócio prefere clareza > jargão)
- NFR-03: Não pode quebrar o que já existe (briefing, Telegram, dashboard)
- NFR-04: Custo Tavily ≤ $1/mês com volume previsto (~100 buscas)
- NFR-05: Anti-Frankenstein: shared/ para compartilhado, agentes isolados, comunicação via tabela `tasks`
- NFR-06: SaaS-ready Nível 2 (RLS preparada, mas hoje só service_role)

## Out of Scope

- Geração de copy/post/proposta (Fase 2/3)
- Aprovação de entregáveis ao cliente (já existente via Pipefy/Telegram)
- Login pra profissionais da beleza (Fase SaaS futura)
- API pública (Fase SaaS futura)
- Busca semântica via pgvector (decisão consciente: full-text search no MVP)
- Captura automatizada de calls em produção (começa com upload manual)

## Acceptance Criteria

- [ ] Migration 003 executada com sucesso no Supabase
- [ ] Cliente real (especialidade microagulhamento) processado end-to-end no Fluxo A
- [ ] 5-10 artigos de microagulhamento curados e linkados ao cliente
- [ ] Função `getClientBrand(clientId)` retorna objeto tipado com os 7 blocos
- [ ] Caixa de Decisões aparece no dashboard inicial com contagem de pendentes
- [ ] Notificação Telegram disparada ao criar itens novos na Caixa
- [ ] Cron de drift roda às 03h BRT e cria items quando detecta mudanças

## References

Veja documentos linkados no topo deste arquivo para detalhes completos.
