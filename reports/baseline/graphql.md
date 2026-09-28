# WPGraphQL timing

Endpoint: `woocommerce-1614143-6633101.cloudwaysapps.com` · 3 sequential runs each, median shown · 2026-09-28T21:09:06.325Z

| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |
|---|---|---|---|---|---|---|
| Categories | layout (every page), home, sitemap | 512 | 466–587 | 1.8 | 12 | — |
| CategoryBySlug | category page | 520 | 439–622 | 0.3 | 0 | — |
| Products (category, 7) | category page p1 | 608 | 605–622 | 20.7 | 21 | — |
| Products (featured, 8) | home bestsellers | 518 | 469–532 | 0.2 | 0 | — |
| Products (newest, 9) | home fallback / search | 605 | 561–724 | 29.8 | 27 | — |
| ProductBySlug (+related) | product page | 607 | 541–672 | 17.4 | 15 | — |
| AllProductSlugs | generateStaticParams, sitemap | 724 | 601–794 | 2.1 | 32 | — |
| SearchIndex | /api/search-index, EN/DE search | 1537 | 1097–2675 | 8.4 | 32 | — |
