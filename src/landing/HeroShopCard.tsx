import { DEMO_SHOPS, C } from "./Constants";

function HeroShopCard({ shop, visible }: { shop: typeof DEMO_SHOPS[0]; visible: boolean }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,.16)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      transition: "all 0.55s cubic-bezier(.22,1,.36,1)",
      width: "100%", maxWidth: 360,
    }}>
      {/* Shop header */}
      <div style={{ background: `linear-gradient(135deg, ${shop.color}dd, ${shop.color})`, padding: "22px 22px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{shop.emoji}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", lineHeight: 1.2 }}>{shop.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginTop: 2 }}>{shop.tagline}</div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", borderRadius: 999, padding: "3px 10px", fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>LIVE</div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 14px", flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{shop.revenue}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>Revenue</div>
          </div>
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 14px", flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{shop.orders}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>Orders</div>
          </div>
        </div>
      </div>
      {/* Products */}
      <div style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Products</div>
        {shop.products.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < shop.products.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 13, color: C.charcoal }}>{p.split(" — ")[0]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.forest }}>{p.split(" — ")[1]}</span>
          </div>
        ))}
        <button style={{
          marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, border: "none",
          background: `${shop.color}14`, color: shop.color, fontWeight: 700, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>Visit shop ↗</button>
      </div>
    </div>
  );
}

export default HeroShopCard;