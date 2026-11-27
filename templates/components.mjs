// Reusable HTML components for generated pages. Pure functions: (ctx, data) -> string.
// ctx = { lang, ui, site, prices, images, pages, included:Set<pageId>, mode:'preview'|'production', page, pageLang }
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
import { consumerPrice, resolveTokens } from './prices.mjs';
export const slug = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function pageUrl(ctx, id, lang = ctx.lang) { return ctx.pages[id]?.[lang]?.url ?? null; }
export function absUrl(ctx, path) { return ctx.site.domain + path; }
// Owner decision (audit fix pack 1): WhatsApp links on generated pages carry NO pre-filled message. The page.cta.message key is
// kept only as an inert hook so a future decision can reintroduce per-page messages in this one place.
export function waLink(ctx) { return `https://wa.me/${ctx.site.whatsapp.number}`; }

// ---------- publication-aware linking ----------
// A link is "dead" when it points at a generated page that is not part of the current build (e.g. still Draft in a production build).
export function targetPage(ctx, href) {
  const path = String(href || '').replace(ctx.site.domain, '').split('#')[0].split('?')[0];
  return ctx.urlIndex?.[path] ?? null;
}
export const isLive = (ctx, href) => { const id = targetPage(ctx, href); return !id || ctx.included.has(id); };
// Safety net for links written inside HTML strings (prose, FAQ answers, steps...): keep the words, drop the anchor.
export function unlinkDead(ctx, html) {
  return html.replace(/<a\b([^>]*?)\shref="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (m, a, href, b, inner) => (isLive(ctx, href) ? m : inner));
}
// Audit helper (production build gate + partial-publication test): every reference to a generated page that is not built.
export function deadLinks(ctx, html) {
  const out = new Set(), check = u => { const id = targetPage(ctx, u); if (id && !ctx.included.has(id)) out.add(u); };
  for (const m of html.matchAll(/\shref="([^"]+)"/g)) check(m[1]);
  for (const m of html.matchAll(/"(?:item|url|@id|contentUrl)":"([^"]+)"/g)) check(m[1]);
  return [...out];
}

const symbols = `<svg class="symbols" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><symbol id="icon-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.8-.2-.3 0-.5.1-.6.2-.3.5-.5.6-.9.1-.2 0-.4 0-.5l-.9-2.1c-.1-.4-.3-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.7 1.2 2.9c.2.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.3-.6.3-1.1.2-1.2-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.9.9-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></symbol><symbol id="icon-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol><symbol id="icon-phone" viewBox="0 0 24 24"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a13 13 0 0 1-7-7l2-2-2-5Z"/></symbol><symbol id="icon-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol></svg>`;

// ---------- head ----------
export function head(ctx, jsonld) {
  const { page, lang, site, ui } = ctx, L = page[lang];
  const indexable = ctx.mode === 'production' && site.indexableStatuses.includes(page.status);
  const other = lang === 'es' ? 'en' : 'es';
  const canon = absUrl(ctx, L.url);
  const og = L.ogImage || site.assets.ogImageDefault;
  const alt = page[other] ? `<link rel="alternate" hreflang="${lang}" href="${canon}">\n<link rel="alternate" hreflang="${other}" href="${absUrl(ctx, page[other].url)}">\n<link rel="alternate" hreflang="x-default" href="${absUrl(ctx, page.es.url)}">` : '';
  return `<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${indexable ? 'index, follow' : 'noindex, nofollow'}">
<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.description)}">
<link rel="canonical" href="${canon}">
${alt}
<meta property="og:type" content="${page.template === 'T-C' ? 'article' : 'website'}">
<meta property="og:title" content="${esc(L.title)}">
<meta property="og:description" content="${esc(L.description)}">
<meta property="og:image" content="${absUrl(ctx, og)}">
<meta property="og:locale" content="${ui.locale}">
<meta property="og:url" content="${canon}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121a24">
<link rel="icon" href="/assets/favicon.ico">
<link rel="preload" href="/assets/fonts/dm-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
${site.assets.css.map(h => `<link rel="stylesheet" href="${h}">`).join('\n')}
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>`;
}

// ---------- header / footer ----------
function navItems(ctx) {
  const { ui, lang } = ctx, n = ui.nav, items = [[n.home, lang === 'es' ? '/' : '/en/']];
  const add = (label, id) => { const u = ctx.included.has(id) && pageUrl(ctx, id, lang); if (u) items.push([label, u]); };
  add(n.services, 'PG-010');
  items.push([n.prices, lang === 'es' ? '/precios.html' : '/en/prices.html'], [n.rentals, lang === 'es' ? '/chinches-apartamentos-turisticos/' : '/en/bed-bugs-holiday-rentals/']);
  add(n.guide, 'PG-040'); add(n.faq, 'PG-030'); add(n.about, 'PG-016');
  return items;
}
export function header(ctx) {
  const { ui, lang, site, page } = ctx, L = page[lang], other = lang === 'es' ? 'en' : 'es';
  const items = navItems(ctx);
  const cur = u => u === L.url ? ' aria-current="page"' : '';
  const nav = items.map(([t, u]) => `<a href="${u}"${cur(u)}>${esc(t)}</a>`).join('');
  const esHref = page.es ? page.es.url : '/', enHref = page.en ? page.en.url : '/en/';
  return `<header class="site-header"><div class="utility"><div class="wrap utility-inner"><a href="${lang === 'es' ? '/#zona-servicio' : '/en/#zona-servicio'}"><svg class="icon" aria-hidden="true"><use href="#icon-pin"/></svg>${esc(ui.area)}</a><a href="tel:${site.dispatcher.tel}" data-cta="navigation"><svg class="icon" aria-hidden="true"><use href="#icon-phone"/></svg>${esc(site.dispatcher.display)}</a></div></div>
<div class="wrap nav"><a class="logo" href="${lang === 'es' ? '/' : '/en/'}" aria-label="${esc(ui.home_label)}"><img src="${site.assets.logo}" width="480" height="270" alt="${esc(site.brand)}"></a>
<nav class="desktop-nav" aria-label="${esc(ui.nav.label)}">${nav}</nav>
<div class="nav-actions"><div class="languages" role="group" aria-label="${esc(ui.language)}"><a lang="es" hreflang="es" href="${esHref}" aria-label="ES – Español"${lang === 'es' ? ' aria-current="page"' : ''}>ES</a><a lang="en" hreflang="en" href="${enHref}" aria-label="EN – English"${lang === 'en' ? ' aria-current="page"' : ''}>EN</a></div>
<a class="button yellow nav-whatsapp" href="${waLink(ctx)}" data-cta="navigation" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><svg class="icon wa" aria-hidden="true"><use href="#icon-wa"/></svg><span>WhatsApp</span></a>
<details class="mobile-menu"><summary aria-label="${esc(ui.nav.label)}"><svg class="icon" aria-hidden="true"><use href="#icon-menu"/></svg></summary><nav aria-label="${esc(ui.nav.label)}">${nav}</nav></details></div></div></header>`;
}
export function footer(ctx) {
  const { ui, lang, site } = ctx, f = ui.footer;
  const links = navItems(ctx).filter(([, u]) => u !== (lang === 'es' ? '/' : '/en/')).map(([t, u]) => `<a href="${u}">${esc(t)}</a>`).join('');
  const zones = ctx.included.has('PG-020') ? `<a href="${pageUrl(ctx, 'PG-020', lang)}">${esc(ui.nav.zones)}</a>` : '';
  return `<footer class="footer"><div class="wrap"><div class="footer-grid">
<div class="footer-brand"><a class="logo" href="${lang === 'es' ? '/' : '/en/'}" aria-label="${esc(ui.home_label)}"><img src="${site.assets.logo}" width="480" height="270" alt="${esc(site.brand)}"></a><p>${esc(f.tagline)}</p></div>
<nav aria-label="${esc(f.explore)}"><h2>${esc(f.explore)}</h2>${links}</nav>
<div><h2>${esc(f.area)}</h2>${zones}<a href="${lang === 'es' ? '/#zona-servicio' : '/en/#zona-servicio'}">${esc(ui.area)}</a><p>${esc(site.serviceAreas.featured.join(', '))} ${esc(f.andMore)}</p></div>
<div><h2>${esc(f.contact)}</h2><a href="${waLink(ctx)}" data-cta="content" target="_blank" rel="noopener noreferrer"><svg class="icon wa" aria-hidden="true"><use href="#icon-wa"/></svg> WhatsApp</a><a href="tel:${site.dispatcher.tel}" data-cta="content"><svg class="icon" aria-hidden="true"><use href="#icon-phone"/></svg> ${esc(site.dispatcher.display)}</a></div>
</div><div class="footer-bottom"><span>© 2026 ControlDeChinches.es</span><div><a href="${ui.legalPaths.legal}">${esc(f.legal)}</a><a href="${ui.legalPaths.privacy}">${esc(f.privacy)}</a><span hidden data-privacy-item><button type="button" data-cookie-settings>${esc(f.settings)}</button></span></div></div></div></footer>`;
}

// ---------- small parts ----------
export function breadcrumb(ctx) {
  const { ui, lang, page } = ctx, L = page[lang];
  const trail = [[ui.home, lang === 'es' ? '/' : '/en/'], ...(L.breadcrumb || []).filter(([, u]) => isLive(ctx, u)), [L.h1, null]];
  return { items: trail, html: `<nav class="sx-crumbs sx-wrap" aria-label="${esc(ui.breadcrumb)}"><ol>${trail.map(([t, u]) => u ? `<li><a href="${u}">${esc(t)}</a></li>` : `<li aria-current="page">${esc(t)}</li>`).join('')}</ol></nav>` };
}
export function button(ctx, kind, label, key = 'default', pos = 'content') {
  if (kind === 'tel') return `<a class="button inverse" href="tel:${ctx.site.dispatcher.tel}" data-cta="${pos}"><svg class="icon" aria-hidden="true"><use href="#icon-phone"/></svg>${esc(label)}</a>`;
  return `<a class="button yellow" href="${waLink(ctx, key)}" target="_blank" rel="noopener noreferrer" data-cta="${pos}"><svg class="icon wa" aria-hidden="true"><use href="#icon-wa"/></svg>${esc(label)}</a>`;
}
export function ctaBand(ctx, intensity = 'soft', key = 'default') {
  const { ui, site } = ctx, c = ui.cta;
  if (intensity === 'strong') return `<section class="contact wrap" id="contacto"><div class="contact-inner"><div><h2>${esc(c.strongTitle)}</h2><p>${esc(c.strongText)}</p></div><div class="contact-actions">${button(ctx, 'wa', c.whatsapp, key, 'contact')}${button(ctx, 'tel', `${c.callTo} ${site.dispatcher.displayShort}`, key, 'contact')}<small>${esc(site.assistantNote[ctx.lang])}</small></div></div></section>`;
  if (intensity === 'medium') return `<section class="sx-wrap sx-block" id="contacto"><div class="sx-cta sx-cta--medium"><div><h2>${esc(c.mediumTitle)}</h2><p>${esc(c.mediumText)}</p></div><div class="actions">${button(ctx, 'wa', c.whatsapp, key, 'content')}</div></div></section>`;
  return `<section class="sx-block" id="contacto"><div class="sx-cta sx-cta--soft"><div><h2>${esc(c.question)}</h2><p>${esc(c.questionText)}</p></div><div class="actions"><a class="text-link" href="${waLink(ctx, key)}" target="_blank" rel="noopener noreferrer" data-cta="content">${esc(c.whatsapp)}</a></div></div></section>`;
}

// ---------- images ----------
export function picture(ctx, id, { sizes = '(min-width: 990px) 46rem, 100vw', eager = false, cls = '' } = {}) {
  const img = ctx.images[id], lang = ctx.lang;
  if (!img) return `<div class="sx-ph" role="img" aria-label="${esc(id)}" data-image-id="${esc(id)}"><div>${esc(ctx.ui.placeholderLabel)}<span>${esc(id)} (not in manifest)</span></div></div>`;
  const alt = img.alt?.[lang] || '';
  if (img.status !== 'ready') {
    const [w, h] = img.aspect || [3, 2];
    return `<div class="sx-ph${cls ? ' ' + cls : ''}" role="img" aria-label="${esc(alt)}" data-image-id="${esc(id)}" style="aspect-ratio:${w}/${h}"><div>${esc(ctx.ui.placeholderLabel)}<span>${esc(id)}</span></div></div>`;
  }
  const v = img.variants, src = (w, f) => `${v.dir}${v.base}-${w}.${f}`;
  const set = f => v.widths.map(w => `${src(w, f)} ${w}w`).join(', ');
  const big = v.widths[v.widths.length - 1];
  const mob = v.mobile ? ['avif', 'webp'].filter(f => v.formats.includes(f)).map(f => `<source media="(max-width: 760px)" type="image/${f}" srcset="${v.mobile.widths.map(w => `${v.dir}${v.base}-m-${w}.${f} ${w}w`).join(', ')}" sizes="100vw">`).join('') : '';
  return `<picture>${mob}${v.formats.includes('avif') ? `<source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">` : ''}<source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img${cls ? ` class="${cls}"` : ''} src="${src(big, 'webp')}" srcset="${set('webp')}" sizes="${sizes}" width="${v.width}" height="${v.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}></picture>`;
}
// Image sizing classes (see docs/seo/VISUAL-DESIGN-SYSTEM.md "Image sizing"): the KIND decides the display size, never the viewport alone.
//   hero         page-top image of an article          max 54rem  (864 px)
//   photo        ordinary landscape body photo          max 46rem  (736 px)
//   macro        entomology macro photo (never cropped) max 40rem  (640 px)
//   portrait     vertical portrait                      max 19rem  (304 px; 15rem on phones), sits beside text where possible
//   illustration infographic / diagram                  max 46rem
// The natural aspect ratio is always kept (placeholders use the manifest aspect, real images their width/height attributes).
export function imgKind(ctx, id, usage = 'body') {
  const e = ctx.images[id]; if (!e) return 'photo';
  if (e.kind === 'infographic') return 'illustration';
  const [w, h] = e.aspect || [3, 2];
  if (h > w) return 'portrait';
  if (usage === 'hero') return 'hero';
  if (/^entomology/.test(e.folder || '')) return 'macro';
  return 'photo';
}
const SIZES = { hero: '(min-width: 990px) 54rem, 100vw', photo: '(min-width: 990px) 46rem, 100vw', macro: '(min-width: 990px) 40rem, 100vw', portrait: '(max-width: 760px) 15rem, 19rem', illustration: '(min-width: 990px) 46rem, 100vw' };
export function figure(ctx, id, opts = {}) {
  const kind = opts.kind || imgKind(ctx, id, opts.usage), cap = ctx.images[id]?.caption?.[ctx.lang];
  return `<figure class="sx-figure sx-figure--${kind}">${picture(ctx, id, { ...opts, sizes: opts.sizes || SIZES[kind] })}${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>`;
}

// ---------- blocks ----------
function sectionId(b, i) { return b.id || (b.h2 ? slug(b.h2) : 'b' + i); }
function todo(ctx, text) { return `<div class="sx-todo" data-owner-todo><strong>${esc(ctx.ui.todo)}</strong>${esc(text)}</div>`; }
const heading = (b, id) => b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : '';

export function renderBlock(ctx, b, i) {
  const { ui, lang } = ctx, id = sectionId(b, i);
  switch (b.type) {
    case 'text': return `<section class="sx-block sx-prose">${heading(b, id)}${b.html}</section>`;
    case 'todo': return todo(ctx, b.text);
    case 'facts': return `<section class="sx-block" aria-label="${esc(ui.keyFacts)}"><dl class="sx-facts">${b.items.map(f => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}</dl></section>`;
    case 'steps': return `<section class="sx-block">${heading(b, id)}<ol class="steps">${b.items.map(s => `<li><div><h3>${esc(s.h3)}</h3><p>${s.p}</p></div></li>`).join('')}</ol></section>`;
    case 'proscons': return `<section class="sx-block">${heading(b, id)}<div class="sx-proscons"><div class="sx-pros"><h3>${esc(b.prosTitle || ui.prosTitle)}</h3><ul>${b.pros.map(x => `<li>${x}</li>`).join('')}</ul></div><div class="sx-cons"><h3>${esc(b.consTitle || ui.consTitle)}</h3><ul>${b.cons.map(x => `<li>${x}</li>`).join('')}</ul></div></div></section>`;
    case 'roles': return `<section class="sx-block">${heading(b, id)}<div class="sx-roles">${b.columns.map(c => `<div><h3>${esc(c.title)}</h3><ul>${c.items.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div></section>`;
    case 'table': return `<section class="sx-block">${heading(b, id)}<div class="sx-tablewrap" tabindex="0" role="region" aria-label="${esc(b.caption || b.h2 || '')}"><table class="sx-table">${b.caption ? `<caption>${esc(b.caption)}</caption>` : ''}<thead><tr>${b.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;
    case 'figure': return `<section class="sx-block">${figure(ctx, b.image, { sizes: b.sizes, kind: b.kind })}</section>`;
    case 'infographic': return `<section class="sx-block"><figure class="sx-figure sx-figure--illustration">${ctx.infographics?.[b.id] ? ctx.infographics[b.id](ctx) : picture(ctx, b.id)}<figcaption>${esc(ctx.images[b.id]?.caption?.[lang] || ui.infographic)}</figcaption></figure></section>`;
    case 'cards': return `<section class="sx-block">${heading(b, id)}<div class="sx-cards">${b.items.map(c => { const link = c.href && isLive(ctx, c.href); return (link ? `<a class="sx-card" href="${c.href}">` : '<div class="sx-card">') + `<h3>${esc(c.title)}</h3><p>${esc(c.text)}</p>${link ? `<span class="sx-more">${esc(ui.readMore)} →</span>` : ''}` + (link ? '</a>' : '</div>'); }).join('')}</div></section>`;
    case 'timeline': return `<section class="sx-block">${heading(b, id)}<ol class="sx-timeline">${b.items.map(t => `<li><strong>${esc(t.when)}</strong>${t.text}</li>`).join('')}</ol></section>`;
    case 'priceBox': {
      const p = ctx.prices, c = p.chemical.bedroomPrices[0], s = p.drySteamStandalone.from;
      const pr = lang === 'es' ? '/precios.html' : '/en/prices.html';
      if (b.variant === 'chemical') return priceTable(ctx, b, id, pr);
      if (b.variant === 'steam') return `<section class="sx-block">${heading(b, id)}<div class="sx-pricebox sx-pricebox--steam"><div class="sx-price-primary"><h3>${esc(ui.steamStandalone)}</h3><p>${esc(ui.fromPrice)} <strong>${consumerPrice(ctx.prices, lang, s)}</strong></p><small>${esc(ui.steamNote)}</small></div><div><h3>${esc(ui.chemical)}</h3><p>${esc(ui.fromPrice)} <strong>${consumerPrice(ctx.prices, lang, c)}</strong></p><small>${esc(ui.perVisit)}</small></div></div><p class="sx-tool-note">${esc(ui.priceNote)} <a class="text-link" href="${pr}">${esc(ui.seePrices)}</a></p></section>`;
      return `<section class="sx-block">${heading(b, id)}<div class="sx-pricebox"><div><h3>${esc(ui.chemical)}</h3><p>${esc(ui.fromPrice)} <strong>${consumerPrice(ctx.prices, lang, c)}</strong></p><small>${esc(ui.perVisit)}</small></div><div><h3>${esc(ui.steam)}</h3><p>${esc(ui.fromPrice)} <strong>${consumerPrice(ctx.prices, lang, s)}</strong></p><small>${esc(ui.steamNote)}</small></div></div><p class="sx-tool-note">${esc(ui.priceNote)} <a class="text-link" href="${pr}">${esc(ui.seePrices)}</a></p></section>`;
    }
    case 'towns': { // the owner-approved service area, straight from data/site.json (links only to published city pages)
      const cp = ctx.site.serviceAreas.cityPages || {};
      const li = ctx.site.serviceAreas.confirmed.map(t => { const pid = cp[t], u = pid && ctx.included.has(pid) && pageUrl(ctx, pid); return `<li>${u ? `<a href="${u}">${esc(t)}</a>` : esc(t)}</li>`; }).join('');
      return `<section class="sx-block">${heading(b, id)}${b.intro ? `<p>${b.intro}</p>` : ''}<ul class="sx-towns">${li}</ul></section>`;
    }
    case 'docform': return docForm(ctx, b, id);
    case 'print': return '<p class="sx-noprint"><button type="button" class="button yellow" data-print>' + esc(b.label) + '</button></p>';
    case 'faq': return faqBlock(ctx, b, id);
    case 'cta': return ctaBand(ctx, b.intensity, b.message);
    case 'gallery': return galleryBlock(ctx, b, id);
    case 'docs': return `<section class="sx-block">${heading(b, id)}<ul class="sx-docs">${b.images.map(im => `<li><a href="${ctx.images[im]?.status === 'ready' ? `${ctx.images[im].variants.dir}${ctx.images[im].variants.base}-${ctx.images[im].variants.widths.at(-1)}.webp` : '#' + im}" data-lightbox="${im}">${picture(ctx, im, { sizes: '12rem' })}</a></li>`).join('')}</ul></section>`;
    case 'tool': return toolBlock(ctx, b, id);
    case 'hub': return b.groups.map((g, gi) => { // entries whose target is not published are hidden (an unlinked list entry is useless); empty groups disappear
      const items = g.items.filter(it => (it.pageId ? ctx.included.has(it.pageId) && pageUrl(ctx, it.pageId) : isLive(ctx, it.href)));
      if (!items.length) return '';
      return `<section class="sx-block sx-hubgroup">${g.h2 ? `<h2 id="${slug(g.h2) || 'g' + gi}">${esc(g.h2)}</h2>` : ''}${g.intro ? `<p>${esc(g.intro)}</p>` : ''}<ul class="sx-hublist">${items.map(it => { const u = it.href || pageUrl(ctx, it.pageId); return `<li><a href="${u}"><strong>${esc(it.title || ctx.pages[it.pageId]?.[lang]?.h1)}</strong><span>${esc(it.text || '')}</span></a></li>`; }).join('')}</ul></section>`;
    }).join('');
    default: throw new Error('unknown block type ' + b.type);
  }
}
// Compact, complete approved price structure for the chemical treatment (+ stand-alone dry steam). Numbers come ONLY from data/prices.json.
function extrasTable(ctx) {
  const { ui, lang, prices: p } = ctx, m = n => consumerPrice(p, lang, n), e = p.extras;
  return `<div class="sx-tablewrap"><table class="sx-table sx-table--compact"><caption>${esc(ui.extrasCaption)}</caption><tbody><tr><th scope="row">${esc(ui.steamAddOn)}</th><td>+${m(e.steamAddOnToChemical.net)}</td></tr><tr><th scope="row">${esc(ui.sofa)}</th><td>+${m(e.sofa.net)}</td></tr><tr><th scope="row">${esc(ui.fogging)}</th><td>${esc(ui.fromPrice)} ${m(e.coldFoggingFrom.net)}</td></tr></tbody></table></div>`;
}
function priceTable(ctx, b, id, pr) {
  const { ui, lang, prices: p } = ctx, c = p.chemical.bedroomPrices, m = n => consumerPrice(ctx.prices, lang, n);
  const rows = c.map((v, i) => `<tr><th scope="row">${i + 1} ${esc(i ? ui.bedrooms : ui.bedroom)}</th><td>${m(v)}</td></tr>`).join('') + `<tr><th scope="row">${esc(ui.extraBedroom)}</th><td>+${m(p.chemical.additionalBedroom)}</td></tr>`;
  return `<section class="sx-block">${b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : ''}<div class="sx-pricetable"><div class="sx-tablewrap"><table class="sx-table sx-table--compact"><caption>${esc(ui.chemVisit)}</caption><thead><tr><th scope="col">${esc(ui.bedroomsAffected)}</th><th scope="col">${esc(ui.price)}</th></tr></thead><tbody>${rows}</tbody></table></div>${extrasTable(ctx)}<div class="sx-price-steamrow"><h3>${esc(ui.steamStandalone)}</h3><p>${esc(ui.fromPrice)} <strong>${m(p.drySteamStandalone.from)}</strong></p><small>${esc(ui.steamNote)}</small></div></div><p class="sx-tool-note">${esc(ui.priceNote)} <a class="text-link" href="${pr}">${esc(ui.seePrices)}</a></p></section>`;
}
function faqBlock(ctx, b, id) {
  const group = (g, i) => `<div class="sx-faq-group">${g.h3 ? `<h3>${esc(g.h3)}</h3>` : ''}<div class="questions">${g.items.map((q, j) => `<details name="faq-${i}"${i === 0 && j === 0 && b.open ? ' open' : ''}><summary>${esc(q.q)}</summary><p>${q.a}</p></details>`).join('')}</div></div>`;
  const groups = b.groups || [{ items: b.items }];
  return `<section class="sx-block sx-faq">${b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : `<h2 id="${id}">${esc(ctx.ui.faq)}</h2>`}${groups.map(group).join('')}</section>`;
}
function galleryBlock(ctx, b, id) {
  const { ui, lang } = ctx;
  const filters = b.filters ? `<ul class="sx-filters">${b.filters.map(f => `<li><a href="#${f.id}">${esc(f.label)}</a></li>`).join('')}</ul>` : '';
  const item = im => {
    const e = ctx.images[im], ready = e?.status === 'ready', v = e?.variants;
    const href = ready ? `${v.dir}${v.base}-${v.widths.at(-1)}.webp` : `#${im}`;
    const notes = JSON.stringify({ id: im, cap: e?.caption?.[lang] || '', notes: e?.notes?.[lang] || '', credit: e?.credit || '', scale: e?.scale || '' });
    return `<li id="${im}"><figure class="sx-figure"><a href="${href}" data-lightbox data-notes="${esc(notes)}">${picture(ctx, im, { sizes: '(min-width: 990px) 22rem, 50vw' })}</a><figcaption>${esc(e?.caption?.[lang] || '')}</figcaption></figure></li>`;
  };
  const groups = b.groups || [{ images: b.images }];
  return `<section class="sx-block">${b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : ''}${filters}${groups.map(g => `${g.id ? `<h3 id="${g.id}">${esc(g.h3)}</h3>` : ''}<ul class="sx-gallery">${g.images.map(item).join('')}</ul>`).join('')}</section>`;
}
function toolBlock(ctx, b, id) {
  const { ui } = ctx, t = ui.tool;
  const qs = b.questions.map(q => `<fieldset data-q="${q.id}"><legend>${esc(q.text)}</legend><label><input type="radio" name="${q.id}" value="yes"> ${esc(t.yes)}</label><label><input type="radio" name="${q.id}" value="no"> ${esc(t.no)}</label><label><input type="radio" name="${q.id}" value="unsure"> ${esc(t.unsure)}</label></fieldset>`).join('');
  const outcomes = b.outcomes.map(o => `<li data-outcome="${o.id}" data-rule="${esc(JSON.stringify(o.rule))}"><strong>${esc(o.title)}</strong><p>${o.text}</p></li>`).join('');
  return `<section class="sx-block" data-tool-root><h2 id="${id}">${esc(b.h2)}</h2><form class="sx-tool" data-tool data-needed="${esc(t.needAnswer)}" novalidate><p class="sx-tool-note">${esc(t.disclaimer)}</p>${qs}<div class="actions"><button class="button yellow" type="submit">${esc(t.next)}</button><button class="button" type="reset">${esc(t.restart)}</button></div><div class="sx-tool-result" role="status" aria-live="polite" hidden></div><noscript><p class="sx-tool-note">${esc(t.noscript)}</p></noscript></form><h3>${esc(b.outcomesTitle)}</h3><ul class="sx-hublist" data-outcomes>${outcomes}</ul></section>`;
}

export function authorBox(ctx) {
  const { site, ui, lang } = ctx, p = site.person;
  const showLink = ctx.included.has('PG-016');
  const portrait = ctx.images['IMG-ABOUT-02'] ? picture(ctx, 'IMG-ABOUT-02', { sizes: '4.5rem' }) : '';
  const roleText = lang === 'es' ? 'Especialista en chinches de cama' : 'Bed bug specialist';
  return `<aside class="sx-author" aria-label="${esc(ui.author)}"><figure>${portrait}</figure><div><p><strong>${showLink ? `<a href="${pageUrl(ctx, 'PG-016', lang)}">${esc(p.name)}</a>` : esc(p.name)}</strong></p><p>${esc(roleText)} · ${esc(ui.author)}${ctx.page[lang].reviewer ? ` · ${esc(ui.reviewer)}: ${esc(ctx.page[lang].reviewer)}` : ''}</p></div></aside>`;
}
export function sourcesBlock(ctx) {
  const s = ctx.page[ctx.lang].sources; if (!s?.length) return '';
  const pol = ctx.included.has('PG-017') ? `<p class="sx-tool-note"><a href="${pageUrl(ctx, 'PG-017')}">${esc(ctx.lang === 'es' ? 'Política editorial' : 'Editorial policy')}</a></p>` : '';
  return `<section class="sx-block sx-sources"><h2 id="fuentes">${esc(ctx.ui.sources)}</h2>${pol}<ol>${s.map(x => `<li>${esc(x.title)}${x.publisher ? ` — ${esc(x.publisher)}` : ''}${x.year ? `, ${esc(x.year)}` : ''}. ${x.url ? `<a href="${esc(x.url)}" rel="noopener">${esc(x.url)}</a>` : ''}${x.checked ? ` <em>(${esc(x.checked)})</em>` : ''}</li>`).join('')}</ol></section>`;
}
export function relatedBlock(ctx) {
  const ids = (ctx.page.related || []).filter(id => ctx.included.has(id) && ctx.pages[id]?.[ctx.lang]);
  if (!ids.length) return '';
  return `<section class="sx-block sx-related"><h2 id="relacionado">${esc(ctx.ui.related)}</h2><ul>${ids.map(id => `<li><a href="${pageUrl(ctx, id)}">${esc(ctx.pages[id][ctx.lang].h1)}</a></li>`).join('')}</ul></section>`;
}
export function metaLine(ctx) {
  const L = ctx.page[ctx.lang], d = ctx.page.dates || {}, ui = ctx.ui;
  const fmt = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString(ctx.lang === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `<p class="sx-meta"><span><strong>${esc(ui.author)}:</strong> ${esc(ctx.site.person.name)}</span>${L.reviewer ? `<span><strong>${esc(ui.reviewer)}:</strong> ${esc(L.reviewer)}</span>` : ''}${d.published ? `<span><strong>${esc(ui.published)}:</strong> <time datetime="${d.published}">${fmt(d.published)}</time></span>` : ''}${d.modified ? `<span><strong>${esc(ui.updated)}:</strong> <time datetime="${d.modified}">${fmt(d.modified)}</time></span>` : ''}</p>`;
}
export function draftBanner(ctx) {
  if (ctx.mode !== 'preview') return '';
  return `<div class="sx-draft"><div class="sx-wrap"><strong>${esc(ctx.ui.draft)}</strong>${esc(ctx.page.id)} · ${esc(ctx.page.status)} · noindex</div></div>`;
}
export { symbols };

function docForm(ctx, b, id) {
  const m = b.meta || {}, lang = ctx.lang;
  const meta = `<div class="sx-docmeta"><img src="${ctx.site.assets.logo}" width="120" height="68" alt="${esc(ctx.site.brand)}"><dl><div><dt>${lang === 'es' ? 'Versión' : 'Version'}</dt><dd>${esc(m.version || '0.1 (draft)')}</dd></div><div><dt>${lang === 'es' ? 'Actualizado' : 'Updated'}</dt><dd>${esc(m.date || '')}</dd></div><div><dt>${lang === 'es' ? 'Autor' : 'Author'}</dt><dd>${esc(ctx.site.person.name)}</dd></div><div><dt>Web</dt><dd>controldechinches.es</dd></div></dl></div>`;
  const fields = (b.fields || []).map(f => `<div class="sx-field"><label>${esc(f)}</label><span class="sx-line"></span></div>`).join('');
  const table = b.table ? `<div class="sx-tablewrap" tabindex="0" role="region" aria-label="${esc(b.h2 || '')}"><table class="sx-table sx-formtable"><thead><tr>${b.table.head.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${Array.from({ length: b.table.rows || 8 }, () => `<tr>${b.table.head.map(() => '<td>&nbsp;</td>').join('')}</tr>`).join('')}</tbody></table></div>` : '';
  const checks = b.checks ? `<ul class="sx-checklist">${b.checks.map(x => `<li><span class="sx-box" aria-hidden="true"></span>${x}</li>`).join('')}</ul>` : '';
  return `<section class="sx-block sx-docform">${meta}${b.h2 ? `<h2 id="${id}">${esc(b.h2)}</h2>` : ''}${b.intro ? `<p>${b.intro}</p>` : ''}${fields ? `<div class="sx-fields">${fields}</div>` : ''}${checks}${table}${b.note ? `<p class="sx-tool-note">${b.note}</p>` : ''}</section>`;
}
