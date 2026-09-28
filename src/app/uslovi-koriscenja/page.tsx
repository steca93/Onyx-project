import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { siteSettings } from "@/data/site-settings";
import { formatPrice } from "@/lib/utils/format-price";

export const metadata: Metadata = {
  title: "Uslovi korišćenja",
  description:
    "Uslovi korišćenja ONYX EVOLUTION sajta i politika privatnosti — narudžbine, plaćanje, dostava, reklamacije i zaštita ličnih podataka.",
};

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-hairline pt-8 scroll-mt-24">
      <h2 className="mb-4 text-body font-bold tracking-[.04em] text-text uppercase">
        {title}
      </h2>
      <div className="text-body-sm text-text-60">{children}</div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ label: "Početna", href: "/" }, { label: "Uslovi korišćenja" }]}
        title="Uslovi korišćenja"
        description="Korišćenjem ONYX EVOLUTION sajta i kupovinom u našoj prodavnici prihvataš uslove i politiku privatnosti u nastavku."
      />

      <div className="container-onyx mt-14 mb-24 max-w-[720px] lg:mt-18">
        <div className="flex flex-col gap-10">
          <Section id="koriscenje-sajta" title="Korišćenje sajta">
            <p>
              Sajt ONYX EVOLUTION namenjen je ličnoj i nekomercijalnoj upotrebi.
              Slažeš se da nećeš koristiti sajt u nezakonite svrhe, pokušavati
              neovlašćeni pristup sistemu niti prenositi štetan sadržaj.
              Zadržavamo pravo ograničavanja pristupa u slučaju kršenja ovih
              uslova.
            </p>
          </Section>

          <Section title="Narudžbine i plaćanje">
            <p>
              Postavljanjem narudžbine potvrđuješ da su svi uneti podaci
              tačni. Narudžbine su uslovljene dostupnošću artikla i
              zadržavamo pravo otkazivanja u slučaju nedostupnosti. Cene su
              prikazane u dinarima (RSD) i uključuju PDV po zakonom
              propisanoj stopi. Plaćanje se vrši pouzećem ili karticom, u
              skladu sa opcijama ponuđenim na strani{" "}
              <Link href="/kasa" className="text-accent underline underline-offset-2 hover:no-underline">
                Kasa
              </Link>
              .
            </p>
          </Section>

          <Section title="Izjava o konverziji">
            <p>
              Sva plaćanja se izvršavaju u dinarima (RSD). Ukoliko je platna
              kartica izdata u drugoj valuti, iznos zaduženja biće izražen u
              lokalnoj valuti po kursu koji u trenutku transakcije primenjuje
              banka izdavalac kartice, što može rezultovati neznatnom
              razlikom u odnosu na cenu istaknutu na sajtu.
            </p>
          </Section>

          <Section title="Dostava i povraćaj">
            <p>
              Rokovi dostave, cena dostave i uslovi povraćaja detaljno su
              opisani na strani{" "}
              <Link
                href="/dostava-i-povracaj"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                Dostava i povraćaj
              </Link>
              . Ukratko: standardna dostava na teritoriji Srbije traje 1–3
              radna dana i besplatna je za porudžbine preko{" "}
              {formatPrice(siteSettings.freeShippingThresholdRsd)}.
              Neotvorene i nekorišćene proizvode možeš vratiti u roku od 14
              dana od prijema pošiljke.
            </p>
          </Section>

          <Section title="Reklamacije i garancija">
            <p>
              Za PPF folije i keramičke premaze koji su montirani preko
              ovlašćenog instalatera, garancija na materijal i rad ostvaruje
              se isključivo kroz ONYX Warranty program, ne kroz povraćaj
              proizvoda. Detalje o pokrivenosti, isključenjima i postupku
              prijave pogledaj na strani{" "}
              <Link
                href="/garancija"
                className="text-accent underline underline-offset-2 hover:no-underline"
              >
                Garancija
              </Link>
              .
            </p>
          </Section>

          <Section title="Intelektualna svojina">
            <p>
              Sav sadržaj na ovom sajtu — tekst, slike, logotipi i informacije
              o proizvodima — vlasništvo je ONYX EVOLUTION ili njenih
              davalaca licence. Sadržaj se ne sme reprodukovati,
              distribuirati niti koristiti bez prethodnog pisanog odobrenja.
            </p>
          </Section>

          <Section title="Ograničenje odgovornosti">
            <p>
              U meri dozvoljenoj zakonom, ONYX EVOLUTION neće biti odgovoran
              za indirektnu, slučajnu ili posledičnu štetu nastalu
              korišćenjem sajta ili naših proizvoda. Ukupna odgovornost neće
              premašiti kupoprodajnu cenu relevantne narudžbine.
            </p>
          </Section>

          <Section title="Merodavno pravo">
            <p>
              Ovi uslovi regulisani su zakonima Republike Srbije. Svi sporovi
              nastali na osnovu ovih uslova podležu isključivoj nadležnosti
              nadležnih sudova u Srbiji.
            </p>
          </Section>

          <div className="border-t-2 border-hairline-strong pt-10">
            <div className="mb-2 text-badge text-accent">PRAVNE INFORMACIJE</div>
            <h2
              id="politika-privatnosti"
              className="scroll-mt-24 text-[26px] tracking-[.04em] uppercase sm:text-h3-card"
            >
              Politika privatnosti
            </h2>
            <p className="mt-2 text-body-sm text-text-40">
              Kako prikupljamo, koristimo i štitimo tvoje lične podatke.
            </p>
          </div>

          <Section title="Osnovni podaci o trgovcu">
            <p className="whitespace-pre-line">
              {`Pravno lice: ONYX EVOLUTION d.o.o.
Sedište: ${siteSettings.contact.address}
Email: ${siteSettings.contact.email}
Telefon: ${siteSettings.contact.phone}
Radno vreme: ${siteSettings.contact.workingHours}`}
            </p>
            <p className="mt-3 text-[11px] text-text-34">
              Matični broj, PIB i tekući račun se dopunjuju po registraciji
              privrednog subjekta.
            </p>
          </Section>

          <Section title="Podaci koje prikupljamo">
            <p>
              Kada napraviš porudžbinu ili se prijaviš na bilten, prikupljamo
              lične podatke poput imena, email adrese, adrese dostave i broja
              telefona. Možemo prikupljati i nepersonalne podatke, poput
              ponašanja pri pretraživanju, radi unapređenja sajta.
            </p>
          </Section>

          <Section title="Kako koristimo podatke">
            <p>
              Lični podaci koriste se isključivo za obradu narudžbina,
              komunikaciju o statusu porudžbine i garancije, i pružanje
              korisničke podrške. Uz tvoju saglasnost možemo slati
              promotivne mejlove o novim proizvodima i ponudama — odjava je
              moguća u svakom trenutku putem linka u mejlu.
            </p>
          </Section>

          <Section title="Zaštita podataka o transakciji">
            <p>
              Podaci o platnoj kartici prenose se u zaštićenoj (kriptovanoj)
              formi putem SSL protokola i nikada nisu dostupni našem
              sistemu — kompletan proces naplate obavlja se na stranicama
              banke, uz proveru identiteta kroz 3D Secure protokol. Ne
              čuvamo broj kartice, datum isteka niti CVV/CVC kod.
            </p>
          </Section>

          <Section title="Kolačići">
            <p>
              Koristimo neophodne kolačiće za održavanje korpe i sesije
              aktivnim. Ne koristimo kolačiće za praćenje trećih lica bez
              tvoje izričite saglasnosti. Preferencijama kolačića možeš
              upravljati putem podešavanja pretraživača.
            </p>
          </Section>

          <Section title="Tvoja prava">
            <p>
              Prema važećem zakonu o zaštiti podataka o ličnosti, imaš pravo
              pristupa, ispravke ili brisanja svojih ličnih podataka. Zahtev
              šalješ preko strane{" "}
              <Link href="/kontakt" className="text-accent underline underline-offset-2 hover:no-underline">
                Kontakt
              </Link>{" "}
              — obradićemo ga u roku od 30 dana.
            </p>
          </Section>

          <div className="border-t border-hairline pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] tracking-[.1em] text-text-34 uppercase">
              Poslednje ažuriranje: septembar 2026.
            </p>
            <Link
              href="/kontakt"
              className="font-mono text-[10px] tracking-[.1em] text-accent uppercase hover:underline"
            >
              Imaš pitanje? →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
