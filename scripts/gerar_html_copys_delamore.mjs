// Gera copys-delamore-junho-2026.html a partir de copys.md
// Saída: repo local (Fase 1 da migração Drive → Supabase, 2026-05-30)
// Cliente consome pela página pública /a/<token> da ferramenta web.
// HTML/PDF locais ficam como backup/preview de revisão.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { gerarHtmlAgenda } from "./lib/md_to_html_agenda.mjs";
import { gerarPdfDoHtml } from "./lib/html_to_pdf.mjs";

const BASE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MES = "2026-06";
const CLIENTE = "delamore";

const inputMd = path.join(BASE, "clientes", CLIENTE, "agendas", MES, "copys.md");
const entregaveisLocal = path.join(BASE, "clientes", CLIENTE, "agendas", MES, "entregaveis");

const outputHtml = path.join(BASE, "clientes", CLIENTE, "agendas", MES, `copys-${CLIENTE}-junho-2026.html`);

console.log(`\n🌸 Gerando HTML + PDF — Delamore | Junho 2026 (com imagens embutidas)\n`);

await gerarHtmlAgenda({
  titulo: "Delamore · Agenda Editorial · Junho 2026",
  corPrimaria: "#C84B7A",
  corFundo: "#FFF0F5",
  inputMd,
  outputHtml,
  entregaveisDir: entregaveisLocal,
});
console.log(`✅ HTML: ${outputHtml}`);

const outputPdf = outputHtml.replace(/\.html$/i, ".pdf");
const { sizeBytes } = await gerarPdfDoHtml({ inputHtml: outputHtml, outputPdf });
console.log(`✅ PDF:  ${outputPdf} (${(sizeBytes / 1024 / 1024).toFixed(1)} MB)`);

console.log(`\n📲 Entregável ao cliente: link público /a/<token> da ferramenta web.`);
console.log(`💻 HTML/PDF locais servem para revisão/backup interno.\n`);
