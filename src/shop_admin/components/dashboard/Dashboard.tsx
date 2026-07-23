import { Wallet, Package, TrendingUp, AlertTriangle } from "lucide-react";
import type { AdminOrder, AdminProduct, DailyStat, OrderStatus, TopProduct } from "../../types/index";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeRevenueChart from "@/components/dashboard/RangeRevenueChart";
import DonutChart from "@/components/dashboard/DonutChart";
import StatusPill from "@/components/dashboard/StatusPill";
import { generateDemoDailyRevenue } from "@/lib/demoTimeSeries";
import { fmt, fmtDateTime } from "../../utils/helpers";

const STATUS_COLOR: Record<OrderStatus, string> = {
  "Pending": "#C98A2C",
  "Under Processing": "#E8871E",
  "Dispatched": "#6B8F71",
  "In Transit": "#3B82F6",
  "Delivered": "#2E7D4F",
  "Cancelled": "#D64545",
  "Returned": "#9CA3AF",
};

interface DashboardProps {
  orders: AdminOrder[];
  products: AdminProduct[];
  dailyStats: DailyStat[];
  topProducts: TopProduct[];
}

// TEMPORARY — there's no order-history table wired up for shop_admin yet, so
// the range-selector chart runs on a generated 2-year series (same demo
// pattern used on the seller and super_admin dashboards). Swap for a real
// per-day revenue query once shop_admin has one.
const DEMO_DAILY_REVENUE = generateDemoDailyRevenue(730, 42000);

export default function Dashboard({ orders, products, dailyStats, topProducts }: DashboardProps) {
  const todayStats = dailyStats[dailyStats.length - 1];
  const yesterdayStats = dailyStats[dailyStats.length - 2];
  const totalRevenue = dailyStats.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = dailyStats.reduce((s, d) => s + d.orders, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Under Processing").length;
  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const revenueGrowth = yesterdayStats ? (((todayStats.revenue - yesterdayStats.revenue) / yesterdayStats.revenue) * 100) : 0;
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const ordersByStatus = (Object.keys(STATUS_COLOR) as OrderStatus[])
    .map((status) => ({ label: status, value: orders.filter((o) => o.status === status).length, color: STATUS_COLOR[status] }))
    .filter((s) => s.value > 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Dashboard</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">
          Overview for the last 7 days · Last updated {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="7-Day Revenue" value={fmt(totalRevenue)} icon={<Wallet size={16} />} changePct={revenueGrowth} />
        <StatCard label="Total Orders (7d)" value={String(totalOrders)} icon={<Package size={16} />} />
        <StatCard label="Avg Order Value" value={fmt(Math.round(totalRevenue / totalOrders))} icon={<TrendingUp size={16} />} />
        <StatCard
          label="Low Stock Alerts"
          value={String(lowStock)}
          icon={<AlertTriangle size={16} />}
          iconBg={lowStock > 0 ? "bg-org-warning/15 text-org-warning" : "bg-org-success-bg text-org-success"}
        />
      </div>

      {/* Revenue chart */}
      <RangeRevenueChart data={DEMO_DAILY_REVENUE} currency="KES" />

      {/* Recent Orders + Orders by Status + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Recent Orders" className="lg:col-span-2">
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
          <ChartCard title="Orders by Volume" subtitle="By status">
            {ordersByStatus.length === 0 ? (
              <p className="text-org-sm text-org-text-secondary text-center py-8">No orders yet.</p>
            ) : (
              <DonutChart data={ordersByStatus} />
            )}
          </ChartCard>

          <ChartCard title="Top Products">
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
