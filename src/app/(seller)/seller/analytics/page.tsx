import { getServerSession } from "next-auth";
import { Wallet, Eye, ShoppingCart, Star } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeRevenueChart from "@/components/dashboard/RangeRevenueChart";
import { getSellerDashboardData } from "../data/getSellerDashboardData";

const DEMO_SELLER_EMAIL = "techhub@myproducts.co.ke";
const fmt = (n: number) => `KES ${n.toLocaleString()}`;

const STATUS_BAR_TONE: Record<string, string> = {
  DELIVERED: "bg-org-success",
  CONFIRMED: "bg-org-success",
  PROCESSING: "bg-org-warning",
  PENDING: "bg-org-warning",
  SHIPPED: "bg-org-accent",
  CANCELLED: "bg-org-danger",
  REFUNDED: "bg-org-danger",
};

export default async function SellerAnalyticsPage() {
  const session = await getServerSession(authOptions);

  let sellerId = session?.user?.id;
  if (!sellerId) {
    try {
      const demo = await prisma.user.findUnique({ where: { email: DEMO_SELLER_EMAIL } });
      if (demo) sellerId = demo.id;
    } catch {
      // handled by getSellerDashboardData's own resilience fallback below
    }
  }

  const data = await getSellerDashboardData(sellerId ?? "unknown");
  const conversionRate = data.totalViews > 0 ? (data.ordersTotal / data.totalViews) * 100 : 0;
  const totalStatusOrders = data.orderStatusBreakdown.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Analytics</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">{data.storeName}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Revenue (30d)"
          value={fmt(data.revenueTotal)}
          icon={<Wallet size={16} />}
          changePct={data.revenueChangePct}
          sparkline={data.revenueSparkline}
        />
        <StatCard
          label="Total Views"
          value={data.totalViews.toLocaleString()}
          icon={<Eye size={16} />}
          iconBg="bg-org-accent/15 text-org-accent"
        />
        <StatCard
          label="Orders (30d)"
          value={String(data.ordersTotal)}
          icon={<ShoppingCart size={16} />}
          changePct={data.ordersChangePct}
        />
        <StatCard
          label="Store Rating"
          value={data.storeRating > 0 ? `${data.storeRating.toFixed(1)} / 5.0` : "No ratings yet"}
          icon={<Star size={16} />}
          iconBg="bg-org-warning/15 text-org-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RangeRevenueChart data={data.dailyRevenue} currency="KES" />
        </div>

        <ChartCard title="Orders by Status" subtitle="Last 6 months">
          {data.orderStatusBreakdown.length === 0 ? (
            <p className="text-org-sm text-org-text-secondary text-center py-8">No orders yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.orderStatusBreakdown
                .sort((a, b) => b.count - a.count)
                .map((s) => (
                  <div key={s.status}>
                    <div className="flex items-center justify-between text-org-sm mb-1">
                      <span className="text-org-text-secondary font-org-medium capitalize">{s.status.toLowerCase()}</span>
                      <span className="text-org-text-primary font-org-semibold">
                        {s.count} <span className="text-org-text-muted font-org-normal">({Math.round((s.count / totalStatusOrders) * 100)}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-org-surface-alt rounded-org-pill h-1.5">
                      <div
                        className={`h-1.5 rounded-org-pill ${STATUS_BAR_TONE[s.status] ?? "bg-org-text-muted"}`}
                        style={{ width: `${(s.count / totalStatusOrders) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Best Performing Products" subtitle={`Conversion rate: ${conversionRate.toFixed(1)}%`}>
        {data.topProducts.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No products yet.</p>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {data.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 bg-org-surface-alt rounded-org-sm px-3 py-2.5">
                  <span className="text-org-xs font-org-bold text-org-text-muted w-4 shrink-0">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-11 h-11 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-org-sm font-org-medium text-org-text-primary truncate">{p.name}</p>
                    <p className="text-org-xs text-org-text-secondary">{p.views.toLocaleString()} views &middot; {p.sales} sold</p>
                  </div>
                  <span className="text-org-sm font-org-semibold text-org-text-primary shrink-0">{fmt(p.sales * p.price)}</span>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto -mx-5">
              <table className="w-full text-org-sm min-w-125">
                <thead>
                  <tr className="text-org-xs text-org-text-muted uppercase tracking-wide border-b border-org-border">
                    <th className="px-5 pb-2.5 text-left font-org-medium">Product</th>
                    <th className="px-2 pb-2.5 text-right font-org-medium">Views</th>
                    <th className="px-2 pb-2.5 text-right font-org-medium">Sales</th>
                    <th className="px-5 pb-2.5 text-right font-org-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topProducts.map((p, i) => (
                    <tr key={p.id} className="border-b border-org-border last:border-0">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <span className="text-org-xs font-org-bold text-org-text-muted w-4 shrink-0">{i + 1}</span>
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                          <span className="font-org-medium text-org-text-primary max-w-[220px] truncate">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right text-org-text-secondary">{p.views.toLocaleString()}</td>
                      <td className="px-2 py-3 text-right text-org-text-secondary">{p.sales}</td>
                      <td className="px-5 py-3 text-right font-org-semibold text-org-text-primary">{fmt(p.sales * p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </ChartCard>
    </div>
  );
}
