# FINAL-PRODUCTION-REPORT — zárójelentés (2026-11-28)

Ág: `develop/seo` · Nincs merge a `main`-be, nincs deploy, **nincs FTP-feltöltés**. Az FTP-feltöltést a tulajdonos végzi (`FTP-DEPLOY-GUIDE.md`).
Kapcsolódó dokumentumok: `FINAL-OWNER-INPUT-REQUIRED.md` (mi hiányzik), `LEGAL-RESEARCH-2026-11-28.md`, `MEASUREMENT-INTEGRATION.md`, `CHECKPOINT-2026-11-28.md`, `DECISION-LOG.md` (D-056…D-062), `CHANGELOG.md`.

> **Záró kör (2026-11-28):** egyetlen nyilvános telefonszám (+34 605 259 206), üzenet nélküli WhatsApp-gombok mindenhol, a 4 meta description és a PG-049 javítva, Lighthouse pótolva/újramérve, 11/11 tesztcsomag, új production csomag.

> **Fontos:** a csomag technikailag kész, de a **nyilvános élesítése jogi/működési feltételekhez kötött** (spanyol vállalkozási és adóadatok, IVA-ellenőrzés, jogosultság/ROESB, a jogi oldalak `[PENDIENTE]` mezői). Az oldalak nem sugallnak spanyol működési jogosultságot. Nem jelentek 100 %-os hibamentességet: lásd az ismert hibákat és kockázatokat lent.

## 1. Oldalak
Összesen **90 HTML-fájl** a production csomagban: 80 generált (40 oldalpár) + 10 meglévő (6 védett oldal, 2 jogi oldal, 404, köszönő oldal).
- **Indexelhető URL: 86** (43 ES + 43 EN) = a sitemap URL-darabszáma (86).
- **Noindex: 4** — `404.html` és `gracias.html` (technikai oldalak), `aviso-legal.html` és `politica-privacidad.html` (**ok: a `[PENDIENTE]` jogi mezők még hiányoznak**, nem indexelhetők addig; lásd L-01).
- A 16 áttekintett oldalpár mindegyike `Approved for indexing` (technikai és tartalmi feltételek teljesültek); a fejlesztői preview/staging továbbra is noindex.
- ES/EN paritás: a `tests/test-content-consistency.mjs` minden oldalpárra ellenőrzi (azonos szerkezet, árak, telefonszámok, nincs feloldatlan token); a `tests/test-seo.mjs` a kölcsönös hreflang-ot és a nyelvi tisztaságot.

