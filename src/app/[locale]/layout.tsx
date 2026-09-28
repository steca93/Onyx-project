import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { ClientMessages } from "@/i18n/ClientMessages";
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
import { getAllCategories, getProductNameTranslations, getUntranslatedSlugs } from "@/lib/repo";
import { BRAND, IS_INDEXABLE, SITE_URL, TITLE_SUFFIX } from "@/lib/seo/env";
import { DEFAULT_OG_IMAGE, OG_LOCALES } from "@/lib/seo/metadata";
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

  // Site-wide defaults; every page overrides title/description/canonical
  // via buildMetadata() (src/lib/seo/metadata.ts).
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: BRAND,
      template: `%s${TITLE_SUFFIX}`,
    },
    description: t("description"),
    applicationName: BRAND,
    robots: IS_INDEXABLE
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
      : { index: false, follow: false },
    openGraph: {
      siteName: BRAND,
      type: "website",
      locale: OG_LOCALES[locale],
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image" },
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

  const [allCategories, untranslated] = await Promise.all([getAllCategories(), getUntranslatedSlugs()]);
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
        <ClientMessages locale={locale}>
          <ProductNamesProvider names={getProductNameTranslations(locale)}>
            <UtilityBar untranslated={untranslated} />
            <Header categories={navCategories} />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer categories={navCategories} />
            <DeferredCartDrawer />
            <CookieConsent />
          </ProductNamesProvider>
        </ClientMessages>
      </body>
    </html>
  );
}
