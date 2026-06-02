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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 to-green-600 flex-col justify-between p-12">
        <Link
          href="/"
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          My<span className="text-green-200">Products</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Welcome Back to Kenya&apos;s Marketplace
          </h2>
          <p className="text-green-100 text-lg leading-relaxed">
            Thousands of products from verified sellers. Fast delivery, secure payments, and great prices — all in one place.
          </p>
        </div>
        <p className="text-green-300 text-sm">&copy; {new Date().getFullYear()} MyProducts Kenya</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <IconArrowLeft size={15} />
            Back to marketplace
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-sm text-gray-500 mb-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-green-600 font-semibold hover:underline">
                Create one free
              </Link>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <IconMail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IconLock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <IconEyeOff size={17} /> : <IconEye size={17} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/auth/forgot-password" className="text-xs text-green-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 font-medium mb-3 text-center uppercase tracking-wider">
                Demo accounts (any password)
              </p>
              <div className="space-y-2">
                {[
                  { role: "Customer", email: "john.kamau@gmail.com", color: "bg-blue-50 text-blue-700 border-blue-100" },
                  { role: "Seller", email: "techhub@myproducts.co.ke", color: "bg-orange-50 text-orange-700 border-orange-100" },
                  { role: "Admin", email: "admin@myproducts.co.ke", color: "bg-red-50 text-red-700 border-red-100" },
                ].map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => { setEmail(d.email); setPassword("demo123"); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm ${d.color} flex items-center justify-between hover:opacity-80 transition-opacity`}
                  >
                    <span className="font-semibold">{d.role}</span>
                    <span className="text-xs opacity-70">{d.email}</span>
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
