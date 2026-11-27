// PG-071 identifier tool (ES + EN, real page data): empty submit, the four outcome branches, reset, wording of the negative result.
// Usage: node tests/test-identifier.mjs
import { join } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { startServer, launch, repoRoot } from '../tools/lib/browser.mjs';

packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: [] });
const server = await startServer(4185, join(repoRoot, 'dist-preview')), browser = await launch();
const failures = []; const ok = (c, m) => { console.log(c ? '  ok  ' : '  FAIL', m); if (!c) failures.push(m); };
const T = {
  es: { url: '/identificador-chinches/', need: /Responde al menos/, direct: /Indicios directos/, traces: /Posibles rastros/, context: /no bastan para confirmar/, none: /Sin indicios/, notRuledOut: /no descarta/ },
  en: { url: '/en/bed-bug-identifier/', need: /answer at least one/i, direct: /Direct signs/, traces: /Possible traces/, context: /do not confirm/, none: /No signs reported/, notRuledOut: /does not rule out/ },
};
try {
  for (const [lang, t] of Object.entries(T)) {
    const page = await browser.newPage(); await page.goto(server.base + t.url, { waitUntil: 'networkidle0' });
    const submit = async () => { await page.click('.sx-tool button[type=submit]'); return page.$eval('.sx-tool-result', e => ({ hidden: e.hidden, text: e.textContent, h3: e.querySelectorAll('h3').length, warn: !!e.querySelector('[data-needed-msg]') })); };
    const reset = () => page.click('.sx-tool button[type=reset]');
    const pick = (q, v) => page.click(`input[name=${q}][value=${v}]`);

    let r = await submit();
    ok(!r.hidden && r.warn && r.h3 === 0 && t.need.test(r.text) && !t.none.test(r.text), `${lang}: empty submit shows a fill-in warning and NO outcome`);
    await reset(); ok(await page.$eval('.sx-tool-result', e => e.hidden && e.textContent === ''), `${lang}: reset clears the warning`);

    await pick('live', 'yes'); r = await submit(); ok(t.direct.test(r.text), `${lang}: live insect -> direct signs`); await reset();
    await pick('spots', 'yes'); r = await submit(); ok(t.traces.test(r.text), `${lang}: dark spots -> possible traces`); await reset();
    await pick('bites', 'yes'); r = await submit(); ok(t.context.test(r.text), `${lang}: bites only -> not confirmation`); await reset();
    await pick('live', 'no'); r = await submit();
    ok(t.none.test(r.text) && t.notRuledOut.test(r.text), `${lang}: negative result says it does NOT rule out bed bugs`);
    ok(!/garant|guarantee|100 ?%/i.test(r.text), `${lang}: no guarantee/percentage wording`);
    await reset(); ok(await page.$eval('.sx-tool-result', e => e.hidden), `${lang}: reset hides the result`);
    ok(await page.$$eval('input[type=radio]:checked', n => n.length === 0), `${lang}: reset unchecks all answers`);
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
console.log(failures.length ? `\n${failures.length} FAILED` : '\nIDENTIFIER CHECKS PASSED');
process.exit(failures.length ? 1 : 0);
