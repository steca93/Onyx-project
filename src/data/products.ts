import type { AnyProduct, ProductCategoryRef } from "@/lib/repo/types";

const PPF: ProductCategoryRef = { name: "PPF folije", slug: "ppf-folije" };
const MAT: ProductCategoryRef = { name: "Mat PPF", slug: "mat-ppf" };
const FAROVI: ProductCategoryRef = {
  name: "Farovi i svetla",
  slug: "farovi-i-svetla",
};
const KERAMIKA: ProductCategoryRef = {
  name: "Keramički premazi",
  slug: "keramicki-premazi",
};
const ALAT: ProductCategoryRef = { name: "Alat i montaža", slug: "alat-i-montaza" };
const SETOVI: ProductCategoryRef = { name: "Setovi", slug: "setovi" };

const FILM_INSTALL =
  "Montaža isključivo u ovlašćenom ONYX centru radi validnosti garancije. Nakon montaže folija zahteva minimum 48h sušenja pre pranja vozila.";
const filmWarranty = (years: number) =>
  `Garancija od ${years} godina pokriva žutljenje, pucanje i odvajanje folije od datuma montaže, uz registraciju u ONYX Warranty programu.`;

const CERAMIC_INSTALL =
  "Nanošenje na čist, dekontaminiran lak, u zatvorenom prostoru bez prašine. Vreme sušenja pre izlaganja vlazi minimum 12h.";
const ceramicWarranty = (years: number) =>
  `Premaz nosi garanciju proizvođača od ${years} godine na hidrofobna svojstva uz redovno održavanje prema uputstvu.`;

const KIT_INSTALL =
  "Sadržaj seta pokriva standardnu montažu jednog vozila. Instalacija u ovlašćenom centru preporučena radi pune preciznosti.";
const KIT_WARRANTY =
  "Alat i potrošni materijal iz seta nose garanciju proizvođača od 2 godine na fabričke nedostatke.";

interface FilmSpec {
  slug: string;
  name: string;
  category: ProductCategoryRef;
  finish: "Sjaj" | "Mat";
  thickness: string;
  warrantyYears: number;
  basePrice: string;
  premiumPrice: string;
  shortDescription: string;
  description: string;
  featured?: boolean;
  newArrival?: boolean;
  databaseId: number;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
}

