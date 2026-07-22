"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconShoppingCart,
  IconTrash,
  IconMinus,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
  IconTag,
} from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const DELIVERY_THRESHOLD = 2000;
const DELIVERY_FEE = 150;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, clearCart, total, distinctCount, totalQty } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const subtotal = total();
  const cartCount = distinctCount();
  const totalQtyCount = totalQty();
  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  const handleCancelPurchase = () => {
    if (window.confirm("Cancel this purchase and clear your cart?")) {
      clearCart();
      router.push("/products");
    }
  };

  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IconShoppingCart size={36} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">
            Looks like you haven&apos;t added anything yet. Start shopping to fill it up!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            Continue Shopping <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/products" className="text-gray-500 hover:text-green-600 transition-colors">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">
          Shopping Cart <span className="text-gray-400 font-normal">({cartCount} {cartCount === 1 ? 'product' : 'products'}, {totalQtyCount} items)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
            >
              <Link href={`/products/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-gray-50"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{item.sellerName}</p>
                    <Link
                      href={`/products/${item.id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-green-700 line-clamp-2"
                    >
                      {item.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0 p-1"
                    aria-label="Remove item"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <IconMinus size={13} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <IconPlus size={13} />
                    </button>
                  </div>
                  <p className="text-base font-bold text-gray-900">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalQtyCount} items)</span>
                <span className="font-medium text-gray-900">KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}>
                  {deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                  Add KES {(DELIVERY_THRESHOLD - subtotal).toLocaleString()} more for free delivery
                </p>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-lg">KES {orderTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Promo code */}
            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <IconTag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Promo code"
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-green-500 transition-colors"
                />
              </div>
              <button className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                Apply
              </button>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              Proceed to Checkout <IconArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={handleCancelPurchase}
              className="w-full mt-3 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 font-semibold py-3.5 rounded-xl text-sm transition-colors"
            >
              Cancel Purchase
            </button>

            <Link
              href="/products"
              className="w-full mt-2.5 flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-green-600 py-2 transition-colors"
            >
              <IconArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
