import type { Product, CartItem, Theme } from "../types/index";
import { fmt } from "../utils/helpers";

interface ProductModalProps {
  product: Product | null;
  theme: Theme;
  cartItem: CartItem | undefined;
  onAdd: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onClose: () => void;
}

export default function ProductModal({
  product,
  theme,
  cartItem,
  onAdd,
  onIncrease,
  onDecrease,
  onClose,
}: ProductModalProps) {
  if (!product) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.bg,
          borderRadius: theme.radiusCard,
          maxWidth: 540,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          fontFamily: theme.fontFamily,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Hero image */}
        <div style={{ position: "relative" }}>
          <img src={product.image} alt={product.name} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
          <button
            onClick={onClose}
            style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.92)", border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, cursor: "pointer", fontSize: 13, color: theme.black }}
          >
            ← Back
          </button>
          <span style={{ position: "absolute", top: 12, right: 12, background: theme.primary, color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {product.unit}
          </span>
        </div>

        {/* Details */}
        <div style={{ padding: 24 }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: theme.black }}>{product.name}</h2>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.primary, marginBottom: 16 }}>{fmt(product.price)}</div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: theme.textMuted, marginBottom: 20 }}>{product.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: theme.surface, borderRadius: 10, marginBottom: 20, border: `1px solid ${theme.border}` }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>In stock:</span>
            <span style={{ fontWeight: 700, color: theme.accent }}>{product.stock} available</span>
          </div>

          {!cartItem ? (
            <button
              onClick={onAdd}
              style={{ width: "100%", padding: "14px", background: theme.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = theme.primaryDark)}
              onMouseLeave={e => (e.currentTarget.style.background = theme.primary)}
            >
              Add to Cart
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontWeight: 600, color: theme.textMuted, fontSize: 14 }}>In cart:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: theme.surface, borderRadius: 10, padding: "8px 16px", border: `1.5px solid ${theme.border}` }}>
                <button onClick={onDecrease} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 22, cursor: "pointer" }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 18, color: theme.black, minWidth: 28, textAlign: "center" }}>{cartItem.qty}</span>
                <button onClick={onIncrease} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 22, cursor: "pointer" }}>+</button>
              </div>
              <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(product.price * cartItem.qty)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
