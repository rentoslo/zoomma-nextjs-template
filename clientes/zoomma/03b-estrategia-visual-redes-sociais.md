# Estratégia Visual de Redes Sociais — Zoomma

> Complementa [03-identidade-visual.md](03-identidade-visual.md). Enquanto aquele arquivo é o **guia oficial completo**, este é a **versão operacional simplificada** para Instagram — feita pra resolver o problema do feed "carregado" e criar identidade reconhecível.

## ⚙️ Modo padrão de geração de imagem

- **Modelo:** `gemini-3-pro-image-preview` (Nano Banana Pro) via SDK `@google/genai`
- **Modo:** **Batch API por padrão** (50% mais barato que síncrono)
- **Síncrono só** quando: (a) preview rápido de 1-2 imagens pra validar conceito, ou (b) usuário pede explicitamente "agora"
- **Script de referência:** `scripts/gerar_posts_teste_zoomma.mjs` (este foi síncrono — versão Batch será criada quando for usada a 1ª vez em volume)
- **Pasta de saída:** `clientes/zoomma/criativos/imagens/<contexto>/`
- **Chave API:** em `.env` na raiz do projeto (já no `.gitignore`)

## 🖋️ Assinatura visual oficial (presente em 100% dos posts)

> **Linha vertical dourada** color `#D4A574` · largura **1.5 pixels** · posicionada exatamente a **28 pixels da borda esquerda** · estendida **do topo ao rodapé** sem interrupção · opacidade 90%.

- Posição **imutável** — sempre no mesmo lugar (a lateral esquerda funciona como espinha visual do feed)
- Discreta: marca presença sem competir com o conteúdo
- Reconhecível: o olho aprende a buscar quando rola o feed
- **Aplicar em TODA peça**: carrosséis, Reels covers, posts respiro, cor-selo, foto-pessoa, etc.

## 🎬 Mood fotográfico oficial: **KINFOLK**

Toda cena ambiental (Template 03) e foto de fundo segue o mood **Kinfolk magazine**:

- **Iluminação:** soft diffused natural light, preferencialmente lateral ou overhead
- **Color temp:** 4500-5000K com warm undertones (terroso, dourado, honey)
- **Composição:** overhead ou three-quarter, assimétrica, intencional, com generous negative space
- **Paleta:** warm honey wood, soft cream linen, sage green (eucalipto), warm white ceramic
- **Atmosfera:** slow-living, contemplativa, premium-acolhedora
- **Câmera de referência:** Hasselblad H6D + 80mm @ f/4
- **Anti-IA:** sempre incluir "subtle natural film grain", "organic shadows", "imperfect arrangement"

Moods rejeitados (não usar):
- ❌ Aesop/Hermès (mármore + sombras duras) — frio demais pra B2B brasileiro
- ❌ NYT Magazine (chiaroscuro intelectual) — sério demais pra atrair empresário da beleza

## 🎨 Cor-selo oficial: **Vermelho terroso `#9B3B2E`**

- **Função:** quebrar o scroll do feed em posts de máximo impacto
- **Frequência:** 1 a cada 10-15 posts (raro = poderoso)
- **Uso exclusivo:** série editorial **"VERDADE INCONVENIENTE"** — provocações duras, dicas anti-popularidade, verdades que ninguém fala
- **Tipografia em cima:** serif bold em warm off-white `#F5F3EE`
- **Footer:** tag pequena em letter-spacing uppercase "VERDADE INCONVENIENTE"

Cores rejeitadas (não usar):
- ❌ Verde floresta `#3E5A4F`
- ❌ Mostarda profunda `#A67C3E`

## 🌬️ Posts "respiro" (oficializado)

- **Frequência:** 1 a cada 4-5 posts densos
- **Composição:** foto Kinfolk (mesa, café, janela, cortina) + 1 palavra ou frase curta serif gigante em deep navy `#2B3A4D`
- **Função estratégica:** descanso visual do feed + status premium ("marca que não precisa gritar")
- Aprovados: "Pausa.", "Pensar é a primeira venda.", "Silêncio."

## 🧑 Pessoas reais: **Image-to-Image Edit** (REGRA OFICIAL, sem exceções)

