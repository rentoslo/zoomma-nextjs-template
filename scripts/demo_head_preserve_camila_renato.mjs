// Demo da técnica MODO 2 (preservar cabeça) com Camila + Renato
// 3 cenas pra cada um — total 6 imagens
// Demonstra: 1 foto base → 3 variações com roupa/pose/cenário diferentes

import { gerarPostsPessoa } from "./template_pessoa_head_preserve.mjs";

const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\head_preserve_demo";

// =====================================================
// CAMILA (foto base: IMG_3629 — close studio, blusa bordô)
// =====================================================
await gerarPostsPessoa({
  pessoa: {
    nome: "camila",
    genero: "mulher",
    fotoBase: "IMG_3629.jpg",
    descricaoFisica:
      "professional Brazilian woman in her mid 30s, dark wavy shoulder-length brown hair, warm brown eyes, fair-medium skin tone, defined cheekbones, warm confident smile, elegant feminine features",
  },
  outputDir: OUTPUT_DIR,
  cenas: [
    {
      nome: "01_escritorio_blazer",
      descricao: "Camila em escritório com blazer creme",
      roupa: "a cream-colored tailored linen blazer over a soft white silk blouse, with delicate gold chain necklace",
      pose: "standing confidently with arms relaxed at her sides, facing the camera",
      cenario: "a sophisticated minimalist modern office interior in Kinfolk aesthetic — warm honey wood paneling visible far behind, a single statement plant blurred in background, soft natural light from large window on left, sage green wall hints",
      iluminacao: "the left side from a large window",
      colorTemp: "4500K with warm undertones",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Marketing para profissional da beleza começa com clareza estratégica.",
      cta: "ESTRATÉGIA",
    },
    {
      nome: "02_clinica_jaleco_branco",
      descricao: "Camila em clínica com jaleco branco e tablet",
      roupa: "a crisp tailored white clinical coat over a soft cream blouse, professional and elegant",
      pose: "standing with confident posture, holding an iPad tablet in her left hand at her side, slight turn toward camera",
      cenario: "a modern minimalist aesthetic clinic interior in Kinfolk aesthetic, completely out of focus in dreamy creamy bokeh — warm beige walls, treatment bed corner with linen drape barely visible behind, statement green plant silhouette, soft pendant lighting",
      iluminacao: "a large window on the right",
      colorTemp: "3500K warm amber",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Sua clínica fatura. Mas cresce?",
      cta: "DIAGNÓSTICO",
    },
    {
      nome: "03_cafe_cashmere",
      descricao: "Camila em café Kinfolk com sweater cashmere",
      roupa: "an elegant cream-colored cashmere sweater with natural drape",
      pose: "sitting at a wooden cafe table, both hands gently holding a small white ceramic espresso cup, looking thoughtfully off-camera to the right",
      cenario: "a sophisticated minimalist Kinfolk coffee shop interior, warm honey wood paneling behind, plants softly blurred, window with golden hour light filtering through, an open leather journal and brass fountain pen visible on the table in front",
      iluminacao: "the right window in golden hour",
      colorTemp: "3200K warm amber",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Pensar é a primeira venda.",
      cta: "ESTRATÉGIA",
    },
  ],
});

// =====================================================
// RENATO (foto base: _MG_3700 — em pé, polo preto, fundo neutro)
// =====================================================
await gerarPostsPessoa({
  pessoa: {
    nome: "renato",
    genero: "homem",
    fotoBase: "_MG_3700.jpg",
    descricaoFisica:
      "professional Brazilian man in his early 40s, short blond-gray hair styled naturally, blue eyes, fair skin with natural texture, warm confident smile, clean-shaven, elegant masculine features",
  },
  outputDir: OUTPUT_DIR,
  cenas: [
    {
      nome: "01_cafe_sweater_navy",
      descricao: "Renato em café Kinfolk com sweater navy + laptop",
      roupa: "a deep navy blue crewneck wool sweater over a white t-shirt collar visible",
      pose: "sitting at a wooden cafe table with an open silver laptop in front of him, his right hand resting near the laptop keyboard, looking thoughtfully at the camera with calm authoritative expression",
      cenario: "a sophisticated minimalist Kinfolk coffee shop interior, warm honey wood paneling behind, plants softly blurred, large window with golden hour light filtering through on the right side, a small espresso cup visible on the table beside the laptop",
      iluminacao: "the right window in golden hour",
      colorTemp: "3500K warm amber",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Estratégia é o que separa quem cresce de quem só posta.",
      cta: "ESTRATÉGIA",
    },
    {
      nome: "02_escritorio_camisa_blazer",
      descricao: "Renato em escritório com camisa social + blazer bege",
      roupa: "a crisp white tailored cotton dress shirt with top button undone, layered under an elegant warm beige unstructured blazer",
      pose: "standing confidently in three-quarter angle, hands relaxed in pockets, slight turn toward camera with calm authoritative smile",
      cenario: "a sophisticated minimalist modern office interior in Kinfolk aesthetic — warm honey wood paneling visible far behind, a single statement plant softly blurred, soft natural light from large window on the left, neutral cream walls",
      iluminacao: "the left side from a large window",
      colorTemp: "4500K with warm undertones",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "A Zoomma não vende marketing. Constrói crescimento.",
      cta: "CRESCER",
    },
    {
      nome: "03_clinica_recepcao",
      descricao: "Renato em recepção de clínica com camisa azul casual",
      roupa: "an elegant casual deep navy linen shirt with sleeves loosely rolled to the forearm, two top buttons open, with a subtle leather watch strap visible on wrist",
      pose: "standing confidently in a three-quarter angle, one hand relaxed at side, the other gently in his pocket, looking directly at camera with warm professional smile",
      cenario: "a sophisticated aesthetic clinic reception or premium consultation room interior in Kinfolk aesthetic, completely out of focus in dreamy creamy bokeh — warm beige walls, statement green plant silhouette, soft pendant lighting, hint of a treatment bed corner with linen drape far behind",
      iluminacao: "soft natural light from the left",
      colorTemp: "3500K warm amber",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Profissional da beleza precisa de gestão. Não de mais um post.",
      cta: "VALOR",
    },
  ],
});

console.log("\n🎬 Demo MODO 2 (Preservar Cabeça) completa.");
