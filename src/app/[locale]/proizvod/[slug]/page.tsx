import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductGallery } from "@/components/sections/ProductGallery";
import { ProductPurchasePanel } from "@/components/sections/ProductPurchasePanel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductCard } from "@/components/ui/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import {
  getStaticProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/repo";
import { toLocale } from "@/i18n/routing";
import { stripHtml } from "@/lib/utils/strip-html";
import { rewriteWpHtml } from "@/lib/utils/wp-html";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Link } from "@/i18n/navigation";
import { breadcrumbJsonLd, JsonLd, productJsonLd } from "@/lib/seo/jsonld";
import { absoluteUrl, buildMetadata } from "@/lib/seo/metadata";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Runs once per locale (the parent [locale] layout supplies it). Anything
// not prerendered renders on first request and is then cached.
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const slugs = await getStaticProductSlugs(toLocale(params.locale));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale: requested, slug } = await params;
  const locale = toLocale(requested);
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const t = await getTranslations({ locale, namespace: "Seo" });
  const category = product.productCategories.nodes[0]?.name;

  return buildMetadata({
    locale,
    href: { pathname: "/proizvod/[slug]", params: { slug } },
    // Short names get their category appended so titles carry a keyword.
    title:
      category && product.name.length < 35
        ? t("productTitleWithCategory", { name: product.name, category })
        : product.name,
    description:
      stripHtml(product.shortDescription) ||
      stripHtml(product.description) ||
      t("productDescriptionFallback", { name: product.name, category: category ?? "" }),
    image: product.image ? { url: product.image.sourceUrl, alt: product.image.altText } : null,
  });
}

async function RelatedProducts({
  slug,
  eyebrow,
  title,
}: {
  slug: string;
  eyebrow: string;
  title: string;
}) {
  const related = await getRelatedProducts(slug, 4);
  if (related.length === 0) return null;
  return (
    <div className="mt-20 lg:mt-24">
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="mb-10 text-[32px] sm:text-h2">{title}</h2>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: requested, slug } = await params;
  const locale = toLocale(requested);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale, namespace: "ProductPage" });

  const category = product.productCategories.nodes[0];

  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const productUrl = absoluteUrl({ pathname: "/proizvod/[slug]", params: { slug } }, locale);
  const categoryHref = category
    ? { pathname: "/kategorija/[slug]" as const, params: { slug: category.slug } }
    : null;
  const breadcrumbs = [
    { label: tCommon("home"), href: "/" as const, url: absoluteUrl("/", locale) },
    ...(category && categoryHref
      ? [{ label: category.name, href: categoryHref, url: absoluteUrl(categoryHref, locale) }]
      : []),
    { label: product.name, url: productUrl },
  ];

  return (
    <div className="container-onyx mt-12 mb-24 lg:mt-16">
      <JsonLd
        data={[
          productJsonLd(product, productUrl),
          breadcrumbJsonLd(breadcrumbs.map((b) => ({ name: b.label, url: b.url }))),
        ]}
      />

      <div className="mb-8">
        <Breadcrumb items={breadcrumbs.map(({ label, href }) => ({ label, href }))} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-18">
        <ProductGallery mainImage={product.image} gallery={product.galleryImages.nodes} />

        <div className="min-w-0">
          {category && categoryHref && (
            <Link
              href={categoryHref}
              className="label-nav mb-4 inline-block text-text-40 transition-colors duration-200 hover:text-accent"
            >
              {category.name}
            </Link>
          )}
          <h1 className="text-[32px] tracking-[.03em] uppercase sm:text-[44px]">
            {product.name}
          </h1>
          {stripHtml(product.shortDescription) && (
            <div
              className="prose-onyx mt-5 max-w-[470px] text-body text-text-60"
              dangerouslySetInnerHTML={{ __html: rewriteWpHtml(product.shortDescription) }}
            />
          )}

          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>

          {product.specs.length > 0 && (
            <div className="lattice mt-10 grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.label} className="p-4">
                  <div className="label-column mb-2 text-text-40">{spec.label}</div>
                  <div className="text-body-sm text-text-60">{spec.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 lg:mt-24">
        <Tabs
          tabs={[
            {
              id: "opis",
              label: t("tabs.description"),
              content: stripHtml(product.description) ? (
                <div
                  className="prose-onyx max-w-[720px] text-body text-text-60"
                  dangerouslySetInnerHTML={{ __html: rewriteWpHtml(product.description) }}
                />
              ) : (
                <p className="max-w-[720px] text-body text-text-60">{t("descriptionSoon")}</p>
              ),
            },
            {
              id: "specifikacija",
              label: t("tabs.specs"),
              content:
                product.specs.length > 0 ? (
                  <div className="lattice max-w-[620px] grid-cols-2">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="p-4">
                        <div className="label-column mb-2 text-text-40">
                          {spec.label}
                        </div>
                        <div className="text-body-sm text-text-60">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body text-text-60">{t("specsSoon")}</p>
                ),
            },
            {
              id: "montaza",
              label: t("tabs.installation"),
              content: (
                <p className="max-w-[720px] text-body text-text-60">
                  {product.installationNotes ?? t("installationSoon")}
                </p>
              ),
            },
            {
              id: "garancija",
              label: t("tabs.warranty"),
              content: (
                <p className="max-w-[720px] text-body text-text-60">
                  {product.warrantyNotes ?? t("warrantySoon")}
                </p>
              ),
            },
          ]}
        />
      </div>

      {/* Streams after the main product content — not needed for first paint. */}
      <Suspense fallback={null}>
        <RelatedProducts slug={slug} eyebrow={t("relatedEyebrow")} title={t("relatedTitle")} />
      </Suspense>
    </div>
  );
}