Sempre que aparecer um sócio (Renato, Bruno) ou esposa (Camila, Paola) em post publicável, usar **image-to-image edit** — nunca gerar pessoa "do zero".

### Por que (decidido em 2026-05-16 após teste A/B)
- **Identity Reference (geração do zero a partir de fotos)** entrega fidelidade ~60-85% — pessoa parecida mas não é a real. Quem conhece o sujeito sabe que não é ele/ela.
- **Image-to-Image (edição da foto real)** entrega fidelidade 100% — é a pessoa real.
- Em B2B premium do nicho da beleza, perder credibilidade publicando "Camila de IA" mata o trabalho de autoridade.

### Pastas de fotos de referência
```
G:\Meu Drive\ZOOMMA\IDENTIDADE VISUAL\fotos_referencia\
  ├── renato\     (sócio — 60 fotos disponíveis)
  ├── camila\     (esposa profissional da beleza — 27 fotos disponíveis)
  ├── bruno\      (sócio — aguardando fotos)
  └── paola\      (esposa profissional da beleza — aguardando fotos)
```

### Modos de Image-to-Image (3 técnicas) — REGRA DE USO OFICIALIZADA EM 2026-05-17

**🥇 Modo 1 (PRIMEIRA ESCOLHA quando viável) — Edição completa preservando tudo**
Pega a foto real e edita: troca fundo (se necessário), ajusta luz, aplica mood Kinfolk, adiciona overlay bege com texto e assinatura visual. **Preserva 100% rosto + corpo + roupa + pose** da foto base.
- **Quando usar:** sempre que a pose/roupa/contexto da foto base já servem ao post desejado. Esta é a primeira escolha.
- **Vantagens:** fidelidade 100%, zero risco anatômico (sem pescoço longo), mínimo "ar de IA" porque a pessoa é foto real
- **Limitação:** repertório limitado às fotos que existem. Não dá pra "esticar" para cenas que a pessoa nunca fez.
- **Exemplo de prompt:** "preserve the person exactly as she is — face, body, clothing, pose; change ONLY the background to..., apply Kinfolk color grading..., add overlay with..."
- **Aprovação visual final pela Zoomma em 2026-05-17** — 4 testes em `teste/modo1_renato_camila/`

**🥈 Modo 2 (FALLBACK quando precisa de cenário novo) — Preservar SÓ a cabeça, regenerar resto**
Mantém rosto + cabelo + expressão fiéis à foto base; regenera corpo, roupa, pose e cenário completamente.
- **Quando usar:** quando o post pede cenário/roupa/pose que NÃO existe nas fotos disponíveis e o Modo 1 não consegue cobrir.
- **Pré-requisitos para evitar pescoço longo:**
  1. Usar **foto base de corpo inteiro** ou **medium shot** (NUNCA close studio puro)
  2. Bloco `ANATOMY_CONSISTENCY` no template (já embutido)
  3. Especificar `"MEDIUM SHOT framing"` na pose
- **Fidelidade:** ~85-95% com as 3 condições acima
- **Já validado** em `teste/anatomy_fix/` (S2 = 9.5-10/10)

**❌ Modo 3 — Identity Reference (DESCARTADO)**
Não usar em post publicável. Fidelidade ~60-85% — quem conhece a pessoa sabe que não é ela.

### Árvore de decisão (regra prática)
```
Vou criar um post com Renato/Camila/Bruno/Paola?
├── Já existe foto da pessoa com pose/roupa que serve?
│   ├── SIM → Modo 1 ⭐ (preserva tudo, edita fundo/luz/overlay)
│   └── NÃO → Modo 2 (preserva cabeça, regenera resto)
│              └── Foto base = corpo inteiro? Não → trocar antes
└── Pra esboço interno apenas (não publicação)?
    └── Modo 3 (raríssimo, só se Modo 1 e 2 não funcionarem)
```

### 🎯 Photorealism Boost (combate o "ar de IA") — APLICADO POR PADRÃO

