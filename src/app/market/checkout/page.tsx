"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCheck,
  IconMapPin,
  IconPhone,
  IconUser,
  IconCreditCard,
  IconDeviceMobile,
  IconCash,
  IconPackage,
  IconShoppingCart,
} from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const DELIVERY_THRESHOLD = 2000;
const DELIVERY_FEE = 150;

type PaymentMethod = "mpesa" | "card" | "cash_on_delivery";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, totalQty, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const subtotal = total();
  const cartCount = totalQty();
  const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal = subtotal + deliveryFee;

  const handleCancelOrder = () => {
    if (window.confirm("Decline payment and cancel this order?")) {
      clearCart();
      router.push("/products");
    }
  };

  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    address: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (form.phone.length < 10) e.phone = "Valid phone number required";
    if (!form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    const id = `ORD-${Date.now().toString().slice(-8)}`;
    setOrderId(id);
    clearCart();
    setSuccess(true);
    setLoading(false);
  };

  if (cartCount === 0 && !success) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <IconShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="font-semibold text-gray-900 mb-2">Your cart is empty</p>
        <Link href="/products" className="text-sm text-green-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (success) {
    const receiptItems = items.map((item) => ({
      name: item.name,
      qty: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    }));

    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <IconCheck size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-500 mb-1">Order ID: <span className="font-semibold text-gray-800">{orderId}</span></p>
        <p className="text-sm text-gray-500 mb-6">
          Thank you, <strong>{form.name}</strong>! Your order will be delivered to <strong>{form.address}</strong>.
          {paymentMethod === "mpesa" && ` We will send an M-Pesa prompt to ${form.phone}.`}
        </p>

        {/* E-Receipt */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">E-Receipt</h2>
            <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full capitalize">{paymentMethod.replace("_", " ")}</span>
          </div>
          <div className="space-y-2 text-sm border-b border-gray-100 pb-4 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Customer</span>
              <span className="font-medium text-gray-900">{form.name}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phone</span>
              <span className="font-medium text-gray-900">{form.phone}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className="font-medium text-gray-900">{form.address}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Date</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleString("en-KE")}</span>
            </div>
          </div>
          <div className="space-y-2 text-sm mb-4">
            {receiptItems.map((item, idx) => (
              <div key={idx} className="flex justify-between text-gray-700">
                <span>{item.name} x{item.qty}</span>
                <span className="font-semibold">KES {item.subtotal.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? "text-green-600" : ""}>{deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span>Total Paid</span>
              <span>KES {orderTotal.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Payment status: <span className="font-semibold text-green-600">Paid</span></p>
          <p className="text-xs text-gray-400">Order status: <span className="font-semibold text-gray-900">Under Processing</span></p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            <IconPackage size={16} /> Track Order
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 hover:border-green-400 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const inputCls =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-gray-500 hover:text-green-600">
          <IconArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery and payment */}
        <div className="lg:col-span-2 space-y-5">
          {/* Delivery details */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconMapPin size={18} className="text-green-600" />
              Delivery Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="John Kamau"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+254 712 345 678"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Street address, building, estate..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Special instructions for delivery..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <IconCreditCard size={18} className="text-green-600" />
              Payment Method
            </h2>
            <div className="space-y-3">
              {[
                {
                  id: "mpesa" as PaymentMethod,
                  icon: <IconDeviceMobile size={20} />,
                  label: "M-Pesa",
                  sub: "Pay via M-Pesa STK push to your phone",
                  badge: "Most Popular",
                },
                {
                  id: "card" as PaymentMethod,
                  icon: <IconCreditCard size={20} />,
                  label: "Debit / Credit Card",
                  sub: "Visa, Mastercard. Secure online payment",
                },
                {
                  id: "cash_on_delivery" as PaymentMethod,
                  icon: <IconCash size={20} />,
                  label: "Cash on Delivery",
                  sub: "Pay when your order arrives",
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      paymentMethod === method.id
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      {method.label}
                      {method.badge && (
                        <span className="text-[10px] bg-green-600 text-white px-1.5 py-0.5 rounded-full font-bold">
                          {method.badge}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{method.sub}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      paymentMethod === method.id ? "border-green-500" : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 shrink-0">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>
                  {deliveryFee === 0 ? "FREE" : `KES ${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-lg">KES {orderTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <IconCheck size={17} />
                  Place Order · KES {orderTotal.toLocaleString()}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancelOrder}
              className="w-full mt-3 border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 font-semibold py-3.5 rounded-xl text-sm transition-colors"
            >
              Decline Payment
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By placing this order you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
