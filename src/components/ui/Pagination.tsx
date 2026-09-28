import { useTranslations } from "next-intl";
import { Link, type AppHref } from "@/i18n/navigation";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefForPage: (page: number) => AppHref;
}

export function Pagination({ currentPage, totalPages, hrefForPage }: PaginationProps) {
  const t = useTranslations("Pagination");

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label={t("ariaLabel")} className="flex items-center gap-6">
      {pages.map((page) => {
        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={hrefForPage(page)}
            aria-current={isCurrent ? "page" : undefined}
            className={`border-b-2 pb-1 font-mono text-[12px] transition-colors duration-200 ${
              isCurrent
                ? "border-accent text-text"
                : "border-transparent text-text-40 hover:text-text"
            }`}
          >
            {String(page).padStart(2, "0")}
          </Link>
        );
      })}
    </nav>
  );
}
