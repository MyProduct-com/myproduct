"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  IconBell,
  IconSearch,
  IconUser,
  IconShoppingCart,
} from "@tabler/icons-react";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/products": "Products",
  "/dashboard/orders": "Orders",
  "/dashboard/customers": "Customers",
  "/dashboard/pos": "Point of Sale",
  "/dashboard/chat": "Customer Chat",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
};

export default function Topbar() {
  const pathname = usePathname();

  // Match exact route or closest parent route
  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles)
      .reverse()
      .find(([key]) => pathname.startsWith(key))?.[1] ??
    "MyProducts";

  return (
    <header className="h-14 shrink-0 border-b border-black/10 bg-white flex items-center px-4 md:px-5 gap-3 md:gap-4 pl-14 md:pl-5">

      {/* Page title */}
      <h1 className="text-sm font-medium text-gray-900 flex-1">
        {title}
      </h1>

      {/* Search */}
      <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-black/10 rounded-lg px-3 py-1.5 w-52">
        <IconSearch
          size={13}
          className="text-gray-400 shrink-0"
        />

        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-gray-700 outline-none w-full placeholder:text-gray-400"
        />
      </div>

      {/* Storefront Link */}
      <Link
        href="/store/greenstore"
        className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-800 border border-brand-200 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors"
      >
        <IconShoppingCart size={13} />
        View Store
      </Link>

      {/* Notifications */}
      <button className="relative w-8 h-8 rounded-lg border border-black/10 bg-white hover:bg-gray-50 flex items-center justify-center transition-colors">
        <IconBell
          size={15}
          className="text-gray-500"
        />

        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-400" />
      </button>

      {/* User Avatar */}
      <button className="w-8 h-8 rounded-lg bg-brand-800 text-white flex items-center justify-center text-xs font-medium hover:bg-brand-900 transition-colors">
        <IconUser size={14} />
      </button>

    </header>
  );
}