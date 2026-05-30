# Padrão de Organização — AGENDA EDITORIAL (template reutilizável)

> Estrutura padrão de uma campanha editorial. **Versão mestre** deste padrão — sempre que evoluir, atualizar aqui primeiro e replicar nos clientes.
>
> **Destino canônico (desde 2026-05-30 — migração Drive→Supabase):** os entregáveis vivem em `clientes/<slug>/agendas/AAAA-MM/` no repo local e sobem pro Supabase Storage via `npm run agenda:publicar`. O cliente consome pelo link público `/a/<token>` da ferramenta web. O Drive deixou de ser destino — só guarda histórico antigo.
>
> Versão atual: **v3** (entregaveis-por-post + CSV de publicação)
> Definido em 2026-05-20 (v1/v2), evoluído em 2026-05-29 (v3), migrado pra Supabase em 2026-05-30.

---

## Filosofia

1. **Campanha é a unidade primária de organização.** Cada ação editorial tem sua própria pasta autocontida.
2. **Estratégia vive separada da execução, dentro da campanha.** O playbook fica em `00_PLAYBOOK/` — o calendário só executa.
3. **Time-based para campanhas e para meses.** Pasta de campanha começa com `AAAA-{periodo}_` para ordenar cronologicamente.
4. **Um arquivo por função, não por post — EXCETO entregáveis.** 1 calendário consolidado por mês inline; **mas cada post fica isolado em sua própria subpasta dentro de `entregaveis/`**.
5. **CSV de publicação no raiz da pasta do mês.** Fonte canônica para ferramentas de auto-postagem. Uma linha por post, com legenda formatada, paths das imagens e tudo o que a ferramenta precisa.
6. **`.md` para leitura técnica + `.txt` para envio à cliente.** Documentos críticos nos dois formatos.
7. **Resumos executivos sempre em `.txt`.** Para cliente que quer visão alta sem ler tudo.
8. **Underscores em pastas, hífens em arquivos.**

---

## Estrutura completa

```
AGENDA EDITORIAL/
│
├── _PADRAO-ORGANIZACAO.md                       ← cópia deste documento (spec)
├── RESUMO-EXECUTIVO-CLIENTE.txt                 ← visão geral de TODAS as campanhas ativas
│
├── AAAA-{periodo}_{nome-campanha}/              ← uma pasta POR campanha
│   │
│   ├── 00-RESUMO-CAMPANHA.txt                   ← visão alta DESTA campanha (envio cliente)
│   │
│   ├── 00_PLAYBOOK/                             ← estratégia da campanha
│   │   ├── 00-PLAYBOOK-MASTER.md (+ .txt)
│   │   ├── 01-manifesto-tagline.md
│   │   ├── 02-arquitetura-oferta.md
│   │   ├── 03-funil-fases.md
│   │   ├── 04-persona-foco.md
│   │   ├── 05-mix-editorial.md
│   │   ├── 06-kpis-metas.md
│   │   ├── 07-politica-precos.md
│   │   ├── 08-extras-programa.md
│   │   ├── 09-riscos-mitigacoes.md
│   │   └── 10-decisoes-em-aberto.md
│   │
│   ├── 01_CALENDARIOS/                          ← agenda mês a mês
│   │   └── AAAA-MM_mes_fase-N-descricao/
│   │       ├── 00-CALENDARIO-{MES}.md (+ .txt)
│   │       ├── 01-roteiros-reels-{mes}.md
│   │       ├── 02-stories-template-{mes}.md
│   │       ├── 03-briefing-imagens-{mes}.md
│   │       ├── agenda-publicacao-{cliente}-{mes}-{ano}.csv    ← NOVO v3 (fonte da ferramenta de auto-postagem)
│   │       └── entregaveis/                                    ← NOVO v3 (uma subpasta por post)
│   │           ├── NN_AAAA-MM-DD_{tipo}_{tema}/
│   │           │   ├── imagem.png                              (post simples)
│   │           │   ├── 01.png, 02.png, ...                     (carrossel, slides na ordem)
│   │           │   ├── capa.png                                (Reel, opcional)
│   │           │   ├── video.mp4                               (Reel, quando entregue)
│   │           │   ├── legenda.txt                             (legenda formatada pronta para colar)
│   │           │   ├── prompt.txt                              (post gerado por IA)
│   │           │   └── roteiro.txt                             (Reel)
│   │           └── ...
│   │
│   ├── 02_IMAGENS/                              ← DEPRECADO v3 (mantido como atalho legível)
│   │   └── AAAA-MM_mes/                          As imagens-fonte vivem em 01_CALENDARIOS/.../entregaveis/
│   │
│   ├── 03_VIDEOS/                               ← DEPRECADO v3 (mantido como atalho legível)
│   │   └── AAAA-MM_mes/                          Os Reels finais vivem em 01_CALENDARIOS/.../entregaveis/
│   │
│   └── 04_LEADS_LISTA-INTERESSE/                ← captação desta campanha
│       ├── lista-{palavra-chave}-{mes}.md
│       ├── respostas-modelo-dm.md
│       └── tracking-conversoes.md
│
└── 99_ARQUIVO/                                  ← campanhas e materiais antigos
    └── AAAA-{periodo}_{nome-campanha-antiga}/
```

