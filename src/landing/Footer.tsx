import { Flag } from "lucide-react";
import { C } from "./Constants";

// Lucide has no brand/social icons, so these are small inline SVGs (standard practice for real social marks).
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>
  );
}
function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  );
}
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.6-5.8 6.6H2.9l8.2-9.3L2 2h6.5l4.6 6.1L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z"/></svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>
  );
}
const SOCIALS = [
  { Icon: FacebookIcon, label: "Facebook", href: "#" },
  { Icon: InstagramIcon, label: "Instagram", href: "#" },
  { Icon: XIcon, label: "X (Twitter)", href: "#" },
  { Icon: LinkedinIcon, label: "LinkedIn", href: "#" },
];

function Footer() {
  const COL_LINKS: Record<string, { label: string; href: string }[]> = {
    "Platform": [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Marketplace", href: "#marketplace" },
      { label: "How it works", href: "#how-it-works" },
    ],
    "Accounts": [
      { label: "Sign up", href: "/auth/signup" },
      { label: "Log in", href: "/auth/login" },
      { label: "Shop admin", href: "/shop_admin" },
      { label: "Super admin", href: "/super_admin" },
    ],
    "Company": [
      { label: "About us", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  };

  return (
    <footer style={{ background: C.ink, borderTop: "1px solid rgba(255,255,255,.07)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.action})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 900 }}>M</div>
              <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>MyProduct</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7, maxWidth: 280, margin: "0 0 20px" }}>
              Kenya's complete e-commerce platform for small and medium businesses. Launch your shop today.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {SOCIALS.map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", textDecoration: "none", transition: "background .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COL_LINKS).map(([col, links]) => (
            <div key={col}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{col}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,.55)", textDecoration: "none", transition: "color .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.55)"; }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.3)", display: "inline-flex", alignItems: "center", gap: 4 }}>© {new Date().getFullYear()} MyProduct. Built in Kenya <Flag style={{ width: 13, height: 13 }} /></span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.action, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


export default Footer;