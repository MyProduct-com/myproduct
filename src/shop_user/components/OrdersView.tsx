import { useState } from "react";
import { ArrowLeft, Package } from "lucide-react";
import type { Order, OrderStatus, Theme } from "../types/index";
import { fmt } from "../utils/helpers";
import { PAYMENT_METHODS } from "../data/products";

interface OrdersViewProps {
  orders: Order[];
  theme: Theme;
}

export default function OrdersView({ orders, theme }: OrdersViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const order = orders.find(o => o.id === selectedId) ?? null;

  const statusColor = (s: OrderStatus): string => {
    if (s === "Under Processing") return "#d97706";
    if (s === "Delivered")        return theme.primary;
    return theme.textMuted;
  };

  const payColor = (s: string): string =>
    s === "Paid" ? theme.primary : "#d97706";

  // ── Detail view ──
  if (order) return (
    <div style={{ fontFamily: theme.fontFamily, maxWidth: 560, margin: "0 auto" }}>
      <button
        onClick={() => setSelectedId(null)}
        style={{ background: "none", border: "none", color: theme.primary, fontWeight: 700, cursor: "pointer", marginBottom: 16, fontSize: 15, display: "flex", alignItems: "center", gap: 4 }}
      >
        <ArrowLeft size={16} /> Orders
      </button>

      <div style={{ background: theme.surface, borderRadius: theme.radiusCard, padding: 20, border: `1.5px solid ${theme.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: theme.black }}>{order.id}</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>{order.date}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: statusColor(order.status) + "20", color: statusColor(order.status), fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
              {order.status}
            </span><br />
            <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: payColor(order.payStatus) + "20", color: payColor(order.payStatus), fontSize: 12, fontWeight: 700 }}>
              {order.payStatus}
            </span>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 12 }}>
          {order.items.map(i => (
            <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: theme.black }}>{i.product.name}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>qty: {i.qty}</div>
              </div>
              <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(i.product.price * i.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 800, fontSize: 16, color: theme.accent }}>
            <span>Total</span><span>{fmt(order.total)}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: theme.textMuted }}>
            Payment: {PAYMENT_METHODS.find(m => m.id === order.payMethod)?.label ?? order.payMethod}
          </div>
        </div>
      </div>
    </div>
  );

  // ── List view ──
  return (
    <div style={{ fontFamily: theme.fontFamily, maxWidth: 560, margin: "0 auto" }}>
      <h3 style={{ fontWeight: 800, fontSize: 20, color: theme.black, marginBottom: 16 }}>My Orders</h3>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: theme.textMuted }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Package size={48} /></div>
          <p>No orders yet. Start shopping!</p>
        </div>
      ) : orders.map(o => (
        <div
          key={o.id}
          onClick={() => setSelectedId(o.id)}
          style={{
            background: theme.bg, border: `1.5px solid ${theme.border}`, borderRadius: theme.radius,
            padding: "14px 16px", marginBottom: 10, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "box-shadow 0.15s",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(22,163,74,0.12)")}
          onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = "none")}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black }}>{o.id}</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>{o.date} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, color: theme.accent, fontSize: 15 }}>{fmt(o.total)}</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: statusColor(o.status) }}>{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
