"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPhoto,
  IconCheck,
  IconX,
  IconPlus,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { ProductCategory, ProductStatus } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Electronics",
  "Fashion",
  "Beauty & Health",
  "Grocery",
  "Home & Office",
  "Computing",
  "Stationery",
  "Sports",
  "Baby Products",
];

interface FormState {
  name: string;
  brand: string;
  category: ProductCategory | "";
  price: string;
  originalPrice: string;
  stock: string;
  sku: string;
  status: ProductStatus;
  description: string;
  imageUrl: string;
  tags: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  brand: "",
  category: "",
  price: "",
  originalPrice: "",
  stock: "",
  sku: "",
  status: "draft",
  description: "",
  imageUrl: "",
  tags: "",
};

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [savedAs, setSavedAs] = useState<"live" | "draft" | null>(null);

  const set = (field: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) {
      setErrors((e) => ({ ...e, [field]: undefined }));
    }
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.brand.trim()) e.brand = "Brand is required";
    if (!form.category) e.category = "Please select a category";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Valid price is required";
    if (form.originalPrice && (isNaN(Number(form.originalPrice)) || Number(form.originalPrice) <= 0))
      e.originalPrice = "Must be a valid number";
    if (form.originalPrice && Number(form.originalPrice) <= Number(form.price))
      e.originalPrice = "Original price must be higher than selling price";
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Valid stock quantity is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (form.description.trim().length < 30)
      e.description = "Description should be at least 30 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (status: ProductStatus) => {
    if (!validate()) return;
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);
    setSavedAs(status === "live" ? "live" : "draft");
    // In a real app: POST to /api/products with { ...form, status }
    setTimeout(() => router.push("/seller/products"), 1500);
  };

  const discount =
    form.originalPrice && form.price && Number(form.originalPrice) > Number(form.price)
      ? Math.round(
          ((Number(form.originalPrice) - Number(form.price)) / Number(form.originalPrice)) * 100
        )
      : null;

  const inputCls = (field: keyof FormState) =>
    `w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100"
    }`;

  if (savedAs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <IconCheck size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Product {savedAs === "live" ? "Published!" : "Saved as Draft"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {savedAs === "live"
            ? "Your product is now live on the marketplace."
            : "Your product has been saved. Publish it when you're ready."}
        </p>
        <p className="text-xs text-gray-400">Redirecting to products list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/seller/products"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <IconArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500">Fill in the details below to list your product</p>
        </div>
      </div>

      {/* ── BASIC INFO ────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Sony WF-1000XM5 Wireless Earbuds"
              maxLength={120}
              className={inputCls("name")}
            />
            <div className="flex justify-between mt-1">
              {errors.name ? (
                <p className="text-xs text-red-600">{errors.name}</p>
              ) : (
                <span />
              )}
              <p className="text-xs text-gray-400">{form.name.length}/120</p>
            </div>
          </div>

          {/* Brand + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="e.g. Sony, Nike, GlowLab"
                className={inputCls("brand")}
              />
              {errors.brand && <p className="text-xs text-red-600 mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputCls("category")}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                SKU / Product Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => set("sku", e.target.value.toUpperCase())}
                placeholder="e.g. ELC-001"
                className={inputCls("sku")}
              />
              {errors.sku && <p className="text-xs text-red-600 mt-1">{errors.sku}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tags
                <span className="text-gray-400 font-normal ml-1">(comma separated)</span>
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="e.g. wireless, bluetooth, earbuds"
                className={inputCls("tags")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING & STOCK ───────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Pricing & Stock</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Selling price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Selling Price (KES) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                KES
              </span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0"
                min={0}
                className={`${inputCls("price")} pl-12`}
              />
            </div>
            {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
          </div>

          {/* Original price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Original Price (KES)
              <span className="text-gray-400 font-normal ml-1">(for discount)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                KES
              </span>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                placeholder="Optional"
                min={0}
                className={`${inputCls("originalPrice")} pl-12`}
              />
            </div>
            {errors.originalPrice ? (
              <p className="text-xs text-red-600 mt-1">{errors.originalPrice}</p>
            ) : discount ? (
              <p className="text-xs text-green-600 mt-1 font-semibold">
                -{discount}% discount will show on product
              </p>
            ) : null}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
              placeholder="0"
              min={0}
              className={inputCls("stock")}
            />
            {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Price preview */}
        {form.price && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3 text-sm">
            <IconInfoCircle size={16} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-600">
              Customers will see:{" "}
              <span className="font-bold text-gray-900">KES {Number(form.price).toLocaleString()}</span>
              {discount && (
                <>
                  {" "}
                  <span className="line-through text-gray-400">
                    KES {Number(form.originalPrice).toLocaleString()}
                  </span>{" "}
                  <span className="text-orange-600 font-semibold">(-{discount}%)</span>
                </>
              )}
            </span>
          </div>
        )}
      </section>

      {/* ── DESCRIPTION ───────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Product Description</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe your product in detail: features, specifications, materials, dimensions, etc. Good descriptions help customers make buying decisions."
            rows={6}
            maxLength={2000}
            className={`${inputCls("description")} resize-none`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-xs text-red-600">{errors.description}</p>
            ) : (
              <p className="text-xs text-gray-400">
                {form.description.length < 30
                  ? `${30 - form.description.length} more characters needed`
                  : "Looking good"}
              </p>
            )}
            <p className="text-xs text-gray-400">{form.description.length}/2000</p>
          </div>
        </div>
      </section>

      {/* ── PRODUCT IMAGE ─────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-1">Product Image</h2>
        <p className="text-xs text-gray-400 mb-4">
          Paste an image URL for now. When the backend is live, you&apos;ll be able to upload directly.
        </p>

        <div className="flex gap-4">
          {/* Preview */}
          <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-200 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <IconPhoto size={28} className="text-gray-300" />
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className={inputCls("imageUrl")}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Recommended: square image, minimum 400×400px. JPG or PNG.
            </p>
          </div>
        </div>
      </section>

      {/* ── LISTING STATUS ────────────────────────────── */}
      <section className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Listing Status</h2>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              form.status === "draft"
                ? "border-gray-400 bg-gray-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="status"
              value="draft"
              checked={form.status === "draft"}
              onChange={() => set("status", "draft")}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                form.status === "draft" ? "border-gray-500" : "border-gray-300"
              }`}
            >
              {form.status === "draft" && (
                <div className="w-2 h-2 rounded-full bg-gray-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Save as Draft</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Only you can see this. Publish when ready.
              </p>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              form.status === "live"
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="status"
              value="live"
              checked={form.status === "live"}
              onChange={() => set("status", "live")}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                form.status === "live" ? "border-green-500" : "border-gray-300"
              }`}
            >
              {form.status === "live" && (
                <div className="w-2 h-2 rounded-full bg-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Publish Live</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Visible to all customers immediately.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* ── ACTION BUTTONS ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 pb-6">
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="flex-1 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {saving && form.status === "draft" ? "Saving..." : "Save as Draft"}
        </button>
        <button
          onClick={() => handleSave("live")}
          disabled={saving}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <IconPlus size={16} />
              Publish Product
            </>
          )}
        </button>
      </div>
    </div>
  );
}
