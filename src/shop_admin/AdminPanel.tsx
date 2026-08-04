"use client";
import { useState, useCallback } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Monitor,
  ClipboardList, Wallet, Users, Settings as SettingsIcon, Ticket,
} from "lucide-react";
import type {
  AdminView, AdminProduct, AdminOrder, SubAdmin, AccountingEntry,
  StockMovement, POSSession, POSTransaction, Subscription,
  Shop, Toast, AdminPrivilege, DashboardNavOptions,
} from "./types/index";

import {
  MOCK_ADMIN, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_STAFF,
  MOCK_ACCOUNTING, MOCK_STOCK_MOVEMENTS, MOCK_POS_SESSIONS,
  MOCK_POS_TRANSACTIONS, MOCK_SUBSCRIPTION, SUBSCRIPTION_PLANS,
  MOCK_TOP_PRODUCTS,
} from "./constants/mockData";
import { genId } from "./utils/helpers";
import { getLogoIcon } from "@/lib/logoIcons";

import ToastContainer from "./components/layout/ToastContainer";
import DashboardShell, { type ShellItem } from "@/components/dashboard/DashboardShell";
import Dashboard      from "./components/dashboard/Dashboard";
import ProductsView   from "./components/products/ProductsView";
import OrdersView     from "./components/orders/OrdersView";
import POSView        from "./components/POS/POSView";
import InventoryView  from "./components/inventory/InventoryView";
import AccountingView from "./components/accounting/AccountingView";
import StaffView      from "./components/staff/StaffView";
import SettingsView   from "./components/Setting/SettingsView";
import SubscriptionView from "./components/Subscription/SubscriptionView";

const INITIAL_SHOP: Shop = {
  id: "shop_001",
  name: "FreshMart",
  tagline: "Farm to doorstep, every day.",
  logoIcon: "ShoppingCart",
  address: "Westlands, Nairobi, Kenya",
  phone: "+254 700 123 456",
  email: "hello@freshmart.co.ke",
  currency: "KES",
  timezone: "Africa/Nairobi",
};

const NAV_ITEMS: { view: AdminView; label: string; icon: typeof LayoutDashboard; privilege: AdminPrivilege | null }[] = [
  { view: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, privilege: null },
  { view: "products",     label: "Products",     icon: ShoppingBag, privilege: "products" },
  { view: "orders",       label: "Orders",       icon: Package, privilege: "orders" },
  { view: "pos",          label: "Point of Sale", icon: Monitor, privilege: "pos" },
  { view: "inventory",    label: "Inventory",    icon: ClipboardList, privilege: "inventory" },
  { view: "accounting",   label: "Accounting",   icon: Wallet, privilege: "accounting" },
  { view: "staff",        label: "Staff",        icon: Users, privilege: "staff" },
  { view: "subscription", label: "Subscription", icon: Ticket, privilege: "subscription" },
];

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [navIntent, setNavIntent] = useState<DashboardNavOptions>({});
  const goTo = useCallback((view: AdminView, opts?: DashboardNavOptions) => {
    setNavIntent(opts ?? {});
    setActiveView(view);
  }, []);

  const [shop, setShop] = useState<Shop>(INITIAL_SHOP);

  const [products, setProducts] = useState<AdminProduct[]>(MOCK_PRODUCTS);

  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS);

  const [staff, setStaff] = useState<SubAdmin[]>(MOCK_STAFF);
  const [accounting, setAccounting] = useState<AccountingEntry[]>(MOCK_ACCOUNTING);

  const [movements, setMovements] = useState<StockMovement[]>(MOCK_STOCK_MOVEMENTS);

  const [posSessions, setPosSessions] = useState<POSSession[]>(MOCK_POS_SESSIONS);
  const [posTransactions, setPosTransactions] = useState<POSTransaction[]>(MOCK_POS_TRANSACTIONS);

  const [subscription, setSubscription] = useState<Subscription>(MOCK_SUBSCRIPTION);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = genId("toast");
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  const dismissToast = (id: string) => setToasts(t => t.filter(x => x.id !== id));

  const updateStock = (productId: number, delta: number) => {
    setProducts(ps => ps.map(p =>
      p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));
  };

  const pendingOrders = orders.filter(o =>
    o.status === "Pending" || o.status === "Under Processing"
  ).length;
  const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;

  const isSuperAdmin = MOCK_ADMIN.role === "superadmin";
  const canAccess = (privilege: AdminPrivilege | null): boolean =>
    isSuperAdmin || privilege === null || MOCK_ADMIN.privileges.includes(privilege);

  const badgeFor = (view: AdminView): number | undefined => {
    if (view === "orders") return pendingOrders > 0 ? pendingOrders : undefined;
    if (view === "inventory") return lowStockCount > 0 ? lowStockCount : undefined;
    return undefined;
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            orders={orders}
            products={products}
            topProducts={MOCK_TOP_PRODUCTS}
            movements={movements}
            subscription={subscription}
            plans={SUBSCRIPTION_PLANS}
            accounting={accounting}
            staffCount={staff.length}
            onNavigate={goTo}
          />
        );
      case "products":
        return <ProductsView onToast={toast} openAddOnMount={navIntent.openAddProduct} focusLowStock={navIntent.lowStockOnly} />;
      case "orders":
        return (
          <OrdersView
            orders={orders}
            onUpdate={setOrders}
            onToast={toast}
            initialPaymentFilter={navIntent.paymentFilter}
          />
        );
      case "pos":
        return (
          <POSView
            products={products}
            sessions={posSessions}
            transactions={posTransactions}
            currentUserId={MOCK_ADMIN.id}
            currentUserName={MOCK_ADMIN.name}
            onSessions={setPosSessions}
            onTransactions={setPosTransactions}
            onStockUpdate={updateStock}
            onToast={toast}
          />
        );
      case "inventory":
        return (
          <InventoryView
            products={products}
            movements={movements}
            currentUserId={MOCK_ADMIN.id}
            currentUserName={MOCK_ADMIN.name}
            onProducts={setProducts}
            onMovements={setMovements}
            onToast={toast}
          />
        );
      case "accounting":
        return (
          <AccountingView
            entries={accounting}
            currentUserId={MOCK_ADMIN.id}
            onEntries={setAccounting}
            onToast={toast}
          />
        );
      case "staff":
        return (
          <StaffView
            staff={staff}
            onStaff={setStaff}
            onToast={toast}
          />
        );
      case "settings":
        return (
          <SettingsView
            shop={shop}
            onShop={setShop}
            onToast={toast}
          />
        );
      case "subscription":
        return (
          <SubscriptionView
            subscription={subscription}
            plans={SUBSCRIPTION_PLANS}
            onSubscription={setSubscription}
            onToast={toast}
          />
        );
      default:
        return null;
    }
  };

  const railItems: ShellItem[] = NAV_ITEMS.filter((item) => canAccess(item.privilege)).map((item) => ({
    key: item.view,
    label: item.label,
    icon: item.icon,
    active: activeView === item.view,
    onClick: () => goTo(item.view),
    badge: badgeFor(item.view),
  }));

  return (
    <>
      <DashboardShell
        brand={{ name: shop.name, icon: getLogoIcon(shop.logoIcon) }}
        railItems={railItems}
        navItems={[]}
        user={{ name: MOCK_ADMIN.name, email: MOCK_ADMIN.email, avatarUrl: null }}
        onSettingsClick={() => goTo("settings")}
      >
        {renderView()}
      </DashboardShell>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
