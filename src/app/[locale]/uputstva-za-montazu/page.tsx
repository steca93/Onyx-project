import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteSettings } from "@/data/site-settings";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "InstallGuidePage" });

  return { title: t("title"), description: t("metaDescription") };
}

export default async function InstallationGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "InstallGuidePage" });
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
            {t("surfaceHeading")}
          </h2>
          <p className="mb-4 text-body text-text-60">{t("surfaceBody1")}</p>
          <p className="text-body text-text-60">{t("surfaceBody2")}</p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("environmentHeading")}
          </h2>
          <p className="text-body text-text-60">{t("environmentBody")}</p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("curingHeading")}
          </h2>
          <p className="mb-4 text-body text-text-60">{t("curingBody1")}</p>
          <p className="text-body text-text-60">{t("curingBody2")}</p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            {t("authorizedHeading")}
          </h2>
          <p className="text-body text-text-60">
            {t.rich("authorizedBody", {
              years: siteSettings.warrantyYears,
              centersLink: (chunks) => (
                <Link href="/ovlasceni-centri" className="underline">
                  {chunks}
                </Link>
              ),
              warrantyLink: (chunks) => (
                <Link href="/garancija" className="underline">
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
