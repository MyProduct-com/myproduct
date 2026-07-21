import { Palette } from "lucide-react";
import type { Theme } from "../types/index.js";
import { LOGO_ICON_OPTIONS } from "@/lib/logoIcons";

interface ThemeField {
  key: keyof Theme;
  label: string;
  type: "text" | "color" | "icon";
}

interface ThemeEditorProps {
  theme: Theme;
  onChange: (key: keyof Theme | "__reset__", val?: string) => void;
  onClose: () => void;
}

const FIELDS: ThemeField[] = [
  { key: "shopName",     label: "Shop Name",      type: "text" },
  { key: "shopTagline",  label: "Tagline",         type: "text" },
  { key: "logoIcon",     label: "Logo Icon",       type: "icon" },
  { key: "primary",      label: "Primary (Green)", type: "color" },
  { key: "primaryDark",  label: "Primary Dark",    type: "color" },
  { key: "primaryLight", label: "Primary Light",   type: "color" },
  { key: "accent",       label: "Accent",          type: "color" },
  { key: "bg",           label: "Background",      type: "color" },
  { key: "surface",      label: "Surface",         type: "color" },
  { key: "border",       label: "Border",          type: "color" },
  { key: "text",         label: "Text",            type: "color" },
  { key: "textMuted",    label: "Muted Text",      type: "color" },
  { key: "radius",       label: "Border Radius",   type: "text" },
];

export default function ThemeEditor({ theme, onChange, onClose }: ThemeEditorProps) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
      <div style={{ background: "#fff", width: 300, height: "100%", overflowY: "auto", padding: 24, boxShadow: "-4px 0 24px rgba(0,0,0,0.18)", fontFamily: theme.fontFamily }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.accent, display: "flex", alignItems: "center", gap: 8 }}>
            <Palette size={18} />
            Customise Theme
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: theme.textMuted }}>×</button>
        </div>

        {FIELDS.map(f => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {f.label}
            </label>
            {f.type === "color" ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="color"
                  value={theme[f.key] as string}
                  onChange={e => onChange(f.key, e.target.value)}
                  style={{ width: 36, height: 36, border: "none", borderRadius: 8, cursor: "pointer", padding: 2 }}
                />
                <span style={{ fontSize: 13, color: theme.text, fontFamily: "monospace" }}>{theme[f.key] as string}</span>
              </div>
            ) : f.type === "icon" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6 }}>
                {LOGO_ICON_OPTIONS.map(({ name, icon: OptionIcon }) => {
                  const selected = (theme[f.key] as string) === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => onChange(f.key, name)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        border: selected ? `2px solid ${theme.primary}` : `1.5px solid ${theme.border}`,
                        background: selected ? theme.surface : "#fff",
                        color: selected ? theme.primary : theme.textMuted,
                        cursor: "pointer",
                      }}
                    >
                      <OptionIcon size={16} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                value={theme[f.key] as string}
                onChange={e => onChange(f.key, e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `1.5px solid ${theme.border}`, fontSize: 13, color: theme.text, boxSizing: "border-box" }}
              />
            )}
          </div>
        ))}

        <button
          onClick={() => onChange("__reset__")}
          style={{ width: "100%", padding: "10px", borderRadius: 8, background: theme.surface, border: `1.5px solid ${theme.border}`, color: theme.accent, fontWeight: 700, cursor: "pointer", marginTop: 8 }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
