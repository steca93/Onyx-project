import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import { staticPageMetadata } from "@/lib/seo/metadata";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteSettings } from "@/data/site-settings";
import { formatPrice } from "@/lib/utils/format-price";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(toLocale(locale), "/dostava-i-povracaj", "shipping", "ShippingReturnsPage");
}

export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "ShippingReturnsPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: tCommon("home"), href: "/" },
          { label: t("title") },
        ]}
        title={t("title")}
        description={t("description")}
      />
      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <section className="border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("shippingHeading")}
          </h2>
          <p className="mb-4 text-body text-text-60">{t("shippingBody1")}</p>
          <p className="text-body text-text-60">
            {t.rich("shippingBody2", {
              amount: () => (
                <span className="text-text">
                  {formatPrice(siteSettings.freeShippingThresholdRsd)}
                </span>
              ),
              checkoutLink: (chunks) => (
                <Link href="/kasa" className="underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("trackingHeading")}
          </h2>
          <p className="text-body text-text-60">
            {t.rich("trackingBody", {
              phoneLink: () => (
                <a href={`tel:${siteSettings.supportPhone.replace(/\s/g, "")}`}>
                  {siteSettings.supportPhone}
                </a>
              ),
            })}
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("returnsHeading")}
          </h2>
          <p className="mb-4 text-body text-text-60">{t("returnsBody1")}</p>
          <p className="mb-4 text-body text-text-60">
            {t.rich("returnsBody2", {
              warrantyLink: (chunks) => (
                <Link href="/garancija" className="underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
          <p className="text-body text-text-60">{t("returnsBody3")}</p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("howToHeading")}
          </h2>
          <p className="text-body text-text-60">
            {t.rich("howToBody", {
              contactLink: (chunks) => (
                <Link href="/kontakt" className="underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </section>
      </div>
    </>
  );
}
