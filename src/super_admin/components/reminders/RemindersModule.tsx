import React, { useState } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { Reminder, ManagedShop, SystemPackage } from "../../types/index";
import { Card, Btn, Input, SectionHeader, Badge, Modal, Tabs, Checkbox } from "../layout/UI";
import { statusColor, fmtDateTime, genId, daysUntil } from "../../utils/helpers";

interface Props {
  reminders: Reminder[];
  shops: ManagedShop[];
  packages: SystemPackage[];
  adminName: string;
  onSend: (reminder: Reminder) => void;
  addToast: (msg: string, type?: string) => void;
}

const BLANK: Omit<Reminder, "id" | "createdAt" | "createdBy"> = {
  title: "",
  message: "",
  targetType: "all",
  status: "draft",
  recipientCount: 0,
  sentAt: undefined,
  scheduledAt: undefined,
};

const TEMPLATES = [
  { label: "Subscription Expiring", title: "Your Subscription Expires Soon!", message: "Hi {{name}},\n\nYour subscription for {{shop}} expires in {{days}} days. Please renew now to avoid any service interruption.\n\nThank you,\nMyProduct Support Team" },
  { label: "New Feature Announcement", title: "Exciting New Feature Available!", message: "Hi {{name}},\n\nWe have just launched a new feature on MyProduct. Log in to your dashboard to check it out!\n\nBest,\nMyProduct Team" },
  { label: "Welcome New User", title: "Welcome to MyProduct!", message: "Hi {{name}},\n\nWelcome! Your shop {{shop}} is now live. Get started by adding your first products.\n\nHappy selling!" },
  { label: "Overdue Payment", title: "Action Required: Overdue Payment", message: "Hi {{name}},\n\nYour subscription for {{shop}} has expired. Please renew to restore full access.\n\nContact us if you need assistance." },
];

