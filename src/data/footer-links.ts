export interface FooterLink {
  /** Key into the Footer.links.* messages namespace — labels live in the
   * translation catalogs, not here, so this list stays locale-agnostic. */
  labelKey: "warranty" | "authorizedCenters" | "shipping" | "installGuide" | "faq" | "contact" | "terms" | "privacy";
  href: string;
}

// "Prodavnica" links are rendered from real categories (see Footer.tsx),
// not listed here — only the static support pages are fixed.
export const footerLinks: { podrska: FooterLink[] } = {
  podrska: [
    { labelKey: "warranty", href: "/garancija" },
    { labelKey: "authorizedCenters", href: "/ovlasceni-centri" },
    { labelKey: "shipping", href: "/dostava-i-povracaj" },
    { labelKey: "installGuide", href: "/uputstva-za-montazu" },
    { labelKey: "faq", href: "/cesta-pitanja" },
    { labelKey: "contact", href: "/kontakt" },
    { labelKey: "terms", href: "/uslovi-koriscenja" },
    { labelKey: "privacy", href: "/uslovi-koriscenja#politika-privatnosti" },
  ],
};