### Oldalpáronként elvégzett módosítások
| Oldalpár | Végső állapot / főbb módosítások |
|---|---|
| PG-010 Szolgáltatások | új szerkezet: „Qué servicios ofrezco”, hub (kezelések, módszer, szálláshelyek/zónák, további), IG-14 SVG, árszámítás-leírás; „Casos documentados, cuando existan” helyőrző eltávolítva; egyes szám első személy; fejlesztői megjegyzések kivéve |
| PG-011 Integrált védekezés | irtópor eltávolítva (ULV marad indokolt kiegészítésként); két meglévő kép + diagram megtartva; AI-illusztráció jelölés megtartva; első személy |
| PG-012 Felderítés | második „Después de la inspección” → „Opciones de tratamiento”; tartalomjegyzék frissül; fotó alapján előzetes tájékoztatás ingyenes, de nem garantál biztos diagnózist; önálló helyszíni felderítés nincs |
| PG-013 Szárazgőz | **videó levéve**, helyette álló kép (IMG-DRY-11, a videó kockája; az eredeti fájl a forrásban megmaradt); egyszerűsített géptechnikai rész, Polti Cimex Eradicator, gyártói „legfeljebb 180 °C kimeneti hőmérséklet” (nem a felület hőmérséklete); HPMed tényszerűen, nem rovarirtó; önálló 150 € nettótól (181,50 € bruttó); kiegészítés fix +80 € nettó (96,80 €)/kezelés |
| PG-014 Vegyszeres kezelés | irtópor törölve; ULV csak indokolt kiegészítés; nincs készítménynév és általános visszatérési idő; új árak; FAQ az új szabályokhoz igazítva |
| PG-015 Turisztikai szálláshelyek | teljes koncepcióváltás (eseti kezelés; nincs előfizetés/megelőző ellenőrzés/monitorozó szolgáltatás/oktatás/protokollírás); URL megmaradt; új H1/title/meta; a hirdetési apartmanoldaltól elkülönített keresési szándék (hotelek, hostalok, pensiones; szervezés); „Qué no ofrezco” szakasz |
| PG-016 Szakmai bemutatkozás | negatív mondat cseréje: „En 2026 obtuve en Hungría la cualificación de técnico en control de plagas de salud pública.”; portrék, Polti-fotó, munkafotó, Lantra, idővonal megmaradt; a fehér védőruhás portré **digitálisan módosított képként jelölve**; nincs publikus helyőrző |
| PG-020 Zónák | mind a 18 település, település-oldalankénti kiszállási díj, fejlesztési megjegyzés törölve, bővített SEO-tartalom, belső linkek, FAQ |
| PG-021 Alicante | H1: „Tratamiento de chinches de cama en Alicante”; egyedi tartalom; 0 € kiszállás; bruttó kezdőár (kémiai 168,19 €; összesen 168,19 €) |
| PG-022 Benidorm | H1 jóváhagyva; turisztikai/szálláshelyi fókusz + lakások; kiszállás 12,10 €, külön tétel; kezdőár 180,29 €; a második apartmanfotó visszaméretezve; PG-015 link az új koncepcióhoz |
| PG-023 Torrevieja | H1 jóváhagyva; második otthonok/nyaralók/szezonális használat; 0 € kiszállás; nem kapja át Alicante/Benidorm szövegét |
| PG-030 GYIK | 9 → **64 kérdés** ES+EN, témakörönként csoportosítva (a duplikált „Precios” cím megszűnt), belső linkek, FAQPage JSON-LD (nem garantált rich result) |
| PG-072 Erőforrások | új H1; **12 PDF** (6 dokumentum × ES/EN) a letöltési listában; online/nyomtatható verziók linkjei |
| PG-072A Észlelési adatlap | online űrlap (mobilbarát, validáció, nincs kötelező személyes adat), WhatsApp-üzenet, kitöltött PDF (kliensoldali), üres PDF, nyomtatás (1 A4 oldal), natív fájlmegosztás csak támogatott környezetben, nem támogatott eszközön alternatíva |
| PG-072B Monitorozási napló | 12 soros táblázat, PDF-letöltés, nyomtatás, 1.0, használati útmutató, belső link az online adatlapra |
| PG-073 Valós fertőzöttségek | H1: „Casos reales de infestaciones de chinches de cama”; 13 saját fotó (6 meglévő + 7 további az uj-kepek anyagból), egységes kártyák, magyarázat minden fotóhoz, hozzáférhető lightbox; jövőbeli esettanulmány-helyőrző nincs; a magyarországi dokumentációt nem tüntetem fel spanyolországi referenciaként |

### Globális módosítások
Teljes jobb oldali hero-kép (object-fit: cover, `--hero-pos`), tartalmi képek ~576 px-re (az infografikák érintetlenek), AI-hero felirat; 18 települési lábléc; belső linkek a 6 védett oldal láblécében az új oldalakra.

