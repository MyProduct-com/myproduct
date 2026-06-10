export const fmt = (n: number): string =>
  `KSh ${Number(n).toLocaleString()}`;

export const shortDesc = (d: string, max = 80): string =>
  d.length > max ? d.slice(0, max) + "…" : d;

export const genOrderId = (): string =>
  "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
