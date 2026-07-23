import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShopTheme {
  primary:       string;
  primaryDark:   string;
  primaryLight:  string;
  accent:        string;
  bg:            string;
  surface:       string;
  border:        string;
  text:          string;
  textMuted:     string;
  textOnPrimary: string;
  black:         string;
  danger:        string;
  fontFamily:    string;
  shopName:      string;
  shopTagline:   string;
  logoIcon:      string;
  radius:        string;
  radiusCard:    string;
}

export const DEFAULT_SHOP_THEME: ShopTheme = {
  primary:       "#16a34a",
  primaryDark:   "#15803d",
  primaryLight:  "#bbf7d0",
  accent:        "#166534",
  bg:            "#ffffff",
  surface:       "#f0fdf4",
  border:        "#d1fae5",
  text:          "#111827",
  textMuted:     "#6b7280",
  textOnPrimary: "#ffffff",
  black:         "#111827",
  danger:        "#dc2626",
  fontFamily:    "'Segoe UI', system-ui, sans-serif",
  shopName:      "FreshMart",
  shopTagline:   "Fresh picks, fair prices.",
  logoIcon:      "ShoppingCart",
  radius:        "12px",
  radiusCard:    "32px",
};

interface ThemeStore {
  theme:        ShopTheme;
  updateTheme:  (key: keyof ShopTheme, value: string) => void;
  resetTheme:   () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: DEFAULT_SHOP_THEME,

      updateTheme: (key, value) =>
        set((s) => ({ theme: { ...s.theme, [key]: value } })),

      resetTheme: () =>
        set({ theme: DEFAULT_SHOP_THEME }),
    }),
    { name: "freshmart-theme" }
  )
);
