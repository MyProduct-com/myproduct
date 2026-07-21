import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, ShoppingBag, Package, Monitor,
  ClipboardList, Wallet, Users, Settings, Ticket,
} from "lucide-react";
import type { AdminView, AdminPrivilege, Theme } from "../../types/index";
import { SIDEBAR_WIDTH, HEADER_HEIGHT } from "../../data/theme";

interface NavItem {
  view: AdminView;
  label: string;
  icon: LucideIcon;
  privilege: AdminPrivilege | null;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { view: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, privilege: null },
  { view: "products",     label: "Products",     icon: ShoppingBag, privilege: "products" },
  { view: "orders",       label: "Orders",       icon: Package, privilege: "orders" },
  { view: "pos",          label: "Point of Sale",icon: Monitor, privilege: "pos" },
  { view: "inventory",    label: "Inventory",    icon: ClipboardList, privilege: "inventory" },
  { view: "accounting",   label: "Accounting",   icon: Wallet, privilege: "accounting" },
  { view: "staff",        label: "Staff",        icon: Users, privilege: "staff" },
  { view: "settings",     label: "Settings",     icon: Settings, privilege: "settings" },
  { view: "subscription", label: "Subscription", icon: Ticket, privilege: "subscription" },
];

interface SidebarProps {
  active: AdminView;
  privileges: AdminPrivilege[];
  isSuperAdmin: boolean;
  theme: Theme;
  pendingOrders: number;
  lowStockCount: number;
  onNavigate: (view: AdminView) => void;
}

export default function Sidebar({
  active, privileges, isSuperAdmin, theme, pendingOrders, lowStockCount, onNavigate,
}: SidebarProps) {
  const canAccess = (privilege: AdminPrivilege | null): boolean =>
    isSuperAdmin || privilege === null || privileges.includes(privilege);

  const getBadge = (view: AdminView): number | undefined => {
    if (view === "orders") return pendingOrders > 0 ? pendingOrders : undefined;
    if (view === "inventory") return lowStockCount > 0 ? lowStockCount : undefined;
    return undefined;
  };

  return (
    <aside style={{
      position: "fixed", top: HEADER_HEIGHT, left: 0,
      width: SIDEBAR_WIDTH, height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      background: theme.surface, borderRight: `1px solid ${theme.border}`,
      overflowY: "auto", zIndex: 100, display: "flex", flexDirection: "column",
      paddingTop: 12,
    }}>
      <nav style={{ flex: 1 }}>
        {NAV_ITEMS.map(item => {
          if (!canAccess(item.privilege)) return null;
          const isActive = active === item.view;
          const badge = getBadge(item.view);

          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "11px 20px", border: "none", cursor: "pointer",
                background: isActive ? theme.primaryLight : "transparent",
                color: isActive ? theme.primary : theme.text,
                fontWeight: isActive ? 700 : 500,
                fontSize: 14, textAlign: "left", position: "relative",
                borderLeft: isActive ? `3px solid ${theme.primary}` : "3px solid transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = theme.bg;
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ width: 22, display: "flex", justifyContent: "center" }}>
                <item.icon size={18} />
              </span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {badge !== undefined && (
                <span style={{
                  background: item.view === "inventory" ? "#f59e0b" : theme.primary,
                  color: "#fff", fontSize: 10, fontWeight: 800,
                  borderRadius: 20, padding: "1px 7px", minWidth: 20, textAlign: "center",
                }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom version tag */}
      <div style={{
        padding: "16px 20px", fontSize: 11, color: theme.textMuted,
        borderTop: `1px solid ${theme.border}`,
      }}>
        <div style={{ fontWeight: 600 }}>FreshMart Admin</div>
        <div>v1.0.0 · Kenya</div>
      </div>
    </aside>
  );
}
