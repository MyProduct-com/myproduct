import { C, TESTIMONIALS } from "./Constants";  

function Testimonials() {
  return (
    <section style={{ padding: "96px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Real businesses, real results</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0", letterSpacing: "-0.02em" }}>
            Businesses growing on MyProduct
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ fontSize: 28, color: C.action, marginBottom: 14, lineHeight: 1 }}>"</div>
              <p style={{ margin: "0 0 20px", fontSize: 15, color: C.charcoal, lineHeight: 1.75, fontStyle: "italic" }}>{t.quote}</p>

              <div style={{ background: C.mint, borderRadius: 8, padding: "8px 14px", display: "inline-block", marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.forest }}>📈 {t.revenue}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.slate }}>{t.shop} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;