Identificado em 2026-05-17: posts gerados, mesmo bons, ainda exalavam "ar de IA" (pele lisa demais, olhos cristalinos, iluminação controlada, simetria perfeita). Aplicamos 10 técnicas avançadas para destruir esse tell. **Tudo já está embutido no `template_pessoa_head_preserve.mjs` como `PHOTOREALISM_BOOST` — não precisa lembrar de adicionar, é automático.**

| # | Técnica | O que muda |
|---|---------|------------|
| 1 | Câmera trocada de Hasselblad H6D pra **Canon EOS R5 + 85mm f/1.4** | Sai do "studio commercial", entra no "editorial jornalístico" |
| 2 | **Filme Kodak Portra 400** com grão e halação | Cor mais quente, imperfeição autêntica de filme |
| 3 | **Pele real**: poros visíveis, fine lines, redness sutil, brilho oleoso T-zone | Sai a pele plástica que entrega IA |
| 4 | **Olhos imperfeitos**: 1 catchlight só, leve redness inner corner, eyelid assimétrico | Acaba o olhar "glassy AI" |
| 5 | **Cabelo natural**: flyaways, slight frizz, fall assimétrico | Quebra a perfeição "computer generated" |
| 6 | **Pose candid**: mid-gesture, micro-expressão, composição levemente imperfeita | Sai do "pose de catálogo" |
| 7 | **Luz ambiente real**: available light only, sem strobes, temperatura de cor misturada | Acaba a luz "estúdio fake" |
| 8 | **Roupa vivida**: vincos naturais, drape imperfeito | Sai do "loja nova" |
| 9 | **Negative prompt agressivo**: ~30 termos bloqueando airbrushed/plastic/CGI/octane/HDR | Reforço explícito do que NÃO queremos |
| 10 | **Referência editorial**: "Peter Lindbergh editorial portraiture" / "Annie Leibovitz natural light" | Direciona o modelo pra estética de fotógrafo real |

### Como reaproveitar quando criar cenas novas
A descrição física da pessoa (campo `descricaoFisica`) deve incluir imperfeições naturais:
- ❌ Antes: "warm confident smile"
- ✅ Depois: "warm natural smile with slight asymmetry"

A descrição da roupa (`roupa`) deve incluir desgaste:
- ❌ Antes: "a crisp white shirt"
- ✅ Depois: "a crisp white cotton shirt with natural fabric wrinkles from real wear"

A descrição da pose (`pose`) deve ser candid:
- ❌ Antes: "standing facing the camera"
- ✅ Depois: "standing in slightly asymmetric relaxed posture, caught mid-thought"

### Foto base recomendada por pessoa (para Modo 2) — ATUALIZADO 2026-05-17

⚠️ **Descoberta importante:** fotos base do tipo **close studio** geram defeito "pescoço longo" / "cabeça flutuante" porque a IA precisa inventar a transição cabeça→corpo. A solução é **sempre usar foto base com CORPO INTEIRO ou MEDIUM SHOT visível** — a IA preserva a proporção real do corpo da foto.

| Pessoa | Foto base ideal | Por quê |
|--------|-----------------|---------|
| **Camila** | `IMG_3860.jpg` (jaleco bordô em pé numa clínica) | **Corpo inteiro visível** — resolve pescoço longo |
| **Renato** | `_MG_3700.jpg` (polo preto, em pé corpo inteiro) | **Corpo inteiro visível** — já natural |
| **Bruno** | a definir — priorizar foto de **corpo inteiro** ou **medium shot** | — |
| **Paola** | a definir — priorizar foto de **corpo inteiro** ou **medium shot** | — |

**Foto fallback** (para cenas onde o cenário ORIGINAL da foto base é o que queremos, ex: post de "autoridade na clínica"):
- Camila: `IMG_3629.jpg` (close studio) — usar SÓ se aplicar ANATOMY_CONSISTENCY + MEDIUM SHOT explícito + aceitar 7/10 em vez de 9.5/10

### Regra adicional pra evitar "pescoço longo"
Em toda cena, no campo `pose` do template, **sempre incluir uma das frases**:
- `"preserve her/his natural body posture from the reference image"`
- `"MEDIUM SHOT framing capturing from waist up, with natural anatomical proportions"`

Isso reforça pra IA usar a anatomia da foto base em vez de inventar.

