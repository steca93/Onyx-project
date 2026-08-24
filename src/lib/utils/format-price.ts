/**
 * Woo returns price amounts as raw strings, never numbers. Every price
 * rendered on screen goes through this — dot thousands, comma decimals,
 * currency after a space: "142900" -> "142.900,00 RSD".
 */
export function formatPrice(raw: string | number | null | undefined): string {
  if (raw === null || raw === undefined || raw === "") return "—";
  const amount = typeof raw === "number" ? raw : Number.parseFloat(raw);
  if (Number.isNaN(amount)) return "—";

  const [whole, decimals = "00"] = amount.toFixed(2).split(".");
  const wholeWithDots = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${wholeWithDots},${decimals} RSD`;
}
