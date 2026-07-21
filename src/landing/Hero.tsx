import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {DEMO_SHOPS, C,STATS}  from "./Constants";
import HeroShopCard from "./HeroShopCard";


function useCycling(length: number, interval = 3600) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % length), interval);
    return () => clearInterval(id);
  }, [length, interval]);
  return [idx, setIdx] as const;
}

function Hero() {
  const [shopIdx, setShopIdx] = useCycling(DEMO_SHOPS.length, 4000);
  const [visible, setVisible] = useState(true);

  const goTo = (i: number) => {
    setVisible(false);
    setTimeout(() => { setShopIdx(i); setVisible(true); }, 300);
  };

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, [shopIdx]);

  return (
    <section style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${C.forest} 0%, #0f3d22 55%, #1A6B3C 100%)`,
      display: "flex", alignItems: "center", padding: "100px 24px 60px", position: "relative", overflow: "hidden",
    }}>
      {/* Background texture dots */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `${C.action}22`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        {/* Left: copy */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", borderRadius: 999, padding: "6px 14px", marginBottom: 24, border: "1px solid rgba(255,255,255,.15)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.action, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Kenya's shop-in-a-box platform</span>
          </div>

          <h1 style={{
            margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em",
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            <span style={{ fontSize: "clamp(38px, 5vw, 58px)", color: "#fff", display: "block", fontWeight: 700 }}>
              Your shop.<br />Online.
            </span>
            <span style={{ fontSize: "clamp(38px, 5vw, 58px)", color: C.mint, display: "block", fontWeight: 700, fontStyle: "italic" }}>
              In one afternoon.
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
            MyProduct gives Kenyan businesses everything to sell online — products, orders, POS, M-Pesa payments, and a shared marketplace — in one platform, from KSh 999/month.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/auth/signup" style={{
              textDecoration: "none", padding: "14px 28px", borderRadius: 12,
              background: C.action, color: "#fff", fontWeight: 800, fontSize: 16,
              boxShadow: "0 4px 20px rgba(37,165,90,.5)", transition: "transform .15s, box-shadow .15s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(37,165,90,.6)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 4px 20px rgba(37,165,90,.5)"; }}>
              Start free — no credit card <ArrowUpRight style={{ width: 16, height: 16, verticalAlign: "middle" }} />
            </Link>
            <a href="#features" style={{
              textDecoration: "none", padding: "14px 24px", borderRadius: 12,
              background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 600, fontSize: 16,
              border: "1.5px solid rgba(255,255,255,.2)", transition: "background .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.16)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; }}>
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", gap: 20, marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,.12)" }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.mint }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated shop card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <HeroShopCard shop={DEMO_SHOPS[shopIdx]} visible={visible} />
          {/* Shop selector dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {DEMO_SHOPS.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === shopIdx ? 28 : 8, height: 8, borderRadius: 4,
                background: i === shopIdx ? C.action : "rgba(255,255,255,.3)",
                border: "none", cursor: "pointer", transition: "all .3s", padding: 0,
              }} title={s.name} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", textAlign: "center" }}>
            Real shops built on MyProduct · Tap to explore
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;