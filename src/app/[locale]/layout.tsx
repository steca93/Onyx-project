import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Questrial, Space_Mono } from "next/font/google";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { DeferredCartDrawer } from "@/components/layout/DeferredUI";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { routing, toLocale } from "@/i18n/routing";
import { ProductNamesProvider } from "@/i18n/catalog/ProductNamesProvider";
import { getAllCategories, getProductNameTranslations } from "@/lib/repo";
import "../globals.css";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-questrial",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-space-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = toLocale(requested);
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s · ${t("title")}`,
    },
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale: requested } = await params;
  if (!hasLocale(routing.locales, requested)) {
    notFound();
  }
  const locale = toLocale(requested);

  // Static rendering: tells next-intl which locale is active for this
  // request during the render pass, so pages under this layout can be
  // statically generated per-locale instead of forced into dynamic
  // rendering.
  setRequestLocale(locale);

  const allCategories = await getAllCategories();
  // Nav/footer are for browsing — a category with no products yet (or a
  // parent term with only subcategories, like WooCommerce's "Uncategorized"
  // siblings) would just open onto an empty page, so only list ones that
  // actually have something in them.
  const navCategories = allCategories.filter((c) => (c.count ?? 0) > 0);

  return (
    <html
      lang={locale}
      className={`${questrial.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-onyx-850 font-sans text-text">
        <NextIntlClientProvider>
          <ProductNamesProvider names={getProductNameTranslations(locale)}>
            <UtilityBar />
            <Header categories={navCategories} />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer categories={navCategories} />
            <DeferredCartDrawer />
            <CookieConsent />
          </ProductNamesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
