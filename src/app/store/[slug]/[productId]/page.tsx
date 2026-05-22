"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft, IconShoppingCart,
  IconTruck, IconStar,
} from "@tabler/icons-react";
import { mockProducts } from "@/lib/mock-products";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const { productId, slug } = useParams<{ productId: string; slug: string }>();
  const product = mockProducts.find((p) => p.id === productId);
  const [qty, setQty]     = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, count } = useCartStore();

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p>Product not found.</p>
        <Link href={`/store/${slug}`}
          className="text-brand-800 text-sm mt-2 inline-block hover:underline">
          ← Back to store
        </Link>
      </div>
    </div>
  );

  function handleAdd() {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product!.id,
        name: product!.name,
        price: product!.price,
        icon: product!.icon,
        category: product!.category,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-800 text-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/store/${slug}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <IconArrowLeft size={16} />
          </Link>
          <span className="font-display text-sm font-medium flex-1">Product details</span>
          <Link href={`/store/${slug}/cart`}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <IconShoppingCart size={16} />
            {count() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-200 text-brand-900 text-[10px] font-bold flex items-center justify-center">
                {count()}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden">

          {/* Image */}
          <div className="h-52 md:h-72 bg-brand-50 flex items-center justify-center text-7xl md:text-8xl">
            {product.icon}
          </div>

          <div className="p-5">
            {/* Name + price */}
            <div className="flex items-start justify-between mb-1">
              <h1 className="text-lg font-medium text-gray-900 leading-snug flex-1 pr-4">
                {product.name}
              </h1>
              <div className="text-xl font-medium text-brand-800 shrink-0">
                {formatCurrency(product.price)}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-gray-400">{product.category}</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4].map((s) => (
                  <IconStar key={s} size={12} className="text-amber-300 fill-amber-300" />
                ))}
                <IconStar size={12} className="text-gray-200" />
                <span className="text-xs text-gray-400 ml-1">4.0 · {product.sales} sold</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Premium quality {product.name.toLowerCase()} available at GreenStore KE.
              Fresh and delivered same-day across Nairobi.
            </p>

            {/* Stock badge */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full mb-5 ${
              product.stock > 10 ? "bg-brand-50 text-brand-800" :
              product.stock > 0  ? "bg-amber-50 text-amber-800" :
              "bg-red-50 text-red-700"
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {product.stock > 10 ? `In stock · ${product.stock} units` :
               product.stock > 0  ? `Only ${product.stock} left` :
               "Out of stock"}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-medium text-gray-700">Qty</span>
                <div className="flex items-center border border-black/10 rounded-lg overflow-hidden">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg transition-colors">
                    −
                  </button>
                  <div className="w-10 h-9 flex items-center justify-center text-sm font-medium text-gray-900">
                    {qty}
                  </div>
                  <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-lg transition-colors">
                    +
                  </button>
                </div>
                <span className="text-sm font-medium text-brand-800">
                  {formatCurrency(product.price * qty)}
                </span>
              </div>
            )}

            {/* Delivery */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-5">
              <IconTruck size={16} className="text-blue-500 shrink-0" />
              <div>
                <div className="text-xs font-medium text-blue-800">Same-day delivery</div>
                <div className="text-xs text-blue-500">Order before 3:00 PM · Nairobi</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleAdd} disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all ${
                  added
                    ? "border-brand-400 bg-brand-50 text-brand-800"
                    : "border-brand-800 text-brand-800 hover:bg-brand-50"
                } disabled:opacity-40 disabled:cursor-not-allowed`}>
                <IconShoppingCart size={15} />
                {added ? "Added ✓" : "Add to cart"}
              </button>
              <Link href={`/store/${slug}/cart`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium bg-brand-800 text-white hover:bg-brand-900 transition-colors">
                Buy now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}