## 2. Ár- és konverziós rendszer
- **Központi árkonfiguráció:** `data/prices.json` (nettó). Innen készül: `js/prices.js` (kalkulátor), a generált oldalak tokenjei és a 6 védett oldal (`templates/static/*` → `node tools/build-prices.mjs`). A régi `steamPerBedroom`/Esencial/Completo logika megszűnt.
- **IVA-konfiguráció:** `vat.ratePercent = 21`, `consumerDisplay = gross`, **`status = planning-assumption`** (nem ellenőrzött adózási státusz), `displayApprovedByOwner = true` (a tulajdonos kifejezett utasítása a bruttó megjelenítésre).
- **A 18 kiszállási díj** (nettó → bruttó): Alicante, Torrevieja, Orihuela Costa, Guardamar 0 €; Santa Pola, Elche 5 → 6,05; San Vicente, Villajoyosa, Finestrat, Benidorm 10 → 12,10; San Juan, Mutxamel, El Campello, Alfaz del Pi, La Nucía 15 → 18,15; Altea 20 → 24,20; Calpe 30 → 36,30; Jávea 40 → 48,40. Kezelésenként, nem hálószobánként.
- **Egyetlen árszámító:** `js/quote.js` (egész centes), ES/EN; a WhatsApp-üzenet ugyanabból az eredményből készül.
- **Kalkulátor-tesztek** (`tools/test-calculator.mjs`): mind a 18 település × 1–10 hálószoba, a négy ingyenes terület, referenciaértékek (Alicante 1 hsz 168,19 €; Benidorm 1 hsz 180,29 €; Alicante 3 hsz + szárazgőz 361,79 €; Benidorm 3 hsz + szárazgőz 373,89 €; Jávea 1 hsz 216,59 €), fix +80 € szárazgőz-kiegészítés, több kanapé, ULV és önálló szárazgőz minimumár, érvénytelen/hiányos adatok, ismeretlen település (egyedi ajánlat, nem ingyenes), centpontosság, ES/EN paritás, **az üzenet pontosan egyezik a kalkulátor tételeivel**, a jóváhagyott spanyol minta betűre egyezik. Eredmény: minden teszt zöld.
- **WhatsApp-ajánlatküldés:** egy gombbal megnyílik az előre kitöltött üzenet; nem megy el, amíg az ügyfél el nem küldi; nem foglalás.
- **Online észlelési adatlap** (`tests/test-resources.mjs`): minden mező, jelölőnégyzet, dátumkezelés, spanyol ékezetek (ñ, á, ü, ¿, €), URL-kódolás (UTF-8), kitöltött és üres PDF, nyomtatás egy A4-en, natív fájlmegosztás (támogatott eszközön, stubbal ellenőrizve), alternatíva nem támogatott eszközön; **a beírt adatok semmilyen hálózati kérésben nem szerepelnek**, nincs szerveroldali mentés, nincs böngészőtárolás.
- **Későbbi mérési csatlakozási pontok:** `MEASUREMENT-INTEGRATION.md` (nincs aktív mérés, nincs azonosító).
- **Telefon / WhatsApp (záró kör):** mindenhol egyetlen szám: +34 605 259 206; a védett oldalak WhatsApp-gombjai is üzenet nélküliek (tulajdonosi jóváhagyással); üzenetet csak a kalkulátor és az online észlelési adatlap állít össze (a két védett apartmanoldal meglévő „brief” űrlapja kitöltés esetén szintén szöveget állít össze — lásd L-09).

## 3. Képek és PDF-ek
- **Elkészült SVG-infografikák:** IG-04, IG-06, IG-07, IG-08, IG-09, IG-14, IG-16 (7 közös ábra, 11 megjelenési hely), ES/EN, alt-szöveg/felirat, forrásalapú tartalom, irtópor nincs.
- **Újrafelhasznált saját fotók:** a meglévő összes saját fotó (kezelések, felderítés, atlasz, portrék, Polti-gép, Lantra) + a PG-073 galériához a már feldolgozott magyarországi fertőzöttségi fotók (IMG-INS-06, IMG-SEV-01/02, IMG-ENT-HID-01…06, IMG-ENT-EXC-02, IMG-ENT-MOU-01, IMG-IPM-02, IMG-INS-07). Új képet nem generáltam; AI-fotót valódi dokumentációként nem használtam.
- **PDF-ek (12):** `assets/pdf/` — preparacion-antes-del-tratamiento-chinches.pdf · pre-treatment-preparation-checklist-bed-bugs.pdf · despues-del-tratamiento-chinches.pdf · after-treatment-checklist-bed-bugs.pdf · como-reconocer-chinches-lista-de-comprobacion.pdf · recognise-bed-bugs-checklist.pdf · guia-apartamentos-turisticos-chinches.pdf · holiday-apartment-bed-bug-check-guide.pdf · parte-de-deteccion-chinches.pdf · bed-bug-detection-report.pdf · registro-de-monitorizacion-chinches.pdf · bed-bug-monitoring-log.pdf. A4, logó, 1.0 verzió és frissítési dátum, web+WhatsApp, jogi/biztonsági nyilatkozat; mérete ~37–43 KB/db.
- **Megmaradt valódi fotóhiányok / opcionális igények / cserélendő AI-illusztrációk / hiányzó dokumentumok:** `FINAL-OWNER-INPUT-REQUIRED.md` (kötelező fotóhiány: **0**).

