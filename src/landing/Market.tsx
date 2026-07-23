import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { C } from "./Constants";

// Duotone mosaic tiles — grayscale photos tinted with a cycling brand colour
// via mix-blend-mode, with alternating row-spans for a bento/mosaic feel
// instead of a plain even thumbnail grid.
const TINTS = [C.forest, C.ember, C.gold, "#1e40af"];

const MOSAIC_TILES = [
  { image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&q=80&auto=format&fit=crop", span: 2 },
  { image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80&auto=format&fit=crop", span: 1 },
  { image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80&auto=format&fit=crop", span: 1 },
  { image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80&auto=format&fit=crop", span: 3 },
  { image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80&auto=format&fit=crop", span: 1 },
  { image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80&auto=format&fit=crop", span: 2 },
  { image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80&auto=format&fit=crop", span: 1 },
];

function MarketplacePreview() {
  return (
    <section id="marketplace" style={{ padding: "96px 24px", background: `linear-gradient(180deg, ${C.canvas} 0%, ${C.mint}55 100%)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="market-grid">
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
                  <Check style={{ color: C.action, flexShrink: 0, width: 14, height: 14, marginTop: 1 }} />
                  <span style={{ fontSize: 14, color: C.charcoal }}>{b}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=seller" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: C.forest, color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Join the marketplace <ArrowRight style={{ width: 16, height: 16, verticalAlign: "middle" }} />
            </Link>
          </div>

          {/* Duotone photo mosaic */}
          <div className="market-mosaic">
            {MOSAIC_TILES.map((tile, i) => (
              <div key={i} className={`market-mosaic-tile${tile.span > 1 ? ` span-${tile.span}` : ""}`}>
                <img src={tile.image} alt="" />
                <div className="market-tint" style={{ background: TINTS[i % TINTS.length] }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


export default MarketplacePreview;
