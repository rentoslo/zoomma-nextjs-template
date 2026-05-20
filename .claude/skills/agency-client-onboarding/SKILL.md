---
name: agency-client-onboarding
description: Use quando o usuário for adicionar um cliente NOVO à agência ou pedir "vamos cadastrar um cliente", "novo cliente [nome]", "configurar cliente [nome]", "começar o trabalho com [cliente]", "onboarding de cliente", "duplicar template para [cliente]", "preparar pasta do cliente", "rodar briefing", "fazer descoberta do cliente". Conduz o fluxo completo de descoberta — duplica clientes/_template/, faz as perguntas certas e preenche 01-briefing.md a 07-referencias.md. NÃO use para cliente já existente (use agenda-editorial para esses).
metadata:
  version: 1.0.0
---

# Agency Client Onboarding — Novo Cliente

Conduz o **onboarding completo de um novo cliente** da agência. Saída final: pasta `clientes/<slug-do-cliente>/` totalmente preenchida e pronta para começar a produzir agenda editorial, copy, criativos e tráfego.

> **Princípio:** Sem briefing bem feito, todo o conteúdo posterior é palpite. Esta skill garante que nenhuma pergunta crítica seja esquecida.

---

## Quando usar

- Usuário disse "vou pegar um cliente novo, [nome]"
- Cliente acabou de fechar e precisa estruturar a pasta
- Usuário pediu para "fazer o briefing" ou "configurar" um cliente que ainda não existe em `clientes/`

**Se a pasta `clientes/<slug>/` já existir**, NÃO use essa skill — chame `agenda-editorial` ou peça o que o usuário precisa.

---

## Fluxo (4 etapas)

### Etapa 1 — Definir o slug do cliente

Pergunte (ou confirme) o **nome curto kebab-case** do cliente. Exemplos:
- "Clínica Bella Vita" → `clinica-bella-vita`
- "Dra. Juliana Cardio" → `dra-juliana-cardio`
- "Café Pequeno Príncipe" → `cafe-pequeno-principe`

Regra: minúsculas, sem acento, palavras separadas por `-`, sem espaços, sem prefixo redundante (`clinica-` se o cliente for clínica, ok; `cliente-` nunca).

Verifique que `clientes/<slug>/` NÃO existe antes de seguir.

### Etapa 2 — Duplicar o template

Copiar `clientes/_template/` → `clientes/<slug>/`:

```powershell
Copy-Item -Recurse clientes/_template clientes/<slug>
```

Ou no Bash do projeto:
```bash
cp -r clientes/_template clientes/<slug>
```

Verifique que a cópia tem TODOS os arquivos: `00-overview.md`, `01-briefing.md`, `02-tom-de-voz.md`, `03-identidade-visual.md`, `04-pilares-conteudo.md`, `05-publico-alvo.md`, `06-concorrencia.md`, `07-referencias.md`, `PADRAO-AGENDA-EDITORIAL.md`, `agendas/`, `assets/`, `criativos/`.

### Etapa 3 — Conduzir a entrevista de descoberta

Faça as perguntas abaixo **em blocos**, esperando resposta antes de seguir. Não despeje tudo de uma vez.

#### Bloco 1 — Negócio (vai para 00-overview.md + 01-briefing.md)
1. O que é o negócio em 1 frase? (ex: "Clínica de estética premium para mulheres 35-55 em Bauru")
2. Há quanto tempo opera? Sozinho ou tem sócios?
3. Onde fica (cidade + bairro)? Atende online ou só presencial?
4. Qual o ticket médio do principal serviço/produto?
5. Quantos clientes/mês hoje? Quantos quer ter?
6. Qual o **diferencial real** vs concorrente local? (não é "atendimento personalizado" — algo concreto)

#### Bloco 2 — Persona (vai para 05-publico-alvo.md)
1. Quem é o cliente ideal? (gênero, idade, classe social, profissão)
2. Qual a dor que o cliente sente ANTES de comprar?
3. Como ele descreveria a transformação que quer? (palavras dele, não suas)
4. Onde ele mora? Como ele descobre serviços novos? (Insta, indicação, Google, TikTok)
5. Que objeção ele costuma ter? (preço, medo, vergonha, dúvida sobre resultado)
6. Há sub-personas? (ex: clínica estética: noiva, executiva, mãe pós-parto)

#### Bloco 3 — Voz e tom (vai para 02-tom-de-voz.md)
1. Como o cliente fala normalmente? (formal, "você", "tu", "amiga")
2. Cite 3 palavras que ele USA com frequência
3. Cite 3 palavras que ele NUNCA usaria (proibidas)
4. Pode usar humor? Que tipo (sutil, ácido, fofo, não usar)?
5. Pode falar de preço? Pode falar de promoção? Como?
6. Tem alguma temática proibida? (ex: religião, política, comparação direta com concorrente)
7. Pode usar emojis? Quais sim, quais não?