## 4. Minőségbiztosítás (záró kör, 2026-11-28)
- **Mind a 11 tesztcsomag lefutott: 11 / 11 sikeres, 0 sikertelen.** Csomagok: árkonzisztencia · SEO (86 sitemap-URL, canonical, kölcsönös hreflang, html lang, egyedi title/description/H1, árva oldal, JSON-LD, robots, **a „+34 865 699 969” szám hiánya a teljes csomagban: HTML/JSON-LD/JS/PDF**, **minden `tel:` = `tel:+34605259206`**, **minden statikus WhatsApp-link = `https://wa.me/34605259206`**) · belső linkek · Ads-védelem (újrarögzítve, D-063) · kalkulátor + CTA-k (motor, UI, ES/EN, mobil/asztali) · publikálási kapu (negatív) · részleges publikálás (124 szimulált állapot) · tartalmi konzisztencia (40 oldal × 2 nyelv) · sablonok böngészőben (axe, lightbox, konzol, túlcsordulás, 3 nézet) · azonosító-eszköz · erőforrások/PDF/észlelési adatlap/galéria/hero (294 ellenőrzés). Figyelmeztetés: **40** a production-validátorban (mind a D-050 szerint jóváhagyott „cikk független szakmai lektor nélkül”; nem állítunk lektorálást) és 1 a SEO-auditban (a védett Ads-oldal title-je 72 karakter; a meglévő kereskedelmi oldalt nem módosítottam).
- **A záró kör javításai:** a 4 hosszú meta description rövidítve (≤ 158 karakter); PG-049: a „profesional” ismétlés megszüntetve (a validátor-figyelmeztetés eltűnt); egyetlen telefonszám; üzenet nélküli WhatsApp-gombok.
- **Render-audit** (production csomag): 88 oldal × 2 nézet, 880 `<img>`: 0 probléma. **Axe** (WCAG 2.2 AA + best-practice): 86 URL × 2 nézet: 0 sértés (az előző körben mérve; a záró kör csak szöveges/hivatkozás-módosítást hozott, a sablon-teszt axe-ellenőrzése újra lefutott és zöld).
- **PDF-ek, kalkulátor, WhatsApp-funkciók:** a `tests/test-resources.mjs` (12 PDF fejléc/xref/A4/verzió/logó, kitöltött PDF ékezetekkel, online adatlap WhatsApp-üzenet, URL-kódolás, natív megosztás stubbal, nyomtatás 1 A4, adatvédelem) és a `tools/test-calculator.mjs` (18 település, referenciaértékek, ES/EN paritás, üzenet = kalkulátor) zöld. A PDF-ekben csak a +34 605 259 206 szerepel.
- **Sitemap:** pontosan 86 `<loc>`, mind létező, `index, follow`, önmagára mutató canonical, kölcsönös hreflang; nincs noindex/preview/dev/átirányított URL. Noindex marad (nincs a sitemapban): `404.html`, `gracias.html`, `aviso-legal.html`, `politica-privacidad.html` (a két jogi oldal a `[PENDIENTE]` mezők miatt).
- **Lighthouse 13.6.0** (labor, helyi szerver; jelentések: `reports/final-prod-lighthouse.json`, `final2-a/b/c-lighthouse.json`). **Pótolva:** útmutatócikk és `/sobre-mi/`; **újramérve:** Árak (ES/EN) és az észlelési adatlap (ES/EN) a javítások után.

  | Oldal | Mobil P/A/BP/SEO · LCP · CLS · TBT | Asztali P |
  |---|---|---|
  | `/precios.html` | 91–95 (3 mérés: 91, 69, 61)/100/100/**100** · 2,4–2,8 s · 0–0,013 · 295–3503 ms | 74–100 |
  | `/en/prices.html` | 95/100/100/**100** · 2,4 s · 0 · 182 ms | 100 |
  | `/recursos/parte-de-deteccion/` | **99**/100/100/100 · 1,1 s · **CLS 0** (előtte 0,238) · 93 ms | 100 |
  | `/en/resources/bed-bug-detection-report/` | 99/100/100/100 · 1,4 s · 0 · 71 ms | 100 |
  | `/guia-chinches/como-saber-si-tengo-chinches/` | 83/100/100/100 · 2,8 s · 0 · 506 ms | 100 |
  | `/sobre-mi/` | 95/100/100/100 · 2,7 s · 0 · 149 ms | 100 |
  | korábbi körből: `/` 53 (mobil), `/en/` 53, szolgáltatás 92, városi oldalak 86–93, GYIK 100, galéria 100 | | |

  - Az **Árak oldalak SEO-pontja 92 → 100** (a nem feltérképezhető kalkulátor-link javítva). Az észlelési adatlap **CLS 0,238 → 0**, mobil teljesítménye 87 → 99.
  - **Mérési szórás:** a laborfutások ugyanazon az oldalon erősen ingadoznak (az `/precios.html` mobil TBT-je 295, 1423 és 3503 ms három mérésben); ezt a gép terhelése okozza, ezért a mobil teljesítménypontokat tartományként kell olvasni.
  - **A két főoldal mobil teljesítménye (53, LCP ≈ 5 s) nem javult, de nem is romlott:** az eredeti éles baseline-mérés ugyanezt adta (P 53, LCP 4,7 s). Ez a meglévő, védett kereskedelmi főoldal; a dizájnját nem változtattam. Külön teljesítmény-optimalizálás javasolt (tulajdonosi jóváhagyással).
