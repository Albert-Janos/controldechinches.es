# PERFORMANCE-STANDARDS

## 1. Célok
| Mutató | Cél | Mérés |
|---|---|---|
| LCP | ≤ 2.5 s | lab: Lighthouse (mobil, szimulált 4G + 4× CPU); **mező: CrUX/GSC Core Web Vitals, 75. percentilis**, ha van adat |
| INP | ≤ 200 ms | mező (CrUX); lab: TBT proxy |
| CLS | ≤ 0.1 | lab + mező |
| Lighthouse SEO | 100 | új és meglévő oldalakon |
| Lighthouse Performance (mobil) | ≥ 90 | új oldalak; a meglévőknél csak baseline |
| Akadálymentesség | WCAG 2.2 AA (Lighthouse a11y ≥ 95 + manuális) | ACCESSIBILITY-STANDARDS |

## 2. Baseline (P0)
Lighthouse **lefutott** a P0.1-ben (13.6.0, mobil+desktop, éles oldal, 2026-11-27: lásd CURRENT-STATE-AUDIT „Frissítés — P0.1” táblázat és `reports/live-baseline-lighthouse.json`); CrUX/GSC valós adat **nem igazolt** (nincs hozzáférés). Egyetlen informatív böngészőmérés az éles ES árak oldalon (nem szabványos labor): DOMContentLoaded 568 ms, load 930 ms, 8 erőforrás. A teljes baseline a P1-14 feladat; parancsok:
```powershell
npx lighthouse https://www.controldechinches.es/ --preset=perf --form-factor=mobile --output=json --output=html --output-path=./reports/lh-home
npx @axe-core/cli https://www.controldechinches.es/
```
A méréseket 3×, mediánnal; a jelentés dátummal és verzióval kerül a `reports/`-ba (nem éles).

## 3. Költségvetés az új oldalakra
HTML ≤ 70 KB (br/gzip előtt) · `seo.css` ≤ 25 KB gzip · JS **0** a tartalmi oldalakon (kivéve lightbox/identificador, ≤ 15 KB gzip, deferred) · betűtípus: önhosztolt **woff2 subset**, max. 2 súly, `font-display: swap`, preload csak a törzs-súlyra · nincs külső harmadik fél a tartalmi oldalakon (mérés csak a meglévő consent-kapus rendszeren át) · LCP-kép ≤ 140 KB.

## 4. Technikák
LCP-kép: `fetchpriority=high`, preload `imagesrcset`, nem CSS-háttér, mobil külön kivágás · képek AVIF/WebP + `srcset/sizes` + `width/height` (CLS) · kritikus CSS inline (< 8 KB) vagy egyetlen blokkolatlan CSS · cache: a meglévő `.htaccess` szabályai (kép 1 év immutable, CSS/JS `?v=` verzióval) — az új fájlok fájlnév-hash-t kapnak · nincs renderblokkoló JS · Brotli/gzip ellenőrzés (a `.htaccess` LiteSpeed-megjegyzése szerint) · layout shift: kép/iframe/lightbox méret előre foglalt · interakció: eseménykezelők passzívak, hosszú feladat < 50 ms.

## 5. Amit nem rontunk
Az Ads-mérés, a CMP/consent és a foglalási folyamat nem optimalizálható Lighthouse-pontért (ADS-PROTECTION). A meglévő oldalak javítása (pl. Google Fonts önhosztolás, JPEG→WebP) jóváhagyással, külön csomagban.

## 6. Folyamatos
Heti: Lighthouse CI a 6 védett + új oldalakon (SEO-MONITORING); havi: CrUX/GSC 28 napos és 90 napos összehasonlítás; regresszió-küszöb: Perf −5 pont, LCP +0.3 s, CLS +0.02 → hibajegy.

## Eszközök a helyi környezetben (telepítve: `tools/node_modules`, `npm install` a `tools/` mappában)
`node tools/audit-lighthouse.mjs <baseUrl> <név> [útvonalak]` (Lighthouse mobil+desktop) · `node tools/audit-axe.mjs` · `node tools/check-links.mjs` · `node tools/screenshots.mjs`. Új oldalak: `npm run build` után a Lighthouse a `tools/serve.mjs` helyi szerverén futtatható (nincs tömörítés → a pontszám tájékoztató; a végső mérés a preview-hoz történjen).


