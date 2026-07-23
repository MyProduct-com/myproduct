// Deterministic pseudo-random (seeded by index) — stable across server and
// client renders, unlike Math.random(), so it doesn't cause a hydration
// mismatch. Shared by every dashboard that needs a realistic-looking demo
// time series before its real data source is wired up.
function seeded(n: number) {
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
}

export interface DemoRevenuePoint {
  date: Date;
  revenue: number;
}

/**
 * TEMPORARY — generates a realistic 2-year daily revenue series so range
 * selectors (7D/30D/6M/12M/Custom) are fully buildable and testable before a
 * real backend exists. Safe to delete once real per-day revenue queries
 * replace whatever calls this.
 */
export function generateDemoDailyRevenue(totalDays: number, baseline: number): DemoRevenuePoint[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: DemoRevenuePoint[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const growth = 1 + ((totalDays - i) / totalDays) * 0.4;
    const noise = 0.8 + Math.sin(i * 1.3) * 0.12 + seeded(i) * 0.18;
    out.push({ date, revenue: Math.round(baseline * weekendDip * growth * noise) });
  }
  return out;
}
