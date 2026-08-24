export interface SiteSettings {
  brandName: string;
  brandSuffix: string;
  supportPhone: string;
  freeShippingThresholdRsd: number;
  warrantyYears: number;
  distributorClaim: string;
  social: { label: string; href: string }[];
  contact: {
    email: string;
    phone: string;
    address: string;
    workingHours: string;
  };
  copyrightLine: string;
  paymentChips: string[];
}

export const siteSettings: SiteSettings = {
  brandName: "ONYX",
  brandSuffix: "EVOLUTION",
  supportPhone: "+381 11 4067 200",
  freeShippingThresholdRsd: 15000,
  warrantyYears: 12,
  distributorClaim: "OVLAŠĆENI DISTRIBUTER ZA SRBIJU",
  social: [
    { label: "IG", href: "https://instagram.com" },
    { label: "FB", href: "https://facebook.com" },
    { label: "YT", href: "https://youtube.com" },
  ],
  contact: {
    email: "podrska@onyxevolution.rs",
    phone: "+381 11 4067 200",
    address: "Bulevar Oslobođenja 12, 11000 Beograd",
    workingHours: "Pon–Pet 09–17h",
  },
  copyrightLine: "© 2026 ONYX EVOLUTION · SVA PRAVA ZADRŽANA",
  paymentChips: ["VISA", "MASTERCARD", "MAESTRO", "DINA", "AMEX"],
};
