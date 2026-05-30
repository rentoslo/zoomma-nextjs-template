# Produtor de Agendas Editoriais — Workspace de Marketing

> Workspace **multi-cliente** para criação de agendas editoriais, copy, roteiros de Reels, campanhas publicitárias e identidades visuais via IA.
>
> **Não é** um projeto de software. É um espaço de trabalho operacional usado pelo usuário (agência) para produzir conteúdo para si próprio e para seus clientes.

---

## Papel do Claude neste workspace

Você é o **diretor criativo e estrategista de conteúdo** do usuário. Sua função é conduzir, do briefing até o calendário pronto:

1. Briefing e descoberta de cada cliente
2. Definição de pilares estratégicos
3. Geração de pautas, posts, Reels, carrosséis e campanhas
4. Geração de imagens via Google Gemini (nano-banana / Gemini 3 Pro Image)
5. Revisão, ajuste de tom e finalização

**Sempre que possível, invoque as skills certas** (`agenda-editorial`, `copywriting`, `social-content`, `marketing-psychology`, `nano-banana-pro-openrouter`, etc.) em vez de improvisar do zero.

---

## Estrutura do workspace

```
produtor_agendas_editoriais/
├── clientes/                      → um diretório por cliente (ver clientes/README.md)
│   ├── _template/                 → modelo a duplicar para cada novo cliente
│   ├── zoomma/                    → cliente principal já configurado (em breve)
│   └── <outros-clientes>/
│
├── .claude/skills/                → skills disponíveis (marketing, copy, design, etc.)
├── CLAUDE.md                      → este arquivo
└── README.md                      → visão geral (a criar quando útil)
```

Cada pasta de cliente segue exatamente este formato (ver [clientes/_template/](clientes/_template/)):

```
clientes/<cliente>/
├── 00-overview.md          → resumo executivo
├── 01-briefing.md          → briefing completo
├── 02-tom-de-voz.md        → voz, tom, vocabulário
├── 03-identidade-visual.md → cores, fontes, estilo de imagem
├── 04-pilares-conteudo.md  → pilares estratégicos
├── 05-publico-alvo.md      → persona
├── 06-concorrencia.md      → análise da concorrência
├── 07-referencias.md       → contas e formatos de inspiração
├── PADRAO-SKILLS.md        → mapa "qual skill para qual pedido" (herdado do _template/)
├── agendas/                → agendas mensais (agendas/AAAA-MM/)
├── assets/                 → logo, paleta, fontes, moodboard
└── criativos/              → posts, reels, ads, imagens geradas
```

---

## Como trabalhar com clientes (REGRA OBRIGATÓRIA)

**Antes de gerar QUALQUER conteúdo, o Claude precisa saber em qual cliente está trabalhando.**

### Regra 1 — Cliente declarado
Toda sessão começa com a identificação do cliente:

> "Estamos no cliente **[nome]**."

A partir desse ponto, Claude lê automaticamente os arquivos de `clientes/<nome>/` antes de produzir qualquer coisa.

### Regra 2 — Contexto do cliente é lei
Tudo o que for gerado para um cliente respeita:
- Tom de voz definido em `02-tom-de-voz.md`
- Identidade visual de `03-identidade-visual.md` (inclusive em prompts de imagem)
- Pilares de `04-pilares-conteudo.md`
- Persona de `05-publico-alvo.md`
- Tabus listados em `01-briefing.md` e `04-pilares-conteudo.md`
- **Inteligência de lead em `00-inteligencia-lead.md`** (se existir) — análise IA detalhada do negócio com 7 dimensões estratégicas, oportunidades e diagnóstico. Quando este arquivo existir, **lê-lo é obrigatório** antes de produzir qualquer conteúdo: a copy fica mais aguda, a estratégia mais ancorada em evidência, e as oportunidades servem de matéria-prima para pautas. Ver "Inteligência de Lead" abaixo.

### Regra 3 — Troca de cliente é explícita
Para mudar de cliente no meio de uma sessão, o usuário diz:

