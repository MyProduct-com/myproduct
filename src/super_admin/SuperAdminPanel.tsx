"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { getUiPrefs, applyThemeToDocument, DEFAULT_UI_PREFS } from "@/lib/uiPrefs";
import { usePersistedState } from "@/lib/usePersistedState";
import { SA_THEME as T } from "./data/theme";
import type {
  SuperAdminView, SuperAdminPrivilege, SuperAdmin, ManagedShop, SystemPackage,
  SupportTicket, Reminder, MarketplaceItem, Toast, SystemMetrics,
} from "./types/index";
import {
  MOCK_SUPER_ADMIN, MOCK_SHOPS, MOCK_PACKAGES, MOCK_TICKETS,
  MOCK_REMINDERS, MOCK_MARKETPLACE_ITEMS, MOCK_SYSTEM_ADMINS, MOCK_METRICS,
} from "./data/mockData";

import DashboardShell, { type ShellItem, type ShellNotification } from "@/components/dashboard/DashboardShell";
import {
  LayoutDashboard, Store, FlaskConical, Rocket, Package,
  Monitor, Headphones, Megaphone, Globe, Shield,
} from "lucide-react";
import { ToastContainer } from "./components/layout/UI";
import { SuperAdminDashboard } from "./components/dashboard/Dashboard";
import type { SuperAdminDashboardData } from "./data/getDashboardData";
import { ShopsModule } from "./components/shops/ShopsModule";
import { IsolationModule } from "./components/isolation/IsolationModule";
import { OnboardingModule } from "./components/onboarding/OnboardingModule";
import { PackagesModule } from "./components/packages/PackagesModule";
import { DBTerminalModule } from "./components/dbterminal/DBTerminalModule";
import { IssuesModule } from "./components/issues/IssuesModule";
import { RemindersModule } from "./components/reminders/RemindersModule";
import { MarketplaceModule } from "./components/marketplace/MarketplaceModule";
import { AdminsModule } from "./components/admins/AdminsModule";
import { SettingsModule } from "./components/settings/SettingsModule";
import { genId } from "./utils/helpers";

interface SuperAdminPanelProps {
  sessionUser: { name: string; email: string; image: string | null };
  dashboardData: SuperAdminDashboardData;
}

const NAV_ITEMS: { id: SuperAdminView; label: string; icon: typeof LayoutDashboard; requireFull?: boolean }[] = [
  { id: "dashboard",   label: "Dashboard",       icon: LayoutDashboard },
  { id: "shops",       label: "Shops & Users",   icon: Store },
  { id: "isolation",   label: "Isolation Lab",   icon: FlaskConical },
  { id: "onboarding",  label: "Onboard User",    icon: Rocket },
  { id: "packages",    label: "Packages",        icon: Package },
  { id: "dbterminal",  label: "DB Terminal",     icon: Monitor, requireFull: true },
  { id: "issues",      label: "Support Issues",  icon: Headphones },
  { id: "reminders",   label: "Reminders",       icon: Megaphone },
  { id: "marketplace", label: "Marketplace",     icon: Globe },
  { id: "admins",      label: "System Admins",   icon: Shield, requireFull: true },
];

