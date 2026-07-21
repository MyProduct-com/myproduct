import { ShoppingCart, ArrowRight } from "lucide-react";
import type { CartItem, Product, Theme } from "../types/index";
import { fmt } from "../utils/helpers";

interface CartModalProps {
  cart: CartItem[];
  products: Product[];
  theme: Theme;
  onClose: () => void;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export default function CartModal({
  cart,
  products,
  theme,
  onClose,
  onIncrease,
  onDecrease,
  onClear,
  onCheckout,
}: CartModalProps) {
  const items = cart
    .map(c => ({ ...c, product: products.find(p => p.id === c.productId) }))
    .filter((c): c is CartItem & { product: Product } => c.product !== undefined);

  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.bg,
          borderRadius: `${theme.radiusCard} ${theme.radiusCard} 0 0`,
          maxWidth: 540,
          width: "100%",
          maxHeight: "85vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: theme.fontFamily,
          boxShadow: "0 -12px 48px rgba(0,0,0,0.18)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: theme.black, display: "flex", alignItems: "center", gap: 8 }}>
              <ShoppingCart size={20} /> Your Cart
            </h3>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: theme.textMuted }}>×</button>
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: theme.textMuted }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><ShoppingCart size={48} /></div>
              <p>Your cart is empty. Browse products and add something!</p>
            </div>
          ) : items.map(item => (
            <div key={item.productId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${theme.surface}` }}>
              <img src={item.product.image} alt={item.product.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: theme.black }}>{item.product.name}</div>
                <div style={{ fontSize: 13, color: theme.textMuted }}>{fmt(item.product.price)} × {item.qty}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.surface, borderRadius: 8, padding: "4px 8px", border: `1px solid ${theme.border}` }}>
                <button onClick={() => onDecrease(item.productId)} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 18, cursor: "pointer" }}>−</button>
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 18, textAlign: "center", color: theme.black }}>{item.qty}</span>
                <button onClick={() => onIncrease(item.productId)} style={{ background: "none", border: "none", color: theme.primary, fontWeight: 900, fontSize: 18, cursor: "pointer" }}>+</button>
              </div>
              <span style={{ fontWeight: 800, fontSize: 14, color: theme.accent, minWidth: 64, textAlign: "right" }}>{fmt(item.product.price * item.qty)}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: theme.black }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: theme.accent }}>{fmt(total)}</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClear}
                style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid ${theme.border}`, borderRadius: theme.radius, fontWeight: 700, color: theme.danger, cursor: "pointer", fontSize: 13 }}
              >
                Clear Cart
              </button>
              <button
                onClick={onCheckout}
                style={{ flex: 2, padding: "12px", background: theme.primary, border: "none", borderRadius: theme.radius, fontWeight: 800, color: "#fff", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                Checkout <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
