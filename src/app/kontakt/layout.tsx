import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Pitanja o proizvodima, montaži ili porudžbinama — kontaktiraj ONYX EVOLUTION podršku.",
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
