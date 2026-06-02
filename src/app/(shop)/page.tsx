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

// Product count per category
const categoryCounts = mockProducts.reduce<Record<string, number>>((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics:     <IconDeviceLaptop size={22} className="text-[#1A6B3C]" />,
  Fashion:         <IconShirt size={22} className="text-[#1A6B3C]" />,
  "Beauty & Health": <IconFlower size={22} className="text-[#1A6B3C]" />,
  Grocery:         <IconApple size={22} className="text-[#1A6B3C]" />,
  "Home & Office": <IconHome size={22} className="text-[#1A6B3C]" />,
  Computing:       <IconCpu size={22} className="text-[#1A6B3C]" />,
  Stationery:      <IconBook size={22} className="text-[#1A6B3C]" />,
  Sports:          <IconBallBasketball size={22} className="text-[#1A6B3C]" />,
};

function useCountdown(targetSeconds: number) {
  const [seconds, setSeconds] = useState(targetSeconds);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);
  return {
    h: Math.floor(seconds / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: seconds % 60,
  };
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#111827] text-white font-mono font-[600] text-[15px] w-9 h-9 rounded-[6px] flex items-center justify-center tabular-nums">
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-[9px] font-[500] text-[#9CA3AF] mt-0.5 uppercase tracking-[0.04em]">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const { h, m, s } = useCountdown(4 * 3600 + 23 * 60 + 45);

  return (
    <div className="pb-12">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#1A6B3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Main banner */}
            <div className="lg:col-span-2 flex items-center min-h-[260px] px-8 py-10">
              <div className="max-w-md">
                <h1
                  className="text-[26px] font-[600] text-white leading-tight tracking-[-0.02em] mb-3"
                >
                  Shop the Best of Kenya
                </h1>
                <p className="text-[#D4F0E2] text-[15px] font-[400] leading-[1.6] mb-6">
                  Electronics, Fashion, Groceries & more from verified local sellers — delivered to your door.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 bg-[#25A55A] hover:bg-[#1d9050] text-white font-[500] px-5 py-[9px] rounded-[8px] text-[13px] transition-colors"
                  >
                    Shop Now <IconArrowRight size={15} />
                  </Link>
                  <Link
                    href="/auth/signup?role=seller"
                    className="inline-flex items-center gap-2 border-[1.5px] border-white/30 text-white font-[500] px-5 py-[9px] rounded-[8px] text-[13px] hover:bg-white/10 transition-colors"
                  >
                    Start Selling
                  </Link>
                </div>
              </div>
            </div>

            {/* Side panels */}
            <div className="flex flex-col gap-3">
              {/* Deal panel — dark */}
              <div className="flex-1 rounded-[12px] bg-[#145430] border border-white/10 p-6 min-h-[124px] flex flex-col justify-between overflow-hidden relative">
                <div>
                  <p className="text-[#D4F0E2] text-[11px] font-[500] uppercase tracking-[0.05em] mb-1.5">
                    LIMITED OFFER
                  </p>
                  <h3 className="text-white font-[600] text-[17px] leading-snug mb-3">
                    Up to 40% Off Electronics
                  </h3>
                </div>
                <Link
                  href="/products?category=Electronics"
                  className="inline-flex items-center gap-1.5 bg-[#25A55A] hover:bg-[#1d9050] text-white font-[500] text-[13px] px-4 py-[9px] rounded-[8px] w-fit transition-colors"
                >
                  Shop Now <IconArrowRight size={13} />
                </Link>
              </div>

              {/* New arrivals panel — light */}
              <div className="flex-1 rounded-[12px] bg-[#F2F9F5] border border-[#D4F0E2] p-6 min-h-[124px] flex flex-col justify-between">
                <div>
                  <p className="text-[#6B7280] text-[11px] font-[500] uppercase tracking-[0.05em] mb-1.5">
                    NEW SEASON
                  </p>
                  <h3 className="text-[#111827] font-[600] text-[17px] leading-snug mb-3">
                    Fresh Fashion Arrivals
                  </h3>
                </div>
                <Link
                  href="/products?category=Fashion"
                  className="inline-flex items-center gap-1.5 border-[1.5px] border-[#25A55A] text-[#1A6B3C] hover:bg-[#D4F0E2] font-[500] text-[13px] px-4 py-[9px] rounded-[8px] w-fit transition-colors"
                >
                  Explore <IconArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────── */}
      <section className="bg-white border-y border-[0.5px] border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <IconTruck size={18} />,       title: "Fast Delivery",      sub: "Same-day in Nairobi" },
              { icon: <IconShieldCheck size={18} />, title: "Secure Payments",    sub: "M-Pesa & Card" },
              { icon: <IconRefresh size={18} />,     title: "Easy Returns",       sub: "7-day return policy" },
              { icon: <IconHeadset size={18} />,     title: "24/7 Support",       sub: "Always here to help" },
            ].map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D4F0E2] text-[#25A55A] flex items-center justify-center flex-shrink-0">
                  {b.icon}
                </div>
                <div>
                  <p className="text-[14px] font-[500] text-[#111827]">{b.title}</p>
                  <p className="text-[12px] text-[#6B7280]">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-[600] text-[#111827]">Shop by Category</h2>
            <Link
              href="/products"
              className="text-[13px] font-[500] text-[#25A55A] hover:text-[#1A6B3C] flex items-center gap-1 transition-colors"
            >
              See All <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {mockCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-2"
              >
                <div className="w-full aspect-square rounded-[12px] bg-white border border-[0.5px] border-[#E5E7EB] group-hover:border-[#D4F0E2] flex items-center justify-center transition-colors">
                  <div className="w-10 h-10 rounded-[10px] bg-[#D4F0E2] flex items-center justify-center">
                    {categoryIcons[cat.name]}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-[500] text-[#111827] leading-tight">{cat.name}</p>
                  <p className="text-[11px] text-[#6B7280]">{categoryCounts[cat.name] ?? 0} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ───────────────────────────────────── */}
      <section className="py-6 bg-white border-y border-[0.5px] border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-[4px] bg-[#E8500A] flex items-center justify-center">
                  <IconBolt size={12} className="text-white fill-white" />
                </div>
                <h2 className="text-[20px] font-[600] text-[#111827]">Flash Deals</h2>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[11px] font-[500] text-[#6B7280] uppercase tracking-[0.03em]">
                  Ends in:
                </span>
                <div className="flex items-center gap-1">
                  <TimeBlock value={h} label="HRS" />
                  <span className="text-[#9CA3AF] font-[600] text-[15px] mb-4">:</span>
                  <TimeBlock value={m} label="MIN" />
                  <span className="text-[#9CA3AF] font-[600] text-[15px] mb-4">:</span>
                  <TimeBlock value={s} label="SEC" />
                </div>
              </div>
            </div>
            <Link
              href="/products?deals=true"
              className="text-[13px] font-[500] text-[#25A55A] hover:text-[#1A6B3C] flex items-center gap-1 transition-colors"
            >
              See All <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {FLASH_DEALS.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP SELLING ───────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-[600] text-[#111827]">Top Selling Products</h2>
            <Link
              href="/products"
              className="text-[13px] font-[500] text-[#25A55A] hover:text-[#1A6B3C] flex items-center gap-1 transition-colors"
            >
              View All <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {FEATURED.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ─────────────────────────────────── */}
      <section className="py-6 bg-white border-y border-[0.5px] border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Deal banner — Forest Green */}
            <div className="rounded-[12px] bg-[#1A6B3C] p-7 flex flex-col justify-between min-h-[160px] overflow-hidden relative">
              <div>
                <p className="text-[#D4F0E2] text-[11px] font-[500] uppercase tracking-[0.05em] mb-1.5">
                  DAILY ESSENTIALS
                </p>
                <h3 className="text-white text-[17px] font-[600] leading-snug mb-2">
                  Fresh Groceries Delivered
                </h3>
                <p className="text-[#D4F0E2] text-[13px] leading-[1.5]">
                  Same-day delivery from local farms in Nairobi
                </p>
              </div>
              <Link
                href="/products?category=Grocery"
                className="inline-flex items-center gap-1.5 mt-4 bg-[#25A55A] hover:bg-[#1d9050] text-white font-[500] text-[13px] px-4 py-[9px] rounded-[8px] w-fit transition-colors"
              >
                Order Now <IconArrowRight size={13} />
              </Link>
            </div>

            {/* New arrivals banner — Canvas */}
            <div className="rounded-[12px] bg-[#F2F9F5] border border-[0.5px] border-[#D4F0E2] p-7 flex flex-col justify-between min-h-[160px]">
              <div>
                <p className="text-[#6B7280] text-[11px] font-[500] uppercase tracking-[0.05em] mb-1.5">
                  TECH HUB
                </p>
                <h3 className="text-[#111827] text-[17px] font-[600] leading-snug mb-2">
                  Latest Gadgets & Electronics
                </h3>
                <p className="text-[#374151] text-[13px] leading-[1.5]">
                  Authorized dealers, genuine products, warranty included
                </p>
              </div>
              <Link
                href="/products?category=Electronics"
                className="inline-flex items-center gap-1.5 mt-4 border-[1.5px] border-[#25A55A] text-[#1A6B3C] hover:bg-[#D4F0E2] font-[500] text-[13px] px-4 py-[9px] rounded-[8px] w-fit transition-colors"
              >
                Shop Tech <IconArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────── */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-[600] text-[#111827]">New Arrivals</h2>
            <Link
              href="/products?new=true"
              className="text-[13px] font-[500] text-[#25A55A] hover:text-[#1A6B3C] flex items-center gap-1 transition-colors"
            >
              See All <IconArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {NEW_ARRIVALS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────── */}
      <section className="py-10 bg-[#1A6B3C]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[26px] font-[600] text-white tracking-[-0.02em] mb-2">
            Exclusive Deals in Your Inbox
          </h2>
          <p className="text-[#D4F0E2] text-[15px] mb-6">
            Subscribe and be the first to know about flash sales and special offers.
          </p>
          <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-[9px] rounded-[8px] text-[13px] outline-none bg-white text-[#111827] placeholder-[#9CA3AF] border border-transparent focus:border-[#25A55A]"
            />
            <button
              type="submit"
              className="bg-[#111827] hover:bg-[#1F2937] text-white font-[500] px-5 py-[9px] rounded-[8px] text-[13px] transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[#D4F0E2] text-[11px] mt-3 font-[400]">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
