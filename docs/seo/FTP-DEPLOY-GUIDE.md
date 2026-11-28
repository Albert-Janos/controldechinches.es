# FTP-DEPLOY-GUIDE — kézi élesítési útmutató (controldechinches.es)

Készült: 2026-11-28 · Csomag: `C:\Users\lakas\Desktop\controldechinches-production\` + `C:\Users\lakas\Desktop\controldechinches-production.zip` (a `tools/make-ftp-package.mjs` állítja elő a `develop/seo` legfrissebb forrásából).
**Semmit nem töltöttem fel és nem deployoltam; a feltöltést te végzed kézzel, a jelenlegi oldal biztonsági mentése után.** A régi csomag biztonságosan elkülönítve: `…\controldechinches-production-OLD-2026-11-28` (mappa és ZIP) — nem aktuális, ne töltsd fel.

> ⚠ **A csomag technikailag kész, de a nyilvános élesítése jogi/működési feltételekhez kötött** (8. pont). A csomag a 80 új oldalt (40 oldalpár) is tartalmazza; a döntés, hogy mikor kerüljenek ki, a tiéd.

## 1. Mi van a csomagban
- **430 fájl, 23 984 389 bájt (22,9 MB) kitömörítve, ZIP: 22 264 166 bájt (21,2 MB).** A ZIP gyökere = a domain dokumentumgyökere (`public_html/`): `.htaccess`, `index.html`, `robots.txt`, `sitemap.xml` közvetlenül a gyökérben; nincs felső „controldechinches-production/” mappa; az útvonalak `/` elválasztójúak.
- **Kanonikus host: `https://www.controldechinches.es`** (www) — a canonical/hreflang/sitemap is ezt használja.
- **86 indexelhető URL** a sitemapban (43 ES + 43 EN). Noindex marad: `404.html`, `gracias.html`, `aviso-legal.html`, `politica-privacidad.html` (a két jogi oldal a `[PENDIENTE]` mezők miatt, lásd 8. pont).
- **Új tartalom:** 40 oldalpár (szolgáltatások, városok, GYIK, bemutatkozás, zónák, erőforrások, kalkulátor-/árak, esettanulmány-galéria, tudásközpont, atlasz…), **12 PDF** (`assets/pdf/`), a PDF-motor és az online észlelési adatlap JS-e (`js/pdf.js`, `js/pdf-docs.js`, `js/detect.js`, `js/quote.js`, `js/track.js`, `js/resources.js`, `js/prices.js`), `assets/pdf-logo.jpg`.
- **Nincs benne:** `.git`, titkok/`.env`, `node_modules`, `docs/`, `tools/`, `tests/`, `data/`, `templates/`, belső SEO-dokumentáció, nyers képek, Draft/preview/`__dev` oldalak, tesztfájl, nem hivatkozott média (az eredeti videó- és képforrások a forrásmappában megmaradnak; a videó már nincs a publikus oldalon). Allowlist-alapú csomagoló; a ZIP kibontva is átment a validátoron (0 hiba). Titokkereső: 0 találat.

## 2. Mely meglévő fájlokat írja felül a csomag (14 db)
`.htaccess`, `404.html`, `gracias.html`, `index.html`, `en/index.html`, `precios.html`, `en/prices.html`, `chinches-apartamentos-turisticos/index.html`, `en/bed-bugs-holiday-rentals/index.html`, `js/landing.js`, `assets/site.css`, `aviso-legal.html`, `politica-privacidad.html`, `sitemap.xml`.
- **Telefon és WhatsApp:** az egész weboldalon egyetlen szám van: **+34 605 259 206** (`tel:+34605259206`, `https://wa.me/34605259206`); minden normál WhatsApp-gomb előre kitöltött üzenet nélküli (a védett oldalakon is). Üzenetet csak az árkalkulátor és az online észlelési adatlap állít össze.
- **Árak, kalkulátor, kiszállás:** a 6 védett oldal mostantól a központi konfigból generált bruttó árakat, az új kalkulátort, a 18 települést és a kiszállási díjtáblázatot tartalmazza (tulajdonosi jóváhagyott kivételek). A hero-blokkok, CTA-k és a konverziós szerkezet nem változtak.
- **`.htaccess`**: **előbb töltsd le az élő `.htaccess`-t, és hasonlítsd össze**; a szervervezérelt sorokat (PHP-kezelő, cPanel-blokk) őrizd meg.
- A **25 változatlan** meglévő fájl (pl. `js/main.js`, `js/measurement-config.js`, `404.html`, `gracias.html`, `robots.txt`, `favicon/*`, régi `assets/*`) azonos az éles állapottal.
- **Törölni semmit nem kell.** Ne használj „szinkronizálás törléssel” módot.

