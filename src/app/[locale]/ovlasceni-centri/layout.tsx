import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { toLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "InstallersPage" });

  return { title: t("title"), description: t("metaDescription") };
}

export default function InstallersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
