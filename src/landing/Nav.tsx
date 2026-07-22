import Link from "next/link";
import { Menu, X } from "lucide-react";
import { C } from "./Constants";
import { useState } from "react";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Discover Shops", href: "/market" },
  { label: "About", href: "#about" },
];

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: (scrolled || menuOpen) ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: (scrolled || menuOpen) ? "blur(12px)" : "none",
      borderBottom: (scrolled || menuOpen) ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
      padding: "0 20px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 64, display: "flex", alignItems: "center", gap: 24 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.action})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: "#fff", fontWeight: 900 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: (scrolled || menuOpen) ? C.ink : "#fff", letterSpacing: "-0.02em" }}>MyProduct</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flex: 1, justifyContent: "center" }} className="desktop-nav">
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href} style={{
              textDecoration: "none", padding: "6px 14px", borderRadius: 8,
              color: scrolled ? C.charcoal : "rgba(255,255,255,0.85)",
              fontWeight: 500, fontSize: 14, transition: "all .15s", whiteSpace: "nowrap",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scrolled ? C.canvas : "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; }}>
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link href="/auth/login" style={{
            textDecoration: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 14,
            color: scrolled ? C.forest : "rgba(255,255,255,0.9)",
            border: `1.5px solid ${scrolled ? C.border : "rgba(255,255,255,0.3)"}`,
            background: "transparent", transition: "all .15s",
          }}>Log in</Link>
          <Link href="/auth/signup" style={{
            textDecoration: "none", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14,
            background: scrolled ? C.forest : "#fff",
            color: scrolled ? "#fff" : C.forest,
            transition: "all .15s",
          }}>Get started free</Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            display: "none", marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
            width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 8, flexShrink: 0,
            color: (scrolled || menuOpen) ? C.ink : "#fff",
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-nav-toggle" style={{ borderTop: `1px solid ${C.border}`, padding: "8px 4px 20px", display: "flex", flexDirection: "column", gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{
              textDecoration: "none", padding: "12px 12px", borderRadius: 8,
              color: C.charcoal, fontWeight: 600, fontSize: 15,
            }}>
              {item.label}
            </a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10, padding: "0 12px" }}>
            <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{
              textDecoration: "none", padding: "11px 16px", borderRadius: 8, fontWeight: 600, fontSize: 14,
              textAlign: "center", color: C.forest, border: `1.5px solid ${C.border}`,
            }}>Log in</Link>
            <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{
              textDecoration: "none", padding: "11px 16px", borderRadius: 8, fontWeight: 700, fontSize: 14,
              textAlign: "center", background: C.forest, color: "#fff",
            }}>Get started free</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Nav;
