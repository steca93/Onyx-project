import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Korpa",
  robots: { index: false, follow: true },
};

export default function KorpaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
