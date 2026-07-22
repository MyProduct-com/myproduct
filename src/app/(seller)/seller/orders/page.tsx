"use client";
import { useState } from "react";
import { Search, Truck, Check } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import type { OrderStatus } from "@/types/order";
import type { OrderItem as MockOrderItem } from "@/types/order";
import StatusPill from "@/components/dashboard/StatusPill";

const DEMO_SELLER_ID = "seller-2";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const PAYMENT_LABEL: Record<string, string> = {
  mpesa: "M-Pesa",
  card: "Card",
  cash_on_delivery: "Cash on Delivery",
};

export default function SellerOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const sellerOrders = mockOrders.filter((o) => o.items.some((i: MockOrderItem) => i.sellerId === DEMO_SELLER_ID));

  const filtered = sellerOrders.filter((o) => {
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-org-lg font-org-bold text-org-text-primary">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full pl-9 pr-4 py-2.5 border border-org-border rounded-org-sm text-org-sm outline-none focus:border-org-primary transition-all bg-org-surface text-org-text-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "processing", "shipped", "delivered"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-org-sm text-org-sm font-org-medium transition-colors capitalize whitespace-nowrap ${
                statusFilter === s
                  ? "bg-org-primary text-white"
                  : "bg-org-surface text-org-text-secondary border border-org-border hover:border-org-primary"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABEL[s as OrderStatus] ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => (
          <div key={order.id} className="bg-org-surface rounded-org-card shadow-org-card overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 bg-org-surface-alt border-b border-org-border">
              <div className="flex items-center gap-3 text-org-sm flex-wrap">
                <span className="font-org-bold text-org-text-primary">{order.id}</span>
                <span className="text-org-text-secondary">{order.createdAt}</span>
                <span className="text-org-text-muted">{order.customerName}</span>
                <span className="text-org-xs text-org-text-muted bg-org-surface px-2 py-0.5 rounded-org-sm">
                  {PAYMENT_LABEL[order.paymentMethod]}
                </span>
              </div>
              <StatusPill status={order.status} />
            </div>

            {/* Items */}
            <div className="px-4 sm:px-5 py-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 py-1.5">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-10 h-10 rounded-lg object-cover bg-org-surface-alt shrink-0"
                  />
                  <p className="text-org-sm text-org-text-primary flex-1 truncate">
                    {item.productName} <span className="text-org-text-muted">x{item.quantity}</span>
                  </p>
                  <p className="text-org-sm font-org-semibold text-org-text-primary">
                    KES {item.subtotal.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 sm:px-5 py-3 border-t border-org-border">
              <div className="text-org-sm">
                <span className="text-org-text-secondary">Total: </span>
                <span className="font-org-bold text-org-text-primary">KES {order.total.toLocaleString()}</span>
                <span className="ml-2 text-org-xs text-org-text-muted">
                  Delivery: {order.deliveryFee === 0 ? "Free" : `KES ${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button className="flex items-center gap-1.5 text-org-xs font-org-semibold text-org-accent bg-org-accent/15 hover:bg-org-accent/25 px-3 py-1.5 rounded-org-sm transition-colors">
                    <Check size={13} /> Confirm Order
                  </button>
                )}
                {order.status === "confirmed" && (
                  <button className="flex items-center gap-1.5 text-org-xs font-org-semibold text-org-success bg-org-success-bg hover:opacity-80 px-3 py-1.5 rounded-org-sm transition-colors">
                    <Truck size={13} /> Mark Shipped
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No orders match your filters.</p>
        )}
      </div>
    </div>
  );
}
