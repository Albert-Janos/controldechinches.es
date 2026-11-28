# FTP-DEPLOY-GUIDE — kézi élesítési útmutató (controldechinches.es)

Készült: 2026-11-28 · Csomag: `controldechinches-production/` + `controldechinches-production.zip` (a `tools/make-ftp-package.mjs` állítja elő).
**Ezt a dokumentumot a fejlesztő csinálta; semmit nem töltöttünk fel és nem deployoltunk.** Az élesítést te végzed kézzel, a jelenlegi oldal biztonsági mentése után.

## 1. Mi van a csomagban
- **283 fájl, 18,2 MB kitömörítve, ZIP: 16,5 MB.** A ZIP gyökere = a domain dokumentumgyökere (`public_html/`): a `.htaccess`, `index.html`, `robots.txt`, `sitemap.xml` közvetlenül a ZIP gyökerében van, **nincs benne felső „controldechinches-production/” mappa**. A bejegyzések `/` elválasztójúak.
- **Kanonikus host: `https://www.controldechinches.es`** (az élő oldal minden non-www/HTTP kérést 301-gyel erre irányít, a canonical/hreflang/sitemap is www).
- **Nincs benne:** `.git`, `.env`/titkos kulcs, `node_modules`, dokumentáció (`docs/`), eszközök (`tools/`), tesztek, adatfájlok (`data/`), sablonok, belső SEO-nyilvántartás, nyers képek (`raw-images/`, `uj-kepek/`), Draft/preview oldalak, `*.md/*.csv/*.log/*.zip`, ideiglenes fájlok. A csomagoló allowlist alapú és automatikusan megtagadja a tiltott fájlokat; a ZIP kibontva is átment a production validátoron.
- **Új tartalom (54 indexelhető URL a sitemapban):** `/guia-chinches/` (hub + 20 cikk), `/atlas-chinches/`, `/identificador-chinches/`, `/politica-editorial/` és az angol párok (`/en/bed-bug-guide/…`, `/en/bed-bug-atlas/`, `/en/bed-bug-identifier/`, `/en/editorial-policy/`), valamint a hozzájuk tartozó `assets/` (képek, `seo.css`, `seo.js`, betűtípusok) és `js/prices.js`.

## 2. Mely meglévő fájlokat kell felülírni (12 db) — és melyek maradnak
A jelenlegi éles állapot = a `3c4f9f6` commit (a hash-ek ellenőrizve 2026-11-28-án). A csomagban **12 meglévő fájl tér el** az élőtől; ezeket kell felülírni:

| Fájl | Mi változik | Megjegyzés |
|---|---|---|
| `.htaccess` | az `index.html` → `/` 301-szabály minden mappára érvényes (új oldalak is), korábban jóváhagyott kisebb módosítások | **Előbb töltsd le az élő `.htaccess`-t és hasonlítsd össze** (lehet, hogy a tárhelyen szerkesztették). A szervervezérelt sorokat (pl. PHP-kezelő, cPanel blokk) őrizd meg. |
| `index.html`, `en/index.html` | lábléc: „Guía”/„Guide” link; korábban jóváhagyott hero-optimalizálás (AVIF/WebP), aria-címkék, JSON-LD-ajánlat | Ads-védett oldal: CTA, ár, telefon, WhatsApp, H1 **változatlan** (teszt zöld) |
| `precios.html`, `en/prices.html` | lábléc-link; árszámítás-egységesítés | A kalkulátor működését a teszt ellenőrizte |
| `chinches-apartamentos-turisticos/index.html`, `en/bed-bugs-holiday-rentals/index.html` | lábléc-link | Ads-landing |
| `js/landing.js`, `assets/site.css` | korábban jóváhagyott kalkulátor-/ár-javítás (landing.js importálja az új `js/prices.js`-t), kis CSS | **Együtt töltsd fel a `js/prices.js`-szel** |
| `aviso-legal.html`, `politica-privacidad.html` | az adatvédelmi oldalon egy hibás WhatsApp-ikon SVG-útvonal javítva (konzolhiba); a jogi `[PENDIENTE]` mezők **változatlanul** ott vannak | lásd 6. pont |
| `sitemap.xml` | 6 → 54 URL (hreflang + lastmod) | |

- **Változatlan (27 fájl):** `js/main.js`, `js/measurement-config.js` (analitika/konverziómérés), `404.html`, `gracias.html`, `robots.txt`, `favicon/*`, a régi `assets/*` képek stb. Feltöltheted őket újra, de nem kötelező.
- **Új fájlok (244):** minden más; nem ütköznek meglévőkkel.
- **Törölni semmit nem kell.** Ne feltételezd, hogy a tárhely tartalma törölhető.

