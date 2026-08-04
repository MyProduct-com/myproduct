import { fmt } from "../utils/helpers";
import { dashboardRepository } from "../repositories/dashboardRepository";
import type {
  AdminProfile,
  DashboardSessionUser,
  OverviewStatView,
  SystemOverviewStats,
  UseDashboardOptions,
  WelcomeBannerData,
} from "../types/adminProfile";

function formatWelcomeDisplayDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function toWelcomeBannerData(profile: AdminProfile): WelcomeBannerData {
  const firstName = profile.name.trim().split(/\s+/)[0] || profile.name;
  return {
    firstName,
    roleLabel: profile.role,
    displayDate: formatWelcomeDisplayDate(),
  };
}

/** Same visual rules as the previous inline JSX for open-tickets / suspended cards. */
function toOverviewStatViews(stats: SystemOverviewStats): OverviewStatView[] {
  return [
    {
      id: "totalShops",
      label: "Total Shops",
      value: String(stats.totalShops),
    },
    {
      id: "subscribers",
      label: "Subscribers",
      value: stats.subscribers.toLocaleString(),
    },
    {
      id: "totalRevenue",
      label: "Total Revenue",
      value: fmt(stats.totalRevenue),
    },
    {
      id: "totalOrders",
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
    },
    {
      id: "abandonedCarts",
      label: "Abandoned Carts",
      value: stats.abandonedCarts.toLocaleString(),
      iconBg: "bg-org-warning/15 text-org-warning",
    },
    {
      id: "pageViews",
      label: "Page Views",
      value: stats.pageViews.toLocaleString(),
    },
    {
      id: "openTickets",
      label: "Open Tickets",
      value: String(stats.openTickets),
      iconBg:
        stats.openTickets > 0
          ? "bg-org-danger-bg text-org-danger"
          : "bg-org-success-bg text-org-success",
    },
    {
      id: "suspended",
      label: "Suspended",
      value: String(stats.suspendedShops),
      iconBg: "bg-org-danger-bg text-org-danger",
    },
  ];
}

/**
 * Dashboard application service. Maps repository data into view-models.
 */
export const dashboardService = {
  peekAdminProfile(session?: DashboardSessionUser | null): AdminProfile {
    return dashboardRepository.getAdminProfile(session);
  },

  async getAdminProfile(
    session?: DashboardSessionUser | null
  ): Promise<AdminProfile> {
    return dashboardRepository.getAdminProfile(session);
  },

  peekWelcomeBanner(session?: DashboardSessionUser | null): WelcomeBannerData {
    return toWelcomeBannerData(this.peekAdminProfile(session));
  },

  async getWelcomeBanner(
    session?: DashboardSessionUser | null
  ): Promise<WelcomeBannerData> {
    const profile = await this.getAdminProfile(session);
    return toWelcomeBannerData(profile);
  },

  peekSystemOverview(options?: UseDashboardOptions): SystemOverviewStats {
    return dashboardRepository.getSystemOverview(options);
  },

  async getSystemOverview(
    options?: UseDashboardOptions
  ): Promise<SystemOverviewStats> {
    return dashboardRepository.getSystemOverview(options);
  },

  peekOverviewStats(options?: UseDashboardOptions): OverviewStatView[] {
    return toOverviewStatViews(this.peekSystemOverview(options));
  },

  async getOverviewStats(
    options?: UseDashboardOptions
  ): Promise<OverviewStatView[]> {
    const stats = await this.getSystemOverview(options);
    return toOverviewStatViews(stats);
  },
};
