import Link from "next/link";
import { IconArrowRight, IconBuildingStore } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getLogoIcon } from "@/lib/logoIcons";
import { MOCK_SHOPS } from "@/super_admin/data/mockData";
import { SHOP_THEME_PRESETS, DEFAULT_SHOP_THEME_PRESET } from "@/lib/shopThemePresets";

interface DiscoverShop {
  slug: string;
  name: string;
  tagline: string;
  logoIcon: string;
  themePrimary: string;
  themePrimaryLight: string;
}

async function getDiscoverShops(): Promise<DiscoverShop[]> {
  try {
    const shops = await prisma.shop.findMany({
      where: { status: { in: ["active", "trial"] } },
      orderBy: { name: "asc" },
      select: { slug: true, name: true, tagline: true, logoIcon: true, themePrimary: true, themePrimaryLight: true },
    });
    return shops.map((s) => ({ ...s, tagline: s.tagline ?? "" }));
  } catch {
    // DB unreachable — same demo fallback pattern used elsewhere in the app.
    return MOCK_SHOPS.filter((s) => s.status === "active" || s.status === "trial").map((s) => {
      const preset = SHOP_THEME_PRESETS[s.id] ?? DEFAULT_SHOP_THEME_PRESET;
      return {
        slug: s.id,
        name: s.name,
        tagline: s.tagline,
        logoIcon: s.logoIcon,
        themePrimary: preset.primary,
        themePrimaryLight: preset.primaryLight,
      };
    });
  }
}

export default async function DiscoverShopsPage() {
  const shops = await getDiscoverShops();

  return (
    <div className="pb-16">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#1A6B3C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#D4F0E2] text-[12px] font-[500] px-3 py-1.5 rounded-full mb-5">
            <IconBuildingStore size={14} /> {shops.length} shop{shops.length === 1 ? "" : "s"} open for business
          </div>
          <h1 className="text-[30px] sm:text-[38px] font-[600] text-white leading-tight tracking-[-0.02em] mb-3">
            Discover Shops on MyProduct
          </h1>
          <p className="text-[#D4F0E2] text-[15px] sm:text-[16px] leading-[1.6] max-w-2xl mx-auto">
            Every shop here is independently run by a Kenyan business — its own products, its own prices,
            its own checkout. Pick a shop below to start browsing.
          </p>
        </div>
      </section>

      {/* ── SHOP GRID ─────────────────────────────────────── */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {shops.length === 0 ? (
            <div className="text-center py-20">
              <IconBuildingStore size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-[15px] font-[500] text-[#111827] mb-1">No shops are open right now</p>
              <p className="text-[13px] text-[#6B7280]">Check back soon — new shops launch regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((shop) => {
                const LogoIcon = getLogoIcon(shop.logoIcon);
                return (
                  <Link
                    key={shop.slug}
                    href={`/shop/${shop.slug}`}
                    className="group flex flex-col bg-white rounded-[16px] border border-[0.5px] border-[#E5E7EB] p-6 hover:border-[#D4F0E2] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div
                      className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-4"
                      style={{ background: shop.themePrimaryLight, color: shop.themePrimary }}
                    >
                      <LogoIcon size={26} />
                    </div>
                    <h3 className="text-[16px] font-[600] text-[#111827] mb-1">{shop.name}</h3>
                    <p className="text-[13px] text-[#6B7280] leading-[1.5] flex-1 mb-4">
                      {shop.tagline || "A shop on MyProduct."}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-[13px] font-[500] transition-colors"
                      style={{ color: shop.themePrimary }}
                    >
                      Visit Shop
                      <IconArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── SELLER CTA ────────────────────────────────────── */}
      <section className="py-12 bg-[#F2F9F5] border-y border-[0.5px] border-[#D4F0E2]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[20px] sm:text-[24px] font-[600] text-[#111827] mb-2">
            Run a business? Open your own shop.
          </h2>
          <p className="text-[13px] sm:text-[14px] text-[#6B7280] mb-6">
            Get your own branded storefront, inventory, and checkout — live in minutes.
          </p>
          <Link
            href="/auth/signup?role=seller"
            className="inline-flex items-center gap-2 bg-[#25A55A] hover:bg-[#1d9050] text-white font-[500] px-5 py-[10px] rounded-[8px] text-[13px] transition-colors"
          >
            Start Selling <IconArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
