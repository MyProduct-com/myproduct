import { MOCK_METRICS, MOCK_SUPER_ADMIN } from "../data/mockData";
import type {
  AdminOnlineStatus,
  AdminProfile,
  DashboardSessionUser,
  SystemOverviewStats,
  UseDashboardOptions,
} from "../types/adminProfile";

const DEFAULT_ROLE_LABEL = "Super Admin";
const DEFAULT_ONLINE_STATUS: AdminOnlineStatus = "online";

/**
 * Dashboard data access. All mock imports stay here so UI/services never
 * touch mock constants directly. Replace method bodies with API/Prisma later.
 */
export const dashboardRepository = {
  getAdminProfile(session?: DashboardSessionUser | null): AdminProfile {
    const base = MOCK_SUPER_ADMIN;
    const name = session?.name?.trim() || base.name;
    const email = session?.email?.trim() || base.email;
    const avatar =
      session?.image !== undefined && session?.image !== null
        ? session.image
        : (base.avatar ?? null);

    return {
      id: base.id,
      name,
      avatar,
      privilegeLevel: base.privilegeLevel,
      role: DEFAULT_ROLE_LABEL,
      lastLogin: base.lastLogin,
      onlineStatus: DEFAULT_ONLINE_STATUS,
      email,
    };
  },

  /**
   * System Overview KPI source. Uses mock metrics so the dashboard works
   * without a connected backend. Optional `openTickets` overlays the live
   * Issues-module count when provided.
   */
  getSystemOverview(options?: UseDashboardOptions): SystemOverviewStats {
    return {
      totalShops: MOCK_METRICS.totalShops,
      subscribers: MOCK_METRICS.totalSubscribers,
      totalRevenue: MOCK_METRICS.totalRevenue,
      totalOrders: MOCK_METRICS.totalOrders,
      abandonedCarts: MOCK_METRICS.abandonedCarts,
      pageViews: MOCK_METRICS.totalPageViews,
      openTickets:
        typeof options?.openTickets === "number"
          ? options.openTickets
          : MOCK_METRICS.activeTickets,
      suspendedShops: MOCK_METRICS.suspendedShops,
    };
  },
};
