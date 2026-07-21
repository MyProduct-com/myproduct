import { Camera, MessageCircle } from "lucide-react";
import type { Theme } from "../types/index.js";
import { getLogoIcon } from "@/lib/logoIcons";

interface FooterProps {
  theme: Theme;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onCartOpen: () => void;
}

const LINK_GROUPS = [
  {
    heading: "Shop",
    items: [
      { text: "All Products", action: undefined },
      { text: "Fresh Produce", action: undefined },
      { text: "Dairy & Eggs", action: undefined },
      { text: "Pantry Staples", action: undefined },
    ],
  },
  {
    heading: "Account",
    items: [
      { text: "Log In", action: "login" },
      { text: "Sign Up", action: "signup" },
      { text: "Cart", action: "cart" },
    ],
  },
  {
    heading: "Help",
    items: [
      { text: "Delivery Info", action: undefined },
      { text: "Returns & Refunds", action: undefined },
      { text: "Contact Us", action: undefined },
      { text: "FAQs", action: undefined },
    ],
  },
];

const SOCIALS = [
  { label: "Twitter / X", char: "𝕏" },
  { label: "Instagram", icon: Camera },
  { label: "WhatsApp", icon: MessageCircle },
];

export default function Footer({ theme, onLoginClick, onSignupClick, onCartOpen }: FooterProps) {
  const LogoIcon = getLogoIcon(theme.logoIcon);

  const handleAction = (action?: string): void => {
    if (action === "login") onLoginClick();
    else if (action === "signup") onSignupClick();
    else if (action === "cart") onCartOpen();
  };

  return (
    <footer style={{ background: theme.primary, color: "#fff", fontFamily: theme.fontFamily, marginTop: 64 }}>
      {/* Main grid */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "48px 24px 36px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 32,
        }}
      >
        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <LogoIcon size={30} />
            <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px" }}>{theme.shopName}</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.8, margin: "0 0 20px", maxWidth: 200 }}>
            {theme.shopTagline || "Fresh groceries delivered straight to your door."}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            {SOCIALS.map(s => (
              <button
                key={s.label}
                title={s.label}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "none",
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: 15,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
              >
                {s.icon ? <s.icon size={16} /> : s.char}
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {LINK_GROUPS.map(group => (
          <div key={group.heading}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.6, marginBottom: 14 }}>
              {group.heading}
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {group.items.map(item => (
                <li key={item.text} style={{ marginBottom: 10 }}>
                  <button
                    onClick={() => handleAction(item.action)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "#fff",
                      fontSize: 14,
                      opacity: 0.82,
                      cursor: "pointer",
                      fontFamily: theme.fontFamily,
                      textAlign: "left",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.82")}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.18)" }} />

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.6 }}>
          © {new Date().getFullYear()} {theme.shopName}. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(t => (
            <button
              key={t}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 12,
                opacity: 0.6,
                cursor: "pointer",
                fontFamily: theme.fontFamily,
                padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}