### Nunca fazer
- Gerar pessoas do zero pela IA como representação dos 4
- Usar pessoas IA fotorrealistas como "rosto" da marca
- Publicar Identity Reference (Modo 3) em qualquer post oficial

## 📚 Sistema de séries editoriais (a definir pelo usuário)

Renato vai definir esse sistema posteriormente, com calma. Quando definido, registrar aqui as séries:
- ⚠️ Pendente: nomes das séries, regras de aplicação, tipografia de cabeçalho
- Já definido: **"VERDADE INCONVENIENTE"** (cor-selo vermelho)

---

## 🩺 Diagnóstico — por que o feed atual está carregado

O Guia de Identidade Visual oficial é completo e rico, mas tem uma **armadilha de execução**: se você aplicar todos os elementos em cada peça, sobrecarrega.

Em cada post atual provavelmente está acontecendo:
- Foto de fundo (camada 1)
- Overlay translúcido bege (camada 2)
- Textura linen (camada 3)
- Tipografia serif grande (camada 4)
- Tipografia sans-serif (camada 5)
- Ícone dourado line-art (camada 6)
- Linha decorativa dourada (camada 7)
- Borda dourada thin (camada 8)

→ **8 elementos competindo pela mesma área visual.** Resultado: ruído, falta de hierarquia, sensação de "amador tentando parecer premium".

## ✂️ Princípio universal de design premium

> Marcas premium **REMOVEM** elementos. Não adicionam.

Apple, Hermès, Aesop, MUJI — todas têm uma regra invisível: **se você não puder defender em voz alta para que serve aquele elemento, ele sai.**

Para o feed da Zoomma, vamos adotar a regra:

**1 destaque dominante + no máximo 2 elementos de apoio.**

Tudo o que não couber nessa fórmula, fica de fora daquele post específico (mas pode aparecer em outro).

---

## 🎯 Guia Visual Simplificado — Zoomma para Instagram

Esta é a **redução operacional** do Guia Oficial para uso diário em redes sociais.

### Paleta reduzida (3 cores principais)
Em vez de gerenciar 9 cores, trabalhar com **3 cores-chave** + 1 acento ocasional:

| Cor | HEX | Uso |
|-----|-----|-----|
| **Navy** | `#2B3A4D` | Fundo dominante em ~40% dos posts (autoridade, contraste) |
| **Off-White** | `#F5F3EE` | Fundo dominante em ~40% dos posts (clareza, respiro) |
| **Branco** | `#FFFFFF` | Fundo dominante em ~10% dos posts (clean radical) |
| **Dourado** | `#D4A574` | Acento pontual — texto único, traço único, ícone único |

> Bege/peachy (`#E8D9CC`), taupe e areia ficam **reservados para a Variação B (30%)** — não usar como padrão.

### Tipografia (apenas 2 famílias — não 3)

| Função | Família | Peso | Quando |
|--------|---------|------|--------|
| **Títulos e impacto** | Serif elegante (Playfair Display, Cormorant) | Bold | Sempre que houver headline |
| **Corpo e legendas** | Sans-serif clean (Inter, Montserrat) | Regular/Medium | Sempre que houver texto secundário |

> Cortar tipografia "acento" (script ou condensada). Não usar. Reduz ruído.

### Elementos visuais (uso restrito)

| Elemento | Frequência |
|----------|-----------|
| Overlay translúcido bege | **Só** quando há foto de fundo. Nunca sobre fundo plano. |
| Textura linen 30% | **Máximo 1 vez a cada 5 posts.** Não em todos. |
| Ícone dourado line-art | **Só** quando substitui texto/explicação. Nunca decorativo. |
| Linha decorativa dourada | **No máximo 1 linha por peça.** Como divisor ou ênfase. |
| Borda dourada thin | Só em caixas-CTA do último slide do carrossel. Nada mais. |

### Regra de ouro
> **Se o post pode ser entendido removendo um elemento, esse elemento sai.**

---

## 🎯 Sinalização de Nicho — onde a Zoomma se diferencia

A Zoomma vive numa fronteira delicada: precisa parecer **consultoria premium sofisticada** (autoridade) e ao mesmo tempo **especialista no mercado da beleza** (relevância). Genérico demais = "qualquer agência". Nichado demais = "vira post de salão".

