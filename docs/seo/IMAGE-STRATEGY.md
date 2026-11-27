# IMAGE-STRATEGY — képstratégia és szabályok

Adatforrások: `IMAGE-ASSET-INVENTORY.csv` (minden kép, 13 meglévő + 112 tervezett fotó + 16 infografika), `PAGE-IMAGE-MAP.csv` (oldal×szekció×kép, minden tervezett URL lefedve), `PHOTO-SHOT-LIST.md`, `IMAGE-MISSING-LIST.md`.

## 1. Meglévő képállomány — összkép (13 elem, 2026-11-27)
- **Technikai állapot jó:** a legtöbb WebP, méretezett; kivétel 2 JPEG (`chinche-macro.jpg`, `apartamento-mediterraneo.jpg`, ~150–170 KB), a `favicon.ico` 124 KB, a `signo-manchas.webp` 166 KB. `/img/` és `/assets/` duplikált (logó, hero).
- **Eredet/jog: egyik képnél sincs dokumentálva.** Vizuális alapon (nem bizonyíték!):
  - valószínűleg **generált/illusztrációs**: `hero-0010` (+mobil), `signo-picaduras`, `apartamento-mediterraneo`, `costablanca` térkép;
  - **fotószerű, forrás ismeretlen**: `chinche-macro`, `signo-manchas`, `signo-sangre`, `signo-mudas`;
  - **valószínűleg saját** (magyar fájlnevek, magyar belső terek): `irtas-gozzel01`, `permetezes-hidegkodkepzes`.
- **Tartalmi kockázatok:** a gőzös fotón kis kézi gőzölő van (nem Polti Cimex Eradicator); a permetezős kollázs valószínűleg magyarországi munka — nem címkézhető helyi referenciának; a `signo-mudas` felirata („junta del mueble”) nem egyezik a képpel (fal–padló sarok); a Dénia-t is mutató térkép eltér a főoldali településlistától.
- **Hasznosítható tartalmilag:** `signo-manchas` (matrac-varrás ürüléknyomok) és `signo-mudas` (peték/vedlések/ürülék csoport) kiváló azonosító képek — **ha** a tulajdonos igazolja, hogy sajátjai, vagy jogtiszta forrásból valók. Kimondottan új oldalakon csak ilyen igazolás után használhatók.
- **Hiányzó kategóriák:** saját portré, bizonyítvány, gép, kezelés közbeni fotó, makrók (felnőtt, pete, nimfa, vedlés), búvóhelyek, szerkezeti rések, monitoring, B2B, helyi képek, infografikák.

## 2. Szabályok (kötelező)
1. **Saját fotó az elsődleges.** Hiányzó fotó esetén a hiányt dokumentáljuk, nem pótoljuk megtévesztő képpel.
2. **Tilos:** saját portré generatív módosítása; valós munkafotó generatív átalakítása; makrófotó szakmailag félrevezető retusálása; bizonyítvány/tanúsítvány generálása; AI-generált referencia vagy munkafotó valós munkaként; ismeretlen jogú kép publikálása; másik cég fotója sajátként; fiktív helyszín/eset valós eseményként.
3. **Illusztráció** (generált vagy digitális) csak tulajdonosi jóváhagyással és **látható „ilustración” jelöléssel**, soha nem esetként vagy munkafotóként.
4. **Fajazonosítás és fejlődési stádium nem AI-felismerésen alapul**: entomológiai ellenőrzés kell (lásd IMAGE-REQUIREMENTS §Makró), a képaláírás addig „ellenőrizendő”.
5. **Helyi hitelesség:** más településen készült munkafotó nem lehet helyi referencia. A `IMG-LOC-*-03` csak ténylegesen ott végzett munkából.
6. **Adatvédelem:** ügyfélcím, arc, azonosítható tárgy, GPS-metaadat a nyilvános képen nincs; a bizonyítvány kitakarása **visszafordíthatatlan** (lapított fájl).
7. **Archívum:** a nyers, teljes felbontású fájlok nem nyilvános tárban (`_archive-private/`, a deployból kizárva, `.gitignore`-ban); a publikus fájlok a pipeline kimenetei.
8. **Újrahasználat:** ahol ugyanaz a kép több oldalon releváns, újrahasználjuk (a map `asset_id` alapján); nem gyártunk mesterséges különbségeket.
9. **A meglévő képeket nem cseréljük** (Ads-védelem), csak új oldalakon alkalmazzuk az új készletet; a régiek cseréje külön CRO-/tulajdonosi döntés.

## 3. Mappaszerkezet (DAM)
`assets/img/` (publikus, a pipeline írja): `brand/ about/ credentials/ equipment/ treatments/{dry-steam,chemical,combined}/ ipm/{inspection,monitoring,sealing,prevention}/ entomology/{adults,eggs,nymphs,excrement,moults,hiding-places}/ accommodation/ locations/ case-studies/ infographics/ icons/`. Nem publikus: `_archive-private/` (eredeti, teljes felbontás, kitakaratlan okmányok). A jelenlegi `assets/` és `img/` érintetlen marad.

## 4. Jogi/tulajdonosi nyilatkozat
Minden meglévő és új képhez: szerző, forrás, felhasználási jog, hozzájárulás (ha személy/ügyfél), publikálhatóság (OWNER-INPUT #25–#27). A nyilvántartás oszlopai: `author`, `usage_rights`, `privacy_status`, `owner_approval`.
