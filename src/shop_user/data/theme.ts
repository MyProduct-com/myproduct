import type { Theme } from "./types/index.js";

export const DEFAULT_THEME: Theme = {
  // Colors
  primary:        "#16a34a",  // green-600
  primaryDark:    "#15803d",  // green-700
  primaryLight:   "#bbf7d0",  // green-100
  accent:         "#166534",  // green-900
  bg:             "#ffffff",
  surface:        "#f0fdf4",  // green-50
  border:         "#d1fae5",  // green-100
  text:           "#111827",
  textMuted:      "#6b7280",
  textOnPrimary:  "#ffffff",
  black:          "#111827",
  danger:         "#dc2626",
  // Typography
  fontFamily:     "'Segoe UI', system-ui, sans-serif",
  // Shop identity
  shopName:       "FreshMart",
  shopTagline:    "Fresh picks, fair prices.",
  logoEmoji:      "🛒",
  // Radius
  radius:         "12px",
  radiusCard:     "16px",
};