A regra que resolve esse dilema:

> **Copy nomeia o nicho. Imagem sugere o nicho. Reel mostra o nicho.**

Cada vetor faz uma parte do trabalho — não tente sobrecarregar a imagem.

### 1. Copy SEMPRE nomeia o nicho (regra inviolável)
Toda headline da Zoomma deve nomear o universo da beleza **nos primeiros 5 segundos de leitura**. Vocabulário aprovado:

- **clínica de estética / clínica estética**
- **harmonização facial**
- **salão de beleza / salão**
- **profissional da beleza**
- **empresário da beleza**
- **mercado da beleza**
- **dona de clínica / dono de salão**

Exemplos de transformação:

| ❌ Genérico | ✅ Nichado |
|------------|-----------|
| "Pare de improvisar. Comece a escalar." | "Sua clínica de estética não cresce no improviso." |
| "Marketing sem estratégia é desperdício de verba." | "Marketing não vende harmonização. Estratégia sim." |
| "5 erros de quem não bate meta" | "5 erros que matam o crescimento da sua clínica" |
| "Você não precisa de mais conteúdo." | "Donas de clínica não precisam de mais posts. Precisam de gestão comercial." |

### 2. Imagem sugere o nicho via **objetos de sinalização** (30-40% das cenas ambientais)
Em ~30-40% dos posts de Template 03, incluir UM objeto que sinalize o universo da beleza — sem virar publicidade do nicho.

**Catálogo de objetos aprovados** (incluir UM por cena, nunca acumular):

**Skincare e produtos**
- Frasco de skincare premium âmbar/cristal (sem marca legível)
- Pote de creme cosmético minimalista
- Pequena espátula dourada cosmética

**Procedimento clínico**
- Espátula profissional metálica
- Cabo de aparelho estético (sem identificação de marca)
- Caderno aberto com diagrama de anatomia facial (linhas técnicas)
- Pinça de procedimento sobre bandeja

**Ambiente de salão/clínica**
- Maca de procedimento parcialmente visível ao fundo (desfocada)
- Cadeira de salão moderna ao fundo (desfocada)
- Espelho de procedimento estilizado em primeiro plano
- Recepção de clínica premium ao fundo (totalmente desfocada)

**Mix administrativo + nicho (mais inteligente — dois mundos no mesmo frame)**
- Caderno aberto com cálculo de margem manuscrito + frasco de skincare ao lado
- Tablet com gráfico de faturamento + pincel cosmético próximo
- Calendário com agendamentos riscados + espátula sobre a mesa

**Os 60% restantes podem ser ambiente neutro** (mesa, café, planta) — variar é importante. Não saturar de nicho em todo post = visualmente cansa.

### 3. Reels — cenário visível do nicho sempre que possível
Esse é o vetor mais barato e mais poderoso. Em vez de gravar Reels no escritório da Zoomma, gravar **dentro de clínica/salão real** (as esposas têm acesso a estabelecimentos do nicho — usar isso como locação).

Hierarquia de cenários para Reels (em ordem de preferência):
1. **Dentro de clínica/salão funcionando** — atrás da pessoa, ver maca + plantas + iluminação clínica
2. **Recepção de clínica premium** — sofá + plantas + balcão limpo
3. **Sala de reunião neutra** — só usar se as opções acima forem impossíveis
4. **Home office** — evitar; só em emergência

> A regra: **o cenário diz tudo em 1 segundo**. Antes do prospect ouvir a primeira palavra, ele já sabe se o palestrante "entende meu mundo".

### 4. Highlights do Instagram (capas)
As capas de destaques devem nomear o nicho:
- "Clínicas"
- "Salões"
- "Harmonização"
- "Casos"
- "Método"
- "Diagnóstico"

Não usar capas genéricas tipo "Sobre" ou "Serviços" — perde oportunidade de sinalizar relevância no primeiro toque.

---

## 🖼️ Sistema de Templates de Post (não prompts variáveis)

Em vez de inventar visual a cada post, trabalhar com **6 templates fixos** e revezar entre eles. Isso resolve 3 problemas:
1. Reconhecibilidade do feed (alguém vê fora do contexto e sabe que é Zoomma)
2. Velocidade de produção (não decide do zero toda vez)
3. Coerência do grid (templates alternam de forma previsível)

