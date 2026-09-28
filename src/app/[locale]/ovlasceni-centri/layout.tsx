import type { Metadata } from "next";
import { ClientMessages } from "@/i18n/ClientMessages";
import { toLocale } from "@/i18n/routing";
import { staticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(toLocale(locale), "/ovlasceni-centri", "installers", "InstallersPage");
}

export default async function InstallersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ClientMessages locale={toLocale(locale)} route="ovlasceni-centri">
      {children}
    </ClientMessages>
  );
}
