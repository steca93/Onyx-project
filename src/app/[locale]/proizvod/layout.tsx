import { ClientMessages } from "@/i18n/ClientMessages";
import { toLocale } from "@/i18n/routing";

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <ClientMessages locale={toLocale(locale)} route="proizvod">
      {children}
    </ClientMessages>
  );
}
