export interface FooterLink {
  label: string;
  href: string;
}

export const footerLinks: { prodavnica: FooterLink[]; podrska: FooterLink[] } = {
  prodavnica: [
    { label: "PPF folije", href: "/kategorija/ppf-folije" },
    { label: "Mat PPF", href: "/kategorija/mat-ppf" },
    { label: "Farovi i svetla", href: "/kategorija/farovi-i-svetla" },
    { label: "Keramički premazi", href: "/kategorija/keramicki-premazi" },
    { label: "Alat i montaža", href: "/kategorija/alat-i-montaza" },
    { label: "Setovi", href: "/kategorija/setovi" },
  ],
  podrska: [
    { label: "Registracija garancije", href: "/garancija" },
    { label: "Ovlašćeni centri", href: "/ovlasceni-centri" },
    { label: "Dostava i povraćaj", href: "/dostava-i-povracaj" },
    { label: "Uputstva za montažu", href: "/uputstva-za-montazu" },
    { label: "Česta pitanja", href: "/cesta-pitanja" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};
