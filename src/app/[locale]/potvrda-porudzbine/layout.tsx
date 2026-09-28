import type { Metadata } from "next";
import { ClientMessages } from "@/i18n/ClientMessages";
import { getTranslations } from "next-intl/server";
import { toLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "OrderConfirmationPage" });

  return { title: t("title"), robots: { index: false, follow: true } };
}

export default async function OrderConfirmationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ClientMessages locale={toLocale(locale)} route="potvrda-porudzbine">
      {children}
    </ClientMessages>
  );
}
