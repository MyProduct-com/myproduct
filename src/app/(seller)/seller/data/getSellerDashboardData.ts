import "server-only";
import { prisma } from "@/lib/prisma";
import { mockProducts, mockOrders, mockSellers } from "@/lib/mock-data";
import type { OrderItem as MockOrderItem } from "@/types/order";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function pctChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// Deterministic pseudo-random (seeded by day index) — stable across server
// and client renders, unlike Math.random().
function seeded(n: number) {
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
}

function generateDemoDailyRevenue(totalDays: number, baseline: number): { date: Date; revenue: number }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: { date: Date; revenue: number }[] = [];
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

export interface SellerDashboardData {
  storeName: string;
  storeRating: number;
  revenueTotal: number;
  revenueChangePct: number;
  revenueSparkline: number[];
  ordersTotal: number;
  ordersChangePct: number;
  activeProducts: number;
  lowStockCount: number;
  revenueByMonth: { label: string; income: number; expense: number }[];
  /** Real daily revenue for the last 2 years — sliced/aggregated client-side by the range selector. */
  dailyRevenue: { date: Date; revenue: number }[];
  topProducts: { id: string; name: string; image: string; sales: number; views: number; price: number }[];
  recentOrders: {
    id: string; customerName: string; itemCount: number; total: number;
    status: string; createdAt: Date;
  }[];
  lowStockProducts: { id: string; name: string; image: string; stock: number }[];
  totalViews: number;
  /** Order status counts over the last 6 months, for the analytics breakdown. */
  orderStatusBreakdown: { status: string; count: number }[];
}

/**
 * TEMPORARY — visual preview data used only while the database isn't
 * connected yet, built from the app's existing TechHub KE mock data (same
 * source the old hardcoded dashboard used) rather than invented numbers.
 * Safe to delete once Postgres is up and seeded.
 */
function demoSellerDashboardData(): SellerDashboardData {
  const seller = mockSellers.find((s) => s.id === "seller-2")!;
  const products = mockProducts.filter((p) => p.sellerId === "seller-2");
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).slice(0, 5);
  const sellerOrders = mockOrders.filter((o) => o.items.some((i: MockOrderItem) => i.sellerId === "seller-2"));

  const revenueByMonth = [
    { label: "Feb", income: 58000, expense: 2100 },
    { label: "Mar", income: 71000, expense: 1800 },
    { label: "Apr", income: 55000, expense: 3200 },
    { label: "May", income: 89000, expense: 2600 },
    { label: "Jun", income: 112000, expense: 4100 },
    { label: "Jul", income: 98000, expense: 2900 },
  ];

  const statusCounts = new Map<string, number>();
  for (const o of sellerOrders) statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);

  return {
    storeName: seller.storeName,
    storeRating: seller.storeRating,
    revenueTotal: 98000,
    revenueChangePct: 12.4,
    revenueSparkline: [11000, 13500, 12800, 15200, 14100, 16800, 15500],
    ordersTotal: sellerOrders.length || 12,
    ordersChangePct: 8.1,
    activeProducts: products.length,
    lowStockCount: lowStockProducts.length,
    revenueByMonth,
    dailyRevenue: generateDemoDailyRevenue(730, 3200),
    topProducts: topProducts.map((p) => ({ id: p.id, name: p.name, image: p.image, sales: p.sales, views: p.views, price: p.price })),
    recentOrders: sellerOrders.slice(0, 6).map((o) => ({
      id: o.id,
      customerName: o.customerName,
      itemCount: o.items.length,
      total: o.total,
      status: o.status,
      createdAt: new Date(o.createdAt),
    })),
    lowStockProducts: lowStockProducts.map((p) => ({ id: p.id, name: p.name, image: p.image, stock: p.stock })),
    totalViews: products.reduce((s, p) => s + p.views, 0),
    orderStatusBreakdown: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
  };
}

export async function getSellerDashboardData(sellerId: string): Promise<SellerDashboardData> {
  try {
    return await fetchSellerDashboardData(sellerId);
  } catch (err) {
    console.error("[seller dashboard] DB unreachable, showing demo data:", err);
    return demoSellerDashboardData();
  }
}

