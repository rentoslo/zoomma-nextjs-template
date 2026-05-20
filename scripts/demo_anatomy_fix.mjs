// Teste de correção anatômica — 4 imagens
// Estratégia 1: foto base close + ANATOMY_CONSISTENCY (Camila IMG_3629, Renato _MG_3700)
// Estratégia 2: foto base de CORPO INTEIRO como referência (já preserva anatomia natural)
// Output: C:\Users\rento\Downloads\teste\anatomy_fix\

import { gerarPostsPessoa } from "./template_pessoa_head_preserve.mjs";

const OUTPUT = "C:\\Users\\rento\\Downloads\\teste\\anatomy_fix";

// ========== ESTRATÉGIA 1: foto close + anatomy boost ==========

await gerarPostsPessoa({
  pessoa: {
    nome: "camila",
    genero: "mulher",
    fotoBase: "IMG_3629.jpg", // close studio bordô
    descricaoFisica:
      "professional Brazilian woman in her mid 30s with dark wavy brown hair, brown eyes, warm natural smile with slight asymmetry, fair olive skin with natural texture and visible pores, latina features",
  },
  outputDir: OUTPUT,
  cenas: [
    {
      nome: "S1_camila_close_blazer",
      descricao: "Estratégia 1 — Camila close + anatomy boost (escritório blazer)",
      cenario:
        "a sophisticated minimalist office with warm honey wood paneling, large floor-to-ceiling window on the left letting in soft natural daylight, a single fiddle-leaf fig plant in a terracotta pot near the window, blurred wooden desk with papers far in the background",
      roupa:
        "a relaxed cream linen tailored blazer over a soft cream silk blouse with natural fabric wrinkles from real wear, a delicate thin gold chain necklace",
      pose: "standing in a relaxed three-quarter angle with one hand casually resting in her blazer pocket, shoulders at a natural slightly asymmetric angle, caught mid-thought looking softly toward the camera with a warm natural smile, slight head tilt to the right",
      colorTemp: "4500K with warm honey undertones",
      iluminacao: "the large window on the left",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline:
        "Marketing para profissional da beleza começa com clareza estratégica.",
      cta: "ESTRATÉGIA",
    },
  ],
});

// ========== ESTRATÉGIA 2: foto base CORPO INTEIRO ==========

await gerarPostsPessoa({
  pessoa: {
    nome: "camila",
    genero: "mulher",
    fotoBase: "IMG_3860.jpg", // jaleco bordô em clínica — corpo inteiro
    descricaoFisica:
      "professional Brazilian woman in her mid 30s with dark wavy brown hair, brown eyes, warm natural smile with slight asymmetry, fair olive skin with natural texture and visible pores, latina features, wearing a bordeaux clinical coat in the reference",
  },
  outputDir: OUTPUT,
  cenas: [
    {
      nome: "S2_camila_corpoInt_escritorio",
      descricao: "Estratégia 2 — Camila corpo inteiro (IMG_3860) → escritório",
      cenario:
        "a sophisticated minimalist office with warm honey wood paneling, large floor-to-ceiling window on the left letting in soft natural daylight, a single fiddle-leaf fig plant in a terracotta pot near the window, blurred wooden desk with papers far in the background",
      roupa:
        "REPLACE the bordeaux clinical coat with a relaxed cream linen tailored blazer over a soft cream silk blouse with natural fabric wrinkles, a delicate thin gold chain necklace. Keep her natural body posture from the reference photograph",
      pose: "preserve her natural standing posture from the reference image with one hand at her side and the other relaxed, shoulders at her natural angle, looking softly toward the camera with her warm natural smile",
      colorTemp: "4500K with warm honey undertones",
      iluminacao: "the large window on the left",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline:
        "Marketing para profissional da beleza começa com clareza estratégica.",
      cta: "ESTRATÉGIA",
    },
  ],
});

// ========== ESTRATÉGIA 1: Renato close-ish + anatomy boost ==========

await gerarPostsPessoa({
  pessoa: {
    nome: "renato",
    genero: "homem",
    fotoBase: "_MG_3700.jpg", // corpo inteiro polo preto
    descricaoFisica:
      "professional Brazilian man in his early 40s with short blond-gray hair, blue eyes, fair skin with natural texture and fine lines around the eyes, warm confident smile with natural asymmetry, european-Brazilian features",
  },
  outputDir: OUTPUT,
  cenas: [
    {
      nome: "S1_renato_close_blazer",
      descricao: "Estratégia 1 — Renato corpo inteiro (já natural) + boost",
      cenario:
        "a sophisticated minimalist office with warm honey wood paneling, large floor-to-ceiling window on the left letting in soft natural daylight, a single fiddle-leaf fig plant in a terracotta pot near the window, blurred wooden desk with papers far in the background",
      roupa:
        "REPLACE the black polo with a crisp white cotton button-down shirt with natural fabric wrinkles, over which he wears a relaxed beige linen blazer, no tie, top button undone for a relaxed look",
      pose: "preserve his natural standing posture from the reference image with one hand casually in his pocket, shoulders at natural relaxed angle, looking softly toward the camera with his characteristic warm smile",
      colorTemp: "4500K with warm honey undertones",
      iluminacao: "the large window on the left",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "A Zoomma não vende marketing. Constrói crescimento.",
      cta: "CRESCER",
    },
    {
      nome: "S2_renato_medium_shot_explicit",
      descricao: "Estratégia 2 — Renato com MEDIUM SHOT framing explícito",
      cenario:
        "an aesthetic clinic reception area with warm beige walls, a single statement green plant in a terracotta pot, soft pendant lighting, blurred treatment bed corner barely visible in the deep background, premium minimalist interior",
      roupa:
        "REPLACE the black polo with a navy blue linen button-down shirt with natural fabric wrinkles, sleeves rolled to the forearm, a simple brown leather watch on the left wrist, no jacket",
      pose: "standing relaxed with hands clasped naturally in front of him at waist level, shoulders at natural angle, slight weight on one leg creating natural contrapposto, looking softly toward the camera with a warm subtle smile. MEDIUM SHOT framing capturing from waist up only — ensure the head, neck, shoulders, chest and arms are all visible in natural proportions",
      colorTemp: "3500K with warm amber undertones",
      iluminacao: "soft pendant lighting from above and ambient window light from the right",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Profissional da beleza precisa de gestão. Não de mais um post.",
      cta: "VALOR",
    },
  ],
});

console.log("\n🎬 Teste anatômico completo. Compare:");
console.log("   - S1_*: Estratégia 1 (com ANATOMY_CONSISTENCY)");
console.log("   - S2_*: Estratégia 2 (foto base de corpo inteiro / framing explícito)");
