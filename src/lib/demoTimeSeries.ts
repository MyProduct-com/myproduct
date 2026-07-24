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

export interface DemoDailyStat {
  date: Date;
  revenue: number;
  orders: number;
  customers: number;
}

/**
 * Same deterministic model as generateDemoDailyRevenue, extended with plausible
 * orders/customers counts derived from that day's revenue — so KPI cards, the
 * order-status breakdown, and the revenue chart all read from one consistent
 * series instead of drifting mock arrays. Safe to delete once real per-day
 * order/customer queries exist.
 */
export function generateDemoDailyStats(totalDays: number, revenueBaseline: number, avgOrderValueBaseline: number): DemoDailyStat[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: DemoDailyStat[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.65 : 1;
    const growth = 1 + ((totalDays - i) / totalDays) * 0.4;
    const noise = 0.8 + Math.sin(i * 1.3) * 0.12 + seeded(i) * 0.18;
    const revenue = Math.round(revenueBaseline * weekendDip * growth * noise);
    const orders = Math.max(1, Math.round((revenue / avgOrderValueBaseline) * (0.85 + seeded(i * 7) * 0.3)));
    const customers = Math.max(1, Math.round(orders * (0.72 + seeded(i * 13) * 0.2)));
    out.push({ date, revenue, orders, customers });
  }
  return out;
}