export function RemindersModule({ reminders, shops, packages, adminName, onSend, addToast }: Props) {
  const [tab, setTab] = useState("compose");
  const [form, setForm] = useState({ ...BLANK });
  const [selectedShops, setSelectedShops] = useState<string[]>([]);
  const [preview, setPreview] = useState<Reminder | null>(null);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const resolveRecipients = (): ManagedShop[] => {
    if (form.targetType === "all") return shops;
    if (form.targetType === "expiring") return shops.filter(s => { const d = daysUntil(s.expiresAt); return d >= 0 && d <= (form.expiryDaysThreshold ?? 14); });
    if (form.targetType === "expired") return shops.filter(s => daysUntil(s.expiresAt) < 0);
    if (form.targetType === "package") return shops.filter(s => s.packageId === form.targetPackageId);
    if (form.targetType === "specific") return shops.filter(s => selectedShops.includes(s.id));
    return [];
  };

  const recipients = resolveRecipients();

  const handleSend = () => {
    if (!form.title.trim() || !form.message.trim()) { addToast("Title and message are required.", "error"); return; }
    if (recipients.length === 0) { addToast("No recipients match your target.", "error"); return; }
    setSending(true);
    setTimeout(() => {
      const rem: Reminder = {
        ...form,
        id: genId("rem"),
        status: "sent",
        sentAt: new Date().toISOString(),
        recipientCount: recipients.length,
        createdBy: adminName,
        createdAt: new Date().toISOString(),
        targetShopIds: form.targetType === "specific" ? selectedShops : undefined,
      } as Reminder;
      onSend(rem);
      setSending(false);
      addToast(`✅ Reminder sent to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}.`, "success");
      setForm({ ...BLANK });
      setSelectedShops([]);
      setTab("history");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader title="📣 Reminders & Communications" subtitle="Send targeted messages to users based on subscription status, package, or individual selection." />

      <Tabs
        tabs={[
          { id: "compose", label: "Compose" },
          { id: "history", label: "Sent History", badge: reminders.filter(r => r.status === "sent").length },
        ]}
        active={tab}
        onSelect={setTab}
      />

      {tab === "compose" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
          {/* Left: compose form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message Templates</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TEMPLATES.map(tpl => (
                  <button key={tpl.label} onClick={() => { set("title", tpl.title); set("message", tpl.message); }}
                    style={{ padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${T.border}`, background: T.surface, fontSize: 12, color: T.text, cursor: "pointer", fontFamily: T.fontFamily }}>
                    {tpl.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Compose Message</h4>
              <Input label="Subject / Title *" value={form.title} onChange={v => set("title", v)} placeholder="e.g. Your subscription expires soon!" />
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message Body *</label>
                <textarea value={form.message} onChange={e => set("message", e.target.value)}
                  placeholder="Use {{name}} for owner name, {{shop}} for shop name, {{days}} for days remaining…"
                  rows={7} style={{ width: "100%", padding: "9px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, resize: "vertical", fontFamily: T.fontFamily, boxSizing: "border-box", outline: "none" }} />
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>Variables: <code>{"{{name}}"}</code> · <code>{"{{shop}}"}</code> · <code>{"{{days}}"}</code> · <code>{"{{package}}"}</code></div>
              </div>
            </Card>
          </div>

          {/* Right: targeting + send */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Card>
              <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Target Audience</h4>

              {[
                { value: "all", label: "All Users", desc: `${shops.length} subscribers` },
                { value: "expiring", label: "Expiring Subscriptions", desc: "Users whose sub expires within N days" },
                { value: "expired", label: "Expired Subscriptions", desc: "Users whose sub has lapsed" },
                { value: "package", label: "Specific Package", desc: "Filter by plan type" },
                { value: "specific", label: "Specific Shops", desc: "Hand-pick recipients" },
              ].map(opt => (
                <div key={opt.value} onClick={() => set("targetType", opt.value)} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: T.radius,
                  border: `1.5px solid ${form.targetType === opt.value ? T.primary : T.border}`,
                  background: form.targetType === opt.value ? T.primaryLight : T.surface,
                  cursor: "pointer", marginBottom: 6, transition: "all .15s",
                }}>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${form.targetType === opt.value ? T.primary : T.border}`, background: form.targetType === opt.value ? T.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {form.targetType === opt.value && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: T.textMuted }}>{opt.desc}</div>
                  </div>
                </div>
              ))}

              {/* Expiry threshold */}
              {form.targetType === "expiring" && (
                <div style={{ marginTop: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Days Until Expiry ≤</label>
                  <input type="number" value={(form as any).expiryDaysThreshold ?? 14}
                    onChange={e => set("expiryDaysThreshold" as any, Number(e.target.value))}
                    style={{ marginTop: 5, width: "100%", padding: "7px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, boxSizing: "border-box" }} />
                </div>
              )}

              {/* Package filter */}
              {form.targetType === "package" && (
                <div style={{ marginTop: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Package</label>
                  <select value={(form as any).targetPackageId ?? ""} onChange={e => set("targetPackageId" as any, e.target.value)}
                    style={{ marginTop: 5, width: "100%", padding: "7px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13 }}>
                    <option value="">— Choose package —</option>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              {/* Shop picker */}
              {form.targetType === "specific" && (
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Shops</label>
                  {shops.map(s => (
                    <Checkbox key={s.id} checked={selectedShops.includes(s.id)}
                      onChange={v => setSelectedShops(prev => v ? [...prev, s.id] : prev.filter(id => id !== s.id))}
                      label={`${s.logoEmoji} ${s.name} (${s.ownerName})`} />
                  ))}
                </div>
              )}
            </Card>

            {/* Recipient preview */}
            <Card style={{ background: recipients.length > 0 ? T.successLight : T.bg, border: `1px solid ${recipients.length > 0 ? T.success : T.border}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: recipients.length > 0 ? T.success : T.textMuted, marginBottom: 8 }}>
                {recipients.length > 0 ? `✅ ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""} matched` : "⚠ No recipients matched"}
              </div>
              {recipients.slice(0, 4).map(s => (
                <div key={s.id} style={{ fontSize: 12, color: T.text, marginBottom: 3 }}>{s.logoEmoji} {s.name} · {s.ownerEmail}</div>
              ))}
              {recipients.length > 4 && <div style={{ fontSize: 12, color: T.textMuted }}>+{recipients.length - 4} more…</div>}
            </Card>

            <Btn variant="primary" onClick={handleSend} disabled={sending || recipients.length === 0 || !form.title.trim() || !form.message.trim()} style={{ width: "100%" }}>
              {sending ? "⏳ Sending…" : `📣 Send to ${recipients.length} Recipient${recipients.length !== 1 ? "s" : ""}`}
            </Btn>
          </div>
        </div>
      )}

      {tab === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reminders.length === 0 && (
            <Card style={{ textAlign: "center", padding: "40px 24px", color: T.textMuted }}>No reminders sent yet.</Card>
          )}
          {[...reminders].reverse().map(r => {
            const sc = statusColor(r.status);
            return (
              <Card key={r.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6, lineHeight: 1.5 }}>{r.message.slice(0, 100)}{r.message.length > 100 ? "…" : ""}</div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 12 }}>
                    <Badge label={r.status} bg={sc.bg} color={sc.text} />
                    <span style={{ color: T.textMuted }}>Target: <strong style={{ color: T.text }}>{r.targetType.replace("_", " ")}</strong></span>
                    <span style={{ color: T.textMuted }}>{r.recipientCount} recipients</span>
                    {r.sentAt && <span style={{ color: T.textMuted }}>Sent {fmtDateTime(r.sentAt)}</span>}
                  </div>
                </div>
                <Btn size="sm" variant="ghost" onClick={() => { set("title", r.title); set("message", r.message); set("targetType", r.targetType); setTab("compose"); }}>
                  ↩ Resend
                </Btn>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