---

## v3 — Padrão de entregáveis e CSV de publicação

### Por que mudou (v2 → v3)

A v2 jogava todos os PNGs juntos em `02_IMAGENS/{mes}/`. Quando uma agenda tem 20 posts (alguns com carrossel de 7 slides), a pasta vira um amontoado de 50+ arquivos sem contexto, e quem vai postar precisa caçar manualmente "qual imagem casa com qual legenda".

A v3 resolve isso com 2 mudanças:

1. **Uma subpasta por post** dentro de `entregaveis/`. Tudo o que precisa para publicar UM post está junto: imagem(ns), legenda formatada, prompt usado, e, no caso de Reel, roteiro e vídeo.
2. **CSV no raiz da pasta do mês** com 1 linha por post, contendo todas as colunas que uma ferramenta de auto-postagem precisa (cliente, data, tipo, legenda completa, paths das mídias, status).

### Estrutura da subpasta por post

**Nomenclatura:** `NN_AAAA-MM-DD_{tipo}_{tema-kebab-case}/`

- `NN` = número do post no mês, zero-padded (`01`, `02`, …, `20`)
- `AAAA-MM-DD` = data de publicação
- `tipo` ∈ {`post`, `carrossel`, `reel`}
- `tema` = kebab-case do tema do post (máx 4-5 palavras)

**Exemplos:**
- `01_2026-06-01_post_bastidores-fabrica/`
- `12_2026-06-15_carrossel_dicas-revenda/`
- `02_2026-06-02_reel_pov-revenda/`

**Conteúdo padrão por tipo:**

| Tipo | Conteúdo |
|------|----------|
| `post` (single image) | `imagem.png` + `legenda.txt` + `prompt.txt` |
| `carrossel` | `01.png`, `02.png`, …, `0N.png` (na ordem) + `legenda.txt` + `prompt.txt` (1 prompt por slide ou prompt único anotando todos) |
| `reel` | `capa.png` (opcional, se gerada) + `video.mp4` (quando entregue) + `legenda.txt` + `roteiro.txt` |

**Regras importantes:**
- O número `NN` **dita a ordem cronológica de publicação no mês**. Ordenação alfabética = ordem de publicação.
- A `legenda.txt` é a legenda final **já formatada com quebras de linha reais** (não `\n`), pronta para colar manualmente no Instagram ou ser lida por API.
- Em carrossel, os slides são numerados `01.png`, `02.png` (zero-padded), e a ordem do carrossel SEGUE essa numeração.

### CSV de publicação (fonte da ferramenta de auto-postagem)

**Nome:** `agenda-publicacao-{cliente}-{mes}-{ano}.csv`

**Localização:** raiz da pasta do mês (mesmo nível dos outros docs do calendário).

**Formato:** CSV UTF-8 com BOM, separador `;` (abre direto no Google Sheets via "Arquivo → Importar"), aspas duplas escapando campos com vírgula/quebra de linha.

**Colunas (ordem fixa):**

