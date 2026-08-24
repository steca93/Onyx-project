import type { Metadata } from "next";
import { Questrial, Space_Mono } from "next/font/google";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sr"
      className={`${questrial.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-onyx-850 font-sans text-text">
        {children}
      </body>
    </html>
  );
}
