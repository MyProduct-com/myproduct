import { C } from "./Constants";

function TrustBar() {
  const LOGOS = ["🛒 FreshMart", "💻 TechZone", "📚 BookNest", "👗 StyleHub", "🥬 Mama Mboga", "🔧 AutoParts KE"];
  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: C.slate, fontWeight: 600, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Trusted by</span>
        {LOGOS.map(l => (
          <span key={l} style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, padding: "6px 14px", background: C.canvas, borderRadius: 8, border: `1px solid ${C.border}` }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

export default TrustBar;