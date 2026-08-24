"use client";

import { useState } from "react";
import type { AnyProduct } from "@/lib/repo/types";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { BoxedEyebrow } from "@/components/ui/BoxedEyebrow";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CategoryTile } from "@/components/ui/CategoryTile";
import { Checkbox } from "@/components/ui/Checkbox";
import { DiamondImage } from "@/components/ui/DiamondImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Input } from "@/components/ui/Input";
import { KitCard } from "@/components/ui/KitCard";
import { Lattice } from "@/components/ui/Lattice";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { PrismField } from "@/components/ui/PrismField";
import { ProductCard } from "@/components/ui/ProductCard";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Select } from "@/components/ui/Select";
import { SpecTicker } from "@/components/ui/SpecTicker";
import { StepRow } from "@/components/ui/StepRow";
import { Tabs } from "@/components/ui/Tabs";

const sampleProduct: AnyProduct = {
  __typename: "SimpleProduct",
  id: "sample-1",
  databaseId: 1,
  name: "ONYX Shield 8.0 · 152cm",
  slug: "onyx-shield-8-0",
  description: "Samoobnavljajuća PPF folija debljine 200 µm.",
  shortDescription: "Samoobnavljajuća PPF folija.",
  image: { sourceUrl: "", altText: "ONYX SHIELD 8.0" },
  galleryImages: { nodes: [] },
  productCategories: { nodes: [{ name: "PPF folije", slug: "ppf-folije" }] },
  specs: [],
  installationNotes: null,
  warrantyNotes: null,
  featured: true,
  newArrival: true,
  price: "142900",
  regularPrice: "142900",
  salePrice: null,
  stockStatus: "IN_STOCK",
  sku: "OX-SHIELD-8",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6 border-t border-hairline py-12 first:border-t-0 first:pt-0">
      <h2 className="text-h2 text-text">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

export default function ComponentsPreviewPage() {
  const [qty, setQty] = useState(1);

  return (
    <div className="container-onyx flex flex-col py-16">
      <h1 className="text-page-h1 mb-4 text-text">/dev/components</h1>
      <p className="text-body-sm mb-8 text-text-40">
        Internal preview only — deleted before final ship.
      </p>

      <Section title="Buttons">
        <Button variant="primary" trailingArrow>
          ISTRAŽI FOLIJE
        </Button>
        <Button variant="secondary">REGISTRUJ GARANCIJU</Button>
        <Button variant="outline-accent" trailingArrow>
          KUPI ODMAH
        </Button>
        <Button variant="primary" compact trailingArrow>
          DODAJ U KORPU
        </Button>
        <Button variant="secondary" compact>
          PITAJ ZA MONTAŽU
        </Button>
        <Button variant="outline-accent" compact disabled>
          NEDOSTUPNO
        </Button>
      </Section>

      <Section title="Inputs / Select / Checkbox">
        <Input label="EMAIL" placeholder="vasa@adresa.com" className="w-64" />
        <Input
          label="BROJ ŠASIJE"
          placeholder="WVWZZZ1JZXW000000"
          error="Obavezno polje"
          className="w-64"
        />
        <Select
          label="INSTALATER"
          placeholder="Izaberi centar"
          options={[
            { label: "ONYX Beograd", value: "bg" },
            { label: "ONYX Novi Sad", value: "ns" },
          ]}
          className="w-64"
        />
        <div className="flex flex-col gap-4">
          <Checkbox label="Slažem se sa uslovima korišćenja" defaultChecked />
          <Checkbox label="Prijavi me na bilten" />
        </div>
      </Section>

      <Section title="Eyebrow / BoxedEyebrow / Badge">
        <Eyebrow rule>PPF WARRANTY PROGRAM</Eyebrow>
        <Eyebrow>IZDVOJENO</Eyebrow>
        <BoxedEyebrow>ONYX WARRANTY</BoxedEyebrow>
        <Badge>NOVO</Badge>
      </Section>

      <Section title="ProductCard / KitCard">
        <div className="w-[260px]">
          <ProductCard product={sampleProduct} />
        </div>
        <KitCard product={sampleProduct} kicker="PPF SET" />
      </Section>

      <Section title="CategoryTile">
        <Lattice columns={3} className="w-full">
          <CategoryTile name="PPF folije" slug="ppf-folije" countLabel="14 PROIZVODA" />
          <CategoryTile name="Mat PPF" slug="mat-ppf" countLabel="6 PROIZVODA" />
          <CategoryTile
            name="Keramički premazi"
            slug="keramicki-premazi"
            countLabel="11 PROIZVODA"
          />
        </Lattice>
      </Section>

      <Section title="SpecTicker">
        <div className="w-full">
          <SpecTicker
            items={[
              "12 GODINA GARANCIJE",
              "SAMOOBNAVLJAJUĆI TOP COAT",
              "8 MIL / 200 µm",
              "PROZIRNOST 99%",
              "40+ OVLAŠĆENIH CENTARA",
            ]}
          />
        </div>
      </Section>

      <Section title="StepRow">
        <div className="w-full max-w-[620px]">
          <StepRow
            steps={[
              { number: "01", text: "Unesi broj šasije i datum montaže" },
              { number: "02", text: "Priloži račun ovlašćenog centra" },
              { number: "03", text: "Dobijaš digitalni sertifikat na mejl" },
            ]}
          />
        </div>
      </Section>

      <Section title="DiamondImage / PrismField">
        <DiamondImage image={{ sourceUrl: "", altText: "Faceted onyx" }} />
        <div className="relative h-[220px] w-[420px] overflow-hidden bg-onyx-900">
          <PrismField />
        </div>
      </Section>

      <Section title="QuantityStepper">
        <QuantityStepper value={qty} onChange={setQty} />
      </Section>

      <Section title="Pagination">
        <Pagination currentPage={2} totalPages={5} hrefForPage={(p) => `?page=${p}`} />
      </Section>

      <Section title="Accordion">
        <div className="w-full max-w-[720px]">
          <Accordion
            items={[
              { question: "Koliko traje garancija?", answer: "12 godina od datuma montaže." },
              { question: "Da li folija žuti?", answer: "Ne, samoobnavljajući top coat sprečava žutljenje." },
              { question: "Gde mogu da instaliram foliju?", answer: "U bilo kom od 40+ ovlašćenih centara." },
            ]}
          />
        </div>
      </Section>

      <Section title="Tabs">
        <div className="w-full">
          <Tabs
            tabs={[
              { id: "opis", label: "OPIS", content: <p className="text-body text-text-60">Opis proizvoda.</p> },
              { id: "spec", label: "SPECIFIKACIJA", content: <p className="text-body text-text-60">Specifikacija.</p> },
              { id: "montaza", label: "MONTAŽA", content: <p className="text-body text-text-60">Montaža.</p> },
            ]}
          />
        </div>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb
          items={[
            { label: "Početna", href: "/" },
            { label: "PPF folije", href: "/kategorija/ppf-folije" },
            { label: "ONYX Shield 8.0" },
          ]}
        />
      </Section>

      <Section title="PageHeader">
        <div className="w-full">
          <PageHeader
            breadcrumb={[{ label: "Početna", href: "/" }, { label: "PPF folije" }]}
            title="PPF FOLIJE"
            description="Samoobnavljajuće folije za lak, farove i felne."
          />
        </div>
      </Section>
    </div>
  );
}
