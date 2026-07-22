// Per-shop brand theme presets, keyed by Shop.slug. Used both by
// prisma/seed.ts (to seed real Shop rows) and by the storefront route's
// demo fallback when the database is unreachable — single source of truth
// so the two never drift apart.
export interface ShopThemePreset {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  surface: string;
  border: string;
}

export const SHOP_THEME_PRESETS: Record<string, ShopThemePreset> = {
  shop_001: { primary: "#16a34a", primaryDark: "#15803d", primaryLight: "#bbf7d0", accent: "#166534", surface: "#f0fdf4", border: "#d1fae5" }, // FreshMart — green
  shop_002: { primary: "#2563eb", primaryDark: "#1d4ed8", primaryLight: "#bfdbfe", accent: "#1e40af", surface: "#eff6ff", border: "#dbeafe" }, // TechZone — blue
  shop_003: { primary: "#4d7c0f", primaryDark: "#3f6212", primaryLight: "#d9f99d", accent: "#365314", surface: "#f7fee7", border: "#ecfccb" }, // Mama Mboga — olive
  shop_004: { primary: "#db2777", primaryDark: "#be185d", primaryLight: "#fbcfe8", accent: "#9d174d", surface: "#fdf2f8", border: "#fce7f3" }, // StyleHub — rose
  shop_005: { primary: "#d97706", primaryDark: "#b45309", primaryLight: "#fde68a", accent: "#92400e", surface: "#fffbeb", border: "#fef3c7" }, // AutoParts KE — amber
  shop_006: { primary: "#7c3aed", primaryDark: "#6d28d9", primaryLight: "#ddd6fe", accent: "#5b21b6", surface: "#f5f3ff", border: "#ede9fe" }, // BookNest — plum
};

export const DEFAULT_SHOP_THEME_PRESET: ShopThemePreset = SHOP_THEME_PRESETS.shop_001;
