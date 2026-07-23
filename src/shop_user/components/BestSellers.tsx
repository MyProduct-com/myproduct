"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { Theme, CartItem } from "../types/index";
import type { SharedProduct } from "@/store/productStore";
import { fmt } from "../utils/helpers";

interface BestSellersProps {
  theme: Theme;
  products: SharedProduct[];
  getCartItem: (id: number) => CartItem | undefined;
  onAdd: (id: number) => void;
  onClick: (product: SharedProduct) => void;
}

export default function BestSellers({ theme, products, getCartItem, onAdd, onClick }: BestSellersProps) {
  const items = products.slice(0, 5);
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null);
  const active = items.find((p) => p.id === activeId) ?? items[0];

  if (items.length === 0 || !active) return null;

  const rest = items.filter((p) => p.id !== active.id);
  const cartItem = getCartItem(active.id);

  return (
    <section id="bestsellers" className="scroll-mt-16 pt-8 sm:pt-10 pb-16 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.primary }}>
            Best Sellers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mt-2" style={{ color: theme.black }}>
            What keeps selling out
          </h2>
        </div>

        <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-5">

          {/* Small cards — pick one to feature it in the large card */}
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:w-64 shrink-0 pb-1 md:pb-0">
            {rest.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className="flex items-center gap-3 shrink-0 w-[220px] md:w-auto text-left p-3 rounded-2xl transition-colors hover:opacity-80"
                style={{ background: theme.surface, border: `1px solid ${theme.border}` }}
              >
                <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: theme.black }}>{p.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>{fmt(p.price)}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Large feature card — the selected product */}
          <div
            onClick={() => onClick(active)}
            className="relative flex-1 rounded-4xl overflow-hidden cursor-pointer min-h-[300px] sm:min-h-[420px]"
          >
            <img
              key={active.id}
              src={active.image}
              alt={active.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

            <span
              className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full text-white"
              style={{ background: theme.primary }}
            >
              {active.category}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-1">{active.name}</h3>
                <p className="text-white/70 text-sm mb-3">
                  {cartItem
                    ? `${cartItem.qty} in cart`
                    : active.stock <= 5
                    ? `Only ${active.stock} left`
                    : `${active.unit} · restocked regularly`}
                </p>
                <span className="font-mono text-lg font-semibold text-white">{fmt(active.price)}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onAdd(active.id); }}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-85"
                style={{ background: "#fff", color: theme.black }}
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
