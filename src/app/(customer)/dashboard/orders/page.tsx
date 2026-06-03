"use client";
import Link from "next/link";
import { useState } from "react";
import { IconPackage, IconArrowRight, IconTruck } from "@tabler/icons-react";
import { mockOrders } from "@/lib/mock-data";
import { OrderStatus } from "@/types/order";

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const [filter, setFilter] = useState("all");
  const orders = mockOrders.filter(
    (o) => filter === "all" || o.status === filter
  );

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">My Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f.value
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <IconPackage size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">No orders found</p>
          <p className="text-sm text-gray-500 mb-4">Try a different filter or start shopping</p>
          <Link href="/products" className="text-sm text-green-600 font-semibold hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-bold text-gray-900">{order.id}</span>
                  <span className="text-gray-500">{order.createdAt}</span>
                  {order.trackingNumber && (
                    <span className="flex items-center gap-1 text-green-700 text-xs">
                      <IconTruck size={13} /> {order.trackingNumber}
                    </span>
                  )}
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="px-5 py-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 py-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.sellerName} &bull; x{item.quantity} &bull; KES {item.price.toLocaleString()} each
                      </p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      KES {item.subtotal.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-bold text-gray-900">
                    KES {order.total.toLocaleString()}
                  </span>
                  {order.deliveryFee === 0 && (
                    <span className="ml-1 text-green-600 text-xs">(Free delivery)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {order.status === "delivered" && (
                    <button className="text-xs font-semibold text-orange-600 hover:underline">
                      Leave Review
                    </button>
                  )}
                  {(order.status === "shipped" || order.status === "processing") && (
                    <button className="flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline">
                      <IconTruck size={12} /> Track Order
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button className="text-xs font-semibold text-red-600 hover:underline">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
