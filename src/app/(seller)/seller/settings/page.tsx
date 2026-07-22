"use client";
import { useState } from "react";
import { Check, Store, MapPin, Clock, Truck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function SellerSettingsPage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName: "TechHub KE",
    storeDescription: "Kenya's leading electronics and computing store.",
    location: "CBD, Nairobi",
    phone: "+254 700 100 002",
    openTime: "08:00",
    closeTime: "21:00",
    processingTime: "24",
    freeDeliveryThreshold: "2000",
    deliveryFee: "150",
    returnPolicy: "7",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls =
    "w-full px-4 py-3 border border-org-border rounded-org-sm text-org-sm outline-none focus:border-org-primary focus:ring-2 focus:ring-org-primary-light transition-all bg-org-surface text-org-text-primary";

  const sectionCls = "bg-org-surface rounded-org-card shadow-org-card p-5 sm:p-6";

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Store Settings</h1>
        <button
          onClick={handleSave}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-org-sm font-org-semibold text-org-sm transition-all ${
            saved ? "bg-org-success-bg text-org-success" : "bg-org-primary hover:bg-org-primary-hover text-white"
          }`}
        >
          {saved && <Check size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Store info */}
      <div className={sectionCls}>
        <h2 className="font-org-bold text-org-text-primary mb-4 flex items-center gap-2">
          <Store size={18} className="text-org-primary" />
          Store Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Store Name</label>
            <input type="text" value={form.storeName} onChange={(e) => set("storeName", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Store Description</label>
            <textarea
              value={form.storeDescription}
              onChange={(e) => set("storeDescription", e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Location</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-org-text-muted" />
                <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} className={`${inputCls} pl-10`} />
              </div>
            </div>
            <div>
              <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Phone</label>
              <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      {/* Business hours */}
      <div className={sectionCls}>
        <h2 className="font-org-bold text-org-text-primary mb-4 flex items-center gap-2">
          <Clock size={18} className="text-org-primary" />
          Business Hours
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Opening Time</label>
            <input type="time" value={form.openTime} onChange={(e) => set("openTime", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Closing Time</label>
            <input type="time" value={form.closeTime} onChange={(e) => set("closeTime", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">Order Processing Time (hours)</label>
            <input type="number" value={form.processingTime} onChange={(e) => set("processingTime", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Delivery settings */}
      <div className={sectionCls}>
        <h2 className="font-org-bold text-org-text-primary mb-4 flex items-center gap-2">
          <Truck size={18} className="text-org-primary" />
          Delivery & Returns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">
              Free Delivery Threshold (KES)
            </label>
            <input type="number" value={form.freeDeliveryThreshold} onChange={(e) => set("freeDeliveryThreshold", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">
              Standard Delivery Fee (KES)
            </label>
            <input type="number" value={form.deliveryFee} onChange={(e) => set("deliveryFee", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-org-sm font-org-medium text-org-text-secondary mb-1.5">
              Return Window (days)
            </label>
            <input type="number" value={form.returnPolicy} onChange={(e) => set("returnPolicy", e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      {/* Subscription plan */}
      <div className={sectionCls}>
        <h2 className="font-org-bold text-org-text-primary mb-4">Subscription Plan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: "Starter", price: "Free", products: "50 products" },
            { name: "Growth", price: "KES 999/mo", products: "200 products" },
            { name: "Business", price: "KES 2,499/mo", products: "1,000 products", current: true },
            { name: "Enterprise", price: "Custom", products: "Unlimited" },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`p-4 rounded-org-sm border-2 text-center transition-all ${
                plan.current
                  ? "border-org-primary bg-org-primary-light"
                  : "border-org-border hover:border-org-text-muted"
              }`}
            >
              <p className={`text-org-sm font-org-bold mb-0.5 ${plan.current ? "text-org-primary" : "text-org-text-primary"}`}>
                {plan.name}
              </p>
              <p className="text-org-xs font-org-semibold text-org-text-secondary mb-1">{plan.price}</p>
              <p className="text-org-xs text-org-text-muted">{plan.products}</p>
              {plan.current && (
                <span className="inline-block mt-2 text-[10px] bg-org-primary text-white px-2 py-0.5 rounded-org-pill font-org-bold">
                  Current Plan
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
