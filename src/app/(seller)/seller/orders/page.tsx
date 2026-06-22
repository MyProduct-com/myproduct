"use client";
import { useState } from "react";
import { IconSearch, IconTruck, IconCheck } from "@tabler/icons-react";
import { mockOrders } from "@/lib/mock-data";
import type { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Processing", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped: { label: "Shipped", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
  refunded: { label: "Refunded", cls: "bg-gray-50 text-gray-600 border-gray-200" },
};

const PAYMENT_LABEL: Record<string, string> = {
  mpesa: "M-Pesa",
  card: "Card",
  cash_on_delivery: "Cash on Delivery",
};

export default function SellerOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filtered = mockOrders.filter((o) => {
    const matchesSearch =
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Orders</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", "pending", "processing", "shipped", "delivered"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                statusFilter === s
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s as OrderStatus]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const sc = STATUS_CONFIG[order.status];
          return (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className="font-bold text-gray-900">{order.id}</span>
                  <span className="text-gray-500">{order.createdAt}</span>
                  <span className="text-gray-400">{order.customerName}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                    {PAYMENT_LABEL[order.paymentMethod]}
                  </span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.cls}`}>
                  {sc.label}
                </span>
              </div>

              {/* Items */}
              <div className="px-5 py-3">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 py-1.5">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                    />
                    <p className="text-sm text-gray-800 flex-1 truncate">
                      {item.productName} <span className="text-gray-400">x{item.quantity}</span>
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      KES {item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <div className="text-sm">
                  <span className="text-gray-500">Total: </span>
                  <span className="font-bold text-gray-900">KES {order.total.toLocaleString()}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    Delivery: {order.deliveryFee === 0 ? "Free" : `KES ${order.deliveryFee}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      <IconCheck size={13} /> Confirm Order
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                      <IconTruck size={13} /> Mark Shipped
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
