import { useState } from "react";
import type { AdminOrder, OrderStatus, Theme } from "../../types/index";
import { SectionHeader, Badge, Btn, Modal, Table } from "../layout/UI";
import { fmt, fmtDateTime, payMethodLabel } from "../../utils/helpers";

const STATUSES: OrderStatus[] = ["Pending","Under Processing","Dispatched","In Transit","Delivered","Cancelled","Returned"];

interface OrdersViewProps {
  theme: Theme;
  orders: AdminOrder[];
  onUpdate: (orders: AdminOrder[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

export default function OrdersView({ theme, orders, onUpdate, onToast }: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payFilter, setPayFilter] = useState("All");
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState("");

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const matchPay = payFilter === "All" || o.paymentStatus === payFilter;
    return matchSearch && matchStatus && matchPay;
  });

  const updateOrder = (id: string, patch: Partial<AdminOrder>) => {
    onUpdate(orders.map(o => o.id === id ? { ...o, ...patch, updatedAt: new Date().toISOString() } : o));
  };

  const dispatch = (order: AdminOrder) => {
    const tracking = trackingInput || `TRK-${Date.now().toString().slice(-6)}`;
    updateOrder(order.id, {
      status: "Dispatched", dispatchedAt: new Date().toISOString(), trackingCode: tracking,
    });
    onToast(`Order ${order.id} dispatched. Tracking: ${tracking}`, "success");
    setSelected(prev => prev ? { ...prev, status: "Dispatched", trackingCode: tracking } : null);
  };

  const advanceStatus = (order: AdminOrder) => {
    const idx = STATUSES.indexOf(order.status);
    if (idx < 0 || idx >= STATUSES.indexOf("Delivered")) return;
    const next = STATUSES[idx + 1];
    updateOrder(order.id, {
      status: next,
      ...(next === "Dispatched" ? { dispatchedAt: new Date().toISOString() } : {}),
      ...(next === "Delivered" ? { deliveredAt: new Date().toISOString() } : {}),
    });
    onToast(`${order.id} status → ${next}`, "success");
    setSelected(prev => prev ? { ...prev, status: next } : null);
  };

  const confirmPayment = (order: AdminOrder) => {
    updateOrder(order.id, { paymentStatus: "Paid" });
    onToast(`Payment confirmed for ${order.id}`, "success");
    setSelected(prev => prev ? { ...prev, paymentStatus: "Paid" } : null);
  };

