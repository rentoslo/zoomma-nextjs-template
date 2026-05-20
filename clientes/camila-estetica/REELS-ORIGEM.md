# Reels — Origem da produção (Veo aqui vs Gravado pela clínica)

> **Regra-mãe da Camila Estética:** vídeos gerados via Veo 3 Fast neste workspace cobrem **apenas** Reels no esquema **silêncio premium / atmosférico / sem pessoa identificável**. Tudo que envolve a Dra. Camila ou clientes reais é **gravado pela clínica externamente**.
>
> Atualizado em 2026-05-20. Esta regra vale para TODA a campanha SKIN WINTER (Maio+Junho+Julho 2026) e qualquer Reel futuro.

---

## Critério de decisão

| Característica do Reel | Origem | Por quê |
|---|---|---|
| **Categoria 3 · Variação E** — silêncio premium, still-life, abstrato (frasco, gota, mármore, linho, pétala, textura, mão sem rosto) | 🤖 **Veo 3 Fast aqui** | Veo é ótimo em atmosfera abstrata; sem risco de "cara de IA" porque não há rosto |
| **Categoria 1 · Variação D** — Skin Ritual Editorial com a Dra. Camila falando, contemplando, manifesto | 🎥 **Camila grava** | Identidade da Dra. é insubstituível; presença física vale mais que qualquer IA |
| **Categoria 1** — prova social, antes/depois, cliente real (com autorização) | 🎥 **Camila grava** | Verdade visual é o ativo; IA quebraria a confiança |
| **Categoria 1** — bastidor real (equipamento, sala, mãos da Dra. trabalhando) | 🎥 **Camila grava** | Bastidor real é o pilar 5; IA destruiria a autenticidade |
| **Categoria 2** — texto + ilustração (raramente Reel — geralmente carrossel) | 🤖 Veo (se houver) ou produção externa | Caso raro; avaliar por peça |

---

## Sinais práticos para decidir rápido

**🤖 Pode ser Veo aqui se:**
- Não tem rosto reconhecível
- Não tem fala / voz / narração da Dra.
- É composto por elementos atmosféricos (objetos, texturas, luz, ambiente)
- A mensagem é **plantar emoção**, não **transmitir autoridade técnica**
- Cumpre referência Aman/Kinfolk/Augustinus Bader/Byredo

**🎥 É da Camila se:**
- Aparece o rosto da Dra. ou de cliente
- Tem fala / narração / manifesto
- Mostra procedimento real ou bastidor da clínica
- A autoridade técnica da Dra. é o conteúdo
- A entrega depende da emoção/presença humana

---

## Mapeamento da Campanha SKIN WINTER (10 Reels totais)

> Atualizar esta tabela conforme `02-REELS-ROTEIROS.md` for criado.

### Fase 0 — Maio (2 Reels + 2 capas)

