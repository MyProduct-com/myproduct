"use client";

import { dashboardService } from "../services/dashboardService";
import type {
  AdminProfile,
  DashboardSessionUser,
  OverviewStatView,
  UseDashboardOptions,
  WelcomeBannerData,
} from "../types/adminProfile";

export interface UseDashboardResult {
  adminProfile: AdminProfile;
  welcomeBanner: WelcomeBannerData;
  overviewStats: OverviewStatView[];
}

/**
 * Super Admin dashboard hook. Components render values from here only —
 * no direct mock or repository imports in widgets.
 */
export function useDashboard(
  sessionUser?: DashboardSessionUser | null,
  options?: UseDashboardOptions
): UseDashboardResult {
  const adminProfile = dashboardService.peekAdminProfile(sessionUser ?? null);
  const welcomeBanner = dashboardService.peekWelcomeBanner(sessionUser ?? null);
  const overviewStats = dashboardService.peekOverviewStats(options);

  return { adminProfile, welcomeBanner, overviewStats };
}