---
## Főoldali mobil-LCP optimalizálás (2026-11-27, helyi `develop/seo` ág, külön commit)
**Változtatás:** a főoldali (ES és EN) hero **CSS-háttérből valódi `<picture>`/`<img>`** lett (`fetchpriority="high"`, AVIF + WebP, mobil külön fájl, azonos `object-position` és azonos gradiens-fedés), a két `preload` kikerült; az AVIF-fájlok a **meglévő** képek származékai (`hero-0010.avif` 79 KB a 118 KB WebP helyett; `hero-0010-mobile.avif` 27 KB a 60 KB helyett; az eredeti képek érintetlenek); `.htaccess`: `image/avif` cache + MIME. Vizuális egyezés: **a pixelek / mobile: 0.07 % · / desktop: 0.46 % · /en/ mobile: 0.03 % · /en/ desktop: 0.46 % tér el** (nincs erősen eltérő pixel; a különbség az AVIF-tömörítésből ered). CTA-k, tracking, consent, URL-ek változatlanok (`tests/test-ads-protection.mjs` zöld az új baseline-nal).
**Kipróbált, de visszavont:** a Google Fonts önhosztolása a védett oldalakon. Elszigetelt mérésben (5 futás/változat) az önhosztolt betűtípus **+~200 ms szimulált TBT-t** okozott (a betűcsere utáni újraszámolás miatt), ezért a védett oldalak az eredeti Google Fonts hivatkozást kapták vissza; az új SEO-oldalak önhosztolt DM Sans-t használnak (D-020). Az önhosztolás a védett oldalakon külön, tulajdonosi döntést igénylő feladat (adatvédelmi előny vs. betűcsere-költség; subsetting + `font-display` stratégia kell).
**Mérés (helyi szerver gzip + éles cache-fejlécekkel, felváltva futtatott „előtte/utána”, Lighthouse 13.6.0, szimulált mobil/desktop; medián):**
| Oldal + mód | Futás | Perf | LCP ms | FCP ms | TBT ms | Átvitt KB |
|---|---|---|---|---|---|---|
| `/ mobile` | 5 | 97 → **97** | 2493 → **2437** | 1413 → 1411 | 0 → 0 | 1022 → 991 |
| `/ desktop` | 3 | 99 → **100** | 947 → **601** | 422 → 426 | 0 → 0 | 1079 → 1043 |
| `/en/ mobile` | 5 | 86 → **90** | 3658 → **3543** | 1423 → 1409 | 0 → 0 | 1022 → 990 |
| `/en/ desktop` | 3 | 99 → **100** | 939 → **717** | 413 → 414 | 0 → 0 | 1078 → 1042 |
**Valós (nem szimulált) throttling** — Chrome CDP: CPU 4×, 150 ms RTT, 1,6 Mbit/s, hideg cache, 412×823@1,75, 9 futás/oldal, medián:
| Oldal | Futás | LCP ms | FCP ms | TBT ms |
|---|---|---|---|---|
| `/` | 9 | 1348 → **1320** | 1316 → 1288 | 0 → 0 |
| `/en/` | 9 | 1340 → **1324** | 1312 → 1272 | 0 → 0 |
**Értelmezés (őszintén):** a szimulált mérések zajosak (az egyes futások LCP-je 2,3–5,3 s között ingadozik, ezért adtuk meg a mediánt és a futásonkénti értékeket a `reports/perf-home-lcp.json`-ban); a valós throttling szerint az LCP gyakorlatilag változatlan (~1,3–1,4 s), mert a kép már az első festéssel megjelenik. Az **egyértelmű nyereség**: kisebb hero-képek, felderíthető LCP-kép (`lcp-discovery`), egy kéréssel kevesebb. **Az éles hatás (ahol az LCP-t korábban 6,0 s-nak mértük) csak éles méréssel igazolható** — a deploy után 3 futásos Lighthouse + CrUX/GSC adat szükséges. Előtte/utána képernyőképek: `reports/perf-home-lcp/`.