async function fetchSellerDashboardData(sellerId: string): Promise<SellerDashboardData> {
  const [
    sellerProfile,
    itemsCurrentPeriod,
    itemsPreviousPeriod,
    itemsLast7Days,
    itemsLast6Months,
    itemsLast2Years,
    activeProducts,
    lowStockProducts,
    topProducts,
    recentOrderItems,
    viewsAgg,
  ] = await Promise.all([
    prisma.sellerProfile.findUnique({ where: { userId: sellerId } }),
    prisma.orderItem.findMany({
      where: { sellerId, order: { createdAt: { gte: daysAgo(30) }, status: { not: "CANCELLED" } } },
      include: { order: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId, order: { createdAt: { gte: daysAgo(60), lt: daysAgo(30) }, status: { not: "CANCELLED" } } },
      include: { order: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId, order: { createdAt: { gte: daysAgo(6) }, status: { not: "CANCELLED" } } },
      include: { order: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId, order: { createdAt: { gte: daysAgo(179) }, status: { not: "CANCELLED" } } },
      include: { order: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId, order: { createdAt: { gte: daysAgo(729) }, status: { not: "CANCELLED" } } },
      select: { subtotal: true, order: { select: { createdAt: true } } },
    }),
    prisma.product.count({ where: { sellerId, status: "LIVE" } }),
    prisma.product.findMany({
      where: { sellerId, stock: { gt: 0, lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, image: true, stock: true },
    }),
    prisma.product.findMany({
      where: { sellerId },
      orderBy: { sales: "desc" },
      take: 5,
      select: { id: true, name: true, image: true, sales: true, views: true, price: true },
    }),
    prisma.orderItem.findMany({
      where: { sellerId },
      orderBy: { order: { createdAt: "desc" } },
      take: 6,
      include: { order: { include: { customer: true, items: true } } },
    }),
    prisma.product.aggregate({ where: { sellerId }, _sum: { views: true } }),
  ]);

  const revenueTotal = itemsCurrentPeriod.reduce((s, i) => s + i.subtotal, 0);
  const revenuePrev = itemsPreviousPeriod.reduce((s, i) => s + i.subtotal, 0);
  const ordersTotal = new Set(itemsCurrentPeriod.map((i) => i.orderId)).size;
  const ordersPrev = new Set(itemsPreviousPeriod.map((i) => i.orderId)).size;

  const revenueSparkline: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = daysAgo(i);
    const dayEnd = daysAgo(i - 1);
    const dayItems = itemsLast7Days.filter((it) => it.order.createdAt >= dayStart && it.order.createdAt < dayEnd);
    revenueSparkline.push(dayItems.reduce((s, it) => s + it.subtotal, 0));
  }

  const revenueByMonth: { label: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date();
    monthDate.setDate(1);
    monthDate.setMonth(monthDate.getMonth() - i);
    const monthItems = itemsLast6Months.filter(
      (it) => it.order.createdAt.getFullYear() === monthDate.getFullYear() && it.order.createdAt.getMonth() === monthDate.getMonth()
    );
    const refunded = monthItems.filter((it) => it.order.status === "REFUNDED").reduce((s, it) => s + it.subtotal, 0);
    revenueByMonth.push({
      label: MONTH_LABELS[monthDate.getMonth()],
      income: monthItems.reduce((s, it) => s + it.subtotal, 0),
      expense: refunded,
    });
  }

  // Bucket the last 730 days of real order items into one revenue total per day.
  const dailyRevenueMap = new Map<string, number>();
  for (const it of itemsLast2Years) {
    const key = it.order.createdAt.toISOString().slice(0, 10);
    dailyRevenueMap.set(key, (dailyRevenueMap.get(key) ?? 0) + it.subtotal);
  }
  const dailyRevenue: { date: Date; revenue: number }[] = [];
  const todayForRange = new Date();
  todayForRange.setHours(0, 0, 0, 0);
  for (let i = 729; i >= 0; i--) {
    const d = new Date(todayForRange);
    d.setDate(d.getDate() - i);
    dailyRevenue.push({ date: d, revenue: dailyRevenueMap.get(d.toISOString().slice(0, 10)) ?? 0 });
  }

  const recentOrders = recentOrderItems.map((it) => ({
    id: it.order.id,
    customerName: it.order.customer.name,
    itemCount: it.order.items.length,
    total: it.order.total,
    status: it.order.status,
    createdAt: it.order.createdAt,
  }));
  // de-duplicate by order id (an order can have multiple items from this seller)
  const seenOrders = new Set<string>();
  const dedupedOrders = recentOrders.filter((o) => (seenOrders.has(o.id) ? false : (seenOrders.add(o.id), true)));

  const statusCounts = new Map<string, number>();
  const seenForStatus = new Set<string>();
  for (const it of itemsLast6Months) {
    if (seenForStatus.has(it.order.id)) continue;
    seenForStatus.add(it.order.id);
    statusCounts.set(it.order.status, (statusCounts.get(it.order.status) ?? 0) + 1);
  }

  return {
    storeName: sellerProfile?.storeName ?? "Your Store",
    storeRating: sellerProfile?.storeRating ?? 0,
    revenueTotal,
    revenueChangePct: pctChange(revenueTotal, revenuePrev),
    revenueSparkline,
    ordersTotal,
    ordersChangePct: pctChange(ordersTotal, ordersPrev),
    activeProducts,
    lowStockCount: lowStockProducts.length,
    revenueByMonth,
    dailyRevenue,
    topProducts,
    recentOrders: dedupedOrders,
    lowStockProducts,
    totalViews: viewsAgg._sum.views ?? 0,
    orderStatusBreakdown: Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count })),
  };
}
