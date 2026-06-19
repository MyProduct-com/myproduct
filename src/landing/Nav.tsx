import Link from "next/link";
import { C } from "./Constants";
import { useState } from "react";


function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.action})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 900 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: scrolled ? C.ink : "#fff", letterSpacing: "-0.02em" }}>MyProduct</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flex: 1, justifyContent: "center" }} className="desktop-nav">
          {["Features", "Pricing", "Marketplace", "About"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              textDecoration: "none", padding: "6px 14px", borderRadius: 8,
              color: scrolled ? C.charcoal : "rgba(255,255,255,0.85)",
              fontWeight: 500, fontSize: 14, transition: "all .15s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scrolled ? C.canvas : "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; }}>
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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
            boxShadow: "0 2px 8px rgba(0,0,0,.12)", transition: "all .15s",
          }}>Get started free</Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;