## 3. Megőrzendő szerveroldali fájlok és beállítások (NEM része a csomagnak)
A repó és a `.htaccess`/`robots.txt` alapján ezek léteznek vagy létezhetnek a tárhelyen — **ne töröld, ne írd felül**:
`send-form.php`, `config.php` / `config.sample.php` (titkos adatok!), `lib/`, `logs/`, `regi-oldal-backup/`, `cgi-bin/`, `.well-known/` (SSL-ellenőrzés), `error_log`, a tárhely-specifikus `.htaccess`-sorok, e-mail/cron beállítások, az SSL-tanúsítvány. A foglalási rendszer, az árkalkulátor API-hívásai és az AI-diszpécser (Retell) **nem érintettek**: ezekhez nem nyúl a csomag.
Az FTP-kliensben **ne** a „szinkronizálás törléssel” (mirror/delete) módot használd.

## 4. Lépések
1. **Teljes biztonsági mentés** a jelenlegi tárhelyről (cPanel → Backup, vagy FTP-ről a teljes `public_html` letöltése). Külön mentsd az élő `.htaccess`-t.
2. Töltsd le a `controldechinches-production.zip`-et, bontsd ki egy ideiglenes mappába (a gyökérben legyen `index.html` és `.htaccess`).
3. **Először az új fájlokat/mappákat** töltsd fel (`assets/`, `guia-chinches/`, `atlas-chinches/`, `identificador-chinches/`, `politica-editorial/`, `en/…`, `js/prices.js`).
4. Utána a módosuló fájlokat: `js/landing.js` + `assets/site.css` → `*.html` oldalak → `sitemap.xml` → **utolsóként a `.htaccess`** (előtte diff az éles verzióval).
5. Rejtett fájlok (`.htaccess`) láthatósága: kapcsold be az FTP-kliensben a „rejtett fájlok megjelenítése” opciót.
6. LiteSpeed/cache: ürítsd a tárhely gyorsítótárát, ha van.

## 5. Ellenőrzés feltöltés után (5 perc)
```powershell
curl.exe -I https://controldechinches.es/                       # 301 -> https://www.controldechinches.es/
curl.exe -I https://www.controldechinches.es/guia-chinches/     # 200
curl.exe -I https://www.controldechinches.es/guia-chinches/index.html   # 301 -> /guia-chinches/
curl.exe -s https://www.controldechinches.es/sitemap.xml | findstr /c:"<loc>" | measure   # 54
```
Kézzel: főoldal (mobilon és asztalin) — WhatsApp és telefon gomb, árkalkulátor, foglalás/űrlap; `/precios.html`; a lábléc „Guía” link; egy cikk, az atlasz és az azonosító; a nyelvváltó (ES↔EN) 2–3 oldalon; sütibeállítás-gomb. Google Search Console: sitemap újraküldése, a `/guia-chinches/` és az atlasz „indexelés kérése”.

## 6. Ismert figyelmeztetések (a döntés a tiéd)
- Az **élő** `aviso-legal.html` és `politica-privacidad.html` `[PENDIENTE]` mezőket mutat (név, NIF, cím, e-mail, nyilvántartás): ez már most is így van az éles oldalon, a csomag nem rontja, de a jogi kapu (LGL-03) lezárása sürgős.
- A cikkeken **nincs független szakmai lektor** (és nem is szerepel); az atlasz 14 makrója **jelölt AI-illusztráció**.
- 16 oldal (szolgáltatások, zónák, GYIK, Sobre mí, B2B-erőforrások, esettanulmányok) **szándékosan nincs** a csomagban: lásd `PUBLICATION-MISSING-DATA.md`, B rész.

## 7. Visszaállítás (rollback)
- **Gyors:** a mentésből töltsd vissza a 12 felülírt fájlt (`.htaccess`, `index.html`, `en/index.html`, `precios.html`, `en/prices.html`, `chinches-apartamentos-turisticos/index.html`, `en/bed-bugs-holiday-rentals/index.html`, `js/landing.js`, `assets/site.css`, `aviso-legal.html`, `politica-privacidad.html`, `sitemap.xml`). Ezzel az oldal pontosan a régi állapotba kerül; az új mappák ettől függetlenül elérhetők maradnak.
- **Teljes:** töröld az új mappákat (`guia-chinches/`, `atlas-chinches/`, `identificador-chinches/`, `politica-editorial/`, `en/bed-bug-guide/`, `en/bed-bug-atlas/`, `en/bed-bug-identifier/`, `en/editorial-policy/`, `assets/img/`, `assets/fonts/`, `assets/seo.*`, `js/prices.js`), majd a Search Console-ban kérd az eltávolítást, ha már be lettek indexelve.
- Ha csak a `.htaccess` okoz hibát (500-as hiba): töltsd vissza az eredetit — az oldal azonnal működik.
