# Identidade Visual — Camila Estética

> **Sistema:** White Premium Editorial Feminine
> **Modelo de IA fixado:** **`gemini-3-pro-image-preview`** (Gemini 3 Pro Image / nano-banana-pro) via Google AI Studio direto
> **Infra:** chave `GOOGLE_AI_API_KEY` no `.env` · SDK `@google/genai` · script de referência: [scripts/teste_camila_4_imagens.mjs](../../scripts/teste_camila_4_imagens.mjs)
> **Atualização:** 2026-05-19 — fixado nano-banana-pro como modelo padrão + adicionada Variação D (Skin Ritual Editorial)
> **Arquivo fonte:** `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\GUIA DE IDENTIDADE VISUAL - CAMILA ESTÉTICA.txt`
> **Avatar (fotos da Dra. Camila):** `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\fotos_avatar`
> **Output padrão das gerações:** `G:\Meu Drive\CLIENTES\CAMILA_ESTETICA\AGENDA EDITORIAL\IMAGENS\`

---

## Logo
- **Arquivos:** `assets/logo/` (preto, branco, colorido, monocromático — a serem adicionados)
- **Espaço mínimo de respiração:** generoso — a marca respira em espaço negativo
- **Onde NUNCA usar:** fundos saturados, fundos rosa escuro, contraposições agressivas
- **Cor preferencial da assinatura:** dourado suave `#D4AF37` quando aplicável

---

## Paleta de cores — sistema 60/30/10

### Dominante (60%) — Branco
| HEX | Nome | Uso |
|-----|------|-----|
| `#FFFFFF` | Branco Puro | Background principal, base editorial premium |
| `#FBF7F4` | Branco Quente | Variação suave do branco, sensação luxo |
| `#F8F2EC` | Off-White Champagne | Alternativa para cenas mais quentes/orgânicas |

### Secundária (30%) — Rosa Sussurrado
| HEX | Nome | Uso |
|-----|------|-----|
| `#FCE4EC` | Rosa Sussurrado | Rosa muito suave, lavado, quase branco |
| `#F8D7DE` | Rosa Pétala | Variação levemente mais saturada |
| `#F5E8E0` | Nude Rosado | Tom orgânico de transição |

### Acento (10%) — Detalhes premium
| HEX | Nome | Uso |
|-----|------|-----|
| `#D4A5B5` | Rosa Antigo | Tipografia rosa em destaques |
| `#D87A9A` | Rosa Intenso | Acento pontual em palavras-chave |
| `#D4AF37` | Dourado Suave | Detalhes premium (logo, ornamentos) |
| `#1A1A1A` | Preto Suave | Tipografia principal, alto contraste sem dureza |

### 🔑 Regra de ouro
> **Se em dúvida, vá mais para o branco. O rosa nunca deve dominar — sempre acariciar.**

---

## Tipografia

- **Display/Títulos emocionais:** Serif elegante — estilo Playfair Display / Cormorant Garamond
- **Display/Títulos diretos:** Sans-serif Bold
- **Subheadings:** Sans-serif Semi-Bold/Bold em `#1A1A1A`
- **Corpo/Detalhes:** Sans-serif Regular/Medium em `#1A1A1A` ou `#D4A5B5`
- **Palavras-chave em destaque:** Rosa intenso `#D87A9A` ou rosa antigo `#D4A5B5` — com parcimônia
- **Logo/assinatura:** Dourado suave `#D4AF37` quando aplicável
- **Substituta no Instagram (apps de edição):** Playfair Display + Inter (ou similar sans clean)

> **Regra crítica:** Textos 100% integrados no prompt de imagem — nunca soltar "para adicionar depois". Sempre especificar tamanho, peso, cor, posição, contraste e se está em painel translúcido.

---

## Estilo fotográfico

- **Iluminação:** Soft diffused natural, ~5500K com leve warmth (sensação luz de janela em manhã)
- **Paleta das fotos:** Levemente dessaturada, tom quente sutil, white/cream dominante
- **Composição:** Editorial revista de luxo, espaço negativo generoso, foto frequentemente emoldurada com borda branca arredondada
- **Mood/sensação:** Premium, editorial, etéreo, feminino sofisticado, minimalista
- **Tratamento:** Foco suave, bokeh delicado, fundo desfocado clean
- **Hierarquia de camadas:** Espaço respirado → Foto emoldurada → Painel translúcido → Texto

---

## Sistema de variações A/B/C (distribuição 60 / 30 / 10)

