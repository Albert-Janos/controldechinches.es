# TECHNICAL-SEO-SPEC — technikai infrastruktúra terve (P1)

Elv (D-002): statikus HTML, build-time generálás, minimális JS, **nincs keretrendszer-váltás**, nincs WordPress. A védett területek: ADS-PROTECTION.

## 1. Architektúra
```
data/           site.json · prices.json · services.json · areas.json · pages/*.json · images.csv(link)
content/es|en/  szövegek (Markdown/JSON, ember írja és hagyja jóvá)
templates/      T-A…T-I + komponensek (HTML-részletek)
tools/          build.mjs (Node, függőségmentes) · validate-*.mjs · images.mjs (sharp csak devDependency)
tests/          validátor-fixtúrák (nem publikus), Ads-regresszió
assets/seo.css  új CSS (.sx-)          assets/img/  pipeline-kimenet
(generált HTML a repóban, D-005; deploy-kizárás: docs/ tools/ tests/ data/ content/ templates/ _archive-private/)
```
A meglévő 8 HTML és a hozzájuk tartozó fájlok **átengedve (passthrough)**, a build nem nyúl hozzájuk.

## 2. Kötelező elemek (új oldalakon)
Egyedi `<title>` (≤ ~60 kar.) és `meta description` (~120–155 kar.) · 1 H1 · logikus H2–H3 · `<link rel=canonical>` (önmagára, abszolút, `https://www.`) · kölcsönös `hreflang` ES/EN + `x-default` (= ES) · `html lang` · breadcrumb (HTML + JSON-LD) · OG/Twitter meta · `meta robots` státuszkapu szerint · szemantikus HTML5 (`header/nav/main/article/aside/footer`) · skip-link · feltérképezhető `<a href>` belső linkek.

## 3. HTTP és URL
- Státusz: 200 / 301 egy lépésben / valódi 404 (`404.html`, `noindex`) / 410 szándékosan megszűnt. **Soft 404 tilos** (üres/„nincs találat” oldal 200-zal).
- Formátum: ES `/slug/`, EN `/en/slug/`; kisbetű, ékezet nélkül, záró perjel; nincs paraméteres duplikátum; `https://www.` az egyetlen kanonikus host (már él: non-www → www egy lépésben).
- Átirányítás-szabály: új `.htaccess` szabály csak jóváhagyással és külön teszttel (a meglévő `RewriteRule`-ok érintetlenek).
- Biztonsági fejlécek: a meglévők maradnak; javaslat: HSTS (jóváhagyással), `X-Robots-Tag: noindex` a preview-n.

## 4. Indexelés-kapuk
Státusz→robots: `Draft…Owner approved` = `noindex, nofollow` (preview mindig); `Approved for indexing` = `index, follow` + sitemap; `Published` = élesben. A build **megtagadja** a `Draft` oldal sitemapba írását és indexelhető meta-ját (hiba).

## 5. Sitemap és robots
- Egy `sitemap.xml` (index, ha > 500 URL) — csak jóváhagyott, kanonikus, indexelhető, 200-as URL; `xhtml:link` hreflang; `lastmod` = tényleges tartalmi módosítás (a tartalom hash-éből, nem build-időből); opcionális `sitemap-images.xml`.
- `robots.txt`: a meglévő marad; a belső útvonalnevek felsorolásának csökkentése jóváhagyással (alacsony prioritás).

## 6. Duplikáció és kanonikalizálás
Query-string és `index.html` változatok → 301/canonical; EN↔ES nem canonical egymásra; a kategória-/címke-/archívum-oldalak nem léteznek; az atlasz képei nem kapnak URL-t.

## 7. Build-time validáció (P1-12; CI vagy helyi parancs)
HTTP-hibák (preview-n) · törött belső linkek/képek · hiányzó/duplikált title és description · canonical hibák · hreflang-párosítás (minden ES-nek van EN-je és fordítva, kölcsönös) · sitemap-egyezés a státuszkapuval · nem kívánt `noindex`/indexelhető Draft · árva oldal (< 2 bejövő link) · duplikált URL · hibás JSON-LD (JSON-parse + séma-ellenőrzés) · hiányzó alt · túl nagy kép / formátum · kannibalizáció (azonos elsődleges kulcsszó két oldalon) · egymásra mutató linkek `nofollow`/`noindex` célpontra.

## 8. Telepítés
Éles deploy **tulajdonosi kézben marad** (jelenlegi módszer ismeretlen: OWNER-INPUT #4). Javasolt: egy zip/rsync a `dist`-jellegű fájllistából (build-manifest), a védett fájlok kizárásával, visszaállítási tervvel. A preview ugyanazt a build-et szolgálja.

## 9. Meglévő technikai hibák javítása
A-C2, A-M2…A-M12 → külön csomagok jóváhagyással (ROADMAP P1-15/16).
