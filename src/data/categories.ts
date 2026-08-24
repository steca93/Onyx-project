import type { ProductCategory } from "@/lib/repo/types";

export const categories: ProductCategory[] = [
  {
    id: "cat-1",
    name: "PPF folije",
    slug: "ppf-folije",
    count: 10,
    description:
      "Samoobnavljajuće PPF folije visokog sjaja za lak, u više debljina i širina.",
    image: null,
  },
  {
    id: "cat-2",
    name: "Mat PPF",
    slug: "mat-ppf",
    count: 7,
    description:
      "Satenska mat završnica bez efekta pomorandžine kore, iste zaštite kao sjajna linija.",
    image: null,
  },
  {
    id: "cat-3",
    name: "Farovi i svetla",
    slug: "farovi-i-svetla",
    count: 8,
    description:
      "PPF zaštita i tamnjenje za prednje farove, maglenke i zadnja stop svetla.",
    image: null,
  },
  {
    id: "cat-4",
    name: "Keramički premazi",
    slug: "keramicki-premazi",
    count: 9,
    description:
      "Keramička zaštita za lak, felne, staklo i enterijer sa hidrofobnim svojstvima.",
    image: null,
  },
  {
    id: "cat-5",
    name: "Alat i montaža",
    slug: "alat-i-montaza",
    count: 9,
    description:
      "Profesionalni alat i potrošni materijal za PPF i wrap montažu.",
    image: null,
  },
  {
    id: "cat-6",
    name: "Setovi",
    slug: "setovi",
    count: 5,
    description:
      "Prekrojeni i kompletni setovi za brzu montažu bez merenja i sečenja.",
    image: null,
  },
];