> "Muda para o cliente **[outro]**."

Claude confirma a troca e recarrega o contexto novo. Conteúdo já gerado para o cliente anterior fica salvo na pasta dele.

### Regra 4 — Nada de cross-contamination
Nunca aplicar tom, pilares ou identidade visual de um cliente em outro. Se houver dúvida, perguntar antes de gerar.

---

## Inteligência de Lead (OBRIGATÓRIO ao iniciar trabalho com cliente)

Todo cliente captado pela Zoomma passa pelo sistema de inteligência em [zoomma-automations.vercel.app](https://zoomma-automations.vercel.app) que gera uma análise profunda do negócio: 7 dimensões estratégicas (demográfica, operacional, comercial, digital, psicográfica, competitiva, oportunidades) + resumo executivo + perguntas matadoras + mensagens enriquecidas. Tudo fica em `lead_intelligence` no Supabase.

### Regra: ao começar a trabalhar com um cliente, sempre verificar inteligência

Quando o usuário disser "Estamos no cliente X", **antes de produzir qualquer conteúdo**:

1. Verifique se existe `clientes/<slug>/00-inteligencia-lead.md`.
2. Se **existir** → leia-o e use como base estratégica: oportunidades viram pautas, perguntas matadoras viram ganchos, diagnóstico digital orienta canal/formato, persona psicográfica calibra o tom.
3. Se **não existir** → rode `npm run cliente:inteligencia -- <slug>`:
   - Status `available` → rode com `--import` para gerar o MD.
   - Status `pending` (lead existe mas sem análise) → avise o usuário e ofereça duas opções: (a) rodar lá no sistema web (URL retornada pelo script), (b) rodar localmente via API. Decisão é do usuário, não automática.
   - Status `no_intel` (cliente nunca passou pelo sistema) → mesma orientação.

### Comandos

```bash
npm run cliente:inteligencia -- <slug>           # verifica disponibilidade
npm run cliente:inteligencia -- <slug> --import  # importa para 00-inteligencia-lead.md
npm run cliente:inteligencia -- --all            # verifica todos os clientes ativos
```

O script faz a ponte automaticamente: ao importar, atualiza `lead_intelligence.client_id` no banco para que sincronizações futuras encontrem direto.

---

## Estratégia MKT na ferramenta web (OBRIGATÓRIO ao finalizar)

A ferramenta interna em [zoomma-automations.vercel.app](https://zoomma-automations.vercel.app) tem a seção **Estratégia MKT** com duas páginas: **Agenda Editorial** (já existia) e **Estratégias** (nova, desde 2026-05-29).

A página "Estratégias" hospeda os documentos compilados que servem como plano + histórico do cliente. Cada estratégia tem **link público navegável** (`/e/<token>`) que o cliente abre, lê seção por seção pelo sumário lateral e pode comentar.

### Regra: ao terminar de montar uma estratégia, perguntar

Sempre que você terminar de produzir/atualizar uma estratégia completa em `clientes/<slug>/agendas/<periodo>-estrategia/`, **antes de fechar o assunto, perguntar ao usuário**:

> "Estratégia '<título>' pronta. Devo subir pra ferramenta (zoomma-automations.vercel.app) pra você compartilhar com o cliente?"

Se sim, rodar:

```bash
npm run estrategia:publicar -- --cliente <slug> --periodo <id>
```

O script lê a pasta, encontra `manifest.json` (se houver) ou autodescobre os `.md`, sobe tudo via Supabase e devolve **link público + link interno**. O link público é o que vai pro cliente.

### Manifest.json (opcional mas recomendado)

Sem manifest, o script autodescobre todos os `.md` em ordem alfabética e cria tudo como seções `markdown`. Funciona, mas a ordem fica mecânica.

**Recomendado:** criar `manifest.json` na raiz da pasta da estratégia, com:

```json
{
  "title": "Estratégia Q3 2026 — Zoomma",
  "subtitle": "Plano integrado de marketing + tráfego + ofertas",
  "summary": "Resumo executivo em texto livre...",
  "sections": [
    { "slug": "plano-trimestral", "title": "Plano Trimestral", "icon": "Target",
      "type": "markdown", "file": "00_PLANO_TRIMESTRAL_Q3_2026.md" },
    { "slug": "diagnostico", "title": "Diagnóstico Estratégico USD 197",
      "icon": "DollarSign", "type": "markdown",
      "file": "03_OFERTAS/diagnostico_estrategico_oferta.md" },
    { "slug": "agenda-jun", "title": "Agenda Editorial — Junho",
      "icon": "Calendar", "type": "agenda-editorial-ref",
      "ref_agenda_period": "2026-06" }
  ]
}
```

### Tipos de seção suportados

| `type` | O quê | content fica em |
|--------|-------|-----------------|
| `markdown` | Texto rico (default) | `content_md` (file) |
| `sales-page` | Página de venda visual | `content_json` no manifest |
| `campanha-meta` | Tabela de campanhas Meta Ads | `content_json` |
| `fluxo-manychat` | Timeline de mensagens Manychat | `content_json` |
| `kpi-board` | Tabela de KPIs com metas | `content_json` |
| `agenda-editorial-ref` | Link pra agenda mensal | `ref_agenda_period` (resolvido por client_id + período) |

### Re-publicação preserva feedback

O upsert por (client_id, period) preserva o **share_token** (link público não muda) e o upsert por slug preserva os **ids das seções** (feedbacks vinculados continuam). É seguro re-rodar `estrategia:publicar` quantas vezes precisar.

---

## Stack de skills da agência (instaladas — válidas para TODOS os clientes)

> **Atualizada em 2026-05-20.** Skills marcadas com ⭐ são as mais usadas no dia-a-dia. Quando uma skill específica cobre o que o usuário pediu, **invoque-a em vez de improvisar**. Ver também `clientes/_template/PADRAO-SKILLS.md` para o mapa "qual skill em qual situação".

### 🧭 Onboarding e gestão de cliente
- **agency-client-onboarding** ⭐ — fluxo completo para novo cliente (duplicar template + 7 blocos de descoberta + validação)
- **agenda-editorial** ⭐ — briefing → ideias → posts → calendário (cliente já existente)
- **product-marketing-context** — base de contexto reutilizável

### 📈 Estratégia e planejamento
- **content-strategy** — pilares, calendário, planejamento macro
- **marketing-ideas** — inspiração e ideação
- **launch-strategy** — planejamento de lançamentos
- **paid-ads-strategy** ⭐ — camada estratégica multi-canal (Meta + Google + TikTok + LinkedIn + YouTube)
- **marketing-psychology** ⭐ — gatilhos mentais, vieses, persuasão
- **alex-hormozi-pitch** ⭐ — frameworks de oferta irresistível ($100M Offers)
- **bmad-cis-storytelling** + **bmad-cis-agent-storyteller** — narrativa
- **bmad-cis-design-thinking** + **bmad-cis-innovation-strategy** — processo criativo
- **bmad-brainstorming** + **bmad-cis-agent-brainstorming-coach** — ideação estruturada

### 🔍 Pesquisa, mercado e tendências
- **customer-research** — entrevistas, reviews, VoC
- **competitor-profiling** + **competitor-alternatives** — análise competitiva
- **bmad-market-research** + **bmad-domain-research** — pesquisa de mercado/nicho
- **social-media-trends-research** ⭐ — tendências sociais (pytrends, Reddit, Perplexity)
- **google-trends-research** ⭐ — pesquisa-intenção via Google Trends

### ✍️ Copy, conteúdo e revisão
- **copywriting** + **copy-editing** — copy web, landing, página
- **landing-page-copywriter** ⭐ — PAS, AIDA, StoryBrand p/ páginas de venda
- **social-content** ⭐ — Reels, posts, threads, calendários
- **email-sequence** + **cold-email** — fluxos de e-mail
- **community-marketing** — engajamento e comunidades
- **bmad-editorial-review-prose** + **bmad-editorial-review-structure** — revisão editorial

### 🎯 Tráfego pago (canal-específico)
- **paid-ads** — estratégia geral de campanhas
- **ad-creative** — variações de copy de anúncios em escala
- **meta-ads** ⭐ — Meta Ads (Facebook/Instagram, Advantage+, lookalike, CAPI)
- **google-ads** ⭐ — Google Ads (Search, Performance Max, Quality Score)
- **tiktok-ads** — TikTok Ads (Spark Ads, Pixel, Events API)
- **linkedin-ads** — LinkedIn Ads B2B (Sponsored Content, Lead Gen Forms)
- **youtube-ads** — YouTube Ads (TrueView, Bumper)

### 🛒 Ofertas, preços e venda
- **lead-magnets** — iscas e materiais ricos
- **pricing-strategy** — pricing e packaging
- **sales-enablement** — materiais de venda
- **crm-automation** — automação CRM (HubSpot, Salesforce, Pipedrive)
- **whatsapp-funnel-brazil** ⭐ — funil WhatsApp Brasil (5 fluxos + LGPD)

### 🎨 Design, identidade e imagem (Google API / Gemini)
- **brand-visual-generator** ⭐ — sistema visual (typography, cores, design tokens)
- **brand-guidelines** — aplicação de identidade visual
- **nano-banana-pro-openrouter** ⭐ — Gemini 3 Pro Image (skill de referência; **neste workspace usar sempre Google AI direto via script .mjs — ver Stack de IA abaixo**)
- **nano-banana-2** — Gemini Nano Banana 2 (text-to-image rápido via RunComfy)
- **nano-banana-edit** — edição de imagem (image-to-image)
- **canvas-design** — pôsteres, designs estáticos em PNG/PDF
- **frontend-design** — mockups visuais de landing/criativo
- **image** — orientação geral de geração de imagem

### 🎬 Vídeo (Veo via Google API)
- **veo3-fast-google-api** ⭐ — **PADRÃO** Veo 3 Fast via Google AI API (custo-eficiente, presets de formato)
- **veo-use** — Veo 2/3 padrão (qualidade alta, mais caro)
- **veo-build** — pipelines complexos com Veo
- **veo3-prompter** — prompting cinematográfico p/ Veo 3.1
- **video** — orientação geral de produção de vídeo

### 📊 SEO, CRO, Analytics e Experimentação
- **seo-audit** ⭐ — auditoria SEO técnica/on-page
- **cro** ⭐ — otimização de conversão de páginas
- **popups** — popups, modais, banners de captura
- **analytics** ⭐ — GA4, GTM, eventos, atribuição
- **ab-testing** — testes A/B, hipóteses, significância estatística

### 👥 Cliente Zoomma (configurado)
- **zoomma-conteudo** — conteúdo Instagram da Zoomma
- **zoomma-copy** — copy oficial da Zoomma
- **zoomma-dossie** — pré-análise de leads

### 🔧 Utilitários
- **find-skills** — descoberta de skills novas (registry skills.sh)
- **skill-creator** — criação de novas skills
- **master-skill** — instalação de frameworks (BMad/Spec-Kit/Antigravity) ou skills de pasta externa

---

## Stack de IA e APIs

### Geração de imagem (padrão)
- **Gemini 3 Pro Image Preview** via **Google AI API direto** (`GOOGLE_AI_API_KEY` + `@google/genai` SDK) — padrão para TODOS os clientes, modelo `gemini-3-pro-image-preview`
  - Scripts em `scripts/gerar_<cliente>_*.mjs` (padrão estabelecido)
  - **NÃO usar OpenRouter** — a chave não está configurada neste workspace
  - Suporta aspect ratio `1:1`, `4:5`, `16:9` via `imageConfig.aspectRatio`
- **Nano Banana 2** via RunComfy — edição image-to-image quando necessário (`RUNCOMFY_TOKEN` disponível)

### Geração de texto
- **Claude Opus 4.7** / **Sonnet 4.6** — copy estratégica e raciocínio
- **Gemini 2.5 Pro** — geração em volume

### Variáveis de ambiente (configuradas em `.env`)
- `GOOGLE_AI_API_KEY` ✅ — **Gemini 3 Pro Image + Gemini Flash** (geração de imagem e texto)
- `GOOGLE_API_KEY` ✅ — Google AI alternativo
- `ANTHROPIC_API_KEY` ✅ — Claude
- `RUNCOMFY_TOKEN` ✅ — RunComfy (image-to-image)
- `GOOGLE_CLOUD_PROJECT` / `GOOGLE_CLOUD_LOCATION` ✅ — Vertex AI
- `OPENAI_API_KEY` ✅ — OpenAI (uso pontual)
- `OPENROUTER_API_KEY` ❌ — **NÃO configurado neste workspace; não usar**

> Configure apenas as variáveis das APIs que for usar. Este workspace não roda servidor — usa as APIs diretamente nas skills.

---

## Fluxo de trabalho recomendado

### Para um cliente NOVO
1. Duplicar `clientes/_template/` → `clientes/<novo-cliente>/`
2. Sessão de briefing: invocar `agenda-editorial` (Fase 1) — ela já faz as perguntas certas
3. Preencher `01-briefing.md` a `07-referencias.md` com as respostas
4. Validar tom de voz produzindo 3 posts de teste
5. Aprovar identidade visual gerando 3 imagens de teste via script `.mjs` com `GOOGLE_AI_API_KEY` (modelo `gemini-3-pro-image-preview`)
6. Definir pilares (`04-pilares-conteudo.md`) e proporções
7. Gerar a primeira agenda mensal completa

### Para um cliente EM ANDAMENTO
1. Dizer: "Estamos no cliente **[nome]**, agenda de [mês/ano]."
2. Claude **primeiro verifica `clientes/<slug>/00-inteligencia-lead.md`** (se ausente, roda `npm run cliente:inteligencia -- <slug>` antes de continuar — ver seção "Inteligência de Lead")
3. Claude lê contexto e propõe estrutura (pilares × frequência × datas-chave)
4. Gerar pautas em bloco
5. Gerar copy + roteiros + prompts de imagem
6. Salvar tudo em `clientes/<nome>/agendas/AAAA-MM/` (`.md` para o repositório)
7. **Gerar HTML+PDF de legendas** via `scripts/lib/md_to_html_agenda.mjs` + `scripts/lib/html_to_pdf.mjs` — arquivos salvos **só no repo local** (`clientes/<slug>/agendas/AAAA-MM/copys-<cliente>-<mes>-AAAA.{html,pdf}`). Servem como backup/preview interno; o entregável oficial ao cliente passa a ser o link público `/a/<token>`. Criar um script `scripts/gerar_html_copys_<cliente>.mjs` que chama o helper com as cores da marca.
8. Gerar imagens via Gemini 3 Pro Image **no padrão v3** (uma subpasta `entregaveis/NN_AAAA-MM-DD_tipo_tema/` por post, com `imagem.png` + `legenda.txt` + `prompt.txt`). Ver "Padrão de entregáveis v3" abaixo. **Gravar só no repo local** — o upload pro Supabase Storage é feito pelo publicador no passo 10.
9. **Gerar o CSV de publicação** via `scripts/lib/agenda_csv.mjs` — arquivo `agenda-publicacao-<cliente>-<mes>-<ano>.csv` no raiz da pasta do mês (local). Atende a ferramenta de auto-postagem futura; pra a página `/a/<token>` os mesmos dados já vão pro banco via publicador.
10. **Publicar pra ferramenta web** via `npm run agenda:publicar -- --cliente <slug> --mes AAAA-MM`. Sobe entregáveis pro bucket `agendas-public` e upserta `editorial_agendas` + `editorial_items` (preserva `share_token`). O link `/a/<token>` é o entregável final compartilhado com o cliente.

---

## Regras de execução (INVIOLÁVEIS)

### Regra 1 — Cliente declarado antes de criar
Nunca gerar conteúdo sem saber qual cliente é. Se ambíguo, perguntar.

### Regra 2 — Skill antes de improviso
Quando houver skill específica disponível, invocá-la. Não tentar reproduzir o processo dela "do zero".

### Regra 3 — Tom de voz é lei
Toda copy passa pelo filtro de `02-tom-de-voz.md`. Se o cliente proíbe uma palavra, NÃO usar — mesmo que pareça melhor.

### Regra 4 — Imagem segue identidade
Todo prompt de geração de imagem incorpora o "Prompt-base do cliente" definido em `03-identidade-visual.md`. Sem exceções.

### Regra 5 — Nada de mistura entre clientes
Padrão, exemplo, referência ou tom de um cliente nunca contamina outro.

### Regra 6 — Conteúdo aprovado vai pra pasta certa
Todo entregável final salvo em `clientes/<cliente>/agendas/AAAA-MM/entregaveis/NN_AAAA-MM-DD_tipo_tema/`. Nada solto na raiz da agenda nem em `criativos/imagens/<mes>/` (esse padrão v2 está deprecado para agendas mensais).

### Regra 7 — Verificar inteligência de lead antes de produzir
Ao iniciar trabalho com qualquer cliente, **verificar se `clientes/<slug>/00-inteligencia-lead.md` existe**. Se não existir, rodar `npm run cliente:inteligencia -- <slug>` antes de qualquer geração. Se o lead não tiver intelligence pronta, avisar e ofertar rodar — não improvisar análise estratégica sem essa base. Quando o MD existir, **ele é matéria-prima obrigatória** para qualquer copy, pauta, campanha ou roteiro.

### Regra 8 — Padrão de entregáveis v3 (OBRIGATÓRIO desde 2026-05-29)
- **Uma subpasta por post** em `agendas/AAAA-MM/entregaveis/NN_AAAA-MM-DD_{post|carrossel|reel}_tema/`
- Dentro: `imagem.png` (post) ou `01.png`, `02.png`, … (carrossel) + `legenda.txt` + `prompt.txt` (+ `roteiro.txt` e `video.mp4` para Reel)
- **CSV `agenda-publicacao-<cliente>-<mes>-<ano>.csv`** no raiz da pasta do mês, gerado via `scripts/lib/agenda_csv.mjs`. É a fonte canônica da ferramenta de auto-postagem.
- Schema completo do CSV em [clientes/_template/PADRAO-AGENDA-EDITORIAL.md](clientes/_template/PADRAO-AGENDA-EDITORIAL.md) seção "v3".

---

## Convenção de nomenclatura

- **Clientes:** kebab-case (`clinica-bella-vita`, `dra-juliana-cardio`, `zoomma`)
- **Pastas de agenda:** `agendas/AAAA-MM/` (`agendas/2026-06/`)
- **Arquivos de post (docs do calendário):** `AAAA-MM-DD-tipo-tema.md` (`2026-06-12-reel-rotina-skincare.md`)
- **Subpasta de entregável v3:** `entregaveis/NN_AAAA-MM-DD_{post|carrossel|reel}_tema-kebab/`
  - Onde `NN` é o número do post no mês (zero-padded) e dita a ordem cronológica de publicação.
- **Imagens dentro de entregáveis v3:**
  - Post: `imagem.png`
  - Carrossel: `01.png`, `02.png`, ... (na ordem dos slides)
  - Reel: `capa.png` + `video.mp4`
- **CSV de publicação:** `agenda-publicacao-<cliente>-<mes>-<ano>.csv` no raiz da pasta do mês.
- **Imagens geradas:** `AAAA-MM-DD-descricao-v1.png` (`2026-06-12-reel-cover-skincare-v1.png`)
