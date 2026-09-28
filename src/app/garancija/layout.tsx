import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registruj garanciju",
  description:
    "Registruj ONYX Warranty garanciju na montiranu PPF foliju ili keramički premaz i dobij digitalni sertifikat.",
};

export default function GarancijaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
