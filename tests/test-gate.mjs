// Negative tests for the publishing gate: unfinished pages must NEVER reach a production package.
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { repoRoot } from '../tools/lib/browser.mjs';

let failed = 0; const ok = (c, m) => { console.log(c ? '  ok  ' : '  FAIL', m); if (!c) failed++; };
const tmpDir = 'tests/.tmp-gate-pages', abs = join(repoRoot, tmpDir);
rmSync(abs, { recursive: true, force: true }); mkdirSync(abs, { recursive: true });
const fx = JSON.parse(readFileSync(join(repoRoot, 'tests/fixtures/pages/FX-B.json'), 'utf8'));

// 1) Draft fixture is silently excluded from production
writeFileSync(join(abs, 'a.json'), JSON.stringify(fx));
const r = packageSite({ mode: 'production', out: 'dist-gate-test', pageDirs: [tmpDir] });
ok(r.generated === 0, 'Draft page is excluded from a production package');

// 2) A page marked "Approved for indexing" but with placeholders / owner TODOs / fixture URL is refused
// (price blocks removed here so this case isolates the placeholder/TODO/fixture reasons; the VAT gate has its own case below)
const noPrice = JSON.parse(JSON.stringify(fx).split('150 €').join('n/a').split('€150').join('n/a')); for (const l of ['es', 'en']) noPrice[l].blocks = noPrice[l].blocks.filter(b => b.type !== 'priceBox');
writeFileSync(join(abs, 'a.json'), JSON.stringify({ ...noPrice, status: 'Approved for indexing' }));
let refused = false, msg = '';
try { packageSite({ mode: 'production', out: 'dist-gate-test', pageDirs: [tmpDir] }); } catch (e) { refused = true; msg = e.message; }
ok(refused && /PACKAGE REFUSED/.test(msg), 'approved page with placeholders/TODOs/fixture URL is refused');
ok(/fixture in production/.test(msg) && /placeholder\/TODO/.test(msg), 'refusal names the reasons');

// 2b) an approved page that shows a price is refused while the VAT / consumer-price decision is not final (LGL gate)
writeFileSync(join(abs, 'a.json'), JSON.stringify({ ...fx, status: 'Approved for indexing' }));
let vatMsg = ''; try { packageSite({ mode: 'production', out: 'dist-gate-test', pageDirs: [tmpDir] }); } catch (e) { vatMsg = e.message; }
ok(/vat.status/.test(vatMsg), 'approved page with a price is refused while VAT is a planning assumption');

// 3) forbidden file types cannot be packaged: the allowlist never copies docs/tools/data/raw-images
const r2 = packageSite({ mode: 'production', out: 'dist-gate-test', pageDirs: [] });
ok(r2.files > 30, `clean production package builds (${r2.files} files)`);
rmSync(abs, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
