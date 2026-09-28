import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ovlašćeni centri",
  description:
    "Mreža ovlašćenih ONYX instalatera za montažu PPF folija i keramičkih premaza u Srbiji.",
};

export default function InstallersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
