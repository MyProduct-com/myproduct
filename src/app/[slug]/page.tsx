"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  IconSearch, IconShoppingCart, IconStar,
  IconTruck, IconLeaf, IconHeart, IconX,
} from "@tabler/icons-react";
import { mockProducts } from "@/lib/mock-products";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

const categories = ["All", "Grocery", "Beauty", "Electronics", "Stationery"];

export default function StorefrontPage() {
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("All");
  const [added, setAdded]       = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const { addItem, count, total } = useCartStore();

  const liveProducts = useMemo(() =>
    mockProducts
      .filter((p) => p.status === "live")
      .filter((p) => cat === "All" || p.category === cat)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase())),
    [cat, search]
  );

  function handleAdd(p: typeof mockProducts[0]) {
    addItem({ id: p.id, name: p.name, price: p.price, icon: p.icon, category: p.category });
    setAdded(p.id);
    setTimeout(() => setAdded(null), 1000);
  }

  function toggleWish(id: string) {
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-brand-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <div className="font-display text-base font-medium shrink-0">
            My<span className="text-brand-200">Products</span>
            <span className="hidden sm:inline text-brand-300 font-sans font-normal text-xs ml-2">
              · GreenStore KE
            </span>
          </div>

          {/* Desktop search */}
          <div className="hidden sm:flex flex-1 items-center gap-2 bg-white/10 hover:bg-white/15 rounded-lg px-3 py-1.5 mx-2 transition-colors">
            <IconSearch size={13} className="text-white/60 shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full" />
            {search && (
              <button onClick={() => setSearch("")}>
                <IconX size={13} className="text-white/60 hover:text-white" />
              </button>
            )}
          </div>

          {/* Mobile search toggle */}
          <button className="sm:hidden ml-auto p-1.5 text-white/80 hover:text-white"
            onClick={() => setSearchOpen(!searchOpen)}>
            {searchOpen ? <IconX size={18} /> : <IconSearch size={18} />}
          </button>

          {/* Cart button */}
          <Link href="cart"
            className="relative flex items-center gap-1.5 bg-white text-brand-800 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors shrink-0">
            <IconShoppingCart size={14} />
            <span className="hidden sm:inline">Cart</span>
            {count() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-300 text-brand-900 text-[10px] font-bold flex items-center justify-center">
                {count()}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="sm:hidden px-4 pb-3 border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 mt-2">
              <IconSearch size={13} className="text-white/60" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full"
                autoFocus />
              {search && (
                <button onClick={() => setSearch("")}>
                  <IconX size={13} className="text-white/60" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-brand-200 text-xs mb-3">
              <IconLeaf size={14} />
              Westlands, Nairobi · Open daily 7AM–9PM
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-medium text-white leading-tight mb-3">
              Fresh products,<br />
              <span className="text-brand-200">delivered fast</span> 🚀
            </h1>
            <p className="text-brand-100 text-sm md:text-base mb-6 max-w-md">
              Shop from GreenStore KE — groceries, beauty, electronics and more.
              Same-day delivery across Nairobi.
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-xs text-white">
                <IconTruck size={13} /> Free delivery over KES 500
              </div>
              <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-xs text-white">
                <IconStar size={13} className="text-amber-300" /> 4.8 · 1,200+ customers
              </div>
            </div>
          </div>

          {/* Hero product grid — desktop only */}
          <div className="hidden md:grid grid-cols-2 gap-3 shrink-0">
            {mockProducts.filter((p) => p.status === "live").slice(0, 4).map((p) => (
              <div key={p.id}
                className="w-28 h-28 bg-white/10 rounded-2xl flex flex-col items-center justify-center gap-1.5 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                <span className="text-3xl">{p.icon}</span>
                <span className="text-[11px] text-white/80 font-medium text-center px-1 leading-tight">
                  {p.name.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-b border-black/10 sticky top-14 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1.5 overflow-x-auto py-2.5 scrollbar-hide">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  cat === c
                    ? "bg-brand-800 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-medium text-gray-900">
              {cat === "All" ? "All products" : cat}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {liveProducts.length} item{liveProducts.length !== 1 ? "s" : ""} available
            </p>
          </div>
          {search && (
            <button onClick={() => setSearch("")}
              className="text-xs text-gray-500 border border-black/10 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1">
              <IconX size={11} /> Clear search
            </button>
          )}
        </div>

        {liveProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 font-medium">No products found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different category or search term</p>
            <button onClick={() => { setSearch(""); setCat("All"); }}
              className="mt-4 text-sm text-brand-800 hover:underline">
              Show all products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {liveProducts.map((p) => (
              <div key={p.id}
                className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">

                {/* Image */}
                <div className="relative">
                  <Link href={`${p.id}`}>
                    <div className="h-32 md:h-40 bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-4xl md:text-5xl group-hover:from-brand-100 group-hover:to-brand-200 transition-all cursor-pointer">
                      {p.icon}
                    </div>
                  </Link>
                  <button onClick={() => toggleWish(p.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
                    <IconHeart size={14}
                      className={wishlist.has(p.id) ? "text-red-500 fill-red-500" : "text-gray-300"} />
                  </button>
                  {p.stock <= 10 && p.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                      Only {p.stock} left
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <Link href={`${p.id}`}>
                    <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2 hover:text-brand-800 transition-colors cursor-pointer mb-1">
                      {p.name}
                    </p>
                  </Link>
                  <p className="text-xs text-gray-400 mb-2">{p.category}</p>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-medium text-brand-800">
                      {formatCurrency(p.price)}
                    </span>
                    <button onClick={() => handleAdd(p)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all shrink-0 ${
                        added === p.id
                          ? "bg-brand-100 text-brand-800 scale-95"
                          : "bg-brand-800 text-white hover:bg-brand-900"
                      }`}>
                      {added === p.id ? "✓" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-300 mt-4">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="font-display text-lg font-medium text-white mb-1">
                My<span className="text-brand-400">Products</span>
              </div>
              <p className="text-xs text-brand-400">GreenStore KE · Westlands, Nairobi</p>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-brand-400">
              <span>📞 +254 700 000 000</span>
              <span>📧 greenstore@myproducts.com</span>
              <span>⏰ Mon–Sun: 7AM – 9PM</span>
              <span>🚚 Same-day delivery</span>
            </div>
            <div className="text-xs text-brand-500">
              Powered by <span className="text-brand-300 font-medium">MyProducts.com</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating cart bar — mobile */}
      {count() > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <Link href="cart"
            className="flex items-center justify-between bg-brand-800 text-white px-4 py-3.5 rounded-2xl shadow-xl border border-brand-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-300 text-brand-900 flex items-center justify-center text-[11px] font-bold">
                {count()}
              </div>
              <span className="text-sm font-medium">View cart</span>
            </div>
            <span className="text-sm font-medium text-brand-200">
              {formatCurrency(total())} →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}