# FINAL-OWNER-INPUT-REQUIRED — ami ténylegesen még hiányzik (tulajdonosi lista)

Készült: 2026-11-28, a végleges production-csomag után. **Nem a korábbi hiánylisták másolata**: minden tételt újra ellenőriztem a ténylegesen megépített oldalakon (mi készült el, mi került be, mi vált szükségtelenné). A korábbi listák (`OWNER-INPUT-REQUIRED.md`, `PUBLICATION-MISSING-DATA.md`, `MISSING-IMAGES.md`) történeti dokumentumok; **ez az egyetlen érvényes lista**.

Jelmagyarázat — *Akadály*: „igen” = az élesítés jogi/működési okból nem tehető meg nyilvánosan ennek hiányában (a technikai csomag kész); „nem” = az oldal így is élesíthető és működik. *Később pótolható*: igen = utólag, külön csomagban bevezethető.

## Összesítés — mennyi minden hiányzik még
| Csoport | Tétel | Darab |
|---|---|---|
| 1. Kötelező jogi/adminisztratív adatok | információ / dokumentum | 9 tétel |
| 2. Később feltöltendő bizonyítványok | dokumentum | 3 (magyar bizonyítvány + hivatalos spanyol fordítás + Europass) |
| 3. Valóban szükséges saját fényképek | fotó | **0** |
| 4. Opcionális, minőségjavító fotók | fotó | 10 hely (ebből 4 „ABOUT”) |
| 5. Később cserélhető AI-illusztrációk | kép | 20 AI-kép jelölve (14 atlasz-makró + 6 egyéb) |
| 6. Google Ads / analitika | azonosító | 4–5 érték |
| 7. További opcionális fejlesztések | feladat | 6 |

Fotó szempontból **semmi sem kötelező**: a weboldal egyetlen hiányzó kép miatt sem törött, sehol nincs üres képhely vagy helyőrző.

## 1. Kötelező jogi és adminisztratív adatok (a nyilvános élesítés feltételei)
| ID | Érintett oldal | Szekció | Mi hiányzik | Db | Miért kell | Kötelező? | Prior. | Akadály? | Később? |
|---|---|---|---|---|---|---|---|---|---|
| L-01 | `/aviso-legal.html`, `/politica-privacidad.html` (az oldalak jelenleg `noindex`, `[PENDIENTE]` mezőkkel) | Szolgáltató azonosítása | Spanyol vállalkozási forma, név/cégnév, adószám (NIF/CIF), cím, e-mail, elérhetőség — a spanyol LSSI-CE/fogyasztóvédelmi kötelező tájékoztatás | 5 adat | A jogi oldalak nem nyilváníthatók indexelhetőnek `[PENDIENTE]` mezőkkel | igen | P0 | **igen** | nem |
| L-02 | minden árat mutató oldal | Árak | A 21 % IVA ellenőrzése a végleges vállalkozási/adózási helyzet szerint (jelenleg tulajdonosi *tervezési érték*, nem ellenőrzött adózási státusz) | 1 döntés | Fogyasztói bruttó árkommunikáció jogszerűsége | igen | P0 | **igen** | nem — a központi `data/prices.json` `vat.ratePercent` módosítható, újraépítés után minden oldal frissül |
| L-03 | `/sobre-mi/`, szolgáltatás- és városi oldalak | Jogosultság | A magyar szakképesítés spanyolországi elismerése, a tevékenység megkezdéséhez szükséges feltételek (carnet/capacitación RD 830/2010 szerint, ROESB-bejegyzés / értesítés a Comunitat Valenciana-ban) | 1 ügyintézés | Spanyol működési jogosultságot addig nem sugallunk, amíg nem igazolt. Lásd `LEGAL-RESEARCH-2026-11-28.md` | igen | P0 | **igen** | nem |
| L-04 | `/servicios/tratamiento-quimico/` | Készítmények | A ténylegesen használt, Spanyolországban engedélyezett biocid készítmények (hatóanyag, nyilvántartási szám, biztonsági adatlap, szellőztetési/visszatérési idő a címke szerint) | 1 lista | Az oldal készítményneveket szándékosan nem közöl; az információ az alkalmazott készítmény előírásaitól függ | igen (ellenőrzéshez) | P1 | nem (az oldal így helyes) | igen |
| L-05 | `/servicios/vapor-seco/` | HPMed | A HPMed professzionális használatának megerősítése (a biztonsági adatlap háztartási Polti-készülékhez írt mosószerként írja le); a nebulizáló (ULV) berendezés végleges típusa | 2 adat | Az oldal tényszerűen, „nem rovarirtó” megfogalmazással írja le; a pontos rendeltetést a tulajdonosnak kell megerősítenie | igen | P1 | nem | igen |
| L-06 | `/casos-reales/` | Galéria | Megerősítés, hogy mind a 13 galériafotó **magyarországi munka** során készült, a megfelelő jogosultsággal publikálható, és nem tartalmaz azonosítható ügyféladatot | 13 fotó | A galéria „magyarországi szakmai dokumentációként” szerepel, nem spanyolországi referenciaként | igen | P1 | nem (a tulajdonos eddigi nyilatkozata alapján él) | nem |
| L-07 | minden oldal | WhatsApp / adatvédelem | Az adatkezelési tájékoztató kiegészítése a WhatsApp-kapcsolatfelvétellel és az online észlelési adatlappal (az adatok az eszközön maradnak; WhatsApp kezeli az elküldött üzenetet) | 1 szöveg | GDPR átláthatóság | igen | P1 | igen (a jogi oldalakkal együtt) | nem |
| L-08 | 6 védett oldal | Telefonszám | Végleges telefon-stratégia: a 6 védett (Ads) oldal `tel:` hivatkozása a +34 605 259 206 (hívás) szám, a generált oldalaké az AI-diszpécser +34 865 699 969 | 1 döntés | Egységes hívószám; az AI-diszpécser élesítéséig a két szám eltér | nem | P2 | nem | igen |
| L-09 | 6 védett oldal | WhatsApp-gombok | A 6 védett oldal meglévő, előre kitöltött üzenetes WhatsApp-gombjai változatlanok maradtak (a jóváhagyott konverziós szerkezet védelme). A generált oldalakon a gombok üzenet nélküliek. Döntés: egységesítés kell-e | 1 döntés | A prompt szerint a normál gombok üzenet nélkül működjenek; a védett oldalak szerkezetét nem alakítottam át önállóan | nem | P2 | nem | igen |