| # | Coluna | Tipo | Descrição |
|---|--------|------|-----------|
| 1 | `post_id` | string | `NN` do post (`01`, `02`, …) |
| 2 | `cliente` | string | Slug do cliente (`delamore`, `camila-estetica`) |
| 3 | `data_publicacao` | date | `AAAA-MM-DD` |
| 4 | `hora_publicacao` | time | `HH:MM` (vazio = ferramenta decide) |
| 5 | `dia_semana` | string | `seg`, `ter`, `qua`, `qui`, `sex`, `sab`, `dom` |
| 6 | `tipo` | enum | `post`, `carrossel`, `reel` |
| 7 | `pilar` | string | Pilar do calendário (P1, P2, …) |
| 8 | `linha_produto` | string | Linha/categoria (opcional, vazio se n/a) |
| 9 | `tema` | string | Tema curto do post |
| 10 | `legenda` | text | Legenda completa pronta para postar (com quebras de linha reais) |
| 11 | `primeira_linha` | string | Primeira linha da legenda (hook, gancho) |
| 12 | `hashtags` | string | Hashtags do post |
| 13 | `imagem_path` | string | Caminho da imagem. Carrossel: paths separados por `\|` na ordem. Reel sem capa: vazio |
| 14 | `ordem_carrossel` | string | `1\|2\|3` na ordem dos slides do carrossel. Vazio se não é carrossel. |
| 15 | `video_path` | string | Caminho do `.mp4` (Reel). Vazio para post/carrossel. |
| 16 | `status` | enum | `a_publicar`, `agendado`, `publicado`, `pulado` |
| 17 | `link_drive` | string | Link visualização Drive da pasta da campanha (opcional) |
| 18 | `observacoes` | string | Notas operacionais |

**Linha 1 = cabeçalho.** Linhas 2+ = posts em ordem cronológica de publicação.

**Paths no CSV:** relativos à raiz da pasta do mês. Exemplo: `entregaveis/03_2026-06-03_post_conjunto-renda/imagem.png`.

### Como gerar o CSV

Helper canônico: [scripts/lib/agenda_csv.mjs](../../scripts/lib/agenda_csv.mjs) (a criar/usar).

API resumida:
```js
import { gerarAgendaCsv } from "./lib/agenda_csv.mjs";

await gerarAgendaCsv({
  cliente: "delamore",
  mes: "06",
  ano: "2026",
  outputDir: "C:/.../agendas/2026-06",
  // driveDir deprecated (2026-05-30) — manter ausente; entregáveis vão pro Supabase via publicador.
  posts: [
    {
      post_id: "01",
      data_publicacao: "2026-06-01",
      dia_semana: "seg",
      tipo: "post",
      pilar: "P5 Bastidores",
      tema: "Junho começou na fábrica",
      legenda: "...",
      hashtags: "...",
      imagem_path: "entregaveis/01_2026-06-01_post_bastidores-fabrica/imagem.png",
    },
    // ...
  ],
});
```

### Atualização do CSV ao longo do mês

- Quando uma imagem é regerada/sobrescrita, o CSV **não muda** (path continua igual).
- Quando um post é movido de data, **atualizar `data_publicacao`** e reordenar o `NN` (renomeando subpasta).
- Quando um post é publicado, atualizar `status` para `publicado`.

---

## Convenções de nomenclatura

### Pastas de campanha (TOP LEVEL)

`AAAA-{periodo}_{nome-campanha-kebab-case}`

Exemplos:
- `2026-mai-jul_skin-winter` — campanha que atravessa mai-jun-jul/2026
- `2026-08_pele-de-transicao` — campanha de 1 mês em agosto/2026
- `2026-set-nov_summer-glow` — campanha de set-out-nov/2026
- `2027-mai-jul_skin-winter` — versão 2027 da SKIN WINTER

**Período:**
- 1 mês: `MM` → `08`
- N meses: `MMM-MMM` → `mai-jul` (abreviado em PT-BR, sem acentos)

### Pastas de mês dentro de `01_CALENDARIOS/`

`AAAA-MM_mes_fase-N-descricao` → `2026-05_maio_fase-0-teaser`

### Pastas de imagens/vídeos por mês

`AAAA-MM_mes` → `2026-05_maio`

### Arquivos numerados

- **Documentos críticos:** `NN-NOME-EM-CAIXA-ALTA.md` (calendário, playbook master, resumo)
- **Documentos de apoio:** `NN-nome-kebab-case.md` (roteiros, briefings)
- **Subpastas de entregáveis (v3):** `NN_AAAA-MM-DD_{tipo}_{tema-kebab}/`
- **Imagens dentro de subpasta de entregável (v3):**
  - Post simples: `imagem.png`
  - Carrossel: `01.png`, `02.png`, ... (na ordem dos slides)
  - Reel: `capa.png` + `video.mp4`
- **CSV de publicação (v3):** `agenda-publicacao-{cliente}-{mes}-{ano}.csv`
- **Imagens legado (v2, deprecado):** `AAAA-MM-DD-tipo-tema-vN.png` em `02_IMAGENS/`

---

## Os 2 RESUMOS EXECUTIVOS (.txt) — obrigatórios

### `RESUMO-EXECUTIVO-CLIENTE.txt` (raiz da AGENDA EDITORIAL)