### Template 01 — Tipográfico Bold (Hook)
**Propósito:** Provocação, hook forte, abertura de tema.
**Pilares ideais:** 1, 2, 4
**Composição:**
- Fundo: Navy `#2B3A4D` OU Off-White `#F5F3EE` (alterna)
- Tipografia serif EXTRA BOLD ocupando 60% da área central
- Cor do texto: cor oposta ao fundo (branco no navy, navy no off-white)
- Acento dourado opcional: linha fina horizontal de 60-80px embaixo do texto, OU 1 ponto dourado decorativo
- **ZERO foto, ZERO ícone, ZERO textura**
**Uso de IA:** mínimo — pode ser feito 100% em Canva/Figma sem precisar de Nano Banana

### Template 02 — Foto Real + Bloco de Texto (Autoridade)
**Propósito:** Posicionamento humano, autoridade, "quem somos".
**Pilares ideais:** 4, 7, 11
**Composição:**
- Fundo: Foto real (você, Bruno, esposas, equipe, ambiente real)
- Overlay bege `#E8D9CC` translúcido 75% no terço inferior OU lateral direita
- Tipografia serif para nome/título, sans-serif para descrição
- Rounded corners 12-16px no overlay
**Uso de IA:** ZERO — fotos reais batidas com bom equipamento

### Template 03 — Cena Ambiental (Conceito)
**Propósito:** Conceito abstrato (estratégia, processo, decisão).
**Pilares ideais:** 5, 8, 9
**Composição:**
- Fundo: Cena ambiental gerada por IA — mesa de trabalho com café, planta sobre livro, janela com luz natural, papel rabiscado com gráfico, post-it na parede, mockup de tela
- **ZERO pessoas na imagem IA**
- Tipografia serif sobreposta no terço superior, alinhada à esquerda
- Acento dourado opcional: linha fina dourada na lateral
**Uso de IA:** PESADO — esse é o template onde o Nano Banana brilha

### Template 04 — Carrossel Educativo (Slides)
**Propósito:** Profundidade, educação, quebra de objeção.
**Pilares ideais:** 1, 2, 5, 8
**Composição (cada slide):**
- Slide 1 (Capa): Template 01 (tipográfico bold) com headline + número total ("01/07")
- Slides 2-N (Conteúdo): Fundo off-white, número grande dourado no canto, headline serif curto + 1 parágrafo sans-serif
- Slide final (CTA): Fundo navy, frase serif central + caixa CTA com borda dourada thin + palavra-chave em maiúscula
**Uso de IA:** ZERO ou mínimo (só se algum slide precisar de cena ambiental)

### Template 05 — Reel (Talking Head)
**Propósito:** Reach orgânico, voz humana, autoridade.
**Pilares ideais:** todos
**Composição:**
- Você ou Bruno (ou ambos) falando em frame médio
- Ambiente: escritório limpo, parede neutra, planta no canto — NÃO fundo de casa improvisada
- Iluminação: luz natural lateral (janela à 45°) OU softbox simples
- Legenda sobreposta: sans-serif bold branco com sombra sutil (tipo CapCut "Big Bold")
- Cor de destaque na legenda: dourado em palavras-chave
- Cover do Reel: Template 01 (tipográfico) reaproveitado
**Uso de IA:** ZERO — gravação real

### Template 06 — Prova Social / Print
**Propósito:** Depoimento, screenshot de DM, conversa.
**Pilares ideais:** 7, 10
**Composição:**
- Fundo: Off-white `#F5F3EE`
- Centralizado: screenshot estilizado (mockup de DM ou WhatsApp) com bordas suaves
- Acima do screenshot: headline serif curto ("Resultado de um cliente em 45 dias")
- Abaixo: 1 frase sans-serif assinada com nome do cliente + cidade nos EUA
**Uso de IA:** ZERO — mockup feito em Figma/Canva

---

## 🎨 Como fazer prompts que NÃO parecem IA

Esse é o jogo. Aqui estão as 8 regras que separam "feed amador com IA" de "feed premium com IA invisível":

