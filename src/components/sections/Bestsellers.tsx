import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ProductCard } from "@/components/ui/ProductCard";
import type { AnyProduct } from "@/lib/repo/types";

export interface BestsellersProps {
  products: AnyProduct[];
}

export function Bestsellers({ products }: BestsellersProps) {
  return (
    <section className="container-onyx mt-19 lg:mt-24">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <Eyebrow className="mb-4">NAŠI FAVORITI</Eyebrow>
          <h2 className="text-[32px] sm:text-h2">Najprodavanije</h2>
        </div>
        <Link
          href="/pretraga"
          className="label-nav text-text-60 transition-colors duration-200 hover:text-accent"
        >
          POGLEDAJ SVE →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