const films: FilmSpec[] = [
  {
    databaseId: 1,
    slug: "onyx-shield-8-0-152cm",
    name: "ONYX Shield 8.0 · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "8 mil / 200 µm",
    warrantyYears: 12,
    basePrice: "142900",
    premiumPrice: "321500",
    featured: true,
    newArrival: true,
    shortDescription:
      "Samoobnavljajuća PPF folija visokog sjaja sa 99% optičke prozirnosti.",
    description:
      "Vodeći model u ONYX Shield liniji — samoobnavljajući top coat uklanja sitne ogrebotine na 60°C. Debljina 8 mil / 200 µm štiti lak od kamenčića i insekata bez promene izgleda vozila.",
  },
  {
    databaseId: 2,
    slug: "onyx-shield-6-0-152cm",
    name: "ONYX Shield 6.0 · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "6 mil / 150 µm",
    warrantyYears: 10,
    basePrice: "118900",
    premiumPrice: "267500",
    shortDescription: "Lakša varijanta PPF zaštite za budžetski osetljivije projekte.",
    description:
      "Tanja alternativa ONYX Shield liniji uz zadržanih 99% providnosti. Preporučuje se za panele sa manjom izloženošću udarcima — branici, retrovizori, delovi haube.",
  },
  {
    databaseId: 3,
    slug: "onyx-shield-10-0-152cm",
    name: "ONYX Shield 10.0 · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "10 mil / 250 µm",
    warrantyYears: 12,
    basePrice: "168500",
    premiumPrice: "379100",
    shortDescription: "Najdeblja folija u ponudi za maksimalnu otpornost na udarce.",
    description:
      "Pojačana 10 mil / 250 µm debljina namenjena vozilima koja se voze po makadamu i lošim putevima. Samoobnavljajući sloj i 12-godišnja garancija na žutljenje i pucanje.",
  },
  {
    databaseId: 4,
    slug: "onyx-clear-bra-ultra-180cm",
    name: "ONYX Clear Bra Ultra · 180cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "8 mil / 200 µm",
    warrantyYears: 12,
    basePrice: "169900",
    premiumPrice: "382300",
    shortDescription: "Široka rolna za pokrivanje velikih panela bez spojeva.",
    description:
      "180cm širina omogućava montažu cele haube ili krova bez vidljivih spojeva. Ista formula samoobnavljajućeg top coat-a kao ostatak ONYX Shield linije, uz 99% providnosti.",
  },
  {
    databaseId: 5,
    slug: "onyx-shield-track-152cm",
    name: "ONYX Shield Track · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "8 mil / 200 µm",
    warrantyYears: 10,
    basePrice: "159300",
    premiumPrice: "358400",
    shortDescription: "Pojačan lepak za vozila koja često menjaju temperaturne uslove.",
    description:
      "Razvijena za trkačka i track-day vozila — lepak zadržava prionljivost pri naglim temperaturnim skokovima. Otpornost na UV žutilo testirana na 2000+ sati.",
  },
  {
    databaseId: 6,
    slug: "onyx-shield-self-heal-152cm",
    name: "ONYX Shield Self-Heal · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "8 mil / 200 µm",
    warrantyYears: 12,
    basePrice: "149800",
    premiumPrice: "337100",
    shortDescription: "Pojačan samoobnavljajući sloj, brže uklanjanje mikroogrebotina.",
    description:
      "Nadograđena top coat formula uklanja mikroogrebotine na sobnoj temperaturi, bez potrebe za toplim vodom. Ostatak specifikacija identičan ONYX Shield 8.0 modelu.",
  },
  {
    databaseId: 7,
    slug: "onyx-shield-pro-x-180cm",
    name: "ONYX Shield Pro X · 180cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "10 mil / 250 µm",
    warrantyYears: 12,
    basePrice: "174200",
    premiumPrice: "392000",
    stockStatus: "ON_BACKORDER",
    shortDescription: "Flagship model — najveća širina uz najveću debljinu.",
    description:
      "Kombinuje 180cm širinu rolne sa 10 mil / 250 µm debljinom za punu zaštitu velikih vozila bez kompromisa. Preporučeno za SUV i pickup modele.",
  },
  {
    databaseId: 8,
    slug: "onyx-shield-compact-152cm",
    name: "ONYX Shield Compact · 152cm",
    category: PPF,
    finish: "Sjaj",
    thickness: "6 mil / 150 µm",
    warrantyYears: 7,
    basePrice: "104900",
    premiumPrice: "236000",
    shortDescription: "Ulazni model PPF zaštite za manje projekte i delimičnu montažu.",
    description:
      "Najpristupačnija folija u ONYX Shield ponudi, namenjena delimičnoj montaži (branik, prednja haubna ivica, retrovizori). 7-godišnja garancija na žutljenje i pucanje.",
  },
  {
    databaseId: 9,
    slug: "onyx-matte-7-0-152cm",
    name: "ONYX Matte 7.0 · 152cm",
    category: MAT,
    finish: "Mat",
    thickness: "7 mil / 175 µm",
    warrantyYears: 10,
    basePrice: "156400",
    premiumPrice: "351900",
    featured: true,
    shortDescription: "Satenska mat završnica bez efekta pomorandžine kore.",
    description:
      "Menja izgled vozila u satensku mat završnicu i istovremeno štiti originalni lak. Bez efekta pomorandžine kore, sa istim samoobnavljajućim top coat slojem kao sjajna linija.",
  },
  {
    databaseId: 10,
    slug: "onyx-matte-5-0-152cm",
    name: "ONYX Matte 5.0 · 152cm",
    category: MAT,
    finish: "Mat",
    thickness: "5 mil / 125 µm",
    warrantyYears: 8,
    basePrice: "132700",
    premiumPrice: "298600",
    shortDescription: "Lakša mat folija za manje zahtevne projekte.",
    description:
      "Tanja alternativa ONYX Matte liniji uz zadržanu satensku završnicu. Pogodna za panele sa manjom izloženošću mehaničkim oštećenjima.",
  },
  {
    databaseId: 11,
    slug: "onyx-matte-stealth-180cm",
    name: "ONYX Matte Stealth · 180cm",
    category: MAT,
    finish: "Mat",
    thickness: "7 mil / 175 µm",
    warrantyYears: 10,
    basePrice: "178900",
    premiumPrice: "402500",
    shortDescription: "Duboka mat crna, široka rolna za pun wrap bez spojeva.",
    description:
      "180cm rolna namenjena punom mat wrap-u velikih panela. Duboka, neutralna mat završnica bez sjajnih tačaka pri direktnom svetlu.",
  },
  {
    databaseId: 12,
    slug: "onyx-matte-charcoal-152cm",
    name: "ONYX Matte Charcoal · 152cm",
    category: MAT,
    finish: "Mat",
    thickness: "7 mil / 175 µm",
    warrantyYears: 10,
    basePrice: "148300",
    premiumPrice: "333700",
    shortDescription: "Tamnosiva mat nijansa sa istim zaštitnim svojstvima.",
    description:
      "Ista formula kao ONYX Matte 7.0 u tamnosivoj nijansi. Samoobnavljajući top coat i 99% optičke prozirnosti na sjajnim modelima ispod.",
  },
  {
    databaseId: 13,
    slug: "onyx-matte-track-152cm",
    name: "ONYX Matte Track · 152cm",
    category: MAT,
    finish: "Mat",
    thickness: "7 mil / 175 µm",
    warrantyYears: 8,
    basePrice: "161900",
    premiumPrice: "364300",
    shortDescription: "Pojačan lepak, mat verzija Track linije.",
    description:
      "Mat ekvivalent ONYX Shield Track folije — pojačan lepak za vozila izložena čestim temperaturnim promenama, uz satensku završnicu.",
  },
  {
    databaseId: 14,
    slug: "onyx-matte-compact-152cm",
    name: "ONYX Matte Compact · 152cm",
    category: MAT,
    finish: "Mat",
    thickness: "5 mil / 125 µm",
    warrantyYears: 7,
    basePrice: "119400",
    premiumPrice: "268600",
    shortDescription: "Ulazni mat model za delimičnu montažu.",
    description:
      "Najpristupačnija folija u Mat liniji, namenjena delimičnoj montaži panela. 7-godišnja garancija na žutljenje i pucanje.",
  },
];

