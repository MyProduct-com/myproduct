"use client";

import Link from "next/link";
import {
  IconTrendingUp, IconShoppingBag, IconPackage,
  IconUsers, IconArrowUp, IconArrowDown,
  IconEye, IconClock, IconCircleCheck,
  IconTruck, IconAlertTriangle,
} from "@tabler/icons-react";
import { mockProducts } from "@/lib/mock-products";

const metrics = [
  { label: "Revenue (30d)", value: "KES 84,200", delta: "+12.4%", up: true,  icon: IconTrendingUp,  color: "text-brand-600",   bg: "bg-brand-50"   },
  { label: "Total Orders",  value: "247",         delta: "+8.1%",  up: true,  icon: IconShoppingBag, color: "text-blue-600",    bg: "bg-blue-50"    },
  { label: "Products",      value: "138",         delta: "14 low", up: false, icon: IconPackage,     color: "text-amber-600",   bg: "bg-amber-50"   },
  { label: "Customers",     value: "1,042",       delta: "+34",    up: true,  icon: IconUsers,       color: "text-purple-600",  bg: "bg-purple-50"  },
];

const recentOrders = [
  { id: "#ORD-2854", customer: "Amina K.",   amount: "KES 2,400", status: "pending",    time: "3 min ago",  avatar: "AK" },
  { id: "#ORD-2853", customer: "Brian M.",   amount: "KES 850",   status: "processing", time: "18 min ago", avatar: "BM" },
  { id: "#ORD-2852", customer: "Cynthia O.", amount: "KES 6,100", status: "shipped",    time: "1 hr ago",   avatar: "CO" },
  { id: "#ORD-2851", customer: "David N.",   amount: "KES 1,200", status: "delivered",  time: "2 hr ago",   avatar: "DN" },
  { id: "#ORD-2850", customer: "Esther W.",  amount: "KES 3,500", status: "pending",    time: "3 hr ago",   avatar: "EW" },
];

const statusConfig: Record<string, { label: string; className: string; Icon: React.ElementType }> = {
  pending:    { label: "Pending",    className: "bg-blue-50 text-blue-700",    Icon: IconClock         },
  processing: { label: "Processing", className: "bg-amber-50 text-amber-700",  Icon: IconClock         },
  shipped:    { label: "Shipped",    className: "bg-purple-50 text-purple-700", Icon: IconTruck        },
  delivered:  { label: "Delivered",  className: "bg-brand-50 text-brand-700",  Icon: IconCircleCheck   },
  cancelled:  { label: "Cancelled",  className: "bg-red-50 text-red-700",      Icon: IconAlertTriangle },
};

const quickLinks = [
  { label: "Add product",     href: "/dashboard/products/add", emoji: "📦" },
  { label: "View orders",     href: "/dashboard/orders",       emoji: "🛍️" },
  { label: "Open storefront", href: "/store/greenstore",       emoji: "🏪" },
  { label: "Analytics",       href: "/dashboard/analytics",    emoji: "📊" },
];

