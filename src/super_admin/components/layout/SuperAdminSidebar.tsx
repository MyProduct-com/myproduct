import React from "react";
import { SA_THEME as T, SA_SIDEBAR_WIDTH, SA_HEADER_HEIGHT } from "../../data/theme";
import type { SuperAdminView, SuperAdmin } from "../../types/index";

const NAV_ITEMS: { id: SuperAdminView; label: string; icon: string; requireFull?: boolean; badge?: number }[] = [
  { id: "dashboard",   label: "Dashboard",       icon: "📊" },
  { id: "shops",       label: "Shops & Users",   icon: "🏪" },
  { id: "isolation",   label: "Isolation Lab",   icon: "🔬" },
  { id: "onboarding",  label: "Onboard User",    icon: "🚀" },
  { id: "packages",    label: "Packages",        icon: "📦" },
  { id: "dbterminal",  label: "DB Terminal",     icon: "🖥️", requireFull: true },
  { id: "issues",      label: "Support Issues",  icon: "🎧" },
  { id: "reminders",   label: "Reminders",       icon: "📣" },
  { id: "marketplace", label: "Marketplace",     icon: "🌐" },
  { id: "admins",      label: "System Admins",   icon: "🛡️", requireFull: true },
];

interface Props {
  admin: SuperAdmin;
  active: SuperAdminView;
  onNavigate: (v: SuperAdminView) => void;
  open: boolean;
  unreadTickets: number;
}

export function SuperAdminSidebar({ admin, active, onNavigate, open, unreadTickets }: Props) {
  if (!open) return null;

  const canAccess = (item: typeof NAV_ITEMS[0]) => {
    if (item.requireFull && admin.privilegeLevel !== "full") return false;
    return admin.privileges.includes(item.id);
  };

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0,
      width: SA_SIDEBAR_WIDTH, background: T.black,
      display: "flex", flexDirection: "column", zIndex: 300,
      borderRight: `1px solid rgba(255,255,255,.07)`,
    }}>
      {/* Logo block */}
      <div style={{
        height: SA_HEADER_HEIGHT, display: "flex", alignItems: "center",
        padding: "0 20px", gap: 12, borderBottom: "1px solid rgba(255,255,255,.08)",
        flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: "#fff", fontWeight: 900, flexShrink: 0,
        }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#fff" }}>MyProduct</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Super Admin</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
        {NAV_ITEMS.map(item => {
          const accessible = canAccess(item);
          const isActive = active === item.id;
          const badge = item.id === "issues" ? unreadTickets : undefined;

          return (
            <button
              key={item.id}
              onClick={() => accessible && onNavigate(item.id)}
              title={!accessible ? (item.requireFull ? "Requires full privilege" : "No access") : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 11, width: "100%",
                padding: "10px 12px", borderRadius: 8, border: "none",
                background: isActive ? `rgba(${T.primary === "#1e40af" ? "30,64,175" : "30,64,175"},.25)` : "transparent",
                color: !accessible ? "rgba(255,255,255,.25)" : isActive ? "#fff" : "rgba(255,255,255,.7)",
                fontWeight: isActive ? 700 : 500, fontSize: 13, cursor: accessible ? "pointer" : "not-allowed",
                transition: "all .15s", marginBottom: 2, textAlign: "left", fontFamily: T.fontFamily,
                borderLeft: isActive ? `3px solid ${T.primary}` : "3px solid transparent",
              }}
              onMouseEnter={e => { if (accessible && !isActive) e.currentTarget.style.background = "rgba(255,255,255,.06)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.requireFull && admin.privilegeLevel !== "full" && (
                <span style={{ fontSize: 10, color: "rgba(255,255,255,.25)" }}>🔒</span>
              )}
              {badge !== undefined && badge > 0 && (
                <span style={{ background: T.danger, color: "#fff", fontSize: 10, fontWeight: 900, padding: "1px 6px", borderRadius: 999 }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom admin info */}
      <div style={{
        padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,.08)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 12, flexShrink: 0,
        }}>
          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin.name}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.4)" }}>{admin.privilegeLevel === "full" ? "Full Privilege" : "Partial"}</div>
        </div>
      </div>
    </aside>
  );
}
