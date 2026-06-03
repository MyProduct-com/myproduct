"use client";
import { useState } from "react";
import { IconSearch, IconTruck } from "@tabler/icons-react";
import { mockOrders } from "@/lib/mock-data";
import { OrderStatus } from "@/types/order";

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  confirmed: { label: "Confirmed", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  processing: { label: "Processing", cls: "bg-purple-50 text-purple-700 border-purple-200" },
  shipped: { label: "Shipped", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", cls: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
  refunded: { label: "Refunded", cls: "bg-gray-50 text-gray-600 border-gray-200" },
};

export default function AdminOrdersPage() {
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

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">All Orders</h1>
        <span className="text-sm text-gray-500">
          Total: <span className="font-bold text-gray-900">KES {totalRevenue.toLocaleString()}</span>
        </span>
      </div>

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
          {(["all", "pending", "processing", "shipped", "delivered", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s as OrderStatus]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Seller(s)</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => {
                const sc = STATUS_CONFIG[order.status];
                const sellers = [...new Set(order.items.map((i) => i.sellerName))].join(", ");
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-800">{order.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-xs text-gray-400">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs max-w-[120px] truncate">{sellers}</td>
                    <td className="px-4 py-3 text-gray-500">{order.createdAt}</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                      KES {order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">
                      {order.paymentMethod.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {mockOrders.length} orders
        </div>
      </div>
    </div>
  );
}
