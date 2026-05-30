// =====================================================
// DELAMORE — JUNHO 2026 · 8 ARTES ESTÁTICAS (padrão v3)
// =====================================================
// Modelo: gemini-3-pro-image-preview (Google AI direto via GOOGLE_AI_API_KEY)
// Aspect ratio: 4:5 (feed Instagram)
//
// PADRÃO v3 (2026-05-29):
//   - Cada post numa subpasta própria: entregaveis/NN_AAAA-MM-DD_post_tema/
//     dentro vai imagem.png + legenda.txt + prompt.txt
//   - CSV de publicação no raiz da pasta do mês: agenda-publicacao-delamore-junho-2026.csv
//     1 linha por post (inclui também os 12 Reels, com imagem_path vazio)
//
// Saída (Fase 2 da migração Drive → Supabase, 2026-05-30):
//   Local:  c:\github\produtor_agendas_editoriais\clientes\delamore\agendas\2026-06\
//   Distribuição ao cliente: link público /a/<token> via `npm run agenda:publicar`
//
// Execução:
//   cd scripts && node gerar_delamore_junho.mjs
// =====================================================

import { GoogleGenAI } from "@google/genai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import { gerarAgendaCsv } from "./lib/agenda_csv.mjs";
import { gerarHtmlAgenda } from "./lib/md_to_html_agenda.mjs";
import { gerarPdfDoHtml } from "./lib/html_to_pdf.mjs";

loadEnv({ path: path.join(import.meta.dirname, "..", ".env") });

const API_KEY = process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error("ERRO: GOOGLE_AI_API_KEY não encontrada em .env");
  process.exit(1);
}

const MODEL = "gemini-3-pro-image-preview";
const ASPECT_RATIO = "4:5";
const PARALLEL_BATCH_SIZE = 4;

