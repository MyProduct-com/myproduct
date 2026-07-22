"use client";
import {
  Hand, Sparkles, CircleDot, Store, Users, Wallet, Package,
  ShoppingBag, Eye, Headphones, AlertTriangle,
  Rocket, Megaphone, Globe, Monitor,
} from "lucide-react";
import { getLogoIcon } from "@/lib/logoIcons";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DonutChart from "@/components/dashboard/DonutChart";
import TrafficPanel from "./TrafficPanel";
import type { SuperAdmin, SystemMetrics } from "../../types/index";
import type { ShopSummary } from "../../data/getDashboardData";
import { fmt, fmtDate } from "../../utils/helpers";

interface Props {
  admin: SuperAdmin;
  sessionUser: { name: string; email: string; image: string | null };
  metrics: SystemMetrics;
  shops: ShopSummary[];
  onNavigate: (v: string) => void;
}

export function SuperAdminDashboard({ admin, sessionUser, metrics, shops, onNavigate }: Props) {
  const firstName = sessionUser.name.split(" ")[0];

  const expiringShops = shops.filter((s) => {
    if (!s.expiresAt) return false;
    const days = Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000);
    return days <= 14 && days > 0 && s.status !== "pulled_down";
  });

  return (
    <div className="space-y-5">
      {/* Welcome banner */}
      <div
        className="rounded-org-sm p-4 sm:p-6 flex items-center gap-4 text-white"
        style={{ background: "linear-gradient(135deg, #1B3A2B 0%, #6B8F71 100%)" }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-org-md font-org-bold flex items-center gap-2">
            Welcome back, {firstName} <Hand size={18} />
          </div>
          <div className="text-org-sm opacity-75 mt-0.5">
            Super Admin &middot; {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* System overview */}
      <div>
        <h3 className="text-org-xs font-org-semibold text-org-text-muted uppercase tracking-wide mb-3">System Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Shops" value={String(metrics.totalShops)} icon={<Store size={16} />} />
          <StatCard label="Subscribers" value={metrics.totalSubscribers.toLocaleString()} icon={<Users size={16} />} />
          <StatCard label="Total Revenue" value={fmt(metrics.totalRevenue)} icon={<Wallet size={16} />} />
          <StatCard label="Total Orders" value={metrics.totalOrders.toLocaleString()} icon={<Package size={16} />} />
          <StatCard label="Abandoned Carts" value={metrics.abandonedCarts.toLocaleString()} icon={<ShoppingBag size={16} />} iconBg="bg-org-warning/15 text-org-warning" />
          <StatCard label="Page Views" value={metrics.totalPageViews.toLocaleString()} icon={<Eye size={16} />} />
          <StatCard label="Open Tickets" value={String(metrics.activeTickets)} icon={<Headphones size={16} />} iconBg={metrics.activeTickets > 0 ? "bg-org-danger-bg text-org-danger" : "bg-org-success-bg text-org-success"} />
          <StatCard label="Suspended" value={String(metrics.suspendedShops)} icon={<AlertTriangle size={16} />} iconBg="bg-org-danger-bg text-org-danger" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Package distribution */}
        <ChartCard title="Package Distribution">
          <DonutChart
            data={metrics.packageBreakdown.map((pkg) => ({ label: pkg.packageName, value: pkg.count, color: pkg.color }))}
          />
        </ChartCard>

        {/* Package utilisation */}
        <ChartCard title="Package Utilisation">
          <div className="flex flex-col gap-3">
            {shops.map((s) => {
              const pct = s.packageShopLimit > 0 ? Math.round((s.shopsCreated / s.packageShopLimit) * 100) : 0;
              const LogoIcon = getLogoIcon(s.logoIcon);
              return (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-org-xs mb-1">
                    <span className="flex items-center gap-1.5 font-org-medium text-org-text-primary">
                      <LogoIcon size={13} /> {s.name}
                    </span>
                    <span className="text-org-text-secondary">{s.shopsCreated}/{s.packageShopLimit} shops</span>
                  </div>
                  <div className="h-1.5 bg-org-primary-light rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct === 100 ? "bg-org-success" : pct >= 75 ? "bg-org-warning" : "bg-org-primary"}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Traffic — with 7D/30D/6M/12M/custom range selector */}
      <TrafficPanel shopVisits={metrics.shopVisits} />

      {/* Expiring subscriptions */}
      {expiringShops.length > 0 && (
        <ChartCard title="Subscriptions Expiring Soon" className="border-l-4 border-org-warning">
          <div className="flex flex-col gap-2.5">
            {expiringShops.map((s) => {
              const LogoIcon = getLogoIcon(s.logoIcon);
              const days = Math.ceil((new Date(s.expiresAt!).getTime() - Date.now()) / 86400000);
              return (
                <div key={s.id} className="flex items-center justify-between text-org-sm">
                  <span className="flex items-center gap-2 text-org-text-primary">
                    <LogoIcon size={14} /> <strong>{s.name}</strong>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className={`font-org-semibold flex items-center gap-1 ${days <= 3 ? "text-org-danger" : "text-org-warning"}`}>
                      <AlertTriangle size={12} /> {days}d left ({fmtDate(String(s.expiresAt))})
                    </span>
                    <button onClick={() => onNavigate("reminders")} className="text-org-xs text-org-primary hover:underline font-org-medium">
                      Send Reminder
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      )}

      {/* Quick actions */}
      <ChartCard title="Quick Actions">
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => onNavigate("onboarding")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold hover:bg-org-primary-hover transition-colors">
            <Rocket size={14} /> Onboard New User
          </button>
          <button onClick={() => onNavigate("issues")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Headphones size={14} /> View Support Tickets
          </button>
          <button onClick={() => onNavigate("reminders")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Megaphone size={14} /> Send Reminder
          </button>
          <button onClick={() => onNavigate("shops")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Store size={14} /> Manage Shops
          </button>
          <button onClick={() => onNavigate("marketplace")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Globe size={14} /> Marketplace
          </button>
          {admin.privilegeLevel === "full" && (
            <button onClick={() => onNavigate("dbterminal")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm bg-org-text-primary text-white text-org-sm font-org-semibold hover:opacity-90 transition-opacity">
              <Monitor size={14} /> DB Terminal
            </button>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
