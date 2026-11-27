# FAQ-STRATEGY — `/preguntas-frecuentes/` · `/en/faq/` (PG-030)

## 1. Szerep
Központi, tematikus GYIK: gyors válasz + mély link. A főoldal és az árak-oldal meglévő GYIK-ja **érintetlen** (Ads); az új GYIK nem másolja azokat, hanem ugyanazokra az adatokra hivatkozik (egy ár-forrás: DATA-ARCHITECTURE).

## 2. Kategóriák (14) és a mélylink
| # | Kategória | Mélylink |
|---|---|---|
| 1 | Felismerés | PG-041, PG-070, PG-071 |
| 2 | Árak | `/precios.html` |
| 3 | Időpontfoglalás | CTA (csak valós rendelkezésre állás szerint) |
| 4 | Szolgáltatási területek | PG-020 |
| 5 | Vegyszeres kezelés | PG-014, PG-052 |
| 6 | Szárazgőzös kezelés | PG-013, PG-050 |
| 7 | Integrált kezelés | PG-011 |
| 8 | Előkészítés | PG-055 |
| 9 | Utókezelés | PG-056 |
| 10 | Kezelési idő | PG-054 |
| 11 | Gyermekek és háziállatok | PG-057 |
| 12 | Újrafertőződés | PG-053 |
| 13 | Megelőzés | PG-047, PG-048, PG-059 |
| 14 | Apartmanok és szállodák | PG-003, PG-015, PG-061 |

## 3. Kérdések forrása (nem találjuk ki)
Prioritás: (1) Ads search-terms és a WhatsApp/telefon valós kérdései (tulajdonos, OWNER-INPUT), (2) GSC lekérdezések, (3) „People also ask” kézi gyűjtés ES-IP-ről, (4) ügyfél-kérdések az AI-diszpécser naplójából (**csak olvasás, tulajdonosi engedéllyel**). Minden kérdéshez rögzítjük a forrást és dátumot.

## 4. Formátum
HTML-ben kinyitható `<details>` (a válasz a forrásban megvan), mobilon is jól használható; kategória-horgonyok; kereső nincs (JS-függés minimalizálása). Válaszok 40–120 szó, utána mélylink. Árakat/időtartamot csak a központi adatból generálunk.

## 5. Strukturált adat
`FAQPage` jelölés **csak** akkor kerülhet rá, ha az aktuális Google-iránymutatás megengedi és az oldal megfelel (a Google a FAQ rich resultot jelentősen korlátozta, ezért **nem ígérünk** megjelenést; a jelölés alapértelmezésben ki van kapcsolva, döntés: STRUCTURED-DATA §FAQ). A tartalom jelölés nélkül is teljes értékű.

## 6. Szakmai szabály
Orvosi/jogi/biocid-kérdések: konzervatív válasz + hatósági forrás; nincs eredménygarancia; „mikor térhetek vissza a szobába” kérdés csak a tényleges termék/módszer szerint (LGL-05).
