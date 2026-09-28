import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Postani instalater",
  description:
    "Pridruži se mreži ovlašćenih ONYX centara za montažu PPF folija i keramičkih premaza.",
};

export default function BecomeInstallerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
