# Clientes — Workspace de Agendas Editoriais

Esta pasta contém **um diretório por cliente**, cada um isolado com sua própria identidade, tom de voz, briefing, pilares de conteúdo e histórico de agendas.

## Como criar um cliente novo

1. Duplique a pasta `_template/` e renomeie para o nome do cliente em kebab-case:
   ```
   clientes/_template/  →  clientes/clinica-bella-vita/
   ```
2. Preencha os arquivos `00-` a `07-` com as informações coletadas no briefing.
3. Adicione assets visuais (logo, paleta, fontes, mood board) em `assets/`.
4. Toda agenda mensal gerada vai para `agendas/AAAA-MM/` (ex: `agendas/2026-06/`).
5. Criativos prontos (legendas, roteiros, imagens) vão para `criativos/`.

## Estrutura padrão de cada cliente

```
clientes/<nome-cliente>/
├── 00-overview.md          → resumo executivo (1 página)
├── 01-briefing.md          → briefing completo
├── 02-tom-de-voz.md        → voz, tom, vocabulário, proibidos
├── 03-identidade-visual.md → cores, fontes, estilo de imagem
├── 04-pilares-conteudo.md  → pilares estratégicos do mês/trimestre
├── 05-publico-alvo.md      → persona, dores, desejos, objeções
├── 06-concorrencia.md      → análise dos principais concorrentes
├── 07-referencias.md       → contas, criadores e formatos de inspiração
├── agendas/                → agendas mensais (uma pasta por mês)
├── assets/                 → logo, paleta, fontes, mood boards
└── criativos/              → posts, reels, ads gerados
```

## Como usar com Claude

Ao trabalhar em qualquer cliente, sempre comece dizendo:

> "Estamos no cliente **[nome]**. Carregue o contexto da pasta `clientes/[nome]/`."

O Claude vai ler os arquivos de contexto e aplicar tudo (tom, pilares, identidade visual, persona) ao gerar a agenda editorial, copy, roteiros de Reels e prompts de imagem.

Para criar a próxima agenda de um cliente já configurado, basta dizer:

> "Crie a agenda editorial de **junho/2026** para o cliente **[nome]**."

E o Claude vai invocar a skill `agenda-editorial` aplicando o contexto do cliente.
