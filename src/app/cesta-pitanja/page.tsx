import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { PageHeader } from "@/components/ui/PageHeader";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Česta pitanja",
  description:
    "Odgovori na najčešća pitanja o PPF folijama, keramičkim premazima, montaži, garanciji i dostavi.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Početna", href: "/" }, { label: "Česta pitanja" }]}
        title="Česta pitanja"
        description="Odgovori na pitanja koja nam instalateri i vlasnici vozila najčešće postavljaju."
      />
      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <Accordion items={faqs} />
      </div>
    </>
  );
}
