import React from "react";
import { SA_THEME as T, SA_HEADER_HEIGHT, SA_SIDEBAR_WIDTH } from "../../data/theme";
import type { SuperAdmin } from "../../types/index";
import { Badge } from "./UI";
import { statusColor } from "../../utils/helpers";

interface Props {
  admin: SuperAdmin;
  activeTickets: number;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function SuperAdminHeader({ admin, activeTickets, sidebarOpen, onToggleSidebar }: Props) {
  const pc = statusColor(admin.privilegeLevel);

  return (
    <header style={{
      position: "fixed", top: 0, left: sidebarOpen ? SA_SIDEBAR_WIDTH : 0,
      right: 0, height: SA_HEADER_HEIGHT, background: T.surface,
      borderBottom: `1px solid ${T.border}`, zIndex: 200,
      display: "flex", alignItems: "center", padding: "0 24px",
      gap: 14, transition: "left .25s", boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    }}>
      {/* Hamburger */}
      <button onClick={onToggleSidebar} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: T.textMuted, lineHeight: 1, padding: 4 }}>☰</button>

      {/* System logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 900,
        }}>S</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>System Control</div>
          <div style={{ fontSize: 11, color: T.textMuted, lineHeight: 1.2 }}>Super Admin Portal</div>
        </div>
      </div>

      {/* Active tickets bell */}
      {activeTickets > 0 && (
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>🔔</span>
          <span style={{
            position: "absolute", top: -4, right: -6,
            background: T.danger, color: "#fff", fontSize: 10, fontWeight: 900,
            width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
          }}>{activeTickets}</span>
        </div>
      )}

      {/* Admin info */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12, paddingLeft: 14,
        borderLeft: `1px solid ${T.border}`,
      }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{admin.name}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Badge label={admin.privilegeLevel === "full" ? "Full Privilege" : "Partial Privilege"} bg={pc.bg} color={pc.text} />
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: 15,
        }}>
          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
