import { ThumbsUp, Camera, Bird, Briefcase, Flag } from "lucide-react";
import { C } from "./Constants";

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
              {[ThumbsUp, Camera, Bird, Briefcase].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", textDecoration: "none", transition: "background .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}>
                  <Icon style={{ width: 16, height: 16 }} />
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