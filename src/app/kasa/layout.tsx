import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kasa",
  robots: { index: false, follow: true },
};

export default function KasaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
