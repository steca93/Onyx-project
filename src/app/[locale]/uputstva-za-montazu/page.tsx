import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Uputstva za montažu",
  description:
    "Priprema, uslovi i koraci za pravilnu montažu ONYX PPF folija i keramičkih premaza.",
};

export default function InstallationGuidePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Početna", href: "/" },
          { label: "Uputstva za montažu" },
        ]}
        title="Uputstva za montažu"
        description="Osnovne smernice za pripremu i montažu — pun tehnički list dobijaš uz svaki proizvod."
      />
      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <section className="border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Priprema površine
          </h2>
          <p className="mb-4 text-body text-text-60">
            Lak mora biti čist, dekontaminiran i bez tragova voska ili
            silikonskih zaštita pre montaže. Preporučujemo pranje,
            dekontaminaciju glinom i brisanje IPA rastvorom neposredno pre
            postavljanja folije ili premaza.
          </p>
          <p className="text-body text-text-60">
            Sve nepravilnosti na laku — ogrebotine, udubljenja, tragove
            korozije — treba sanirati pre montaže. Folija prati kontinuitet
            površine i ne prikriva postojeća oštećenja.
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Uslovi u prostoru za montažu
          </h2>
          <p className="text-body text-text-60">
            Montaža se izvodi u zatvorenom, kontrolisanom prostoru bez
            prašine, na temperaturi između 18°C i 26°C. Prenizak vlažnost
            vazduha otežava aktivaciju lepka, dok prevelika vlažnost
            produžava vreme sušenja — oba faktora prate ovlašćeni centri
            prilikom zakazivanja termina.
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Sušenje i prva nega
          </h2>
          <p className="mb-4 text-body text-text-60">
            Nakon montaže PPF folije potrebno je minimum 48h sušenja pre
            prvog pranja vozila. Izbegavaj automatske perionice i
            visokopritisnu vodu direktno na ivice folije prvih 7 dana.
          </p>
          <p className="text-body text-text-60">
            Keramički premazi zahtevaju period sušenja naveden na
            deklaraciji proizvoda, obično 12–24h pre izlaganja vlazi, i
            dodatnih 7 dana pre nanošenja dodatnog sloja ili voska preko
            premaza.
          </p>
        </section>

        <section className="mt-14 border-t border-hairline pt-10">
          <h2 className="mb-5 text-[26px] tracking-[.04em] uppercase sm:text-h3-card">
            Montaža u ovlašćenom centru
          </h2>
          <p className="text-body text-text-60">
            Ova uputstva pokrivaju opštu pripremu i negu — puna 12-godišnja
            garancija na materijal i rad važi isključivo uz montažu u{" "}
            <Link href="/ovlasceni-centri" className="underline">
              ovlašćenom ONYX centru
            </Link>{" "}
            i registraciju u{" "}
            <Link href="/garancija" className="underline">
              ONYX Warranty programu
            </Link>
            . Detaljno tehničko uputstvo za svaki proizvod dobijaš u
            ovlašćenom centru prilikom montaže.
          </p>
        </section>
      </div>
    </>
  );
}
