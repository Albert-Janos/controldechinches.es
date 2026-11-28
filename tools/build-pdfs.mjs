// Generates the 12 static downloadable PDFs (6 documents x ES/EN) into assets/pdf/. Source of truth: js/pdf-docs.js.
// Usage: node tools/build-pdfs.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocument, PDF_DOCS } from '../js/pdf-docs.js';

export const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export function buildAll() {
  const logo = new Uint8Array(readFileSync(join(root, 'assets/pdf-logo.jpg')));
  mkdirSync(join(root, 'assets/pdf'), { recursive: true });
  const out = [];
  for (const d of PDF_DOCS) for (const lang of ['es', 'en']) {
    const bytes = buildDocument(d.id, lang, { logo });
    writeFileSync(join(root, 'assets/pdf', d[lang].file), bytes);
    out.push({ id: d.id, lang, file: 'assets/pdf/' + d[lang].file, bytes: bytes.length });
  }
  return out;
}
if (process.argv[1] && process.argv[1].endsWith('build-pdfs.mjs')) for (const o of buildAll()) console.log(`${o.file} (${o.bytes} B)`);
