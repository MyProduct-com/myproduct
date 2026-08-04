"use client";
import { useMemo, useState } from "react";
import {
  Wallet, Package, TrendingUp, AlertTriangle, Plus, Monitor,
  Undo2, Download, Users, Ticket, Landmark,
} from "lucide-react";
import type {
  AdminOrder, AdminProduct, AdminView, DashboardNavOptions, OrderStatus,
  StockMovement, TopProduct, Subscription, SubscriptionPlan, AccountingEntry,
} from "../../types/index";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeRevenueChart from "@/components/dashboard/RangeRevenueChart";
import DonutChart from "@/components/dashboard/DonutChart";
import StatusPill from "@/components/dashboard/StatusPill";
import { generateDemoDailyStats } from "@/lib/demoTimeSeries";
import { fmt, fmtDateTime, daysUntil } from "../../utils/helpers";

const STATUS_COLOR: Record<OrderStatus, string> = {
  "Pending": "#C98A2C",
  "Under Processing": "#E8871E",
  "Dispatched": "#6B8F71",
  "In Transit": "#3B82F6",
  "Delivered": "#2E7D4F",
  "Cancelled": "#D64545",
  "Returned": "#9CA3AF",
};

// Weighted share of orders that land in each status over a normal window —
// used to turn a single aggregate order count into a status breakdown, since
// there's no real per-order history to tally yet.
const STATUS_WEIGHTS: [OrderStatus, number][] = [
  ["Delivered", 0.46],
  ["In Transit", 0.14],
  ["Dispatched", 0.09],
  ["Under Processing", 0.11],
  ["Pending", 0.09],
  ["Cancelled", 0.07],
  ["Returned", 0.04],
];

