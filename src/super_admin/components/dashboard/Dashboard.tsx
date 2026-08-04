"use client";
import {
  Hand, Store, Users, Wallet, Package,
  ShoppingBag, Eye, Headphones, AlertTriangle,
  Rocket, Megaphone, Globe, Monitor,
  type LucideIcon,
} from "lucide-react";
import { getLogoIcon } from "@/lib/logoIcons";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DonutChart from "@/components/dashboard/DonutChart";
import TrafficPanel from "./TrafficPanel";
import { useDashboard } from "../../hooks/useDashboard";
import type { OverviewStatId } from "../../types/adminProfile";
import type { SuperAdmin, SystemMetrics } from "../../types/index";
import type { ShopSummary } from "../../data/getDashboardData";
import { fmtDate } from "../../utils/helpers";

interface Props {
  admin: SuperAdmin;
  sessionUser: { name: string; email: string; image: string | null };
  metrics: SystemMetrics;
  shops: ShopSummary[];
  onNavigate: (v: string) => void;
  /** Navigates and confirms with a toast — used by Quick Actions / Send Reminder. */
  onNavigateWithToast?: (view: string, label: string) => void;
}

const OVERVIEW_ICONS: Record<OverviewStatId, LucideIcon> = {
  totalShops: Store,
  subscribers: Users,
  totalRevenue: Wallet,
  totalOrders: Package,
  abandonedCarts: ShoppingBag,
  pageViews: Eye,
  openTickets: Headphones,
  suspended: AlertTriangle,
};

export function SuperAdminDashboard({
  admin,
  sessionUser,
  metrics,
  shops,
  onNavigate,
  onNavigateWithToast,
}: Props) {
  const { welcomeBanner, overviewStats } = useDashboard(sessionUser, {
    openTickets: metrics.activeTickets,
  });

  const go = (view: string, label: string) => {
    if (onNavigateWithToast) onNavigateWithToast(view, label);
    else onNavigate(view);
  };

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
            Welcome back, {welcomeBanner.firstName} <Hand size={18} />
          </div>
          <div className="text-org-sm opacity-75 mt-0.5">
            {welcomeBanner.roleLabel} &middot; {welcomeBanner.displayDate}
          </div>
        </div>
      </div>

      {/* System overview */}
      <div>
        <h3 className="text-org-xs font-org-semibold text-org-text-muted uppercase tracking-wide mb-3">System Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {overviewStats.map((stat) => {
            const Icon = OVERVIEW_ICONS[stat.id];
            return (
              <StatCard
                key={stat.id}
                label={stat.label}
                value={stat.value}
                icon={<Icon size={16} />}
                iconBg={stat.iconBg}
              />
            );
          })}
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
                    <button
                      type="button"
                      onClick={() => go("reminders", `Reminders for ${s.name}`)}
                      className="text-org-xs text-org-primary hover:underline font-org-medium"
                    >
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
          <button type="button" onClick={() => go("onboarding", "Onboard New User")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold hover:bg-org-primary-hover transition-colors">
            <Rocket size={14} /> Onboard New User
          </button>
          <button type="button" onClick={() => go("issues", "Support Tickets")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Headphones size={14} /> View Support Tickets
          </button>
          <button type="button" onClick={() => go("reminders", "Reminders")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Megaphone size={14} /> Send Reminder
          </button>
          <button type="button" onClick={() => go("shops", "Shops & Users")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Store size={14} /> Manage Shops
          </button>
          <button type="button" onClick={() => go("marketplace", "Marketplace")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-primary hover:bg-org-surface-alt transition-colors">
            <Globe size={14} /> Marketplace
          </button>
          {admin.privilegeLevel === "full" && (
            <button type="button" onClick={() => go("dbterminal", "DB Terminal")} className="flex items-center gap-2 px-4 py-2 rounded-org-sm bg-org-text-primary text-white text-org-sm font-org-semibold hover:opacity-90 transition-opacity">
              <Monitor size={14} /> DB Terminal
            </button>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
