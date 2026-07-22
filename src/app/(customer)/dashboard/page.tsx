"use client";
import Link from "next/link";
import { IconPackage, IconHeart, IconStar, IconArrowRight, IconTrendingUp } from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { mockOrders, mockProducts } from "@/lib/mock-data";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-purple-50 text-purple-700 border-purple-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.count());
  const myOrders = mockOrders.filter((o) => o.customerId === "cust-1");
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);
  const featured = mockProducts.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-linear-to-r from-green-600 to-green-500 rounded-2xl p-6 text-white">
        <p className="text-green-100 text-sm mb-1">Welcome back,</p>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
          {user?.name ?? "Valued Customer"}
        </h1>
        <p className="text-green-100 text-sm">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: myOrders.length, icon: <IconPackage size={20} />, color: "text-blue-600 bg-blue-50" },
          { label: "Total Spent", value: `KES ${totalSpent.toLocaleString()}`, icon: <IconTrendingUp size={20} />, color: "text-green-600 bg-green-50" },
          { label: "Wishlist Items", value: wishlistCount, icon: <IconHeart size={20} />, color: "text-red-500 bg-red-50" },
          { label: "Loyalty Points", value: "340 pts", icon: <IconStar size={20} />, color: "text-orange-500 bg-orange-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
            View All <IconArrowRight size={14} />
          </Link>
        </div>
        {myOrders.length === 0 ? (
          <div className="text-center py-10">
            <IconPackage size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No orders yet</p>
            <Link href="/products" className="mt-2 inline-block text-sm text-green-600 font-semibold hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img
                  src={order.items[0].productImage}
                  alt={order.items[0].productName}
                  className="w-12 h-12 rounded-lg object-cover bg-white"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} &bull; {order.createdAt}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">KES {order.total.toLocaleString()}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended for you */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recommended for You</h2>
          <Link href="/products" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
            See All <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {featured.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{p.name}</p>
              <p className="text-sm font-bold text-green-700 mt-0.5">KES {p.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
