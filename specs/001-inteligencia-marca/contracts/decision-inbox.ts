// Contract: shared/decision-inbox
// Source of truth: docs/inteligencia-marca-arquitetura.md §7-8

export type DecisionType =
  | 'article_suggestion'
  | 'drift_detected'
  | 'brand_update'
  | 'lead'
  | 'alert'

export type DecisionStatus = 'pending' | 'approved' | 'rejected' | 'expired'

export type DecisionPriority = 'low' | 'normal' | 'high'

export interface DecisionItem {
  id: string
  type: DecisionType
  title: string
  summary: string
  payload: Record<string, unknown>
  related_client_id: string | null
  priority: DecisionPriority
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

// ─── Payload shapes por tipo ─────────────────────────────────────────────

import type { KnowledgeArticle } from './knowledge-base'

export interface ArticleSuggestionPayload {
  article: Partial<KnowledgeArticle>
  suggested_links: { client_id: string; reason: string }[]
}

export interface DriftDetectedPayload {
  client_id: string
  changed_blocks: string[]
  before: Record<string, unknown>
  after: Record<string, unknown>
  change_summary: string
}

export interface BrandUpdatePayload {
  client_id: string
  block: string
  current_value: unknown
  suggested_value: unknown
  reason: string
}

export interface LeadPayload {
  name: string
  contact: string
  source: string
  raw_data: Record<string, unknown>
}

export interface AlertPayload {
  severity: 'low' | 'normal' | 'high' | 'critical'
  metric: string
  current_value: number | string
  threshold: number | string
  suggested_action: string
}

// ─── Filtros e summaries ─────────────────────────────────────────────────

export interface ListPendingFilters {
  type?: DecisionType
  clientId?: string
  priority?: DecisionPriority
}

export interface ApproveDecisionParams {
  decisionId: string
  actorId: string
  note?: string
}

export interface RejectDecisionParams {
  decisionId: string
  actorId: string
  note?: string
}

export interface DecisionSummary {
  total_pending: number
  by_type: Record<DecisionType, number>
  by_priority: Record<DecisionPriority, number>
  oldest_pending: string | null
}

export type CreateDecisionInput = Omit<
  DecisionItem,
  | 'id'
  | 'status'
  | 'resolved_by'
  | 'resolved_at'
  | 'resolution_note'
  | 'notified_telegram'
  | 'notified_at'
  | 'created_at'
>

// ─── API pública do módulo shared/decision-inbox ─────────────────────────

export interface DecisionInboxAPI {
  /** Cria item na caixa */
  createDecision(item: CreateDecisionInput): Promise<DecisionItem>

  /** Lista itens pendentes (filtros opcionais) */
  listPending(filters?: ListPendingFilters): Promise<DecisionItem[]>

  /** Aprova item com efeito colateral (aplica mudança real) */
  approveDecision(params: ApproveDecisionParams): Promise<void>

  /** Rejeita item (registra no decision_log) */
  rejectDecision(params: RejectDecisionParams): Promise<void>

  /** Resumo agregado para dashboard inicial */
  getSummary(): Promise<DecisionSummary>
}
