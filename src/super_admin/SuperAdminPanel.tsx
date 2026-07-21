import React, { useState, useCallback } from "react";
import { Lock } from "lucide-react";
import { SA_THEME as T, SA_SIDEBAR_WIDTH, SA_HEADER_HEIGHT } from "./data/theme";
import type {
  SuperAdminView, SuperAdmin, ManagedShop, SystemPackage,
  SupportTicket, Reminder, MarketplaceItem, Toast,
} from "./types/index";
import {
  MOCK_SUPER_ADMIN, MOCK_SHOPS, MOCK_PACKAGES, MOCK_TICKETS,
  MOCK_REMINDERS, MOCK_MARKETPLACE_ITEMS, MOCK_METRICS, MOCK_SYSTEM_ADMINS,
} from "./data/mockData";

import { SuperAdminHeader } from "./components/layout/SuperAdminHeader";
import { SuperAdminSidebar } from "./components/layout/SuperAdminSidebar";
import { ToastContainer } from "./components/layout/UI";
import { SuperAdminDashboard } from "./components/dashboard/Dashboard";
import { ShopsModule } from "./components/shops/ShopsModule";
import { IsolationModule } from "./components/isolation/IsolationModule";
import { OnboardingModule } from "./components/onboarding/OnboardingModule";
import { PackagesModule } from "./components/packages/PackagesModule";
import { DBTerminalModule } from "./components/dbterminal/DBTerminalModule";
import { IssuesModule } from "./components/issues/IssuesModule";
import { RemindersModule } from "./components/reminders/RemindersModule";
import { MarketplaceModule } from "./components/marketplace/MarketplaceModule";
import { AdminsModule } from "./components/admins/AdminsModule";
import { genId } from "./utils/helpers";

export default function SuperAdminPanel() {
  // ── Layout state ──────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<SuperAdminView>("dashboard");

  // ── Data state ────────────────────────────────────────────────────────────
  const [currentAdmin, setCurrentAdmin] = useState<SuperAdmin>(MOCK_SUPER_ADMIN);
  const [shops, setShops] = useState<ManagedShop[]>(MOCK_SHOPS);
  const [packages, setPackages] = useState<SystemPackage[]>(MOCK_PACKAGES);
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(MOCK_MARKETPLACE_ITEMS);
  const [systemAdmins, setSystemAdmins] = useState<SuperAdmin[]>(MOCK_SYSTEM_ADMINS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Isolation preload ─────────────────────────────────────────────────────
  const [isolationPreload, setIsolationPreload] = useState<ManagedShop | null>(null);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: string = "info") => {
    const id = genId("toast");
    setToasts(prev => [...prev, { id, message, type: type as Toast["type"] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  // ── Navigation ────────────────────────────────────────────────────────────
  const navigate = (view: string) => {
    if (currentAdmin.privileges.includes(view as SuperAdminView)) {
      setActiveView(view as SuperAdminView);
    } else {
      addToast("You do not have permission to access that module.", "error");
    }
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

  const metrics = {
    ...MOCK_METRICS,
    totalShops: shops.length,
    activeShops: shops.filter(s => s.status === "active").length,
    suspendedShops: shops.filter(s => s.status === "suspended").length,
    activeTickets,
  };

  // ── Content area ──────────────────────────────────────────────────────────
  const mainLeft = sidebarOpen ? SA_SIDEBAR_WIDTH : 0;

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <SuperAdminDashboard
            admin={currentAdmin}
            metrics={metrics}
            shops={shops}
            onNavigate={navigate}
          />
        );
      case "shops":
        return (
          <ShopsModule
            shops={shops}
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
      default:
        return null;
    }
  };

  return (
    <div style={{ fontFamily: T.fontFamily, background: T.bg, minHeight: "100vh", color: T.text }}>
      {/* Sidebar */}
      <SuperAdminSidebar
        admin={currentAdmin}
        active={activeView}
        onNavigate={view => { navigate(view); if (view !== "isolation") setIsolationPreload(null); }}
        open={sidebarOpen}
        unreadTickets={unreadTickets}
      />

      {/* Header */}
      <SuperAdminHeader
        admin={currentAdmin}
        activeTickets={activeTickets}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
      />

      {/* Main content */}
      <main style={{
        marginLeft: mainLeft,
        marginTop: SA_HEADER_HEIGHT,
        padding: "28px 28px",
        minHeight: `calc(100vh - ${SA_HEADER_HEIGHT}px)`,
        transition: "margin-left .25s",
        maxWidth: 1400,
      }}>
        {renderView()}
      </main>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