## 2. Később feltöltendő bizonyítványok
| ID | Oldal | Szekció | Mi hiányzik | Db | Miért | Formátum | Kötelező? | Prior. | Akadály? | Később? |
|---|---|---|---|---|---|---|---|---|---|---|
| C-01 | `/sobre-mi/` | Certificados y cursos (IMG-CRED-04) | Magyar egészségügyi kártevőirtó szakképesítés bizonyítványa **hivatalos spanyol fordítással** | 1 | Hitelesség; a fordítás a spanyol elismeréshez is kell | PDF/JPG, 4:3 fekvő, elfedett azonosítókkal | nem | P1 | nem | igen |
| C-02 | `/sobre-mi/` | Certificados y cursos | Europass dokumentum | 1 | — | PDF/JPG | nem | P2 | nem | igen |
| C-03 | `/sobre-mi/` | Certificados y cursos (IMG-CRED-06) | További szakmai tanúsítvány, ha lesz | 0–1 | — | 4:3 | nem | P3 | nem | igen |

Az oldalon **nincs** publikus helyőrző a hiányzó dokumentumok helyén. A Lantra „Bed Bug Control” tanúsítvány (ellenőrzőkóddal elfedve) szerepel.

## 3. Valóban szükséges saját fényképek
**Nincs.** Minden kötelező képhely kitöltött vagy a tulajdonos döntése szerint kimaradt.

