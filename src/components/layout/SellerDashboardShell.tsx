"use client";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, ShoppingBag, Plus } from "lucide-react";
import DashboardShell, { type ShellItem } from "@/components/dashboard/DashboardShell";

const RAIL_ITEMS: ShellItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/seller", exact: true },
  { key: "products", label: "Products", icon: Package, href: "/seller/products" },
  { key: "orders", label: "Orders", icon: ShoppingCart, href: "/seller/orders" },
  { key: "analytics", label: "Analytics", icon: BarChart3, href: "/seller/analytics" },
  { key: "settings", label: "Settings", icon: Settings, href: "/seller/settings" },
];

interface Props {
  user: { name: string; email?: string | null; avatarUrl?: string | null };
  children: React.ReactNode;
}

export default function SellerDashboardShell({ user, children }: Props) {
  const router = useRouter();

  return (
    <DashboardShell
      brand={{ name: "MyProduct Seller", icon: ShoppingBag }}
      railItems={RAIL_ITEMS}
      navItems={[]}
      user={user}
      onSettingsClick={() => router.push("/seller/settings")}
      headerExtra={
        <a
          href="/seller/products/add"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-org-pill bg-org-primary text-white text-org-xs font-org-semibold hover:bg-org-primary-hover transition-colors"
        >
          <Plus size={14} /> Add Product
        </a>
      }
    >
      {children}
    </DashboardShell>
  );
}
