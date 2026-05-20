// Demo Head Preserve V2 — COM Photorealism Boost (anti-AI)
// Mesmas 6 cenas do demo anterior, mas com 10 técnicas de fotorrealismo
// Saída: C:\Users\rento\Downloads\teste\head_preserve_realistic

import { gerarPostsPessoa } from "./template_pessoa_head_preserve.mjs";

const OUTPUT_DIR = "C:\\Users\\rento\\Downloads\\teste\\head_preserve_realistic";

// =====================================================
// CAMILA — 3 cenas (mesmas do demo anterior pra comparação justa)
// =====================================================
await gerarPostsPessoa({
  pessoa: {
    nome: "camila",
    genero: "mulher",
    fotoBase: "IMG_3629.jpg",
    descricaoFisica:
      "Brazilian woman in her mid 30s, dark wavy shoulder-length brown hair with natural texture, warm brown eyes, fair-medium skin tone with natural pores and slight imperfections, defined cheekbones, warm natural smile with slight asymmetry, elegant feminine features",
  },
  outputDir: OUTPUT_DIR,
  cenas: [
    {
      nome: "01_escritorio_blazer",
      descricao: "Camila escritório blazer creme (REALISTIC)",
      roupa: "a cream-colored slightly wrinkled tailored linen blazer over a soft white silk blouse with natural drape and small fabric creases, with delicate gold chain necklace",
      pose: "standing in a slightly asymmetric relaxed posture, weight on one leg, one hand gently in pocket the other relaxed at side, caught mid-thought looking toward camera with natural micro-smile",
      cenario: "a sophisticated minimalist modern office interior in Kinfolk aesthetic with hints of everyday imperfection — warm honey wood paneling with subtle wear, a single statement plant slightly blurred in background, soft natural light from large window on left with visible dust particles in light beam, sage green wall hints, slightly cluttered with a single book or papers visible on a surface",
      iluminacao: "the left side from a large window with available natural light only (no studio strobes)",
      colorTemp: "4500K with warm honey undertones, mixed lighting creating subtle color cast",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Marketing para profissional da beleza começa com clareza estratégica.",
      cta: "ESTRATÉGIA",
    },
    {
      nome: "02_clinica_jaleco_branco",
      descricao: "Camila clínica jaleco branco (REALISTIC)",
      roupa: "a crisp tailored white clinical coat with natural fabric drape and subtle wrinkles from real wear, over a soft cream blouse with visible texture",
      pose: "standing with confident slightly asymmetric posture, holding an iPad tablet in her left hand resting near her hip, slight turn toward camera, caught mid-expression with natural calm smile (not posed)",
      cenario: "a modern minimalist aesthetic clinic interior in Kinfolk aesthetic with everyday realism, in dreamy creamy bokeh — warm beige walls with subtle imperfections, treatment bed with linen drape barely visible behind with slightly rumpled corner, statement green plant silhouette with one slightly drooping leaf, soft pendant lighting from above casting natural shadows",
      iluminacao: "a large window on the right with mixed warm available light",
      colorTemp: "3500K warm amber with subtle color cast from clinic lights",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Sua clínica fatura. Mas cresce?",
      cta: "DIAGNÓSTICO",
    },
    {
      nome: "03_cafe_cashmere",
      descricao: "Camila café cashmere (REALISTIC)",
      roupa: "an elegant cream-colored cashmere sweater with natural drape, soft fabric texture and subtle pilling visible, lived-in not new",
      pose: "sitting at a wooden cafe table in slightly asymmetric relaxed posture, both hands cradling a small white ceramic espresso cup with subtle fingerprint marks visible, head turned looking thoughtfully off-camera to the right with natural micro-expression",
      cenario: "a sophisticated minimalist Kinfolk coffee shop interior with everyday realism, warm honey wood paneling with subtle scratches and wear, plants softly blurred in background with one slightly wilting leaf, large window with golden hour light filtering through with visible dust particles in the light beam, an open leather journal with slightly creased pages and a brass fountain pen with patina visible on the table in front",
      iluminacao: "the right window in golden hour, available light only",
      colorTemp: "3200K warm amber with natural color cast",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Pensar é a primeira venda.",
      cta: "ESTRATÉGIA",
    },
  ],
});

