# Padrão de Organização — AGENDA EDITORIAL (template reutilizável)

> Estrutura padrão para a pasta `AGENDA EDITORIAL` no Drive do cliente.
> **Versão mestre** deste padrão. Sempre que evoluir, atualizar aqui primeiro e replicar nos clientes.
>
> Versão atual: **v2** (campanhas-como-pastas)
> Definido em 2026-05-20 a partir do projeto Camila Estética / SKIN WINTER 2026.

---

## Filosofia

1. **Campanha é a unidade primária de organização.** Cada ação editorial tem sua própria pasta autocontida.
2. **Estratégia vive separada da execução, dentro da campanha.** O playbook fica em `00_PLAYBOOK/` — o calendário só executa.
3. **Time-based para campanhas e para meses.** Pasta de campanha começa com `AAAA-{periodo}_` para ordenar cronologicamente.
4. **Um arquivo por função, não por post.** 1 calendário consolidado por mês com todos os posts inline.
5. **`.md` para leitura técnica + `.txt` para envio à cliente.** Documentos críticos nos dois formatos.
6. **Resumos executivos sempre em `.txt`.** Para cliente que quer visão alta sem ler tudo.
7. **Underscores em pastas, hífens em arquivos.**

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
│   │       └── 03-briefing-imagens-{mes}.md
│   │
│   ├── 02_IMAGENS/                              ← outputs do gerador
│   │   └── AAAA-MM_mes/
│   │
│   ├── 03_VIDEOS/                               ← Reels
│   │   └── AAAA-MM_mes/
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
- **Imagens:** `AAAA-MM-DD-tipo-tema-vN.png`
- **Vídeos:** `AAAA-MM-DD-reel-tema-{raw|edit|final}.mp4`

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
| **v2** | 2026-05-20 | Refatorado para suportar múltiplas campanhas. Cada campanha tem sua própria pasta `AAAA-{periodo}_{nome}/` com playbook+calendários+imagens+vídeos+leads autocontidos. Adicionados 2 resumos executivos em .txt (1 geral da agenda + 1 por campanha). |

---

## Aplicações em clientes

| Cliente | Caminho | Data de início | Status | Campanhas ativas |
|---|---|---|---|---|
| Camila Estética | `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\AGENDA EDITORIAL\` | 2026-05-20 | Ativo | SKIN WINTER 2026 (mai-jul) |
