"use client";
import { IconTrendingUp, IconEye, IconShoppingCart, IconStar } from "@tabler/icons-react";
import { mockProducts, mockOrders } from "@/lib/mock-data";

const MONTHLY_DATA = [
  { month: "Jan", revenue: 42000, orders: 84 },
  { month: "Feb", revenue: 58000, orders: 112 },
  { month: "Mar", revenue: 71000, orders: 138 },
  { month: "Apr", revenue: 55000, orders: 101 },
  { month: "May", revenue: 89000, orders: 172 },
  { month: "Jun", revenue: 112000, orders: 218 },
];

const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue));
const maxOrders = Math.max(...MONTHLY_DATA.map((d) => d.orders));

const ORDER_STATUS_DATA = [
  { label: "Delivered", count: 87, color: "bg-green-500" },
  { label: "Processing", count: 34, color: "bg-purple-500" },
  { label: "Shipped", count: 21, color: "bg-blue-500" },
  { label: "Pending", count: 15, color: "bg-yellow-500" },
  { label: "Cancelled", count: 7, color: "bg-red-500" },
];
const totalOrders = ORDER_STATUS_DATA.reduce((s, d) => s + d.count, 0);

export default function SellerAnalyticsPage() {
  const topProducts = [...mockProducts]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "KES 427,000", icon: <IconTrendingUp size={20} />, color: "text-green-600 bg-green-50", change: "+12%" },
          { label: "Total Views", value: "24,840", icon: <IconEye size={20} />, color: "text-blue-600 bg-blue-50", change: "+18%" },
          { label: "Conversion Rate", value: "4.2%", icon: <IconShoppingCart size={20} />, color: "text-orange-600 bg-orange-50", change: "+0.3%" },
          { label: "Avg Rating", value: "4.6 / 5.0", icon: <IconStar size={20} />, color: "text-yellow-600 bg-yellow-50", change: "+0.1" },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              {k.icon}
            </div>
            <p className="text-xl font-bold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            <p className="text-xs font-semibold text-green-600 mt-1.5">{k.change} vs last month</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-bold text-gray-900">Monthly Revenue</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Jan – Jun 2024</span>
          </div>
          <p className="text-xs text-gray-400 mb-5">Revenue trend over the last 6 months</p>
          <div className="flex items-end gap-3 h-44">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-gray-400">{(d.revenue / 1000).toFixed(0)}k</span>
                <div
                  className="w-full bg-green-500 hover:bg-green-600 rounded-t-lg transition-colors cursor-pointer"
                  style={{ height: `${(d.revenue / maxRevenue) * 140}px` }}
                  title={`KES ${d.revenue.toLocaleString()}`}
                />
                <span className="text-[11px] text-gray-500 font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-900 mb-1">Orders by Status</h2>
          <p className="text-xs text-gray-400 mb-5">Last 6 months breakdown</p>
          <div className="space-y-3">
            {ORDER_STATUS_DATA.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="text-gray-900 font-semibold">
                    {item.count} <span className="text-gray-400 font-normal">({Math.round((item.count / totalOrders) * 100)}%)</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${item.color}`}
                    style={{ width: `${(item.count / totalOrders) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="font-bold text-gray-900 mb-4">Best Performing Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-2.5 text-left">Product</th>
                <th className="px-4 py-2.5 text-right">Views</th>
                <th className="px-4 py-2.5 text-right">Sales</th>
                <th className="px-4 py-2.5 text-right">Revenue</th>
                <th className="px-4 py-2.5 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{p.sales}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    KES {(p.sales * p.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-yellow-600 font-semibold">{p.rating}</span>
                    <span className="text-gray-400 text-xs"> /5</span>
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