// Filtro opcional via env var: SOMENTE_IDS="01,03,06,12" regera só esses posts.
// Vazio = roda todos os que têm gerar_imagem=true.
const SOMENTE_IDS = (process.env.SOMENTE_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const REPO_ROOT = path.join(import.meta.dirname, "..");
const LOCAL_AGENDA_DIR = path.join(
  REPO_ROOT,
  "clientes",
  "delamore",
  "agendas",
  "2026-06"
);
// =====================================================
// IDENTIDADE DELAMORE — trechos reutilizáveis
// =====================================================

const PROMPT_BASE_DELAMORE = `soft studio lighting, warm rosy-beige tones, intimate apparel product photography for Brazilian market, clean white or light cream background, feminine and elegant mood, light pink and blush color palette (#F5EDE8 cream and #C84B7A rosy berry as brand colors), no heavy shadows, natural fabric texture visible, shot on 85mm lens at f/2.8, professional fashion photography style, warm and accessible feel, NO explicit or suggestive poses, inspired by @hope.lingerie and @loungerie editorial aesthetic`;

const NEGATIVOS_UNIVERSAIS = `NO sexual or suggestive poses, NO bedroom intimate scenarios, NO distorted faces or hands, NO AI artifacts, NO heavy makeup, NO luxury inaccessible mood, NO English text overlay, NO stock-photo clichés (jumping, exaggerated smiles), NO single body type only, include body diversity, NO logos of other brands, NO crowded background`;

const TYPO_RULES_PT = `Typography must be PERFECTLY legible with all Portuguese accents intact (á, ã, ç, é, ê, í, ó, ô, õ, ú). Crisp clean letter shapes. NO broken letters, NO doubled letters, NO hyphen-split words. EXACT spelling required as specified. NEVER duplicate or repeat any line.`;

// =====================================================
// CALENDÁRIO COMPLETO JUNHO 2026 (20 posts)
// 8 posts estáticos (geram imagem) + 12 Reels (sem imagem, só CSV)
// =====================================================

const ENDERECOS = `Encontre a Delamore perto de você:
🏪 Bauru: Rua Aparecida, 6-63 | (14) 3232-8626
🏪 São José do Rio Preto: Av. Constituição, 1450 | (17) 3304-7463 | (17) 99788-8590
🏪 Americana: Av. Abdo Najar, 1451 | (19) 3013-4625 | (19) 99149-1169
🏪 Jandaia: Rua Senador Souza Naves, 689 | (43) 99978-2536
🏪 Araçatuba: Rua Marechal Deodoro, Multishop BOX-A | (18) 99745-7822`;

const calendario = [
  // ===== POST 01 · 01/jun (Seg) · Bastidores fábrica · ARTE ESTÁTICA =====
  {
    post_id: "01",
    data: "2026-06-01",
    dia_semana: "seg",
    tipo: "post",
    pilar: "P5 Bastidores",
    linha_produto: "",
    tema: "bastidores-fabrica",
    seed: 60601,
    gerar_imagem: true,
    prompt: `Editorial photograph of the interior of a small Brazilian lingerie factory in the morning, occupying the LOWER 2/3 of the 4:5 vertical composition. Soft natural light coming through large arched windows, rows of clothing racks filled with delicate intimate apparel in soft pink, blush, and cream tones, hanging neatly on wooden hangers, no people visible, clean concrete floor, warm and inviting industrial atmosphere, sense of craftsmanship and care, shallow depth of field on the front rack, 85mm lens at f/2.8, warm cinematic color grading.

The UPPER 1/3 of the image is a clean soft cream area (#FBF7F4, slightly subtle linen texture) reserved for typography. ON THIS UPPER AREA, integrated as elegant editorial design, render EXACTLY this two-line headline in perfect Portuguese, centered horizontally, in sans-serif rounded font (Poppins SemiBold) in dark rosy berry (#8B2252):
Line 1: "Junho é o mês que mais movimenta lingerie no Brasil."
Line 2 (slightly smaller, italic): "E tudo começa aqui dentro."
A thin horizontal gold accent line (#C84B7A, 80px wide) sits between the headline and the photograph below. Footer "@delamore.oficial" in tiny rose berry text at the very bottom of the photo area. The text MUST be perfectly legible, with all Portuguese accents intact (é, ã, ç), no broken letters, no doubled letters, no duplicated lines.

${PROMPT_BASE_DELAMORE}. ${TYPO_RULES_PT} NEGATIVE: ${NEGATIVOS_UNIVERSAIS}, no English text, no extra text beyond what is specified.`,
    legenda: `Junho é o mês que mais movimenta lingerie no Brasil. E tudo começa aqui dentro.

A fábrica liga cedo, as máquinas começam a girar, as primeiras peças do dia descem da linha.

Cada uma dessas peças vai sair daqui pra mão de uma revendedora. E da mão dela, pra cliente que ela conquistou.

Nenhum outro mês movimenta tanta lingerie quanto junho. Dia dos Namorados, presente, autopresente, casamento de inverno. Sua cliente está procurando agora.

A pergunta é simples: quem vai vender pra ela?

👉 Se você quer ser a Delamore da sua cidade, comenta REVENDA aqui embaixo. A gente te chama no WhatsApp ainda hoje.

${ENDERECOS}`,
    hashtags: "#delamore #fabricadelingerie #revendedoraDelamore #rendaextra #lingerieataacado #trabalheemcasa #empreendedorismofeminino #seuprópriochefe",
  },

  // ===== POST 02 · 02/jun (Ter) · POV revenda · REEL =====
  {
    post_id: "02",
    data: "2026-06-02",
    dia_semana: "ter",
    tipo: "reel",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "pov-revenda",
    gerar_imagem: false,
    legenda: `Lingerie não é tendência. Lingerie é necessidade.

Toda mulher compra. Toda mulher repõe. E quase ninguém pensa em quem está vendendo.

E se quem estivesse vendendo fosse você?

👉 Comenta QUERO aqui embaixo. A gente te explica como começar como revendedora Delamore ainda hoje.

${ENDERECOS}`,
    hashtags: "#revendedora #revendedoraDelamore #queromudardevida #rendaextra #empreendedorismofeminino #delamore #lingerieataacado #trabalheemcasa",
  },

  // ===== POST 03 · 03/jun (Qua) · Conjunto com renda · ARTE ESTÁTICA =====
  {
    post_id: "03",
    data: "2026-06-03",
    dia_semana: "qua",
    tipo: "post",
    pilar: "P2 Produto",
    linha_produto: "Conjunto com renda",
    tema: "conjunto-renda",
    seed: 60603,
    gerar_imagem: true,
    prompt: `Editorial fashion photography of a Brazilian woman in her early 30s wearing an elegant lace lingerie set in soft rosy beige tone, standing in a sun-lit room with sheer curtains in the background, pose is graceful and composed (NOT seductive), arms relaxed, slight side angle, looking softly to the side away from camera, natural body type with realistic proportions, diverse representation (medium skin tone, natural hair), warm golden hour light from window left side, focus on lace texture and fabric drape, full body shot from knees up, minimal cream wall background, shot on 85mm lens at f/2.8.

ON THE LOWER LEFT corner of the 4:5 frame, integrated as elegant editorial typography over a discrete translucent rosy berry (#C84B7A) panel with rounded corners (panel about 45% width × 18% height of the image), render EXACTLY this two-line text in perfect Portuguese, in soft cream-white (#F5EDE8):
Line 1 (bold sans-serif Poppins SemiBold): "Conjunto com renda"
Line 2 (lighter italic serif, smaller): "A peça mais pedida do Namorados"
The text MUST be perfectly legible with all accents intact (peça), no broken letters, no doubled letters. Footer "@delamore.oficial" in tiny rose berry text discreetly placed.

${PROMPT_BASE_DELAMORE}. ${TYPO_RULES_PT} NEGATIVE: ${NEGATIVOS_UNIVERSAIS}, no English text, no extra text beyond what is specified.`,
    legenda: `Tem uma peça que toda revendedora Delamore aprende rápido: o conjunto com renda é a primeira a sair quando junho começa.

Não é por acaso.

A renda valoriza qualquer corpo. Acolhe sem apertar. Ensaia romance sem precisar gritar.

Sua cliente vê uma vez, salva no celular. Vê duas, manda mensagem pedindo o tamanho.

Quer começar a vender essa peça antes do dia 12?

👉 Comenta RENDA aqui embaixo. A gente te conta como entrar no atacado Delamore.

${ENDERECOS}`,
    hashtags: "#conjuntocomrenda #lingerieDelamore #revendedora #diadosnamorados #rendaextra #atacadodelingerie #modaintima #empreendedorismofeminino",
  },

  // ===== POST 04 · 04/jun (Qui) · 3 hábitos · REEL =====
  {
    post_id: "04",
    data: "2026-06-04",
    dia_semana: "qui",
    tipo: "reel",
    pilar: "P4 Empoderamento",
    linha_produto: "",
    tema: "3-habitos-vendedoras",
    gerar_imagem: false,
    legenda: `Você não precisa ter loja. Você precisa ter método.

As revendedoras que mais faturam com a Delamore fazem 3 coisas iguais no WhatsApp:

1. Postam a peça nova no mesmo dia que ela chega
2. Chamam a cliente pelo nome (sempre)
3. Mostram a peça num manequim ou cabide, nunca solta

Parece simples? É. Mas pouca gente faz com constância.

E é exatamente aí que está a diferença.

👉 Quer aprender o passo a passo de como começar do jeito certo? Comenta QUERO aqui embaixo. A gente te chama no WhatsApp.

${ENDERECOS}`,
    hashtags: "#revendedora #vendapelowhatsapp #empreendedorismofeminino #rendaextra #delamore #dicasdevenda #trabalheemcasa #lingerieataacado",
  },

  // ===== POST 05 · 05/jun (Sex) · Junho mês pico · REEL =====
  {
    post_id: "05",
    data: "2026-06-05",
    dia_semana: "sex",
    tipo: "reel",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "junho-mes-pico",
    gerar_imagem: false,
    legenda: `Junho é o mês que mais vende lingerie no Brasil.

Dia dos Namorados, presentes, autopresentes, casamentos de inverno, lua de mel. Tudo conspira pra essa data ser o pico do semestre.

E a pergunta que sobra é só uma:

Você quer estar vendendo esse mês, ou só assistindo ele passar?

👉 Comenta REVENDA aqui embaixo. Eu te chamo no WhatsApp ainda hoje pra te explicar como começar.

${ENDERECOS}`,
    hashtags: "#diadosnamorados #revendedora #revendaDelamore #rendaextra #queromudardevida #lingerieataacado #empreendedorismofeminino #fabricadelingerie",
  },

  // ===== POST 06 · 08/jun (Seg) · Baby doll · ARTE ESTÁTICA =====
  {
    post_id: "06",
    data: "2026-06-08",
    dia_semana: "seg",
    tipo: "post",
    pilar: "P2 Produto",
    linha_produto: "Baby doll",
    tema: "baby-doll",
    seed: 60608,
    gerar_imagem: true,
    prompt: `Editorial fashion photography of a Brazilian woman in her late 20s wearing a soft chiffon baby doll lingerie in blush pink tone, sitting gracefully on a cream upholstered bench, side profile pose with one hand resting on the bench, looking down softly with relaxed expression, romantic and feminine mood (NOT seductive), natural body type, diverse representation (light olive skin, brown wavy hair), soft window light from the left, plain cream wall background, focus on the flowy movement of the chiffon fabric, full body shot, shot on 85mm lens at f/2.8.

ON THE LOWER LEFT corner of the 4:5 frame, integrated as elegant editorial typography over a discrete translucent rosy berry (#C84B7A) panel with rounded corners (panel about 40% width × 18% height of the image), render EXACTLY this two-line text in perfect Portuguese, in soft cream-white (#F5EDE8):
Line 1 (bold sans-serif Poppins SemiBold): "Baby doll"
Line 2 (lighter italic serif, smaller): "A peça do presente"
The text MUST be perfectly legible with all accents intact (peça), no broken letters, no doubled letters. Footer "@delamore.oficial" in tiny rose berry text discreetly placed.

${PROMPT_BASE_DELAMORE}. ${TYPO_RULES_PT} NEGATIVE: ${NEGATIVOS_UNIVERSAIS}, no English text, no extra text beyond what is specified.`,
    legenda: `Tem uma peça que toda mulher quer ganhar e raramente compra pra si.

É o baby doll.

Por isso ele é a peça mais presenteada em junho. E por isso ele é a peça que toda revendedora precisa ter na grade nesse mês.

Cliente que recebeu um, volta querendo o segundo. Aniversário de namoro, lua de mel, fim de semana romântico. Sempre tem ocasião.

Quem vende baby doll, vende repetido.

👉 Quer saber quais baby dolls Delamore mais saem agora? Comenta BABY aqui embaixo. A gente te mostra no WhatsApp.

${ENDERECOS}`,
    hashtags: "#babydoll #lingerieromantica #diadosnamorados #revendedora #delamore #lingerieataacado #presenteperfeito #modaintima",
  },

  // ===== POST 07 · 09/jun (Ter) · 3 perfis cliente · REEL =====
  {
    post_id: "07",
    data: "2026-06-09",
    dia_semana: "ter",
    tipo: "reel",
    pilar: "P2 Curadoria",
    linha_produto: "3 linhas",
    tema: "3-perfis-cliente",
    gerar_imagem: false,
    legenda: `Tem 3 perfis de cliente que toda revendedora Delamore vai atender esse Namorados:

🌸 A que quer arrasar: conjunto com renda
🌸 A que quer conforto com graça: cropped
🌸 A romântica que quer surpreender: baby doll

Se você tem essas 3 peças na sua grade, você atende quase qualquer pedido que chegar.

Se não tem, você perde venda. Simples assim.

👉 Quer o catálogo completo das 3 linhas? Comenta CATÁLOGO aqui embaixo. A gente te manda no WhatsApp.

${ENDERECOS}`,
    hashtags: "#diadosnamorados #revendedora #conjuntocomrenda #cropped #babydoll #delamore #lingerieataacado #catalogolingerie",
  },

  // ===== POST 08 · 10/jun (Qua) · 5 motivos · ARTE TIPOGRÁFICA =====
  {
    post_id: "08",
    data: "2026-06-10",
    dia_semana: "qua",
    tipo: "post",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "5-motivos-revendedora",
    seed: 60610,
    gerar_imagem: true,
    prompt: `Typography-first social media post design, 4:5 vertical format, soft cream background (#F5EDE8) with subtle linen texture, main title at top centered "5 MOTIVOS para começar como revendedora nesse Dia dos Namorados:" in rosy berry color (#C84B7A), sans-serif rounded font similar to Poppins SemiBold, followed by a numbered list of EXACTLY 5 short lines in dark grey (#2C2C2C) with small rose berry number markers, generous spacing between lines, plenty of breathing room. EXACT lines (in this order, in perfect Portuguese):
1. O pico de vendas é agora, sua cliente está procurando hoje
2. Coleção de Namorados já pronta, é só repassar
3. Investimento inicial baixo, giro rápido com a data
4. A fábrica te ajuda desde o primeiro pedido, você não fica sozinha
5. Cada cliente desse mês vira venda recorrente o ano inteiro
Footer shows "@delamore.oficial" centered in small rose berry text. A thin horizontal divider line in soft pink between title and list. Professional editorial design language, brand consistency with Delamore aesthetic. NO photographs of people, NO complex graphics, NO English text. ${TYPO_RULES_PT}`,
    legenda: `Dia dos Namorados é a data que mais movimenta lingerie no Brasil. E ainda dá tempo de você estar do lado de quem vende.

5 motivos pra começar AGORA como revendedora Delamore:

1. O pico de vendas é agora, sua cliente está procurando hoje
2. Coleção de Namorados já pronta, é só repassar
3. Investimento inicial baixo, giro rápido com a data
4. A fábrica te ajuda desde o primeiro pedido, você não fica sozinha
5. Cada cliente desse mês vira venda recorrente o ano inteiro

Não é "ano que vem". É agora. Hoje. Esse mês.

👉 Comenta COMEÇAR aqui embaixo. Eu te chamo no WhatsApp pra te explicar tudo.

${ENDERECOS}`,
    hashtags: "#revendedora #revendedoraDelamore #empreendedorismofeminino #rendaextra #queromudardevida #lingerieataacado #trabalheemcasa #diadosnamorados",
  },

  // ===== POST 09 · 11/jun (Qui) · Conjunto renda Namorados · REEL =====
  {
    post_id: "09",
    data: "2026-06-11",
    dia_semana: "qui",
    tipo: "reel",
    pilar: "P2 Produto",
    linha_produto: "Conjunto com renda",
    tema: "conjunto-renda-namorados",
    gerar_imagem: false,
    legenda: `A peça que mais sai pra Namorados tem nome: conjunto com renda.

Em junho, ela some primeiro da grade. Em julho, ela continua saindo. Em agosto, vira reposição.

Cliente vê uma vez e salva no celular. Vê duas e manda mensagem pedindo o tamanho.

Se você quer começar a vender esse mês, é por aqui que começa.

👉 Comenta RENDA aqui embaixo. Eu te falo como pegar essa peça no atacado Delamore.

${ENDERECOS}`,
    hashtags: "#conjuntocomrenda #lingerieDelamore #diadosnamorados #revendedora #rendaextra #atacadodelingerie #modaintima #lingerie",
  },

  // ===== POST 10 · 12/jun (Sex) · 💕 Dia dos Namorados · REEL =====
  {
    post_id: "10",
    data: "2026-06-12",
    dia_semana: "sex",
    tipo: "reel",
    pilar: "P1+P2 transversal",
    linha_produto: "",
    tema: "hoje-e-o-dia",
    gerar_imagem: false,
    legenda: `12 de junho. Hoje.

Suas clientes estão comprando lingerie agora. Nesse exato momento.

A pergunta é só uma: elas estão comprando de quem?

Junho 2026 já é hoje. Mas julho começa amanhã.

E em julho ainda dá tempo de ser você.

👉 Comenta JULHO aqui embaixo. Amanhã a gente começa a sua história como revendedora Delamore.

${ENDERECOS}`,
    hashtags: "#diadosnamorados #revendedora #revendaDelamore #rendaextra #queromudardevida #empreendedorismofeminino #lingerie #julho2026",
  },

  // ===== POST 11 · 15/jun (Seg) · Tour fábrica · REEL =====
  {
    post_id: "11",
    data: "2026-06-15",
    dia_semana: "seg",
    tipo: "reel",
    pilar: "P5 Bastidores",
    linha_produto: "",
    tema: "como-uma-peca-nasce",
    gerar_imagem: false,
    legenda: `Tem gente que vende lingerie de revenda de revenda de revenda.

Aqui não.

Toda peça Delamore nasce aqui dentro. Tecido escolhido por nós. Corte feito por mulheres que trabalham com a gente há anos. Costura supervisionada peça por peça. Detalhe aplicado na mão. Embalagem pronta pra sua revendedora.

Por isso a gente vende direto da fábrica. Sem intermediário. Sem aumentar preço.

Quem ganha com isso é a revendedora.

👉 Quer ser parte dessa história? Comenta FÁBRICA aqui embaixo. Eu te chamo no WhatsApp pra te explicar o kit de revendedora.

${ENDERECOS}`,
    hashtags: "#fabricadelingerie #delamore #revendedora #diretodaFabrica #lingerieataacado #empreendedorismofeminino #bastidores #revendalingerie",
  },

  // ===== POST 12 · 16/jun (Ter) · Cropped · ARTE ESTÁTICA =====
  {
    post_id: "12",
    data: "2026-06-16",
    dia_semana: "ter",
    tipo: "post",
    pilar: "P2 Produto",
    linha_produto: "Cropped",
    tema: "cropped",
    seed: 60616,
    gerar_imagem: true,
    prompt: `Editorial fashion photography of a Brazilian woman in her mid 20s wearing a soft cotton-modal cropped top in warm blush nude tone, standing in a sun-lit living room with cream walls and a wicker chair in the background, comfortable everyday pose with one hand in her hair, casual and natural mood (NOT seductive), paired with high-waist beige loungewear pants (visible from waist down), natural body type, diverse representation (medium-dark skin tone, curly hair pulled back), soft warm window light, focus on the texture of the cropped fabric and the comfort feel, full body shot from thighs up, lifestyle context (not studio), shot on 85mm lens at f/2.8.

ON THE LOWER LEFT corner of the 4:5 frame, integrated as elegant editorial typography over a discrete translucent rosy berry (#C84B7A) panel with rounded corners (panel about 35% width × 18% height of the image), render EXACTLY this two-line text in perfect Portuguese, in soft cream-white (#F5EDE8):
Line 1 (bold sans-serif Poppins SemiBold): "Cropped"
Line 2 (lighter italic serif, smaller): "1 peça, 3 usos"
The text MUST be perfectly legible with all accents intact (peça), no broken letters, no doubled letters. Footer "@delamore.oficial" in tiny rose berry text discreetly placed.

${PROMPT_BASE_DELAMORE}. ${TYPO_RULES_PT} NEGATIVE: ${NEGATIVOS_UNIVERSAIS}, no English text, no extra text beyond what is specified.`,
    legenda: `A peça que toda revendedora ama vender é a que a cliente compra de novo. E o cropped Delamore é exatamente isso.

Sua cliente compra um, descobre que serve pra 3 coisas:

🌸 Por baixo do blazer, no trabalho
🌸 Com legging, em casa
🌸 Com a calcinha da grade, na intimidade

E aí vem a parte boa: ela volta pra comprar de outra cor.

Cropped é peça-coringa. E peça-coringa é faturamento recorrente.

👉 Quer ver as cores que mais saem? Comenta CROPPED aqui embaixo. Eu te mando a grade no WhatsApp.

${ENDERECOS}`,
    hashtags: "#cropped #lingerieDelamore #revendedora #modaintima #atacadodelingerie #pecaversatil #conforto #empreendedorismofeminino",
  },

  // ===== POST 13 · 17/jun (Qua) · Amiga me chama · REEL =====
  {
    post_id: "13",
    data: "2026-06-17",
    dia_semana: "qua",
    tipo: "reel",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "amiga-me-chama",
    gerar_imagem: false,
    legenda: `Amiga.

Se você está cansada de esperar a oportunidade certa cair no colo, ela já caiu.

A Delamore é fábrica de lingerie há 30 anos. Tem 5 lojas, milhares de revendedoras pelo Brasil, kits que cabem em qualquer bolso. E está te chamando.

Me chama no direct. Hoje.

👉 Manda "amiga" pra gente no direct. Eu respondo cada uma pessoalmente.

${ENDERECOS}`,
    hashtags: "#revendedora #amigaempreendedora #rendaextra #delamore #queromudardevida #empreendedorismofeminino #lingerieataacado #trabalheemcasa",
  },

  // ===== POST 14 · 18/jun (Qui) · Coragem · ARTE TIPOGRÁFICA =====
  {
    post_id: "14",
    data: "2026-06-18",
    dia_semana: "qui",
    tipo: "post",
    pilar: "P4 Empoderamento",
    linha_produto: "",
    tema: "coragem",
    seed: 60618,
    gerar_imagem: true,
    prompt: `Typography-first social media post design, 4:5 vertical format, deep rosy berry background (#C84B7A) with very subtle textile texture overlay. Two main lines of bold typography centered vertically in the upper-middle area, sans-serif rounded font (Poppins Medium/SemiBold), in cream white (#F5EDE8):
Line 1 (medium size): "Você não precisa de loja física."
Line 2 (larger size, bolder): "Você precisa de coragem."
The word "coragem" should be emphasized slightly larger or in subtle italic to draw the eye.
Footer shows "@delamore.oficial" centered in small cream white text at bottom.
Elegant minimal layout with lots of breathing room, professional editorial design.
NO photographs, NO complex graphics, NO English text, just powerful typography on rose berry.
${TYPO_RULES_PT}`,
    legenda: `A maior mentira que te contaram sobre empreender é que você precisa de um lugar fixo pra vender.

Não precisa.

Você precisa de um produto de qualidade. De um preço justo. De uma marca que segura a sua mão no começo. E de coragem.

O resto a Delamore faz com você. São mais de 30 anos de fábrica, 5 lojas, e milhares de revendedoras espalhadas pelo Brasil que começaram com zero loja física e zero experiência.

A coragem você traz. O resto a gente te dá.

👉 Comenta CORAGEM aqui embaixo. A gente te chama no WhatsApp.

${ENDERECOS}`,
    hashtags: "#coragem #empreendedorismofeminino #revendedora #vendaonline #delamore #trabalheemcasa #rendaextra #queromudardevida",
  },

  // ===== POST 15 · 19/jun (Sex) · Cropped 3 looks · REEL =====
  {
    post_id: "15",
    data: "2026-06-19",
    dia_semana: "sex",
    tipo: "reel",
    pilar: "P2 Produto",
    linha_produto: "Cropped",
    tema: "cropped-3-looks",
    gerar_imagem: false,
    legenda: `1 cropped Delamore = 3 looks na vida da sua cliente.

🌸 Por baixo do blazer aberto, no trabalho
🌸 Com legging, em casa
🌸 Combinado com a calcinha da grade, na intimidade

Cliente que compra um cropped da gente, volta querendo de outra cor. Não é teoria. É padrão.

Pra você, revendedora, isso é venda recorrente sem ter que vender de novo.

👉 Quer ver as cores que estão saindo mais? Comenta CROPPED aqui embaixo. Eu te mando a grade no WhatsApp.

${ENDERECOS}`,
    hashtags: "#cropped #lingerieversatil #revendedora #modaintima #atacadodelingerie #pecasmultifuncionais #delamore #lingerieconfortavel",
  },

  // ===== POST 16 · 22/jun (Seg) · Baby doll volta · REEL =====
  {
    post_id: "16",
    data: "2026-06-22",
    dia_semana: "seg",
    tipo: "reel",
    pilar: "P2 Produto",
    linha_produto: "Baby doll",
    tema: "baby-doll-volta",
    gerar_imagem: false,
    legenda: `Baby doll é a peça que toda mulher quer ganhar e raramente compra pra si.

Sabe o que isso significa pra você, revendedora?

Que baby doll é venda de presente. E presente acontece o ano inteiro. Aniversário de namoro, lua de mel, fim de semana romântico, mensagem entre amigas com "compra esse pra mim de presente".

Quem vende baby doll, vende repetido.

A cliente sempre volta.

👉 Quer ver os baby dolls que mais saem da Delamore? Comenta BABY aqui embaixo. Eu te mostro no WhatsApp.

${ENDERECOS}`,
    hashtags: "#babydoll #lingerieromantica #revendedora #delamore #lingerieataacado #modaintima #presenteperfeito #vendarecorrente",
  },

  // ===== POST 17 · 23/jun (Ter) · Institucional · ARTE TIPOGRÁFICA =====
  {
    post_id: "17",
    data: "2026-06-23",
    dia_semana: "ter",
    tipo: "post",
    pilar: "P3 Prova Social",
    linha_produto: "",
    tema: "institucional",
    seed: 60623,
    gerar_imagem: true,
    prompt: `Typography-first social media post design, 4:5 vertical format, soft cream background (#F5EDE8) with a faint blush gradient at the bottom. Three large stat blocks stacked vertically in the upper two-thirds, each with the headline phrase in bold rosy berry (#C84B7A) followed by a thin descriptive line below in dark grey (#2C2C2C). EXACT text (in perfect Portuguese, no duplicates):
Block 1 (top): bold "30 anos" / thin "de fábrica"
Block 2 (middle): bold "5 lojas" / thin "pelo Brasil"
Block 3 (below middle): bold "Milhares de mulheres" / thin "mudando de vida com a renda da revenda"
A thin horizontal divider line in muted rose between each block.
Final closing line near the bottom in elegant italic serif font in rose berry color: "Bora ser a próxima?"
Footer shows "@delamore.oficial" centered in tiny rose berry text at very bottom.
Sans-serif rounded font (Poppins SemiBold) for the stat blocks, italic serif (Playfair Display) for the closing line.
Professional editorial layout, brand consistency with Delamore aesthetic. NO photographs, NO complex graphics, NO English text.
${TYPO_RULES_PT}`,
    legenda: `30 anos de fábrica.

5 lojas pelo Brasil.

Milhares de mulheres mudando de vida com a renda da revenda Delamore.

A história é essa. E a pergunta é essa:

Bora ser a próxima?

A Delamore não nasceu ontem. A gente está aqui desde 1995 fazendo lingerie pra mulher de verdade, no corpo de verdade, com preço que cabe no bolso de verdade. E centenas de mulheres já encontraram aqui a virada de chave que precisavam.

A próxima revendedora pode ser você.

👉 Comenta PRÓXIMA aqui embaixo. Eu te chamo no WhatsApp.

${ENDERECOS}`,
    hashtags: "#delamore30anos #fabricadelingerie #revendedora #empreendedorismofeminino #rendaextra #lojasdelingerie #atacadodelingerie #historiaDelamore",
  },

  // ===== POST 18 · 24/jun (Qua) · Quanto custa · REEL =====
  {
    post_id: "18",
    data: "2026-06-24",
    dia_semana: "qua",
    tipo: "reel",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "quanto-custa-comecar",
    gerar_imagem: false,
    legenda: `"Quanto preciso pra começar?"

É a pergunta que mais chega no nosso direct toda semana.

Resposta direta: menos do que você imagina.

A Delamore tem kit pra quem quer testar com pouco e tem kit pra quem já sabe que vai vender. A diferença não é o tamanho do investimento. É a sua decisão.

Sem compromisso, sem letra miúda. Você pergunta, a gente responde.

👉 Comenta KIT aqui embaixo. Eu te mando todos os valores no WhatsApp.

${ENDERECOS}`,
    hashtags: "#kitrevenda #revendedora #rendaextra #delamore #lingerieataacado #queromudardevida #investimentobaixo #empreendedorismofeminino",
  },

  // ===== POST 19 · 25/jun (Qui) · Decisão · ARTE TIPOGRÁFICA =====
  {
    post_id: "19",
    data: "2026-06-25",
    dia_semana: "qui",
    tipo: "post",
    pilar: "P1 Captação",
    linha_produto: "",
    tema: "decisao",
    seed: 60625,
    gerar_imagem: true,
    prompt: `Typography-first social media post design, 4:5 vertical format, soft blush gradient background going from cream (#F5EDE8) on top to soft rosy (#E8C8D4) at the bottom. Small supratitle near the top centered in dark grey (#2C2C2C) sans-serif: "Mês que vem você pode estar do outro lado."
Below it, large bold centered statement in rosy berry (#C84B7A), sans-serif rounded Poppins SemiBold: "Hoje é só você decidir."
Small CTA line near the bottom in muted grey (#888888): "Comenta DECIDIR. Manda mensagem no direct."
Lots of breathing room between elements, elegant minimalist design, NO photographs, NO graphics, NO English text. Pure typographic emotional impact.
${TYPO_RULES_PT}`,
    legenda: `Mês que vem você pode estar do outro lado.

Vendendo as peças que sua cliente está comprando agora. Recebendo a caixa nova na sua porta. Vendo a primeira venda cair, depois a segunda, depois a quinta.

Ou pode continuar onde está, esperando a "hora certa" chegar.

Spoiler: a hora certa nunca chega. A hora certa é a decisão.

Hoje é só você decidir.

👉 Comenta DECIDIR aqui embaixo. Eu te chamo agora no WhatsApp pra te explicar o passo a passo.

${ENDERECOS}`,
    hashtags: "#decisao #revendedora #empreendedorismofeminino #queromudardevida #rendaextra #delamore #horacerta #revendaDelamore",
  },

  // ===== POST 20 · 26/jun (Sex) · Caixa nova · REEL =====
  {
    post_id: "20",
    data: "2026-06-26",
    dia_semana: "sex",
    tipo: "reel",
    pilar: "P5 Bastidores",
    linha_produto: "",
    tema: "olha-o-que-chegou",
    gerar_imagem: false,
    legenda: `Caixa nova chegou hoje na loja:

🌸 Conjunto novo de renda (coleção de inverno)
🌸 Cropped na cor da estação
🌸 Baby doll que vai virar best-seller

Caixa nova chega aqui toda semana. Toda semana.

E imagina se a próxima caixa fosse pra sua casa, com as peças que você escolheu vender?

👉 Quer começar a receber sua caixa também? Comenta CAIXA aqui embaixo. Eu te chamo no WhatsApp.

${ENDERECOS}`,
    hashtags: "#bastidores #lojaDelamore #colecaoinverno #revendedora #caixanova #delamore #lingerieataacado #rendaextra",
  },
];

// =====================================================
// HELPERS
// =====================================================

function nomeSubpastaPost(post) {
  return `${post.post_id}_${post.data}_${post.tipo}_${post.tema}`;
}

function caminhoSubpasta(baseDir, post) {
  return path.join(baseDir, "entregaveis", nomeSubpastaPost(post));
}

function imagemPathRelativo(post) {
  return `entregaveis/${nomeSubpastaPost(post)}/imagem.png`;
}

async function escreverArquivoTexto(arquivoPath, conteudo) {
  await fs.mkdir(path.dirname(arquivoPath), { recursive: true });
  await fs.writeFile(arquivoPath, conteudo, "utf-8");
}

// =====================================================
// PREPARO: criar TODAS as subpastas + legenda.txt (+ prompt.txt nos posts)
// (rodamos antes da geração de imagem para que a estrutura exista mesmo
// que alguma geração falhe e a gente regenere depois)
// =====================================================

async function prepararSubpastas() {
  console.log("→ Criando subpastas + legenda.txt + prompt.txt (local)...");
  for (const post of calendario) {
    const subLocal = caminhoSubpasta(LOCAL_AGENDA_DIR, post);
    await fs.mkdir(subLocal, { recursive: true });

    const legendaTxt =
      post.legenda + "\n\n" + (post.hashtags ?? "") + "\n";
    await escreverArquivoTexto(path.join(subLocal, "legenda.txt"), legendaTxt);

    if (post.gerar_imagem && post.prompt) {
      await escreverArquivoTexto(path.join(subLocal, "prompt.txt"), post.prompt + "\n");
    }
  }
  console.log(`  ✓ ${calendario.length} subpastas preparadas (local).\n`);
}

// =====================================================
// GERAÇÃO DE IMAGEM
// =====================================================

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function gerarUmaImagem(post) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: post.prompt }] }],
    config: {
      responseModalities: ["IMAGE"],
      seed: post.seed,
      imageConfig: { aspectRatio: ASPECT_RATIO },
    },
  });

  const candidate = response.candidates?.[0];
  if (!candidate) throw new Error("Resposta sem candidates");

  const imagePart = candidate.content?.parts?.find((p) => p.inlineData);
  if (!imagePart) throw new Error("Resposta sem inlineData de imagem");

  const imageBytes = Buffer.from(imagePart.inlineData.data, "base64");

  const subLocal = caminhoSubpasta(LOCAL_AGENDA_DIR, post);
  const localPath = path.join(subLocal, "imagem.png");
  await fs.writeFile(localPath, imageBytes);

  return { post_id: post.post_id, tema: post.tema, size: imageBytes.length };
}

