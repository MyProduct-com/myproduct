"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  IconArrowRight,
  IconBolt,
  IconTruck,
  IconShieldCheck,
  IconRefresh,
  IconHeadset,
  IconDeviceLaptop,
  IconShirt,
  IconFlower,
  IconApple,
  IconHome,
  IconCpu,
  IconBook,
  IconBallBasketball,
} from "@tabler/icons-react";
import ProductCard from "@/components/ui/ProductCard";
import { mockProducts, mockCategories } from "@/lib/mock-data";

const FLASH_DEALS = mockProducts.filter((p) => p.isFlashDeal);
const FEATURED = mockProducts.filter((p) => p.isFeatured).slice(0, 5);
const NEW_ARRIVALS = mockProducts.filter((p) => p.isNew).slice(0, 4);

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <IconDeviceLaptop size={28} />,
  Fashion: <IconShirt size={28} />,
  "Beauty & Health": <IconFlower size={28} />,
  Grocery: <IconApple size={28} />,
  "Home & Office": <IconHome size={28} />,
  Computing: <IconCpu size={28} />,
  Stationery: <IconBook size={28} />,
  Sports: <IconBallBasketball size={28} />,
};

function useCountdown(targetSeconds: number) {
  const [seconds, setSeconds] = useState(targetSeconds);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return { h, m, s };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white font-bold text-lg w-10 h-10 rounded-lg flex items-center justify-center tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[10px] text-gray-500 mt-0.5">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const { h, m, s } = useCountdown(4 * 3600 + 23 * 60 + 45);

  return (
    <div className="pb-12">
      {/* ── HERO SECTION ───────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main hero banner */}
            <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-800 via-green-700 to-green-600 min-h-[280px] flex items-center">
              <div className="relative z-10 p-8 sm:p-10 max-w-md">
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  NEW ARRIVALS 2024
                </span>
                <h1
                  className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Shop the Best of Kenya
                </h1>
                <p className="text-green-100 text-sm sm:text-base mb-6 leading-relaxed">
                  Electronics, Fashion, Groceries & more from verified local sellers — delivered to your door.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-green-50 transition-colors text-sm"
                  >
                    Shop Now <IconArrowRight size={16} />
                  </Link>
                  <Link
                    href="/auth/signup?role=seller"
                    className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
                  >
                    Start Selling
                  </Link>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5" />
              <div className="absolute -right-4 bottom-0 w-40 h-40 rounded-full bg-white/5" />
            </div>

            {/* Side promo banners */}
            <div className="flex flex-col gap-4">
              <div className="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-orange-400 p-6 flex flex-col justify-between min-h-[130px] relative">
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-1">LIMITED OFFER</p>
                  <h3 className="text-white font-bold text-lg leading-snug">
                    Up to 40% Off Electronics
                  </h3>
                </div>
                <Link
                  href="/products?category=Electronics"
                  className="inline-flex items-center gap-1.5 text-white font-semibold text-sm hover:underline"
                >
                  Shop Now <IconArrowRight size={14} />
                </Link>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-purple-500 p-6 flex flex-col justify-between min-h-[130px] relative">
                <div>
                  <p className="text-white/80 text-xs font-semibold mb-1">NEW SEASON</p>
                  <h3 className="text-white font-bold text-lg leading-snug">
                    Fresh Fashion Arrivals
                  </h3>
                </div>
                <Link
                  href="/products?category=Fashion"
                  className="inline-flex items-center gap-1.5 text-white font-semibold text-sm hover:underline"
                >
                  Explore <IconArrowRight size={14} />
                </Link>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <IconTruck size={20} />, title: "Fast Delivery", sub: "Same-day in Nairobi" },
              { icon: <IconShieldCheck size={20} />, title: "Secure Payments", sub: "M-Pesa & Card" },
              { icon: <IconRefresh size={20} />, title: "Easy Returns", sub: "7-day return policy" },
              { icon: <IconHeadset size={20} />, title: "24/7 Support", sub: "Always here to help" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3 py-2">
                <div className="w-9 h-9 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{b.title}</p>
                  <p className="text-xs text-gray-500">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Shop by Category</h2>
            <Link
              href="/products"
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              See All <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {mockCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className={`w-full aspect-square rounded-2xl border flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}
                >
                  {categoryIcons[cat.name]}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ─────────────────────────────────────── */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <IconBolt size={20} className="text-orange-500 fill-orange-500" />
                <h2 className="text-xl font-bold text-gray-900">Flash Deals</h2>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs text-gray-500 font-medium">Ends in:</span>
                <div className="flex items-center gap-1">
                  <TimeBlock value={h} label="HRS" />
                  <span className="text-gray-400 font-bold mb-3">:</span>
                  <TimeBlock value={m} label="MIN" />
                  <span className="text-gray-400 font-bold mb-3">:</span>
                  <TimeBlock value={s} label="SEC" />
                </div>
              </div>
            </div>
            <Link
              href="/products?deals=true"
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              See All <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {FLASH_DEALS.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Top Selling Products</h2>
            <Link
              href="/products"
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              View All <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ───────────────────────────────────── */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-green-700 to-green-500 p-7 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
              <div>
                <p className="text-green-200 text-xs font-semibold mb-1.5">DAILY ESSENTIALS</p>
                <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Fresh Groceries Delivered
                </h3>
                <p className="text-green-100 text-sm">Same-day delivery from local farms in Nairobi</p>
              </div>
              <Link
                href="/products?category=Grocery"
                className="inline-flex items-center gap-1.5 mt-4 bg-white text-green-700 font-semibold text-sm px-4 py-2 rounded-lg w-fit hover:bg-green-50 transition-colors"
              >
                Order Now <IconArrowRight size={14} />
              </Link>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-blue-700 to-blue-500 p-7 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
              <div>
                <p className="text-blue-200 text-xs font-semibold mb-1.5">TECH HUB</p>
                <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
                  Latest Gadgets & Electronics
                </h3>
                <p className="text-blue-100 text-sm">Authorized dealers, genuine products, warranty included</p>
              </div>
              <Link
                href="/products?category=Electronics"
                className="inline-flex items-center gap-1.5 mt-4 bg-white text-blue-700 font-semibold text-sm px-4 py-2 rounded-lg w-fit hover:bg-blue-50 transition-colors"
              >
                Shop Tech <IconArrowRight size={14} />
              </Link>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
            <Link
              href="/products?new=true"
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1"
            >
              See All <IconArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {NEW_ARRIVALS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────── */}
      <section className="py-10 bg-green-600">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Get Exclusive Deals in Your Inbox
          </h2>
          <p className="text-green-100 text-sm mb-6">
            Subscribe and be the first to know about flash sales, new arrivals, and special offers.
          </p>
          <form
            className="flex gap-2 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
