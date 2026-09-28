import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { footerLinks } from "@/data/footer-links";
import { siteSettings } from "@/data/site-settings";
import type { ProductCategory } from "@/lib/repo/types";

export interface FooterProps {
  categories: ProductCategory[];
}

export function Footer({ categories }: FooterProps) {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t border-hairline bg-onyx-900">
      <div className="container-onyx grid grid-cols-1 gap-10 pt-19 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:gap-15">
        <div className="order-1 lg:order-none">
          <div className="mb-1.5 text-[22px] tracking-[.3em]">
            ON<span className="text-accent">Y</span>X
          </div>
          <div className="mb-6 text-badge text-accent">EVOLUTION</div>
          <p className="max-w-[260px] text-body-sm text-text-40">
            {t("tagline")}
          </p>
          <div className="mt-6.5 flex gap-3 label-nav text-[9px] text-text-60">
            {siteSettings.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} — ${s.name}`}
                title={s.name}
                className="border border-hairline-strong px-2.5 py-1.5 transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5.5 label-column text-text-40">
            {t("shopHeading")}
          </div>
          <div className="flex flex-col gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={{ pathname: "/kategorija/[slug]", params: { slug: category.slug } }}
                className="text-body-sm text-text-60 hover:text-accent"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-5.5 label-column text-text-40">
            {t("supportHeading")}
          </div>
          <div className="flex flex-col gap-3">
            {footerLinks.podrska.map((link) => (
              <Link
                key={link.labelKey}
                href={link.href}
                className="text-body-sm text-text-60 hover:text-accent"
              >
                {t(`links.${link.labelKey}`)}
              </Link>
            ))}
          </div>
        </div>

        <div className="order-first sm:order-none">
          <div className="mb-5.5 label-column text-text-40">
            {t("newsletterHeading")}
          </div>
          <p className="mb-5 text-body-sm text-text-40">
            {t("newsletterBody")}
          </p>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-onyx mt-16 flex flex-col gap-4 border-t border-hairline py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-[9.5px] tracking-[.16em] text-text-34">
          {t("copyright", { year: new Date().getFullYear() })}
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[8.5px] tracking-[.14em] text-text-40">
          {siteSettings.paymentChips.map((chip) => (
            <span key={chip} className="border border-hairline px-3 py-1.5">
              {chip}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