> **Regra crítica de carrosséis:** MESMA variação em TODOS os slides do mesmo carrossel.

### Variação A — White Premium (60% dos posts)
- Branco `#FFFFFF` / `#FBF7F4` dominante absoluto
- Painel translúcido (glassmorphism) sobre foto para o texto
- Tipografia mix serif elegante + sans bold
- Foto emoldurada com cantos arredondados e borda branca
- Acento rosa sussurrado `#FCE4EC` apenas em detalhes mínimos
- **Mood:** editorial premium, etéreo, refinado

**Prompt-base (Variação A):**
```
pure white #FFFFFF dominant background airy editorial luxury, translucent frosted glass panel overlay holding text glassmorphism effect subtle blur, photograph framed with rounded corners thick white border premium magazine style, elegant serif typography combined with bold sans-serif headline soft black #1A1A1A, whispered pink #FCE4EC details barely visible, soft diffused natural lighting, refined sophisticated atmosphere, generous negative space, premium editorial feminine
```

### Variação B — Soft Pink Veil (30% dos posts)
- Rosa sussurrado `#FCE4EC` ou pétala `#F8D7DE` como véu suave (NUNCA saturado)
- Foto emoldurada em moldura branca arredondada
- Tipografia branca ou preta suave sobre o rosa lavado
- Composição equilibrada com bastante respiro
- **Mood:** feminino delicado, pétala, premium acessível

**Prompt-base (Variação B):**
```
soft whispered pink #FCE4EC veil background gentle wash desaturated, almost-white pink barely tinted, photograph framed with rounded white border centered, white or soft black typography elegant mix serif and bold sans-serif, generous breathing space, delicate feminine premium atmosphere, soft diffused lighting, editorial magazine quality, refined gentle sophistication, no saturation pop
```

### Variação C — Refined Accent (10% dos posts)
- Branco `#FFFFFF` como base
- Rosa intenso `#D87A9A` ou rosa antigo `#D4A5B5` em palavras-chave isoladas
- Dourado `#D4AF37` em ornamentos mínimos (logo, monograma, detalhe fino)
- Tipografia serif premium em destaque
- **Mood:** alta exclusividade, joalheria, sofisticação máxima

**Prompt-base (Variação C):**
```
pure white #FFFFFF background editorial luxury magazine, refined intense pink #D87A9A featured only on key words limited usage, soft gold #D4AF37 minimal ornamental details monogram or thin accent line, premium serif typography elegant pairing with bold sans-serif, sophisticated editorial composition, jewelry-magazine quality, exclusive luxurious atmosphere, polished refined femininity, generous negative space, soft diffused lighting
```

### Variação E — Silêncio Premium (Categoria 3) · 15% do feed · FECHADA 2026-05-19

Padrão **artístico sem texto** para quebrar o ritmo do feed. Atmosfera pura — a "página de respiro" entre conteúdos densos. **REGRA INVIOLÁVEL: sem texto, sem headline, sem CTA na imagem.**

**Referências de feed:** @aman · @cremedelamer · @augustinusbader · @byredo

**Duas técnicas oficiais (alternar):**

#### Técnica A — Editorial Still-Life Fotográfico
- Subjects: frasco de cristal apothecary, gota d'água, pétala em queda, seda creme, mármore Calacatta
- Luz: soft directional natural window light, 5200-5500K, sharp falloff
- Câmera: medium-format, 85-100mm f/2.8, depth of field rasa, slight film grain
- Mood: Aman resorts, La Mer, Augustinus Bader campaigns
- Paleta: cream, marble, transparent crystal, gold #D4AF37 mínimo

#### Técnica C — Macro Fotográfico
- Subjects: close abstrato de pele com gota d'água, linho com fio dourado, texturas íntimas
- Identidade visual: NÃO mostra rosto reconhecível (abstração)
- Câmera: macro 100mm f/2.8, tack-sharp em 1 elemento, resto em creamy bokeh
- Mood: Byredo, Aesop, editorial científico-belo
- Paleta: skin tones warm, ouro mínimo, linho

**Cadência:** uma A + uma C por mês alternadas. Nunca duas da mesma técnica em sequência no feed.

**Quando NÃO usar:**
- Posts com mensagem (vai pra Categoria 1 ou 2)
- Antes/depois (Categoria 1)
- Stories diários (overkill)

---

