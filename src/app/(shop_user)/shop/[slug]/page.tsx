import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MOCK_SHOPS } from "@/super_admin/data/mockData";
import { SHOP_THEME_PRESETS, DEFAULT_SHOP_THEME_PRESET } from "@/lib/shopThemePresets";
import ShopStorefront from "@/shop_user/ShopStorefront";
import type { Theme } from "@/shop_user/types/index";

export default async function ShopBySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const shop = await prisma.shop.findUnique({ where: { slug } });
    if (!shop) return notFound();
    if (shop.status === "pulled_down") return notFound();

    const initialTheme: Partial<Theme> = {
      primary: shop.themePrimary,
      primaryDark: shop.themePrimaryDark,
      primaryLight: shop.themePrimaryLight,
      accent: shop.themeAccent,
      bg: shop.themeBg,
      surface: shop.themeSurface,
      border: shop.themeBorder,
      text: shop.themeText,
      textMuted: shop.themeTextMuted,
      textOnPrimary: shop.themeTextOnPrimary,
      black: shop.themeBlack,
      fontFamily: shop.themeFontFamily,
      radius: shop.themeRadius,
      radiusCard: shop.themeRadiusCard,
      shopName: shop.name,
      shopTagline: shop.tagline ?? "",
      logoIcon: shop.logoIcon,
    };

    return <ShopStorefront initialTheme={initialTheme} />;
  } catch {
    // DB unreachable — fall back to the matching demo shop so the storefront
    // is still reviewable locally without Postgres running. See getSuperAdminDashboardData
    // for the same resilience pattern used elsewhere.
    const demo = MOCK_SHOPS.find((s) => s.id === slug);
    if (!demo) return notFound();
    const preset = SHOP_THEME_PRESETS[slug] ?? DEFAULT_SHOP_THEME_PRESET;

    const initialTheme: Partial<Theme> = {
      primary: preset.primary,
      primaryDark: preset.primaryDark,
      primaryLight: preset.primaryLight,
      accent: preset.accent,
      surface: preset.surface,
      border: preset.border,
      shopName: demo.name,
      shopTagline: demo.tagline,
      logoIcon: demo.logoIcon,
    };

    return <ShopStorefront initialTheme={initialTheme} />;
  }
}
