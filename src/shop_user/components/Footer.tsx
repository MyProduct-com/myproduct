import { ExternalLink } from "lucide-react";
import type { Theme } from "../types/index.js";
import type { FooterSocial } from "@/store/storefrontContentStore";
import { getLogoIcon } from "@/lib/logoIcons";

interface FooterProps {
  theme: Theme;
  socials: FooterSocial[];
  footerBg: string;
  footerText: string;
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

export default function Footer({ theme, socials, footerBg, footerText, onLoginClick, onSignupClick, onCartOpen }: FooterProps) {
  const LogoIcon = getLogoIcon(theme.logoIcon);
  const bg = footerBg || theme.primary;
  const fg = footerText || "#ffffff";

  const handleAction = (action?: string): void => {
    if (action === "login") onLoginClick();
    else if (action === "signup") onSignupClick();
    else if (action === "cart") onCartOpen();
  };

  return (
    <footer className="mt-16" style={{ background: bg, color: fg, fontFamily: theme.fontFamily }}>
      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 sm:gap-10">

        {/* Brand column */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <LogoIcon className="w-7 h-7 shrink-0" />
            <span className="font-black text-xl tracking-tight">{theme.shopName}</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80 mb-5 max-w-xs">
            {theme.shopTagline || "Fresh groceries delivered straight to your door."}
          </p>
          {socials.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-semibold transition-colors"
                  style={{ background: "rgba(255,255,255,0.15)", color: fg }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                >
                  {s.label} <ExternalLink size={12} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Link columns */}
        {LINK_GROUPS.map((group) => (
          <div key={group.heading}>
            <div className="text-[11px] font-bold tracking-widest uppercase opacity-60 mb-3.5">
              {group.heading}
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item.text}>
                  <button
                    onClick={() => handleAction(item.action)}
                    className="text-sm text-left transition-opacity"
                    style={{ background: "none", border: "none", padding: 0, color: fg, opacity: 0.82, cursor: "pointer", fontFamily: theme.fontFamily }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.82")}
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
      <div style={{ borderTop: `1px solid ${fg}30` }} />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <span className="text-xs opacity-60 order-2 sm:order-1">
          © {new Date().getFullYear()} {theme.shopName}. All rights reserved.
        </span>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 order-1 sm:order-2">
          {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((t) => (
            <button
              key={t}
              className="text-xs transition-opacity"
              style={{ background: "none", border: "none", color: fg, opacity: 0.6, cursor: "pointer", fontFamily: theme.fontFamily, padding: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