### 1. NUNCA peça tipografia legível ao Nano Banana
A IA ainda erra texto. Sempre. Mesmo o Gemini 3 Pro Image escorrega.
**Estratégia:** gerar a imagem **sem texto** e adicionar a tipografia depois em Canva/Figma usando as fontes oficiais.

### 2. Ambientes e objetos > pessoas
Pessoas geradas têm "tells" sutis (dedos, simetria de olhos, pele plástica). Ambientes e objetos não têm.
**Use IA para:** mesas, janelas, plantas, café, papéis, livros, ambientes vazios, paredes, texturas.
**Use foto real para:** rostos, mãos, gestos.

### 3. Sempre referencie equipamento fotográfico no prompt
A IA responde MUITO melhor quando você diz "shot on [câmera] with [lente]". Cria realismo automático.
**Exemplo:**
> "shot on Fujifilm GFX 50R with 63mm lens, f/4, ISO 400, available natural light from left window"

### 4. Peça imperfeições controladas
Realidade tem grão, sombra irregular, foco seletivo. Perfeição = IA.
**Adicione sempre:**
> "subtle film grain, natural light falloff, slight depth of field with bokeh background, organic shadow play"

### 5. Defina hora do dia + temperatura de cor
Ambiente sem hora definida = "estúdio falso" (sinal de IA).
**Exemplos:**
- Manhã: "morning light, 5500K, soft blue undertones"
- Final de tarde: "golden hour, 3200K, warm amber light from window"

### 6. Composição assimétrica > centralizada
IA tende a centralizar tudo. Composição editorial profissional usa terços.
**No prompt:**
> "rule of thirds composition, subject offset to lower-right, negative space top-left"

### 7. Negative prompt sempre presente
Repete em todo prompt:
> "no people, no text, no logos, no watermarks, no symmetry, no perfect geometry, no cartoon, no illustration, no overly saturated colors, no harsh shadows, no plastic textures, no AI artifacts"

### 8. Aspect ratio EXPLÍCITO
Sempre incluir no prompt:
- Feed: `aspect ratio 4:5`
- Reel cover / Stories: `aspect ratio 9:16`

---

## 🧩 Prompt Master (Template 03 — Cena Ambiental)

Copie e cole, substituindo `{CENA}` pela situação específica:

```
Editorial photography of {CENA}, shot on Fujifilm GFX 50R with 63mm lens, f/4,
ISO 400, available natural light from left window at morning (5500K, soft cool
tones with warm wood accents). Color palette dominated by off-white #F5F3EE and
warm beige tones with subtle navy #2B3A4D contrast. Rule of thirds composition,
subject offset to lower-right, generous negative space top-left for typography
overlay. Subtle film grain, natural light falloff, slight depth of field with
organic bokeh background, natural shadow play. Sophisticated minimal aesthetic,
professional editorial mood, no plastic textures. Aspect ratio 4:5.

Negative prompt: no people, no text, no logos, no watermarks, no symmetry,
no perfect geometry, no cartoon, no illustration, no overly saturated colors,
no harsh shadows, no plastic textures, no AI artifacts, no stock photo aesthetic.
```

### Exemplos de `{CENA}` para o nicho da Zoomma:
- "a minimalist wooden desk with an open notebook, a black pen resting on the page, a small ceramic cup of espresso, and a single dried eucalyptus branch in a glass vase"
- "a clean modern office corner with a large green monstera plant, a neutral linen armchair, and warm sunlight casting long shadows on the floor"
- "an overhead view of a marble surface with a leather-bound journal, a fountain pen, a small bowl of coffee beans, and printed analytics charts partially visible"
- "a window seat with a folded newspaper, a porcelain coffee cup steaming gently, and a soft cashmere throw, all bathed in golden afternoon light"

---

## 📐 Estratégia de Grid (Clean — confirmado pelo usuário)

Não vamos forçar mosaico complexo. Vamos usar **alternância previsível**:

### Padrão sugerido (linha de 3 colunas)
```
[ Template 01 Navy ]  [ Template 03 Bege ]  [ Template 02 Foto ]
[ Template 04 Capa ]  [ Template 01 Off-W ] [ Template 06 Print ]
[ Template 03 Bege ]  [ Template 05 Reel ]  [ Template 02 Foto ]
```

