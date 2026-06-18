import type { AdminUser, Shop, Theme } from "../../types/index";
import { HEADER_HEIGHT } from "../../data/theme";

interface AdminHeaderProps {
  admin: AdminUser;
  shop: Shop;
  theme: Theme;
  onSignOut: () => void;
}

export default function AdminHeader({ admin, shop, theme, onSignOut }: AdminHeaderProps) {
  const initials = admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, height: HEADER_HEIGHT,
      background: theme.primary, color: "#fff", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
    }}>
      {/* Left: Logo + Shop Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontSize: 28 }}>{shop.logoEmoji}</div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: "-0.4px", lineHeight: 1 }}>
            {shop.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.75, marginTop: 2 }}>
            Admin Dashboard · {shop.address}
          </div>
        </div>
        <div style={{
          marginLeft: 12, padding: "3px 10px", borderRadius: 20,
          background: "rgba(255,255,255,0.18)", fontSize: 11, fontWeight: 700,
          border: "1px solid rgba(255,255,255,0.3)",
        }}>
          🟢 Live
        </div>
      </div>

      {/* Right: Admin info */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Notification bell */}
        <button style={{
          background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8,
          width: 38, height: 38, cursor: "pointer", color: "#fff", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
        }}>
          🔔
          <span style={{
            position: "absolute", top: 6, right: 6, width: 8, height: 8,
            background: "#ef4444", borderRadius: "50%", border: "2px solid " + theme.primary,
          }} />
        </button>

        {/* Admin profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, border: "2px solid rgba(255,255,255,0.5)",
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1 }}>{admin.name}</div>
            <div style={{ fontSize: 10, opacity: 0.75, textTransform: "capitalize" }}>
              {admin.role === "superadmin" ? "Super Admin" : admin.role}
            </div>
          </div>
        </div>

        <button
          onClick={onSignOut}
          style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8, padding: "7px 14px", color: "#fff", cursor: "pointer",
            fontSize: 12, fontWeight: 600,
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
