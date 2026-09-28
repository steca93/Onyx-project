# WPGraphQL timing

Endpoint: `woocommerce-1614143-6633101.cloudwaysapps.com` · 3 sequential runs each, median shown · 2026-09-28T21:52:37.236Z

| Query | Used by | Median ms | Range ms | Size KB | Nodes | Errors |
|---|---|---|---|---|---|---|
| Categories | layout (every page), home, sitemap | 575 | 525–639 | 1.8 | 12 | — |
| CategoryBySlug | category page | 604 | 562–618 | 0.4 | 0 | — |
| Products (category, 7) | category page p1 | 578 | 574–676 | 4.5 | 14 | — |
| Products (featured, 8) | home bestsellers | 524 | 510–567 | 0.2 | 0 | — |
| Products (newest, 9) | home fallback / search | 624 | 557–687 | 5.7 | 18 | — |
| ProductBySlug (+related) | product page | 629 | 617–696 | 8.7 | 11 | — |
| AllProductSlugs | generateStaticParams, sitemap | 629 | 587–680 | 3.3 | 32 | — |
| SearchIndex | /api/search-index, EN/DE search | 617 | 613–640 | 8.4 | 32 | — |
