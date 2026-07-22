"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconPackage,
  IconShoppingCart,
  IconChartBar,
  IconSettings,
  IconArrowLeft,
  IconBuildingStore,
  IconPlus,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";

const navItems = [
  { href: "/seller", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
  { href: "/seller/products", label: "Products", icon: IconPackage },
  { href: "/seller/orders", label: "Orders", icon: IconShoppingCart },
  { href: "/seller/analytics", label: "Analytics", icon: IconChartBar },
  { href: "/seller/settings", label: "Settings", icon: IconSettings },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Store info */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
            <IconBuildingStore size={20} className="text-green-700" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name ?? "Your Store"}
            </p>
            <p className="text-xs text-green-600 font-medium">Seller Dashboard</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        {/* Quick action */}
        <Link
          href="/seller/products/add"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold mb-4 transition-colors"
        >
          <IconPlus size={16} />
          Add Product
        </Link>

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          Manage Store
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  size={17}
                  className={active ? "text-green-600" : "text-gray-400"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <IconArrowLeft size={17} className="text-gray-400" />
          Back to Marketplace
        </Link>
      </div>
    </aside>
  );
}
