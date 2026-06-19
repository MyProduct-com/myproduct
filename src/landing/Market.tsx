import Link from "next/link";
import { C } from "./Constants";


function MarketplacePreview() {
  const ITEMS = [
    { emoji: "🥦", name: "Sukuma Wiki", shop: "FreshMart", price: "KSh 30", tag: "Groceries" },
    { emoji: "🎧", name: "Wireless Earbuds Pro", shop: "TechZone", price: "KSh 3,500", tag: "Electronics" },
    { emoji: "📗", name: "Business Strategy 2025", shop: "BookNest", price: "KSh 1,200", tag: "Books" },
    { emoji: "👟", name: "Air Max Sneakers", shop: "StyleHub", price: "KSh 4,200", tag: "Fashion" },
    { emoji: "☕", name: "Kenyan AA Coffee 250g", shop: "FreshMart", price: "KSh 480", tag: "Groceries" },
    { emoji: "🔌", name: "USB-C Hub 7-in-1", shop: "TechZone", price: "KSh 2,800", tag: "Electronics" },
  ];
  return (
    <section id="marketplace" style={{ padding: "96px 24px", background: `linear-gradient(180deg, ${C.canvas} 0%, ${C.mint}55 100%)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Shared marketplace</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: C.ink, margin: "12px 0 18px", letterSpacing: "-0.02em" }}>
              Sell to the whole platform, not just your shop
            </h2>
            <p style={{ fontSize: 16, color: C.slate, lineHeight: 1.7, marginBottom: 28 }}>
              Every MyProduct shop can list on the shared marketplace — a single storefront where customers from across the platform browse products from all verified sellers. More eyeballs, more sales.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Products from all shops in one searchable feed", "Customers can buy from multiple shops in one checkout", "Your shop brand stays front and centre on every listing", "Flagged and moderated by our team for quality"].map(b => (
                <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: C.action, flexShrink: 0, fontWeight: 900, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: C.charcoal }}>{b}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=seller" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: C.forest, color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Join the marketplace →
            </Link>
          </div>

          {/* Grid preview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ITEMS.map((item, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "16px 14px", transition: "transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: C.slate, marginBottom: 8 }}>by {item.shop}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>{item.price}</span>
                  <span style={{ fontSize: 10, background: C.mint, color: C.forest, padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


export default MarketplacePreview;