import { C } from "./Constants";

function About() {
  return (
    <section id="about" style={{ padding: "96px 24px", background: C.ink, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(37,165,90,.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Our mission</span>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", margin: "14px 0 24px", letterSpacing: "-0.02em" }}>
          Built for Kenyan businesses,<br />by people who understand them.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.8, marginBottom: 20 }}>
          MyProduct was built because we saw small and medium businesses in Kenya spending too much time managing inventory on WhatsApp, collecting payments via M-Pesa screenshots, and losing track of orders in shared spreadsheets.
        </p>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.8, marginBottom: 48 }}>
          We built a complete, affordable platform so any Kenyan business owner — whether in Nairobi's CBD or Kisumu's market — can run a professional online shop with no technical skills required.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[{ icon: "🇰🇪", label: "Kenya-first" }, { icon: "🔒", label: "Secure & reliable" }, { icon: "📞", label: "Local support" }, { icon: "💡", label: "Always improving" }].map(b => (
            <div key={b.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;