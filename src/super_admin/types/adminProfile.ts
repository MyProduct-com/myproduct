/**
 * Super Admin dashboard domain models + view-models.
 */

export type AdminPrivilegeLevel = "full" | "partial";
export type AdminOnlineStatus = "online" | "offline" | "away";

/** Typed admin profile (Welcome Banner + future header fields). */
export interface AdminProfile {
  id: string;
  name: string;
  avatar: string | null;
  privilegeLevel: AdminPrivilegeLevel;
  role: string;
  lastLogin: string;
  onlineStatus: AdminOnlineStatus;
  email?: string;
}

export interface DashboardSessionUser {
  name: string;
  email: string;
  image: string | null;
}

/** Fields currently rendered by the Welcome Banner. */
export interface WelcomeBannerData {
  firstName: string;
  roleLabel: string;
  displayDate: string;
}

/** Numeric system overview snapshot (mock today, API later). */
export interface SystemOverviewStats {
  totalShops: number;
  subscribers: number;
  totalRevenue: number;
  totalOrders: number;
  abandonedCarts: number;
  pageViews: number;
  openTickets: number;
  suspendedShops: number;
}

export type OverviewStatId =
  | "totalShops"
  | "subscribers"
  | "totalRevenue"
  | "totalOrders"
  | "abandonedCarts"
  | "pageViews"
  | "openTickets"
  | "suspended";

/** Pre-formatted StatCard rows — component only renders these. */
export interface OverviewStatView {
  id: OverviewStatId;
  label: string;
  value: string;
  /** When set, passed through to StatCard `iconBg` unchanged. */
  iconBg?: string;
}

export interface UseDashboardOptions {
  /** Live open-ticket count from Issues module (localStorage today). */
  openTickets?: number;
}