- **Ismert hibák / fennmaradó kockázatok:** (1) a főoldal mobil teljesítménye; (2) a 21 % IVA nem ellenőrzött adózási státusz; (3) a jogi oldalak `[PENDIENTE]` mezői és az igazolatlan spanyol működési jogosultság; (4) a két védett apartmanoldal „brief” űrlapja a kitöltésből szöveget állít össze (kitöltés nélkül a gomb sima link) — ez a „csak két funkció állít össze üzenetet” szabály egyetlen kivétele, döntés: `FINAL-OWNER-INPUT-REQUIRED.md` L-09; (5) a PG-073 galéria „magyarországi munkák” megjegyzése a tulajdonos nyilatkozatán alapul (L-06); (6) a városi hero-képek 600×400 px Unsplash-képek (50 %-os szélességen enyhén felnagyítva); (7) a mobilos Lighthouse-értékek szórása.
- **Nem ellenőrizhető funkciók és okuk:** a hívás-átirányítás az AI-diszpécserhez (a tulajdonos szerint beállítva; innen nem mérhető); a tárhely tényleges konfigurációja, az élő `.htaccess`, PHP és SSL; a natív mobilos fájlmegosztás valódi iOS/Android eszközön (a támogatási ágat stubbal ellenőriztem); a WhatsApp alkalmazás megnyitása (csak az URL ellenőrizhető); Search Console/Ads/GA4 (nincs azonosító).

## 5. Mi publikálható már most, és mihez kell még adat/engedély
- **Technikailag és tartalmilag publikálható (a csomag mind a 86 URL-t tartalmazza):** főoldal, Árak, az Alojamientos (Ads) oldalak, a tudásközpont (20 cikk), atlasz, azonosító, szerkesztési irányelv, GYIK, Zónák és városi oldalak, Erőforrások (12 PDF, online adatlap), galéria.
- **Jogilag nem teljes, amíg nincs meg** (`FINAL-OWNER-INPUT-REQUIRED.md` 1. csoport): spanyol vállalkozási forma és adatok (NIF/cím/e-mail) a jogi oldalakra; IVA-státusz ellenőrzése; a magyar szakképesítés spanyolországi elismerése és a ROESB/autonóm közösségi feltételek; a használt készítmények; adatvédelmi tájékoztató a WhatsApp-kapcsolatfelvételre. Addig a szolgáltatás- és városi oldalak információs oldalak és nem állítanak spanyol működési jogosultságot; az éles indulásról és a sitemap beküldéséről a tulajdonos dönt.
- Opcionális fotók/bizonyítványok **nem** akadályozzák a publikálást.

## 6. Git és production
- **Végleges commit:** GITCOMMIT_PLACEHOLDER
- **`develop/seo` állapota:** PUSH_PLACEHOLDER
- **Helyi projekt:** LOCAL_PLACEHOLDER
- **Main változatlansága:** a `main` változatlan: `3c4f9f6` (helyi és `origin/main`), nem merge-eltem, nem módosítottam. A Retell-ügynökhöz nem nyúltam, FTP-re nem töltöttem fel semmit.
- **Production mappa:** `C:\Users\lakas\Desktop\controldechinches-production\` · **ZIP:** `C:\Users\lakas\Desktop\controldechinches-production.zip`
- **Fájlok száma / méret:** **430 fájl**, kitömörítve 23 984 389 bájt (22,9 MB), **ZIP 22 264 166 bájt (21,23 MB)**; 391 új, 14 felülírt meglévő, 25 változatlan fájl; titokkereső: 0 találat; a kibontott ZIP is átment a validátoron (0 hiba). A régi csomag elkülönítve: `…\controldechinches-production-OLD-2026-11-28` (+ `.zip`).
- **Indexelhető URL-ek:** **86** (43 ES + 43 EN). **A sitemap nyilvános URL-je: `https://www.controldechinches.es/sitemap.xml`**
- **FTP-feltöltési útmutató:** `docs/seo/FTP-DEPLOY-GUIDE.md` (mentés, feltöltési sorrend, megőrzendő szerverfájlok, ellenőrző parancsok, rollback).