// =====================================================
// RENATO — 3 cenas (mesmas do demo anterior pra comparação)
// =====================================================
await gerarPostsPessoa({
  pessoa: {
    nome: "renato",
    genero: "homem",
    fotoBase: "_MG_3700.jpg",
    descricaoFisica:
      "Brazilian man in his early 40s, short blond-gray hair styled naturally with slight flyaways, blue eyes with natural slight redness in inner corners, fair skin with visible pores and natural texture including fine lines around eyes, warm natural smile with slight asymmetry, clean-shaven with slight five-o-clock shadow stubble starting to show",
  },
  outputDir: OUTPUT_DIR,
  cenas: [
    {
      nome: "01_cafe_sweater_navy",
      descricao: "Renato café sweater navy (REALISTIC)",
      roupa: "a deep navy blue crewneck wool sweater with natural fabric texture showing slight pilling and lived-in character, over a white t-shirt collar slightly visible at neckline",
      pose: "sitting at a wooden cafe table in slightly asymmetric relaxed posture, slight forward lean, with an open silver laptop in front showing slight fingerprint marks on the lid, right hand resting near the keyboard fingers slightly curled naturally, looking at the camera with calm authoritative natural expression and slight asymmetric smile",
      cenario: "a sophisticated minimalist Kinfolk coffee shop interior with everyday realism, warm honey wood paneling with subtle wear, plants softly blurred behind with slight imperfections visible, large window with golden hour light filtering through on the right side with visible dust particles, a small espresso cup with slight coffee ring on saucer visible on the table beside the laptop",
      iluminacao: "the right window in golden hour, available light only",
      colorTemp: "3500K warm amber with natural mixed lighting",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Estratégia é o que separa quem cresce de quem só posta.",
      cta: "ESTRATÉGIA",
    },
    {
      nome: "02_escritorio_camisa_blazer",
      descricao: "Renato escritório camisa + blazer (REALISTIC)",
      roupa: "a crisp white cotton dress shirt with top button undone and natural fabric wrinkles from real wear, layered under an elegant warm beige unstructured blazer with natural drape and slight asymmetric lapel",
      pose: "standing in three-quarter angle with slightly asymmetric relaxed posture, one hand relaxed in pocket the other naturally at side, slight forward weight, caught mid-expression with calm authoritative natural micro-smile (not posed)",
      cenario: "a sophisticated minimalist modern office interior in Kinfolk aesthetic with everyday imperfection — warm honey wood paneling with visible character, a single statement plant softly blurred with one slightly drooping leaf, soft natural light from large window on the left with visible dust particles in light beam, neutral cream walls with subtle texture",
      iluminacao: "the left side from a large window with available natural light only",
      colorTemp: "4500K with warm undertones and subtle natural color cast",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "A Zoomma não vende marketing. Constrói crescimento.",
      cta: "CRESCER",
    },
    {
      nome: "03_clinica_recepcao",
      descricao: "Renato recepção clínica (REALISTIC)",
      roupa: "an elegant casual deep navy linen shirt with natural creases and lived-in character, sleeves loosely rolled to the forearm with slightly asymmetric folds, two top buttons open showing natural neckline, with a subtle worn leather watch strap visible on wrist",
      pose: "standing confidently in a three-quarter angle with slightly asymmetric posture, one hand relaxed at side fingers slightly curled, the other gently in his pocket, head slight tilt looking directly at camera with warm natural micro-smile (not posed)",
      cenario: "a sophisticated aesthetic clinic reception interior in Kinfolk aesthetic with everyday realism, completely out of focus in dreamy creamy bokeh — warm beige walls with subtle imperfections, statement green plant silhouette with slight asymmetry, soft pendant lighting from above creating natural shadows, hint of a treatment bed corner with slightly rumpled linen drape far behind",
      iluminacao: "soft natural light from the left, available light only",
      colorTemp: "3500K warm amber with natural mixed lighting",
      posicaoFrame: "right two thirds",
      posicaoOverlay: "upper-left",
      headline: "Profissional da beleza precisa de gestão. Não de mais um post.",
      cta: "VALOR",
    },
  ],
});

console.log("\n🎬 Demo REALISTIC (Photorealism Boost) completa.");
