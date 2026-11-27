# LEGAL-PUBLICATION-GATES — jogi és szakmai publikálási feltételek

> **Nem jogi tanács.** Az alábbi kapuk a *kockázat azonosítására* szolgálnak; a végleges megfelelőséget spanyol jogi/szabályozási szakértővel (gestor/abogado) és a hatósággal kell tisztázni. A P0 keresés csak az általános kereteket igazolta (alább), a részletes valenciai előírásokat **nem**.

## 1. Státuszlánc (minden oldalra)
`Draft` → `Content ready` → `Visual assets ready` → `Technical QA passed` → `Professional review passed` → `Legal review required` (ha a kapu előírja) → `Owner approved` → `Approved for indexing` → `Published`.
Csak az `Approved for indexing` és `Published` kap `index` + sitemap. Az éles publikálás mindig **tulajdonosi kézi lépés**; a státuszváltás a `data/pages/*.json`-ban verziózott, nem automatikus.

## 2. Kapuk (LGL-xx) és mit zárnak
| ID | Kapu | Hivatkozás / jelenlegi állás | Mit blokkol |
|---|---|---|---|
| **LGL-01** | **Spanyolországi működés megkezdésének feltételei** (cégforma/önálló vállalkozó, adóalany-nyilvántartás, ROESB-bejegyzés a Comunitat Valenciana szabályai szerint, alkalmazói képesítés). A P0 keresés: a ROESB és a biocid-alkalmazás szabályozott (Comunitat Valenciana: Decreto 96/2004, Orden 1/2013 / 1/2018 — a hatályos állapot **ellenőrizendő**); a képzési követelmény részleteit nem sikerült igazolni. | Az aviso legal jelenleg „borrador… antes de iniciar la actividad”. | Minden **tranzakciós** új oldal (szolgáltatás, lokális, B2B) `Published` státusza. Tudásközpont-cikkek előkészíthetők. |
| **LGL-02** | Ár- és ajánlat-közlés (fogyasztóvédelem: átlátható árak, „desde” kifejezés, adó/kiszállás feltüntetése, sürgősségi állítások, rendelkezésre állás) | A-C1 ellentmondás; „¡Incluso hoy!” a CTA-ban. | Új oldalak ár-kivonata; Offer-jelölés. |
| **LGL-03** | Azonosító adatok és adatvédelem (LSSI-CE azonosítási kötelezettség, RGPD/LOPDGDD, cookie-szabály) | Aviso legal `[PENDIENTE]` mezők; adatvédelmi oldal cookie-lista `[PENDIENTE]`. | Új oldalak lábléc-jogi linkje, kapcsolatfelvételi űrlap, mérés élesítése. |
| **LGL-04** | Állítások igazolhatósága („sin insecticidas”, hatékonyság, „profesional”, eredmény) | Főoldali/árak szövegek. | Szolgáltatásoldalak (011, 013, 014). |
| **LGL-05** | Biocid-termékek: Spanyolországban engedélyezett, a ténylegesen használt termékek és felhasználási feltételek; lakossági tájékoztatás (visszalépés, szellőztetés, gyermek/háziállat) | Tulajdonosi lista szükséges (#10). | PG-014, 055–057, IG-12. |
| **LGL-06** | B2B-dokumentáció/szerződés-szerű ígéretek (parte de trabajo, monitorozási program, felelősség) | – | PG-015, 061–064, 072. |
| **LGL-07** | **Magyar képesítés és működési nyilvántartás ≠ automatikus spanyol működési engedély.** Elismerés: RD 581/2017 (Directiva 2013/55/UE) általános rendszer, MITECO/Sanidad útmutatók; a biocid-alkalmazóra vonatkozó pontos szabály **nem igazolt**. | Nem szabad spanyol jogosultságot sugallni. | PG-016, minden szerzői doboz „képesítés” szövege. |
| **LGL-08** | Szolgáltatási terület és „helyi jelenlét” állítás (nincs fiktív telephely; GBP csak valós jogosultsággal) | A-M7. | PG-020–027, LocalBusiness-jelölés. |
| **LGL-09** | Felelősségi/jogi tartalom (vendégbejelentés, társasház, bérlő–tulajdonos felelősség) | – | PG-064, 065. |
| **LGL-10** | Esettanulmány: ügyfél-hozzájárulás, adatvédelem | CASE-STUDY-STANDARD. | PG-073. |

## 3. Tilos publikálni
Nem igazolt spanyol működési jogosultságot feltételező állítás · nem létező helyi telephely · még nem elérhető szolgáltatás azonnali foglalhatóként · nem ellenőrzött képesítéselismerés · nem igazolt eredménygarancia · fiktív vélemény/referencia.

## 4. Mi készíthető elő addig
A tudásközpont és az IPM-tartalom, a sablonok, a képanyag, az infografikák, a wireframe-ek — mind `Draft`/`noindex` státuszban, preview-ban.

## 5. Teendő a tulajdonos oldalán
OWNER-INPUT #2, #3, #10, #13–#24 (azonosító adatok, működési státusz, termékek, képesítések). Javaslat: spanyol szakértői egyeztetés **a P1 előtt**, mert a tranzakciós oldalak publikálását blokkolja.

## Pontos lista a még szükséges jogi és vállalkozási adatokról (2026-11-27)
Minden tétel **tulajdonosi adat vagy szakértői ellenőrzés**; semmit nem találunk ki. A hiány **nem akadályozza** a helyi technikai fejlesztést és az oldalak előkészítését, csak az éles indexelést/publikálást (LGL-kapuk).

| # | Adat / feltétel | Hová kerül | Kapu |
|---|---|---|---|
| 1 | Működési forma (önálló vállalkozó / társaság) és a pontos név vagy cégnév | aviso legal, JSON-LD (`Organization`) | LGL-03 |
| 2 | Adóazonosító (NIF/NIE/CIF) | aviso legal | LGL-03 |
| 3 | Székhely/levelezési cím és hogy publikálható-e; e-mail-cím | aviso legal, kapcsolat | LGL-03 |
| 4 | Adóhatósági és társadalombiztosítási nyilvántartásba vétel státusza (a tevékenység megkezdése) | belső igazolás | LGL-01 |
| 5 | Cégnyilvántartási adat (ha társaság) | aviso legal | LGL-03 |
| 6 | **ROESB-bejegyzés / előzetes bejelentés** (Comunitat Valenciana; hatályos szabály ellenőrzendő) és nyilvántartási szám | aviso legal, szakmai oldalak | LGL-01 |
| 7 | A felelős alkalmazó(k) spanyolországi képesítése/elismerése (magyar bizonyítvány elismerése vagy megfelelő spanyol igazolás) — a hatóság írásos állásfoglalása | Sobre mí, szerzői doboz | LGL-07 |
| 8 | Ténylegesen használt biocid termékek listája: név, hatóanyag, termékfajta, nyilvántartási szám, biztonsági adatlap; visszalépési idő | tratamiento químico, GYIK | LGL-05 |
| 9 | A biocid-mozgások nyilvántartásának vezetése (előírás ellenőrzendő) | belső | LGL-01 |
| 10 | Felelősségbiztosítás megléte (előírás ellenőrzendő) és a biztosító | belső / B2B | LGL-06 |
| 11 | Fogyasztói tájékoztatás: ÁFA/IVA feltüntetése az árakon, számlázás, reklamációs lehetőség/panaszlap (a vonatkozó valenciai előírás ellenőrzendő), vitarendezés | árak, aviso legal | LGL-02 |
| 12 | Adatvédelem: adatkezelő azonosítása, jogalap, megőrzési idő, címzettek (WhatsApp, telefonos/AI-asszisztens), süti-leltár | politica de privacidad | LGL-03 |
| 13 | **AI-asszisztens hívásainak tájékoztatása**: hívásrögzítés/átirat, adatfeldolgozó szerződés a szolgáltatóval | adatvédelmi oldal, hívási üdvözlés | LGL-03 |
| 14 | Ténylegesen kiszolgált települések és a kiszállási szabály | zónák, JSON-LD `areaServed` | LGL-08 |
| 15 | Foglalási rendelkezésre állás igazolása („¡Incluso hoy!”) — valós kapacitás | CTA-szövegek | LGL-02 |
| 16 | Esettanulmány-hozzájárulások (írásos) | casos reales | LGL-10 |

## Kutatási megállapítások a jogi keretről (2026-11-27 — **ellenőrizendő**, nem jogi tanács)
A forráskutatás során talált, a tevékenység megkezdését érintő előírások (elsődleges szövegeket a kutatás részben olvasta; **a hatályos állapotot jogi szakértővel kell megerősíteni**):
- **Real Decreto 830/2010** (BOE-A-2010-11157): biocid-alkalmazók képesítése. A 2., 3., 4., 14., 18., 19. terméktípusra (a TP18 = rovarölők, atkaölők, egyéb ízeltlábúak elleni szerek) alkalmazóként a „Servicios para el control de plagas (nivel 2)” képesítést igazoló FP-cím vagy *certificado de profesionalidad* kell; a tervezők/felügyelők „Gestión de servicios para el control de organismos nocivos (nivel 3)”; a harmadik személynek szolgáltató cégnek **felelős technikust** kell kijelölnie.
- **Real Decreto 952/2026** (BOE 277, 2026-11-06, BOE-A-2026-23267): a kutatás szerint a 830/2010-et **2027. július 1-jétől hatályon kívül helyezi**; a biocid-szolgáltatásokat az *tevékenység helye szerinti autonóm közösség ROESB-jében* kell nyilvántartásba venni (országosan érvényes); kezelés előtt írásos diagnózis, kockázatértékelés és terv az ügyfélnek, utána aláírt szolgáltatási igazolás; a „grado C” szakmai igazolvány vagy *Técnico en Sanidad ambiental aplicada* cím alapján alkalmazható a TP18; átmeneti szabály a meglévő alkalmazóknak (6 év). **Az új rendelet a kutatás idején friss; pontos hatályát és átmeneti szabályait szakértővel kell megerősíteni.**
- **Comunitat Valenciana:** a Generalitat tájékoztató lapja szerint a TP2/3/4/14/18/19 alkalmazóknak a „Serveis per al control de plagues (nivell 2)” képesítés kell (SEAG0110: 290 óra); a cégeknek a valenciai ROESB-ben (vagy más közösség egyenértékű nyilvántartásában) kell szerepelniük. A valenciai ROESB keretrendszerét (Decreto 96/2004, Orden 1/2018) keresési összefoglaló említette, **elsődleges szövegét nem olvastuk**.
- **Következmény a weboldalra:** a magyar képesítés + a spanyol működés kapcsolatáról **semmit nem állítunk**, amíg a hatóság/szakértő nem erősíti meg (LGL-01/07); az oldalak „profesional”-jellegű állításai ennek hiányában tilosak. A tudásközpont-cikkek (információs) a jogi kapuk nélkül is előkészíthetők.

## Kiegészítés (2. munkacsomag) — nyitott kapuk
- **IVA / fogyasztói ár (új):** az IVA-kulcs (21 % = tervezési feltételezés) és az adót tartalmazó ármegjelenítés spanyol hivatalos forrás és könyvelői jóváhagyás nélkül nem véglegesíthető. A production build árat mutató oldalt megtagad, amíg `prices.json` `vat.status` ≠ `approved`. A kapu **nincs** lezárva.
- **Gyártói és biocid adatok:** a Polti/HPMed gyártói adatok ellenőrizve (MANUFACTURER-DATA.md), a biocidok (LGL-05) és a HPMed szakmai alkalmazása **nyitott**.
- **Személy/jogosultság:** a magyar képesítés nem spanyol jogosultság (LGL-07); a nyilvántartási szám nem publikálható.
- **AI-diszpécser:** átláthatóság megvan az oldalakon; adatvédelmi/híváskezelési dokumentáció és nyelvi képességek nyitottak.