function allocateStatusBreakdown(total: number): { status: OrderStatus; count: number }[] {
  if (total <= 0) return [];
  const rows = STATUS_WEIGHTS.map(([status, weight]) => {
    const exact = total * weight;
    return { status, count: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let allocated = rows.reduce((s, r) => s + r.count, 0);
  const byRemainder = [...rows].sort((a, b) => b.remainder - a.remainder);
  for (let i = 0; allocated < total; i++, allocated++) byRemainder[i % byRemainder.length].count += 1;
  return rows.map((r) => ({ status: r.status, count: r.count }));
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

// TEMPORARY — there's no order-history table wired up for shop_admin yet, so
// revenue/orders/customers per day all come from one deterministic generated
// series (same demo pattern used on the seller and super_admin dashboards).
// Swap for real per-day queries once shop_admin has them.
const REVENUE_BASELINE = 42000;
const AOV_BASELINE = 1350;
const DEMO_DAILY_STATS = generateDemoDailyStats(730, REVENUE_BASELINE, AOV_BASELINE);
const DEMO_REVENUE_POINTS = DEMO_DAILY_STATS.map((r) => ({ date: r.date, revenue: r.revenue }));
const RETURNING_CUSTOMER_SHARE = 0.34;

interface DashboardProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  topProducts: TopProduct[];
  movements: StockMovement[];
  subscription: Subscription;
  plans: SubscriptionPlan[];
  accounting: AccountingEntry[];
  staffCount: number;
  onNavigate: (view: AdminView, opts?: DashboardNavOptions) => void;
}

export default function Dashboard({
  orders, products, topProducts, movements, subscription, plans, accounting, staffCount, onNavigate,
}: DashboardProps) {
  const [range, setRange] = useState<{ days: number; label: string }>({ days: 30, label: "30D" });

  const totalDays = DEMO_DAILY_STATS.length;
  const windowDays = Math.min(range.days, totalDays);
  const currentWindow = useMemo(() => DEMO_DAILY_STATS.slice(totalDays - windowDays), [windowDays, totalDays]);
  const previousWindowDays = Math.min(windowDays, totalDays - windowDays);
  const previousWindow = useMemo(
    () => DEMO_DAILY_STATS.slice(totalDays - windowDays - previousWindowDays, totalDays - windowDays),
    [windowDays, previousWindowDays, totalDays]
  );

  const sum = (rows: typeof DEMO_DAILY_STATS, key: "revenue" | "orders" | "customers") => rows.reduce((s, d) => s + d[key], 0);

  const totalRevenue = sum(currentWindow, "revenue");
  const prevRevenue = sum(previousWindow, "revenue");
  const totalOrders = sum(currentWindow, "orders");
  const prevOrders = sum(previousWindow, "orders");
  const totalCustomers = sum(currentWindow, "customers");
  const prevCustomers = sum(previousWindow, "customers");

  const revenueGrowth = pctChange(totalRevenue, prevRevenue);
  const ordersGrowth = pctChange(totalOrders, prevOrders);
  const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const prevAov = prevOrders > 0 ? prevRevenue / prevOrders : 0;
  const aovGrowth = pctChange(aov, prevAov);

  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const lowStock = lowStockProducts.length;
  // Reconstruct "stock before the most recent movement" per product so the
  // low-stock count can show a real before/after trend from actual stock history.
  const earliestMovement = new Map<number, StockMovement>();
  for (const m of movements) {
    const existing = earliestMovement.get(m.productId);
    if (!existing || new Date(m.createdAt) < new Date(existing.createdAt)) earliestMovement.set(m.productId, m);
  }
  const prevLowStock = products.filter((p) => {
    const m = earliestMovement.get(p.id);
    return (m ? m.previousStock : p.stock) <= p.lowStockThreshold;
  }).length;
  // Inverted: fewer low-stock items is the improvement, so that renders green.
  const lowStockChangePct = -pctChange(lowStock, prevLowStock);

  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const ordersByStatus = allocateStatusBreakdown(totalOrders)
    .map((s) => ({ label: s.status, value: s.count, color: STATUS_COLOR[s.status] }))
    .filter((s) => s.value > 0);

  const customersGrowth = pctChange(totalCustomers, prevCustomers);
  const returningCustomers = Math.round(totalCustomers * RETURNING_CUSTOMER_SHARE);
  const newCustomers = totalCustomers - returningCustomers;
  const repeatPurchaseRate = totalOrders > 0 ? Math.max(0, ((totalOrders - totalCustomers) / totalOrders) * 100) : 0;

  const currentPlan = plans.find((p) => p.id === subscription.planId) ?? plans[0];
  const renewalDays = daysUntil(subscription.expiryDate);
  const productLimit = currentPlan.limits.products;
  const limitLabel = (used: number, limit: number) => (limit < 0 ? `${used} used · unlimited` : `${used} / ${limit} used`);

  const outstandingPayments = orders
    .filter((o) => o.paymentStatus === "Pending" || o.paymentStatus === "Failed")
    .reduce((s, o) => s + o.total, 0);
  const netToDate =
    accounting.filter((e) => e.type === "sale").reduce((s, e) => s + e.amount, 0) -
    accounting.filter((e) => ["expense", "salary", "purchase"].includes(e.type)).reduce((s, e) => s + e.amount, 0) -
    accounting.filter((e) => e.type === "refund").reduce((s, e) => s + e.amount, 0);

  const exportCsv = () => {
    const header = "Date,Revenue,Orders,Customers\n";
    const body = currentWindow
      .map((d) => `${d.date.toISOString().slice(0, 10)},${d.revenue},${d.orders},${d.customers}`)
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard-${range.label.replace(/\s+/g, "-")}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-org-lg font-org-bold text-org-text-primary">Dashboard</h1>
          <p className="text-org-sm text-org-text-secondary mt-0.5">
            Overview for {range.label} · Last updated {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors shrink-0"
        >
          <Download size={14} /> Export {range.label} CSV
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onNavigate("products", { openAddProduct: true })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors"
        >
          <Plus size={14} /> Add Product
        </button>
        <button
          onClick={() => onNavigate("pos")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors"
        >
          <Monitor size={14} /> New Sale (POS)
        </button>
        <button
          onClick={() => onNavigate("orders", { paymentFilter: "Paid" })}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors"
        >
          <Undo2 size={14} /> Process Refund
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={`Revenue (${range.label})`} value={fmt(totalRevenue)} icon={<Wallet size={16} />} changePct={revenueGrowth} />
        <StatCard label={`Total Orders (${range.label})`} value={String(totalOrders)} icon={<Package size={16} />} changePct={ordersGrowth} />
        <StatCard label="Avg Order Value" value={fmt(Math.round(aov))} icon={<TrendingUp size={16} />} changePct={aovGrowth} />
        {lowStock > 0 ? (
          <button onClick={() => onNavigate("products", { lowStockOnly: true })} className="text-left">
            <StatCard
              label="Low Stock Alerts"
              value={String(lowStock)}
              icon={<AlertTriangle size={16} />}
              iconBg="bg-org-warning/15 text-org-warning"
              changePct={lowStock === prevLowStock ? undefined : lowStockChangePct}
            />
          </button>
        ) : (
          <StatCard
            label="Low Stock Alerts"
            value="0"
            icon={<AlertTriangle size={16} />}
            iconBg="bg-org-success-bg text-org-success"
            changePct={lowStock === prevLowStock ? undefined : lowStockChangePct}
          />
        )}
      </div>

      {/* Revenue chart — drives the KPI window above via onRangeChange */}
      <RangeRevenueChart
        data={DEMO_REVENUE_POINTS}
        currency="KES"
        defaultPreset="30d"
        onRangeChange={(r) => setRange(r)}
      />

      {/* Customers · Subscription · Accounting snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ChartCard title="Customers" subtitle={range.label}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-org-primary-light text-org-primary"><Users size={16} /></div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-org-xl font-org-bold text-org-text-primary leading-none">{totalCustomers}</p>
                <span className={`text-org-xs font-org-semibold ${customersGrowth >= 0 ? "text-org-success" : "text-org-danger"}`}>
                  {customersGrowth >= 0 ? "+" : ""}{customersGrowth.toFixed(1)}%
                </span>
              </div>
              <p className="text-org-xs text-org-text-secondary mt-0.5">active this period</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-org-xs text-org-text-secondary">
            <div className="flex justify-between"><span>New</span><span className="font-org-semibold text-org-text-primary">{newCustomers}</span></div>
            <div className="flex justify-between"><span>Returning</span><span className="font-org-semibold text-org-text-primary">{returningCustomers}</span></div>
            <div className="flex justify-between"><span>Repeat purchase rate</span><span className="font-org-semibold text-org-text-primary">{repeatPurchaseRate.toFixed(1)}%</span></div>
          </div>
        </ChartCard>

        <button onClick={() => onNavigate("subscription")} className="text-left">
          <ChartCard title="Subscription" subtitle={currentPlan.name}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-org-primary-light text-org-primary"><Ticket size={16} /></div>
              <div>
                <p className="text-org-xl font-org-bold text-org-text-primary leading-none">{renewalDays >= 0 ? `${renewalDays}d` : "Expired"}</p>
                <p className="text-org-xs text-org-text-secondary mt-0.5">until renewal</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-org-xs text-org-text-secondary">
              <div className="flex justify-between"><span>Products</span><span className="font-org-semibold text-org-text-primary">{limitLabel(products.length, productLimit)}</span></div>
              <div className="flex justify-between"><span>Staff</span><span className="font-org-semibold text-org-text-primary">{limitLabel(staffCount, currentPlan.limits.staff)}</span></div>
              <div className="flex justify-between"><span>Auto-renew</span><span className="font-org-semibold text-org-text-primary">{subscription.autoRenew ? "On" : "Off"}</span></div>
            </div>
          </ChartCard>
        </button>

        <button onClick={() => onNavigate("accounting")} className="text-left">
          <ChartCard title="Payments" subtitle="Accounting snapshot">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${outstandingPayments > 0 ? "bg-org-warning/15 text-org-warning" : "bg-org-success-bg text-org-success"}`}><Landmark size={16} /></div>
              <div>
                <p className="text-org-xl font-org-bold text-org-text-primary leading-none">{fmt(outstandingPayments)}</p>
                <p className="text-org-xs text-org-text-secondary mt-0.5">outstanding payments</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 text-org-xs text-org-text-secondary">
              <div className="flex justify-between"><span>Net to date</span><span className={`font-org-semibold ${netToDate < 0 ? "text-org-danger" : "text-org-text-primary"}`}>{fmt(netToDate)}</span></div>
              <div className="flex justify-between"><span>Ledger entries</span><span className="font-org-semibold text-org-text-primary">{accounting.length}</span></div>
            </div>
          </ChartCard>
        </button>
      </div>

      {/* Recent Orders + Orders by Status + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Recent Orders"
          subtitle="Latest activity"
          className="lg:col-span-2"
          action={<button onClick={() => onNavigate("orders")} className="text-org-xs font-org-semibold text-org-primary hover:underline shrink-0">View all</button>}
        >
          {recentOrders.length === 0 ? (
            <p className="text-org-sm text-org-text-secondary text-center py-8">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-1">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-org-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-org-sm font-org-semibold text-org-text-primary truncate">{order.id}</p>
                    <p className="text-org-xs text-org-text-secondary truncate">{order.customerName} &middot; {fmtDateTime(order.createdAt)}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-org-sm font-org-bold text-org-text-primary">{fmt(order.total)}</p>
                    <StatusPill status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>

        <div className="flex flex-col gap-4">
          <ChartCard title="Orders by Status" subtitle={`${range.label} · ${totalOrders} orders`}>
            {ordersByStatus.length === 0 ? (
              <p className="text-org-sm text-org-text-secondary text-center py-8">No orders yet.</p>
            ) : (
              <DonutChart data={ordersByStatus} />
            )}
          </ChartCard>

          <ChartCard
            title="Top Products"
            action={<button onClick={() => onNavigate("products")} className="text-org-xs font-org-semibold text-org-primary hover:underline shrink-0">View all</button>}
          >
            {topProducts.length === 0 ? (
              <p className="text-org-sm text-org-text-secondary text-center py-8">No products yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topProducts.map((p, i) => (
                  <div key={p.productId} className="flex items-center gap-2.5">
                    <span className="text-org-xs font-org-bold text-org-text-muted w-4 shrink-0">{i + 1}</span>
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-org-xs font-org-medium text-org-text-primary truncate">{p.name}</p>
                      <p className="text-org-xs text-org-text-secondary">{p.unitsSold} sold</p>
                    </div>
                    <span className="text-org-xs font-org-semibold text-org-text-primary shrink-0">{fmt(p.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
