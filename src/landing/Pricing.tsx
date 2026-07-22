import Link from "next/link";
import { Check } from "lucide-react";
import { C, PACKAGES } from "./Constants";
import { useState } from "react";



function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" style={{ padding: "96px 24px", background: C.canvas }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Transparent pricing</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            Pay for what you need
          </h2>
          <p style={{ fontSize: 16, color: C.slate, margin: "0 0 28px" }}>Start free for 14 days. No credit card required.</p>

          {/* Billing toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: "6px 10px" }}>
            <button onClick={() => setAnnual(false)} style={{ padding: "7px 18px", borderRadius: 999, border: "none", background: !annual ? C.forest : "transparent", color: !annual ? "#fff" : C.slate, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ padding: "7px 18px", borderRadius: 999, border: "none", background: annual ? C.forest : "transparent", color: annual ? "#fff" : C.slate, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}>
              Yearly
              <span style={{ fontSize: 10, background: C.ember, color: "#fff", padding: "2px 7px", borderRadius: 999, fontWeight: 800 }}>-20%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {PACKAGES.map(pkg => {
            const price = annual ? Math.round(pkg.price * 0.8) : pkg.price;
            return (
              <div key={pkg.id} style={{
                background: pkg.popular ? C.forest : C.surface,
                border: pkg.popular ? "none" : `1.5px solid ${C.border}`,
                borderRadius: 20, padding: "30px 26px",
                position: "relative",
                boxShadow: pkg.popular ? "0 20px 48px rgba(26,107,60,.25)" : "none",
                transform: pkg.popular ? "scale(1.03)" : "none",
                transition: "transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { if (!pkg.popular) { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; } }}
                onMouseLeave={e => { if (!pkg.popular) { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; } }}>
                {pkg.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.ember, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>MOST POPULAR</div>
                )}
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: pkg.popular ? C.mint : C.slate }}>{pkg.limits}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, color: pkg.popular ? "#fff" : C.ink, marginBottom: 4 }}>{pkg.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: pkg.popular ? C.mint : C.forest }}>KSh {price.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: pkg.popular ? "rgba(255,255,255,.6)" : C.slate }}>/{pkg.cycle}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {pkg.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <Check style={{ color: pkg.popular ? C.mint : C.action, flexShrink: 0, width: 14, height: 14, marginTop: 1 }} />
                      <span style={{ fontSize: 13, color: pkg.popular ? "rgba(255,255,255,.85)" : C.charcoal, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/signup" style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: pkg.popular ? C.action : C.forest,
                  color: "#fff",
                  transition: "opacity .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.87"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                  Start with {pkg.name}
                </Link>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: C.slate }}>
          All plans include a 14-day free trial. Cancel anytime. Need something custom?{" "}
          <a href="#contact" style={{ color: C.action, fontWeight: 600 }}>Talk to us</a>.
        </p>
      </div>
    </section>
  );
}

export default Pricing;