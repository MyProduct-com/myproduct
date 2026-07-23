import React, { useState } from "react";
import { Globe, ShoppingBag, PartyPopper, Check, Undo2, Flag, Info } from "lucide-react";
import { SA_THEME as T } from "../../data/theme";
import type { MarketplaceItem, TicketMessage } from "../../types/index";
import { Card, Btn, SectionHeader, Badge, SearchBar, Table, Modal, Input, Tabs } from "../layout/UI";
import { statusColor, timeAgo, genId } from "../../utils/helpers";
import { usePersistedState } from "@/lib/usePersistedState";

interface Props {
  items: MarketplaceItem[];
  onUpdateItem: (id: string, updates: Partial<MarketplaceItem>) => void;
  adminName: string;
  adminId: string;
  addToast: (msg: string, type?: string) => void;
}

interface MarketplaceInquiry {
  id: string;
  productId: string;
  productName: string;
  shopName: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
  timestamp: string;
  replies: TicketMessage[];
  resolved: boolean;
}

const MOCK_INQUIRIES: MarketplaceInquiry[] = [
  {
    id: "inq_001", productId: "mkt_003", productName: "Wireless Earbuds Pro", shopName: "TechZone",
    buyerName: "Brian Odhiambo", buyerEmail: "brian@email.com",
    message: "Are these compatible with iPhone 15? Do you offer warranty?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), replies: [], resolved: false,
  },
  {
    id: "inq_002", productId: "mkt_001", productName: "Sukuma Wiki (Kale)", shopName: "FreshMart",
    buyerName: "Cynthia Akinyi", buyerEmail: "cynthia@email.com",
    message: "Can I get bulk order of 10kg delivered to Westlands?",
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), replies: [], resolved: false,
  },
];

