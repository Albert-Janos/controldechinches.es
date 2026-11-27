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
Lighthouse/CrUX **nem futott** (nincs hozzáférés/eszköz a környezetben) → *nem igazolt*. Egyetlen informatív böngészőmérés az éles ES árak oldalon (nem szabványos labor): DOMContentLoaded 568 ms, load 930 ms, 8 erőforrás. A teljes baseline a P1-14 feladat; parancsok:
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
