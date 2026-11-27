# CHANGELOG — SEO-projekt

Formátum (minden érdemi változásnál): **dátum · változás · ok · kiindulási állapot · várt eredmény · tényleges eredmény (28/90 nap) · további teendő**. A weboldal élő fájljainak változásait itt és a git-történetben is követjük.

## 2026-11-27 — P0 (audit, kutatás, tervezés)
- **Változás:** `docs/seo/` dokumentációs készlet létrehozva (strukturált, nem publikus). **A weboldal fájljai, képei, CSS-e, JS-e, trackingje, diszpécsere és az éles deploy érintetlen.**
- **Ok:** P0 fázis a mesterterv szerint.
- **Kiindulási állapot:** `3c4f9f6`; 6 indexelhető URL; üres mérési konfig; A-C1/A-C2/A-C3 kritikus megállapítások (CURRENT-STATE-AUDIT).
- **Várt eredmény:** tulajdonosi jóváhagyás után a P1 indítható.
- **Tényleges eredmény:** –
- **Tennivaló:** P0 jóváhagyási pont (P0-CLOSING-REPORT).

## 2026-11-27 — P0 jóváhagyás után: P0.1 + P1 (helyi `develop/seo` ág, nincs deploy)
- **Árak egységesítése (`5c10490`)** · ok: A-C1/A-C2, tulajdonosi árlogika · kiindulás: Esencial/Completo + ES/EN eltérés + konzolhiba · várt: egységes árak, hibamentes kalkulátor · eredmény: `tools/check-prices.mjs` és `tools/test-calculator.mjs` zöld · teendő: kiegészítők jóváhagyása (D-018), deploy tulajdonosi jóváhagyással.
- **a11y/og:image (`c2c9e3d`)** · ok: axe, linkellenőrzés · eredmény: 0 axe-hiba, 0 törött belső hivatkozás.
- **P1 infrastruktúra (`94c3e0f`, `095cc03`)** · generátor, 9 sablon, design system, csomagoló, képpipeline, minőségkapu, Ads-regresszió · eredmény: `tools/test-all.mjs` · teendő: tartalom (blokkolók: OWNER-INPUT).
- **Éles baseline mérés** · Lighthouse 13.6.0 mobil+desktop, axe 4.14.1, link-ellenőrzés: CURRENT-STATE-AUDIT „Frissítés — P0.1”.

## 2026-11-27 (folytatás) — főoldali LCP, P2–P7 piszkozatok, helyi előnézet
- **Főoldali hero `<picture>`** + AVIF (`perf(home)` commit) · ok: tulajdonosi engedély a mobil-LCP javítására · kiindulás: CSS-háttér + 2 preload, LCP 6,0 s (éles Lighthouse, szimulált) · eredmény: lásd PERFORMANCE-STANDARDS „Főoldali mobil-LCP optimalizálás” (valós throttlingon LCP változatlan, nyereség: bájtok, felderíthetőség; éles igazolás deploy után) · tennivaló: éles mérés; font-önhosztolás külön döntés.
- **80 generált oldalfájl (40 oldaldefiníció, ES+EN) piszkozatként** (hub, IPM, szolgáltatások, Sobre mí, GYIK, zónák, atlasz, azonosító, dokumentumok, 20 forrásalapú cikk) · helyi előnézet + fejlesztői index · mind Draft/noindex, `dist/`-be nem kerül.
- **Beágyazott SVG-infografikák** (IG-01, 02, 10–13, 15), nyomtatható űrlap-sablon (`docform`), `OWNER-INPUT-REQUIRED.md` egyesítve (12 téma, prioritással).
