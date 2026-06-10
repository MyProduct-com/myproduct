import type { Product, CartItem, Theme } from "../types/index";
import { fmt, shortDesc } from "../utils/helpers";

interface ProductCardProps {
  product: Product;
  theme: Theme;
  cartItem: CartItem | undefined;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onClick: () => void;
}

export default function ProductCard({
  product,
  theme,
  cartItem,
  onAdd,
  onIncrease,
  onDecrease,
  onClick,
}: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.bg,
        border: `1.5px solid ${theme.border}`,
        borderRadius: theme.radiusCard,
        overflow: "hidden",
        cursor: "pointer",
        transition: "box-shadow 0.18s, transform 0.15s",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: theme.fontFamily,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(22,163,74,0.15)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
        (e.currentTarget as HTMLDivElement).style.transform = "none";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, background: theme.primary, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 20 }}>
          {product.unit}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 14px 10px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 4 }}>{product.name}</div>
        <div style={{ fontSize: 12.5, color: theme.textMuted, flex: 1, lineHeight: 1.5, marginBottom: 8 }}>
          {shortDesc(product.description)}
          <span
            onClick={e => { e.stopPropagation(); onClick(); }}
            style={{ color: theme.primary, fontWeight: 600, cursor: "pointer", marginLeft: 4 }}
          >
            more
          </span>
        </div>

        {/* Price + cart control */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: theme.accent }}>{fmt(product.price)}</span>

          {!cartItem ? (
            <button
              onClick={e => { e.stopPropagation(); onAdd(); }}
              style={{ background: theme.primary, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = theme.primaryDark)}
              onMouseLeave={e => (e.currentTarget.style.background = theme.primary)}
            >
              + Add
            </button>
          ) : (
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: "flex", alignItems: "center", gap: 6, background: theme.surface, borderRadius: 8, padding: "4px 8px", border: `1.5px solid ${theme.border}` }}
            >
              <button onClick={onDecrease} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>−</button>
              <span style={{ fontWeight: 700, fontSize: 14, color: theme.black, minWidth: 18, textAlign: "center" }}>{cartItem.qty}</span>
              <button onClick={onIncrease} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
