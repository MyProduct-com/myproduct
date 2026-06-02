"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconEye, IconEyeOff, IconMail, IconLock, IconArrowLeft } from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";
import { mockCustomers, mockSellers, mockAdmin } from "@/lib/mock-data";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";
  const { login } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    // Check against mock data
    const customer = mockCustomers.find((u) => u.email === email);
    const seller = mockSellers.find((u) => u.email === email);
    const admin = mockAdmin.email === email ? mockAdmin : null;
    const user = customer ?? seller ?? admin ?? null;

    if (user) {
      login(user);
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "seller") router.push("/seller");
      else router.push(redirect);
    } else {
      setError("No account found with that email. Try a demo account below.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F9F5] flex">
      {/* Left panel — solid Forest Green */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A6B3C] flex-col justify-between p-12">
        <Link href="/" className="text-[18px] font-[600] tracking-[-0.01em]">
          <span className="text-[#D4F0E2]">My</span>
          <span className="text-white">Products</span>
        </Link>
        <div>
          <h2 className="text-[26px] font-[600] text-white leading-tight tracking-[-0.02em] mb-4">
            Welcome Back to Kenya&apos;s Marketplace
          </h2>
          <p className="text-[#D4F0E2] text-[15px] leading-[1.6]">
            Thousands of products from verified sellers. Fast delivery, secure payments, and great prices — all in one place.
          </p>
        </div>
        <p className="text-[#D4F0E2] text-[12px] font-[400]">
          &copy; {new Date().getFullYear()} MyProducts Kenya
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#1A6B3C] mb-6 transition-colors"
          >
            <IconArrowLeft size={14} />
            Back to marketplace
          </Link>

          <div className="bg-white rounded-[12px] border border-[0.5px] border-[#E5E7EB] p-8">
            <h1 className="text-[20px] font-[600] text-[#111827] mb-1">Sign in to your account</h1>
            <p className="text-[13px] text-[#6B7280] mb-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[#25A55A] font-[500] hover:text-[#1A6B3C]">
                Create one free
              </Link>
            </p>

            {error && (
              <div className="bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[13px] px-4 py-3 rounded-[8px] mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <IconMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-[9px] border border-[#E5E7EB] rounded-[8px] text-[13px] outline-none focus:border-[#25A55A] bg-white text-[#111827] placeholder-[#9CA3AF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-[500] text-[#374151] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IconLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-[9px] border border-[#E5E7EB] rounded-[8px] text-[13px] outline-none focus:border-[#25A55A] bg-white text-[#111827] placeholder-[#9CA3AF] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                  >
                    {showPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/auth/forgot-password" className="text-[12px] text-[#25A55A] hover:text-[#1A6B3C]">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25A55A] hover:bg-[#1A6B3C] disabled:bg-[#9CA3AF] text-white font-[500] py-[9px] rounded-[8px] text-[13px] transition-colors"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t border-[#F3F4F6]">
              <p className="text-[11px] font-[500] text-[#9CA3AF] mb-3 text-center uppercase tracking-[0.05em]">
                Demo accounts — any password
              </p>
              <div className="space-y-2">
                {[
                  { role: "Customer", email: "john.kamau@gmail.com",      cls: "bg-[#F2F9F5] text-[#1A6B3C] border-[#D4F0E2]" },
                  { role: "Seller",   email: "techhub@myproducts.co.ke",  cls: "bg-[#FFF0E8] text-[#B84000] border-[#fbd5b8]" },
                  { role: "Admin",    email: "admin@myproducts.co.ke",    cls: "bg-[#F3F4F6] text-[#374151] border-[#E5E7EB]" },
                ].map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => { setEmail(d.email); setPassword("demo123"); }}
                    className={`w-full text-left px-3 py-2.5 rounded-[8px] border text-[13px] ${d.cls} flex items-center justify-between hover:opacity-80 transition-opacity`}
                  >
                    <span className="font-[500]">{d.role}</span>
                    <span className="text-[11px] opacity-70">{d.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <LoginContent />
    </Suspense>
  );
}