| ID | Data | Conteúdo | Cat | Variação | Origem | Status |
|---|---|---|---|---|---|---|
| **R0.1** vídeo | 22/05 (Sex) | "Em breve" — silêncio premium (frasco apothecary, gota na pétala, cortina de linho) | 3 | E | 🤖 **Veo** | ✅ Gerado 2026-05-20 · [arquivo](file:///G:/Meu%20Drive/CLIENTES/CAMILA_ESTETICA/AGENDA%20EDITORIAL/2026-mai-jul_skin-winter/03_VIDEOS/2026-05_maio/2026-05-22-reel-silencioso-premium-v1.mp4) |
| **R0.1** capa | 22/05 (Sex) | Capa estática silêncio premium (still-life) | 3 | E | 🤖 **Nano Banana Pro** | ✅ Gerada 2026-05-20 em `02_IMAGENS/2026-05_maio/2026-05-22-capa-reel-silencioso-premium-v1.png` |
| **R0.2** vídeo | 27/05 (Qua) | Dra. Camila manifesto: "Existem dois tipos de cliente que entram aqui" | 1 i2i | D | 🎥 **Camila grava** | ⏳ Aguardando filmagem com a Dra. |
| **R0.2** capa | 27/05 (Qua) | Capa estática Dra. + tipografia "Existem dois tipos de cliente" | 1 i2i | D | 🤖 **Nano Banana Pro (i2i)** | ✅ Gerada 2026-05-20 em `02_IMAGENS/2026-05_maio/2026-05-27-capa-reel-dra-manifesto-v1.png` |

> **Nota sobre capas:** os Reels precisam de capa estática que aparece no grid do Instagram. As capas são geradas aqui (`nano-banana-pro`) — diferente do vídeo, que pode ou não ser Veo. O critério Veo-vs-Camila aplica-se ao **vídeo**, não à capa.

### Fase 1-4 — Junho + Julho (8 Reels — roteiros pendentes)

> Quando `02-REELS-ROTEIROS.md` for criado, classificar CADA UM aqui. Estimativa baseada na distribuição (Cat 1: 40% / Cat 2: 45% / Cat 3: 15%):

| Estimativa | Quantidade | Origem |
|---|---|---|
| Cat 3 · Variação E (silêncio premium) | ~1-2 Reels | 🤖 Veo |
| Cat 1 · Variação D (Dra. manifesto / autoridade) | ~3-4 Reels | 🎥 Camila |
| Cat 1 (prova social / antes-depois) | ~2-3 Reels | 🎥 Camila |
| Cat 1 (bastidor real) | ~1-2 Reels | 🎥 Camila |

**Conclusão estimada:** dos 8 Reels jun+jul, provavelmente **6-7 são gravados pela Camila** e **1-2 são gerados aqui**. Confirmar caso a caso quando o roteiro chegar.

---

## Workflow operacional

### Quando Renato pedir "gera o Reel do dia X"

1. Abrir a agenda do mês correspondente
2. Localizar o Reel na tabela
3. Conferir nesta tabela (`REELS-ORIGEM.md`) qual é a origem
4. Se 🤖 Veo → invocar `veo3-fast-google-api` e gerar
5. Se 🎥 Camila → **NÃO gerar**. Em vez disso:
   - Confirmar com Renato que é Reel pra ser gravado pela clínica
   - Entregar **briefing de filmagem** (roteiro, ângulos, wardrobe, luz, props) — não vídeo
   - Salvar briefing em `clientes/camila-estetica/criativos/videos/_briefings_filmagem/AAAA-MM-DD-reel-X-briefing.md`

### Briefing de filmagem inclui

- Roteiro/fala (se houver)
- Wardrobe da Dra. (camisa de linho branca, slip champagne, jaleco, etc.)
- Set (eucalipto, peônia, mármore, cortina, espelho, etc.)
- Ângulos de câmera (3/4, perfil, frontal, close mãos)
- Iluminação (janela única, hora dourada, chiaroscuro suave)
- Tipo de plano (peito-para-cima, mãos, detalhe)
- Mood reference (foto/vídeo de inspiração)
- Duração esperada (8-30s para Reel)

---

## Casos limítrofes / dúvida

Se houver dúvida sobre se um Reel é Veo ou gravado, **PERGUNTAR ao Renato antes** de gerar/preparar briefing. Casos típicos de dúvida:

- Reel que mostra **mãos da Dra. trabalhando** sem aparecer o rosto → na dúvida, **gravar real** (bastidor autêntico é precioso)
- Reel **abstrato com referência a um produto real da clínica** → **gravar real** se o produto é específico (paciente reconhece); **Veo** se é "frasco genérico de cristal"
- Reel **com música/voz pulsando** estilo TikTok → **gravar real** (Veo não tem timing musical preciso)

---

## Política contra "alucinação visual" do Veo

Mesmo em Reels claramente Veo (Cat 3 + Variação E), **NUNCA peça ao Veo para gerar**:

- Logo da Camila Estética (alucina)
- Rosto da Dra. (alucina identidade)
- Texto na tela (alucina ortografia portuguesa)
- Embalagem específica do produto que a clínica usa
- Aparelho/equipamento específico da clínica

Se o Reel precisa de algum desses elementos, ele **VIRA Reel gravado pela clínica** automaticamente.
