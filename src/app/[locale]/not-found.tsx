import { getTranslations } from "next-intl/server";
import { SearchBar } from "@/components/layout/SearchBar";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import { getAllCategories } from "@/lib/repo";

/**
 * Real 404 (status + noindex come from Next's notFound()). Gives visitors
 * who hit a dead product/category link a way back into the catalog.
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");
  const categories = (await getAllCategories()).filter((c) => (c.count ?? 0) > 0);

  return (
    <div className="border-b border-accent-line bg-onyx-900">
      <div className="container-onyx flex flex-col justify-center gap-5 py-16">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 className="text-[40px] tracking-[.02em] sm:text-page-h1">{t("heading")}</h1>
        <p className="max-w-[520px] text-body text-text-60">{t("body")}</p>

        <div className="mt-2 max-w-[520px]">
          <p className="mb-3 text-body-sm text-text-40">{t("searchHint")}</p>
          <SearchBar />
        </div>

        {categories.length > 0 && (
          <nav aria-label={t("browseCategories")} className="mt-4">
            <div className="label-column mb-4 text-text-40">{t("browseCategories")}</div>
            <ul className="flex flex-wrap gap-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={{ pathname: "/kategorija/[slug]", params: { slug: c.slug } }}
                    className="notch notch-12 inline-flex border border-hairline px-4 py-2.5 font-mono text-[11px] tracking-[.14em] text-text-60 uppercase transition-colors duration-200 hover:border-accent hover:text-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-4">
          <Button href="/" trailingArrow>
            {t("backHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
