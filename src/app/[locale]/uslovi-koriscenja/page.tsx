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
  return staticPageMetadata(toLocale(locale), "/uslovi-koriscenja", "terms", "TermsPage");
}

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-hairline pt-8 scroll-mt-24">
      <h2 className="mb-4 text-body font-bold tracking-[.04em] text-text uppercase">
        {title}
      </h2>
      <div className="text-body-sm text-text-60">{children}</div>
    </section>
  );
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "TermsPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const tSite = await getTranslations({ locale, namespace: "Site" });

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: tCommon("home"), href: "/" }, { label: t("title") }]}
        title={t("title")}
        description={t("description")}
      />

      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <div className="flex flex-col gap-10">
          <Section id="koriscenje-sajta" title={t("siteUseTitle")}>
            <p>{t("siteUseBody")}</p>
          </Section>

          <Section title={t("ordersTitle")}>
            <p>
              {t.rich("ordersBody", {
              checkoutLink: (chunks) => (
                <Link href="/kasa" className="text-accent underline underline-offset-2 hover:no-underline">
                  {chunks}
                </Link>
              ),
              })}
            </p>
          </Section>

          <Section title={t("conversionTitle")}>
            <p>{t("conversionBody")}</p>
          </Section>

          <Section title={t("shippingTitle")}>
            <p>
              {t.rich("shippingBody", {
              amount: formatPrice(siteSettings.freeShippingThresholdRsd),
              shippingLink: (chunks) => (
                <Link href="/dostava-i-povracaj" className="text-accent underline underline-offset-2 hover:no-underline">
                  {chunks}
                </Link>
              ),
              })}
            </p>
          </Section>

          <Section title={t("warrantyTitle")}>
            <p>
              {t.rich("warrantyBody", {
              warrantyLink: (chunks) => (
                <Link href="/garancija" className="text-accent underline underline-offset-2 hover:no-underline">
                  {chunks}
                </Link>
              ),
              })}
            </p>
          </Section>

          <Section title={t("ipTitle")}>
            <p>{t("ipBody")}</p>
          </Section>

          <Section title={t("liabilityTitle")}>
            <p>{t("liabilityBody")}</p>
          </Section>

          <Section title={t("lawTitle")}>
            <p>{t("lawBody")}</p>
          </Section>

          <div className="border-t-2 border-hairline-strong pt-10">
            <div className="mb-2 text-badge text-accent">{t("legalEyebrow")}</div>
            <h2
              id="politika-privatnosti"
              className="scroll-mt-24 text-[26px] tracking-[.04em] uppercase sm:text-h3-card"
            >
              {t("privacyHeading")}
            </h2>
            <p className="mt-2 text-body-sm text-text-40">{t("privacyIntro")}</p>
          </div>

          <Section title={t("merchantTitle")}>
            <p className="whitespace-pre-line">
              {t("merchantInfo", {
                address: siteSettings.contact.address,
                email: siteSettings.contact.email,
                phone: siteSettings.contact.phone,
                hours: tSite("workingHours"),
              })}
            </p>
            <p className="mt-3 text-[11px] text-text-40">
              {t("merchantPending")}
            </p>
          </Section>

          <Section title={t("dataCollectedTitle")}>
            <p>{t("dataCollectedBody")}</p>
          </Section>

          <Section title={t("dataUseTitle")}>
            <p>{t("dataUseBody")}</p>
          </Section>

          <Section title={t("transactionTitle")}>
            <p>{t("transactionBody")}</p>
          </Section>

          <Section title={t("cookiesTitle")}>
            <p>{t("cookiesBody")}</p>
          </Section>

          <Section title={t("rightsTitle")}>
            <p>
              {t.rich("rightsBody", {
              contactLink: (chunks) => (
                <Link href="/kontakt" className="text-accent underline underline-offset-2 hover:no-underline">
                  {chunks}
                </Link>
              ),
              })}
            </p>
          </Section>

          <div className="border-t border-hairline pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] tracking-[.1em] text-text-40 uppercase">
              {t("lastUpdated")}
            </p>
            <Link
              href="/kontakt"
              className="font-mono text-[10px] tracking-[.1em] text-accent uppercase hover:underline"
            >
              {t("questionLink")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
