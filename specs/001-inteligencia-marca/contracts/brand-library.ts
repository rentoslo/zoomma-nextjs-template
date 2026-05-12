// Contract: shared/brand-library
// Source of truth: docs/inteligencia-marca-arquitetura.md §7-8
// This file lives in specs/ as the canonical reference.
// The actual implementation in shared/brand-library/types.ts must match exactly.

// ─── Os 7 blocos da Biblioteca de Marca ──────────────────────────────────

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

export interface Persona {
  nome: string
  idade_faixa: string
  renda_faixa: string
  profissao_tipo: string
  dores: string[]
  desejos: string[]
  objecoes: string[]
}

export interface Audiencia {
  persona_principal: Persona
  personas_secundarias?: Persona[]
  jornada_compra: { etapa: string; descricao: string }[]
}

export interface ServicoCatalogo {
  nome: string
  especialidade: string  // ex: "microagulhamento" — usado para link com knowledge
  descricao: string
  preco_faixa?: string
  diferenciais_tecnicos: string[]
}

export interface CatalogoServicos {
  servicos: ServicoCatalogo[]
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

// ─── Entidade completa ───────────────────────────────────────────────────

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

export interface LinkedKnowledge {
  id: string
  title: string
  summary: string
  type: string
  tags: string[]
  reason: string
}

export type BrandLibraryFull = BrandLibrary & {
  client_name: string
  linked_knowledge: LinkedKnowledge[]
}

// ─── API pública do módulo shared/brand-library ──────────────────────────

export interface BrandLibraryAPI {
  /** Lê a Biblioteca de Marca completa de um cliente */
  getClientBrand(clientId: string): Promise<BrandLibrary | null>

  /** Lê apenas um bloco específico (otimização) */
  getClientBrandBlock<K extends keyof BrandLibrary>(
    clientId: string,
    block: K,
  ): Promise<BrandLibrary[K] | null>

  /** Atualiza um bloco (dispara snapshot via trigger) */
  updateBrandBlock<K extends keyof BrandLibrary>(
    clientId: string,
    block: K,
    value: BrandLibrary[K],
    actorId: string,
  ): Promise<void>

  /** Cria a Biblioteca inicial a partir de briefing aprovado */
  buildFromBriefing(clientId: string, briefingId: string): Promise<BrandLibrary>

  /** Lê com knowledge linked já agregado (view brand_library_full) */
  getClientBrandWithKnowledge(clientId: string): Promise<BrandLibraryFull | null>
}
