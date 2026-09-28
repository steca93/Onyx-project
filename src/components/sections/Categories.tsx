import { useTranslations } from "next-intl";
import { CategoryTile } from "@/components/ui/CategoryTile";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Lattice } from "@/components/ui/Lattice";
import type { ProductCategory } from "@/lib/repo/types";

export interface CategoriesProps {
  categories: ProductCategory[];
}

export function Categories({ categories }: CategoriesProps) {
  const t = useTranslations("CategoriesSection");

  return (
    <section className="container-onyx mt-19 lg:mt-24">
      <div className="mb-10">
        <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
        <h2 className="text-[32px] sm:text-h2">{t("heading")}</h2>
      </div>
      <Lattice className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryTile
            key={category.slug}
            name={category.name}
            slug={category.slug}
            countLabel={t("productCount", { count: category.count ?? 0 })}
          />
        ))}
      </Lattice>
    </section>
  );
}
