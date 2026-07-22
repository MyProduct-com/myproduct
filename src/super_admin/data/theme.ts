// Mirrors the org-* design tokens (src/app/globals.css) so every super_admin
// module — even ones still using the legacy `T.*` inline-style components in
// ../components/layout/UI.tsx — renders with the same branding as the
// dashboard: deep forest green, not the old ad-hoc blue/violet palette.
export const SA_THEME = {
  primary:      "#1B3A2B",   // org-primary
  primaryDark:  "#142B20",   // org-primary-hover
  primaryLight: "#E8EFE9",   // org-primary-light
  accent:       "#6B8F71",   // org-accent
  accentLight:  "#E9F0EA",
  danger:       "#D64545",   // org-danger
  dangerLight:  "#FBEAEA",   // org-danger-bg
  warning:      "#C98A2C",   // org-warning
  warningLight: "#FAF0E1",
  success:      "#2E7D4F",   // org-success
  successLight: "#E5F3EA",   // org-success-bg
  bg:           "#F4F6F2",   // org-bg
  surface:      "#FFFFFF",   // org-surface
  border:       "#E4E8E2",   // org-border
  text:         "#1A1D1B",   // org-text-primary
  textMuted:    "#6B716C",   // org-text-secondary
  black:        "#1A1D1B",
  radius:       "10px",      // org-radius-sm
  radiusCard:   "20px",      // org-radius-card
  fontFamily:   "'Inter', system-ui, -apple-system, sans-serif",
};

export const SA_SIDEBAR_WIDTH = 252;
export const SA_HEADER_HEIGHT = 64;
