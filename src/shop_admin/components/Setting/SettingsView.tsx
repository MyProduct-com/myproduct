"use client";

import { useState } from "react";
import { Store, Palette, Bell, AlertTriangle, ArrowRight, RotateCcw, CheckCircle2 } from "lucide-react";
import type { Shop } from "../../types/index";
import { useThemeStore } from "@/store/themeStore";
import type { ShopTheme } from "@/store/themeStore";
import { LOGO_ICON_OPTIONS, getLogoIcon } from "@/lib/logoIcons";

interface SettingsViewProps {
  shop: Shop;
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

const inputCls = "w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary";
const labelCls = "block text-org-xs font-org-medium text-org-text-secondary mb-1.5";

export default function SettingsView({ shop, onShop, onToast }: SettingsViewProps) {
  const { theme: shopTheme, updateTheme, resetTheme } = useThemeStore();

  const [activeTab, setActiveTab]       = useState<"shop" | "theme" | "notifications">("shop");
  const [shopForm, setShopForm]         = useState<Shop>({ ...shop });
  const [pending, setPending]           = useState<PendingChange | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const setShopField = (k: keyof Shop) => (v: string) =>
    setShopForm((f) => ({ ...f, [k]: v }));

  const saveShop = () => {
    onShop(shopForm);
    updateTheme("shopName",    shopForm.name);
    updateTheme("shopTagline", shopForm.tagline);
    updateTheme("logoIcon",    shopForm.logoIcon);
    onToast("Shop settings saved and reflected in storefront.", "success");
  };

  const handleColorChange = (key: keyof ShopTheme, label: string, newValue: string) => {
    setPending({ key, label, oldValue: shopTheme[key] as string, newValue });
  };

  const applyChange = () => {
    if (!pending) return;
    updateTheme(pending.key, pending.newValue);
    onToast(`${pending.label} updated in live shop`, "success");
    setPending(null);
  };

  const cancelChange = () => setPending(null);

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
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Settings</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">Manage your shop info, storefront appearance, and notifications.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-org-border overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`shrink-0 px-4 py-2.5 -mb-px flex items-center gap-1.5 text-org-sm font-org-semibold border-b-2 transition-colors ${
              activeTab === t.id ? "text-org-primary border-org-primary" : "text-org-text-secondary border-transparent"
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── SHOP INFO ── */}
      {activeTab === "shop" && (
        <div className="max-w-2xl space-y-4">
          <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
            <p className="font-org-bold text-org-md text-org-text-primary mb-4">Shop Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Shop Name</label>
                <input value={shopForm.name} onChange={(e) => setShopField("name")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tagline</label>
                <input value={shopForm.tagline} onChange={(e) => setShopField("tagline")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input value={shopForm.phone} onChange={(e) => setShopField("phone")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={shopForm.email} onChange={(e) => setShopField("email")(e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                <input value={shopForm.address} onChange={(e) => setShopField("address")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Currency</label>
                <input value={shopForm.currency} onChange={(e) => setShopField("currency")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Timezone</label>
                <input value={shopForm.timezone} onChange={(e) => setShopField("timezone")(e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* Logo icon picker */}
            <div className="mt-4">
              <label className={labelCls}>Logo Icon</label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-42 overflow-y-auto p-2.5 border border-org-border rounded-org-sm bg-org-bg">
                {LOGO_ICON_OPTIONS.map((opt) => {
                  const selected = shopForm.logoIcon === opt.name;
                  return (
                    <button
                      key={opt.name}
                      type="button"
                      title={opt.name}
                      onClick={() => setShopField("logoIcon")(opt.name)}
                      className={`w-11 h-11 flex items-center justify-center rounded-org-sm border-2 transition-colors ${
                        selected ? "border-org-primary bg-org-primary-light text-org-primary" : "border-org-border bg-org-surface text-org-text-secondary"
                      }`}
                    >
                      <opt.icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <button onClick={saveShop} className="mt-4 px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Save Shop Info</button>
          </div>

          <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
            <p className="font-org-bold text-org-md text-org-text-primary mb-3">Danger Zone</p>
            <div className="flex items-center justify-between gap-3 py-3.5 border-b border-org-border">
              <div>
                <p className="font-org-medium text-org-text-primary">Clear All Orders</p>
                <p className="text-org-xs text-org-text-secondary">Permanently remove all order history.</p>
              </div>
              <button onClick={() => onToast("Export data first before clearing orders.", "error")} className="shrink-0 px-3 py-1.5 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-xs font-org-semibold transition-colors">Clear Orders</button>
            </div>
            <div className="flex items-center justify-between gap-3 py-3.5">
              <div>
                <p className="font-org-medium text-org-text-primary">Reset Theme to Default</p>
                <p className="text-org-xs text-org-text-secondary">Restore original colours in the live shop.</p>
              </div>
              <button onClick={() => setShowResetConfirm(true)} className="shrink-0 px-3 py-1.5 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-xs font-org-semibold transition-colors">Reset Theme</button>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME EDITOR ── */}
      {activeTab === "theme" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Pending confirmation banner */}
          {pending && (
            <div className="lg:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-org-warning/10 border-2 border-org-warning/30 rounded-org-card px-5 py-4">
              <div className="flex-1">
                <p className="font-org-bold text-org-sm text-org-warning mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle size={16} /> Confirm colour change — <span className="font-org-normal">{pending.label}</span>
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg border-2 border-org-border" style={{ background: pending.oldValue }} />
                    <span className="text-org-xs font-mono text-org-text-muted">{pending.oldValue}</span>
                  </div>
                  <ArrowRight size={18} className="text-org-warning" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg border-2 border-org-border" style={{ background: pending.newValue }} />
                    <span className="text-org-xs font-mono text-org-text-muted">{pending.newValue}</span>
                  </div>
                </div>
                <p className="text-org-xs text-org-warning mt-1.5">This will update the <strong>live shop</strong> immediately for all customers.</p>
              </div>
              <div className="flex gap-2.5 shrink-0">
                <button onClick={cancelChange} className="px-4 py-2 rounded-org-sm border border-org-border bg-org-surface text-org-sm font-org-medium text-org-text-secondary">Cancel</button>
                <button onClick={applyChange} className="px-4 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold">Yes, apply to shop</button>
              </div>
            </div>
          )}

          {/* Text / branding fields */}
          <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
            <p className="font-org-bold text-org-md text-org-text-primary mb-4">Branding &amp; Text</p>
            {TEXT_FIELDS.map((f) => (
              <div key={f.key} className="mb-3">
                <label className={labelCls}>{f.label}</label>
                <input
                  value={shopTheme[f.key] as string}
                  onChange={(e) => handleColorChange(f.key, f.label, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>

          {/* Color fields */}
          <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
            <p className="font-org-bold text-org-md text-org-text-primary mb-4">Colour Palette</p>
            {COLOR_FIELDS.map((f) => (
              <div key={f.key} className="flex items-center justify-between mb-3">
                <label className="text-org-sm font-org-medium text-org-text-primary">{f.label}</label>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={shopTheme[f.key] as string}
                    onChange={(e) => handleColorChange(f.key, f.label, e.target.value)}
                    className="w-10 h-8 border-none rounded-lg cursor-pointer p-0.5"
                  />
                  <span className="text-org-xs font-mono text-org-text-muted w-18">{shopTheme[f.key] as string}</span>
                </div>
              </div>
            ))}
            <button onClick={() => setShowResetConfirm(true)} className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">
              <RotateCcw size={14} /> Reset to Default
            </button>
          </div>

          {/* Live preview */}
          <div className="lg:col-span-2 bg-org-surface rounded-org-card shadow-org-card p-4">
            <p className="font-org-bold text-org-md text-org-text-primary mb-4">Live Shop Preview</p>
            <div className="flex items-center gap-3 mb-3 px-5 py-4 text-white" style={{ background: shopTheme.primary, borderRadius: shopTheme.radiusCard }}>
              {(() => { const PreviewIcon = getLogoIcon(shopTheme.logoIcon); return <PreviewIcon size={28} />; })()}
              <div>
                <p className="font-org-bold text-org-md">{shopTheme.shopName}</p>
                <p className="text-org-xs opacity-80">{shopTheme.shopTagline}</p>
              </div>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <button className="px-5 py-2.5 text-white font-org-bold" style={{ background: shopTheme.primary, borderRadius: shopTheme.radius }}>Primary Button</button>
              <button className="px-5 py-2.5 font-org-bold" style={{ background: shopTheme.surface, color: shopTheme.text, border: `1.5px solid ${shopTheme.border}`, borderRadius: shopTheme.radius }}>Secondary</button>
              <button className="px-5 py-2.5 text-white font-org-bold" style={{ background: shopTheme.danger, borderRadius: shopTheme.radius }}>Danger</button>
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-org-pill text-org-xs font-org-bold" style={{ background: shopTheme.primaryLight, color: shopTheme.primary }}>Badge</span>
            </div>
            <p className="mt-3 text-org-xs text-org-text-secondary flex items-center gap-1.5">
              <CheckCircle2 size={14} /> This preview reflects what customers see in the live shop right now.
            </p>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div className="max-w-xl bg-org-surface rounded-org-card shadow-org-card p-4">
          <p className="font-org-bold text-org-md text-org-text-primary mb-4">Alert Preferences</p>
          {[
            { label: "New order alerts",     desc: "Notify when a new order is placed"           },
            { label: "Low stock warnings",    desc: "Alert when stock falls below threshold"      },
            { label: "Payment confirmations", desc: "Notify on successful payments"               },
            { label: "Daily sales summary",   desc: "Receive daily sales report at end of day"   },
            { label: "Staff login alerts",    desc: "Alert when a sub-admin logs in"              },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between gap-3 py-3.5 border-b border-org-border last:border-0">
              <div>
                <p className="font-org-medium text-org-sm text-org-text-primary">{item.label}</p>
                <p className="text-org-xs text-org-text-secondary">{item.desc}</p>
              </div>
              <button
                onClick={() => onToast("Notification preference saved.", "success")}
                className="w-11 h-6 rounded-full bg-org-primary relative shrink-0"
              >
                <span className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── RESET CONFIRMATION MODAL ── */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/50" onClick={() => setShowResetConfirm(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg max-w-md w-full text-center p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-3 text-org-primary"><Palette size={44} /></div>
            <p className="font-org-bold text-org-md text-org-text-primary mb-2">Reset theme to default?</p>
            <p className="text-org-sm text-org-text-secondary mb-6 leading-relaxed">
              This will restore all original colours and branding in the <strong>live shop</strong> immediately.
              Your custom colours will be lost.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setShowResetConfirm(false)} className="px-5 py-2.5 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={confirmReset} className="px-5 py-2.5 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-sm font-org-semibold transition-colors">Yes, reset to default</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
