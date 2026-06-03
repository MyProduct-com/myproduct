"use client";
import Link from "next/link";
import {
  IconTrendingUp,
  IconShoppingCart,
  IconPackage,
  IconStar,
  IconArrowRight,
  IconArrowUp,
  IconAlertTriangle,
  IconEye,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";
import { mockOrders, mockProducts } from "@/lib/mock-data";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const REVENUE_DATA = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 71000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 89000 },
  { month: "Jun", revenue: 112000 },
];
const maxRevenue = Math.max(...REVENUE_DATA.map((d) => d.revenue));

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const sellerOrders = mockOrders.slice(0, 4);
  const lowStock = mockProducts.filter((p) => p.stock > 0 && p.stock <= 10).slice(0, 3);
  const topProducts = mockProducts
    .filter((p) => p.sellerId === "seller-2")
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "KES 427,000",
            sub: "+12% this month",
            icon: <IconTrendingUp size={20} />,
            color: "text-green-600 bg-green-50",
            positive: true,
          },
          {
            label: "Total Orders",
            value: "1,543",
            sub: "+8% this month",
            icon: <IconShoppingCart size={20} />,
            color: "text-blue-600 bg-blue-50",
            positive: true,
          },
          {
            label: "Active Products",
            value: "132",
            sub: "4 low in stock",
            icon: <IconPackage size={20} />,
            color: "text-orange-600 bg-orange-50",
            positive: false,
          },
          {
            label: "Store Rating",
            value: "4.6 / 5.0",
            sub: "216 total reviews",
            icon: <IconStar size={20} />,
            color: "text-yellow-600 bg-yellow-50",
            positive: true,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className={`text-xs font-medium mt-1.5 flex items-center gap-1 ${stat.positive ? "text-green-600" : "text-orange-600"}`}>
              {stat.positive && <IconArrowUp size={11} />}
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart (simple CSS bars) */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Revenue Overview</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Last 6 months</span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {REVENUE_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-medium">
                  {(d.revenue / 1000).toFixed(0)}k
                </span>
                <div
                  className="w-full bg-green-500 rounded-t-md transition-all hover:bg-green-600"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}px` }}
                />
                <span className="text-[10px] text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Top Products</h2>
            <Link href="/seller/products" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
              All Products <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-gray-400">{i + 1}.</span>
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <IconEye size={11} /> {p.views.toLocaleString()}
                    <span>&bull;</span>
                    {p.sales} sold
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">KES {p.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/seller/orders" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
            View All <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-2.5 text-left">Order ID</th>
                <th className="pb-2.5 text-left">Customer</th>
                <th className="pb-2.5 text-left">Items</th>
                <th className="pb-2.5 text-right">Amount</th>
                <th className="pb-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sellerOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 font-semibold text-gray-800">{order.id}</td>
                  <td className="py-3 text-gray-600">{order.customerName}</td>
                  <td className="py-3 text-gray-500">{order.items.length} item{order.items.length > 1 ? "s" : ""}</td>
                  <td className="py-3 text-right font-bold text-gray-900">KES {order.total.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock alerts */}
      {lowStock.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconAlertTriangle size={18} className="text-orange-600" />
            <h2 className="font-bold text-orange-800">Low Stock Alerts</h2>
          </div>
          <div className="space-y-2">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-orange-100">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-orange-600 font-semibold">Only {p.stock} left</p>
                  </div>
                </div>
                <Link href={`/seller/products`} className="text-xs text-green-600 font-semibold hover:underline">
                  Restock
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
