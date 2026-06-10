import { useState } from "react";

import type { Theme, CartItem, Order, User, Product, PlacedOrderPayload, CartItemResolved } from "./types/index.ts";
import { DEFAULT_THEME }  from "./data/theme";
import { MOCK_PRODUCTS }  from "./data/products";
import { genOrderId }     from "./utils/helpers";

import Header        from "./components/Header";
import ThemeEditor   from "./components/ThemeEditor";
import ProductCard   from "./components/ProductCard";
import ProductModal  from "./components/ProductModal";
import CartModal     from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrdersView    from "./components/OrdersView";
import AuthModal     from "./components/AuthModal";

type ActiveTab = "shop" | "orders";

interface ShopStorefrontProps {
  initialTheme?: Partial<Theme>;
}

export default function ShopStorefront({ initialTheme = {} }: ShopStorefrontProps) {
  const [theme, setTheme]                     = useState<Theme>({ ...DEFAULT_THEME, ...initialTheme });
  const [showThemeEditor, setShowThemeEditor] = useState<boolean>(false);

  const updateTheme = (key: keyof Theme | "__reset__", val?: string): void => {
    if (key === "__reset__") { setTheme({ ...DEFAULT_THEME }); return; }
    if (val !== undefined) setTheme(t => ({ ...t, [key]: val }));
  };

  const [user, setUser]             = useState<User | null>(null);
  const [showAuth, setShowAuth]     = useState<boolean>(false);
  const [authInitMode, setAuthInitMode] = useState<"login" | "signup">("login");

  const openLogin  = (): void => { setAuthInitMode("login");  setShowAuth(true); };
  const openSignup = (): void => { setAuthInitMode("signup"); setShowAuth(true); };
  const handleAuth = (u: User): void => { setUser(u); setShowAuth(false); };

  const [activeTab, setActiveTab] = useState<ActiveTab>("shop");

  const [cart, setCart]                       = useState<CartItem[]>([]);
  const [showCart, setShowCart]               = useState<boolean>(false);
  const [showCheckout, setShowCheckout]       = useState<boolean>(false);

  const getCartItem  = (id: number): CartItem | undefined => cart.find(c => c.productId === id);
  const addToCart    = (id: number): void => setCart(c => c.find(i => i.productId === id) ? c : [...c, { productId: id, qty: 1 }]);
  const increaseQty  = (id: number): void => setCart(c => c.map(i => i.productId === id ? { ...i, qty: i.qty + 1 } : i));
  const decreaseQty  = (id: number): void => setCart(c => {
    const item = c.find(i => i.productId === id);
    if (!item) return c;
    return item.qty <= 1
      ? c.filter(i => i.productId !== id)
      : c.map(i => i.productId === id ? { ...i, qty: i.qty - 1 } : i);
  });

  const [orders, setOrders] = useState<Order[]>([]);

  const handleOrderPlaced = ({ items, total, payMethod }: PlacedOrderPayload): void => {
    const newOrder: Order = {
      id:        genOrderId(),
      date:      new Date().toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" }),
      items,
      total,
      payMethod,
      status:    "Under Processing",
      payStatus: payMethod === "cod" ? "Pending" : "Paid",
    };
    setOrders(o => [newOrder, ...o]);
    setCart([]);
    setShowCheckout(false);
  };

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState<string>("");

  const filtered: Product[] = MOCK_PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.fontFamily, color: theme.text }}>
      {/* Header */}
      <Header
        theme={theme}
        user={user}
        cartCount={cart.length}
        onCartOpen={() => setShowCart(true)}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onSignOut={() => setUser(null)}
        onThemeEdit={() => setShowThemeEditor(true)}
      />

      {/* Tagline banner */}
      <div style={{ background: theme.surface, borderBottom: `1px solid ${theme.border}`, padding: "8px 20px", textAlign: "center", fontSize: 13, color: theme.accent, fontWeight: 500 }}>
        {theme.shopTagline}
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px 0" }}>
        <div style={{ display: "flex", gap: 4, borderBottom: `2px solid ${theme.border}`, marginBottom: 24 }}>
          {(["shop", "orders"] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "10px 20px", background: "none", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer",
                color: activeTab === tab ? theme.primary : theme.textMuted,
                borderBottom: activeTab === tab ? `2.5px solid ${theme.primary}` : "2px solid transparent",
                marginBottom: -2, textTransform: "capitalize", transition: "color 0.15s",
              }}
            >
              {tab === "orders" ? "📦 My Orders" : "🏪 Marketplace"}
              {tab === "orders" && orders.length > 0 && (
                <span style={{ marginLeft: 6, background: theme.primary, color: "#fff", borderRadius: 20, fontSize: 11, padding: "1px 7px" }}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>
        {activeTab === "shop" && (
          <>
            {/* Search */}
            <div style={{ marginBottom: 24, position: "relative" }}>
              <input
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 15, color: theme.text, background: theme.surface, boxSizing: "border-box", outline: "none" }}
              />
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 17, opacity: 0.5 }}>🔍</span>
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {filtered.map(p => (
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

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 20px", color: theme.textMuted }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p>No products match your search.</p>
              </div>
            )}
          </>
        )}

        {activeTab === "orders" && <OrdersView orders={orders} theme={theme} />}
      </main>

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
          products={MOCK_PRODUCTS}
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
          products={MOCK_PRODUCTS}
          theme={theme}
          onClose={() => setShowCheckout(false)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {showThemeEditor && (
        <ThemeEditor
          theme={theme}
          onChange={updateTheme}
          onClose={() => setShowThemeEditor(false)}
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
    </div>
  );
}
