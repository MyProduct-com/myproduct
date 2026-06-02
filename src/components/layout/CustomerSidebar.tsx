"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconPackage,
  IconHeart,
  IconUser,
  IconMapPin,
  IconArrowLeft,
} from "@tabler/icons-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "My Orders", icon: IconPackage },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: IconHeart },
  { href: "/dashboard/profile", label: "My Profile", icon: IconUser },
  { href: "/dashboard/addresses", label: "Addresses", icon: IconMapPin },
];

export default function CustomerSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200">
      <div className="p-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
          My Account
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
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <IconArrowLeft size={17} className="text-gray-400" />
            Back to Shop
          </Link>
        </div>
      </div>
    </aside>
  );
}
