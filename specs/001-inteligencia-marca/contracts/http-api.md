# HTTP API Contracts — Inteligência de Marca Zoomma

> Endpoints expostos pelo controller Next.js (Vercel).
> Convention: rotas em `controller/src/app/api/`.
> Auth: hoje use `service_role` direto (admin client) — no SaaS futuro virá Supabase Auth.

---

## Brand Library

### POST `/api/brand-library`

Dispara extração manual da Biblioteca de Marca a partir de um briefing aprovado.

**Body**:
```json
{
  "client_id": "uuid",
  "briefing_id": "uuid"
}
```

**Response 202 (accepted, task enfileirada)**:
```json
{
  "task_id": "uuid",
  "status": "queued"
}
```

**Error 400**: briefing não aprovado ou cliente não encontrado.

---

## Knowledge Base

### POST `/api/knowledge/search`

Busca on-demand via Tavily. Resultados vão para a Caixa de Decisões (não inserem direto).

**Body**:
```json
{
  "query": "microagulhamento estudos 2026",
  "type": "tecnico",
  "max_results": 10,
  "client_id_link": "uuid (opcional — se for sugerir link com cliente específico)"
}
```

**Response 202**:
```json
{
  "task_id": "uuid",
  "expected_decisions": 10
}
```

### POST `/api/knowledge/upload`

Upload manual de artigo (PDF, link ou texto).

**Body (multipart/form-data)**:
- `file` (opcional) — PDF
- `url` (opcional) — link
- `text` (opcional) — texto puro
- `title` — obrigatório
- `type` — `KnowledgeType`
- `tags` — array

**Pelo menos um de `file | url | text` deve estar presente.**

**Response 200**:
```json
{
  "article_id": "uuid",
  "approved_at": "2026-05-11T...",
  "approved_by": "uuid"
}
```

Upload manual entra **já aprovado** (sócio quem subiu).

---

## Decision Inbox

### GET `/api/decisions?status=pending&type=article_suggestion&priority=high`

Lista itens da Caixa com filtros opcionais.

**Response 200**:
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "article_suggestion",
      "title": "Novo artigo: Microagulhamento e bioestimuladores",
      "summary": "Estudo de 2025 sobre combinação de técnicas...",
      "priority": "normal",
      "created_at": "2026-05-11T..."
    }
  ],
  "summary": {
    "total_pending": 12,
    "by_type": { "article_suggestion": 8, "drift_detected": 4 },
    "by_priority": { "low": 2, "normal": 8, "high": 2 }
  }
}
```

### GET `/api/decisions/[id]`

Detalhe completo de um item.

**Response 200**: `DecisionItem` (todos os campos, incluindo `payload`).

### POST `/api/decisions/[id]/approve`

Aprova item. Aplica efeito colateral conforme `type`.

**Body**:
```json
{
  "note": "Aprovado — fonte confiável (revista científica)"
}
```

**Response 200**:
```json
{
  "status": "approved",
  "applied": true,
  "log_id": "uuid"
}
```

**Efeitos colaterais por tipo**:
- `article_suggestion`: cria `knowledge_articles` + opcionalmente `brand_knowledge_links`
- `drift_detected`: atualiza `brand_library` (snapshot automático via trigger)
- `brand_update`: atualiza bloco específico em `brand_library`
- `lead`: cria registro em `clients` (status='prospect')
- `alert`: registra no log; sem efeito automático

### POST `/api/decisions/[id]/reject`

Rejeita item. Apenas registra no log.

**Body**:
```json
{
  "note": "Fonte fraca (blog SEO sem referências)"
}
```

**Response 200**:
```json
{
  "status": "rejected",
  "log_id": "uuid"
}
```

### POST `/api/decisions/batch-approve`

Aprova vários de uma vez (mesmo type, mesmas regras).

**Body**:
```json
{
  "decision_ids": ["uuid1", "uuid2", "uuid3"],
  "note": "Lote curado sobre microagulhamento — aprovados em conjunto"
}
```

**Response 200**:
```json
{
  "approved": 3,
  "failed": 0,
  "logs": ["log_uuid1", "log_uuid2", "log_uuid3"]
}
```

---

## Cron Endpoints

### GET `/api/cron/drift-detection`

Endpoint chamado pelo **Vercel Cron** às 06h UTC (03h BRT) diariamente.

**Headers obrigatório**:
```
Authorization: Bearer ${CRON_SECRET}
```

**Response 200**:
```json
{
  "clients_analyzed": 12,
  "drift_detected": 3,
  "decisions_created": 3,
  "duration_ms": 8421
}
```

**Configuração `vercel.json`**:
```json
{
  "crons": [
    { "path": "/api/cron/drift-detection", "schedule": "0 6 * * *" }
  ]
}
```

---

## Convenções gerais

- Todos os endpoints retornam JSON.
- Erros seguem RFC 7807-like:
  ```json
  { "error": { "code": "client_not_found", "message": "..." } }
  ```
- Códigos HTTP: 200 (ok), 202 (accepted/enfileirado), 400 (input inválido), 404 (não existe), 500 (erro interno).
- Timestamps em ISO 8601 UTC.