function filmProduct(f: FilmSpec, secondary?: ProductCategoryRef): AnyProduct {
  const sku = `ONX-${f.slug.replace(/^onyx-/, "").toUpperCase().replace(/-/g, "")}`;
  const categories = secondary ? [f.category, secondary] : [f.category];
  return {
    __typename: "VariableProduct",
    id: String(f.databaseId),
    databaseId: f.databaseId,
    name: f.name,
    slug: f.slug,
    description: f.description,
    shortDescription: f.shortDescription,
    image: { sourceUrl: "", altText: f.name.toUpperCase() },
    galleryImages: {
      nodes:
        f.featured || f.newArrival
          ? [
              { sourceUrl: "", altText: `${f.name.toUpperCase()} · DETALJ` },
              { sourceUrl: "", altText: `${f.name.toUpperCase()} · MONTAŽA` },
            ]
          : [],
    },
    productCategories: { nodes: categories },
    specs: [
      { label: "Debljina", value: f.thickness },
      { label: "Garancija", value: `${f.warrantyYears} godina` },
      { label: "Završnica", value: f.finish },
      { label: "Providnost", value: "99%" },
      { label: "Lepak", value: "Bez tragova pri skidanju" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(f.warrantyYears),
    featured: Boolean(f.featured),
    newArrival: Boolean(f.newArrival),
    price: f.basePrice,
    regularPrice: f.basePrice,
    salePrice: null,
    stockStatus: f.stockStatus ?? "IN_STOCK",
    attributes: {
      nodes: [
        { name: "sirina", label: "Širina", options: ["152cm", "180cm"] },
        { name: "duzina", label: "Dužina", options: ["15m", "30m"] },
      ],
    },
    variations: {
      nodes: [
        {
          id: `${f.slug}-152-15`,
          sku: `${sku}-152-15`,
          price: f.basePrice,
          regularPrice: f.basePrice,
          salePrice: null,
          stockStatus: "IN_STOCK",
          image: null,
          attributes: [
            { name: "sirina", value: "152cm" },
            { name: "duzina", value: "15m" },
          ],
        },
        {
          id: `${f.slug}-180-30`,
          sku: `${sku}-180-30`,
          price: f.premiumPrice,
          regularPrice: f.premiumPrice,
          salePrice: null,
          stockStatus: "IN_STOCK",
          image: null,
          attributes: [
            { name: "sirina", value: "180cm" },
            { name: "duzina", value: "30m" },
          ],
        },
      ],
    },
  };
}

interface SimpleSpec {
  databaseId: number;
  slug: string;
  name: string;
  categories: ProductCategoryRef[];
  price: string;
  shortDescription: string;
  description: string;
  specs: { label: string; value: string }[];
  installationNotes: string | null;
  warrantyNotes: string | null;
  featured?: boolean;
  newArrival?: boolean;
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK" | "ON_BACKORDER";
  gallery?: boolean;
}

const simples: SimpleSpec[] = [
  // Farovi i svetla
  {
    databaseId: 15,
    slug: "onyx-light-guard-dimljena",
    name: "ONYX Light Guard · dimljena",
    categories: [FAROVI],
    price: "9200",
    featured: true,
    gallery: true,
    shortDescription: "PPF folija za farove u dimljenoj nijansi.",
    description:
      "Štiti prednje farove od udara kamenčića i UV žutila uz diskretnu dimljenu nijansu. Ne utiče na propusnost svetla iznad zakonski dozvoljenih vrednosti.",
    specs: [
      { label: "Debljina", value: "6 mil / 150 µm" },
      { label: "Garancija", value: "5 godina" },
      { label: "Završnica", value: "Dimljena" },
      { label: "Providnost", value: "80%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(5),
  },
  {
    databaseId: 16,
    slug: "onyx-light-guard-providna",
    name: "ONYX Light Guard · providna",
    categories: [FAROVI],
    price: "8600",
    shortDescription: "Providna PPF zaštita za farove bez promene izgleda.",
    description:
      "Ista zaštita kao dimljena verzija, u potpuno providnom tonu za vozače koji ne žele promenu izgleda farova.",
    specs: [
      { label: "Debljina", value: "6 mil / 150 µm" },
      { label: "Garancija", value: "5 godina" },
      { label: "Završnica", value: "Providna" },
      { label: "Providnost", value: "99%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(5),
  },
  {
    databaseId: 17,
    slug: "onyx-light-guard-xl-dimljena",
    name: "ONYX Light Guard XL · dimljena",
    categories: [FAROVI],
    price: "12400",
    shortDescription: "Veći format za SUV i pickup farove.",
    description:
      "Uvećan format namenjen širim farovima SUV i pickup modela. Ista formula i garancija kao standardni Light Guard.",
    specs: [
      { label: "Debljina", value: "6 mil / 150 µm" },
      { label: "Garancija", value: "5 godina" },
      { label: "Završnica", value: "Dimljena" },
      { label: "Providnost", value: "80%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(5),
  },
  {
    databaseId: 18,
    slug: "onyx-tail-light-tint-crvena",
    name: "ONYX Tail Light Tint · crvena dimljena",
    categories: [FAROVI],
    price: "10800",
    shortDescription: "Tamnjenje zadnjih stop svetala u crvenom tonu.",
    description:
      "Pojačava crveni ton zadnjih svetala uz zadržanu zakonsku propusnost. Otporna na UV žutilo i pucanje na niskim temperaturama.",
    specs: [
      { label: "Debljina", value: "5 mil / 125 µm" },
      { label: "Garancija", value: "4 godine" },
      { label: "Završnica", value: "Crvena dimljena" },
      { label: "Providnost", value: "70%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(4),
  },
  {
    databaseId: 19,
    slug: "onyx-fog-light-guard-zuta",
    name: "ONYX Fog Light Guard · žuta",
    categories: [FAROVI],
    price: "6900",
    shortDescription: "Žuti ton za maglenke, poboljšava vidljivost po magli.",
    description:
      "Klasičan žuti ton za prednje maglenke koji poboljšava kontrast u uslovima magle i kiše, uz zaštitu od kamenčića.",
    specs: [
      { label: "Debljina", value: "5 mil / 125 µm" },
      { label: "Garancija", value: "4 godine" },
      { label: "Završnica", value: "Žuta" },
      { label: "Providnost", value: "75%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(4),
  },
  {
    databaseId: 20,
    slug: "onyx-light-guard-pro-providna",
    name: "ONYX Light Guard Pro · providna",
    categories: [FAROVI],
    price: "14200",
    shortDescription: "Pojačana verzija sa samoobnavljajućim slojem.",
    description:
      "Nadograđena Light Guard formula sa samoobnavljajućim top coat slojem — sitne ogrebotine se uklanjaju na sobnoj temperaturi.",
    specs: [
      { label: "Debljina", value: "7 mil / 175 µm" },
      { label: "Garancija", value: "6 godina" },
      { label: "Završnica", value: "Providna" },
      { label: "Providnost", value: "99%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(6),
  },
  {
    databaseId: 21,
    slug: "onyx-side-marker-tint",
    name: "ONYX Side Marker Tint",
    categories: [FAROVI],
    price: "3200",
    stockStatus: "OUT_OF_STOCK",
    shortDescription: "Tamnjenje bočnih pokazivača pravca.",
    description:
      "Kompaktan set za tamnjenje bočnih markera, uklapa se uz Light Guard i Tail Light Tint za jedinstven izgled svetala.",
    specs: [
      { label: "Debljina", value: "5 mil / 125 µm" },
      { label: "Garancija", value: "3 godine" },
      { label: "Završnica", value: "Dimljena" },
      { label: "Providnost", value: "75%" },
    ],
    installationNotes: FILM_INSTALL,
    warrantyNotes: filmWarranty(3),
  },
  // Keramički premazi
  {
    databaseId: 22,
    slug: "onyx-ceramic-top-coat",
    name: "ONYX Ceramic Top Coat",
    categories: [KERAMIKA],
    price: "11900",
    featured: true,
    gallery: true,
    shortDescription: "Keramički premaz za dodatnu zaštitu preko PPF folije.",
    description:
      "Nanosi se preko PPF folije ili originalnog laka za dodatni sloj hidrofobne zaštite i lakše održavanje. Traje do 18 meseci uz redovno pranje.",
    specs: [
      { label: "Sadržaj", value: "50 ml" },
      { label: "Garancija", value: "18 meseci" },
      { label: "Tvrdoća", value: "9H" },
      { label: "Nanošenje", value: "Ručno, mikrofiber aplikator" },
    ],
    installationNotes: CERAMIC_INSTALL,
    warrantyNotes: ceramicWarranty(1),
  },
  {
    databaseId: 23,
    slug: "onyx-ceramic-pro-9h",
    name: "ONYX Ceramic Pro 9H",
    categories: [KERAMIKA],
    price: "24900",
    shortDescription: "Profesionalni keramički premaz sa dužim vekom trajanja.",
    description:
      "Formula namenjena profesionalnoj primeni u ovlašćenim centrima. Pruža duže zadržavanje sjaja i otpornost na hemijske kontaminante u periodu do 3 godine.",
    specs: [
      { label: "Sadržaj", value: "30 ml" },
      { label: "Garancija", value: "3 godine" },
      { label: "Tvrdoća", value: "9H" },
      { label: "Nanošenje", value: "Isključivo u ovlašćenom centru" },
    ],
    installationNotes: CERAMIC_INSTALL,
    warrantyNotes: ceramicWarranty(3),
  },
  {
    databaseId: 24,
    slug: "onyx-ceramic-boost",
    name: "ONYX Ceramic Boost",
    categories: [KERAMIKA],
    price: "8400",
    shortDescription: "Sprej dodatak koji obnavlja hidrofobna svojstva.",
    description:
      "Brzi sprej dodatak za mesečno održavanje postojećeg keramičkog premaza. Obnavlja hidrofobna svojstva i sjaj za manje od 15 minuta.",
    specs: [
      { label: "Sadržaj", value: "500 ml" },
      { label: "Garancija", value: "—" },
      { label: "Tvrdoća", value: "—" },
      { label: "Nanošenje", value: "Sprej, bez ispiranja" },
    ],
    installationNotes: null,
    warrantyNotes: null,
  },
  {
    databaseId: 25,
    slug: "onyx-ceramic-glass-coat",
    name: "ONYX Ceramic Glass Coat",
    categories: [KERAMIKA],
    price: "6700",
    shortDescription: "Keramička zaštita za vetrobransko staklo.",
    description:
      "Poboljšava vidljivost po kiši odbijanjem vode sa vetrobranskog stakla. Otporna na brisače do 6 meseci.",
    specs: [
      { label: "Sadržaj", value: "30 ml" },
      { label: "Garancija", value: "6 meseci" },
      { label: "Tvrdoća", value: "—" },
      { label: "Nanošenje", value: "Ručno, mikrofiber krpa" },
    ],
    installationNotes: CERAMIC_INSTALL,
    warrantyNotes: null,
  },
  {
    databaseId: 26,
    slug: "onyx-ceramic-wheel-coat",
    name: "ONYX Ceramic Wheel Coat",
    categories: [KERAMIKA],
    price: "9800",
    shortDescription: "Keramička zaštita za felne otporna na kočionu prašinu.",
    description:
      "Formula otporna na visoke temperature felni i kočionu prašinu. Olakšava čišćenje i produžava interval detaljnog pranja felni.",
    specs: [
      { label: "Sadržaj", value: "30 ml" },
      { label: "Garancija", value: "12 meseci" },
      { label: "Tvrdoća", value: "9H" },
      { label: "Nanošenje", value: "Ručno, sunđer aplikator" },
    ],
    installationNotes: CERAMIC_INSTALL,
    warrantyNotes: ceramicWarranty(1),
  },
  {
    databaseId: 27,
    slug: "onyx-ceramic-spray-detailer-500ml",
    name: "ONYX Ceramic Spray Detailer 500ml",
    categories: [KERAMIKA],
    price: "3900",
    shortDescription: "Sprej za brzo održavanje sjaja između pranja.",
    description:
      "Univerzalni sprej detailer sa keramičkim sastojcima za brzo osvežavanje sjaja i odbijanje prašine između pranja.",
    specs: [
      { label: "Sadržaj", value: "500 ml" },
      { label: "Garancija", value: "—" },
      { label: "Tvrdoća", value: "—" },
      { label: "Nanošenje", value: "Sprej, mikrofiber krpa" },
    ],
    installationNotes: null,
    warrantyNotes: null,
  },
  {
    databaseId: 28,
    slug: "onyx-ceramic-leather-guard",
    name: "ONYX Ceramic Leather Guard",
    categories: [KERAMIKA],
    price: "7200",
    shortDescription: "Keramička zaštita za kožne i alkantara površine u enterijeru.",
    description:
      "Štiti kožna sedišta od UV bledeljenja i mrlja uz zadržavanje originalne teksture. Bez sjajnog ili masnog filma.",
    specs: [
      { label: "Sadržaj", value: "150 ml" },
      { label: "Garancija", value: "12 meseci" },
      { label: "Tvrdoća", value: "—" },
      { label: "Nanošenje", value: "Ručno, mikrofiber aplikator" },
    ],
    installationNotes: null,
    warrantyNotes: ceramicWarranty(1),
  },
  {
    databaseId: 29,
    slug: "onyx-ceramic-coating-kit-30ml",
    name: "ONYX Ceramic Coating Kit 30ml",
    categories: [KERAMIKA],
    price: "18500",
    stockStatus: "ON_BACKORDER",
    shortDescription: "Kompletan set za samostalno nanošenje keramičkog premaza.",
    description:
      "Set za samostalnu primenu: premaz, aplikatori, mikrofiber krpe i uputstvo korak-po-korak. Rezultat blizak profesionalnoj aplikaciji uz pažljivo pripremljenu površinu.",
    specs: [
      { label: "Sadržaj", value: "30 ml premaz + pribor" },
      { label: "Garancija", value: "2 godine" },
      { label: "Tvrdoća", value: "9H" },
      { label: "Nanošenje", value: "Ručno, uputstvo u setu" },
    ],
    installationNotes: CERAMIC_INSTALL,
    warrantyNotes: ceramicWarranty(2),
  },
  {
    databaseId: 30,
    slug: "onyx-ceramic-trim-restorer",
    name: "ONYX Ceramic Trim Restorer",
    categories: [KERAMIKA],
    price: "4300",
    shortDescription: "Obnavlja boju izbledelih plastičnih delova enterijera i eksterijera.",
    description:
      "Vraća dubinu boje izbledelim plastičnim i gumenim delovima uz keramičku zaštitu od ponovnog UV bledeljenja.",
    specs: [
      { label: "Sadržaj", value: "100 ml" },
      { label: "Garancija", value: "6 meseci" },
      { label: "Tvrdoća", value: "—" },
      { label: "Nanošenje", value: "Sunđer aplikator" },
    ],
    installationNotes: null,
    warrantyNotes: null,
  },
  // Alat i montaža
  {
    databaseId: 31,
    slug: "onyx-slip-solution-1l",
    name: "ONYX Slip Solution 1L",
    categories: [ALAT],
    price: "3450",
    featured: true,
    gallery: true,
    shortDescription: "Rastvor za montažu PPF folije koji sprečava prevremeno lepljenje.",
    description:
      "Standardni sapunski rastvor za instalatere — omogućava pravilno pozicioniranje folije pre konačnog lepljenja. Koncentrat, dovoljan za više montaža.",
    specs: [
      { label: "Zapremina", value: "1 L koncentrat" },
      { label: "Namena", value: "Montaža PPF/wrap folije" },
      { label: "Razblaživanje", value: "1:400 sa vodom" },
      { label: "Garancija", value: "2 godine" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 2 godine.",
  },
  {
    databaseId: 32,
    slug: "onyx-squeegee-set-5kom",
    name: "ONYX Squeegee Set / 5 kom",
    categories: [ALAT],
    price: "6780",
    featured: true,
    gallery: true,
    shortDescription: "Set profesionalnih rakela za PPF i wrap montažu.",
    description:
      "Pet rakela različitih tvrdoća i oblika za istiskivanje vazduha i vode ispod folije bez oštećenja površine.",
    specs: [
      { label: "Sadržaj", value: "5 rakela" },
      { label: "Materijal", value: "Poliuretan, različite tvrdoće" },
      { label: "Namena", value: "PPF i wrap montaža" },
      { label: "Garancija", value: "2 godine" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 2 godine.",
  },
  {
    databaseId: 33,
    slug: "onyx-wrap-glove-par",
    name: "ONYX Wrap Glove / par",
    categories: [ALAT],
    price: "1980",
    featured: true,
    shortDescription: "Rukavice od mikrofibera za glatko pozicioniranje folije.",
    description:
      "Mekane mikrofiber rukavice koje sprečavaju otiske prstiju i oštećenje folije tokom pozicioniranja i priteska.",
    specs: [
      { label: "Materijal", value: "Mikrofiber" },
      { label: "Veličina", value: "Univerzalna" },
      { label: "Pranje", value: "Mašinsko na 30°C" },
      { label: "Garancija", value: "1 godina" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 1 godina.",
  },
  {
    databaseId: 34,
    slug: "onyx-knifeless-tape-50m",
    name: "ONYX Knifeless Tape 50m",
    categories: [ALAT],
    price: "4640",
    featured: true,
    shortDescription: "Traka za precizno sečenje folije bez skalpela na laku.",
    description:
      "Omogućava čiste, precizne rezove folije duž ivica panela bez rizika od zaseca u originalni lak.",
    specs: [
      { label: "Dužina", value: "50 m" },
      { label: "Širina trake", value: "3 mm konac" },
      { label: "Namena", value: "PPF i wrap montaža" },
      { label: "Garancija", value: "2 godine" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 2 godine.",
  },
  {
    databaseId: 35,
    slug: "onyx-heat-gun-pro-2000w",
    name: "ONYX Heat Gun Pro 2000W",
    categories: [ALAT],
    price: "9600",
    shortDescription: "Profesionalni fen za termo-oblikovanje folije oko krivina.",
    description:
      "Podesiva temperatura i protok vazduha za precizno termo-oblikovanje PPF i wrap folije oko složenih krivina karoserije.",
    specs: [
      { label: "Snaga", value: "2000 W" },
      { label: "Temperatura", value: "50–650°C, podesiva" },
      { label: "Napajanje", value: "220V" },
      { label: "Garancija", value: "2 godine" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 2 godine.",
  },
  {
    databaseId: 36,
    slug: "onyx-cutting-blade-set-10kom",
    name: "ONYX Cutting Blade Set / 10 kom",
    categories: [ALAT],
    price: "2150",
    shortDescription: "Set oštrih sečiva za skalpel, za precizno sečenje folije.",
    description:
      "Deset oštrih sečiva kompatibilnih sa standardnim skalpel drškama, namenjenih tankom i preciznom sečenju PPF/wrap folije.",
    specs: [
      { label: "Sadržaj", value: "10 sečiva" },
      { label: "Materijal", value: "Nerđajući čelik" },
      { label: "Namena", value: "PPF i wrap montaža" },
      { label: "Garancija", value: "1 godina" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 1 godina.",
  },
  {
    databaseId: 37,
    slug: "onyx-microfiber-towel-set-6kom",
    name: "ONYX Microfiber Towel Set / 6 kom",
    categories: [ALAT],
    price: "3300",
    shortDescription: "Set mikrofiber krpa za pripremu površine i finalno poliranje.",
    description:
      "Šest mikrofiber krpa različitih gramaža za pranje, sušenje, nanošenje keramičkog premaza i finalno poliranje bez ogrebotina.",
    specs: [
      { label: "Sadržaj", value: "6 krpa" },
      { label: "Gramaža", value: "350–500 GSM" },
      { label: "Pranje", value: "Mašinsko na 30°C" },
      { label: "Garancija", value: "1 godina" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 1 godina.",
  },
  {
    databaseId: 38,
    slug: "onyx-ir-thermometer",
    name: "ONYX IR Thermometer",
    categories: [ALAT],
    price: "5400",
    shortDescription: "Infracrveni termometar za kontrolu temperature laka i folije tokom montaže.",
    description:
      "Beskontaktno merenje temperature površine tokom termo-oblikovanja folije — sprečava pregrevanje laka i osigurava dosledne rezultate.",
    specs: [
      { label: "Opseg merenja", value: "-50°C do 550°C" },
      { label: "Preciznost", value: "±1.5°C" },
      { label: "Napajanje", value: "9V baterija" },
      { label: "Garancija", value: "2 godine" },
    ],
    installationNotes: null,
    warrantyNotes: "Garancija na fabričke nedostatke 2 godine.",
  },
  // Setovi (kits)
  {
    databaseId: 39,
    slug: "onyx-pro-install-kit",
    name: "ONYX Pro Install Kit",
    categories: [SETOVI, ALAT],
    price: "24900",
    gallery: true,
    shortDescription: "Kompletan alat za samostalnu PPF i wrap montažu.",
    description:
      "Sve što je potrebno za samostalnu montažu: Slip Solution, set rakela, knifeless traka, mikrofiber rukavice i krpe. Namenjeno naprednim entuzijastima i početnim instalaterima.",
    specs: [
      { label: "Sadržaj", value: "6 alata za montažu" },
      { label: "Namena", value: "PPF i wrap montaža" },
      { label: "Nivo", value: "Napredni entuzijasta" },
      { label: "Garancija", value: "2 godine na alat" },
    ],
    installationNotes: KIT_INSTALL,
    warrantyNotes: KIT_WARRANTY,
  },
  {
    databaseId: 40,
    slug: "onyx-shield-front-kit",
    name: "ONYX Shield Front Kit",
    categories: [SETOVI, PPF],
    price: "58400",
    gallery: true,
    shortDescription: "Prekrojen set ONYX Shield folije za prednji deo vozila.",
    description:
      "Fabrički prekrojeni komadi ONYX Shield 8.0 folije za haubu, branik, retrovizore i prednje ivice blatobrana. Skraćuje vreme montaže i smanjuje otpad materijala.",
    specs: [
      { label: "Pokriva", value: "Hauba, branik, retrovizori" },
      { label: "Debljina", value: "8 mil / 200 µm" },
      { label: "Garancija", value: "12 godina" },
      { label: "Završnica", value: "Sjaj" },
    ],
    installationNotes: KIT_INSTALL,
    warrantyNotes: filmWarranty(12),
  },
  {
    databaseId: 41,
    slug: "onyx-headlight-kit",
    name: "ONYX Headlight Kit",
    categories: [SETOVI, FAROVI],
    price: "17250",
    gallery: true,
    shortDescription: "Prekrojen set Light Guard folije za par prednjih farova.",
    description:
      "Fabrički prekrojeni komadi za par prednjih farova, dostupno u providnoj i dimljenoj varijanti. Uključuje Slip Solution sprej za lakšu montažu.",
    specs: [
      { label: "Pokriva", value: "Par prednjih farova" },
      { label: "Debljina", value: "6 mil / 150 µm" },
      { label: "Garancija", value: "5 godina" },
      { label: "Završnica", value: "Dimljena ili providna" },
    ],
    installationNotes: KIT_INSTALL,
    warrantyNotes: filmWarranty(5),
  },
  {
    databaseId: 42,
    slug: "onyx-matte-full-wrap",
    name: "ONYX Matte Full Wrap",
    categories: [SETOVI, MAT],
    price: "96700",
    gallery: true,
    shortDescription: "Kompletan set ONYX Matte folije za pun wrap srednjeg vozila.",
    description:
      "Dovoljna količina ONYX Matte 7.0 folije za pun wrap karoserije srednje veličine vozila, uz satensku završnicu i samoobnavljajući top coat.",
    specs: [
      { label: "Pokriva", value: "Puna karoserija, srednje vozilo" },
      { label: "Debljina", value: "7 mil / 175 µm" },
      { label: "Garancija", value: "10 godina" },
      { label: "Završnica", value: "Mat" },
    ],
    installationNotes: KIT_INSTALL,
    warrantyNotes: filmWarranty(10),
  },
  {
    databaseId: 43,
    slug: "onyx-full-body-shield-kit",
    name: "ONYX Full Body Shield Kit",
    categories: [SETOVI, PPF],
    price: "312000",
    shortDescription: "Kompletna sjajna PPF zaštita cele karoserije.",
    description:
      "Najobimniji set u ponudi — pokriva celu karoseriju vozila ONYX Shield 8.0 folijom. Uključuje Slip Solution, rakele i knifeless traku za profesionalnu montažu.",
    specs: [
      { label: "Pokriva", value: "Puna karoserija" },
      { label: "Debljina", value: "8 mil / 200 µm" },
      { label: "Garancija", value: "12 godina" },
      { label: "Završnica", value: "Sjaj" },
    ],
    installationNotes: KIT_INSTALL,
    warrantyNotes: filmWarranty(12),
  },
];

function simpleProduct(s: SimpleSpec): AnyProduct {
  const sku = `ONX-${s.slug.replace(/^onyx-/, "").toUpperCase().replace(/-/g, "")}`;
  return {
    __typename: "SimpleProduct",
    id: String(s.databaseId),
    databaseId: s.databaseId,
    name: s.name,
    slug: s.slug,
    description: s.description,
    shortDescription: s.shortDescription,
    image: { sourceUrl: "", altText: s.name.toUpperCase() },
    galleryImages: {
      nodes: s.gallery
        ? [
            { sourceUrl: "", altText: `${s.name.toUpperCase()} · DETALJ` },
            { sourceUrl: "", altText: `${s.name.toUpperCase()} · PAKOVANJE` },
          ]
        : [],
    },
    productCategories: { nodes: s.categories },
    specs: s.specs,
    installationNotes: s.installationNotes,
    warrantyNotes: s.warrantyNotes,
    featured: Boolean(s.featured),
    newArrival: Boolean(s.newArrival),
    price: s.price,
    regularPrice: s.price,
    salePrice: null,
    stockStatus: s.stockStatus ?? "IN_STOCK",
    sku,
  };
}

export const products: AnyProduct[] = [
  ...films.map((f) => filmProduct(f)),
  ...simples.map(simpleProduct),
];
