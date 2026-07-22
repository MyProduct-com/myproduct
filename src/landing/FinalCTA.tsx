import Link from "next/link";
import { Rocket } from "lucide-react";
import { C } from "./Constants";

function FinalCTA() {
  return (
    <section id="contact" style={{ padding: "96px 24px", background: `linear-gradient(135deg, ${C.forest}, #0d3a1e)` }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}><Rocket style={{ width: 48, height: 48, color: "#fff" }} /></div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.02em" }}>
          Ready to open your shop?
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,.72)", margin: "0 0 40px", lineHeight: 1.7 }}>
          Join hundreds of Kenyan businesses already selling on MyProduct. Get set up in minutes — no technical skills needed.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/signup" style={{
            textDecoration: "none", padding: "16px 36px", borderRadius: 14,
            background: C.action, color: "#fff", fontWeight: 800, fontSize: 17,
            transition: "transform .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
            Start free — 14 days, no card required
          </Link>
          <Link href="/market" style={{
            textDecoration: "none", padding: "16px 28px", borderRadius: 14,
            background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 600, fontSize: 17,
            border: "1.5px solid rgba(255,255,255,.25)", transition: "background .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.12)"; }}>
            Browse the marketplace
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 24 }}>
          No credit card · Cancel anytime · Support in English & Swahili
        </p>
      </div>
    </section>
  );
}

export default FinalCTA;