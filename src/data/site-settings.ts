// Language-neutral business data only — display copy that needs translation
// (distributor claim, copyright line, working hours) lives in the "Site"
// messages namespace instead (see messages/{sr,en,de}.json), not here.
export interface SiteSettings {
  brandName: string;
  brandSuffix: string;
  supportPhone: string;
  freeShippingThresholdRsd: number;
  warrantyYears: number;
  social: { label: string; href: string }[];
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  paymentChips: string[];
}

export const siteSettings: SiteSettings = {
  brandName: "ONYX",
  brandSuffix: "EVOLUTION",
  supportPhone: "+381 11 4067 200",
  freeShippingThresholdRsd: 15000,
  warrantyYears: 12,
  social: [
    { label: "IG", href: "https://instagram.com" },
    { label: "FB", href: "https://facebook.com" },
    { label: "YT", href: "https://youtube.com" },
  ],
  contact: {
    email: "podrska@onyxevolution.rs",
    phone: "+381 11 4067 200",
    // Kept in Serbian regardless of locale — this is the real postal
    // address, not display copy.
    address: "Bulevar Oslobođenja 12, 11000 Beograd",
  },
  paymentChips: ["VISA", "MASTERCARD", "MAESTRO", "DINA", "AMEX"],
};