export default function SuperAdminPanel({ sessionUser, dashboardData }: SuperAdminPanelProps) {
  // ── Layout state ──────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<SuperAdminView>("dashboard");

  // ── Data state ────────────────────────────────────────────────────────────
  const [currentAdmin, setCurrentAdmin] = useState<SuperAdmin>({
    ...MOCK_SUPER_ADMIN,
    name: sessionUser.name,
    email: sessionUser.email || MOCK_SUPER_ADMIN.email,
  });
  // Persisted to localStorage (not a real backend yet) so admin actions
  // survive a page refresh instead of resetting to the mock starting state.
  const [shops, setShops] = usePersistedState<ManagedShop[]>("sa-shops", MOCK_SHOPS);
  const [packages, setPackages] = usePersistedState<SystemPackage[]>("sa-packages", MOCK_PACKAGES);
  const [tickets, setTickets] = usePersistedState<SupportTicket[]>("sa-tickets", MOCK_TICKETS);
  const [reminders, setReminders] = usePersistedState<Reminder[]>("sa-reminders", MOCK_REMINDERS);
  const [marketplaceItems, setMarketplaceItems] = usePersistedState<MarketplaceItem[]>("sa-marketplace-items", MOCK_MARKETPLACE_ITEMS);
  const [systemAdmins, setSystemAdmins] = usePersistedState<SuperAdmin[]>("sa-system-admins", MOCK_SYSTEM_ADMINS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Isolation preload ─────────────────────────────────────────────────────
  const [isolationPreload, setIsolationPreload] = useState<ManagedShop | null>(null);

  // ── Header search/filter (targets Shops & Users) ─────────────────────────
  const [shopSearchQuery, setShopSearchQuery] = useState("");
  const [shopStatusFilter, setShopStatusFilter] = useState("all");
  const [shopsQueryToken, setShopsQueryToken] = useState(0);

  // ── Dismissed notifications (array, not Set — Sets aren't JSON-serializable) ─
  const [dismissedNotifIds, setDismissedNotifIds] = usePersistedState<string[]>("sa-dismissed-notifs", []);

  // ── UI preferences (theme, notification categories) ──────────────────────
  // Starts at the SSR-safe default (not read from localStorage) so the server
  // render and the client's first render agree; the real stored value is
  // synced in after mount, avoiding a hydration mismatch.
  const [uiPrefs, setLocalUiPrefs] = useState(DEFAULT_UI_PREFS);
  const [prefsLoaded, setPrefsLoaded] = useState(false);
  useEffect(() => {
    setLocalUiPrefs(getUiPrefs());
    setPrefsLoaded(true);
  }, []);
  useEffect(() => {
    if (prefsLoaded) applyThemeToDocument(uiPrefs.themeId);
  }, [uiPrefs.themeId, prefsLoaded]);
  useEffect(() => {
    const onChange = (e: Event) => setLocalUiPrefs((e as CustomEvent).detail);
    window.addEventListener("uiprefs:change", onChange);
    return () => window.removeEventListener("uiprefs:change", onChange);
  }, []);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: string = "info") => {
    const id = genId("toast");
    setToasts(prev => [...prev, { id, message, type: type as Toast["type"] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = (view: string): boolean => {
    // Settings is always reachable — it's account-level, not a privileged module.
    if (view === "settings" || currentAdmin.privileges.includes(view as SuperAdminPrivilege)) {
      setActiveView(view as SuperAdminView);
      // Scroll the shell content so Quick Actions / Send Reminder feel responsive.
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[data-dashboard-main]")?.scrollTo({ top: 0, behavior: "smooth" });
      });
      return true;
    }
    addToast("You do not have permission to access that module.", "error");
    return false;
  };

  const navigateWithToast = (view: string, label: string) => {
    if (navigate(view)) addToast(`Opened ${label}.`, "success");
  };

  const navigateToIsolation = (shop: ManagedShop) => {
    setIsolationPreload(shop);
    navigate("isolation");
  };

  // ── Data handlers ─────────────────────────────────────────────────────────
  const updateShop = (id: string, updates: Partial<ManagedShop>) =>
    setShops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

  const savePackage = (pkg: SystemPackage) =>
    setPackages(prev => prev.some(p => p.id === pkg.id)
      ? prev.map(p => p.id === pkg.id ? pkg : p)
      : [...prev, pkg]);

  const togglePackageActive = (id: string) =>
    setPackages(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));

  const updateTicket = (id: string, updates: Partial<SupportTicket>) =>
    setTickets(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

  const addReminder = (reminder: Reminder) =>
    setReminders(prev => [reminder, ...prev]);

  const updateMarketplaceItem = (id: string, updates: Partial<MarketplaceItem>) =>
    setMarketplaceItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));

  const saveAdmin = (admin: SuperAdmin) =>
    setSystemAdmins(prev => prev.some(a => a.id === admin.id)
      ? prev.map(a => a.id === admin.id ? admin : a)
      : [...prev, admin]);

  const removeAdmin = (id: string) =>
    setSystemAdmins(prev => prev.filter(a => a.id !== id));

  // ── Computed ──────────────────────────────────────────────────────────────
  const unreadTickets = tickets.filter(t =>
    ["open", "in_progress"].includes(t.status) &&
    t.messages.some(m => !m.read && m.senderRole !== "super_admin")
  ).length;

  const activeTickets = tickets.filter(t => ["open", "in_progress"].includes(t.status)).length;

  // Real numbers (shops/users/revenue) merged with MOCK_METRICS for the
  // fields that don't have a backing table yet (orders, cart abandonment,
  // page views, traffic) — see getDashboardData.ts.
  const metrics: SystemMetrics = {
    ...MOCK_METRICS,
    totalShops: dashboardData.totalShops,
    activeShops: dashboardData.activeShops,
    suspendedShops: dashboardData.suspendedShops,
    totalSubscribers: dashboardData.totalUsers,
    totalRevenue: dashboardData.platformRevenue,
    monthlyRevenue: dashboardData.platformRevenueThisMonth,
    packageBreakdown: dashboardData.packageBreakdown,
    activeTickets,
  };

  // ── Content area ──────────────────────────────────────────────────────────
  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <SuperAdminDashboard
            admin={currentAdmin}
            sessionUser={sessionUser}
            metrics={metrics}
            shops={dashboardData.shops}
            onNavigate={navigate}
            onNavigateWithToast={navigateWithToast}
          />
        );
      case "shops":
        return (
          <ShopsModule
            key={shopsQueryToken}
            shops={shops}
            initialSearch={shopSearchQuery}
            initialStatus={shopStatusFilter}
            onUpdateShop={updateShop}
            onNavigateIsolation={navigateToIsolation}
            onNavigateOnboarding={() => navigate("onboarding")}
            addToast={addToast}
          />
        );
      case "isolation":
        return (
          <IsolationModule
            shops={shops}
            preloadShop={isolationPreload}
            addToast={addToast}
          />
        );
      case "onboarding":
        return (
          <OnboardingModule
            packages={packages}
            onLaunch={(shop) => setShops((prev) => [shop, ...prev])}
            addToast={addToast}
          />
        );
      case "packages":
        return (
          <PackagesModule
            packages={packages}
            onSave={savePackage}
            onToggleActive={togglePackageActive}
            addToast={addToast}
          />
        );
      case "dbterminal":
        if (currentAdmin.privilegeLevel !== "full") {
          return (
            <div style={{ textAlign: "center", padding: "80px 24px", color: T.textMuted }}>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Lock size={52} /></div>
              <h2 style={{ color: T.text, marginBottom: 8 }}>Full Privilege Required</h2>
              <p>The DB Terminal is only available to admins with Full Privilege status.</p>
            </div>
          );
        }
        return <DBTerminalModule addToast={addToast} />;
      case "issues":
        return (
          <IssuesModule
            tickets={tickets}
            onUpdateTicket={updateTicket}
            adminName={currentAdmin.name}
            adminId={currentAdmin.id}
            addToast={addToast}
          />
        );
      case "reminders":
        return (
          <RemindersModule
            reminders={reminders}
            shops={shops}
            packages={packages}
            adminName={currentAdmin.name}
            onSend={addReminder}
            addToast={addToast}
          />
        );
      case "marketplace":
        return (
          <MarketplaceModule
            items={marketplaceItems}
            onUpdateItem={updateMarketplaceItem}
            adminName={currentAdmin.name}
            adminId={currentAdmin.id}
            addToast={addToast}
          />
        );
      case "admins":
        if (currentAdmin.privilegeLevel !== "full") {
          return (
            <div style={{ textAlign: "center", padding: "80px 24px", color: T.textMuted }}>
              <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Lock size={52} /></div>
              <h2 style={{ color: T.text, marginBottom: 8 }}>Full Privilege Required</h2>
              <p>Managing system admins requires Full Privilege status.</p>
            </div>
          );
        }
        return (
          <AdminsModule
            admins={systemAdmins}
            currentAdminId={currentAdmin.id}
            onSave={saveAdmin}
            onRemove={removeAdmin}
            addToast={addToast}
          />
        );
      case "settings":
        return (
          <SettingsModule
            currentName={currentAdmin.name}
            currentEmail={currentAdmin.email}
            onNameSaved={(name) => setCurrentAdmin((prev) => ({ ...prev, name }))}
            addToast={addToast}
          />
        );
      default:
        return null;
    }
  };

  const goTo = (view: SuperAdminView) => {
    navigate(view);
    if (view !== "isolation") setIsolationPreload(null);
  };

  // ── Header search / filter → Shops & Users ───────────────────────────────
  const runShopSearch = (query: string) => {
    setShopSearchQuery(query);
    setShopStatusFilter("all");
    setShopsQueryToken((t) => t + 1);
    goTo("shops");
  };

  const runShopStatusFilter = (status: string) => {
    setShopStatusFilter(status);
    setShopSearchQuery("");
    setShopsQueryToken((t) => t + 1);
    goTo("shops");
  };

  // ── Notifications (derived from real in-app state, filtered by preference) ─
  const allNotifications: ShellNotification[] = [
    ...(uiPrefs.notifications.expiring
      ? shops
          .filter((s) => {
            const days = Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000);
            return days <= 14 && days > 0 && s.status !== "pulled_down";
          })
          .map((s) => ({
            id: `expiring-${s.id}`,
            title: `${s.name} subscription expiring soon`,
            message: `Renews in ${Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000)} day(s)`,
            tone: "warning" as const,
          }))
      : []),
    ...(uiPrefs.notifications.tickets && unreadTickets > 0
      ? [{ id: "unread-tickets", title: `${unreadTickets} unread support ticket${unreadTickets > 1 ? "s" : ""}`, message: "Waiting on a super admin reply", tone: "danger" as const }]
      : []),
    ...(uiPrefs.notifications.suspended
      ? shops
          .filter((s) => s.status === "suspended")
          .map((s) => ({ id: `suspended-${s.id}`, title: `${s.name} is suspended`, message: "Review and reactivate if resolved", tone: "info" as const }))
      : []),
  ];
  const notifications = allNotifications.filter((n) => !dismissedNotifIds.includes(n.id));
  const clearNotifications = () => setDismissedNotifIds((prev) => Array.from(new Set([...prev, ...allNotifications.map((n) => n.id)])));

  const shellItems: ShellItem[] = NAV_ITEMS.map((item) => ({
    key: item.id,
    label: item.requireFull && currentAdmin.privilegeLevel !== "full" ? `${item.label} (requires full privilege)` : item.label,
    icon: item.icon,
    active: activeView === item.id,
    onClick: () => goTo(item.id),
    badge: item.id === "issues" ? unreadTickets : undefined,
  }));

  return (
    <>
      <DashboardShell
        brand={{ name: "MyProduct", icon: ShieldCheck }}
        railItems={shellItems}
        navItems={[]}
        user={{ name: currentAdmin.name, email: sessionUser.email, avatarUrl: sessionUser.image }}
        searchPlaceholder="Search shops, owners, emails…"
        onSearch={runShopSearch}
        filterOptions={[
          { label: "All Shops", value: "all" },
          { label: "Active", value: "active" },
          { label: "Trial", value: "trial" },
          { label: "Suspended", value: "suspended" },
          { label: "Pulled Down", value: "pulled_down" },
        ]}
        onFilterSelect={runShopStatusFilter}
        notifications={notifications}
        onClearNotifications={clearNotifications}
        onSettingsClick={() => goTo("settings")}
        defaultRailExpanded={uiPrefs.sidebarDefaultExpanded}
      >
        {renderView()}
      </DashboardShell>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
