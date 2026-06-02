"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconBuildingStore,
  IconUsers,
  IconPackage,
  IconShoppingCart,
  IconTag,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard, exact: true },
  { href: "/admin/sellers", label: "Sellers", icon: IconBuildingStore, badge: 3 },
  { href: "/admin/users", label: "Users", icon: IconUsers },
  { href: "/admin/products", label: "Products", icon: IconPackage },
  { href: "/admin/orders", label: "Orders", icon: IconShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: IconTag },
  { href: "/admin/settings", label: "Settings", icon: IconSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 flex-shrink-0 bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center">
            <IconShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Admin Panel</p>
            <p className="text-xs text-gray-400">MyProducts Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3">
          Platform Management
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={17} />
                  {item.label}
                </span>
                {item.badge && !active && (
                  <span className="bg-orange-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        >
          View Marketplace
        </Link>
      </div>
    </aside>
  );
}