### Variação D — Skin Ritual Editorial (~10% dos posts — uso especial)
Padrão **artístico** para Reels capa, posts de impacto editorial e campanhas premium. Foco em **aparência de fotografia analógica de revista**, anti-look-de-IA. Usa avatar como **referência facial** (não image-to-image direto), recompondo a cena artisticamente.

| Camada | Direção |
|---|---|
| **Luz** | Janela única (chiaroscuro suave), 5500K com leve âmbar, hora dourada interna, leve haze fotográfico |
| **Pose** | Contemplativa, mão tocando o rosto/colo com naturalidade, olhar fora-câmera, perfil 3/4 — nunca câmera direta sorrindo |
| **Wardrobe** | Camisa branca de linho / slip champagne / robe seda creme / jaleco minimalista sem logo |
| **Set** | Eucalipto, peônia branca, pétalas de rosa, vidro com água, cortina de linho translúcida, espelho dourado discreto, parede limewash |
| **Câmera** | Medium-format (Hasselblad/Phase One), 85–100mm f/2.0–2.2, depth of field rasa, look analógico |
| **Color grade** | Dessaturado suave, tons cremes, soft warm, NUNCA saturação pop |
| **Pós-produção** | Grão sutil de filme analógico (Kodak Portra 400 vibe), micro contraste baixo |
| **Anti-IA explícito** | Sem simetria binária, sem skin "plastificada", sem olhos vidrados, sem mãos com dedos errados, sem fundo "renderizado", fios soltos de cabelo, poros visíveis, leve assimetria orgânica |

**Variações temáticas:**
- 🌿 **Botânica calma** — eucalipto, água, peônia, mood Kinfolk/Cereal
- 🪞 **Diante do espelho** — reflexo, gesto introspectivo, espelho dourado
- 📖 **Estudo silencioso** — livro técnico aberto, jaleco, mão sobre página
- 🤍 **Linho e luz** — cortina, sombra suave, contraluz Helmut-Newton-meets-Cereal

**Quando usar:**
- Reels capa de alto impacto
- Posts âncora do feed (1 por mês)
- Campanhas pagas premium (Meta Ads — públicos qualificados)
- Lançamento de protocolo novo

**Quando NÃO usar:**
- Carrosséis educativos (usar Variação A)
- Posts de antes/depois ou bastidor real (usar foto real)
- Stories diários (overkill)

**Trecho técnico para incorporar no prompt:**
```
photographic realism, real skin texture with visible pores and subtle fine lines, single loose strand of hair near temple, natural light from a single window casting soft directional shadow, subtle film grain like Kodak Portra 400, medium-format depth of field (Hasselblad 85mm f/2.0 look), slightly desaturated cream-and-white tones, editorial magazine aesthetic, NOT digital art, NOT AI-generated look
```

---

## DNA Visual Base (sempre no início de qualquer prompt)

```
white dominant premium aesthetic, elegant translucent glassmorphism layers, soft whispered pink accents, refined editorial sophistication, breathing negative space, delicate airy shadows, premium magazine quality, frosted glass overlays, gentle rose blush touches, polished feminine luxury, silk-soft contrast, controlled vibrancy quiet elegance, photo framed with rounded corners white border, soft diffused natural lighting
```

---

## Transparências e Glassmorphism (assinatura visual)

- **Painel sobre foto:** retângulo branco com 70–85% opacidade, leve blur do fundo (frosted glass), cantos arredondados (radius médio/grande), sombra muito suave
- **Texto sobre foto:** sempre com véu translúcido por trás para legibilidade
- **Bordas arredondadas:** fotos em molduras com cantos arredondados (border-radius generoso) é padrão
- **Stacking de camadas:** sensação de papel/vidro/foto empilhados, como em revista premium

**Termos para usar nos prompts:**
```
frosted glass panel, translucent overlay, glassmorphism effect, semi-transparent white card, subtle backdrop blur, layered composition, rounded corner photo frame, thick white border, soft drop shadow
```

---

## Negative Prompt padrão

```
oversaturated, harsh contrast, neon colors, aggressive pop, saturated pink dominant, heavy pink background, opaque pink walls, hot pink, magenta, fuchsia, cluttered, busy, chaotic, muddy colors, washed out badly, dull, flat boring, low quality, blurry photo, soft focus errors, poor quality, pixelated, noisy, grainy, illegible text, poor typography, unreadable font, cheap looking, amateur, unprofessional, messy composition, unbalanced, distracting elements, watermark, signature, logo overlay, dark moody background, gothic, dramatic shadows, cold blue tones
```

---

## Especificações por formato

