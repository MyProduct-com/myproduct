"use client";
import Link from "next/link";
import {
  IconUsers,
  IconBuildingStore,
  IconShoppingCart,
  IconTrendingUp,
  IconArrowRight,
  IconArrowUp,
  IconClock,
  IconCheck,
  IconX,
  IconShieldCheck,
} from "@tabler/icons-react";
import { mockOrders, mockSellers, mockCustomers, mockProducts } from "@/lib/mock-data";

const MONTHLY_GMV = [
  { month: "Jan", gmv: 180000 },
  { month: "Feb", gmv: 240000 },
  { month: "Mar", gmv: 310000 },
  { month: "Apr", gmv: 280000 },
  { month: "May", gmv: 390000 },
  { month: "Jun", gmv: 520000 },
];
const maxGMV = Math.max(...MONTHLY_GMV.map((d) => d.gmv));

const PENDING_SELLERS = mockSellers.filter((s) => !s.isVerified);

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminDashboard() {
  const totalRevenue = mockOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Admin dashboard, MyProducts Kenya</p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
          <IconShieldCheck size={15} />
          Admin
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Gross Merchandise Value",
            value: "KES 1.92M",
            sub: "+23% this month",
            icon: <IconTrendingUp size={20} />,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Total Orders",
            value: mockOrders.length.toString(),
            sub: "Across all sellers",
            icon: <IconShoppingCart size={20} />,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Active Sellers",
            value: mockSellers.length.toString(),
            sub: `${PENDING_SELLERS.length} awaiting approval`,
            icon: <IconBuildingStore size={20} />,
            color: "text-orange-600 bg-orange-50",
          },
          {
            label: "Registered Customers",
            value: (mockCustomers.length * 340).toLocaleString(),
            sub: "+142 this week",
            icon: <IconUsers size={20} />,
            color: "text-purple-600 bg-purple-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{stat.label}</p>
            <p className="text-xs font-semibold text-green-600 mt-1.5 flex items-center gap-1">
              <IconArrowUp size={10} />
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GMV chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Platform GMV</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Jan – Jun 2024</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Total gross merchandise value by month</p>
          <div className="flex items-end gap-2 h-36">
            {MONTHLY_GMV.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-400">{(d.gmv / 1000).toFixed(0)}k</span>
                <div
                  className="w-full bg-green-600 hover:bg-green-700 rounded-t-md transition-colors cursor-pointer"
                  style={{ height: `${(d.gmv / maxGMV) * 110}px` }}
                />
                <span className="text-[11px] text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending seller approvals */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Pending Seller Approvals</h2>
            <Link href="/admin/sellers" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
              All Sellers <IconArrowRight size={14} />
            </Link>
          </div>
          {PENDING_SELLERS.length === 0 ? (
            <div className="text-center py-8">
              <IconCheck size={32} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">All sellers are verified</p>
            </div>
          ) : (
            <div className="space-y-3">
              {PENDING_SELLERS.map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-700 font-bold text-sm">
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{s.storeName}</p>
                    <p className="text-xs text-gray-500 truncate">{s.email} &bull; {s.location}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors" title="Approve">
                      <IconCheck size={14} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-colors" title="Reject">
                      <IconX size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-sm text-green-600 font-semibold flex items-center gap-1 hover:underline">
            View All <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-2.5 text-left">Order ID</th>
                <th className="px-4 py-2.5 text-left">Customer</th>
                <th className="px-4 py-2.5 text-left">Seller</th>
                <th className="px-4 py-2.5 text-right">Amount</th>
                <th className="px-4 py-2.5 text-right">Payment</th>
                <th className="px-4 py-2.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">{order.id}</td>
                  <td className="px-4 py-3 text-gray-600">{order.customerName}</td>
                  <td className="px-4 py-3 text-gray-600">{order.items[0]?.sellerName}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">KES {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500 capitalize">
                    {order.paymentMethod.replace("_", " ")}
                  </td>
                  <td className="px-4 py-3 text-right">
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
    </div>
  );
}
