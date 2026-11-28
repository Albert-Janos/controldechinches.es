// Runs the whole local test suite. Usage: node tools/test-all.mjs   (needs Chrome/Edge; ~2-3 minutes)
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const steps = [
  ['prices consistency', 'tools/check-prices.mjs'],
  ['sitemap, canonical, hreflang, noindex', 'tests/test-seo.mjs'],
  ['internal links', 'tools/check-links.mjs'],
  ['ads protection', 'tests/test-ads-protection.mjs'],
  ['calculator + CTAs', 'tools/test-calculator.mjs'],
  ['publishing gate (negative)', 'tests/test-gate.mjs'],
  ['partial publication (links)', 'tests/test-partial-publish.mjs'],
  ['content consistency', 'tests/test-content-consistency.mjs'],
  ['templates (browser)', 'tests/test-templates.mjs'],
  ['identifier tool PG-071', 'tests/test-identifier.mjs'],
  ['video block PG-013', 'tests/test-video.mjs'],
];
let failed = [];
for (const [name, file] of steps) {
  process.stdout.write(`\n=== ${name} ===\n`);
  const r = spawnSync(process.execPath, [join(root, file)], { cwd: root, stdio: 'inherit' });
  if (r.status !== 0) failed.push(name);
}
console.log(failed.length ? `\nFAILED: ${failed.join(', ')}` : '\nALL SUITES PASSED');
process.exit(failed.length ? 1 : 0);
