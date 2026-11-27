# DESKTOP-MOBILE-WIREFRAMES — wireframe-koncepciók (nem publikus tervek)

Szöveges/ASCII wireframe sablononként. Jelölések: `[IMG r]` kép (r = arány), `[IG]` infografika, `[CTA-F/M/S]` CTA teljes/közepes/visszafogott, `[ICON]` ikon, `[TRUST]` bizalomépítő elem, `→` belső link. A cél: **jóváhagyás előtt** döntési alap; a végleges Figma/HTML-prototípus P1-07-ben készül.

Közös: desktop 1280 px (max. tartalom 74 rem, 12 oszlop), mobil 360–390 px (16 px oldalmargó). Mobilon: egy oszlop, kép a szöveg **felett** vagy alatt (hero: felül), táblázat vízszintes görgetés, sticky-CTA csak tranzakciós sablonon.

## T-B Szolgáltatási oldal (példa: vapor seco)

```
DESKTOP                                             MOBIL
┌─────────────────────────────────────────────┐     ┌──────────────────┐
│ Fejléc | nyelv | WhatsApp                   │     │ ☰  logó  ES|EN   │
│ Breadcrumb                                  │     ├──────────────────┤
├───────────────────────┬─────────────────────┤     │ [IMG 4:5 hero]   │
│ H1 + 2 mondat         │ [IMG 4:5 hero]      │     │ H1 + 2 mondat    │
│ [CTA-F] [Tel]         │ DRY-10              │     │ [CTA-F][Tel]     │
├───────────────────────┴─────────────────────┤     ├──────────────────┤
│ Kulcstény-sáv: gőz-hőm. · hely · idő · ár  │     │ 4 tény (2×2)     │
├─────────────────────────────────────────────┤     ├──────────────────┤
│ Probléma → megoldás (szöveg 7 | kép 5)      │     │ Szöveg, majd kép │
│ Technológia: [IMG DRY-03] + [IG-14]         │     │ [IG-14 vertikális]│
│ Munkafolyamat (6 lépés, vízszintes)         │     │ 6 lépés függőleg │
│ Saját gép: [IMG 4:3 DRY-01] + adatok        │     │ [IMG] + adatok   │
│ Előnyök | Korlátok (2 oszlop)               │     │ Előnyök / Korlátok│
│ Kapcsolat IPM → · Árak → (központi adat)    │     │ Linkek           │
│ GYIK (accordion)                            │     │ GYIK             │
│ Szerzői doboz [TRUST] portré+név            │     │ Szerzői doboz    │
│ Záró [CTA-F] sáv                            │     │ [CTA-F] + sticky │
└─────────────────────────────────────────────┘     └──────────────────┘
```

## T-A Lokális landing (város)
Desktop: hero kép (város) + H1 + CTA · 3 oszlopos kulcstény (kiszolgálás, kezelés, ár) · szöveg 8 | helyi fotó 4 · módszer-lista · IPM-doboz · ár-kivonat · ingatlantípusok (kép+szöveg váltakozva) · **szolgáltatási terület-lista** (igazolt települések, szöveg) · szerzői doboz · helyi GYIK · szomszéd városok (linksor) · záró CTA.
Mobil: hero fent, CTA a H1 alatt, szekciók egymás alatt, szomszéd városok vízszintes lista, sticky-CTA.

## T-C Cikk
```
DESKTOP                                      MOBIL
Breadcrumb                                   Breadcrumb
H1                                           H1
[Válaszdoboz: 2–4 mondat]                    [Válaszdoboz]
Szerző+ellenőr+dátumok                       Szerző+dátumok (egy sor)
┌─ TOC (jobb, sticky) ─┐ ┌ Cikk törzs ┐       [TOC összecsukható]
│ H2-k                  │ │ szöveg     │      Fő kép [IMG 3:2]
└───────────────────────┘ │ [IMG 3:2]  │      Szöveg, ábrák [IG]
                          │ [IG]       │      Összehasonlító táblázat (görgethető)
                          │ táblázat   │      GYIK
Kapcsolódó cikkek (3)     │ GYIK       │      Kapcsolódó (3, lista)
Szolgáltatás-sáv [CTA-S]  │ Források   │      Források
Szerzői doboz             └────────────┘      [CTA-S]
```

## T-D Bemutatkozó
Desktop: hero 2 oszlop (portré 5 | név+megnevezés+tényszerű mondat+CTA 7) · idővonal (függőleges, jobbra kép) · **dokumentum-galéria** (3–4 bélyegkép egy sorban, kattintásra lightbox) · eszközök (kép+lista) · alapelvek (3 oszlop, szöveges) · munkafotó-sor (3) · záró CTA a portréval.
Mobil: portré fent (4:5), idővonal egy oszlop, galéria 2 oszlop, lightbox teljes képernyő.

## T-E B2B
Desktop: hero + CTA · „Üzemeltetői problémák” (3 oszlop, ikon+szöveg) · program-elemek (táblázat: elem, gyakoriság, dokumentum) · [IG-10] folyamatábra · jegyzőkönyv-minta (kép+letöltés→PG-072) · képzés · GYIK · CTA (B2B-sablon). Mobil: egy oszlop, táblázat görgethető.

## T-F Esettanulmány
Kulcstény-fejléc (település, ingatlan, módszer, időtartam) · idővonal (felmérés → kezelés → utóellenőrzés) · képpárok (előtte/közben/utána, felirattal) · eredmény (ellenőrizhető mondat) · tanulság · kapcsolódó szolgáltatás/település · CTA. Mobil: képek teljes szélesen, idővonal függőleges.

## T-G Atlasz
Desktop: szűrő-sor (horgonylinkek: felnőttek, peték, nimfák, vedlések, ürülék, búvóhelyek) · rács 3 oszlop (képenként felirat) · lightbox: nagy kép + oldalsó panel (név, azonosítási szempontok, méretarány, szerző/forrás, kapcsolódó cikk) · alul CTA „azonosítsuk együtt”. Mobil: 1–2 oszlop, lightbox: kép felül, panel alul, csípés-nagyítás, bezárás ✕ 44 px.

## T-H Hub
Rövid bevezető (2–3 mondat) · kategória-szakaszok (H2 + lista természetes linkekkel + 1 mondat) · kiemelt (3) · szerzői doboz · CTA-M. Mobil: egy oszlop, kategória-horgonyok az oldal tetején (görgethető sor).

## T-I Azonosító
Desktop: bal: HTML-magyarázat + kérdéssor (rádió-csoportok, képpel) | jobb: „Eredmény” panel (aria-live): következő lépés, link a cikkre/atlaszra, CTA; alatta a lehetséges kimenetek **statikus HTML**-ben. Mobil: kérdések egymás alatt, eredmény-panel alul rögzítve (nem takarja a vezérlőket), JS nélkül: statikus lista.

## Szekciónkénti spec — hol található
Minden szekció tartalmi célja, címsora, szöveg-jellege, képhelye/aránya, infografikája, ikonja, CTA-ja, belső linkjei és bizalomépítő eleme: **PAGE-INVENTORY.csv** (`sections`, `images`, `infographics`, `internal_links`, `conversion_goal`) + **PAGE-IMAGE-MAP.csv** (szekció → kép, arány, mobil kivágás) + **CONTENT-BRIEFS.md** (szöveg-jelleg és címsor-minták). A szekciók ikon-készlete: SVG-sprite (a meglévő `icon-*` stílusban: vékony vonal, `currentColor`).