| Formato | Ratio | Composição |
|---------|-------|------------|
| Instagram Feed | 4:5 | Editorial centrada com painel translúcido OU foto emoldurada |
| Instagram Stories | 9:16 | Vertical centered, espaço negativo amplo |
| Facebook Post | 1.91:1 | Horizontal equilibrada com camadas |
| Carrossel Instagram | 4:5 | **MESMA variação todos slides**, seed sequencial (12345, 12346...) |

---

## Workflow ao gerar imagens

1. Definir a variação (A/B/C) respeitando distribuição **60/30/10**
2. Documentar no início do arquivo: `VARIAÇÃO APLICADA: X | MODELO: nano-banana-2`
3. Montar prompt na ordem:
   - DNA Base
   - Variação selecionada (prompt-base correspondente)
   - Paleta hierarquizada (branco dominante)
   - Transparências/glassmorphism
   - Foto emoldurada (quando aplicável)
   - Textos integrados com tipografia detalhada
4. Adicionar negative prompt padrão
5. **Modelo:** **`gemini-3-pro-image-preview`** (nano-banana-pro) via Google AI Studio direto — SDK `@google/genai`, chave `GOOGLE_AI_API_KEY`
6. **Regra crítica de identidade — SEMPRE i2i com a Dra. Camila:** qualquer imagem que envolva o rosto/figura da Dra. Camila usa OBRIGATORIAMENTE image-to-image com fotos de `fotos_avatar/`. Generation pura NUNCA é aceita para a Dra. (alucina pessoa diferente). Modo recomendado: **"ref"** — passar **2 fotos** da pasta como `inlineData` + linguagem *"The reference photographs above are ONLY for facial identity — preserve her exact face and recognizable likeness. RECOMPOSE the scene completely as a brand-new editorial photograph."* O modo edit puro (1 foto + "edit this photograph") **NÃO funciona bem** — gera versão deformada.
7. Para Variação D (Skin Ritual): seguir regra 6 + prompt artístico detalhado com seções SCENE / WARDROBE / ENVIRONMENT / LIGHT / CAMERA / COMPOSITION / MOOD (ver `scripts/teste_camila_4_imagens.mjs` como gabarito).
8. **Regra crítica de texto integrado:** todos os textos em português precisam estar 100% corretos — acentos (á, ã, ç, é, ê, í, ó, ô, õ, ú), sem palavras inventadas, sem letras repetidas (ex: "corcrendo"), sem palavras quebradas (ex: "in-inverno"), sem texto truncado. Numerações ("01/07") devem aparecer UMA ÚNICA vez no canto, NUNCA dentro do painel translúcido.
9. **QA visual obrigatório antes de entregar:** depois de gerar, RODAR varredura automática via Gemini multimodal (ver `scripts/lib/qa_visual.mjs`) que detecta: erros de texto, repetições de numeração, anatomia/poses inadequadas, elementos fora do contexto premium. Se falhar, regerar com seed nova (até 2 tentativas).
10. **Nomenclatura padrão dos arquivos (sem versionamento no nome):** o nome final do arquivo segue `AAAA-MM-DD-{post|capa-reel|carrossel}-<tema>[-NN-<descricao>].png`. Para carrosséis, `NN` é zero-padded a partir de `01`. **NUNCA usar sufixo `-v1` / `-v2` / `-v3` no nome final** — sempre sobrescrever quando regerar. Padrão canonical em `_PADRAO-ORGANIZACAO.md` no Drive (Imagens e vídeos — nomenclatura padrão).

---

## Negativos visuais (o que NUNCA aparece)
- Fundos rosa saturado, magenta, fúcsia, neon
- Iluminação dramática, sombras pesadas, gótico
- Tons frios/azulados
- Composições caóticas, "stock photo cliché"
- Texto soltinho, baixa legibilidade
- Watermark, logo de banco de imagem
- Rostos identificáveis sem consentimento (em prints de antes/depois usar sempre referência aprovada da clínica)
- Elementos cafonas (frascos genéricos, hibiscos clip-art, brilho neon)

---

## Templates aprovados
- Carrossel padrão: _a desenvolver_
- Reel cover: _a desenvolver_
- Story enquete: _a desenvolver_

> Conforme forem aprovados pela Dra. Camila, salvar em `assets/templates/`.

---

## Referências visuais
- **Mood board:** `assets/moodboard/` (a ser populado)
- **Contas de referência (visual apenas):** _a coletar com a cliente_
