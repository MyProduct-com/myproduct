import React, { useState } from "react";
import { Package, Pencil, Save, Check } from "lucide-react";
import { SA_THEME as T } from "../../data/theme";
import type { SystemPackage, PackageFeature } from "../../types/index";
import { Card, Btn, Input, SectionHeader, Modal, Badge, Toggle, Checkbox } from "../layout/UI";
import { fmt, fmtDate, genId } from "../../utils/helpers";

interface Props {
  packages: SystemPackage[];
  onSave: (pkg: SystemPackage) => void;
  onToggleActive: (id: string) => void;
  addToast: (msg: string, type?: string) => void;
}

const ALL_FEATURES: { id: PackageFeature; label: string; desc: string }[] = [
  { id: "products",      label: "Product Catalogue",  desc: "List and manage products" },
  { id: "orders",        label: "Orders Management",  desc: "Accept and process orders" },
  { id: "pos",           label: "POS Terminal",        desc: "Point-of-sale billing" },
  { id: "inventory",     label: "Inventory Tracking", desc: "Stock management & alerts" },
  { id: "accounting",    label: "Accounting",          desc: "Revenue & expense tracking" },
  { id: "staff",         label: "Staff Accounts",      desc: "Multi-user access" },
  { id: "analytics",     label: "Analytics",           desc: "Performance dashboards" },
  { id: "api_access",    label: "API Access",          desc: "Developer API integration" },
  { id: "custom_domain", label: "Custom Domain",       desc: "Connect your own domain" },
  { id: "marketplace",   label: "Marketplace Listing", desc: "List on shared marketplace" },
];

const BLANK_PKG: SystemPackage = {
  id: "",
  name: "",
  price: 999,
  billingCycle: "monthly",
  shopLimit: 1,
  features: ["products", "orders"],
  featureDetails: { products: 50, orders: 200, pos: false, inventory: false, accounting: false, staff: 1, analytics: false, api_access: false, custom_domain: false, marketplace: false },
  limits: { products: 50, orders: -1, staff: 1, posTerminals: 0 },
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function PackagesModule({ packages, onSave, onToggleActive, addToast }: Props) {
  const [editing, setEditing] = useState<SystemPackage | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => { setEditing({ ...BLANK_PKG, id: genId("pkg") }); setIsNew(true); };
  const openEdit = (pkg: SystemPackage) => { setEditing({ ...pkg }); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name.trim()) { addToast("Package name is required.", "error"); return; }
    onSave({ ...editing, updatedAt: new Date().toISOString() });
    addToast(`Package "${editing.name}" ${isNew ? "created" : "updated"}.`, "success");
    setEditing(null);
  };

  const toggleFeature = (f: PackageFeature) => {
    if (!editing) return;
    const has = editing.features.includes(f);
    setEditing(e => e ? { ...e, features: has ? e.features.filter(x => x !== f) : [...e.features, f] } : e);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        icon={Package}
        title="Packages"
        subtitle="Define subscription plans, set pricing, and control what each package includes."
        actions={<Btn variant="primary" onClick={openNew}>+ Create Package</Btn>}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {packages.map(pkg => (
          <Card key={pkg.id} style={{ position: "relative", opacity: pkg.active ? 1 : .65 }}>
            {pkg.popular && (
              <div style={{ position: "absolute", top: -10, right: 16, background: T.accent, color: "#fff", fontSize: 10, padding: "3px 12px", borderRadius: 999, fontWeight: 700 }}>POPULAR</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: T.text }}>{pkg.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
                  {pkg.billingCycle === "monthly" ? "Monthly" : "Yearly"} · {pkg.shopLimit} shop{pkg.shopLimit > 1 ? "s" : ""}
                </div>
              </div>
              <Badge label={pkg.active ? "active" : "inactive"} bg={pkg.active ? "#dcfce7" : "#f1f5f9"} color={pkg.active ? "#166534" : "#475569"} />
            </div>

            <div style={{ fontSize: 28, fontWeight: 900, color: T.primary, marginBottom: 4 }}>
              KSh {pkg.price.toLocaleString()}
              <span style={{ fontSize: 13, fontWeight: 400, color: T.textMuted }}>/{pkg.billingCycle === "monthly" ? "mo" : "yr"}</span>
            </div>

            <div style={{ margin: "10px 0", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {pkg.features.map(f => (
                <span key={f} style={{ fontSize: 10, background: T.primaryLight, color: T.primary, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>
                  {ALL_FEATURES.find(af => af.id === f)?.label ?? f}
                </span>
              ))}
            </div>

            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, lineHeight: 1.6 }}>
              {pkg.limits.products === -1 ? "Unlimited" : pkg.limits.products} products ·{" "}
              {pkg.limits.orders === -1 ? "Unlimited" : pkg.limits.orders} orders ·{" "}
              {pkg.limits.staff === -1 ? "Unlimited" : pkg.limits.staff} staff
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn size="sm" variant="primary" onClick={() => openEdit(pkg)} style={{ flex: 1 }}><Pencil size={14} /> Edit</Btn>
              <Btn size="sm" variant={pkg.active ? "warning" : "success"} onClick={() => { onToggleActive(pkg.id); addToast(`Package ${pkg.active ? "deactivated" : "activated"}.`, pkg.active ? "warning" : "success"); }}>
                {pkg.active ? "Deactivate" : "Activate"}
              </Btn>
            </div>

            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${T.border}` }}>
              Updated {fmtDate(pkg.updatedAt)}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Edit / Create Modal ── */}
      {editing && (
        <Modal title={isNew ? "Create Package" : `Edit — ${editing.name}`} onClose={() => setEditing(null)} width={640}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Package Name *" value={editing.name} onChange={v => setEditing(e => e ? { ...e, name: v } : e)} placeholder="e.g. Growth" />
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Billing Cycle</label>
              <select value={editing.billingCycle} onChange={ev => setEditing(e => e ? { ...e, billingCycle: ev.target.value as "monthly" | "yearly" } : e)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Price (KSh)</label>
              <input type="number" value={editing.price} onChange={e => setEditing(p => p ? { ...p, price: Number(e.target.value) } : p)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shop Limit</label>
              <input type="number" value={editing.shopLimit} onChange={e => setEditing(p => p ? { ...p, shopLimit: Number(e.target.value) } : p)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Products (-1 = ∞)</label>
              <input type="number" value={editing.limits.products} onChange={e => setEditing(p => p ? { ...p, limits: { ...p.limits, products: Number(e.target.value) } } : p)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Staff (-1 = ∞)</label>
              <input type="number" value={editing.limits.staff} onChange={e => setEditing(p => p ? { ...p, limits: { ...p.limits, staff: Number(e.target.value) } } : p)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Included Features</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {ALL_FEATURES.map(f => (
                <div key={f.id} onClick={() => toggleFeature(f.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                  borderRadius: T.radius, border: `1.5px solid ${editing.features.includes(f.id) ? T.primary : T.border}`,
                  background: editing.features.includes(f.id) ? T.primaryLight : T.surface,
                  cursor: "pointer", transition: "all .15s",
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${editing.features.includes(f.id) ? T.primary : T.border}`, background: editing.features.includes(f.id) ? T.primary : T.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {editing.features.includes(f.id) && <Check size={11} color="#fff" strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{f.label}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Toggle checked={editing.popular ?? false} onChange={v => setEditing(e => e ? { ...e, popular: v } : e)} label="Mark as Popular" />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn variant="primary" onClick={handleSave}><Save size={14} /> {isNew ? "Create Package" : "Save Changes"}</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
