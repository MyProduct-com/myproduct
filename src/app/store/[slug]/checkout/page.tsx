"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

type PayMethod = "mpesa" | "card" | "cash";

export default function CheckoutPage() {
  const { slug }  = useParams<{ slug: string }>();
  const router    = useRouter();
  const { items, total, count, clearCart } = useCartStore();

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [address, setAddress] = useState("");
  const [pay, setPay]         = useState<PayMethod>("mpesa");
  const [placing, setPlacing] = useState(false);
  const [done, setDone]       = useState(false);

  const delivery   = total() >= 500 ? 0 : 100;
  const grandTotal = total() + delivery;

  function placeOrder() {
    if (!name || !phone || !address) return;
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setDone(true);
      clearCart();
    }, 2000);
  }

  // Success screen
  if (done) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-5">
        <IconCheck size={32} className="text-brand-600" />
      </div>
      <h2 className="font-display text-2xl font-medium text-gray-900 mb-2">
        Order placed! 🎉
      </h2>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        Thank you {name}! Your order has been received.
        We'll send a confirmation to +254{phone}.
      </p>
      <div className="bg-white border border-black/10 rounded-2xl p-4 w-full max-w-xs mb-6 text-sm">
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Order total</span>
          <span className="font-medium text-gray-900">{formatCurrency(grandTotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Payment</span>
          <span className="font-medium text-gray-900 capitalize">
            {pay === "mpesa" ? "M-Pesa" : pay === "card" ? "Card" : "Cash on delivery"}
          </span>
        </div>
      </div>
      <Link href={`/store/${slug}`}
        className="bg-brand-800 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-brand-900 transition-colors">
        Continue shopping
      </Link>
    </div>
  );

  if (items.length === 0) {
    router.replace(`/store/${slug}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-brand-800 text-white sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/store/${slug}/cart`}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20">
            <IconArrowLeft size={16} />
          </Link>
          <span className="font-display text-sm font-medium flex-1">Checkout</span>
          <span className="text-xs text-brand-200">
            {count()} item{count() > 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5 flex flex-col gap-4 pb-36">

        {/* Delivery details */}
        <div className="bg-white border border-black/10 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Delivery details</div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amina Kimani"
                className="w-full h-10 px-3 border border-black/10 rounded-lg text-sm outline-none focus:border-brand-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Phone number</label>
              <div className="flex">
                <div className="h-10 px-3 border border-black/10 border-r-0 rounded-l-lg bg-gray-50 flex items-center text-sm text-gray-500">
                  +254
                </div>
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="7XX XXX XXX" type="tel"
                  className="flex-1 h-10 px-3 border border-black/10 rounded-r-lg text-sm outline-none focus:border-brand-400 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Delivery address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Westlands, Nairobi"
                className="w-full h-10 px-3 border border-black/10 rounded-lg text-sm outline-none focus:border-brand-400 transition-all" />
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white border border-black/10 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Payment method</div>
          <div className="flex flex-col gap-2">
            {([
              { key: "mpesa", label: "M-Pesa",          sub: "STK Push to your phone", icon: "📱" },
              { key: "card",  label: "Card",             sub: "Visa or Mastercard",     icon: "💳" },
              { key: "cash",  label: "Cash on delivery", sub: "Pay when order arrives", icon: "💵" },
            ] as { key: PayMethod; label: string; sub: string; icon: string }[]).map((m) => (
              <button key={m.key} onClick={() => setPay(m.key)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  pay === m.key
                    ? "border-brand-400 bg-brand-50"
                    : "border-black/10 hover:bg-gray-50"
                }`}>
                <div className="w-9 h-9 rounded-lg bg-white border border-black/10 flex items-center justify-center text-lg shrink-0">
                  {m.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{m.label}</div>
                  <div className="text-xs text-gray-400">{m.sub}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  pay === m.key ? "border-brand-600 bg-brand-600" : "border-gray-300"
                }`}>
                  {pay === m.key && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-white border border-black/10 rounded-2xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-3">Order summary</div>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-2 text-sm">
                <span className="text-base">{item.icon}</span>
                <span className="flex-1 text-gray-700 truncate">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium text-gray-900 shrink-0">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-black/10 pt-2 mt-1 flex flex-col gap-1.5 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span><span>{formatCurrency(total())}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={delivery === 0 ? "text-brand-600 font-medium" : ""}>
                  {delivery === 0 ? "Free" : formatCurrency(delivery)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-gray-900 text-base pt-1 border-t border-black/10">
                <span>Total</span>
                <span className="text-brand-800">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky place order */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/10 px-4 py-3 z-40">
        <div className="max-w-2xl mx-auto">
          <button onClick={placeOrder}
            disabled={!name || !phone || !address || placing}
            className="w-full flex items-center justify-between bg-brand-800 hover:bg-brand-900 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3.5 rounded-xl transition-colors">
            <span className="text-sm font-medium">
              {placing ? "Placing order..." : "Place order"}
            </span>
            <span className="text-sm font-medium">{formatCurrency(grandTotal)} →</span>
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            By placing this order you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  );
}