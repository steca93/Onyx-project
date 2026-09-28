import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/sections/ProductGallery";
import { ProductPurchasePanel } from "@/components/sections/ProductPurchasePanel";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductCard } from "@/components/ui/ProductCard";
import { Tabs } from "@/components/ui/Tabs";
import {
  getAllProductSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/repo";
import { stripHtml } from "@/lib/utils/strip-html";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: stripHtml(product.shortDescription) || undefined,
  };
}

const STOCK_AVAILABILITY: Record<string, string> = {
  IN_STOCK: "https://schema.org/InStock",
  OUT_OF_STOCK: "https://schema.org/OutOfStock",
  ON_BACKORDER: "https://schema.org/BackOrder",
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug, 4);
  const category = product.productCategories.nodes[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      stripHtml(product.shortDescription) || stripHtml(product.description) || undefined,
    image: product.image?.sourceUrl || undefined,
    sku: product.__typename === "SimpleProduct" ? product.sku ?? undefined : undefined,
    offers: {
      "@type": "Offer",
      price: product.price ?? undefined,
      priceCurrency: "RSD",
      availability: STOCK_AVAILABILITY[product.stockStatus],
    },
  };

  return (
    <div className="container-onyx mt-12 mb-24 lg:mt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-18">
        <ProductGallery mainImage={product.image} gallery={product.galleryImages.nodes} />

        <div className="min-w-0">
          {category && (
            <div className="label-nav mb-4 text-text-40">{category.name}</div>
          )}
          <h1 className="text-[32px] tracking-[.03em] uppercase sm:text-[44px]">
            {product.name}
          </h1>
          {stripHtml(product.shortDescription) && (
            <div
              className="prose-onyx mt-5 max-w-[470px] text-body text-text-60"
              dangerouslySetInnerHTML={{ __html: product.shortDescription! }}
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
              label: "OPIS",
              content: stripHtml(product.description) ? (
                <div
                  className="prose-onyx max-w-[720px] text-body text-text-60"
                  dangerouslySetInnerHTML={{ __html: product.description! }}
                />
              ) : (
                <p className="max-w-[720px] text-body text-text-60">Opis uskoro.</p>
              ),
            },
            {
              id: "specifikacija",
              label: "SPECIFIKACIJA",
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
                  <p className="text-body text-text-60">Specifikacija uskoro.</p>
                ),
            },
            {
              id: "montaza",
              label: "MONTAŽA",
              content: (
                <p className="max-w-[720px] text-body text-text-60">
                  {product.installationNotes ?? "Uputstvo za montažu uskoro."}
                </p>
              ),
            },
            {
              id: "garancija",
              label: "GARANCIJA",
              content: (
                <p className="max-w-[720px] text-body text-text-60">
                  {product.warrantyNotes ?? "Podaci o garanciji uskoro."}
                </p>
              ),
            },
          ]}
        />
      </div>

      {related.length > 0 && (
        <div className="mt-20 lg:mt-24">
          <Eyebrow className="mb-4">SLIČNI PROIZVODI</Eyebrow>
          <h2 className="mb-10 text-[32px] sm:text-h2">Povezani proizvodi</h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
