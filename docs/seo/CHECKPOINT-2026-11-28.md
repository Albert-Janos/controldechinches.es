# CHECKPOINT — 2026-11-28 (véglegesítési csomag lezárva)

**Állapot:** a prompt összes végrehajtható pontja elkészült; a tesztek lefutottak (részletek: `FINAL-PRODUCTION-REPORT.md`). Nincs félbehagyott munka.

## Hol dolgozz tovább
- Ág: `develop/seo` (a munka egy worktree-ben, `claude/controldechinches-finalization-47a162` ágon készült, és `develop/seo`-ra lett pusholva; a `main` érintetlen).
- Build: `node tools/build.mjs --mode production --out dist-pages` · csomag: `node tools/make-ftp-package.mjs --out C:/Users/lakas/Desktop/controldechinches-production --zip C:/Users/lakas/Desktop/controldechinches-production.zip`.
- Teljes tesztcsomag: `node tools/test-all.mjs` (Chrome/Edge kell; `tools/node_modules` a fő checkoutból).
- Árváltoztatás: `data/prices.json` → `node tools/build-prices.mjs` (js/prices.js + 6 védett oldal) → build.
- PDF-ek: `node tools/build-pdfs.mjs` (forrás: `js/pdf-docs.js`).

## Hátralévő (csak tulajdonosi bemenettel)
Lásd `FINAL-OWNER-INPUT-REQUIRED.md` (jogi adatok, bizonyítványok, opcionális fotók, mérési azonosítók) és `LEGAL-RESEARCH-2026-11-28.md`.

## Tudnivalók a következő munkamenethez
- A 6 védett oldal gyökérfájljai **generáltak** a `templates/static/*` sablonokból (`tools/build-prices.mjs`); közvetlenül ne szerkeszd, hanem a sablont.
- Az Ads-védelmi baseline újra rögzítve (D-058); a `data/ads-protection.json` `baselineCommit` mezője az új állapotra mutat.
- A `tools/node_modules`, `raw-images/`, `uj-kepek/` a fő checkoutból junctionnel kapcsolódik a worktree-be (nem verziózott).
