// Page templates T-A ... T-I. A page = JSON data + template id; see docs/seo/PAGE-TEMPLATES.md
import { esc, head, header, footer, breadcrumb, button, ctaBand, picture, figure, renderBlock, authorBox, sourcesBlock, relatedBlock, metaLine, draftBanner, symbols, pageUrl, absUrl, slug, unlinkDead, imgKind } from './components.mjs';

// ---------- JSON-LD ----------
export function jsonld(ctx, crumbs) {
  const { site, page, lang } = ctx, L = page[lang], url = absUrl(ctx, L.url);
  const org = { '@type': 'Organization', '@id': absUrl(ctx, '/') + site.ids.organization, name: site.brand, url: absUrl(ctx, '/'), telephone: site.phone, logo: absUrl(ctx, site.assets.logo) };
  const website = { '@type': 'WebSite', '@id': absUrl(ctx, '/') + site.ids.website, url: absUrl(ctx, '/'), name: site.brand, inLanguage: lang, publisher: { '@id': org['@id'] } };
  const personOn = site.person.published && ctx.included.has('PG-016');
  const person = personOn ? { '@type': 'Person', '@id': absUrl(ctx, site.person.id), name: site.person.name, worksFor: { '@id': org['@id'] }, url: absUrl(ctx, pageUrl(ctx, 'PG-016', lang) || '/') } : null;
  const wpType = { 'T-D': 'ProfilePage', 'T-H': 'CollectionPage', 'T-G': 'CollectionPage' }[page.template] || 'WebPage';
  const webpage = { '@type': wpType, '@id': url + '#webpage', url, name: L.title, description: L.description, inLanguage: lang, isPartOf: { '@id': website['@id'] }, breadcrumb: { '@id': url + '#breadcrumb' } };
  if (page.template === 'T-D' && person) webpage.mainEntity = { '@id': person['@id'] };
  const bc = { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: crumbs.map(([name, u], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(u ? { item: absUrl(ctx, u) } : { item: url }) })) };
  const graph = [org, website, webpage, bc];
  if (person) graph.push(person);
  if (['T-A', 'T-B', 'T-E'].includes(page.template)) {
    const svc = { '@type': 'Service', '@id': url + '#service', name: L.h1, url, description: L.description, provider: { '@id': org['@id'] }, areaServed: (page.areaServed || site.serviceAreas.confirmed).map(n => ({ '@type': 'City', name: n })) };
    if (page.offers) {
      const o = [];
      if (page.offers.includes('chemical')) o.push({ '@type': 'Offer', name: ctx.ui.chemical, priceSpecification: { '@type': 'PriceSpecification', minPrice: ctx.prices.chemical.bedroomPrices[0], priceCurrency: ctx.prices.currency } });
      if (page.offers.includes('steam')) o.push({ '@type': 'Offer', name: ctx.ui.steam, priceSpecification: { '@type': 'PriceSpecification', minPrice: ctx.prices.drySteamStandalone.from, priceCurrency: ctx.prices.currency } });
      svc.offers = o;
    }
    graph.push(svc);
  }
  if (['T-C', 'T-F'].includes(page.template)) {
    const d = page.dates || {};
    const art = { '@type': 'Article', '@id': url + '#article', headline: L.h1, description: L.description, inLanguage: lang, mainEntityOfPage: { '@id': webpage['@id'] }, author: person ? { '@id': person['@id'] } : { '@id': org['@id'] }, publisher: { '@id': org['@id'] } };
    if (d.published) art.datePublished = d.published; if (d.modified) art.dateModified = d.modified;
    if (L.heroImage && ctx.images[L.heroImage]?.status === 'ready') art.image = absUrl(ctx, `${ctx.images[L.heroImage].variants.dir}${ctx.images[L.heroImage].variants.base}-${ctx.images[L.heroImage].variants.widths.at(-1)}.webp`);
    graph.push(art);
  }
  if (page.template === 'T-G') {
    const imgs = (L.blocks || []).filter(b => b.type === 'gallery').flatMap(b => (b.groups || [{ images: b.images }]).flatMap(g => g.images));
    imgs.filter(id => ctx.images[id]?.status === 'ready').forEach(id => { const v = ctx.images[id].variants; graph.push({ '@type': 'ImageObject', '@id': url + '#image-' + id, contentUrl: absUrl(ctx, `${v.dir}${v.base}-${v.widths.at(-1)}.webp`), caption: ctx.images[id].caption?.[lang], creator: person ? { '@id': person['@id'] } : { '@id': org['@id'] } }); });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

// ---------- shared pieces ----------
function heroImage(ctx, L, eager = true) { return L.heroImage ? `<figure class="sx-hero-media">${picture(ctx, L.heroImage, { eager, sizes: '(min-width: 990px) 34rem, 100vw' })}</figure>` : ''; }
function heroNavy(ctx, variant = '') {
  const { page, lang, ui } = ctx, L = page[lang], c = ui.cta, key = page.cta?.message || 'default';
  const media = heroImage(ctx, L);
  return `<section class="sx-hero ${variant}${media ? '' : ' sx-hero--text'}" aria-labelledby="hero-title"><div class="sx-wrap sx-hero-grid"><div><p class="eyebrow">${esc(L.eyebrow || '')}</p><h1 id="hero-title">${esc(L.h1)}</h1><p class="sx-lead">${esc(L.lead || '')}</p><div class="actions">${page.cta?.hero === false ? '' : button(ctx, 'wa', c.whatsapp, key, 'hero') + button(ctx, 'tel', c.call, key, 'hero')}</div></div>${media}</div></section>`;
}
function renderBody(ctx, blocks) {
  const toc = [], parts = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i], next = blocks[i + 1];
    if (b.h2 && b.toc !== false) toc.push([b.id || slug(b.h2), b.h2]);
    // a vertical portrait straight after a text block sits BESIDE that text on desktop (stacked and compact on phones)
    if (b.type === 'text' && next?.type === 'figure' && imgKind(ctx, next.image) === 'portrait') {
      parts.push(`<div class="sx-split">${renderBlock(ctx, b, i)}${renderBlock(ctx, next, i + 1)}</div>`); i++; continue;
    }
    parts.push(renderBlock(ctx, b, i));
  }
  return { html: parts.join('\n'), toc };
}
function tocHtml(ctx, toc) {
  if (toc.length < 3) return '';
  return `<aside class="sx-toc" aria-label="${esc(ctx.ui.toc)}"><details open><summary>${esc(ctx.ui.toc)}</summary><ol>${toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join('')}</ol></details></aside>`;
}
function faqInline(ctx, L) {
  if (!L.faq?.length) return '';
  return renderBlock(ctx, { type: 'faq', items: L.faq, open: true }, 0);
}

