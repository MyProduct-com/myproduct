"use client";

// Client-only UI preferences (theme accent, sidebar default, notification
// categories). Stored per-browser in localStorage — these are cosmetic/UX
// preferences, not domain data, so they don't need a DB round-trip.

export interface ThemeOption {
  id: string;
  label: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  accent: string;
}

// Curated, muted, high-contrast options — no neon/bright colors, kept to a
// small set so the palette stays cohesive with the rest of the app.
export const THEME_PALETTE: ThemeOption[] = [
  { id: "forest", label: "Forest",  primary: "#1B3A2B", primaryHover: "#142B20", primaryLight: "#E8EFE9", accent: "#6B8F71" },
  { id: "slate",  label: "Slate",   primary: "#334155", primaryHover: "#1E293B", primaryLight: "#E7EAEE", accent: "#7C8CA5" },
  { id: "teal",   label: "Teal",    primary: "#134E4A", primaryHover: "#0D3835", primaryLight: "#E4EEED", accent: "#5F9C95" },
  { id: "plum",   label: "Plum",    primary: "#3B2F42", primaryHover: "#2A2130", primaryLight: "#EAE7EC", accent: "#8B7A99" },
  { id: "espresso", label: "Espresso", primary: "#3B2A20", primaryHover: "#2A1D16", primaryLight: "#ECE6E2", accent: "#9C8271" },
  { id: "navy",   label: "Navy",    primary: "#1E2A4A", primaryHover: "#151E36", primaryLight: "#E5E8EF", accent: "#6E7FA6" },
];

export interface NotificationPrefs {
  expiring: boolean;
  tickets: boolean;
  suspended: boolean;
}

export interface UiPrefs {
  themeId: string;
  sidebarDefaultExpanded: boolean;
  notifications: NotificationPrefs;
}

export const DEFAULT_UI_PREFS: UiPrefs = {
  themeId: "forest",
  sidebarDefaultExpanded: false,
  notifications: { expiring: true, tickets: true, suspended: true },
};

const STORAGE_KEY = "myproduct-ui-prefs";

export function getUiPrefs(): UiPrefs {
  if (typeof window === "undefined") return DEFAULT_UI_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_UI_PREFS;
    return { ...DEFAULT_UI_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_UI_PREFS;
  }
}

export function setUiPrefs(patch: Partial<UiPrefs>): UiPrefs {
  const next = { ...getUiPrefs(), ...patch };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("uiprefs:change", { detail: next }));
  }
  return next;
}

export function applyThemeToDocument(themeId: string) {
  if (typeof document === "undefined") return;
  const theme = THEME_PALETTE.find((t) => t.id === themeId) ?? THEME_PALETTE[0];
  const root = document.documentElement;
  root.style.setProperty("--org-primary", theme.primary);
  root.style.setProperty("--org-primary-hover", theme.primaryHover);
  root.style.setProperty("--org-primary-light", theme.primaryLight);
  root.style.setProperty("--org-accent", theme.accent);
  root.style.setProperty("--color-org-primary", theme.primary);
  root.style.setProperty("--color-org-primary-hover", theme.primaryHover);
  root.style.setProperty("--color-org-primary-light", theme.primaryLight);
  root.style.setProperty("--color-org-accent", theme.accent);
}
