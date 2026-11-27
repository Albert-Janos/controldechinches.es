# OWNER-INPUT-REQUIRED — tulajdonostól bekérendő információk és döntések

Jelölés: **B** = blokkoló (nélküle a fázis nem indulhat), **F** = fontos, **O** = opcionális. A válaszokat a DECISION-LOG rögzíti.

## A. Döntések és üzleti igazságok (P1 előtt)
| # | Kérdés | Miért | Típus | Fázis |
|---|---|---|---|---|
| 1 | ~~Mi a valós ajánlat és ár?~~ **Megválaszolva 2026-11-27** (D-017): vegyszeres 139/179/219/259 € + 40 €; önálló vapor 150 €-tól. **Nyitva:** a kiegészítők (gőz +80 €/hálószoba, kanapé +40 €/db, ULV 50 €-tól) megerősítése deploy előtt (D-018). | A-C1 | **F** | P1 |
| 2 | Jogi azonosító adatok: titulár, NIF/CIF, cím, e-mail, működési státusz Spanyolországban (aviso legal `[PENDIENTE]`). | LGL-01/03 | **B** | P1 |
| 3 | **Valódi szolgáltatási területek** (főoldal: 15 település; lábléc: 4; sémában: 3; térkép: Dénia is). Mely településeken dolgozol ténylegesen, mi a kiszállási szabály? | A-M7; zonák | **B** | P4 |
| 4 | **Preview-hosting** választás és **deploy-mód** (cPanel/WebDigital hozzáférés, FTP/Git/kézi feltöltés). | A-H2 | **B** | P1 |
| 5 | Mérési hozzáférések, **csak olvasás**: Google Ads fiók, GA4, Search Console (van-e property?), Google Cégprofil. Honnan jön most az Ads-konverzió? | A-H1 | F | P1/P8 |
| 6 | AI-diszpécser üzleti adatainak (ár, terület, nyelv, nyitvatartás) **olvasható exportja** az összevetéshez (élő rendszert nem módosítjuk). | DATA-ARCHITECTURE | F | P1 |

## B. Szakmai módszertan (P3 előtt)
| # | Kérdés | Fázis |
|---|---|---|
| 7 | Az IPM 23 lépéséből melyeket végzed **ténylegesen**, melyeket javaslod, melyek külső kivitelezőt igényelnek (IPM-METHODOLOGY §2–3)? **B** | P3 |
| 8 | Használt szárazgőzös gép pontos típusa (a főoldali fotón kis kézi gőzölő van — a Polti Cimex Eradicator is a tiéd?). **B** | P3 |
| 9 | Gőz-beállítások: nyomás/hőmérséklet, tartózkodási idő, felületek, amit nem kezelsz gőzzel. **B** | P3 |
| 10 | **Ténylegesen használt biocid termékek** (név, hatóanyag, ROESB/gyártói engedély), visszalépési idő a termék szerint. **B** | P3 |
| 11 | Utóellenőrzés tartalma és ideje; milyen dokumentumot adsz (parte, jegyzőkönyv)? | P3 |
| 12 | Rések/repedések lezárása: te végzed, javaslod, vagy külső cég? | P3 |

## C. Személyes márka és hitelesség (P2 előtt)
| # | Kérdés | Fázis |
|---|---|---|
| 13 | Hivatalos magyar szakmai megnevezés, kiállító, év (bizonyítvány). **B** | P2 |
| 14 | Magyar nyilvántartási adat — nyilvánosságra hozható? | P2 |
| 15 | Minden továbbképzés (cím, szervező, ország, év, dokumentum). | P2 |
| 16 | Spanyolországi működési státusz részletei (ROESB? munkaviszony/alvállalkozás?) — LGL-01/07. **B** | P2 |
| 17 | Magyarországi és spanyolországi tapasztalat (évek, típusok; mi publikálható). | P2 |
| 18 | Használt eszközök listája. | P2 |
| 19 | Szakmai alapelvek (saját szavaiddal), célok, a spanyol vállalkozás céljai. | P2 |
| 20 | Van-e külső szakmai ellenőr (entomológus)? Neve és mértéke — csak ekkor szerepel. | P2 |
| 21 | Hozzájárulás a portrék/munkafotók publikálásához. | P2 |
| 22 | Tagságok/szervezetek (csak igazolt). | P2 |
| 23 | Preferált megszólítás (tegező/„usted”) lakossági és B2B oldalon. | P2 |
| 24 | Nyelvtudás/EN kommunikáció (EN hívások kezelése: az AI-asszisztens spanyol). | P2 |

## D. Képek és fotók (azonnal indítható)
| # | Kérdés | Típus |
|---|---|---|
| 25 | **Minden meglévő képre**: saját-e, ki készítette, jogtiszta-e (főleg `hero-0010`, `chinche-macro`, `signo-*`, `apartamento-mediterraneo`, `costablanca`)? Mely képek generáltak? | **B** (új oldalakon való újrahasználathoz) |
| 26 | Hol készültek az `irtas-gozzel01` és `permetezes…` képek (ország/település)? | F |
| 27 | Van-e meglévő saját fotóarchívum (makró, munka, bizonyítvány)? Ezeket gyűjtsd össze **P0-ban** (PHOTO-SHOT-LIST). | **B** (P2) |

## E. Egyéb döntések
| # | Kérdés | Fázis |
|---|---|---|
| 28 | Google Ads „search terms” export (12 hó) és ténylegesen kapott kérdések (WhatsApp/telefon) a GYIK-hoz és kulcsszókutatáshoz. | P1/P5 |
| 29 | Jóváhagyod-e a főoldali **lábléc hub-linkjeit** (D-008)? | P1 |
| 30 | Jóváhagyod-e külön a főoldali „Sobre mí/módszertan” szekciót (CRO)? | P2+ |
| 31 | Terminológia: a főoldal „tratamiento químico combinado” = vegyszer + ULV. Hogyan nevezzük a gőz+vegyszer kombinációt (javasolt: „tratamiento combinado vapor + químico”)? | P3 |
| 32 | Mobil sticky-CTA az új tranzakciós oldalakon: igen/nem. | P1 |
| 33 | Van-e valós Google Cégprofil / jogosultság hozzá, van-e tényleges vállalkozási cím (GBP-hez)? | P4 |
| 34 | Vannak valós, hozzájárulással publikálható ügyfélvélemények/esetek? | P7 |
| 35 | Valós B2B-partnerek (apartmankezelők, szállodák) és hajlandóság hivatkozásra. | P7 |
| 36 | Szeretnél-e ismétlődő megelőzési/monitorozási programot értékesíteni (PG-015)? | P7 |
| 37 | Spanyol jogi/szabályozási szakértő kapcsolat (LGL-01…10). **Javasolt P1 előtt.** | P1 |
| 38 | Weboldal-szöveg nyelvi lektor (ES, EN anyanyelvi) — ki végezze? | P2 |