Resultado: a cada 3 posts, o grid alterna entre **fundo escuro (navy) → ambiente bege → foto real**. Isso cria **ritmo visual previsível** sem virar checkerboard.

### Regra simples para aprovar publicação
Antes de postar, olhar o grid e perguntar:
> **Os últimos 3 posts são visualmente diferentes entre si?**
- Sim → publica.
- Não → ajusta o template do próximo post.

---

## 🎬 Diretrizes específicas para Reels

Como o objetivo é construir autoridade nas redes, Reels são o **principal acelerador**. Algumas regras:

1. **Cobertura facial:** sempre rosto enquadrado no frame médio (peito pra cima). Não em pé inteiro. Não corte do nariz pra cima.
2. **Olhar para a câmera:** sempre. Olhar para o lado = "lendo o teleprompter" = perda de conexão.
3. **Cenário:** parede neutra (off-white, navy, ou madeira clara). Nada de cozinha, nada de cama atrás, nada de quadros pendurados desordenados.
4. **Luz:** janela à 45° é a melhor. Se não tiver janela boa, 1 softbox lateral grande.
5. **Microfone:** lapela de pelo menos US$30 (Rode Wireless GO ou DJI Mic). Áudio ruim mata Reel B2B premium.
6. **Roupa:** monocromática, neutra (preto, navy, off-white, bege). Sem estampa, sem logo grande. Você e Bruno alinhados.
7. **Duração:** 30-60 segundos. Acima disso só com hook MUITO forte.
8. **Hook nos 2 primeiros segundos:** sempre uma frase provocativa cortando direto. NÃO "oi pessoal, beleza?". NÃO se apresentar antes de provocar.
9. **Legenda sobreposta:** sempre. Mesmo se a pessoa está falando claramente. 85% do Instagram é assistido sem áudio.
10. **CTA no último frame:** travado por 2 segundos, com palavra-chave em destaque dourado.

---

## 🤝 Quando Renato, Bruno e esposas aparecem (estratégia humana)

A Zoomma tem 2 sócios homens + 2 esposas profissionais da beleza. Isso é **ouro estratégico** para B2B no nicho da beleza. Uso recomendado:

| Quem | Quando aparecer | Tom |
|------|-----------------|-----|
| **Renato (você)** | Maioria dos Reels educativos, posts de provocação, comparativos estratégicos | Diretor estratégico — "o cara que pensa" |
| **Bruno** | Posts de processo, gestão comercial, números, prova de método | Diretor de operação — "o cara que executa" |
| **Esposas (eventualmente)** | Conteúdos que tocam o "lado cliente": "Eu sou profissional da beleza E sou casada com um estrategista — falo dos dois lados" | Voz da persona — autenticidade |
| **Renato + Bruno juntos** | Reels de discussão, bastidor, polêmicas estratégicas internas | Dinâmica dupla — quebra de monotonia |
| **Família/equipe completa** | 1x por mês no máximo — bastidores, humanização, datas marcantes | Acolhimento, humanidade |

### Princípio: "rosto antes de teoria"
Cada vez que houver um conceito difícil pra entender por texto, **vira Reel com rosto**. Não tente educar via carrossel quando um Reel humano resolveria melhor.

---

## ✅ Checklist antes de aprovar qualquer post

- [ ] Está usando UM dos 6 templates (não inventei um novo)?
- [ ] Tem no máximo 1 destaque + 2 elementos de apoio?
- [ ] Paleta limitada (navy / off-white / branco + dourado pontual)?
- [ ] Apenas 2 famílias tipográficas?
- [ ] Se tem pessoa, é rosto REAL (não IA)?
- [ ] Se a imagem é IA, é cena ambiental SEM pessoas?
- [ ] Headline serif é a primeira coisa que se lê?
- [ ] CTA tem palavra-chave clara em destaque?
- [ ] Aspect ratio correto (4:5 feed, 9:16 stories/reel)?
- [ ] Os últimos 3 posts no grid são visualmente diferentes entre si?

Se algum "não", revisar antes de publicar.
