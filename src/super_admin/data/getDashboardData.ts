import "server-only";
import { prisma } from "@/lib/prisma";
import { MOCK_SHOPS, MOCK_METRICS } from "./mockData";

export interface ShopSummary {
  id: string;
  name: string;
  logoIcon: string;
  status: string;
  packageName: string;
  shopsCreated: number;
  packageShopLimit: number;
  expiresAt: Date | null;
}

export interface SuperAdminDashboardData {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalUsers: number;
  platformRevenue: number;
  platformRevenueThisMonth: number;
  packageBreakdown: { packageName: string; count: number; color: string }[];
  shops: ShopSummary[];
}

// Monochrome-green scale, lightest to darkest, matching the org-* palette.
const PACKAGE_COLORS: Record<string, string> = {
  Starter: "#C9DDCB",
  Growth: "#8FAF97",
  Pro: "#4C7A5A",
  Enterprise: "#1B3A2B",
};

function packageBreakdownFrom(shops: { packageName: string }[]) {
  const counts = new Map<string, number>();
  for (const s of shops) counts.set(s.packageName, (counts.get(s.packageName) ?? 0) + 1);
  return Array.from(counts.entries()).map(([packageName, count]) => ({
    packageName,
    count,
    color: PACKAGE_COLORS[packageName] ?? "#6B8F71",
  }));
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * TEMPORARY — visual preview data used only while the real database isn't
 * connected yet (see AUTH_DISABLED / the catch below). Mirrors the original
 * MOCK_METRICS numbers so the dashboard looks the same as before real data
 * is wired in. Safe to delete once Postgres is up and seeded.
 */
function demoDashboardData(): SuperAdminDashboardData {
  const shops: ShopSummary[] = MOCK_SHOPS.map((s) => ({
    id: s.id,
    name: s.name,
    logoIcon: s.logoIcon,
    status: s.status,
    packageName: s.packageName,
    shopsCreated: s.shopsCreated,
    packageShopLimit: s.packageShopLimit,
    expiresAt: s.expiresAt ? new Date(s.expiresAt) : null,
  }));

  return {
    totalShops: MOCK_METRICS.totalShops,
    activeShops: MOCK_METRICS.activeShops,
    suspendedShops: MOCK_METRICS.suspendedShops,
    totalUsers: MOCK_METRICS.totalSubscribers,
    platformRevenue: MOCK_METRICS.totalRevenue,
    platformRevenueThisMonth: MOCK_METRICS.monthlyRevenue,
    packageBreakdown: packageBreakdownFrom(shops),
    shops,
  };
}

/**
 * Never throws — if the database is unreachable or not yet migrated/seeded,
 * this falls back to demo preview data so the dashboard is visible and
 * reviewable before Postgres is wired up. Once the DB is live, real rows
 * flow through automatically and this fallback is never hit.
 */
export async function getSuperAdminDashboardData(): Promise<SuperAdminDashboardData> {
  try {
    return await fetchDashboardData();
  } catch (err) {
    console.warn("[super_admin dashboard] DB unreachable, showing demo data:", err);
    return demoDashboardData();
  }
}

async function fetchDashboardData(): Promise<SuperAdminDashboardData> {
  const [shopRows, totalUsers, revenueAllTime, revenueThisMonth] = await Promise.all([
    prisma.shop.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, logoIcon: true, status: true, packageName: true, shopsCreated: true, packageShopLimit: true, expiresAt: true },
    }),
    prisma.user.count(),
    prisma.transaction.aggregate({
      where: { shopId: { not: null }, type: "INCOME", status: { not: "CANCELLED" } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { shopId: { not: null }, type: "INCOME", status: { not: "CANCELLED" }, occurredAt: { gte: daysAgo(30) } },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalShops: shopRows.length,
    activeShops: shopRows.filter((s) => s.status === "active").length,
    suspendedShops: shopRows.filter((s) => s.status === "suspended").length,
    totalUsers,
    platformRevenue: revenueAllTime._sum.amount ?? 0,
    platformRevenueThisMonth: revenueThisMonth._sum.amount ?? 0,
    packageBreakdown: packageBreakdownFrom(shopRows),
    shops: shopRows,
  };
}
