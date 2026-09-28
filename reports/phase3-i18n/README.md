# Faza 3 (višejezično): tehnički SEO

| Zahtev | Rešenje |
|---|---|
| Neprevedeno en/de | `isTranslated()` (`src/lib/repo/localize.ts`): overlay ima ime. Repo vraća `null`, pa stranica vraća **404**. Takve stavke se izostavljaju iz listi, kategorija, pretrage, srodnih proizvoda, search indeksa, navigacije, breadcrumbs i podkategorija. Listing upiti se ograničavaju u samom backend upitu (`slugIn`), pa paginacija i brojevi ostaju tačni. |
| Nikad srpski tekst na en/de | Nedostajući en/de kratki ili dugi opis više ne pada nazad na srpski. Stranica prikazuje „uskoro" tekst, a meta opis koristi lokalizovani šablon. Takve stavke idu u audit. |
| hreflang | `buildMetadata({ locales })` navodi samo jezike u kojima stavka postoji (`availableLocales()`), plus `x-default` → sr. URL-ovi su apsolutni i recipročni (test). |
| Sitemap | Isto: URL i alternates samo za postojeće jezike. |
| Canonical | Svaka jezička verzija je self-canonical. Stranice sa `?page=N` su self-canonical, a filteri i sortiranje vode na čist URL. |
| Izbor jezika | Običan `<a href hrefLang lang>` na **ekvivalentnu** stranicu u drugom jeziku (prevedena putanja + isti slug). Ako stavka nema prevod u tom jeziku, link vodi na početnu tog jezika. Test proverava da su linkovi jednaki hreflang alternates. |
| JSON-LD | `WebPage` (proizvod) ili `CollectionPage` (kategorija) sa `inLanguage`. `Product` / `ItemList` su `mainEntity`, a `BreadcrumbList` je `breadcrumb`. Na `Product` i `BreadcrumbList` `inLanguage` nije validno svojstvo, pa se jezik nosi na stranici. |
| Metadata za crawlere | Next 16 šalje metadata streamingom u `<body>` kad je render spor. Googlebot nije na Next-ovoj podrazumevanoj listi „ograničenih" botova, pa je na hladnom renderu kategorije `<title>` završavao u body-ju. `htmlLimitedBots` = podrazumevana lista + Googlebot i generički `bot/crawler/spider`. |
| Redirekti | `src/data/redirects.ts` podržava `locales: [...]` za redirect specifičan za jedan jezik. |

## Usput pronađen i ispravljen bag
next-intl `usePathname()` vraća popunjenu internu putanju (`/proizvod/abc`), a ne šablon (`/proizvod/[slug]`). Zato je stari kod za označavanje **aktivne kategorije u navigaciji** tiho prestao da radi otkad su uvedene lokalizovane putanje. Novi `src/i18n/match-route.ts` prepoznaje rutu iz stvarnog URL-a, a koriste ga i izbor jezika i Header.