  const cancelOrder = (order: AdminOrder) => {
    updateOrder(order.id, { status: "Cancelled" });
    onToast(`Order ${order.id} cancelled`, "info");
    setSelected(prev => prev ? { ...prev, status: "Cancelled" } : null);
  };

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const columns = [
    {
      header: "Order ID", key: "id",
      render: (o: AdminOrder) => <span style={{ fontWeight: 700, fontSize: 12 }}>{o.id}</span>,
    },
    {
      header: "Customer", key: "customer",
      render: (o: AdminOrder) => (
        <div>
          <div style={{ fontWeight: 600, color: theme.black }}>{o.customerName}</div>
          <div style={{ fontSize: 11, color: theme.textMuted }}>{o.customerPhone}</div>
        </div>
      ),
    },
    { header: "Items", key: "items", render: (o: AdminOrder) => <span style={{ fontSize: 12 }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span> },
    { header: "Total", key: "total", render: (o: AdminOrder) => <span style={{ fontWeight: 700 }}>{fmt(o.total)}</span> },
    { header: "Payment", key: "pay", render: (o: AdminOrder) => <Badge status={o.paymentStatus} /> },
    { header: "Status", key: "status", render: (o: AdminOrder) => <Badge status={o.status} /> },
    { header: "Date", key: "date", render: (o: AdminOrder) => <span style={{ fontSize: 12, color: theme.textMuted }}>{fmtDateTime(o.createdAt)}</span> },
  ];

  return (
    <div>
      <SectionHeader
        title="Orders"
        subtitle={`${orders.length} total · ${statusCounts["Pending"] || 0} pending · ${statusCounts["Under Processing"] || 0} processing`}
        theme={theme}
      />

      {/* Status quick-filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["All", ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer",
              background: statusFilter === s ? theme.primary : theme.surface,
              color: statusFilter === s ? "#fff" : theme.textMuted,
              fontWeight: 600, fontSize: 12, border: `1px solid ${statusFilter === s ? theme.primary : theme.border}`,
            } as React.CSSProperties}
          >
            {s} {s !== "All" && statusCounts[s] ? `(${statusCounts[s]})` : ""}
          </button>
        ))}
      </div>

      {/* Search + pay filter */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            placeholder="Search order ID, customer name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 36px", borderRadius: theme.radius,
              border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box",
              background: theme.surface, outline: "none",
            }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
        </div>
        <select value={payFilter} onChange={e => setPayFilter(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, background: theme.surface }}>
          <option value="All">All Payments</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <Table columns={columns} data={filtered} theme={theme} onRowClick={setSelected} emptyMessage="No orders found." />

      {/* Order Detail Modal */}
      {selected && (
        <Modal title={`Order ${selected.id}`} onClose={() => setSelected(null)} theme={theme} width={620}>
          {/* Status + badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <Badge status={selected.status} />
            <Badge status={selected.paymentStatus} />
            <span style={{ fontSize: 12, color: theme.textMuted, alignSelf: "center" }}>
              {payMethodLabel(selected.paymentMethod)}
              {selected.paymentRef && ` · Ref: ${selected.paymentRef}`}
            </span>
          </div>

          {/* Customer */}
          <div style={{ background: theme.bg, borderRadius: theme.radius, padding: 14, marginBottom: 16, border: `1px solid ${theme.border}` }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: theme.black }}>Customer</div>
            <div style={{ fontSize: 13, color: theme.text }}>{selected.customerName}</div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>{selected.customerPhone} · {selected.customerEmail}</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>📍 {selected.address}</div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 10, color: theme.black }}>Items</div>
            {selected.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", padding: "8px 0",
                borderBottom: `1px solid ${theme.border}`, fontSize: 13,
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: theme.black }}>{item.productName}</div>
                  <div style={{ color: theme.textMuted }}>{item.qty} × {fmt(item.unitPrice)}</div>
                </div>
                <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(item.totalPrice)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 12, color: theme.textMuted }}>
              <span>Subtotal</span><span>{fmt(selected.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 12, color: theme.textMuted }}>
              <span>Delivery</span><span>{fmt(selected.deliveryFee)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 16, color: theme.accent, paddingTop: 8 }}>
              <span>Total</span><span>{fmt(selected.total)}</span>
            </div>
          </div>

          {/* Tracking */}
          {selected.trackingCode && (
            <div style={{ background: theme.primaryLight, borderRadius: theme.radius, padding: 12, marginBottom: 16, border: `1px solid ${theme.primary}40` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.primary }}>🚚 Tracking Code: {selected.trackingCode}</div>
              {selected.dispatchedAt && <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>Dispatched: {fmtDateTime(selected.dispatchedAt)}</div>}
            </div>
          )}

          {/* Dispatch input */}
          {selected.status === "Under Processing" && (
            <div style={{ marginBottom: 16 }}>
              <input
                placeholder="Tracking code (optional, auto-generated if blank)"
                value={trackingInput}
                onChange={e => setTrackingInput(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box" }}
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {selected.paymentStatus === "Pending" && (
              <Btn theme={theme} onClick={() => confirmPayment(selected)}>✅ Confirm Payment</Btn>
            )}
            {selected.status === "Under Processing" && (
              <Btn theme={theme} onClick={() => dispatch(selected)}>🚚 Dispatch Order</Btn>
            )}
            {["Pending","Under Processing","Dispatched","In Transit"].includes(selected.status) &&
             selected.status !== "Under Processing" && (
              <Btn theme={theme} variant="ghost" onClick={() => advanceStatus(selected)}>
                → Advance to {STATUSES[STATUSES.indexOf(selected.status) + 1]}
              </Btn>
            )}
            {selected.status === "Pending" && (
              <Btn theme={theme} variant="ghost" onClick={() => advanceStatus(selected)}>→ Start Processing</Btn>
            )}
            {!["Cancelled","Delivered","Returned"].includes(selected.status) && (
              <Btn theme={theme} variant="danger" onClick={() => cancelOrder(selected)}>✕ Cancel</Btn>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