**Para quem:** cliente que quer ver TODAS as ações ativas e próximas no nível mais alto.

**Conteúdo (template):**

```
[CLIENTE] - AGENDA EDITORIAL - VISAO GERAL DAS CAMPANHAS
========================================================

O QUE E ESSA PASTA
- explicação 1-2 parágrafos

CAMPANHAS ATIVAS
- nome, período, pasta, link p/ resumo, status, metas

PROXIMAS CAMPANHAS
- o que está em discussão

HISTORICO
- campanhas anteriores

CALENDARIO MACRO DA AGENDA EDITORIAL
- mês a mês, o que vai rolar

DECISOES PENDENTES MAIS IMPORTANTES
- por campanha

ESTRUTURA DA PASTA AGENDA EDITORIAL
- árvore explicativa

COMO USAR ESSE DOCUMENTO
- para equipe agência / para equipe clínica

PROXIMA ATUALIZACAO DESTE DOCUMENTO
- quando revisar
```

**Atualizar:** sempre que uma nova campanha for criada/encerrada, ou mensalmente.

**Tamanho:** 2-3 páginas. Texto puro, sem markdown.

### `00-RESUMO-CAMPANHA.txt` (dentro de cada campanha)

**Para quem:** cliente que quer entender UMA campanha específica sem ler o playbook inteiro.

**Conteúdo (template):**

```
[NOME DA CAMPANHA] - RESUMO EXECUTIVO
=====================================
Cliente / Período / Status

O QUE E
- manifesto + tagline

POR QUE FUNCIONA
- tese técnica e comercial

ESTRUTURA DE OFERTA
- degraus de preço + regras invioláveis

CRONOGRAMA DAS FASES
- todas as fases com datas + mensagem-mãe + número de posts

O QUE VOCE VAI VER NO FEED
- mix editorial em números

METAS DE NEGOCIO
- KPIs principais

DECISOES IMPORTANTES PENDENTES COM A CLIENTE
- por prioridade

ONDE ENCONTRAR DETALHE
- links para playbook completo, calendários, etc.

PROXIMO PASSO
- ação concreta imediata
```

**Atualizar:** quando a estratégia for revista ou ao fim de cada fase.

**Tamanho:** 2-3 páginas. Texto puro, sem markdown.

---

## Por que campanhas-como-pastas (não meses-como-pastas)

A campanha é a unidade que carrega significado estratégico. Um mês isolado não diz nada — junho/2026 pode ser "Fase 2 da SKIN WINTER" ou "campanha de Dia dos Namorados" ou "manutenção sem campanha", e a estratégia muda completamente.

Quando o cliente pergunta "como está a SKIN WINTER?", a resposta é UMA pasta. Quando pergunta "o que vai rolar em agosto?", a resposta é UMA pasta (a campanha de agosto).

Quando duas campanhas rodam em paralelo (acontece raramente — ex.: campanha principal + ação pontual de Black Friday), cada uma tem sua pasta independente. Não há conflito.

---

## O que vai em cada arquivo (detalhado)

### Playbook (00_PLAYBOOK/)
Estratégia, princípios, decisões fixas. **NÃO muda no dia a dia.**

- **00-PLAYBOOK-MASTER** → canonical, sumário
- **01-manifesto-tagline** → manifesto + tagline + princípios de mensagem
- **02-arquitetura-oferta** → escada de preço, política
- **03-funil-fases** → N fases + datas + gatilhos
- **04-persona-foco** → personas + tom para cada
- **05-mix-editorial** → quantos Reels, carrosséis, âncoras por mês
- **06-kpis-metas** → métricas, metas, como medir, pivôs autorizados
- **07-politica-precos** → regras invioláveis + respostas-padrão
- **08-extras-programa** → versão mínima da 1ª turma, extras pós-validação
- **09-riscos-mitigacoes** → matriz de risco + roteiros de resposta
- **10-decisoes-em-aberto** → pendências com a cliente

### Calendário mensal (01_CALENDARIOS/{mes}/)
Execução. Atualizado conforme o mês evolui.

- **00-CALENDARIO-{MES}** → tabela do mês + copy COMPLETA de cada post (slides + caption + hashtags). Documento que vai para designer e cliente.
- **01-roteiros-reels** → scripts fala-a-fala dos Reels
- **02-stories-template** → tipos de Stories e cadência semanal
- **03-briefing-imagens** → prompts de IA, specs técnicas, refs visuais

### Imagens / Vídeos
Outputs prontos por mês.

### Leads
Tracking operacional. Atualizar diariamente.

