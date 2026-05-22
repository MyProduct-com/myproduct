export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number, currency = "KES"): string {
  return `${currency} ${amount.toLocaleString("en-KE")}`;
}

export function getStockColor(stock: number, maxStock: number): string {
  const pct = stock / maxStock;
  if (stock === 0) return "#E24B4A";
  if (pct <= 0.15) return "#EF9F27";
  return "#1D9E75";
}

export function getStockPct(stock: number, maxStock: number): number {
  return Math.min(100, Math.round((stock / maxStock) * 100));
}