// ---------- templates ----------
const templates = {
  // service-like pages: navy hero + blocks + FAQ + author + strong CTA
  service(ctx, strongCta = true, author = true) {
    const { page, lang } = ctx, L = page[lang], bc = breadcrumb(ctx), body = renderBody(ctx, L.blocks || []);
    return { crumbs: bc.items, main: `${bc.html}${heroNavy(ctx)}<div class="sx-wrap sx-layout${body.toc.length >= 3 ? ' sx-layout--toc' : ''}"><div class="sx-main">${body.html}${faqInline(ctx, L)}${relatedBlock(ctx)}${sourcesBlock(ctx)}${author ? `<section class="sx-block">${authorBox(ctx)}</section>` : ''}</div>${tocHtml(ctx, body.toc)}</div>${ctaBand(ctx, strongCta ? 'strong' : 'medium', page.cta?.message)}` };
  },
  article(ctx) {
    const { page, lang, ui } = ctx, L = page[lang], bc = breadcrumb(ctx), body = renderBody(ctx, L.blocks || []);
    const media = L.heroImage ? `<div class="sx-block">${figure(ctx, L.heroImage, { eager: true, usage: 'hero' })}</div>` : '';
    return { crumbs: bc.items, main: `${bc.html}<div class="sx-wrap"><header><p class="eyebrow">${esc(L.eyebrow || '')}</p><h1 id="hero-title" style="margin-top:.6rem;max-width:22ch">${esc(L.h1)}</h1>${L.answer ? `<div class="sx-answer"><h2>${esc(ui.shortAnswer)}</h2><p>${esc(L.answer)}</p></div>` : ''}${metaLine(ctx)}</header>${media}</div><div class="sx-wrap sx-layout${body.toc.length >= 3 ? ' sx-layout--toc' : ''}"><div class="sx-main">${body.html}${faqInline(ctx, L)}${relatedBlock(ctx)}${ctaBand(ctx, 'soft', page.cta?.message)}${sourcesBlock(ctx)}<section class="sx-block">${authorBox(ctx)}</section></div>${tocHtml(ctx, body.toc)}</div>` };
  },
  hub(ctx, cta = 'soft') {
    const { page, lang } = ctx, L = page[lang], bc = breadcrumb(ctx), body = renderBody(ctx, L.blocks || []);
    return { crumbs: bc.items, main: `${bc.html}<section class="sx-hero sx-hero--text" aria-labelledby="hero-title"><div class="sx-wrap sx-hero-grid"><div><p class="eyebrow">${esc(L.eyebrow || '')}</p><h1 id="hero-title">${esc(L.h1)}</h1><p class="sx-lead">${esc(L.lead || '')}</p></div></div></section><div class="sx-wrap sx-layout"><div class="sx-main">${body.html}${faqInline(ctx, L)}<section class="sx-block">${authorBox(ctx)}</section></div></div>${cta === 'none' ? '' : ctaBand(ctx, cta, page.cta?.message)}` };
  },
};
export const render = {
  'T-A': ctx => templates.service(ctx, true),
  'T-B': ctx => templates.service(ctx, true),
  'T-E': ctx => templates.service(ctx, false),
  'T-C': ctx => templates.article(ctx),
  'T-D': ctx => templates.service(ctx, false, false), // the author's own page needs no author box
  'T-F': ctx => templates.article(ctx),
  'T-G': ctx => templates.hub(ctx, 'medium'),
  'T-H': ctx => templates.hub(ctx, 'soft'),
  'T-I': ctx => templates.hub(ctx, 'medium'),
};

export function renderPage(ctx) {
  const { page, lang, ui, site } = ctx;
  const t = render[page.template]; if (!t) throw new Error(`unknown template ${page.template} on ${page.id}`);
  const out = t(ctx); out.main = unlinkDead(ctx, out.main); // links to unpublished pages inside prose become plain text
  const html = `<!doctype html>
<html lang="${ui.htmlLang}">
${head(ctx, jsonld(ctx, out.crumbs))}
<body id="top" data-page="${page.dataPage || 'seo'}" class="sx">
<a class="skip-link" href="#contenido">${esc(ui.skip)}</a>
${symbols}
${draftBanner(ctx)}
${header(ctx)}
<main id="contenido" tabindex="-1">
${out.main}
</main>
${footer(ctx)}
<script src="${site.scripts.menu}" defer></script>
<script src="${site.scripts.main}" type="module"></script>
<script src="${site.scripts.seo}" defer></script>
</body>
</html>
`;
  return html;
}
