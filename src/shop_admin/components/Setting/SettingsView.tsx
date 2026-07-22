"use client";

import { useState } from "react";
import { Store, Palette, Bell, AlertTriangle, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import type { Theme, Shop } from "../../types/index";
import { SectionHeader, Btn, Input, Card } from "../layout/UI";
import { useThemeStore } from "@/store/themeStore";
import type { ShopTheme } from "@/store/themeStore";
import { LOGO_ICON_OPTIONS, getLogoIcon } from "@/lib/logoIcons";

interface SettingsViewProps {
  theme: Theme;
  shop: Shop;
  onTheme: (key: keyof Theme, val: string) => void;
  onThemeReset: () => void;
  onShop: (shop: Shop) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const COLOR_FIELDS: { key: keyof ShopTheme; label: string }[] = [
  { key: "primary",      label: "Primary Color"  },
  { key: "primaryDark",  label: "Primary Dark"   },
  { key: "primaryLight", label: "Primary Light"  },
  { key: "accent",       label: "Accent Color"   },
  { key: "bg",           label: "Background"     },
  { key: "surface",      label: "Surface"        },
  { key: "border",       label: "Border"         },
  { key: "text",         label: "Text"           },
  { key: "textMuted",    label: "Muted Text"     },
  { key: "danger",       label: "Danger / Red"   },
];

const TEXT_FIELDS: { key: keyof ShopTheme; label: string; placeholder: string }[] = [
  { key: "shopName",    label: "Shop Name",     placeholder: "FreshMart"                  },
  { key: "shopTagline", label: "Tagline",       placeholder: "Farm to doorstep, every day." },
  { key: "logoIcon",    label: "Logo Icon",     placeholder: "Store"                        },
  { key: "radius",      label: "Border Radius", placeholder: "8px"                         },
  { key: "radiusCard",  label: "Card Radius",   placeholder: "12px"                        },
];

interface PendingChange {
  key: keyof ShopTheme;
  label: string;
  oldValue: string;
  newValue: string;
}

export default function SettingsView({
  theme, shop, onShop, onToast,
}: SettingsViewProps) {
  const { theme: shopTheme, updateTheme, resetTheme } = useThemeStore();

  const [activeTab, setActiveTab]       = useState<"shop" | "theme" | "notifications">("shop");
  const [shopForm, setShopForm]         = useState<Shop>({ ...shop });
  const [pending, setPending]           = useState<PendingChange | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const setShopField = (k: keyof Shop) => (v: string) =>
    setShopForm((f) => ({ ...f, [k]: v }));

  const saveShop = () => {
    onShop(shopForm);
    // Also sync shop name / tagline / emoji to theme store
    updateTheme("shopName",    shopForm.name);
    updateTheme("shopTagline", shopForm.tagline);
    updateTheme("logoIcon",    shopForm.logoIcon);
    onToast("Shop settings saved and reflected in storefront.", "success");
  };

  // Called when admin changes a color — shows confirmation first
  const handleColorChange = (key: keyof ShopTheme, label: string, newValue: string) => {
    setPending({
      key,
      label,
      oldValue: shopTheme[key] as string,
      newValue,
    });
  };

  // Admin confirmed the color change
  const applyChange = () => {
    if (!pending) return;
    updateTheme(pending.key, pending.newValue);
    onToast(`${pending.label} updated in live shop`, "success");
    setPending(null);
  };

  // Admin cancelled
  const cancelChange = () => setPending(null);

  // Reset confirmed
  const confirmReset = () => {
    resetTheme();
    setShowResetConfirm(false);
    onToast("Theme reset to default colours.", "info");
  };

  const tabs = [
    { id: "shop",          label: "Shop Info",        icon: Store },
    { id: "theme",         label: "Storefront Theme", icon: Palette },
    { id: "notifications", label: "Notifications",    icon: Bell },
  ] as const;

  return (
    <div>
      <SectionHeader
        title="Settings"
        subtitle="Manage your shop info, storefront appearance, and notifications."
        theme={theme}
      />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: `2px solid ${theme.border}`, marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "10px 20px", background: "none", border: "none",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              color: activeTab === t.id ? theme.primary : theme.textMuted,
              borderBottom: activeTab === t.id ? `2.5px solid ${theme.primary}` : "2px solid transparent",
              marginBottom: -2, display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── SHOP INFO ── */}
      {activeTab === "shop" && (
        <div style={{ maxWidth: 640 }}>
          <Card theme={theme} style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 16 }}>
              Shop Details
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Shop Name" value={shopForm.name} onChange={setShopField("name")} theme={theme} />
              </div>
              <Input label="Tagline"    value={shopForm.tagline}   onChange={setShopField("tagline")}   theme={theme} />
              <Input label="Phone"      value={shopForm.phone}     onChange={setShopField("phone")}     theme={theme} />
              <Input label="Email"      value={shopForm.email}     onChange={setShopField("email")}     type="email" theme={theme} />
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Address" value={shopForm.address} onChange={setShopField("address")} theme={theme} />
              </div>
              <Input label="Currency" value={shopForm.currency} onChange={setShopField("currency")} theme={theme} />
              <Input label="Timezone" value={shopForm.timezone} onChange={setShopField("timezone")} theme={theme} />
            </div>

            {/* Logo icon picker */}
            <div style={{ marginTop: 14, marginBottom: 4 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Logo Icon
              </label>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))", gap: 8,
                maxHeight: 168, overflowY: "auto", padding: 10,
                border: `1.5px solid ${theme.border}`, borderRadius: theme.radius, background: theme.bg,
              }}>
                {LOGO_ICON_OPTIONS.map((opt) => {
                  const selected = shopForm.logoIcon === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      title={opt.name}
                      onClick={() => setShopField("logoIcon")(opt.name)}
                      style={{
                        width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: theme.radius,
                        border: `2px solid ${selected ? theme.primary : theme.border}`,
                        background: selected ? theme.primaryLight : theme.surface,
                        color: selected ? theme.primary : theme.textMuted,
                        cursor: "pointer",
                      }}
                    >
                      <opt.icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Btn theme={theme} onClick={saveShop}>Save Shop Info</Btn>
            </div>
          </Card>

          <Card theme={theme}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 12 }}>
              Danger Zone
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${theme.border}` }}>
              <div>
                <div style={{ fontWeight: 600, color: theme.black }}>Clear All Orders</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Permanently remove all order history.</div>
              </div>
              <Btn theme={theme} variant="danger" small
                onClick={() => onToast("Export data first before clearing orders.", "error")}>
                Clear Orders
              </Btn>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0" }}>
              <div>
                <div style={{ fontWeight: 600, color: theme.black }}>Reset Theme to Default</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Restore original colours in the live shop.</div>
              </div>
              <Btn theme={theme} variant="danger" small onClick={() => setShowResetConfirm(true)}>
                Reset Theme
              </Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── THEME EDITOR ── */}
      {activeTab === "theme" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Pending confirmation banner */}
          {pending && (
            <div style={{
              gridColumn: "1/-1",
              background: "#fefce8", border: "2px solid #fde68a",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={16} /> Confirm colour change — <span style={{ fontWeight: 400 }}>{pending.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Old colour */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: pending.oldValue, border: "2px solid #e5e7eb" }} />
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280" }}>{pending.oldValue}</span>
                  </div>
                  <ArrowRight size={18} color="#92400e" />
                  {/* New colour */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: pending.newValue, border: "2px solid #e5e7eb" }} />
                    <span style={{ fontSize: 12, fontFamily: "monospace", color: "#6b7280" }}>{pending.newValue}</span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#92400e", marginTop: 6 }}>
                  This will update the <strong>live shop</strong> immediately for all customers.
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <button
                  onClick={cancelChange}
                  style={{
                    padding: "9px 20px", borderRadius: 8, border: "1.5px solid #d1d5db",
                    background: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", color: "#374151",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={applyChange}
                  style={{
                    padding: "9px 20px", borderRadius: 8, border: "none",
                    background: theme.primary, color: "#fff",
                    fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}
                >
                  Yes, apply to shop
                </button>
              </div>
            </div>
          )}

          {/* Text / branding fields */}
          <Card theme={theme}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 16 }}>
              Branding &amp; Text
            </div>
            {TEXT_FIELDS.map((f) => (
              <div key={f.key} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: theme.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {f.label}
                </label>
                <input
                  value={shopTheme[f.key] as string}
                  onChange={(e) => handleColorChange(f.key, f.label, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            ))}
          </Card>

          {/* Color fields */}
          <Card theme={theme}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 16 }}>
              Colour Palette
            </div>
            {COLOR_FIELDS.map((f) => (
              <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{f.label}</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="color"
                    value={shopTheme[f.key] as string}
                    onChange={(e) => handleColorChange(f.key, f.label, e.target.value)}
                    style={{ width: 40, height: 32, border: "none", borderRadius: 6, cursor: "pointer", padding: 2 }}
                  />
                  <span style={{ fontSize: 12, fontFamily: "monospace", color: theme.textMuted, width: 72 }}>
                    {shopTheme[f.key] as string}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <Btn theme={theme} variant="secondary" onClick={() => setShowResetConfirm(true)}>
                <RotateCcw size={14} /> Reset to Default
              </Btn>
            </div>
          </Card>

          {/* Live preview — reads from shopTheme (store) */}
          <div style={{ gridColumn: "1/-1" }}>
            <Card theme={theme}>
              <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 16 }}>
                Live Shop Preview
              </div>
              <div style={{
                background: shopTheme.primary, borderRadius: shopTheme.radiusCard,
                padding: "16px 20px", color: "#fff",
                display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
              }}>
                {(() => { const PreviewIcon = getLogoIcon(shopTheme.logoIcon); return <PreviewIcon size={28} />; })()}
                <div>
                  <div style={{ fontWeight: 900, fontSize: 18 }}>{shopTheme.shopName}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{shopTheme.shopTagline}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={{ padding: "10px 20px", background: shopTheme.primary, color: "#fff", border: "none", borderRadius: shopTheme.radius, fontWeight: 700, cursor: "pointer" }}>
                  Primary Button
                </button>
                <button style={{ padding: "10px 20px", background: shopTheme.surface, color: shopTheme.text, border: `1.5px solid ${shopTheme.border}`, borderRadius: shopTheme.radius, fontWeight: 700, cursor: "pointer" }}>
                  Secondary
                </button>
                <button style={{ padding: "10px 20px", background: shopTheme.danger, color: "#fff", border: "none", borderRadius: shopTheme.radius, fontWeight: 700, cursor: "pointer" }}>
                  Danger
                </button>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", background: shopTheme.primaryLight, color: shopTheme.primary, borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                  Badge
                </span>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: theme.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={14} /> This preview reflects what customers see in the live shop right now.
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div style={{ maxWidth: 520 }}>
          <Card theme={theme}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 16 }}>
              Alert Preferences
            </div>
            {[
              { label: "New order alerts",     desc: "Notify when a new order is placed"           },
              { label: "Low stock warnings",    desc: "Alert when stock falls below threshold"      },
              { label: "Payment confirmations", desc: "Notify on successful payments"               },
              { label: "Daily sales summary",   desc: "Receive daily sales report at end of day"   },
              { label: "Staff login alerts",    desc: "Alert when a sub-admin logs in"              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontWeight: 600, color: theme.black, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{item.desc}</div>
                </div>
                <div
                  onClick={() => onToast("Notification preference saved.", "success")}
                  style={{ width: 44, height: 24, borderRadius: 12, background: theme.primary, cursor: "pointer", position: "relative" }}
                >
                  <div style={{ position: "absolute", right: 2, top: 2, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* ── RESET CONFIRMATION MODAL ── */}
      {showResetConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20,
        }}>
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32,
            maxWidth: 420, width: "100%", textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: theme.primary }}><Palette size={48} /></div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#111827", marginBottom: 8 }}>
              Reset theme to default?
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
              This will restore all original colours and branding in the <strong>live shop</strong> immediately.
              Your custom colours will be lost.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                Yes, reset to default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}