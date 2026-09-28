import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toLocale } from "@/i18n/routing";
import { Accordion } from "@/components/ui/Accordion";
import { PageHeader } from "@/components/ui/PageHeader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "FaqPage" });

  return { title: t("title"), description: t("metaDescription") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "FaqPage" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const faqs = t.raw("items") as { question: string; answer: string }[];

  return (
    <>
      <PageHeader
        breadcrumb={[{ label: tCommon("home"), href: "/" }, { label: t("title") }]}
        title={t("title")}
        description={t("description")}
      />
      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <Accordion items={faqs} />
      </div>
    </>
  );
}
