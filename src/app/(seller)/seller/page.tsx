import Link from "next/link";
import { getServerSession } from "next-auth";
import { Wallet, ShoppingCart, Package, Star, AlertTriangle, Eye, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeRevenueChart from "@/components/dashboard/RangeRevenueChart";
import StatusPill from "@/components/dashboard/StatusPill";
import { getSellerDashboardData } from "./data/getSellerDashboardData";

const DEMO_SELLER_EMAIL = "techhub@myproducts.co.ke";
const fmt = (n: number) => `KES ${n.toLocaleString()}`;

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);

  let sellerId = session?.user?.id;
  let sellerName = session?.user?.name ?? "Seller";
  if (!sellerId) {
    try {
      const demo = await prisma.user.findUnique({ where: { email: DEMO_SELLER_EMAIL } });
      if (demo) { sellerId = demo.id; sellerName = demo.name; }
    } catch {
      // handled by getSellerDashboardData's own resilience fallback below
    }
  }

  const data = await getSellerDashboardData(sellerId ?? "unknown");
  const firstName = sellerName.split(" ")[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Welcome back, {firstName}</h1>
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
          label="Orders (30d)"
          value={String(data.ordersTotal)}
          icon={<ShoppingCart size={16} />}
          changePct={data.ordersChangePct}
        />
        <StatCard
          label="Active Products"
          value={String(data.activeProducts)}
          icon={<Package size={16} />}
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

        <ChartCard title="Top Products" action={<Link href="/seller/products" className="text-org-xs font-org-medium text-org-primary hover:underline flex items-center gap-1">All <ArrowRight size={12} /></Link>}>
          {data.topProducts.length === 0 ? (
            <p className="text-org-sm text-org-text-secondary text-center py-8">No products yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span className="text-org-xs font-org-bold text-org-text-muted w-4 shrink-0">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-org-xs font-org-medium text-org-text-primary truncate">{p.name}</p>
                    <p className="text-org-xs text-org-text-secondary flex items-center gap-1.5">
                      <Eye size={11} /> {p.views.toLocaleString()} &middot; {p.sales} sold
                    </p>
                  </div>
                  <span className="text-org-xs font-org-semibold text-org-text-primary shrink-0">{fmt(p.price)}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Recent Orders" action={<Link href="/seller/orders" className="text-org-xs font-org-medium text-org-primary hover:underline flex items-center gap-1">View All <ArrowRight size={12} /></Link>}>
        {data.recentOrders.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-org-sm min-w-125">
              <thead>
                <tr className="text-org-xs text-org-text-muted uppercase tracking-wide border-b border-org-border">
                  <th className="px-5 pb-2.5 text-left font-org-medium">Order</th>
                  <th className="px-2 pb-2.5 text-left font-org-medium">Customer</th>
                  <th className="px-2 pb-2.5 text-left font-org-medium">Items</th>
                  <th className="px-2 pb-2.5 text-right font-org-medium">Amount</th>
                  <th className="px-5 pb-2.5 text-right font-org-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-org-border last:border-0">
                    <td className="px-5 py-3 font-org-semibold text-org-text-primary">{o.id.slice(0, 8)}</td>
                    <td className="px-2 py-3 text-org-text-secondary">{o.customerName}</td>
                    <td className="px-2 py-3 text-org-text-secondary">{o.itemCount} item{o.itemCount > 1 ? "s" : ""}</td>
                    <td className="px-2 py-3 text-right font-org-semibold text-org-text-primary">{fmt(o.total)}</td>
                    <td className="px-5 py-3 text-right"><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>

      {data.lowStockProducts.length > 0 && (
        <ChartCard title="Low Stock Alerts" className="border-l-4 border-org-warning">
          <div className="flex flex-col gap-2.5">
            {data.lowStockProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 bg-org-surface-alt rounded-org-sm px-3 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-org-sm font-org-medium text-org-text-primary truncate">{p.name}</p>
                    <p className="text-org-xs text-org-warning font-org-semibold flex items-center gap-1">
                      <AlertTriangle size={11} /> Only {p.stock} left
                    </p>
                  </div>
                </div>
                <Link href="/seller/products" className="text-org-xs text-org-primary hover:underline font-org-medium shrink-0">
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </ChartCard>
      )}
    </div>
  );
}
