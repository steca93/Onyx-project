import type { Metadata } from "next";
import { Questrial, Space_Mono } from "next/font/google";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { getAllCategories } from "@/lib/repo";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "ONYX EVOLUTION",
    template: "%s · ONYX EVOLUTION",
  },
  description:
    "Ovlašćeni distributer PPF folija i keramičkih premaza za automobile u Srbiji.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const allCategories = await getAllCategories();
  // Nav/footer are for browsing — a category with no products yet (or a
  // parent term with only subcategories, like WooCommerce's "Uncategorized"
  // siblings) would just open onto an empty page, so only list ones that
  // actually have something in them.
  const navCategories = allCategories.filter((c) => (c.count ?? 0) > 0);

  return (
    <html
      lang="sr"
      className={`${questrial.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-onyx-850 font-sans text-text">
        <UtilityBar />
        <Header categories={navCategories} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer categories={navCategories} />
        <CartDrawer />
        <CookieConsent />
      </body>
    </html>
  );
}