## 3. Megőrzendő szerveroldali fájlok (NEM része a csomagnak)
`send-form.php`, `config.php`/`config.sample.php` (titkos adatok!), `lib/`, `logs/`, `regi-oldal-backup/`, `cgi-bin/`, `.well-known/` (SSL), `error_log`, a tárhely-specifikus `.htaccess` sorok, e-mail/cron beállítások, SSL-tanúsítvány. A foglalási rendszer, az AI-diszpécser (Retell) és a szerveroldali űrlapok nem érintettek. **A szerver tényleges konfigurációja ebből a környezetből nem érhető el** — ezért az ellenőrzés a feltöltés utáni lépésekben (5. pont) történik.

## 4. Lépések
1. **Teljes biztonsági mentés** (cPanel → Backup vagy a teljes `public_html` letöltése); külön mentsd az élő `.htaccess`-t.
2. Bontsd ki a ZIP-et ideiglenes mappába (a gyökérben legyen `index.html` és `.htaccess`).
3. Először az **új** fájlokat/mappákat töltsd fel (`assets/`, `js/` új fájljai, `servicios/`, `zonas/`, `preguntas-frecuentes/`, `recursos/`, `casos-reales/`, `sobre-mi/`, `guia-chinches/`, `atlas-chinches/`, `identificador-chinches/`, `politica-editorial/`, `en/…`).
4. Utána a módosuló fájlokat: `js/landing.js` + `assets/site.css` → `*.html` → `sitemap.xml` → **utolsóként a `.htaccess`** (előtte diff az éles verzióval).
5. Kapcsold be a rejtett fájlok megjelenítését. Üríts cache-t (LiteSpeed), ha van.

## 5. Ellenőrzés feltöltés után
```powershell
curl.exe -I https://controldechinches.es/                                   # 301 -> https://www.controldechinches.es/
curl.exe -I https://www.controldechinches.es/zonas/benidorm/                # 200
curl.exe -I https://www.controldechinches.es/zonas/benidorm/index.html      # 301 -> /zonas/benidorm/
curl.exe -I https://www.controldechinches.es/assets/pdf/parte-de-deteccion-chinches.pdf   # 200, application/pdf
curl.exe -s https://www.controldechinches.es/sitemap.xml | findstr /c:"<loc>"  # 86 sor
```
Kézzel (mobil és asztali): főoldal; `/precios.html` kalkulátor (válassz Benidormot, 3 hálószoba + szárazgőz → **373,89 €**), WhatsApp-gomb megnyitja az előre kitöltött üzenetet; `/recursos/` PDF-ek letöltése; `/recursos/parte-de-deteccion/` kitöltés, PDF, nyomtatás; `/casos-reales/` nagyítás; nyelvváltó ES↔EN; telefon- és WhatsApp-gombok.

## 6. Indexelhetőség ellenőrzése
- A 86 URL `index, follow`; nézd meg a forrást egy oldalon (`<meta name="robots">`, `<link rel="canonical">`, `hreflang`). A fejlesztői/staging környezet továbbra is noindex.
- Search Console (a meglévő property): **URL-vizsgálat** a főoldalra, `/precios.html`-re, egy városi és egy szolgáltatási oldalra; a **„Lefedettség/Oldalak”** jelentésben nézd, hogy nincs „Kizárva noindex miatt” a 86 URL között.

## 7. Mikor küldhető be a sitemap?
**A sitemap nyilvános URL-je: `https://www.controldechinches.es/sitemap.xml`** (86 URL).
A feltöltés és az 5. pont ellenőrzése után, **és csak ha a nyilvános élesítés jogi feltételei teljesültek (8. pont)**. Search Console → Sitemapek → `https://www.controldechinches.es/sitemap.xml` (86 URL). Ha a szolgáltatásoldalak kikerülnek, de a jogi adatok még nincsenek meg, vedd fontolóra a jogi oldalak és a szolgáltatás-leírások kiegészítését az indexelés előtt.

## 8. Milyen valódi jogi/működési feltételek hiányoznak még
Részletesen: `FINAL-OWNER-INPUT-REQUIRED.md` 1. csoport, és `LEGAL-RESEARCH-2026-11-28.md`. Röviden: spanyol vállalkozási forma, NIF/cím/e-mail a jogi oldalakra (jelenleg `[PENDIENTE]`); a 21 % IVA ellenőrzése; a magyar szakképesítés spanyolországi elismerése és a ROESB/autonóm közösségi feltételek; a használt készítmények jegyzéke; adatvédelmi tájékoztató kiegészítése. **Amíg ezek nincsenek meg, a technikailag elkészült csomag élesítése jogilag nem teljes.** Az oldalak nem sugallnak spanyol működési jogosultságot.

## 9. Visszaállítás (rollback)
- **Gyors:** a mentésből töltsd vissza a 14 felülírt fájlt (2. pont); az új mappák ettől függetlenül elérhetők maradnak.
- **Teljes:** töröld az új mappákat és `assets/img`, `assets/pdf`, `assets/fonts`, `assets/seo.*`, `assets/pdf-logo.jpg`, `js/{prices,quote,track,pdf,pdf-docs,detect,resources}.js` fájlokat, majd Search Console-ban kérd az eltávolítást, ha már indexelődtek.
- Ha csak a `.htaccess` okoz 500-as hibát: töltsd vissza az eredetit.
