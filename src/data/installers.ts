export interface Installer {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  workingHours: string;
  mapsUrl: string;
}

function mapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const installers: Installer[] = [
  {
    id: "inst-1",
    name: "ONYX Detailing Studio Beograd",
    city: "Beograd",
    address: "Bulevar Oslobođenja 12, Beograd",
    phone: "+381 11 2456 890",
    workingHours: "Pon–Sub 08–18h",
    mapsUrl: mapsUrl("Bulevar Oslobođenja 12, Beograd"),
  },
  {
    id: "inst-2",
    name: "Prizma Wrap Centar",
    city: "Novi Sad",
    address: "Rumenačka 68, Novi Sad",
    phone: "+381 21 4789 213",
    workingHours: "Pon–Pet 08–17h",
    mapsUrl: mapsUrl("Rumenačka 68, Novi Sad"),
  },
  {
    id: "inst-3",
    name: "Auto Folija Studio Niš",
    city: "Niš",
    address: "Bulevar Nemanjića 45, Niš",
    phone: "+381 18 4523 671",
    workingHours: "Pon–Pet 09–17h, Sub 09–14h",
    mapsUrl: mapsUrl("Bulevar Nemanjića 45, Niš"),
  },
  {
    id: "inst-4",
    name: "Šumadija PPF Centar",
    city: "Kragujevac",
    address: "Kralja Petra I 88, Kragujevac",
    phone: "+381 34 6712 340",
    workingHours: "Pon–Pet 08–16h",
    mapsUrl: mapsUrl("Kralja Petra I 88, Kragujevac"),
  },
  {
    id: "inst-5",
    name: "Panonija Detailing",
    city: "Subotica",
    address: "Segedinski put 92, Subotica",
    phone: "+381 24 5541 780",
    workingHours: "Pon–Pet 08–17h",
    mapsUrl: mapsUrl("Segedinski put 92, Subotica"),
  },
  {
    id: "inst-6",
    name: "Zapadna Srbija Auto Zaštita",
    city: "Čačak",
    address: "Gospodar Jovanova 21, Čačak",
    phone: "+381 32 3345 129",
    workingHours: "Pon–Pet 08–16h, Sub 09–13h",
    mapsUrl: mapsUrl("Gospodar Jovanova 21, Čačak"),
  },
  {
    id: "inst-7",
    name: "Ibar Wrap & PPF",
    city: "Kraljevo",
    address: "Cara Dušana 14, Kraljevo",
    phone: "+381 36 3312 456",
    workingHours: "Pon–Pet 09–17h",
    mapsUrl: mapsUrl("Cara Dušana 14, Kraljevo"),
  },
  {
    id: "inst-8",
    name: "Sandžak Auto Folija",
    city: "Novi Pazar",
    address: "AVNOJ-a 33, Novi Pazar",
    phone: "+381 20 3321 998",
    workingHours: "Pon–Sub 08–17h",
    mapsUrl: mapsUrl("AVNOJ-a 33, Novi Pazar"),
  },
  {
    id: "inst-9",
    name: "Banat Detailing Centar",
    city: "Zrenjanin",
    address: "Kralja Aleksandra I 57, Zrenjanin",
    phone: "+381 23 5610 224",
    workingHours: "Pon–Pet 08–16h",
    mapsUrl: mapsUrl("Kralja Aleksandra I 57, Zrenjanin"),
  },
  {
    id: "inst-10",
    name: "Južni Banat PPF Studio",
    city: "Pančevo",
    address: "Vojvode Radomira Putnika 9, Pančevo",
    phone: "+381 13 3348 765",
    workingHours: "Pon–Pet 09–17h",
    mapsUrl: mapsUrl("Vojvode Radomira Putnika 9, Pančevo"),
  },
];
