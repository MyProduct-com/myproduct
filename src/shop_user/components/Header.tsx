import type { User, Theme } from "../types/index.js";

interface HeaderProps {
  theme: Theme;
  user: User | null;
  cartCount: number;
  onCartOpen: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSignOut: () => void;
  onThemeEdit: () => void;
}

export default function Header({
  theme,
  user,
  cartCount,
  onCartOpen,
  onLoginClick,
  onSignupClick,
  onSignOut,
  onThemeEdit,
}: HeaderProps) {
  return (
    <header style={{ background: theme.primary, color: "#fff", padding: "0 20px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26 }}>{theme.logoEmoji}</span>
            <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-0.5px" }}>{theme.shopName}</span>
          </div>
          {user && <div style={{ fontSize: 11, opacity: 0.85, marginTop: -2 }}>Hello, {user.name} 👋</div>}
        </div>

        {/* Nav controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Cart */}
          <button
            onClick={onCartOpen}
            style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 }}
          >
            🛒
            {cartCount > 0 && (
              <span style={{ background: "#fff", color: theme.primary, fontWeight: 900, fontSize: 11, borderRadius: 20, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <button
              onClick={onSignOut}
              style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
            >
              Sign Out
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                style={{ background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 13 }}
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                style={{ background: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", color: theme.primary, cursor: "pointer", fontWeight: 800, fontSize: 13 }}
              >
                Sign Up
              </button>
            </>
          )}

          {/* Theme toggle */}
          <button
            onClick={onThemeEdit}
            title="Customise Theme"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 10px", color: "#fff", cursor: "pointer", fontSize: 16 }}
          >
            🎨
          </button>
        </div>
      </div>
    </header>
  );
}
