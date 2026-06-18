import { useState } from "react";
import type { Theme, Shop } from "../../types/index";
import { SectionHeader, Btn, Input, Card } from "../layout/UI";

interface SettingsViewProps {
  theme: Theme;
  shop: Shop;
  onTheme: (key: keyof Theme, val: string) => void;
  onThemeReset: () => void;
  onShop: (shop: Shop) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const COLOR_FIELDS: { key: keyof Theme; label: string }[] = [
  { key:"primary",      label:"Primary Color" },
  { key:"primaryDark",  label:"Primary Dark" },
  { key:"primaryLight", label:"Primary Light" },
  { key:"accent",       label:"Accent Color" },
  { key:"bg",           label:"Background" },
  { key:"surface",      label:"Surface" },
  { key:"border",       label:"Border" },
  { key:"text",         label:"Text" },
  { key:"textMuted",    label:"Muted Text" },
  { key:"danger",       label:"Danger / Red" },
];

const TEXT_FIELDS: { key: keyof Theme; label: string; placeholder: string }[] = [
  { key:"shopName",    label:"Shop Name",     placeholder:"FreshMart" },
  { key:"shopTagline", label:"Tagline",       placeholder:"Farm to doorstep, every day." },
  { key:"logoEmoji",   label:"Logo Emoji",    placeholder:"🛒" },
  { key:"radius",      label:"Border Radius", placeholder:"8px" },
  { key:"radiusCard",  label:"Card Radius",   placeholder:"12px" },
];

export default function SettingsView({ theme, shop, onTheme, onThemeReset, onShop, onToast }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"shop"|"theme"|"notifications">("shop");
  const [shopForm, setShopForm] = useState<Shop>({ ...shop });

  const setShopField = (k: keyof Shop) => (v: string) => setShopForm(f => ({ ...f, [k]: v }));

  const saveShop = () => {
    onShop(shopForm);
    onToast("Shop settings saved.", "success");
  };

  const tabs = [
    { id:"shop",          label:"Shop Info",         icon:"🏪" },
    { id:"theme",         label:"Storefront Theme",  icon:"🎨" },
    { id:"notifications", label:"Notifications",     icon:"🔔" },
  ] as const;

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Manage your shop, storefront appearance, and system preferences." theme={theme} />

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, borderBottom:`2px solid ${theme.border}`, marginBottom:24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:"10px 20px", background:"none", border:"none", fontWeight:700, fontSize:14, cursor:"pointer",
            color: activeTab===t.id ? theme.primary : theme.textMuted,
            borderBottom: activeTab===t.id ? `2.5px solid ${theme.primary}` : "2px solid transparent",
            marginBottom:-2, display:"flex", alignItems:"center", gap:6,
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── SHOP INFO ── */}
      {activeTab === "shop" && (
        <div style={{ maxWidth: 640 }}>
          <Card theme={theme} style={{ marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:16 }}>Shop Details</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={{ gridColumn:"1/-1" }}>
                <Input label="Shop Name" value={shopForm.name} onChange={setShopField("name")} theme={theme} />
              </div>
              <Input label="Tagline" value={shopForm.tagline} onChange={setShopField("tagline")} theme={theme} />
              <Input label="Logo Emoji" value={shopForm.logoEmoji} onChange={setShopField("logoEmoji")} theme={theme} />
              <Input label="Phone" value={shopForm.phone} onChange={setShopField("phone")} theme={theme} />
              <Input label="Email" value={shopForm.email} onChange={setShopField("email")} type="email" theme={theme} />
              <div style={{ gridColumn:"1/-1" }}>
                <Input label="Address" value={shopForm.address} onChange={setShopField("address")} theme={theme} />
              </div>
              <Input label="Currency" value={shopForm.currency} onChange={setShopField("currency")} theme={theme} />
              <Input label="Timezone" value={shopForm.timezone} onChange={setShopField("timezone")} theme={theme} />
            </div>
            <div style={{ marginTop:16 }}>
              <Btn theme={theme} onClick={saveShop}>Save Shop Info</Btn>
            </div>
          </Card>

          <Card theme={theme}>
            <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:12 }}>Danger Zone</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${theme.border}` }}>
              <div>
                <div style={{ fontWeight:600, color:theme.black }}>Clear All Orders</div>
                <div style={{ fontSize:12, color:theme.textMuted }}>Permanently remove all order history.</div>
              </div>
              <Btn theme={theme} variant="danger" small onClick={() => onToast("This action is irreversible. Please export data first.", "error")}>Clear Orders</Btn>
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0" }}>
              <div>
                <div style={{ fontWeight:600, color:theme.black }}>Reset to Defaults</div>
                <div style={{ fontSize:12, color:theme.textMuted }}>Reset all theme and shop settings.</div>
              </div>
              <Btn theme={theme} variant="danger" small onClick={onThemeReset}>Reset</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* ── THEME EDITOR ── */}
      {activeTab === "theme" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
          {/* Text / name fields */}
          <Card theme={theme}>
            <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:16 }}>Branding & Text</div>
            {TEXT_FIELDS.map(f => (
              <div key={f.key} style={{ marginBottom:12 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:600, color:theme.textMuted, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                  {f.label}
                </label>
                <input
                  value={theme[f.key] as string}
                  onChange={e => onTheme(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width:"100%", padding:"8px 12px", borderRadius:theme.radius, border:`1.5px solid ${theme.border}`, fontSize:13, boxSizing:"border-box" }}
                />
              </div>
            ))}
          </Card>

          {/* Color fields */}
          <Card theme={theme}>
            <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:16 }}>Color Palette</div>
            {COLOR_FIELDS.map(f => (
              <div key={f.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
                <label style={{ fontSize:13, fontWeight:600, color:theme.text }}>{f.label}</label>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <input
                    type="color"
                    value={theme[f.key] as string}
                    onChange={e => onTheme(f.key, e.target.value)}
                    style={{ width:40, height:32, border:"none", borderRadius:6, cursor:"pointer", padding:2 }}
                  />
                  <span style={{ fontSize:12, fontFamily:"monospace", color:theme.textMuted, width:72 }}>{theme[f.key] as string}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop:8 }}>
              <Btn theme={theme} variant="secondary" onClick={onThemeReset}>↺ Reset to Default</Btn>
            </div>
          </Card>

          {/* Live preview */}
          <div style={{ gridColumn:"1/-1" }}>
            <Card theme={theme}>
              <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:16 }}>Live Preview</div>
              <div style={{
                background: theme.primary, borderRadius:theme.radiusCard,
                padding:"16px 20px", color:"#fff", display:"flex", alignItems:"center", gap:12, marginBottom:12,
              }}>
                <span style={{ fontSize:28 }}>{theme.logoEmoji}</span>
                <div>
                  <div style={{ fontWeight:900, fontSize:18 }}>{theme.shopName}</div>
                  <div style={{ fontSize:12, opacity:0.8 }}>{theme.shopTagline}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button style={{ padding:"10px 20px", background:theme.primary, color:"#fff", border:"none", borderRadius:theme.radius, fontWeight:700, cursor:"pointer" }}>Primary Button</button>
                <button style={{ padding:"10px 20px", background:theme.surface, color:theme.text, border:`1.5px solid ${theme.border}`, borderRadius:theme.radius, fontWeight:700, cursor:"pointer" }}>Secondary</button>
                <button style={{ padding:"10px 20px", background:theme.danger, color:"#fff", border:"none", borderRadius:theme.radius, fontWeight:700, cursor:"pointer" }}>Danger</button>
                <span style={{ display:"inline-flex", alignItems:"center", padding:"6px 14px", background:theme.primaryLight, color:theme.primary, borderRadius:20, fontSize:12, fontWeight:700 }}>Badge</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── NOTIFICATIONS ── */}
      {activeTab === "notifications" && (
        <div style={{ maxWidth:520 }}>
          <Card theme={theme}>
            <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:16 }}>Alert Preferences</div>
            {[
              { label:"New order alerts",      desc:"Notify when a new order is placed" },
              { label:"Low stock warnings",     desc:"Alert when stock falls below threshold" },
              { label:"Payment confirmations",  desc:"Notify on successful payments" },
              { label:"Daily sales summary",    desc:"Receive daily sales report at end of day" },
              { label:"Staff login alerts",     desc:"Alert when a sub-admin logs in" },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${theme.border}` }}>
                <div>
                  <div style={{ fontWeight:600, color:theme.black, fontSize:14 }}>{item.label}</div>
                  <div style={{ fontSize:12, color:theme.textMuted }}>{item.desc}</div>
                </div>
                <div
                  onClick={() => onToast("Notification preferences saved.", "success")}
                  style={{
                    width:44, height:24, borderRadius:12, background:theme.primary,
                    cursor:"pointer", position:"relative",
                  }}
                >
                  <div style={{
                    position:"absolute", right:2, top:2, width:20, height:20,
                    borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
                  }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
