import { useState } from "react";
import { Search, MapPin, Truck, CheckCircle2, ArrowRight, Undo2, X } from "lucide-react";
import type { AdminOrder, OrderStatus, PaymentStatus } from "../../types/index";
import StatusPill from "@/components/dashboard/StatusPill";
import { fmt, fmtDateTime, payMethodLabel } from "../../utils/helpers";

const STATUSES: OrderStatus[] = ["Pending","Under Processing","Dispatched","In Transit","Delivered","Cancelled","Returned"];

interface OrdersViewProps {
  orders: AdminOrder[];
  onUpdate: (orders: AdminOrder[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
  /** Pre-select a payment-status filter — set when arriving via the dashboard's "Process Refund" quick action. */
  initialPaymentFilter?: PaymentStatus;
}

export default function OrdersView({ orders, onUpdate, onToast, initialPaymentFilter }: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [payFilter, setPayFilter] = useState<string>(initialPaymentFilter ?? "All");
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
    onToast(`${order.id} status -> ${next}`, "success");
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

  const refundOrder = (order: AdminOrder) => {
    updateOrder(order.id, { paymentStatus: "Refunded" });
    onToast(`${fmt(order.total)} refunded for ${order.id}`, "success");
    setSelected(prev => prev ? { ...prev, paymentStatus: "Refunded" } : null);
  };

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Orders</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">
          {orders.length} total &middot; {statusCounts["Pending"] || 0} pending &middot; {statusCounts["Under Processing"] || 0} processing
        </p>
      </div>

      {/* Status quick-filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {["All", ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-3.5 py-1.5 rounded-org-pill text-org-xs font-org-semibold whitespace-nowrap transition-colors ${
              statusFilter === s ? "bg-org-primary text-white" : "bg-org-surface text-org-text-secondary border border-org-border hover:border-org-primary"
            }`}
          >
            {s} {s !== "All" && statusCounts[s] ? `(${statusCounts[s]})` : ""}
          </button>
        ))}
      </div>

      {/* Search + pay filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input
            placeholder="Search order ID, customer name or phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary"
          />
        </div>
        <select value={payFilter} onChange={e => setPayFilter(e.target.value)}
          className="px-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary">
          <option value="All">All Payments</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No orders found.</p>
        ) : filtered.map((o) => (
          <div key={o.id} onClick={() => setSelected(o)} className="bg-org-surface rounded-org-card shadow-org-card p-3.5 cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-org-bold text-org-sm text-org-text-primary">{o.id}</p>
                <p className="text-org-xs text-org-text-secondary">{o.customerName} &middot; {o.customerPhone}</p>
              </div>
              <StatusPill status={o.status} />
            </div>
            <div className="flex items-center justify-between text-org-sm">
              <span className="text-org-text-secondary">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</span>
              <span className="font-org-bold text-org-text-primary">{fmt(o.total)}</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <StatusPill status={o.paymentStatus} />
              <span className="text-org-xs text-org-text-muted">{fmtDateTime(o.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-org-surface rounded-org-card shadow-org-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-org-sm">
            <thead className="bg-org-surface-alt border-b border-org-border">
              <tr className="text-org-xs text-org-text-muted uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-org-medium">Order ID</th>
                <th className="px-4 py-3 text-left font-org-medium">Customer</th>
                <th className="px-4 py-3 text-left font-org-medium">Items</th>
                <th className="px-4 py-3 text-right font-org-medium">Total</th>
                <th className="px-4 py-3 text-left font-org-medium">Payment</th>
                <th className="px-4 py-3 text-left font-org-medium">Status</th>
                <th className="px-4 py-3 text-left font-org-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-org-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-org-text-secondary">No orders found.</td></tr>
              ) : filtered.map((o) => (
                <tr key={o.id} onClick={() => setSelected(o)} className="hover:bg-org-surface-alt transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-org-bold text-org-xs text-org-text-primary">{o.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-org-medium text-org-text-primary">{o.customerName}</p>
                    <p className="text-org-xs text-org-text-muted">{o.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 text-org-text-secondary">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td className="px-4 py-3 text-right font-org-semibold text-org-text-primary">{fmt(o.total)}</td>
                  <td className="px-4 py-3"><StatusPill status={o.paymentStatus} /></td>
                  <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                  <td className="px-4 py-3 text-org-xs text-org-text-muted">{fmtDateTime(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setSelected(null)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">Order {selected.id}</h2>

            <div className="flex items-center gap-2.5 flex-wrap mb-5">
              <StatusPill status={selected.status} />
              <StatusPill status={selected.paymentStatus} />
              <span className="text-org-xs text-org-text-muted">
                {payMethodLabel(selected.paymentMethod)}
                {selected.paymentRef && ` · Ref: ${selected.paymentRef}`}
              </span>
            </div>

            {/* Customer */}
            <div className="bg-org-surface-alt rounded-org-sm p-3.5 mb-4 border border-org-border">
              <p className="font-org-bold text-org-text-primary mb-1.5">Customer</p>
              <p className="text-org-sm text-org-text-primary">{selected.customerName}</p>
              <p className="text-org-xs text-org-text-secondary">{selected.customerPhone} &middot; {selected.customerEmail}</p>
              <p className="text-org-xs text-org-text-secondary mt-1 flex items-center gap-1"><MapPin size={12} /> {selected.address}</p>
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="font-org-bold text-org-text-primary mb-2.5">Items</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-org-border text-org-sm">
                  <div>
                    <p className="font-org-medium text-org-text-primary">{item.productName}</p>
                    <p className="text-org-text-secondary">{item.qty} &times; {fmt(item.unitPrice)}</p>
                  </div>
                  <span className="font-org-semibold text-org-text-primary">{fmt(item.totalPrice)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 text-org-xs text-org-text-secondary">
                <span>Subtotal</span><span>{fmt(selected.subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-org-xs text-org-text-secondary">
                <span>Delivery</span><span>{fmt(selected.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-org-bold text-org-md text-org-text-primary pt-2">
                <span>Total</span><span>{fmt(selected.total)}</span>
              </div>
            </div>

            {/* Tracking */}
            {selected.trackingCode && (
              <div className="bg-org-primary-light rounded-org-sm p-3 mb-4 border border-org-primary/30">
                <p className="text-org-xs font-org-bold text-org-primary flex items-center gap-1.5"><Truck size={14} /> Tracking Code: {selected.trackingCode}</p>
                {selected.dispatchedAt && <p className="text-org-xs text-org-text-secondary mt-1">Dispatched: {fmtDateTime(selected.dispatchedAt)}</p>}
              </div>
            )}

            {/* Dispatch input */}
            {selected.status === "Under Processing" && (
              <div className="mb-4">
                <input
                  placeholder="Tracking code (optional, auto-generated if blank)"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-org-sm border border-org-border text-org-sm outline-none focus:border-org-primary"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2.5 flex-wrap">
              {selected.paymentStatus === "Pending" && (
                <button onClick={() => confirmPayment(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors"><CheckCircle2 size={14} /> Confirm Payment</button>
              )}
              {selected.paymentStatus === "Paid" && (
                <button onClick={() => refundOrder(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-danger text-org-danger hover:bg-org-danger-bg text-org-sm font-org-semibold transition-colors"><Undo2 size={14} /> Refund Payment</button>
              )}
              {selected.status === "Under Processing" && (
                <button onClick={() => dispatch(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors"><Truck size={14} /> Dispatch Order</button>
              )}
              {["Pending","Under Processing","Dispatched","In Transit"].includes(selected.status) &&
               selected.status !== "Under Processing" && (
                <button onClick={() => advanceStatus(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-text-secondary hover:bg-org-surface-alt text-org-sm font-org-medium transition-colors">
                  <ArrowRight size={14} /> Advance to {STATUSES[STATUSES.indexOf(selected.status) + 1]}
                </button>
              )}
              {selected.status === "Pending" && (
                <button onClick={() => advanceStatus(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-text-secondary hover:bg-org-surface-alt text-org-sm font-org-medium transition-colors"><ArrowRight size={14} /> Start Processing</button>
              )}
              {!["Cancelled","Delivered","Returned"].includes(selected.status) && (
                <button onClick={() => cancelOrder(selected)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-sm font-org-semibold transition-colors"><X size={14} /> Cancel</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
