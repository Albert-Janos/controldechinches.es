# PAGE-TEMPLATES — oldalsablonok (T-A … T-I)

Minden sablon: cél · szekciók (sorrendben) · komponensek · kép/ábra-szükséglet · CTA-intenzitás · JSON-LD. A szekciónkénti desktop/mobil elrendezés: `DESKTOP-MOBILE-WIREFRAMES.md`. Közös komponensek: VISUAL-DESIGN-SYSTEM §4. Közös szabályok: CONTENT-STANDARDS.

| ID | Sablon | Használat (PG) | CTA | JSON-LD |
|---|---|---|---|---|
| **T-A** | Lokális szolgáltatási landing | 021–027 | erős | Service(areaServed), BreadcrumbList |
| **T-B** | Szolgáltatási oldal | 011–014 (T-B+ az IPM) | erős | Service, BreadcrumbList, Person link |
| **T-C** | Tudásközpont-cikk | 041–065 | visszafogott | Article, BreadcrumbList, Person |
| **T-D** | Szakmai bemutatkozó | 016 | közepes | ProfilePage, Person, Organization |
| **T-E** | B2B szolgáltatási oldal | 015 (+003 meglévő) | együttműködés | Service |
| **T-F** | Esettanulmány | 073 + esetek | közepes | Article, ImageObject |
| **T-G** | Fotóatlasz | 070 | azonosítás | ImageGallery, ImageObject |
| **T-H** | Központi gyűjtőoldal | 010, 020, 030, 040, 072 | közepes | CollectionPage / FAQPage (feltételes) |
| **T-I** | Interaktív eszköz | 071 | azonosítás | WebApplication/WebPage |

## T-A Lokális landing
1 Hero (helyi kép + H1 „Chinches de cama en <város>” + elsődleges CTA) · 2 helyi szolgáltatási összefoglaló (*valós*: kiszolgálás módja, elérhetőség szabályai, kiszállás-tény) · 3 kezelési módszerek (link PG-013/014) · 4 IPM-módszertan (rövid, link PG-011) · 5 árak (link/kivonat a központi adatból, `/precios.html`) · 6 helyi ingatlantípusok (tényleges, saját megfigyelés) · 7 **valós szolgáltatási terület** (csak igazolt települések) · 8 szakmai bemutatkozás (szerzői doboz) · 9 helyi esettanulmány (csak valós) · 10 helyspecifikus GYIK · 11 szomszédos területek · 12 záró CTA. **Minimum egyedi tartalom** a lokális szekciókban (2, 6, 7, 10): nem csak névcsere; ha nincs hely-specifikus tény, az oldal nem készül (QUALITY-GATE).
Komponens/kép: hero-fotó (LOC-*-01), ingatlantípus-fotó (LOC-*-02), valós helyi munkafotó ha van (LOC-*-03), kulcstény-sáv, FAQ, kapcsolódó-lista.

## T-B Szolgáltatási oldal
1 Hero (szolgáltatás + saját fotó) · 2 probléma és megoldás · 3 technológiai magyarázat (+ ábra IG-14) · 4 munkafolyamat (számozott) · 5 saját eszközök (gépfotó) · 6 **előnyök és korlátok** (két oszlop, őszintén) · 7 IPM-kapcsolat (link PG-011) · 8 árkommunikáció (központi adat; „ajánlat írásban”) · 9 GYIK · 10 szakmai hitelesség (szerzői doboz) · 11 foglalás-CTA.
**T-B+ (IPM):** a lépések teljes folyamatábrája (IG-01), a **szerep-táblázat** (tulajdonos végzi / javaslat / külső), szekció-horgonyok: `#combinado #monitorizacion #prevencion #sellado #asesoramiento`.

## T-C Cikk
Breadcrumb · H1 · **rövid válasz** · szerző + ellenőr + dátumok · tartalomjegyzék (ha > 3 H2) · fő kép · részletes magyarázat · fotók/ábrák · összehasonlító táblázat · GYIK · kapcsolódó cikkek · releváns szolgáltatás · **források** · visszafogott CTA („Kérdésed van a saját esetedről?”).

## T-D Bemutatkozó
Hero-portré · bemutatkozás · életút (idővonal) · végzettségek + **dokumentum-galéria** · specializáció · eszközök · IPM-szemlélet · alapelvek · célok · továbbképzés · munkafotók · kapcsolat. (AUTHOR-AND-CREDENTIALS §2)

## T-E B2B
Üzemeltetői problémák · megelőzési program elemei · ellenőrzési ütem · monitorozás · dokumentáció (jegyzőkönyv-minta) · személyzet-oktatás · együttműködési folyamat · GYIK · CTA (WhatsApp B2B-sablon).

## T-F Esettanulmány
CASE-STUDY-STANDARD §2 mezői: település, ingatlan, kiindulás, felmérés, jelek, búvóhelyek, szerkezeti tényezők, módszer, integrált intézkedések, saját fotók, javaslatok, utóellenőrzés, dokumentált eredmény, tanulság, kapcsolódó szolgáltatás/település.

## T-G Atlasz
Szűrő-lap (életszakasz / jel / búvóhely; HTML-linkelt horgonyok, JS nélkül is használható) · képrács (3 / 2 / 1 oszlop) · **lightbox** (nagyítás, felirat, azonosítási szempontok, méretarány, szerző/forrás, kapcsolódó cikk) · fejlesztő magyarázat · CTA „azonosítsuk együtt”. **Egy URL**, képenként nincs külön indexelhető oldal.

## T-H Hub
Rövid szándék-magyarázat · kategória-/elem-lista (természetes linkek, rövid leírással) · kiemelt elemek · szerzői blokk · CTA.

## T-I Interaktív eszköz
HTML-ben elolvasható magyarázat (a lépések, a lehetséges kimenetek, a korlátok) → **progresszív fejlesztés**: JS nélkül is a teljes tartalom látszik · kérdések (rádió/jelölőnégyzet, billentyűvel kezelhető, aria-live eredmény) · eredmény = következő lépés + link + CTA, **nincs fiktív százalék, nincs diagnózis csípésből** · saját fotók az azonosítás segítésére.

## Közös kimenet minden sablonon
`<title>`, `meta description`, canonical, hreflang (kölcsönös), `html lang`, breadcrumb, JSON-LD, nyelvváltó (valódi megfelelőre), státusz-meta (`robots` a kapukhoz), `data-page` típusazonosító a méréshez, `data-cta` a CTA-kon.
