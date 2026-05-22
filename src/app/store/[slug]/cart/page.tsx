"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { IconArrowLeft, IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items, removeItem, updateQty, total, count, clearCart } = useCartStore();

  const delivery   = total() >= 500 ? 0 : 100;
  const grandTotal = total() + delivery;

  if (items.length === 0) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-800 text-white h-14 flex items-center px-4 gap-3 sticky top-0 z-30">
        <Link href={`/store/${slug}`}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20">
          <IconArrowLeft size={16} />
        </Link>
        <span className="font-display text-sm font-medium">Your cart</span>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 px-4">
        <div className="text-6xl">🛒</div>
        <p className="text-base font-medium text-gray-600">Your cart is empty</p>
        <p className="text-sm text-center text-gray-400">
          Browse the store and add products to get started.
        </p>
        <Link href={`/store/${slug}`}
          className="mt-2 bg-brand-800 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-brand-900 transition-colors">
          Browse products
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-brand-800 text-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/store/${slug}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20">
            <IconArrowLeft size={16} />
          </Link>
          <span className="font-display text-sm font-medium flex-1">Your cart</span>
          <span className="text-xs text-brand-200">
            {count()} item{count() > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4 w-full pb-32">

        {/* Delivery nudge */}
        {delivery > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 text-center">
            Add <strong>{formatCurrency(500 - total())}</strong> more for free delivery 🚚
          </div>
        ) : (
          <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 text-xs text-brand-800 text-center">
            ✓ You qualify for free delivery!
          </div>
        )}

        {/* Cart items */}
        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden divide-y divide-black/5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                <div className="text-xs text-gray-400">{item.category}</div>
                <div className="text-sm font-medium text-brand-800 mt-0.5">
                  {formatCurrency(item.price)}
                </div>
              </div>

              {/* Qty */}
              <div className="flex items-center border border-black/10 rounded-lg overflow-hidden shrink-0">
                <button onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 text-base transition-colors">
                  −
                </button>
                <div className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                  {item.quantity}
                </div>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 text-base transition-colors">
                  +
                </button>
              </div>

              {/* Subtotal + remove */}
              <div className="text-right shrink-0">
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </div>
                <button onClick={() => removeItem(item.id)}
                  className="mt-1 text-gray-300 hover:text-red-500 transition-colors">
                  <IconTrash size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white border border-black/10 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Order summary</div>
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal ({count()} items)</span>
              <span>{formatCurrency(total())}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className={delivery === 0 ? "text-brand-600 font-medium" : ""}>
                {delivery === 0 ? "Free" : formatCurrency(delivery)}
              </span>
            </div>
            <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-black/10 text-base">
              <span>Total</span>
              <span className="text-brand-800">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 px-4 py-3 z-40">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button onClick={clearCart}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-black/10 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            <IconShoppingCart size={14} /> Clear
          </button>
          <Link href={`/store/${slug}/checkout`}
            className="flex-1 flex items-center justify-between bg-brand-800 hover:bg-brand-900 text-white px-5 py-3 rounded-xl transition-colors">
            <span className="text-sm font-medium">Proceed to checkout</span>
            <span className="text-sm font-medium">{formatCurrency(grandTotal)} →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}