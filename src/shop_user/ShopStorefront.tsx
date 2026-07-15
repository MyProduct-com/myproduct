"use client";

import { useState, useMemo, useEffect } from "react";
import type { User, Theme, CartItem, Order, PlacedOrderPayload } from "./types/index";
import { genOrderId } from "./utils/helpers";
import { useProductStore } from "@/store/productStore";
import type { SharedProduct } from "@/store/productStore";

import Header        from "./components/Header";
import ProductCard   from "./components/ProductCard";
import ProductModal  from "./components/ProductModal";
import CartModal     from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrdersView    from "./components/OrdersView";
import AuthModal     from "./components/AuthModal";
import Footer        from "./components/Footer";
import { useThemeStore } from "@/store/themeStore";

type ActiveTab = "shop" | "orders";

interface ShopStorefrontProps {
  initialTheme?: Partial<Theme>;
}

export default function ShopStorefront({ initialTheme = {} }: ShopStorefrontProps) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const storeTheme = useThemeStore((s) => s.theme);
  const theme = { ...storeTheme, ...initialTheme } as Theme;

  // ── Shared product store — reads only published + in-stock products ────────
  // FIX: select the raw `products` array (stable reference from Zustand) instead
  // of calling `getShopProducts()` inline as the selector. Calling a method that
  // does `.filter(...)` inside the selector returns a brand-new array on every
  // render/snapshot check, which triggers the
  // "getServerSnapshot should be cached to avoid an infinite loop" error.
  const products = useProductStore((s) => s.products);

  const shopProducts = useMemo(
    () => products.filter((p) => p.published && p.stock > 0),
    [products]
  );

  // ── Auth ───────────────────────────────────────────────────────────────────
  const [user, setUser]             = useState<User | null>(null);
  const [showAuth, setShowAuth]     = useState(false);
  const [authInitMode, setAuthInitMode] = useState<"login" | "signup">("login");

  // ── Tab ────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>("shop");

  // ── Cart ───────────────────────────────────────────────────────────────────
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [showCart, setShowCart]   = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // ── Product modal ──────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<SharedProduct | null>(null);

  // ── Search ─────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  // ── Orders ─────────────────────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);

  // ── UI helpers ─────────────────────────────────────────────────────────────
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mounted, setMounted]             = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Auth handlers ──────────────────────────────────────────────────────────
  const openLogin  = () => { setAuthInitMode("login");  setShowAuth(true); };
  const openSignup = () => { setAuthInitMode("signup"); setShowAuth(true); };
  const handleAuth = (u: User) => { setUser(u); setShowAuth(false); };

  // ── Cart helpers ───────────────────────────────────────────────────────────
  const getCartItem = (id: number) => cart.find((c) => c.productId === id);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const cartTotal = cart.reduce((s, i) => {
    const p = shopProducts.find((p) => p.id === i.productId);
    return s + (p ? p.price * i.qty : 0);
  }, 0);

  const addToCart = (id: number) =>
    setCart((c) =>
      c.find((i) => i.productId === id) ? c : [...c, { productId: id, qty: 1 }]
    );

  const increaseQty = (id: number) =>
    setCart((c) => c.map((i) => i.productId === id ? { ...i, qty: i.qty + 1 } : i));

  const decreaseQty = (id: number) =>
    setCart((c) => {
      const item = c.find((i) => i.productId === id);
      if (!item) return c;
      return item.qty <= 1
        ? c.filter((i) => i.productId !== id)
        : c.map((i) => i.productId === id ? { ...i, qty: i.qty - 1 } : i);
    });

  // ── Order handler ──────────────────────────────────────────────────────────
  const handleOrderPlaced = ({ items, total, payMethod }: PlacedOrderPayload) => {
    setOrders((o) => [{
      id:        genOrderId(),
      date:      new Date().toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
      items,     total, payMethod,
      status:    "Under Processing",
      payStatus: payMethod === "cod" ? "Pending" : "Paid",
    }, ...o]);
    setCart([]);
    setShowCheckout(false);
  };

  // ── Filtered products (search) ─────────────────────────────────────────────
  const filtered = useMemo(() =>
    shopProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    ),
    [shopProducts, search]
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: theme.fontFamily, color: theme.text }}>

      {/* Header */}
      <Header
        theme={theme}
        user={user}
        cartCount={cartCount}
        onCartOpen={() => setShowCart(true)}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onSignOut={() => setUser(null)}
        onThemeEdit={() => {}}
      />

      {/* Announcement bar */}
      <div
        className="hidden sm:block text-center text-xs font-medium py-2 px-4 tracking-wide"
        style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, color: theme.accent }}
      >
        {theme.shopTagline} &nbsp;·&nbsp; Free delivery on orders over KSh 500 &nbsp;·&nbsp;
        <span className="font-semibold">Same-day delivery in Nairobi</span>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="flex gap-1" style={{ borderBottom: `2px solid ${theme.border}` }}>
          {(["shop", "orders"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 text-sm font-semibold transition-colors capitalize"
              style={{
                color:            activeTab === tab ? theme.primary : theme.textMuted,
                background:       "none",
                border:           "none",
                borderBottom:     activeTab === tab ? `2.5px solid ${theme.primary}` : "2.5px solid transparent",
                marginBottom:     -2,
                cursor:           "pointer",
              }}
            >
              {tab === "orders" ? "📦 My Orders" : "🏪 Marketplace"}
              {tab === "orders" && orders.length > 0 && (
                <span
                  className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: theme.primary }}
                >
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-32">

        {/* ── Shop tab ── */}
        {activeTab === "shop" && (
          <>
            {/* Search */}
            <div className="py-4">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
                style={{ borderColor: theme.border, background: theme.surface }}
              >
                <span className="text-lg shrink-0">🔍</span>
                <input
                  type="text"
                  placeholder="Search products…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: theme.text }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-lg shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: theme.textMuted }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
                {search && (
                  <span className="ml-1">
                    for &ldquo;<strong style={{ color: theme.primary }}>{search}</strong>&rdquo;
                  </span>
                )}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs font-medium hover:underline"
                  style={{ color: theme.primary }}
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Product grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filtered.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    theme={theme}
                    cartItem={getCartItem(p.id)}
                    onAdd={() => addToCart(p.id)}
                    onIncrease={() => increaseQty(p.id)}
                    onDecrease={() => decreaseQty(p.id)}
                    onClick={() => setSelectedProduct(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">
                  {search ? "🔍" : "🛒"}
                </div>
                <p className="text-base font-semibold mb-1" style={{ color: theme.text }}>
                  {search ? "No products found" : "No products available yet"}
                </p>
                <p className="text-sm mb-4" style={{ color: theme.textMuted }}>
                  {search
                    ? "Try a different search term"
                    : "The shop admin hasn't published any products yet"}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: theme.primary }}
                  >
                    Show all products
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Orders tab ── */}
        {activeTab === "orders" && (
          orders.length > 0 ? (
            <div className="pt-4">
              <OrdersView orders={orders} theme={theme} />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-base font-semibold mb-1" style={{ color: theme.text }}>
                No orders yet
              </p>
              <p className="text-sm mb-5" style={{ color: theme.textMuted }}>
                Your orders will appear here after checkout
              </p>
              <button
                onClick={() => setActiveTab("shop")}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: theme.primary }}
              >
                Start shopping
              </button>
            </div>
          )
        )}
      </main>

      {/* Floating cart bar — mobile only */}
      {mounted && cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 sm:hidden">
          <button
            onClick={() => setShowCart(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-white shadow-xl"
            style={{ background: theme.primary }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ color: theme.primary }}
              >
                {cartCount}
              </div>
              <span className="text-sm font-medium">
                {cartCount} item{cartCount > 1 ? "s" : ""} in cart
              </span>
            </div>
            <span className="text-sm font-semibold">
              KSh {cartTotal.toLocaleString()} →
            </span>
          </button>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 sm:bottom-6 z-40 w-10 h-10 rounded-full shadow-md flex items-center justify-center text-lg bg-white border"
          style={{ borderColor: theme.border, color: theme.primary }}
        >
          ↑
        </button>
      )}

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          theme={theme}
          cartItem={getCartItem(selectedProduct.id)}
          onAdd={() => addToCart(selectedProduct.id)}
          onIncrease={() => increaseQty(selectedProduct.id)}
          onDecrease={() => decreaseQty(selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCart && (
        <CartModal
          cart={cart}
          products={shopProducts}
          theme={theme}
          onClose={() => setShowCart(false)}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onClear={() => setCart([])}
          onCheckout={() => { setShowCart(false); setShowCheckout(true); }}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          cart={cart}
          products={shopProducts}
          theme={theme}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {showAuth && (
        <AuthModal
          theme={theme}
          initialMode={authInitMode}
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      <Footer
        theme={theme}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onCartOpen={() => setShowCart(true)}
      />
    </div>
  );
}