### Arquivo
Quando uma campanha termina, mover a pasta inteira para `99_ARQUIVO/`.

---

## Fluxo de trabalho

### Iniciar nova campanha
1. Criar pasta-mãe `AAAA-{periodo}_{nome-campanha}/` no nível raiz
2. Criar a árvore interna (00_PLAYBOOK, 01_CALENDARIOS, 02_IMAGENS, 03_VIDEOS, 04_LEADS_LISTA-INTERESSE)
3. Escrever o 00-PLAYBOOK-MASTER + 10 documentos de estratégia
4. Escrever o 00-RESUMO-CAMPANHA.txt (versão curta para cliente)
5. Atualizar `RESUMO-EXECUTIVO-CLIENTE.txt` da raiz com a nova campanha
6. Criar pasta do primeiro mês em `01_CALENDARIOS/`
7. Gerar os 4 docs base do mês (calendário, roteiros, stories, briefing imagens)

### Durante o mês
- Gerar imagens em batch — `02_IMAGENS/{mes}/`
- Gravar e editar Reels — `03_VIDEOS/{mes}/`
- Atualizar tracking de leads
- Marcar status no calendário

### Fim do mês
- Revisar KPIs (atualizar `06-kpis-metas.md`)
- Iniciar pasta do próximo mês (se for da mesma campanha)

### Fim da campanha
- Mover pasta da campanha inteira para `99_ARQUIVO/`
- Mover entrada do `RESUMO-EXECUTIVO-CLIENTE.txt` para "histórico"
- Iniciar nova campanha

---

## Inicializar este padrão para um cliente novo

1. **Criar a pasta-raiz** `AGENDA EDITORIAL` no Drive do cliente (caminho: `G:\Meu Drive\CLIENTES\{NOME_CLIENTE}\AGENDA EDITORIAL\`)

2. **Copiar este documento** para `AGENDA EDITORIAL/_PADRAO-ORGANIZACAO.md`

3. **Criar `RESUMO-EXECUTIVO-CLIENTE.txt`** na raiz (mesmo se vazio inicialmente, com placeholders)

4. **Criar `99_ARQUIVO/`** vazio

5. **Criar a primeira campanha:** `AAAA-{periodo}_{nome}/` com toda a árvore interna

6. **Escrever os 11 documentos do playbook + os 4 do primeiro mês + o 00-RESUMO-CAMPANHA.txt**

---

## Quando NÃO seguir o padrão à risca

O padrão é guia, não dogma. Adaptar quando:

- **Cliente sem campanha definida (só fluxo evergreen):** criar pasta `00_EVERGREEN/` no lugar de pasta de campanha, com os mesmos 01_CALENDARIOS/02_IMAGENS/etc.
- **Cliente sem captação de leads:** pode pular `04_LEADS_LISTA-INTERESSE` ou simplificar para tracking de engajamento.
- **Cliente com baixo volume de imagens (1-2/semana):** consolidar `02_IMAGENS` em uma única pasta sem subpastas mensais.
- **Cliente com produção 100% manual (sem IA):** `03-briefing-imagens` vira moodboard para fotógrafo/designer humano.
- **Campanha muito pequena (1-2 semanas):** dispensar a divisão em fases dentro do calendário mensal.

---

## Histórico do padrão

| Versão | Data | Mudança |
|---|---|---|
| v1 | 2026-05-20 | Versão inicial. Campanha-única no root (sem pasta de campanha). |
| v2 | 2026-05-20 | Refatorado para suportar múltiplas campanhas. Cada campanha tem sua própria pasta `AAAA-{periodo}_{nome}/` com playbook+calendários+imagens+vídeos+leads autocontidos. Adicionados 2 resumos executivos em .txt (1 geral da agenda + 1 por campanha). |
| **v3** | 2026-05-29 | Cada post agora vive em sua própria subpasta dentro de `entregaveis/` (imagem(ns) + legenda + prompt + roteiro juntos). CSV `agenda-publicacao-*.csv` no raiz da pasta do mês como fonte canônica para ferramentas de auto-postagem (cliente, data, legenda formatada, paths das mídias, status). Pastas `02_IMAGENS/` e `03_VIDEOS/` ficam como atalhos legíveis mas não são mais a fonte. |

---

## Aplicações em clientes

| Cliente | Caminho | Data de início | Status | Campanhas ativas |
|---|---|---|---|---|
| Camila Estética | `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\AGENDA EDITORIAL\` | 2026-05-20 | Ativo | SKIN WINTER 2026 (mai-jul) |
