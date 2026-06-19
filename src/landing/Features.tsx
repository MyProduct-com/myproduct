import { FEATURES, C } from "./Constants";

function Features() {
  return (
    <section id="features" style={{ padding: "96px 24px", background: C.canvas }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Everything you need</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            One platform. Every tool.
          </h2>
          <p style={{ fontSize: 17, color: C.slate, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            From your first product listing to multi-location management — MyProduct scales with you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "24px 22px", transition: "transform .2s, box-shadow .2s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; el.style.borderColor = C.mint; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = C.border; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: C.ink }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: C.slate, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;