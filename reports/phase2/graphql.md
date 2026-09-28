# WPGraphQL timing

Endpoint: `woocommerce-1614143-6633101.cloudwaysapps.com` · 3 sequential runs each, median shown · 2026-09-28T21:31:06.361Z

| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |
|---|---|---|---|---|---|---|
| Categories | layout (every page), home, sitemap | 612 | 542–912 | 1.8 | 12 | — |
| CategoryBySlug | category page | 557 | 513–996 | 0.3 | 0 | — |
| Products (category, 7) | category page p1 | 627 | 621–1229 | 4.5 | 14 | — |
| Products (featured, 8) | home bestsellers | 602 | 573–1133 | 0.2 | 0 | — |
| Products (newest, 9) | home fallback / search | 571 | 569–700 | 5.7 | 18 | — |
| ProductBySlug (+related) | product page | 739 | 597–1118 | 8.7 | 11 | — |
| AllProductSlugs | generateStaticParams, sitemap | 977 | 748–2070 | 2.1 | 32 | — |
| SearchIndex | /api/search-index, EN/DE search | 802 | 632–886 | 8.4 | 32 | — |
