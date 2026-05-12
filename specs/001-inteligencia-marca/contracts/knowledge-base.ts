// Contract: shared/knowledge-base
// Source of truth: docs/inteligencia-marca-arquitetura.md §7-8

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

// ─── Tavily API types (HTTP fino, sem SDK) ──────────────────────────────

export interface TavilySearchParams {
  query: string
  searchDepth?: 'basic' | 'advanced'
  maxResults?: number
  includeRawContent?: boolean
  includeDomains?: string[]
  excludeDomains?: string[]
}

export interface TavilyResultItem {
  title: string
  url: string
  content: string
  rawContent?: string
  score: number
  publishedDate?: string
}

export interface TavilyResult {
  query: string
  answer?: string
  results: TavilyResultItem[]
  responseTime: number
}

// ─── API pública do módulo shared/knowledge-base ─────────────────────────

export interface SearchKnowledgeParams {
  query?: string
  types?: KnowledgeType[]
  tags?: string[]
  limit?: number
}

export interface SearchExternalParams {
  query: string
  hint?: KnowledgeType
  maxResults?: number
}

export interface SearchExternalResult {
  articles: Partial<KnowledgeArticle>[]
  queryUsed: string
}

export interface SuggestForClientResult {
  suggested: number
  decisionItemIds: string[]
}

export interface ApproveArticleParams {
  decisionId: string
  approverId: string
}

export interface LinkArticleParams {
  clientId: string
  articleId: string
  reason: string
  linkedBy: string
}

export interface KnowledgeBaseAPI {
  /** Busca interna (full-text + tags) sobre artigos aprovados */
  searchKnowledge(params: SearchKnowledgeParams): Promise<KnowledgeArticle[]>

  /** Lê um artigo por id */
  getArticle(id: string): Promise<KnowledgeArticle | null>

  /** Insere artigo aprovado (efeito de approveDecision com type=article_suggestion) */
  approveArticle(params: ApproveArticleParams): Promise<KnowledgeArticle>

  /** Vincula artigo a um cliente */
  linkArticleToClient(params: LinkArticleParams): Promise<void>

  /** Busca externa via Tavily (gera sugestões — NÃO insere) */
  searchExternal(params: SearchExternalParams): Promise<SearchExternalResult>

  /** Curadoria semi-automática: detecta especialidades + sugere via Tavily */
  suggestForClient(clientId: string): Promise<SuggestForClientResult>
}