export function MarketplaceModule({ items, onUpdateItem, adminName, adminId, addToast }: Props) {
  const [search, setSearch] = useState("");
  const [filterShop, setFilterShop] = useState("all");
  const [filterFlag, setFilterFlag] = useState("all");
  const [selected, setSelected] = useState<MarketplaceItem | null>(null);
  const [tab, setTab] = useState("items");
  const [inquiries, setInquiries] = usePersistedState<MarketplaceInquiry[]>("sa-marketplace-inquiries", MOCK_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<MarketplaceInquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [flagReason, setFlagReason] = useState("");
  const [showFlagModal, setShowFlagModal] = useState(false);

  const shops = Array.from(new Set(items.map(i => i.shopName)));

  const filtered = items.filter(it => {
    const matchSearch = it.productName.toLowerCase().includes(search.toLowerCase()) || it.shopName.toLowerCase().includes(search.toLowerCase());
    const matchShop = filterShop === "all" || it.shopName === filterShop;
    const matchFlag = filterFlag === "all" || (filterFlag === "flagged" && it.flagged) || (filterFlag === "unpublished" && !it.published);
    return matchSearch && matchShop && matchFlag;
  });

  const flaggedCount = items.filter(i => i.flagged).length;
  const unresolved = inquiries.filter(i => !i.resolved).length;

  const handleFlag = () => {
    if (!selected) return;
    onUpdateItem(selected.id, { flagged: true, flagReason });
    setSelected(s => s ? { ...s, flagged: true, flagReason } : s);
    setShowFlagModal(false);
    setFlagReason("");
    addToast(`Product flagged: ${selected.productName}`, "warning");
  };

  const handleUnflag = (item: MarketplaceItem) => {
    onUpdateItem(item.id, { flagged: false, flagReason: undefined });
    if (selected?.id === item.id) setSelected(s => s ? { ...s, flagged: false, flagReason: undefined } : s);
    addToast(`Flag removed from: ${item.productName}`, "success");
  };

  const handleTogglePublish = (item: MarketplaceItem) => {
    const next = !item.published;
    onUpdateItem(item.id, { published: next });
    if (selected?.id === item.id) setSelected(s => s ? { ...s, published: next } : s);
    addToast(`${item.productName} ${next ? "published" : "unpublished"}.`, next ? "success" : "warning");
  };

  const sendInquiryReply = () => {
    if (!selectedInquiry || !replyText.trim()) return;
    const msg: TicketMessage = {
      id: genId("m"), senderId: adminId, senderName: adminName, senderRole: "super_admin",
      message: replyText.trim(), timestamp: new Date().toISOString(), read: true,
    };
    setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, replies: [...i.replies, msg] } : i));
    setSelectedInquiry(i => i ? { ...i, replies: [...i.replies, msg] } : i);
    setReplyText("");
    addToast("Reply sent — visible to buyer and CC'd to shop admin.", "success");
  };

  const columns = [
    {
      key: "product", header: "Product", render: (it: MarketplaceItem) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 6, background: T.bg, overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingBag size={20} color={T.textMuted} /></div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: T.text }}>{it.productName}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{it.shopName}</div>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", render: (it: MarketplaceItem) => <span style={{ fontWeight: 700, color: T.text }}>KSh {it.price.toLocaleString()}</span> },
    { key: "stats", header: "Clicks / Carts / Sales", render: (it: MarketplaceItem) => <span style={{ fontSize: 12, color: T.textMuted }}>{it.clicks} · {it.addedToCart} · {it.purchases}</span> },
    {
      key: "status", header: "Status", render: (it: MarketplaceItem) => (
        <div style={{ display: "flex", gap: 5 }}>
          <Badge label={it.published ? "published" : "unpublished"} bg={it.published ? "#dcfce7" : "#f1f5f9"} color={it.published ? "#166534" : "#475569"} />
          {it.flagged && <Badge label="flagged" bg="#fee2e2" color="#991b1b" />}
        </div>
      ),
    },
    {
      key: "actions", header: "Actions", render: (it: MarketplaceItem) => (
        <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
          <Btn size="sm" variant={it.published ? "warning" : "success"} onClick={() => handleTogglePublish(it)}>
            {it.published ? "Unpublish" : "Publish"}
          </Btn>
          {it.flagged
            ? <Btn size="sm" variant="ghost" onClick={() => handleUnflag(it)}>Unflag</Btn>
            : <Btn size="sm" variant="danger" onClick={() => { setSelected(it); setShowFlagModal(true); }}>Flag</Btn>
          }
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        icon={Globe}
        title="Marketplace Management"
        subtitle="Moderate shared marketplace listings, manage visibility, and handle buyer inquiries."
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            {flaggedCount > 0 && <Badge label={`${flaggedCount} flagged`} bg="#fee2e2" color="#991b1b" />}
            {unresolved > 0 && <Badge label={`${unresolved} inquiries`} bg="#fef9c3" color="#854d0e" />}
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: "items", label: "Listings", badge: items.length },
          { id: "flagged", label: "Flagged", badge: flaggedCount },
          { id: "inquiries", label: "Inquiries", badge: unresolved },
        ]}
        active={tab}
        onSelect={setTab}
      />

      {/* ── Listings Tab ── */}
      {tab === "items" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products or shops…" />
            <select value={filterShop} onChange={e => setFilterShop(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, minWidth: 150 }}>
              <option value="all">All Shops</option>
              {shops.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterFlag} onChange={e => setFilterFlag(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, minWidth: 150 }}>
              <option value="all">All Items</option>
              <option value="flagged">Flagged Only</option>
              <option value="unpublished">Unpublished Only</option>
            </select>
          </div>

          {/* Summary stats */}
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { label: "Total Listings", value: items.length, color: T.primary },
              { label: "Published", value: items.filter(i => i.published).length, color: T.success },
              { label: "Flagged", value: flaggedCount, color: T.danger },
              { label: "Total Clicks", value: items.reduce((a, b) => a + b.clicks, 0), color: T.accent },
              { label: "In Carts", value: items.reduce((a, b) => a + b.addedToCart, 0), color: T.warning },
            ].map(s => (
              <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "8px 14px" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{s.label}</div>
              </div>
            ))}
          </div>

          <Table columns={columns} data={filtered} onRowClick={setSelected} emptyMessage="No listings match your filter." />
        </div>
      )}

      {/* ── Flagged Tab ── */}
      {tab === "flagged" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.filter(i => i.flagged).length === 0
            ? <Card style={{ textAlign: "center", padding: "40px 24px", color: T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>No flagged items. Great! <PartyPopper size={16} /></Card>
            : items.filter(i => i.flagged).map(it => (
              <Card key={it.id} style={{ borderLeft: `4px solid ${T.danger}` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{it.productName}</div>
                    <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 6 }}>{it.shopName} · KSh {it.price.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: T.danger }}><strong>Flag reason:</strong> {it.flagReason ?? "No reason provided"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="ghost" onClick={() => handleUnflag(it)}><Check size={14} /> Clear Flag</Btn>
                    <Btn size="sm" variant="danger" onClick={() => handleTogglePublish(it)}>Unpublish</Btn>
                  </div>
                </div>
              </Card>
            ))
          }
        </div>
      )}

      {/* ── Inquiries Tab ── */}
      {tab === "inquiries" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {inquiries.map(inq => (
              <Card key={inq.id} style={{
                cursor: "pointer", border: `1.5px solid ${selectedInquiry?.id === inq.id ? T.primary : T.border}`,
                background: selectedInquiry?.id === inq.id ? T.primaryLight : T.surface,
              }}><div onClick={() => setSelectedInquiry(inq)} style={{ cursor: "pointer" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.text, marginBottom: 3 }}>{inq.productName}</div>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>{inq.shopName} · {inq.buyerName}</div>
                <div style={{ fontSize: 12, color: T.text, marginBottom: 6 }}>{inq.message.slice(0, 80)}…</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textMuted }}>
                  <span>{timeAgo(inq.timestamp)}</span>
                  <Badge label={inq.resolved ? "resolved" : "open"} bg={inq.resolved ? "#dcfce7" : "#fef9c3"} color={inq.resolved ? "#166534" : "#854d0e"} />
                </div>
              </div></Card>
            ))}
          </div>

          {selectedInquiry && (
            <Card style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: T.bg }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.text }}>{selectedInquiry.productName}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{selectedInquiry.buyerName} · {selectedInquiry.buyerEmail}</div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Original message */}
                <div style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3 }}>{selectedInquiry.buyerName} (buyer) · {timeAgo(selectedInquiry.timestamp)}</div>
                  <div style={{ background: T.bg, padding: "10px 14px", borderRadius: 12, borderBottomLeftRadius: 2, fontSize: 13, color: T.text, lineHeight: 1.6 }}>{selectedInquiry.message}</div>
                </div>
                {/* Replies */}
                {selectedInquiry.replies.map(r => (
                  <div key={r.id} style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3, textAlign: "right" }}>{r.senderName} (admin) · {timeAgo(r.timestamp)}</div>
                    <div style={{ background: T.primary, color: "#fff", padding: "10px 14px", borderRadius: 12, borderBottomRightRadius: 2, fontSize: 13, lineHeight: 1.6 }}>{r.message}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${T.border}`, padding: 12 }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Reply to buyer (CC'd to shop admin)…"
                  rows={3} style={{ width: "100%", padding: "8px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: T.fontFamily, resize: "none", boxSizing: "border-box", outline: "none" }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Btn variant="primary" onClick={sendInquiryReply} disabled={!replyText.trim()} style={{ flex: 1 }}><Undo2 size={14} /> Send Reply</Btn>
                  <Btn variant="success" size="sm" onClick={() => {
                    setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, resolved: true } : i));
                    setSelectedInquiry(i => i ? { ...i, resolved: true } : i);
                    addToast("Inquiry resolved.", "success");
                  }}><Check size={14} /> Resolve</Btn>
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6, display: "flex", alignItems: "center", gap: 5 }}><Info size={12} style={{ flexShrink: 0 }} /> Reply visible to buyer and CC'd to {selectedInquiry.shopName} admin.</div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── Flag Modal ── */}
      {showFlagModal && selected && (
        <Modal title={`Flag: ${selected.productName}`} onClose={() => { setShowFlagModal(false); setFlagReason(""); }} width={440}>
          <p style={{ fontSize: 13, color: T.text, margin: "0 0 14px", lineHeight: 1.6 }}>
            Flagging will mark this product for review. Provide a reason so the shop admin understands the concern.
          </p>
          <Input label="Flag Reason *" value={flagReason} onChange={setFlagReason} placeholder="e.g. Suspected counterfeit product" />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={() => { setShowFlagModal(false); setFlagReason(""); }}>Cancel</Btn>
            <Btn variant="danger" onClick={handleFlag} disabled={!flagReason.trim()}><Flag size={14} /> Flag Product</Btn>
          </div>
        </Modal>
      )}

      {/* ── Item Detail Modal ── */}
      {selected && !showFlagModal && (
        <Modal title={selected.productName} onClose={() => setSelected(null)} width={500}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Shop", value: selected.shopName },
                { label: "Category", value: selected.category },
                { label: "Price", value: `KSh ${selected.price.toLocaleString()}` },
                { label: "Total Clicks", value: selected.clicks },
                { label: "Added to Cart", value: selected.addedToCart },
                { label: "Purchases", value: selected.purchases },
                { label: "Cart Abandonment", value: `${selected.addedToCart - selected.purchases} unpurchased` },
                { label: "Listed On", value: selected.createdAt },
              ].map(r => (
                <div key={r.label} style={{ background: T.bg, borderRadius: 6, padding: "8px 12px" }}>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{r.value}</div>
                </div>
              ))}
            </div>
            {selected.flagged && (
              <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: T.radius, padding: "10px 14px", fontSize: 13, color: T.danger, display: "flex", alignItems: "center", gap: 8 }}>
                <Flag size={14} style={{ flexShrink: 0 }} /> <strong>Flagged:</strong> {selected.flagReason}
              </div>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant={selected.published ? "warning" : "success"} onClick={() => handleTogglePublish(selected)} style={{ flex: 1 }}>
                {selected.published ? "Unpublish" : "Publish"}
              </Btn>
              {selected.flagged
                ? <Btn variant="ghost" onClick={() => handleUnflag(selected)}>Remove Flag</Btn>
                : <Btn variant="danger" onClick={() => setShowFlagModal(true)}><Flag size={14} /> Flag</Btn>
              }
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
