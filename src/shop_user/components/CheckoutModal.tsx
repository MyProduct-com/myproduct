import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, PartyPopper } from "lucide-react";
import type { CartItem, Product, Theme, PlacedOrderPayload, CartItemResolved } from "../types/index.js";
import { fmt } from "../utils/helpers";
import { PAYMENT_METHODS } from "../data/products";

type CheckoutStep = "summary" | "payment" | "success";

interface CheckoutModalProps {
  cart: CartItem[];
  products: Product[];
  theme: Theme;
  onClose: () => void;
  onOrderPlaced: (payload: PlacedOrderPayload) => void;
}

export default function CheckoutModal({
  cart,
  products,
  theme,
  onClose,
  onOrderPlaced,
}: CheckoutModalProps) {
  const [step, setStep]               = useState<CheckoutStep>("summary");
  const [payMethod, setPayMethod]     = useState<string>("");
  const [processing, setProcessing]   = useState<boolean>(false);

  const items: CartItemResolved[] = cart
    .map(c => ({ ...c, product: products.find(p => p.id === c.productId) }))
    .filter((c): c is CartItemResolved => c.product !== undefined);

  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const delivery = 100;
  const total    = subtotal + delivery;

  const handlePay = (): void => {
    if (!payMethod) return;
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("success");
      onOrderPlaced({ items, total, payMethod });
    }, 1800);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: theme.bg,
          borderRadius: theme.radiusCard,
          maxWidth: 480,
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
          fontFamily: theme.fontFamily,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: theme.black }}>
            {step === "summary" ? "Order Summary" : step === "payment" ? "Payment" : "Order Placed!"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: theme.textMuted }}>×</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* ── SUMMARY ── */}
          {step === "summary" && (
            <>
              {items.map(i => (
                <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${theme.surface}` }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: theme.black }}>{i.product.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>qty: {i.qty} × {fmt(i.product.price)}</div>
                  </div>
                  <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(i.product.price * i.qty)}</span>
                </div>
              ))}
              <div style={{ marginTop: 16, background: theme.surface, borderRadius: 10, padding: 14, border: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textMuted, marginBottom: 6 }}>
                  <span>Subtotal</span><span>{fmt(subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textMuted, marginBottom: 10 }}>
                  <span>Delivery</span><span>{fmt(delivery)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: theme.accent }}>
                  <span>Total</span><span>{fmt(total)}</span>
                </div>
              </div>
              <button
                onClick={() => setStep("payment")}
                style={{ width: "100%", marginTop: 16, padding: "13px", background: theme.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                Continue to Payment <ArrowRight size={16} />
              </button>
            </>
          )}

          {/* ── PAYMENT ── */}
          {step === "payment" && (
            <>
              <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>Select your payment method:</p>
              {PAYMENT_METHODS.map(m => (
                <div
                  key={m.id}
                  onClick={() => setPayMethod(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, marginBottom: 10,
                    border: `2px solid ${payMethod === m.id ? theme.primary : theme.border}`,
                    background: payMethod === m.id ? theme.surface : theme.bg,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <m.icon size={24} color={theme.black} />
                  <div>
                    <div style={{ fontWeight: 700, color: theme.black, fontSize: 15 }}>{m.label}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>{m.desc}</div>
                  </div>
                  {payMethod === m.id && <CheckCircle2 size={20} style={{ marginLeft: "auto", color: theme.primary }} />}
                </div>
              ))}
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <button
                  onClick={() => setStep("summary")}
                  style={{ flex: 1, padding: "12px", background: "none", border: `1.5px solid ${theme.border}`, borderRadius: theme.radius, fontWeight: 700, color: theme.black, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  onClick={handlePay}
                  disabled={!payMethod || processing}
                  style={{
                    flex: 2, padding: "12px",
                    background: payMethod ? theme.primary : theme.border,
                    color: payMethod ? "#fff" : theme.textMuted,
                    border: "none", borderRadius: theme.radius, fontWeight: 800, fontSize: 15,
                    cursor: payMethod ? "pointer" : "not-allowed",
                  }}
                >
                  {processing ? "Processing…" : `Pay ${fmt(total)}`}
                </button>
              </div>
            </>
          )}

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: theme.primary }}><PartyPopper size={60} /></div>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: theme.accent, margin: "0 0 8px" }}>Order Placed!</h3>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>Your order is now being processed. Check "My Orders" to track it.</p>
              <button
                onClick={onClose}
                style={{ padding: "12px 32px", background: theme.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: 800, cursor: "pointer", fontSize: 15 }}
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
