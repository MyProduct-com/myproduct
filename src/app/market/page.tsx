import Link from "next/link";
import { IconArrowRight, IconBuildingStore } from "@tabler/icons-react";
import { prisma } from "@/lib/prisma";
import { getLogoIcon } from "@/lib/logoIcons";
import { MOCK_SHOPS } from "@/super_admin/data/mockData";
import { SHOP_THEME_PRESETS, DEFAULT_SHOP_THEME_PRESET } from "@/lib/shopThemePresets";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 pb-16">
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="bg-[#1A6B3C]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-border-mint text-org-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <IconBuildingStore size={14} /> {shops.length} shop{shops.length === 1 ? "" : "s"} open for business
          </div>
          <h1 className="text-[30px] sm:text-[38px] font-semibold text-white leading-tight tracking-[-0.02em] mb-3">
            Discover Shops on MyProduct
          </h1>
          <p className="text-border-mint text-[15px] sm:text-org-md leading-[1.6] max-w-2xl mx-auto">
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
              <p className="text-[15px] font-medium text-gray-900 mb-1">No shops are open right now</p>
              <p className="text-org-sm text-gray-500">Check back soon — new shops launch regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((shop) => {
                const LogoIcon = getLogoIcon(shop.logoIcon);
                return (
                  <Link
                    key={shop.slug}
                    href={`/market/${shop.slug}`}
                    className="group flex flex-col bg-white rounded-xl border-[0.5px] border-gray-200 p-6 hover:border-border-mint hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div
                      className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-4"
                      style={{ background: shop.themePrimaryLight, color: shop.themePrimary }}
                    >
                      <LogoIcon size={26} />
                    </div>
                    <h3 className="text-org-md font-semibold text-gray-900 mb-1">{shop.name}</h3>
                    <p className="text-org-sm text-gray-500 leading-normal flex-1 mb-4">
                      {shop.tagline || "A shop on MyProduct."}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-org-sm font-medium transition-colors"
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
      <section className="py-12 bg-canvas border-y-[0.5px] border-border-mint">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-org-lg sm:text-[24px] font-semibold text-gray-900 mb-2">
            Run a business? Open your own shop.
          </h2>
          <p className="text-org-sm sm:text-org-base text-gray-500 mb-6">
            Get your own branded storefront, inventory, and checkout — live in minutes.
          </p>
          <Link
            href="/auth/signup?role=seller"
            className="inline-flex items-center gap-2 bg-[#25A55A] hover:bg-[#1d9050] text-white font-medium px-5 py-2.5 rounded-md text-org-sm transition-colors"
          >
            Start Selling <IconArrowRight size={14} />
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  );
}
