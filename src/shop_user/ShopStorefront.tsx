"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, ShoppingCart, ArrowRight, ArrowUp, Truck, ShieldCheck, Leaf, MapPin, Phone, MessageSquare, MessageCircle } from "lucide-react";
import type { User, Theme, CartItem, PlacedOrderPayload } from "./types/index";
import { useProductStore } from "@/store/productStore";
import type { SharedProduct } from "@/store/productStore";
import { useStorefrontContentStore } from "@/store/storefrontContentStore";

import Header        from "./components/Header";
import ShopHero      from "./components/ShopHero";
import CategoryBar   from "./components/CategoryBar";
import ProductCard   from "./components/ProductCard";
import ProductModal  from "./components/ProductModal";
import CartModal     from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal     from "./components/AuthModal";
import BestSellers   from "./components/BestSellers";
import HowItWorks    from "./components/HowItWorks";
import Testimonials  from "./components/Testimonials";
import Footer        from "./components/Footer";
import { useThemeStore } from "@/store/themeStore";

interface ShopStorefrontProps {
  initialTheme?: Partial<Theme>;
}

export default function ShopStorefront({ initialTheme = {} }: ShopStorefrontProps) {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const storeTheme = useThemeStore((s) => s.theme);
  const theme = { ...storeTheme, ...initialTheme } as Theme;

  // ── Editable page content (hero, about, how-it-works, testimonials, contact, footer) ──
  const content = useStorefrontContentStore((s) => s.content);
  const heroTitle = content.hero.title || `Welcome to ${theme.shopName}`;
  const aboutTitle = content.about.title || `About ${theme.shopName}`;
  const digitsOnly = (s: string) => s.replace(/[^\d+]/g, "");

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

  // ── Cart ───────────────────────────────────────────────────────────────────
  const [cart, setCart]           = useState<CartItem[]>([]);
  const [showCart, setShowCart]   = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // ── Product modal ──────────────────────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState<SharedProduct | null>(null);

  // ── Search & category filter ────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => Array.from(new Set(shopProducts.map((p) => p.category))),
    [shopProducts]
  );

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
  const handleOrderPlaced = (_payload: PlacedOrderPayload) => {
    setCart([]);
    setShowCheckout(false);
  };

  // ── Filtered products (search + category) ───────────────────────────────────
  const filtered = useMemo(() =>
    shopProducts.filter((p) =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.description.toLowerCase().includes(search.toLowerCase()))
    ),
    [shopProducts, search, category]
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

      {/* Hero */}
      <ShopHero theme={theme} slides={content.hero.slides} title={heroTitle} ctaText={content.hero.ctaText} />

      {/* Category bar — full-bleed sticky strip */}
      {categories.length > 0 && (
        <CategoryBar theme={theme} categories={categories} active={category} onChange={setCategory} />
      )}

      {/* Main content */}
      <main id="products" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 sm:pb-10 scroll-mt-16">

        {/* Search */}
        <div className="py-4">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
            style={{ borderColor: theme.border, background: theme.surface }}
          >
            <Search className="w-4.5 h-4.5 shrink-0" />
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
                className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>

        {/* Heading row */}
        <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: theme.black }}>
            {category === "All" ? "Fresh today" : category}
          </h2>
          <p className="text-sm" style={{ color: theme.textMuted }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
            {search && (
              <span className="ml-1">
                for &ldquo;<strong style={{ color: theme.primary }}>{search}</strong>&rdquo;
              </span>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="ml-2 font-medium hover:underline"
                style={{ color: theme.primary }}
              >
                Clear search
              </button>
            )}
          </p>
        </div>

        {/* Product grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            <div className="flex justify-center mb-4">
              {search ? <Search className="w-12 h-12" /> : <ShoppingCart className="w-12 h-12" />}
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
      </main>

      {/* ── Best Sellers ── */}
      {shopProducts.length > 0 && (
        <BestSellers
          theme={theme}
          products={shopProducts}
          getCartItem={getCartItem}
          onAdd={addToCart}
          onClick={setSelectedProduct}
        />
      )}

      {/* ── About ── */}
      <section id="about" className="scroll-mt-16 py-16" style={{ background: theme.surface, borderTop: `1px solid ${theme.border}` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: theme.black }}>
            {aboutTitle}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-12" style={{ color: theme.textMuted }}>
            {content.about.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Leaf, title: "Fresh & Quality", desc: "Sourced and checked for quality before it reaches you." },
              { icon: Truck, title: "Fast Delivery", desc: "Same-day delivery in Nairobi, free over KSh 500." },
              { icon: ShieldCheck, title: "Trusted Shopping", desc: "Secure checkout and support on every order." },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center text-center px-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: theme.primaryLight, color: theme.primary }}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-sm mb-1" style={{ color: theme.black }}>{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: theme.textMuted }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <HowItWorks
        theme={theme}
        title={content.howItWorks.title}
        subtitle={content.howItWorks.subtitle}
        steps={content.howItWorks.steps}
      />

      {/* ── Testimonials ── */}
      <Testimonials theme={theme} testimonials={content.testimonials} />

      {/* ── Contact ── */}
      <section id="contact" className="scroll-mt-16 py-16" style={{ borderTop: `1px solid ${theme.border}` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: theme.black }}>
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: theme.textMuted }}>
            Have a question about an order or a product? Reach us directly — we usually reply within minutes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <a
              href={`tel:${digitsOnly(content.contact.phone)}`}
              className="flex flex-col items-center gap-3 px-5 py-6 rounded-2xl transition-colors hover:opacity-80"
              style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: theme.primaryLight, color: theme.primary }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.black }}>Call Us</p>
                <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{content.contact.phone}</p>
              </div>
            </a>

            <a
              href={`sms:${digitsOnly(content.contact.phone)}`}
              className="flex flex-col items-center gap-3 px-5 py-6 rounded-2xl transition-colors hover:opacity-80"
              style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: theme.primaryLight, color: theme.primary }}>
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.black }}>Send an SMS</p>
                <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{content.contact.phone}</p>
              </div>
            </a>

            <a
              href={`https://wa.me/${digitsOnly(content.contact.whatsapp).replace(/^\+/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 px-5 py-6 rounded-2xl transition-colors hover:opacity-80"
              style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: theme.primaryLight, color: theme.primary }}>
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: theme.black }}>Chat on WhatsApp</p>
                <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{content.contact.whatsapp}</p>
              </div>
            </a>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: theme.textMuted }}>
            <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.primary }} />
            Nairobi, Kenya
          </div>
        </div>
      </section>

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
            <span className="text-sm font-semibold flex items-center gap-1">
              KSh {cartTotal.toLocaleString()} <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 sm:bottom-6 z-40 w-10 h-10 rounded-full shadow-md flex items-center justify-center bg-white border"
          style={{ borderColor: theme.border, color: theme.primary }}
        >
          <ArrowUp className="w-5 h-5" />
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
        socials={content.footer.socials}
        footerBg={content.footer.bg}
        footerText={content.footer.text}
        onLoginClick={openLogin}
        onSignupClick={openSignup}
        onCartOpen={() => setShowCart(true)}
      />
    </div>
  );
}