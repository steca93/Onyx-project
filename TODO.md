# TODO — stvari koje treba uraditi ručno

Zadaci van koda: podešavanja na Vercelu i WordPressu, sređivanje podataka u WooCommerce-u i odluke. Štikliraj kad završiš. Detalji su u `reports/SUMMARY.md`, `wp-backend/README.md` i `reports/seo-content-audit.md`.

## Pre prvog deploya

- [ ] **Otvoriti PR** za granu `perf-seo`: https://github.com/steca93/Onyx-project/pull/new/perf-seo
- [ ] **Proveriti gde je Cloudways server** (Cloudways → Server → Settings). U `vercel.json` je trenutno `fra1` (Frankfurt). Ako je server negde drugde, izabrati najbliži Vercel region, jer svaki nekeširan zahtev ide ka WordPressu.
- [ ] **Vercel env promenljive** (Project → Settings → Environment Variables, Production + Preview):
  - [ ] `WORDPRESS_API_URL` = `https://woocommerce-1614143-6633101.cloudwaysapps.com` (bez `/` na kraju)
  - [ ] `NEXT_PUBLIC_SITE_URL` = `https://onyx.com` na Production, preview URL na Preview
  - [ ] `REVALIDATE_SECRET` = novi tajni ključ (`openssl rand -hex 32`)
  - [ ] `DATA_SOURCE` = `live` i `NEXT_PUBLIC_DATA_SOURCE` = `live`
  - [ ] `SITE_INDEXABLE` **ne postavljati**, jer se to rešava automatski preko `VERCEL_ENV`
- [ ] **Domen na Vercelu:** `onyx.com` kao glavni, `www.onyx.com` preusmeren na `onyx.com`.

## WordPress (Cloudways)

- [ ] **Instalirati mu-plugin za osvežavanje keša** (uputstvo: `wp-backend/README.md`):
  - [ ] U `wp-config.php` dodati `ONYX_FRONTEND_URL` (`https://onyx.com`) i `ONYX_REVALIDATE_SECRET` (isti ključ kao `REVALIDATE_SECRET` na Vercelu)
  - [ ] Upload-ovati `wp-backend/mu-plugins/onyx-revalidate.php` u `wp-content/mu-plugins/`
  - [ ] Test: promeniti cenu nekog proizvoda i proveriti da se nova cena odmah vidi na sajtu

## Sređivanje podataka u WooCommerce-u

- [ ] **Skloniti 11 „placeholder" proizvoda** (isto ime kao kategorija, bez cene i slike, u „Uncategorized"): `ulozak-za-poliranje`, `sunder-za-nanosenje-premaza-aplikator`, `ppf-auto-folija`, `poliranje`, `peskir-za-auto`, `krpa-za-keramicku-zastitu`, `krpa-za-detaljno-ciscenje`, `krpa-za-ciscenje-stakala`, `keramicka-zastita-i-ppf`, `dubinsko-ciscenje`, `ciscenje-eksterijera`. Trenutno su objavljeni i nalaze se u sitemapu.
- [ ] **Crveni Hex sunđer za finiš:** obrisati internu „NAPOMENA: …" sa kraja opisa (vide je kupci).
- [ ] **Fish Scale krpa:** zameniti opis (trenutno je tekst od Glass Wipe krpe) i ispraviti tipfeler „greču".
- [ ] **Crni sunđer za finiš:** ime kaže i „Medium Cut" i „Finishing". Proveriti šta je tačno.
- [ ] **Označiti bestseller proizvode kao „Featured"** (zvezdica u listi proizvoda). Trenutno nijedan nije označen, pa sekcija „Najprodavanije" na početnoj prikazuje najnovije proizvode.
- [ ] **Kategorije:** dodati opis i sliku za svih 11 (predlozi uvodnih tekstova su u `reports/seo-suggestions.csv`).
- [ ] **SKU:** dodati SKU za Hex aplikator za gume. Proveriti SKU-ove „ONYXEVO" (Rapid Dryer) i „OX01" (Ultra Dryer), jer odstupaju od formata OX0xx.
- [ ] Pregledati i uvesti `reports/seo-suggestions.csv` (kratki opisi, alt tekstovi slika, uvodi kategorija).
- [ ] Ubuduće: kad se promeni slug proizvoda ili kategorije koji je već objavljen, dodati 301 preusmerenje u `src/data/redirects.ts`.

## Kasnije

- [ ] **Prelazak na `cms.onyx.com`:** promeniti `WORDPRESS_API_URL` na Vercelu, a kad sve radi, izbaciti stari Cloudways host iz `next.config.ts`.
- [ ] Posle lansiranja pratiti realne Core Web Vitals (naročito INP) u Vercel Speed Insights / Google Search Console.
- [ ] Prijaviti sitemap (`https://onyx.com/sitemap.xml`) u Google Search Console.

## Otvorene odluke

- [ ] **SEO polja po proizvodu:** za sada se naslovi i opisi prave iz imena i kratkog opisa. Ako zatreba poseban SEO naslov po proizvodu, preporuka je mali custom plugin (opcija C u `reports/seo-content-audit.md`), a ne Yoast/Rank Math.
- [ ] **Kontrast teksta:** boje `text-40`/`text-34` ne prolaze Lighthouse proveru kontrasta. To je dizajnerska odluka.
- [ ] **Order emailovi** (WordPress plugin) su samo na srpskom. Treba odlučiti da li se prevode na EN/DE.
- [ ] Opis u web manifestu je samo na srpskom.
