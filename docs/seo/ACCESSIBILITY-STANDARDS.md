# ACCESSIBILITY-STANDARDS — WCAG 2.2 AA

## 1. Alap (minden új oldalon)
`lang` helyes (ES/EN; idegen nyelvű részen `lang`) · skip-link · egy H1, logikus H2–H3 · landmark-ok (`header/nav/main/footer`, több `nav` esetén `aria-label`) · fókusz látható (3 px `--focus`, **nem takarható el** — WCAG 2.4.11) · billentyűvel minden használható · kontraszt ≥ 4.5:1 (nagy szöveg ≥ 3:1, UI-elem ≥ 3:1) · érintési célpont ≥ 44 px (min. 24 px — 2.5.8) · nincs csak színnel közvetített információ · szöveg 200%-ig nagyítható görgetés-hiba nélkül, reflow 320 px · `prefers-reduced-motion` · kép: informatív `alt`, dekoratív `alt=""` · link-szöveg önmagában érthető · konzisztens segítség/kapcsolat (3.2.6).

## 2. Komponens-szabályok
| Komponens | Követelmény |
|---|---|
| Accordion (GYIK) | natív `<details>/<summary>`; a válasz a DOM-ban; ne rejtsen kritikus tartalmat |
| Lightbox / galéria | `dialog` vagy `role=dialog aria-modal`, fókusz-csapda, ESC, vissza a kiváltóra, nyíl-billentyűk, képaláírás `aria-describedby`, nagyítás billentyűvel |
| Táblázat | `<caption>`, `scope`, mobilon görgethető konténer `tabindex=0` + `aria-label` |
| Infografika | `role=img` + `<title>/<desc>`; a tartalom HTML-listában is (IG-spec) |
| Identificador (T-I) | `fieldset/legend` kérdésenként, rádiógombok natív, eredmény `aria-live=polite`, JS nélkül statikus tartalom |
| Tartalomjegyzék | `nav aria-label`, horgonyok, mobilon `<details>` |
| Nyelvváltó | `lang`/`hreflang`/`aria-current` (a meglévő minta) |
| Sticky CTA | nem takarhatja a fókuszt/consent-sávot; `scroll-padding-bottom` |
| PDF | címkézett PDF + HTML-megfelelő (PG-072) |

## 3. Tesztelés (TEST-PLAN)
Automata: axe-core + Lighthouse a11y minden oldalon (build/CI). Manuális: billentyű-végigjárás, 200%/400% nagyítás, NVDA+Firefox/Chrome (Windows) és VoiceOver+Safari (iOS), nagy kontraszt/sötét mód, mozgáscsökkentés. A szubjektív minőséget emberi átnézés adja.

## 4. A meglévő oldalak
Nem auditáltam axe/képernyőolvasóval (P0 nem futtatta) → *nem igazolt*; a kód alapján pozitív: skip-link, `aria-label`-ek, natív `<details>`, `alt` minden képen. Javítási javaslatok jóváhagyással (Ads-védelem).