const lowStock   = mockProducts.filter((p) => p.stock > 0 && p.stock <= 10);
const topProducts = [...mockProducts].sort((a, b) => b.sales - a.sales).slice(0, 4);

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-medium text-gray-900">
            Good morning 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with GreenStore KE today.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/store/greenstore"
            className="flex items-center gap-2 text-sm font-medium bg-brand-50 text-brand-800 border border-brand-200 px-4 py-2 rounded-lg hover:bg-brand-100 transition-colors">
            <IconEye size={15} /> View storefront
          </Link>
          <Link href="/dashboard/products/add"
            className="flex items-center gap-2 text-sm font-medium bg-brand-800 text-white px-4 py-2 rounded-lg hover:bg-brand-900 transition-colors">
            <IconPackage size={15} /> Add product
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-black/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{m.label}</span>
                <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center`}>
                  <Icon size={15} className={m.color} />
                </div>
              </div>
              <div>
                <div className="text-2xl font-medium text-gray-900">{m.value}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${m.up ? "text-brand-600" : "text-amber-600"}`}>
                  {m.up ? <IconArrowUp size={11} /> : <IconArrowDown size={11} />}
                  {m.delta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickLinks.map((q) => (
          <Link key={q.href} href={q.href}
            className="bg-white border border-black/10 rounded-xl p-4 flex items-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all group">
            <span className="text-2xl">{q.emoji}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-brand-800">{q.label}</span>
          </Link>
        ))}
      </div>

      {/* Orders + Store snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Orders table */}
        <div className="lg:col-span-2 bg-white border border-black/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
            <div className="text-sm font-medium text-gray-900">Recent orders</div>
            <Link href="/dashboard/orders" className="text-xs text-brand-800 hover:underline">
              View all →
            </Link>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-black/5">
            {recentOrders.map((o) => {
              const s = statusConfig[o.status];
              return (
                <div key={o.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-800 flex items-center justify-center text-[11px] font-medium shrink-0">
                    {o.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{o.id}</div>
                    <div className="text-xs text-gray-400">{o.customer} · {o.time}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-medium text-gray-900">{o.amount}</div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.className}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-black/10">
                  {["Order", "Customer", "Amount", "Status", "Time"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((o) => {
                  const s = statusConfig[o.status];
                  const SIcon = s.Icon;
                  return (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{o.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-50 text-brand-800 flex items-center justify-center text-[10px] font-medium shrink-0">
                            {o.avatar}
                          </div>
                          <span className="text-gray-700">{o.customer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">{o.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
                          <SIcon size={10} />{s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{o.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Store card */}
          <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-br from-brand-800 to-brand-600 p-4 text-white">
              <div className="font-display text-lg font-medium">
                My<span className="text-brand-200">Products</span>
              </div>
              <div className="text-xs text-brand-200 mt-0.5 mb-3">GreenStore KE · ● Live</div>
              <div className="flex gap-2 flex-wrap">
                <div className="bg-white/15 rounded-lg px-2.5 py-1 text-xs">138 products</div>
                <div className="bg-white/15 rounded-lg px-2.5 py-1 text-xs">247 orders</div>
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: "Today visits", value: "84"      },
                { label: "Conversion",   value: "6.6%"    },
                { label: "Avg order",    value: "KES 341" },
                { label: "Rating",       value: "4.8 ⭐"  },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-[11px] text-gray-500">{s.label}</div>
                  <div className="text-sm font-medium text-gray-900 mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="px-3 pb-3">
              <Link href="/store/greenstore"
                className="w-full flex items-center justify-center gap-2 bg-brand-800 hover:bg-brand-900 text-white text-xs font-medium py-2.5 rounded-lg transition-colors">
                🏪 Open storefront
              </Link>
            </div>
          </div>

          {/* Low stock */}
          {lowStock.length > 0 && (
            <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-black/10">
                <IconAlertTriangle size={14} className="text-amber-500" />
                <div className="text-sm font-medium text-gray-900">Low stock</div>
                <span className="ml-auto text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {lowStock.length} items
                </span>
              </div>
              <div className="divide-y divide-black/5">
                {lowStock.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="text-xl shrink-0">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">{p.name}</div>
                      <div className="text-[11px] text-amber-600">{p.stock} units left</div>
                    </div>
                    <Link href="/dashboard/products"
                      className="text-[11px] text-brand-800 hover:underline shrink-0">
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top selling */}
      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
          <div className="text-sm font-medium text-gray-900">Top selling products</div>
          <Link href="/dashboard/products" className="text-xs text-brand-800 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-black/5">
          {topProducts.map((p, i) => (
            <div key={p.id} className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{p.icon}</span>
                <span className="text-xs text-gray-400">#{i + 1}</span>
              </div>
              <div className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                {p.name}
              </div>
              <div className="text-xs text-gray-500">{p.sales} sold</div>
              <div className="text-xs font-medium text-brand-800">
                KES {(p.sales * p.price).toLocaleString()} revenue
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}