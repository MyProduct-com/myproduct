import { useState, useCallback } from "react";
import type {
  AdminView, AdminProduct, AdminOrder, SubAdmin, AccountingEntry,
  StockMovement, POSSession, POSTransaction, Subscription, Theme,
  Shop, Toast,
} from "./types/index";

import { ADMIN_THEME, SIDEBAR_WIDTH, HEADER_HEIGHT } from "./data/theme";
import {
  MOCK_ADMIN, MOCK_PRODUCTS, MOCK_ORDERS, MOCK_STAFF,
  MOCK_ACCOUNTING, MOCK_STOCK_MOVEMENTS, MOCK_POS_SESSIONS,
  MOCK_POS_TRANSACTIONS, MOCK_SUBSCRIPTION, SUBSCRIPTION_PLANS,
  MOCK_DAILY_STATS, MOCK_TOP_PRODUCTS,
} from "./constants/mockData";
import { genId } from "./utils/helpers";

import AdminHeader    from "./components/layout/adminHeader";
import Sidebar        from "./components/layout/sidebar";
import ToastContainer from "./components/layout/ToastContainer";
import Dashboard      from "./components/dashboard/dashboard";
import ProductsView   from "./components/products/ProductsView";
import OrdersView     from "./components/orders/OrdersView";
import POSView        from "./components/POS/PosView";
import InventoryView  from "./components/inventory/InventoryView";
import AccountingView from "./components/accounting/AccountingView";
import StaffView      from "./components/staff/StaffView";
import SettingsView   from "./components/Setting/SettingsView";
import SubscriptionView from "./components/Subscription/SubscriptionView";

const INITIAL_SHOP: Shop = {
  id: "shop_001",
  name: "FreshMart",
  tagline: "Farm to doorstep, every day.",
  logoEmoji: "🛒",
  address: "Westlands, Nairobi, Kenya",
  phone: "+254 700 123 456",
  email: "hello@freshmart.co.ke",
  currency: "KES",
  timezone: "Africa/Nairobi",
};

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  const [theme, setTheme] = useState<Theme>(ADMIN_THEME);
  const updateTheme = (key: keyof Theme, val: string) =>
    setTheme(t => ({ ...t, [key]: val }));
  const resetTheme = () => setTheme(ADMIN_THEME);

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

  const handleSignOut = () => toast("Signed out. (demo — refresh to reset)", "info");

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            theme={theme}
            orders={orders}
            products={products}
            dailyStats={MOCK_DAILY_STATS}
            topProducts={MOCK_TOP_PRODUCTS}
          />
        );
      case "products":
        return (
          <ProductsView
            theme={theme}
            products={products}
            onUpdate={setProducts}
            onToast={toast}
          />
        );
      case "orders":
        return (
          <OrdersView
            theme={theme}
            orders={orders}
            onUpdate={setOrders}
            onToast={toast}
          />
        );
      case "pos":
        return (
          <POSView
            theme={theme}
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
            theme={theme}
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
            theme={theme}
            entries={accounting}
            currentUserId={MOCK_ADMIN.id}
            onEntries={setAccounting}
            onToast={toast}
          />
        );
      case "staff":
        return (
          <StaffView
            theme={theme}
            staff={staff}
            onStaff={setStaff}
            onToast={toast}
          />
        );
      case "settings":
        return (
          <SettingsView
            theme={theme}
            shop={shop}
            onTheme={updateTheme}
            onThemeReset={resetTheme}
            onShop={setShop}
            onToast={toast}
          />
        );
      case "subscription":
        return (
          <SubscriptionView
            theme={theme}
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

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      fontFamily: theme.fontFamily,
      color: theme.text,
    }}>
      {/* Fixed Header */}
      <AdminHeader
        admin={MOCK_ADMIN}
        shop={{ ...INITIAL_SHOP, name: shop.name, logoEmoji: shop.logoEmoji }}
        theme={theme}
        onSignOut={handleSignOut}
      />

      {/* Fixed Sidebar */}
      <Sidebar
        active={activeView}
        privileges={MOCK_ADMIN.privileges}
        isSuperAdmin={MOCK_ADMIN.role === "superadmin"}
        theme={theme}
        pendingOrders={pendingOrders}
        lowStockCount={lowStockCount}
        onNavigate={setActiveView}
      />

      {/* Main scrollable content */}
      <main style={{
        marginLeft: SIDEBAR_WIDTH,
        marginTop: HEADER_HEIGHT,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        padding: 28,
        boxSizing: "border-box",
      }}>
        {renderView()}
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
