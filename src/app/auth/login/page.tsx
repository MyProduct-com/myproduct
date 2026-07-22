"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { IconEye, IconEyeOff, IconMail, IconLock, IconArrowLeft, IconBrandGoogleFilled } from "@tabler/icons-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const role = session?.user?.role;
    if (role === "ADMIN") router.push("/admin");
    else if (role === "SELLER") router.push("/seller");
    else if (role === "SHOP_ADMIN") router.push("/shop_admin");
    else if (role === "SUPER_ADMIN") router.push("/super_admin");
    else router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1A6B3C] flex-col justify-between p-12">
        <Link href="/" className="text-[18px] font-semibold tracking-[-0.01em]">
          <span className="text-border-mint">My</span>
          <span className="text-white">Products</span>
        </Link>
        <div>
          <h2 className="text-[26px] font-semibold text-white leading-tight tracking-[-0.02em] mb-4">
            Welcome Back to Kenya&apos;s Marketplace
          </h2>
          <p className="text-border-mint text-[15px] leading-[1.6]">
            Thousands of products from verified sellers. Fast delivery, secure payments, and great prices, all in one place.
          </p>
        </div>
        <p className="text-border-mint text-org-xs font-normal">
          &copy; {new Date().getFullYear()} MyProducts Kenya
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link
            href="/market"
            className="inline-flex items-center gap-1.5 text-org-sm text-gray-500 hover:text-[#1A6B3C] mb-6 transition-colors"
          >
            <IconArrowLeft size={14} />
            Back to marketplace
          </Link>

          <div className="bg-white rounded-lg border-[0.5px] border-gray-200 p-8">
            <h1 className="text-org-lg font-semibold text-gray-900 mb-1">Sign in to your account</h1>
            <p className="text-org-sm text-gray-500 mb-6">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[#25A55A] font-medium hover:text-[#1A6B3C]">
                Create one free
              </Link>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-org-sm px-4 py-3 rounded-md mb-5">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: redirect }); }}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-2.5 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-gray-900 font-medium py-2.25 rounded-md text-org-sm transition-colors mb-5"
            >
              <IconBrandGoogleFilled size={15} className="text-[#EA4335]" />
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-org-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <IconMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.25 border border-gray-200 rounded-md text-org-sm outline-none focus:border-[#25A55A] bg-white text-gray-900 placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-org-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <IconLock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.25 border border-gray-200 rounded-md text-org-sm outline-none focus:border-[#25A55A] bg-white text-gray-900 placeholder-gray-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                  >
                    {showPw ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/auth/forgot-password" className="text-org-xs text-[#25A55A] hover:text-[#1A6B3C]">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#25A55A] hover:bg-[#1A6B3C] disabled:bg-gray-400 text-white font-medium py-2.25 rounded-md text-org-sm transition-colors"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo accounts (seeded by prisma/seed.ts) */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-[11px] font-medium text-gray-400 mb-3 text-center uppercase tracking-wider">
                Demo accounts &middot; password: password123
              </p>
              <div className="space-y-2">
                {[
                  { role: "Customer",    email: "john.kamau@gmail.com",      cls: "bg-canvas text-[#1A6B3C] border-border-mint" },
                  { role: "Seller",      email: "techhub@myproducts.co.ke",  cls: "bg-ember-surface text-[#B84000] border-[#fbd5b8]" },
                  { role: "Admin",       email: "admin@myproducts.co.ke",    cls: "bg-gray-100 text-gray-700 border-gray-200" },
                  { role: "Shop Admin",  email: "james@freshmart.co.ke",     cls: "bg-blue-50 text-blue-700 border-blue-200" },
                  { role: "Super Admin", email: "alex@system.admin",         cls: "bg-org-primary text-white border-org-primary" },
                ].map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => { setEmail(d.email); setPassword("password123"); }}
                    className={`w-full text-left px-3 py-2.5 rounded-md border text-org-sm ${d.cls} flex items-center justify-between hover:opacity-80 transition-opacity`}
                  >
                    <span className="font-medium">{d.role}</span>
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
