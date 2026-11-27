// Local development preview: builds ALL drafts (noindex, DRAFT banner) and serves them with a developer page index.
//   node tools/preview.mjs [port=4173] [--fixtures]      ->  http://127.0.0.1:4173/__dev/index.html
// Local only: dist-preview/ is git-ignored and is never the upload folder (dist/ is).
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageSite } from './package-site.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const port = process.argv.slice(2).find(a => /^\d+$/.test(a)) || '4173';
const r = packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: process.argv.includes('--fixtures') ? ['tests/fixtures/pages'] : [] });
console.log(`preview built: ${r.generated} generated page files`);
spawn(process.execPath, [join(here, 'serve.mjs'), port, join(here, '..', 'dist-preview')], { stdio: 'inherit' });
console.log(`open http://127.0.0.1:${port}/__dev/index.html   (developer page index)`);
