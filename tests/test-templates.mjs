// Validates all 9 templates (fixtures) in a real browser: render, console, overflow, axe, lightbox, identifier tool, screenshots.
// Usage: node tests/test-templates.mjs
import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { packageSite } from '../tools/package-site.mjs';
import { startServer, launch, repoRoot } from '../tools/lib/browser.mjs';

packageSite({ mode: 'preview', out: 'dist-preview', pageDirs: ['tests/fixtures/pages'] });
const axeSrc = readFileSync(join(repoRoot, 'tools/node_modules/axe-core/axe.min.js'), 'utf8');
const fixtures = ['tests/fixtures/pages', 'data/pages'].flatMap(d => readdirSync(join(repoRoot, d)).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(join(repoRoot, d, f), 'utf8'))));
const shots = join(repoRoot, 'reports/raw/templates'); mkdirSync(shots, { recursive: true });
const failures = []; const ok = (c, m) => { if (!c) { failures.push(m); console.log('  FAIL', m); } };
const server = await startServer(4184, join(repoRoot, 'dist-preview')); const browser = await launch();
const viewports = [['360', { width: 360, height: 780, isMobile: true, hasTouch: true }], ['768', { width: 768, height: 1024 }], ['1280', { width: 1280, height: 900 }]];
try {
  for (const fx of fixtures) for (const lang of ['es', 'en']) for (const [vn, vp] of viewports) {
    const url = fx[lang].url, page = await browser.newPage(); await page.setViewport(vp);
    const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('response', r => { if (r.status() >= 400) errs.push(`http ${r.status()} ${r.url()}`); });
    await page.goto(server.base + url, { waitUntil: 'networkidle0' });
    const tag = `${fx.id} ${lang} ${vn}`;
    ok(errs.length === 0, `${tag}: console/network: ${errs.join(' | ')}`);
    const info = await page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, robots: document.querySelector('meta[name=robots]')?.content, lang: document.documentElement.lang, canonical: document.querySelector('link[rel=canonical]')?.href, ld: [...document.querySelectorAll('script[type="application/ld+json"]')].every(s => { try { JSON.parse(s.textContent); return true; } catch { return false; } }) }));
    ok(info.h1 === 1, `${tag}: h1 count ${info.h1}`); ok(info.overflow <= 1, `${tag}: horizontal overflow ${info.overflow}px`);
    ok(info.robots === 'noindex, nofollow', `${tag}: preview must be noindex (${info.robots})`); ok(info.lang === lang, `${tag}: html lang`); ok(info.ld, `${tag}: invalid JSON-LD`);
    if (vn === '1280' || vn === '360') {
      await page.evaluate(axeSrc);
      const r = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } }));
      const v = r.violations.filter(x => !['color-contrast'].includes(x.id) || x.nodes.some(n => !n.target.join(' ').includes('sx-ph')));
      ok(v.length === 0, `${tag}: axe ${v.map(x => `${x.id}(${x.nodes.length}:${x.nodes[0].target.join(' ')})`).join(', ')}`);
    }
    if (lang === 'es' && fx.id === 'FX-G' && vn === '1280') { // lightbox
      await page.evaluate(() => { const a = document.querySelector('a[data-lightbox]'); a.setAttribute('href', '/assets/costablanca.webp'); a.innerHTML = '<img src="/assets/costablanca.webp" alt="test">'; });
      await page.click('a[data-lightbox]'); await page.waitForSelector('dialog[open]');
      ok(await page.evaluate(() => document.querySelector('dialog.sx-lightbox').open), 'lightbox opens');
      await page.keyboard.press('ArrowRight'); await page.keyboard.press('Escape');
      ok(!(await page.evaluate(() => document.querySelector('dialog.sx-lightbox').open)), 'lightbox closes with Escape');
      ok(await page.evaluate(() => document.activeElement?.matches('a[data-lightbox]')), 'focus returns to opener');
    }
    if (lang === 'es' && fx.id === 'FX-I' && vn === '1280') { // tool
      await page.click('input[name=live][value=yes]'); await page.click('input[name=spots][value=yes]'); await page.click('.sx-tool button[type=submit]');
      const t = await page.$eval('.sx-tool-result', e => e.textContent); ok(/Varios indicios/.test(t), `tool result for 2 yes: ${t}`);
      await page.click('.sx-tool button[type=reset]'); ok(await page.$eval('.sx-tool-result', e => e.hidden), 'tool reset hides result');
    }
    if (vn !== '768') await page.screenshot({ path: join(shots, `${fx.id}-${lang}-${vn}.png`), fullPage: true });
    await page.close();
  }
} finally { await browser.close(); server.stop(); }
console.log(failures.length ? `\n${failures.length} FAILED` : '\nALL TEMPLATE CHECKS PASSED');
process.exit(failures.length ? 1 : 0);
