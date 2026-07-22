"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconLayoutDashboard, IconPackage, IconShoppingBag,
  IconUsers, IconCashRegister, IconMessageCircle,
  IconChartBar, IconSettings, IconWorld,
  IconPlus, IconChevronDown, IconMenu2, IconX,
} from "@tabler/icons-react";

const navItems = [
  { label: "Dashboard",  href: "/dashboard",            icon: IconLayoutDashboard },
  { label: "Products",   href: "/dashboard/products",   icon: IconPackage         },
  { label: "Orders",     href: "/dashboard/orders",     icon: IconShoppingBag     },
  { label: "Customers",  href: "/dashboard/customers",  icon: IconUsers           },
  { label: "POS",        href: "/dashboard/pos",        icon: IconCashRegister    },
  { label: "Chat",       href: "/dashboard/chat",       icon: IconMessageCircle   },
  { label: "Analytics",  href: "/dashboard/analytics",  icon: IconChartBar        },
  { label: "Settings",   href: "/dashboard/settings",   icon: IconSettings        },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-black/10 flex items-center justify-between">
        <Link href="/dashboard" className="font-display text-lg font-medium text-brand-800">
          My<span className="text-brand-400">Products</span>
        </Link>
        <button className="md:hidden" onClick={() => setOpen(false)}>
          <IconX size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Shop pill */}
      <div className="px-3 py-3 border-b border-black/10">
        <button className="w-full flex items-center gap-2 bg-brand-50 rounded-lg px-2 py-2 hover:bg-brand-100 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-brand-800 text-white flex items-center justify-center text-xs font-medium shrink-0">G</div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-xs font-medium text-brand-800 truncate">GreenStore KE</div>
            <div className="text-[11px] text-brand-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 inline-block" />Live
            </div>
          </div>
          <IconChevronDown size={14} className="text-brand-600 shrink-0" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-brand-50 text-brand-800 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}>
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-black/10">
        <a href="/store/greenstore" target="_blank" rel="noreferrer"
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-800 px-2 py-1.5 rounded-lg hover:bg-brand-50 transition-colors">
          <IconWorld size={14} />View storefront
        </a>
        <Link href="/dashboard/products/add"
          className="mt-1 w-full flex items-center justify-center gap-1.5 bg-brand-800 hover:bg-brand-900 text-white text-xs font-medium py-2 rounded-lg transition-colors">
          <IconPlus size={13} />Add product
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 w-9 h-9 bg-white border border-black/10 rounded-lg flex items-center justify-center shadow-sm">
        <IconMenu2 size={18} className="text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`md:hidden fixed top-0 left-0 h-full w-55 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-50 shrink-0 h-screen sticky top-0 border-r border-black/10 bg-white flex-col">
        <NavContent />
      </aside>
    </>
  );
}