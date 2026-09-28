import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/components/ui/ProductCard";
import { Select } from "@/components/ui/Select";
import { toLocale } from "@/i18n/routing";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/repo";
import type { ProductSort } from "@/lib/repo/types";
import { stripHtml } from "@/lib/utils/strip-html";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, itemListJsonLd, JsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";

// Sort value -> message key under `CategoryPage.sort`.
const SORT_OPTIONS = [
  { value: "featured", labelKey: "featured" },
  { value: "price-asc", labelKey: "priceAsc" },
  { value: "price-desc", labelKey: "priceDesc" },
  { value: "name-asc", labelKey: "nameAsc" },
  { value: "newest", labelKey: "newest" },
] as const satisfies readonly { value: ProductSort; labelKey: string }[];

const PER_PAGE = 6;

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function readNumber(value: string | string[] | undefined): number | undefined {
  const str = Array.isArray(value) ? value[0] : value;
  const n = str ? Number(str) : undefined;
  return n !== undefined && !Number.isNaN(n) ? n : undefined;
}

function readString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = toLocale(requested);
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const t = await getTranslations({ locale, namespace: "Seo" });

  const page = Math.max(1, readNumber(sp.page) ?? 1);
  const hasFilters = ["sort", "inStock", "minPrice", "maxPrice"].some((k) => sp[k] !== undefined);
  const href = {
    pathname: "/kategorija/[slug]" as const,
    params: { slug },
    ...(page > 1 ? { query: { page: String(page) } } : {}),
  };

  return buildMetadata({
    locale,
    href,
    title:
      page > 1
        ? t("categoryTitlePaged", { name: category.name, page })
        : t("categoryTitle", { name: category.name }),
    description: stripHtml(category.description) || t("categoryDescriptionFallback", { name: category.name }),
    image: category.image ? { url: category.image.sourceUrl, alt: category.image.altText } : null,
    // Paginated pages are canonical to themselves; filter/sort variants
    // point at the clean category URL (and are disallowed in robots.txt).
    ...(hasFilters ? { canonicalHref: { pathname: "/kategorija/[slug]" as const, params: { slug } } } : {}),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { locale: requested, slug } = await params;
  const sp = await searchParams;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "CategoryPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tSeo = await getTranslations({ locale, namespace: "Seo" });

  const page = Math.max(1, readNumber(sp.page) ?? 1);
  const sort = (readString(sp.sort) ?? "featured") as ProductSort;
  const inStockOnly = readString(sp.inStock) === "1";
  const minPrice = readNumber(sp.minPrice);
  const maxPrice = readNumber(sp.maxPrice);

  // `getProductsByCategory` already resolves and returns the category —
  // no need for a separate `getCategoryBySlug` call here.
  const { products, total, category } = await getProductsByCategory(slug, {
    page,
    perPage: PER_PAGE,
    sort,
    inStockOnly: inStockOnly || undefined,
    minPrice,
    maxPrice,
  });
  if (!category) notFound();

  const totalPages = total ? Math.max(1, Math.ceil(total / PER_PAGE)) : 1;
  const hasActiveFilters =
    inStockOnly || minPrice !== undefined || maxPrice !== undefined || sort !== "featured";

  function hrefForPage(targetPage: number) {
    const query: Record<string, string> = {};
    if (sort !== "featured") query.sort = sort;
    if (inStockOnly) query.inStock = "1";
    if (minPrice !== undefined) query.minPrice = String(minPrice);
    if (maxPrice !== undefined) query.maxPrice = String(maxPrice);
    if (targetPage > 1) query.page = String(targetPage);
    return { pathname: "/kategorija/[slug]" as const, params: { slug }, query };
  }

  const categoryHref = (categorySlug: string) => ({
    pathname: "/kategorija/[slug]" as const,
    params: { slug: categorySlug },
  });
  const subcategories = (category.children ?? []).filter((c) => (c.count ?? 0) > 0);
  const breadcrumbs = [
    { label: tCommon("home"), href: "/" as const, url: absoluteUrl("/", locale) },
    ...(category.parent
      ? [
          {
            label: category.parent.name,
            href: categoryHref(category.parent.slug),
            url: absoluteUrl(categoryHref(category.parent.slug), locale),
          },
        ]
      : []),
    { label: category.name, url: absoluteUrl(categoryHref(slug), locale) },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbs.map((b) => ({ name: b.label, url: b.url }))),
          itemListJsonLd(
            tSeo("productListName", { name: category.name }),
            products.map((p) =>
              absoluteUrl({ pathname: "/proizvod/[slug]", params: { slug: p.slug } }, locale),
            ),
          ),
        ]}
      />
      <PageHeader
        breadcrumb={breadcrumbs.map(({ label, href }) => ({ label, href }))}
        title={category.name}
        description={category.description ?? undefined}
      />

      {subcategories.length > 0 && (
        <nav aria-label={t("subcategories")} className="container-onyx mt-10">
          <div className="label-column mb-4 text-text-40">{t("subcategories")}</div>
          <ul className="flex flex-wrap gap-2.5">
            {subcategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={categoryHref(sub.slug)}
                  className="notch notch-12 inline-flex border border-hairline px-4 py-2.5 font-mono text-[11px] tracking-[.14em] text-text-60 uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  {sub.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="container-onyx mt-14 mb-24 lg:mt-18">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <form method="GET" className="lattice grid-cols-1">
              <div className="p-5">
                <div className="label-column mb-4 text-text-40">{t("priceLabel")}</div>
                <div className="flex gap-3">
                  <input
                    type="number"
                    name="minPrice"
                    min={0}
                    defaultValue={minPrice}
                    placeholder={t("minPlaceholder")}
                    aria-label={t("minPriceAria")}
                    className="notch notch-12 h-11 w-full min-w-0 border border-hairline bg-onyx-800 px-3 font-mono text-[10.5px] text-text placeholder:text-text-34 outline-none focus:border-[rgba(42,179,230,.55)]"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    min={0}
                    defaultValue={maxPrice}
                    placeholder={t("maxPlaceholder")}
                    aria-label={t("maxPriceAria")}
                    className="notch notch-12 h-11 w-full min-w-0 border border-hairline bg-onyx-800 px-3 font-mono text-[10.5px] text-text placeholder:text-text-34 outline-none focus:border-[rgba(42,179,230,.55)]"
                  />
                </div>
              </div>
              <div className="p-5">
                <Checkbox
                  name="inStock"
                  value="1"
                  defaultChecked={inStockOnly}
                  label={t("inStockOnly")}
                />
              </div>
              <div className="p-5">
                <Select
                  name="sort"
                  defaultValue={sort}
                  options={SORT_OPTIONS.map((opt) => ({
                    value: opt.value,
                    label: t(`sort.${opt.labelKey}`),
                  }))}
                  label={t("sortLabel")}
                />
              </div>
              <div className="flex flex-col gap-3 p-5">
                <Button type="submit" compact>
                  {t("applyFilters")}
                </Button>
                {hasActiveFilters && (
                  <Button href={{ pathname: "/kategorija/[slug]", params: { slug: slug } }} variant="secondary" compact>
                    {t("clearFilters")}
                  </Button>
                )}
              </div>
            </form>
          </aside>

          <div className="min-w-0">
            <div className="mb-8 flex items-center justify-between">
              <div className="label-nav text-text-40">
                {t("productCount", { count: total ?? 0 })}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-col items-start gap-6 border border-hairline bg-onyx-800 px-8 py-16">
                <p className="label-nav text-text-40">
                  {t("empty")}
                </p>
                <Button href={{ pathname: "/kategorija/[slug]", params: { slug: slug } }} variant="secondary" compact>
                  {t("clearFilters")}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <div className="mt-14 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    hrefForPage={hrefForPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
