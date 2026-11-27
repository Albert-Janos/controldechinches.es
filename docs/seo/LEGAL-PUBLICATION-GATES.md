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
