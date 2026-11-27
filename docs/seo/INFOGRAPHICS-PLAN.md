# INFOGRAPHICS-PLAN — egyedi infografikák és ábrák

Nyilvántartás: `IMAGE-ASSET-INVENTORY.csv` (`IG-01…IG-16`) és `PAGE-IMAGE-MAP.csv` (hol szerepel).

## Közös követelmények
- **Optimalizált, reszponzív SVG** (SVGO), `viewBox`, nincs fix szélesség; **ES és EN változat** (szöveg `<text>`-ben, nem képbe égetve; kulcs-azonosítókkal lokalizálható).
- **Akadálymentesség:** `role="img"` + `<title>`/`<desc>` a teljes ábrához; a folyamatábra lépései **HTML-listaként is** az oldalon (a tartalom nem csak a képben él); kontraszt ≥ 4.5:1; nincs csak színnel kódolt információ.
- **Mobil:** külön függőleges elrendezés (nem összenyomott desktop ábra).
- **Stílus:** a VISUAL-DESIGN-SYSTEM szerint — egyszerű vonalak, 2–3 szín, nincs dekoratív zaj.
- **Szakmai pontosság:** kötelező ellenőrzés publikálás előtt (biológiai ábrák: entomológiai/forrás-ellenőrzés; módszer-ábrák: a tulajdonos tényleges módszere). **Ellenőrizetlen vagy félrevezető biológiai illusztráció nem publikálható.** A számadatok (hőmérséklet, napok, stádiumok száma) csak ellenőrzött forrásból.

## Lista

| ID | Ábra | Oldalak (PG) | Priorizál. | Szakmai ellenőrzés tárgya |
|---|---|---|---|---|
| IG-01 | IPM-folyamatábra (23 lépés → 5–6 fázisba csoportosítva) | 011, 049 | P1 | tulajdonos: tényleges lépések |
| IG-02 | Életciklus-ábra (pete → 5 nimfa → felnőtt; táplálkozás-lépések) | 043, 040 | P2 | entomológia; időtartamok forrással |
| IG-03 | Nimfastádiumok (méret és szín) | 043 | P2 | entomológia; méretek skálával |
| IG-04 | Fajazonosítás: *C. lectularius* vs *C. hemipterus* | 070 | P2 | határozókulcs/entomológus |
| IG-05 | Anatómia (fej, pronotum, potroh, láb) | 043 | P2 | entomológia |
| IG-06 | Méretarányos összehasonlítás (chinche, bolha, kullancs, szőnyegbogár…) | 042, 070 | P2 | forrásból vett méretek |
| IG-07 | Tipikus búvóhelyek hálószoba-illusztráción | 012, 041, 044, 046 | P2 | tulajdonos+forrás |
| IG-08 | Matrac és ágykeret ellenőrzési pontjai | 012, 041, 045, 071 | P2 | tulajdonos módszere |
| IG-09 | Behurcolási útvonalak | 047, 048 | P2 | forrás |
| IG-10 | Szállodai/szálláshelyi ellenőrzési folyamat | 015, 061–064 | P2 | tulajdonos+jogi (felelősség-megfogalmazás) |
| IG-11 | Kezelés előtti ellenőrzőlista | 055, 058, 072 | **P1** | tényleges előkészítési utasítás |
| IG-12 | Kezelés utáni ellenőrzőlista | 056, 072 | **P1** | termék-/módszerfüggő; LGL-05 |
| IG-13 | Monitorozási folyamatábra | 060, 015 | P2 | használt eszközök |
| IG-14 | Kezelési technológiák összehasonlítása (gőz / vegyszer / kombinált: mikor, előny, korlát) | 010, 011, 013, 014, 049, 050 | **P1** | tulajdonos+forrás |
| IG-15 | IPM vs egyszeri kezelés | 011, 051, 053, 054 | **P1** | tulajdonos |
| IG-16 | Megelőzés vizuális útmutatója (korlátokkal: a rés-lezárás nem garantál) | 048, 059 | P2 | forrás+jogi megfogalmazás |

## Gyártás
Terv: a P1-ben készülnek az IG-01/11/12/14/15 (a P3 oldalakhoz). A többi a megfelelő tartalmi fázis előtt. A szerkesztő eszköz (vektoros) és a designer kiválasztása tulajdonosi döntés; a kimenet: `assets/img/infographics/<id>-<slug>.<lang>.svg`.
