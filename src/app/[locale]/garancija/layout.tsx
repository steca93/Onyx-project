import type { Metadata } from "next";
import { toLocale } from "@/i18n/routing";
import { staticPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return staticPageMetadata(toLocale(locale), "/garancija", "warranty", "WarrantyPage");
}

export default function GarancijaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