#### Bloco 4 — Identidade visual (vai para 03-identidade-visual.md)
1. Tem logo? (peça para enviar e salvar em `assets/logo/`)
2. Tem paleta definida? Quais cores principais? (hex codes)
3. Tem fonte definida? (nome + fallback)
4. Tem moodboard ou referências? (peça links / prints)
5. Estilo geral: minimalista, maximalista, orgânico, premium, urbano, lúdico?
6. Padrão de fotografia/imagem: real, ilustrado, IA, misto?
7. Tem fotos reais do espaço/produto/pessoa? (importante para anti-IA look)

#### Bloco 5 — Conteúdo e pilares (vai para 04-pilares-conteudo.md)
1. Tem agenda editorial hoje? Funciona?
2. Quantos posts por semana o cliente aceita publicar?
3. Quais formatos: Reels, Carrossel, Story, Foto, Post estático? Em que proporção?
4. Cite 3 temas que o cliente DEVE falar
5. Cite 3 temas que o cliente NÃO deve falar
6. Tem datas/eventos sazonais que matam? (Dia das Mães, Black Friday, etc.)

#### Bloco 6 — Concorrência (vai para 06-concorrencia.md)
1. Cite 3-5 concorrentes diretos (perfis Instagram, sites)
2. O que eles fazem BEM que o cliente ainda não faz?
3. O que eles fazem MAL que o cliente pode evitar?
4. Há um "concorrente farol" (referência admirada, mesmo não-local)?

#### Bloco 7 — Referências e inspiração (vai para 07-referencias.md)
1. Quais contas/marcas o cliente admira esteticamente?
2. Algum caso de marketing que ele lembra ter funcionado? (próprio ou de outros)
3. Algum tipo de conteúdo que ele PROIBIU? (ex: "nada de antes/depois")

### Etapa 4 — Preencher todos os arquivos + validar

Distribua as respostas conforme indicado em cada bloco e:

- **00-overview.md** → resumo executivo de 1 página (negócio, persona, oferta, pilares)
- **01-briefing.md** → entrevista crua transcrita, perguntas + respostas
- **02-tom-de-voz.md** → seção "Faz / Não Faz", vocabulário permitido/proibido, exemplos
- **03-identidade-visual.md** → cores em hex, fontes, **PROMPT-BASE de imagem** (fundamental para `nano-banana-pro-openrouter`), exemplos visuais
- **04-pilares-conteudo.md** → 3-6 pilares com proporção (%), temas-âncora por pilar, formatos por pilar
- **05-publico-alvo.md** → 1-3 personas estruturadas
- **06-concorrencia.md** → tabela de 3-5 concorrentes com fortes/fracos
- **07-referencias.md** → bullet list de inspirações

**Validação final** — ao fechar, faça 3 testes para confirmar que o briefing está utilizável:
1. Gere **3 ideias de pauta** aplicando os pilares → mostrar ao usuário e perguntar "essas pautas representam bem o cliente?"
2. Escreva **1 legenda de teste** usando o tom-de-voz → perguntar "essa voz é o cliente?"
3. Monte **1 prompt de imagem** usando o sistema visual → perguntar "essa estética é o cliente?"

Se algum dos 3 testes falhar, **volte ao bloco correspondente** e refine.

---

## O que NÃO fazer

- ❌ Pular blocos do briefing porque "o cliente é parecido com outro" — sempre fazer de novo
- ❌ Preencher arquivos com placeholder genérico — se o usuário não souber agora, marque `[A DEFINIR — perguntar a [Pessoa] até DD/MM]`
- ❌ Começar a gerar agenda editorial antes da Etapa 4 estar completa
- ❌ Copiar tom/pilares de outro cliente (regra inviolável do CLAUDE.md raiz)
- ❌ Misturar o slug do cliente com o nome real em arquivos (sempre kebab-case para pasta, nome real dentro dos arquivos)

---

## Saída esperada

Ao final desta skill, o usuário deve ter:
1. Pasta `clientes/<slug>/` criada e populada
2. Arquivos 00→07 preenchidos
3. 3 pautas de teste validadas
4. 1 legenda de teste validada
5. 1 prompt-base de imagem validado
6. Cliente pronto para receber `agenda-editorial` Fase 2 (geração de ideias) na sequência

Reporte o resumo final ao usuário e proponha: *"O cliente está pronto. Quer começar a primeira agenda mensal agora?"*
