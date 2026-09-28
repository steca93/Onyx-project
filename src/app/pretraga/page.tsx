import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { ProductCard } from "@/components/ui/ProductCard";
import { searchProducts } from "@/lib/repo";

const PER_PAGE = 9;

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function readString(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const sp = await searchParams;
  const q = readString(sp.q)?.trim();
  return {
    title: q ? `Pretraga: "${q}"` : "Pretraga",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const sp = await searchParams;
  const q = (readString(sp.q) ?? "").trim();
  const page = Math.max(1, Number(readString(sp.page)) || 1);

  const { products, total } = await searchProducts(q, {
    page,
    perPage: PER_PAGE,
  });

  const totalPages = total ? Math.max(1, Math.ceil(total / PER_PAGE)) : 1;

  function hrefForPage(targetPage: number) {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (targetPage > 1) query.set("page", String(targetPage));
    const qs = query.toString();
    return `/pretraga${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Početna", href: "/" }, { label: "Pretraga" }]}
        title={q ? `Rezultati za "${q}"` : "Svi proizvodi"}
      />
      <div className="container-onyx mt-14 mb-24 lg:mt-18">
        <div className="mb-8 label-nav text-text-40">
          {total ?? 0} PROIZVODA
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-start gap-6 border border-hairline bg-onyx-800 px-8 py-16">
            <p className="label-nav text-text-40">
              NEMA REZULTATA ZA OVU PRETRAGU.
            </p>
            <Button href="/" variant="secondary" compact>
              NAZAD NA POČETNU
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
    </>
  );
}
