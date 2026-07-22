import React, { useState } from "react";
import {
  Rocket, PartyPopper, ArrowUpRight, ArrowLeft, ArrowRight, Check, X, User, Store,
  Package, ShoppingBag, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { LOGO_ICON_OPTIONS, getLogoIcon } from "@/lib/logoIcons";
import { SA_THEME as T } from "../../data/theme";
import type { SystemPackage, OnboardingForm } from "../../types/index";
import { Card, Btn, Input, Select, SectionHeader, Toggle, Badge } from "../layout/UI";
import { genId } from "../../utils/helpers";

interface Props {
  packages: SystemPackage[];
  addToast: (msg: string, type?: string) => void;
}

const STEPS = ["User Account", "Shop Setup", "Package & Payment", "Products", "Review & Launch"];

const BLANK_FORM: OnboardingForm = {
  ownerName: "", ownerEmail: "", ownerPhone: "", password: "",
  shopName: "", shopTagline: "", shopLogoIcon: "ShoppingCart", shopAddress: "",
  packageId: "", paymentMethod: "mpesa", sendCredentials: true,
};

// Strip characters that can never be valid in a phone number as the user
// types, rather than only flagging it after the fact on submit.
function sanitizePhoneInput(raw: string): string {
  let v = raw.replace(/[^\d+\-()\s]/g, "");
  const leadingPlus = v.startsWith("+") ? "+" : "";
  v = leadingPlus + v.slice(leadingPlus.length).replace(/\+/g, "");
  return v;
}

// Strip whitespace and characters that can never appear in an email address,
// and only allow a single "@".
function sanitizeEmailInput(raw: string): string {
  const v = raw.replace(/\s/g, "").replace(/[^a-zA-Z0-9.@_+-]/g, "");
  const at = v.indexOf("@");
  if (at === -1) return v;
  return v.slice(0, at + 1) + v.slice(at + 1).replace(/@/g, "");
}

const DEMO_PRODUCTS = [
  { name: "Sample Product 1", price: 500, category: "General", stock: 10 },
  { name: "Sample Product 2", price: 1200, category: "General", stock: 5 },
  { name: "Sample Product 3", price: 300, category: "General", stock: 20 },
];

export function OnboardingModule({ packages, addToast }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>(BLANK_FORM);
  const [products, setProducts] = useState(DEMO_PRODUCTS.map(p => ({ ...p, selected: true })));
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string; shopUrl: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof OnboardingForm, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 0) {
      if (!form.ownerName.trim()) e.ownerName = "Name is required";
      if (!form.ownerEmail.includes("@")) e.ownerEmail = "Valid email required";
      if (!form.ownerPhone.trim()) e.ownerPhone = "Phone is required";
      if (!form.password || form.password.length < 6) e.password = "Password must be at least 6 characters";
    }
    if (step === 1) {
      if (!form.shopName.trim()) e.shopName = "Shop name is required";
    }
    if (step === 2) {
      if (!form.packageId) e.packageId = "Select a package";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleLaunch = () => {
    setLaunching(true);
    const creds = {
      email: form.ownerEmail,
      password: form.password,
      shopUrl: `https://${form.shopName.toLowerCase().replace(/\s+/g, "-")}.myproduct.co.ke`,
    };
    setTimeout(() => {
      setLaunching(false);
      setLaunched(true);
      setCredentials(creds);
      addToast(`${form.shopName} onboarded successfully!`, "success");
    }, 2000);
  };

  const handleReset = () => {
    setForm(BLANK_FORM);
    setStep(0);
    setLaunched(false);
    setCredentials(null);
    setErrors({});
  };

  const selectedPkg = packages.find(p => p.id === form.packageId);

  if (launched && credentials) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <SectionHeader icon={Rocket} title="Onboard New User" subtitle="Step-by-step guided shop setup" />
        <Card style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}><PartyPopper size={52} color={T.success} /></div>
          <h2 style={{ color: T.success, margin: "0 0 8px" }}>{form.shopName} is Live!</h2>
          <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 24 }}>
            The shop has been fully onboarded and {form.sendCredentials ? "credentials have been sent to the owner." : "is ready to hand over."}
          </p>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusCard, padding: "18px 24px", display: "inline-block", textAlign: "left", minWidth: 300, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Shop Admin Credentials</div>
            <CredRow label="Email" value={credentials.email} />
            <CredRow label="Password" value={credentials.password} />
            <CredRow label="Shop URL" value={credentials.shopUrl} />
            <CredRow label="Package" value={selectedPkg?.name ?? form.packageId} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn variant="primary" onClick={() => window.open(credentials.shopUrl, "_blank")}><ArrowUpRight size={14} /> Visit Shop</Btn>
            <Btn variant="ghost" onClick={handleReset}>+ Onboard Another User</Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader icon={Rocket} title="Onboard New User" subtitle="Register a user, configure their shop, and get them live end-to-end" />

      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", border: `2px solid ${i <= step ? T.primary : T.border}`,
                background: i < step ? T.primary : i === step ? T.primaryLight : T.surface,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: i < step ? "#fff" : i === step ? T.primary : T.textMuted,
              }}>{i < step ? <Check size={14} strokeWidth={3} /> : i + 1}</div>
              <div style={{ fontSize: 10, color: i === step ? T.primary : T.textMuted, fontWeight: i === step ? 700 : 400, textAlign: "center", maxWidth: 70 }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && <div style={{ height: 2, flex: 2, background: i < step ? T.primary : T.border, marginBottom: 18 }} />}
          </React.Fragment>
        ))}
      </div>

      <Card>
        {/* ── Step 0: User Account ── */}
        {step === 0 && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: T.text }}>User Account Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <Input label="Full Name *" value={form.ownerName} onChange={v => set("ownerName", v)} placeholder="e.g. James Kamau" />
                {errors.ownerName && <ErrMsg msg={errors.ownerName} />}
              </div>
              <div>
                <Input
                  label="Email Address *"
                  value={form.ownerEmail}
                  onChange={v => set("ownerEmail", sanitizeEmailInput(v))}
                  placeholder="james@example.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                />
                {errors.ownerEmail && <ErrMsg msg={errors.ownerEmail} />}
              </div>
              <div>
                <Input
                  label="Phone Number *"
                  value={form.ownerPhone}
                  onChange={v => set("ownerPhone", sanitizePhoneInput(v))}
                  placeholder="0712 345 678"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                />
                {errors.ownerPhone && <ErrMsg msg={errors.ownerPhone} />}
              </div>
              <div>
                <Input label="Temporary Password *" value={form.password} onChange={v => set("password", v)} placeholder="Min. 6 characters" type="password" />
                {errors.password && <ErrMsg msg={errors.password} />}
              </div>
            </div>
            <Toggle checked={form.sendCredentials} onChange={v => set("sendCredentials", v)} label="Send login credentials to owner via email after launch" />
          </div>
        )}

        {/* ── Step 1: Shop Setup ── */}
        {step === 1 && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: T.text }}>Shop Configuration</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <Input label="Shop Name *" value={form.shopName} onChange={v => set("shopName", v)} placeholder="e.g. FreshMart" />
                {errors.shopName && <ErrMsg msg={errors.shopName} />}
              </div>
              <Input label="Tagline" value={form.shopTagline} onChange={v => set("shopTagline", v)} placeholder="e.g. Farm to doorstep, every day." />
              <Input label="Business Address" value={form.shopAddress} onChange={v => set("shopAddress", v)} placeholder="e.g. Westlands, Nairobi" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Shop Logo Icon</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LOGO_ICON_OPTIONS.map(({ name, icon: OptIcon }) => (
                  <button key={name} onClick={() => set("shopLogoIcon", name)} style={{
                    width: 42, height: 42, borderRadius: 8, border: `2px solid ${form.shopLogoIcon === name ? T.primary : T.border}`,
                    background: form.shopLogoIcon === name ? T.primaryLight : T.surface,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    color: form.shopLogoIcon === name ? T.primary : T.text,
                  }}><OptIcon size={20} /></button>
                ))}
              </div>
            </div>
            {form.shopName && (
              <div style={{ marginTop: 16, background: T.bg, borderRadius: T.radiusCard, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(() => { const LogoIcon = getLogoIcon(form.shopLogoIcon); return <LogoIcon size={24} color={T.primary} />; })()}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: T.text }}>{form.shopName}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{form.shopTagline}</div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>myproduct.co.ke/{form.shopName.toLowerCase().replace(/\s+/g, "-")}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Package & Payment ── */}
        {step === 2 && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: T.text }}>Select Package</h3>
            {errors.packageId && <ErrMsg msg={errors.packageId} />}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 20 }}>
              {packages.filter(p => p.active).map(pkg => (
                <div key={pkg.id} onClick={() => set("packageId", pkg.id)} style={{
                  border: `2px solid ${form.packageId === pkg.id ? T.primary : T.border}`,
                  background: form.packageId === pkg.id ? T.primaryLight : T.surface,
                  borderRadius: T.radiusCard, padding: "14px 16px", cursor: "pointer", position: "relative",
                }}>
                  {pkg.popular && <span style={{ position: "absolute", top: -10, right: 14, background: T.accent, color: "#fff", fontSize: 10, padding: "2px 10px", borderRadius: 999, fontWeight: 700 }}>POPULAR</span>}
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.text }}>{pkg.name}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: T.primary, margin: "6px 0" }}>KSh {pkg.price.toLocaleString()}<span style={{ fontSize: 12, fontWeight: 400, color: T.textMuted }}>/{pkg.billingCycle === "monthly" ? "mo" : "yr"}</span></div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>Up to {pkg.shopLimit} shop{pkg.shopLimit > 1 ? "s" : ""} · {pkg.limits.products === -1 ? "Unlimited" : pkg.limits.products} products</div>
                  <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {pkg.features.slice(0, 4).map(f => <span key={f} style={{ fontSize: 10, background: T.bg, color: T.textMuted, padding: "2px 8px", borderRadius: 999 }}>{f}</span>)}
                    {pkg.features.length > 4 && <span style={{ fontSize: 10, color: T.textMuted }}>+{pkg.features.length - 4} more</span>}
                  </div>
                </div>
              ))}
            </div>
            <Select label="Payment Method" value={form.paymentMethod} onChange={v => set("paymentMethod", v)}
              options={[{ value: "mpesa", label: "M-Pesa" }, { value: "card", label: "Card" }, { value: "bank", label: "Bank Transfer" }, { value: "cod", label: "Cash (Admin Override)" }]} />
          </div>
        )}

        {/* ── Step 3: Add Products ── */}
        {step === 3 && (
          <div>
            <h3 style={{ margin: "0 0 6px", color: T.text }}>Add Starter Products</h3>
            <p style={{ color: T.textMuted, fontSize: 13, margin: "0 0 16px" }}>Optionally pre-populate the shop with demo products to help the user get started quickly.</p>
            {products.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: T.bg, borderRadius: T.radius, marginBottom: 8 }}>
                <input type="checkbox" checked={p.selected} onChange={e => setProducts(prev => prev.map((pp, ii) => ii === i ? { ...pp, selected: e.target.checked } : pp))} style={{ width: 16, height: 16, cursor: "pointer" }} />
                <div style={{ flex: 1 }}>
                  <input value={p.name} onChange={e => setProducts(prev => prev.map((pp, ii) => ii === i ? { ...pp, name: e.target.value } : pp))}
                    style={{ background: "none", border: "none", fontSize: 13, fontWeight: 600, color: T.text, width: "100%", outline: "none" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>KSh</span>
                  <input type="number" value={p.price} onChange={e => setProducts(prev => prev.map((pp, ii) => ii === i ? { ...pp, price: Number(e.target.value) } : pp))}
                    style={{ width: 80, padding: "4px 8px", borderRadius: T.radius, border: `1px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface }} />
                </div>
                <button onClick={() => setProducts(prev => prev.filter((_, ii) => ii !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: T.danger, display: "flex" }}><X size={16} /></button>
              </div>
            ))}
            <Btn size="sm" variant="ghost" onClick={() => setProducts(prev => [...prev, { name: "New Product", price: 0, category: "General", stock: 0, selected: true }])}>+ Add Product</Btn>
          </div>
        )}

        {/* ── Step 4: Review & Launch ── */}
        {step === 4 && (
          <div>
            <h3 style={{ margin: "0 0 16px", color: T.text }}>Review & Launch</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <ReviewSection icon={User} title="Owner">
                <ReviewRow label="Name" value={form.ownerName} />
                <ReviewRow label="Email" value={form.ownerEmail} />
                <ReviewRow label="Phone" value={form.ownerPhone} />
              </ReviewSection>
              <ReviewSection icon={Store} title="Shop">
                <ReviewRow label="Name" value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {(() => { const LogoIcon = getLogoIcon(form.shopLogoIcon); return <LogoIcon size={13} />; })()} {form.shopName}
                  </span>
                } />
                <ReviewRow label="Tagline" value={form.shopTagline || "—"} />
                <ReviewRow label="Address" value={form.shopAddress || "—"} />
              </ReviewSection>
              <ReviewSection icon={Package} title="Package">
                <ReviewRow label="Plan" value={selectedPkg?.name ?? "—"} />
                <ReviewRow label="Price" value={selectedPkg ? `KSh ${selectedPkg.price.toLocaleString()}/${selectedPkg.billingCycle === "monthly" ? "mo" : "yr"}` : "—"} />
                <ReviewRow label="Payment" value={form.paymentMethod} />
              </ReviewSection>
              <ReviewSection icon={ShoppingBag} title="Products">
                <ReviewRow label="Count" value={`${products.filter(p => p.selected).length} products selected`} />
                <ReviewRow label="Credentials" value={form.sendCredentials ? "Email after launch" : "Manual handover"} />
              </ReviewSection>
            </div>
            <div style={{ background: T.successLight, border: `1px solid ${T.success}`, borderRadius: T.radiusCard, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} /> Everything looks good! Clicking "Launch Shop" will create the user account, configure the shop, apply the package, and go live.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
          <Btn variant="ghost" onClick={prev} disabled={step === 0}><ArrowLeft size={14} /> Back</Btn>
          {step < STEPS.length - 1
            ? <Btn variant="primary" onClick={next}>Next <ArrowRight size={14} /></Btn>
            : <Btn variant="success" onClick={handleLaunch} disabled={launching}>{launching ? "Launching…" : <><Rocket size={14} /> Launch Shop</>}</Btn>
          }
        </div>
      </Card>
    </div>
  );
}

function ErrMsg({ msg }: { msg: string }) {
  return <div style={{ fontSize: 11, color: T.danger, marginTop: -10, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {msg}</div>;
}
function ReviewSection({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number }>; children: React.ReactNode }) {
  return (
    <div style={{ background: T.bg, borderRadius: T.radiusCard, padding: "12px 16px" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={13} />} {title}
      </div>
      {children}
    </div>
  );
}
function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
      <span style={{ color: T.textMuted }}>{label}</span>
      <span style={{ color: T.text, fontWeight: 600 }}>{value}</span>
    </div>
  );
}
function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
      <span style={{ color: T.textMuted }}>{label}</span>
      <span style={{ color: T.text, fontWeight: 600, fontFamily: label === "Password" ? "monospace" : undefined }}>{value}</span>
    </div>
  );
}
