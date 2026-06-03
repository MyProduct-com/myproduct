"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconEye,
  IconEyeOff,
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconArrowLeft,
  IconBuilding,
  IconCheck,
} from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";
import { Customer, Seller } from "@/types/user";

type Role = "customer" | "seller";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) ?? "customer";
  const { login } = useAuthStore();

  const [role, setRole] = useState<Role>(defaultRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    storeCategory: "",
    location: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.phone.length < 10) e.phone = "Valid phone number required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (role === "seller" && !form.storeName.trim()) e.storeName = "Store name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));

    if (role === "customer") {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        email: form.email,
        phone: form.phone,
        name: form.name,
        role: "customer",
        createdAt: new Date().toISOString(),
        addresses: [],
        loyaltyPoints: 0,
      };
      login(newCustomer);
      router.push("/dashboard");
    } else {
      const newSeller: Seller = {
        id: `seller-${Date.now()}`,
        email: form.email,
        phone: form.phone,
        name: form.name,
        role: "seller",
        createdAt: new Date().toISOString(),
        storeName: form.storeName,
        storeSlug: form.storeName.toLowerCase().replace(/\s+/g, "-"),
        storeDescription: "",
        storeRating: 0,
        totalSales: 0,
        totalRevenue: 0,
        productCount: 0,
        isVerified: false,
        plan: "starter",
        categories: form.storeCategory ? [form.storeCategory] : [],
        location: form.location,
        joinedAt: new Date().toISOString(),
      };
      login(newSeller);
      router.push("/seller");
    }
    setLoading(false);
  };

  const inputCls =
    "w-full px-4 py-[9px] border border-[#E5E7EB] rounded-[8px] text-[13px] outline-none focus:border-[#25A55A] bg-white text-[#111827] placeholder-[#9CA3AF] transition-colors";
  const errCls = "text-[11px] text-[#dc2626] mt-1";

  return (
    <div className="min-h-screen bg-[#F2F9F5] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A6B3C] flex-col justify-between p-12">
        <Link href="/" className="text-[18px] font-[600] tracking-[-0.01em]">
          <span className="text-[#D4F0E2]">My</span>
          <span className="text-white">Products</span>
        </Link>
        <div>
          <h2 className="text-[26px] font-[600] text-white leading-tight tracking-[-0.02em] mb-4">
            {role === "seller"
              ? "Start Selling on Kenya's Fastest-Growing Marketplace"
              : "Join Thousands of Happy Shoppers"}
          </h2>
          <ul className="space-y-3 mt-6">
            {(role === "seller"
              ? [
                  "Free to list your first 50 products",
                  "Reach customers across all of Kenya",
                  "Same-day payouts via M-Pesa",
                  "Dedicated seller support team",
                ]
              : [
                  "Access to 10,000+ products",
                  "Fast, reliable delivery in Nairobi",
                  "Secure M-Pesa & card payments",
                  "Easy 7-day returns",
                ]
            ).map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-[#D4F0E2] text-[14px]">
                <IconCheck size={15} className="text-[#D4F0E2] shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[#D4F0E2] text-[12px]">&copy; {new Date().getFullYear()} MyProducts Kenya</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#1A6B3C] mb-6 transition-colors"
          >
            <IconArrowLeft size={14} />
            Back to marketplace
          </Link>

          <div className="bg-white rounded-[12px] border border-[0.5px] border-[#E5E7EB] p-8">
            <h1 className="text-[20px] font-[600] text-[#111827] mb-1">Create your account</h1>
            <p className="text-[13px] text-[#6B7280] mb-5">
              Already have one?{" "}
              <Link href="/auth/login" className="text-[#25A55A] font-[500] hover:text-[#1A6B3C]">
                Sign in
              </Link>
            </p>

            {/* Role toggle */}
            <div className="flex gap-1.5 mb-6 p-1 bg-[#F3F4F6] rounded-[8px]">
              {(["customer", "seller"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-[6px] text-[13px] font-[500] capitalize transition-all ${
                    role === r
                      ? "bg-white text-[#1A6B3C] border border-[#D4F0E2]"
                      : "text-[#6B7280] hover:text-[#374151]"
                  }`}
                >
                  {r === "seller" ? "Seller Account" : "Customer Account"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">Full Name</label>
                <div className="relative">
                  <IconUser size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="John Kamau"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">Email Address</label>
                <div className="relative">
                  <IconMail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="john@gmail.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.email && <p className={errCls}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">Phone Number</label>
                <div className="relative">
                  <IconPhone size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+254 712 345 678"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.phone && <p className={errCls}>{errors.phone}</p>}
              </div>

              {/* Seller-specific fields */}
              {role === "seller" && (
                <>
                  <div>
                    <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">Store Name</label>
                    <div className="relative">
                      <IconBuilding size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                      <input
                        type="text"
                        value={form.storeName}
                        onChange={(e) => set("storeName", e.target.value)}
                        placeholder="e.g. TechHub KE"
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                    {errors.storeName && <p className={errCls}>{errors.storeName}</p>}
                  </div>
                  <div>
                    <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">
                      Main Category
                    </label>
                    <select
                      value={form.storeCategory}
                      onChange={(e) => set("storeCategory", e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select a category</option>
                      {[
                        "Electronics", "Fashion", "Beauty & Health", "Grocery",
                        "Home & Office", "Computing", "Stationery", "Sports",
                      ].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">
                      Business Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="e.g. Westlands, Nairobi"
                      className={inputCls}
                    />
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">Password</label>
                <div className="relative">
                  <IconLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    placeholder="Min. 6 characters"
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                  </button>
                </div>
                {errors.password && <p className={errCls}>{errors.password}</p>}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <IconLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                    className={`${inputCls} pl-10`}
                  />
                </div>
                {errors.confirmPassword && <p className={errCls}>{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25A55A] hover:bg-[#1A6B3C] disabled:bg-[#9CA3AF] text-white font-[500] py-[9px] rounded-[8px] text-[13px] transition-colors mt-2"
              >
                {loading
                  ? "Creating account..."
                  : role === "seller"
                  ? "Create Seller Account"
                  : "Create Account"}
              </button>

              <p className="text-[11px] text-[#9CA3AF] text-center">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-[#25A55A] hover:text-[#1A6B3C]">Terms</Link> and{" "}
                <Link href="/privacy" className="text-[#25A55A] hover:text-[#1A6B3C]">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <SignupContent />
    </Suspense>
  );
}
