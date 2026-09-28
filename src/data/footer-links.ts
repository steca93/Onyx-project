export interface FooterLink {
  label: string;
  href: string;
}

// "Prodavnica" links are rendered from real categories (see Footer.tsx),
// not listed here — only the static support pages are fixed.
export const footerLinks: { podrska: FooterLink[] } = {
  podrska: [
    { label: "Registracija garancije", href: "/garancija" },
    { label: "Ovlašćeni centri", href: "/ovlasceni-centri" },
    { label: "Dostava i povraćaj", href: "/dostava-i-povracaj" },
    { label: "Uputstva za montažu", href: "/uputstva-za-montazu" },
    { label: "Česta pitanja", href: "/cesta-pitanja" },
    { label: "Kontakt", href: "/kontakt" },
    { label: "Uslovi korišćenja", href: "/uslovi-koriscenja" },
    { label: "Politika privatnosti", href: "/uslovi-koriscenja#politika-privatnosti" },
  ],
};
