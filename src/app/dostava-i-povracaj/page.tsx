import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteSettings } from "@/data/site-settings";
import { formatPrice } from "@/lib/utils/format-price";

export const metadata: Metadata = {
  title: "Dostava i povraćaj",
  description:
    "Rokovi dostave, cena dostave i uslovi povraćaja za porudžbine iz ONYX EVOLUTION prodavnice.",
};

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Početna", href: "/" },
          { label: "Dostava i povraćaj" },
        ]}
        title="Dostava i povraćaj"
        description="Sve što treba da znaš pre nego što naručiš."
      />
      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <section className="border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Dostava
          </h2>
          <p className="mb-4 text-body text-text-60">
            Porudžbine obrađujemo radnim danima, u roku od 24 časa od
            prijema uplate ili potvrde porudžbine za plaćanje pouzećem.
            Standardna dostava na teritoriji Srbije traje 1–3 radna dana,
            u zavisnosti od mesta isporuke.
          </p>
          <p className="text-body text-text-60">
            Dostava je besplatna za porudžbine preko{" "}
            <span className="text-text">
              {formatPrice(siteSettings.freeShippingThresholdRsd)}
            </span>
            . Za porudžbine ispod tog iznosa cena dostave se obračunava po
            važećem cenovniku kurirske službe i prikazuje se pre potvrde
            porudžbine na strani{" "}
            <Link href="/kasa" className="underline">
              Kasa
            </Link>
            .
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Praćenje porudžbine
          </h2>
          <p className="text-body text-text-60">
            Nakon slanja pošiljke dobijaš broj za praćenje na email adresu
            navedenu prilikom porudžbine. Za sva pitanja o statusu isporuke
            kontaktiraj podršku na{" "}
            <a href={`tel:${siteSettings.supportPhone.replace(/\s/g, "")}`}>
              {siteSettings.supportPhone}
            </a>
            .
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Povraćaj
          </h2>
          <p className="mb-4 text-body text-text-60">
            Neotvorene i nekorišćene folije, premaze i alat možeš vratiti u
            roku od 14 dana od prijema pošiljke, uz priložen račun.
            Proizvod mora biti u originalnom pakovanju i bez tragova
            korišćenja.
          </p>
          <p className="mb-4 text-body text-text-60">
            PPF folije koje su izrezane po meri vozila ili već montirane ne
            mogu se vratiti niti zameniti — jednom kada je montaža obavljena,
            garancija na materijal i rad se ostvaruje isključivo kroz{" "}
            <Link href="/garancija" className="underline">
              ONYX Warranty program
            </Link>
            , ne kroz povraćaj proizvoda.
          </p>
          <p className="text-body text-text-60">
            Trošak povraćaja snosi kupac, osim u slučaju da je proizvod
            oštećen u transportu ili je isporučen pogrešan artikal — u tom
            slučaju ONYX EVOLUTION snosi troškove povraćaja i zamene.
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Kako da pokreneš povraćaj
          </h2>
          <p className="text-body text-text-60">
            Javi se podršci putem stranice{" "}
            <Link href="/kontakt" className="underline">
              Kontakt
            </Link>{" "}
            sa brojem porudžbine i razlogom povraćaja. Uputstvo za slanje
            pošiljke i adresu magacina dobijaš mejlom u roku od jednog
            radnog dana.
          </p>
        </section>
      </div>
    </>
  );
}
