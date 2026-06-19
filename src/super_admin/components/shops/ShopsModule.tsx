import React, { useState } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { ManagedShop, PaymentConfig } from "../../types/index";
import {
  Table, Badge, Btn, Card, Input, Modal, Select,
  SearchBar, SectionHeader, ConfirmDialog, Tabs,
} from "../layout/UI";
import { fmt, fmtDate, timeAgo, statusColor, daysUntil } from "../../utils/helpers";

interface Props {
  shops: ManagedShop[];
  onUpdateShop: (id: string, updates: Partial<ManagedShop>) => void;
  onNavigateIsolation: (shop: ManagedShop) => void;
  onNavigateOnboarding: () => void;
  addToast: (msg: string, type?: string) => void;
}

export function ShopsModule({ shops, onUpdateShop, onNavigateIsolation, onNavigateOnboarding, addToast }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPkg, setFilterPkg] = useState("all");
  const [selectedShop, setSelectedShop] = useState<ManagedShop | null>(null);
  const [shopTab, setShopTab] = useState("overview");
  const [confirmAction, setConfirmAction] = useState<{ type: string; shop: ManagedShop } | null>(null);
  const [pulldownNotice, setPulldownNotice] = useState("");
  const [paymentForm, setPaymentForm] = useState<PaymentConfig>({});

  const filtered = shops.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    const matchPkg = filterPkg === "all" || s.packageId === filterPkg;
    return matchSearch && matchStatus && matchPkg;
  });

  const pkgOptions = [
    { value: "all", label: "All Packages" },
    ...Array.from(new Set(shops.map(s => s.packageId))).map(id => ({
      value: id, label: shops.find(s => s.packageId === id)?.packageName ?? id,
    })),
  ];

  const handleAction = (type: string, shop: ManagedShop) => {
    if (type === "pulldown") {
      setPulldownNotice(`Dear ${shop.ownerName}, your shop "${shop.name}" has been temporarily suspended due to a policy review. Please contact support to discuss reinstatement.`);
    }
    if (type === "payment") {
      setPaymentForm(shop.paymentDetails ?? {});
    }
    setConfirmAction({ type, shop });
  };

  const executeAction = () => {
    if (!confirmAction) return;
    const { type, shop } = confirmAction;
    if (type === "suspend") {
      onUpdateShop(shop.id, { status: "suspended" });
      addToast(`${shop.name} suspended.`, "warning");
    } else if (type === "activate") {
      onUpdateShop(shop.id, { status: "active" });
      addToast(`${shop.name} reactivated.`, "success");
    } else if (type === "pulldown") {
      onUpdateShop(shop.id, { status: "pulled_down" });
      addToast(`${shop.name} pulled down. Notice sent.`, "warning");
    } else if (type === "payment") {
      onUpdateShop(shop.id, { paymentDetails: paymentForm });
      if (selectedShop?.id === shop.id) setSelectedShop({ ...shop, paymentDetails: paymentForm });
      addToast(`Payment details updated for ${shop.name}.`, "success");
    }
    setConfirmAction(null);
  };

  const columns = [
    {
      key: "shop", header: "Shop", width: "220px",
      render: (s: ManagedShop) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: T.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.logoEmoji}</div>
          <div>
            <div style={{ fontWeight: 700, color: T.text, fontSize: 13 }}>{s.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{s.ownerName}</div>
          </div>
        </div>
      ),
    },
    { key: "status", header: "Status", width: "110px", render: (s: ManagedShop) => { const c = statusColor(s.status); return <Badge label={s.status} bg={c.bg} color={c.text} />; } },
    { key: "package", header: "Package", render: (s: ManagedShop) => <span style={{ fontSize: 12, color: T.text }}>{s.packageName} <span style={{ color: T.textMuted }}>({s.shopsCreated}/{s.packageShopLimit})</span></span> },
    { key: "revenue", header: "Revenue", render: (s: ManagedShop) => <span style={{ fontWeight: 700, color: T.success, fontSize: 13 }}>{fmt(s.totalRevenue)}</span> },
    { key: "expires", header: "Expires", render: (s: ManagedShop) => { const d = daysUntil(s.expiresAt); return <span style={{ color: d <= 7 ? T.danger : d <= 14 ? T.warning : T.textMuted, fontSize: 12, fontWeight: d <= 14 ? 700 : 400 }}>{fmtDate(s.expiresAt)} {d <= 14 && `(${d}d)`}</span>; } },
    { key: "activity", header: "Last Active", render: (s: ManagedShop) => <span style={{ fontSize: 12, color: T.textMuted }}>{timeAgo(s.lastActivity)}</span> },
    {
      key: "actions", header: "Actions",
      render: (s: ManagedShop) => (
        <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
          <Btn size="sm" variant="ghost" onClick={() => onNavigateIsolation(s)}>🔬</Btn>
          {s.status === "active" && <Btn size="sm" variant="warning" onClick={() => handleAction("suspend", s)}>Suspend</Btn>}
          {(s.status === "suspended" || s.status === "pulled_down") && <Btn size="sm" variant="success" onClick={() => handleAction("activate", s)}>Activate</Btn>}
          {s.status === "active" && <Btn size="sm" variant="danger" onClick={() => handleAction("pulldown", s)}>Pull Down</Btn>}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        title="Shops & Users"
        subtitle={`${shops.length} registered businesses`}
        actions={<Btn onClick={onNavigateOnboarding} variant="primary">🚀 Onboard New User</Btn>}
      />

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search shops, owners, emails…" />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, minWidth: 140 }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="suspended">Suspended</option>
          <option value="pulled_down">Pulled Down</option>
          <option value="expired">Expired</option>
        </select>
        <select value={filterPkg} onChange={e => setFilterPkg(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, minWidth: 140 }}>
          {pkgOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Summary pills */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { label: "All", value: shops.length, color: T.primary },
          { label: "Active", value: shops.filter(s => s.status === "active").length, color: T.success },
          { label: "Trial", value: shops.filter(s => s.status === "trial").length, color: T.primary },
          { label: "Suspended", value: shops.filter(s => s.status === "suspended").length, color: T.warning },
          { label: "Pulled Down", value: shops.filter(s => s.status === "pulled_down").length, color: T.danger },
        ].map(p => (
          <div key={p.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: "5px 14px", display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
            <span style={{ color: T.textMuted }}>{p.label}</span>
            <span style={{ fontWeight: 800, color: p.color }}>{p.value}</span>
          </div>
        ))}
      </div>

      <Table columns={columns} data={filtered} onRowClick={s => { setSelectedShop(s); setShopTab("overview"); }} emptyMessage="No shops match your filter." />

      {/* ── Shop Detail Modal ── */}
      {selectedShop && (
        <Modal title={`${selectedShop.logoEmoji} ${selectedShop.name}`} onClose={() => setSelectedShop(null)} width={680}>
          <Tabs
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "payment", label: "Payment Details" },
              { id: "actions", label: "Admin Actions" },
            ]}
            active={shopTab}
            onSelect={setShopTab}
          />

          {shopTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InfoRow label="Owner" value={selectedShop.ownerName} />
                <InfoRow label="Email" value={selectedShop.ownerEmail} />
                <InfoRow label="Phone" value={selectedShop.ownerPhone} />
                <InfoRow label="Location" value={selectedShop.address} />
                <InfoRow label="Package" value={`${selectedShop.packageName} (${selectedShop.shopsCreated}/${selectedShop.packageShopLimit} shops)`} />
                <InfoRow label="Status" value={<Badge label={selectedShop.status} bg={statusColor(selectedShop.status).bg} color={statusColor(selectedShop.status).text} />} />
                <InfoRow label="Subscribed" value={fmtDate(selectedShop.subscribedAt)} />
                <InfoRow label="Expires" value={fmtDate(selectedShop.expiresAt)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 6 }}>
                {[
                  { label: "Revenue", value: fmt(selectedShop.totalRevenue) },
                  { label: "Orders", value: selectedShop.totalOrders.toLocaleString() },
                  { label: "Products", value: selectedShop.totalProducts.toLocaleString() },
                  { label: "Abandoned Carts", value: selectedShop.cartAbandoned },
                ].map(s => (
                  <div key={s.label} style={{ background: T.bg, borderRadius: 8, padding: 12, textAlign: "center" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn size="sm" variant="primary" onClick={() => onNavigateIsolation(selectedShop)}>🔬 Open in Isolation Lab</Btn>
                <Btn size="sm" variant="ghost" onClick={() => window.open(selectedShop.shopUrl, "_blank")}>↗ Visit Shop</Btn>
              </div>
            </div>
          )}

          {shopTab === "payment" && (
            <div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: T.textMuted }}>Set or update payment credentials for this shop. The shop admin will use these to receive payments.</p>
              <Input label="M-Pesa Paybill / Till Number" value={paymentForm.mpesaPaybill ?? ""} onChange={v => setPaymentForm(f => ({ ...f, mpesaPaybill: v }))} placeholder="e.g. 247247" />
              <Input label="M-Pesa Business Name" value={paymentForm.mpesaBusinessName ?? ""} onChange={v => setPaymentForm(f => ({ ...f, mpesaBusinessName: v }))} placeholder="e.g. FreshMart Ltd" />
              <Input label="Bank Name" value={paymentForm.bankName ?? ""} onChange={v => setPaymentForm(f => ({ ...f, bankName: v }))} placeholder="e.g. Equity Bank" />
              <Input label="Bank Account Number" value={paymentForm.bankAccount ?? ""} onChange={v => setPaymentForm(f => ({ ...f, bankAccount: v }))} placeholder="0123456789" />
              <Input label="Bank Branch" value={paymentForm.bankBranch ?? ""} onChange={v => setPaymentForm(f => ({ ...f, bankBranch: v }))} placeholder="e.g. Westlands Branch" />
              <Btn onClick={() => handleAction("payment", selectedShop)} variant="primary">💾 Save Payment Details</Btn>
            </div>
          )}

          {shopTab === "actions" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>Admin-level actions for <strong>{selectedShop.name}</strong>. Use with care — these directly affect the shop.</p>
              {selectedShop.status !== "active" && (
                <ActionCard icon="✅" title="Activate Shop" desc="Re-open the shop for business. All customer-facing pages will go live." btnLabel="Activate" variant="success" onClick={() => handleAction("activate", selectedShop)} />
              )}
              {selectedShop.status === "active" && (
                <ActionCard icon="⏸️" title="Suspend Shop" desc="Temporarily disable the shop. The owner can still log in but customers cannot browse." btnLabel="Suspend" variant="warning" onClick={() => handleAction("suspend", selectedShop)} />
              )}
              {selectedShop.status !== "pulled_down" && (
                <ActionCard icon="🔴" title="Pull Down Shop" desc="Immediately take the shop offline and notify the owner with a warning notice. Used for policy violations or suspected fraud." btnLabel="Pull Down" variant="danger" onClick={() => handleAction("pulldown", selectedShop)} />
              )}
              <ActionCard icon="🔬" title="Open in Isolation Lab" desc="Load the shop in a sandboxed environment to troubleshoot issues without affecting live operations." btnLabel="Open Lab" variant="primary" onClick={() => { setSelectedShop(null); onNavigateIsolation(selectedShop); }} />
            </div>
          )}
        </Modal>
      )}

      {/* ── Pull-down Confirm ── */}
      {confirmAction?.type === "pulldown" && (
        <Modal title="⚠️ Pull Down Shop" onClose={() => setConfirmAction(null)} width={520}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: T.text }}>This will immediately take <strong>{confirmAction.shop.name}</strong> offline and send the following notice to the owner:</p>
          <Input label="Notice to Owner" value={pulldownNotice} onChange={setPulldownNotice} textarea rows={4} />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <Btn variant="ghost" onClick={() => setConfirmAction(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={executeAction}>Pull Down Shop</Btn>
          </div>
        </Modal>
      )}

      {/* ── Generic Confirm ── */}
      {confirmAction && confirmAction.type !== "pulldown" && confirmAction.type !== "payment" && (
        <ConfirmDialog
          title={`${confirmAction.type === "suspend" ? "Suspend" : "Activate"} Shop`}
          message={`Are you sure you want to ${confirmAction.type} "${confirmAction.shop.name}"? This will affect the shop's customer-facing visibility.`}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
          danger={confirmAction.type === "suspend"}
        />
      )}

      {/* ── Payment Confirm ── */}
      {confirmAction?.type === "payment" && (
        <ConfirmDialog
          title="Update Payment Details"
          message={`Save new payment details for "${confirmAction.shop.name}"? The shop admin will be able to receive payments using these credentials.`}
          onConfirm={executeAction}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ActionCard({ icon, title, desc, btnLabel, variant, onClick }: {
  icon: string; title: string; desc: string; btnLabel: string;
  variant: "primary" | "danger" | "ghost" | "accent" | "success" | "warning";
  onClick: () => void;
}) {
  return (
    <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: T.radiusCard, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 22, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.5 }}>{desc}</div>
      </div>
      <Btn variant={variant} size="sm" onClick={onClick}>{btnLabel}</Btn>
    </div>
  );
}