async function gerarImagens() {
  let postsParaGerar = calendario.filter((p) => p.gerar_imagem);
  if (SOMENTE_IDS.length > 0) {
    postsParaGerar = postsParaGerar.filter((p) => SOMENTE_IDS.includes(p.post_id));
    console.log(
      `→ Filtro SOMENTE_IDS ativo: ${SOMENTE_IDS.join(", ")} (${postsParaGerar.length} posts)`
    );
  }
  console.log(
    `→ Gerando ${postsParaGerar.length} artes estáticas (paralelo em batches de ${PARALLEL_BATCH_SIZE})...`
  );

  const resultados = [];
  const inicio = Date.now();

  for (let i = 0; i < postsParaGerar.length; i += PARALLEL_BATCH_SIZE) {
    const batch = postsParaGerar.slice(i, i + PARALLEL_BATCH_SIZE);
    const num = Math.floor(i / PARALLEL_BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(postsParaGerar.length / PARALLEL_BATCH_SIZE);
    console.log(`  ▶ Batch ${num}/${totalBatches} (${batch.length} imagens)`);

    const promises = batch.map((post) =>
      gerarUmaImagem(post).catch((err) => ({
        post_id: post.post_id,
        tema: post.tema,
        status: "erro",
        erro: err.message || String(err),
      }))
    );

    const batchResults = await Promise.all(promises);
    resultados.push(...batchResults);

    batchResults.forEach((r) => {
      if (r.status === "erro") {
        console.log(`    ❌ ${r.post_id} ${r.tema}: ${r.erro}`);
      } else {
        console.log(
          `    ✓ ${r.post_id} ${r.tema} (${(r.size / 1024).toFixed(0)} KB)`
        );
      }
    });
  }

  const tempo = ((Date.now() - inicio) / 1000).toFixed(0);
  const ok = resultados.filter((r) => !r.status || r.status !== "erro").length;
  const falhas = resultados.filter((r) => r.status === "erro").length;
  console.log(
    `  Tempo: ${tempo}s · Sucessos: ${ok}/${postsParaGerar.length} · Falhas: ${falhas}\n`
  );

  return { ok, falhas, resultados };
}

// =====================================================
// GERAÇÃO DO CSV
// =====================================================

async function gerarCsv() {
  console.log("→ Gerando CSV de publicação (local)...");
  const postsCsv = calendario.map((post) => ({
    post_id: post.post_id,
    data_publicacao: post.data,
    hora_publicacao: "",
    dia_semana: post.dia_semana,
    tipo: post.tipo,
    pilar: post.pilar,
    linha_produto: post.linha_produto,
    tema: post.tema,
    legenda: post.legenda,
    hashtags: post.hashtags,
    imagem_path: post.gerar_imagem ? imagemPathRelativo(post) : "",
    ordem_carrossel: "",
    video_path: post.tipo === "reel" ? "" : "", // a entregar depois
    status: "a_publicar",
    link_drive: "",
    observacoes:
      post.tipo === "reel"
        ? "Reel — vídeo a ser entregue pela cliente (Angélica). Capa opcional."
        : "",
  }));

  const result = await gerarAgendaCsv({
    cliente: "delamore",
    mes: "06",
    ano: "2026",
    outputDir: LOCAL_AGENDA_DIR,
    posts: postsCsv,
  });

  console.log(`  ✓ Local: ${result.localPath}`);
  console.log(`  Total: ${result.totalPosts} linhas\n`);

  return result;
}

// =====================================================
// MAIN
// =====================================================

async function main() {
  console.log("===========================================================");
  console.log("DELAMORE · JUNHO 2026 · 8 ARTES + CSV (padrão v3)");
  console.log("===========================================================");
  console.log(`Modelo:        ${MODEL}`);
  console.log(`Aspect ratio:  ${ASPECT_RATIO}`);
  console.log(`Posts totais:  ${calendario.length} (8 com imagem + 12 Reels)`);
  console.log(`Local agenda:  ${LOCAL_AGENDA_DIR}`);
  console.log("===========================================================\n");

  if (SOMENTE_IDS.length === 0) {
    await prepararSubpastas();
  } else {
    console.log("→ Filtro ativo: pulando preparo de subpastas e CSV (já existem).\n");
  }
  const gerou = await gerarImagens();
  if (SOMENTE_IDS.length === 0) {
    await gerarCsv();
  }
  await gerarHtmlComImagens();

  console.log("===========================================================");
  console.log(`✓ FINALIZADO · ${gerou.ok} arte(s) gerada(s) + CSV + HTML`);
  console.log("===========================================================");
}

// =====================================================
// GERAÇÃO DO HTML CLIENTE (com imagens embutidas em base64)
// Roda automaticamente no final, garantindo que o HTML sempre reflete
// as imagens mais recentes nas subpastas de entregaveis/.
// =====================================================

async function gerarHtmlComImagens() {
  console.log("→ Gerando HTML + PDF cliente com imagens embutidas (local apenas — Fase 1 Drive→Supabase)...");
  const inputMd = path.join(LOCAL_AGENDA_DIR, "copys.md");
  const saidas = [
    {
      html: path.join(LOCAL_AGENDA_DIR, "copys-delamore-junho-2026.html"),
      entregaveis: path.join(LOCAL_AGENDA_DIR, "entregaveis"),
    },
  ];

  for (const { html, entregaveis } of saidas) {
    await gerarHtmlAgenda({
      titulo: "Delamore · Agenda Editorial · Junho 2026",
      corPrimaria: "#C84B7A",
      corFundo: "#FFF0F5",
      inputMd,
      outputHtml: html,
      entregaveisDir: entregaveis,
    });
    const htmlStat = await fs.stat(html);
    console.log(`  ✓ HTML: ${html} (${(htmlStat.size / 1024 / 1024).toFixed(1)} MB)`);

    const pdf = html.replace(/\.html$/i, ".pdf");
    const { sizeBytes } = await gerarPdfDoHtml({ inputHtml: html, outputPdf: pdf });
    console.log(`  ✓ PDF:  ${pdf} (${(sizeBytes / 1024 / 1024).toFixed(1)} MB)`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("❌ ERRO FATAL:", err);
  process.exit(1);
});