## 4. Opcionális, minőségjavító fotók (nem akadály, sehol nem jelenik meg üres hely)
| ID | Oldal | Szekció | Mi | Db | Miért | Formátum | Prior. |
|---|---|---|---|---|---|---|---|
| IMG-ABOUT-04 | `/sobre-mi/` | Especialización | Matracvarrat vizsgálata közben | 1 | Hitelesség | 3:2, min. 1600 px | opcionális |
| IMG-ABOUT-08 | `/sobre-mi/` | En el trabajo | Észlelések dokumentálása | 1 | — | 3:2 | opcionális |
| IMG-ABOUT-09 | `/sobre-mi/` | En el trabajo | Eszközök előkészítése | 1 | — | 3:2 | opcionális |
| IMG-ABOUT-10 | `/sobre-mi/` | En el trabajo | További természetes munkakörnyezeti portré | 1 | — | 3:2 | opcionális |
| IMG-PREV-01 | `/guia-chinches/chinches-viajes-y-hoteles/` | hero | Poggyász átvizsgálása | 1 | Cikkfotó | 3:2 | P2 |
| IMG-PREP-02 | `/guia-chinches/despues-del-tratamiento-chinches/` | hero | Helyiség szellőztetése | 1 | Cikkfotó | 3:2 | P2 |
| IMG-PREP-03 | `/guia-chinches/ropa-y-textiles-chinches/` | hero | Lezárt zsákba helyezett ágynemű | 1 | Cikkfotó | 3:2 | P3 |
| IMG-B2B-04 | `/guia-chinches/deteccion-temprana-apartamentos/` | hero | Ellenőrzőlista használata (a takarítószemélyzet-oktatás már nem szolgáltatás → **elhagyható**) | 1 | — | 3:2 | törölhető |
| IMG-ENT-MOU-02 | `/atlas-chinches/` | Mudas | Egyetlen vedlett kültakaró nagyított képe | 1 | Atlasz | 3:2 | opcionális — a MOU-01 már bent van |
| IMG-ENT-EXC-01 | `/atlas-chinches/` | Excrementos | Ürüléknyom matracvarraton | 1 | Atlasz | 3:2 | opcionális — az EXC-02 és a HID-04/05 bent vannak |

Az IMG-PREV-02 korábbi hiányzó/felhasznált ellentmondása lezárva: a kép a PG-048 cikkben felhasznált, nem hiányzik. A korábbi 12 hiányzó fotó-/dokumentumhelyből: 2 dokumentum (CRED-04/06, 2. csoport), 10 opcionális fotóhely (fent); kötelező egy sem.

## 5. Később cserélhető AI-illusztrációk
A 14 atlasz-makró (IMG-ENT-ADU-02…05, EGG-01…03, NYM-01…05, SCALE-01/02) **jelölt illusztráció** („Ilustración … no es una fotografía propia”). Méretarányt, fejlődési alakot, ivart, fajt nem kezelünk ellenőrzött bizonyítékként. Valódi saját makrofotóra cserélhetők: ugyanazt az azonosítót kell használni (`docs/seo/ATLAS-IMAGE-LIST.md` soronként felsorolja). Továbbá AI-képek: IMG-INS-01, IMG-INS-05, IMG-IPM-01, IMG-IPM-03, IMG-IPM-04, IMG-B2B-01 (hero-n is látható felirattal). A hat „IG-” infografika saját SVG, nem AI-fotó.

## 6. Későbbi Google Ads és analitikai integráció (külön csomag)
| Tétel | Állapot |
|---|---|
| GA4 mérési azonosító (`G-…`) | nincs megadva (`js/measurement-config.js` üres) |
| Google Ads fiók azonosító (`AW-…`) és konverziós címkék (WhatsApp, telefon) | nincsenek megadva |
| GTM-container (ha lesz) | nincs |
| Consent/süti-kezelés jogszerű megvalósítása | külön csomag; a csatlakozási pontok: `docs/seo/MEASUREMENT-INTEGRATION.md` |
| Search Console property | a meglévő property használható; a sitemap (86 URL) a feltöltés után beküldhető |

## 7. További opcionális fejlesztések
1. Valódi esettanulmányok (`/casos-reales/` URL-ek megvannak; CASE-STUDY-STANDARD).
2. További városi oldalak (ebben a csomagban szándékosan nincs).
3. Független szakmai lektor a cikkekhez (D-050: jelenleg nincs, és nem is állítjuk).
4. Betűtípusok önhosztolásának finomhangolása / további teljesítmény-optimalizálás (lásd Lighthouse a zárójelentésben).
5. Az AI-diszpécser árlogikájának összekötése a központi árfájllal (`data/prices.json`; a Retell-ügynököt ebben a csomagban nem módosítottam).
6. Az angol jogi hivatkozások (EN oldalon spanyol jogi oldalra mutat) EN összefoglalója.
