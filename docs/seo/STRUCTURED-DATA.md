# STRUCTURED-DATA — JSON-LD entitásrendszer

Elv: **csak valós, látható, igazolható** tartalmat jelölünk. A Schema.org szemantikus jelölés ≠ a Google által támogatott rich result: a jelölés az entitás-egyértelműséget szolgálja, megjelenést **nem ígérünk**. Az aktuális Google Search Central iránymutatás az elsődleges forrás (ellenőrzés P1-10-ben a build előtt).

## 1. Stabil `@id` kiosztás (egy helyen, `data/site.json`-ból)
| Entitás | `@id` | Típus | Mikor |
|---|---|---|---|
| Szervezet | `https://www.controldechinches.es/#organization` | `Organization` | minden oldal (hivatkozás) |
| Weboldal | `…/#website` | `WebSite` (+`inLanguage`) | minden oldal |
| Szakember | `…/sobre-mi/#person` | `Person` (`worksFor` → #organization; `knowsAbout`; `hasCredential` csak igazolt bizonyítványra) | P2-től |
| Szolgáltatások | `…/servicios/<slug>/#service` | `Service` (`provider` → #organization; `areaServed` = igazolt települések `AdministrativeArea`/`City`; **`Offer` csak ha az ár igazolt és központi**) | P3-tól |
| Oldal | az oldal URL-je + `#webpage` | `WebPage` / `AboutPage` / `ProfilePage` / `CollectionPage` | minden oldal |
| Cikk | `…#article` | `Article` (`author` → #person, `datePublished`, `dateModified` valós; `image`) | cikkek |
| Morzsa | – | `BreadcrumbList` | minden új oldal |
| Kép | `…#image-<id>` | `ImageObject` (`creator`, `license`/`acquireLicensePage`, `caption`) | atlasz, hero |

A meglévő oldalak jelölése (Service + Organization, belső `provider`) **érintetlen**; az entitás-egységesítés (azonos `@id`) jóváhagyással történhet (védett oldal).

## 2. Típusok relevanciája
| Típus | Döntés |
|---|---|
| `LocalBusiness` | **Nem használjuk**, amíg valós, látható cím/GBP/NAP nincs igazolva (D-007). `Organization` + `Service.areaServed` elég. |
| `Person` / `ProfilePage` | Igen (P2), csak igazolt adatokkal. |
| `Service` + `Offer` | `Service` igen; `Offer`/`priceSpecification` csak a központi, igazolt árból (A-C1 megoldása után). |
| `FAQPage` | **Alapértelmezésben nem.** A Google FAQ rich result-ot jelentősen korlátozta; csak akkor, ha az aktuális irányelv megengedi és az oldal megfelel (FAQ-STRATEGY §5). A GYIK HTML-ben teljes értékű jelölés nélkül. |
| `HowTo` | Nem (a Google kivezette a rich resultot); a lépéseket HTML-listában írjuk. |
| `Review` / `AggregateRating` | **Tilos** valós, látható, igazolható vélemény nélkül; fiktív soha. |
| `ImageObject`/`ImageGallery` | Igen az atlaszhoz/makrókhoz. |
| `WebApplication` | az identificador-hoz (opcionális, nem rich result). |

## 3. Tiltások
Hamis AggregateRating · fiktív vélemények · hamis telephely/cím · valótlan szakmai cím · nem létező ajánlat · nem igazolt ár · nem létező jogosultság (`hasCredential` csak dokumentált) · a lapon nem látható tartalom jelölése.

## 4. Validálás
Build: JSON-parse + kötelező mezők + `@id`-hivatkozások feloldhatósága + a jelölt szöveg szerepel az oldalon; manuális: Google Rich Results Test / Schema Markup Validator a preview-n (P1-10).
