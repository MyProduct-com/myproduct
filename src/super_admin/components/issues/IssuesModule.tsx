import React, { useState } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { SupportTicket, TicketMessage } from "../../types/index";
import { Card, Btn, Input, SectionHeader, Badge, SearchBar, Tabs } from "../layout/UI";
import { statusColor, timeAgo, fmtDateTime, genId } from "../../utils/helpers";

interface Props {
  tickets: SupportTicket[];
  onUpdateTicket: (id: string, updates: Partial<SupportTicket>) => void;
  adminName: string;
  adminId: string;
  addToast: (msg: string, type?: string) => void;
}

export function IssuesModule({ tickets, onUpdateTicket, adminName, adminId, addToast }: Props) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.shopName.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchTab = activeTab === "all" || (activeTab === "open" && ["open", "in_progress"].includes(t.status)) || (activeTab === "resolved" && ["resolved", "closed"].includes(t.status));
    return matchSearch && matchStatus && matchPriority && matchTab;
  });

  const unreadCount = tickets.filter(t => t.messages.some(m => !m.read && m.senderRole !== "super_admin")).length;

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    const msg: TicketMessage = {
      id: genId("msg"),
      senderId: adminId,
      senderName: adminName,
      senderRole: "super_admin",
      message: replyText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    const updated: SupportTicket = {
      ...selected,
      messages: [...selected.messages, msg],
      status: selected.status === "open" ? "in_progress" : selected.status,
      updatedAt: new Date().toISOString(),
      assignedTo: selected.assignedTo ?? adminId,
    };
    onUpdateTicket(selected.id, updated);
    setSelected(updated);
    setReplyText("");
    addToast("Reply sent.", "success");
  };

  const updateStatus = (status: SupportTicket["status"]) => {
    if (!selected) return;
    const updates: Partial<SupportTicket> = {
      status,
      updatedAt: new Date().toISOString(),
      resolvedAt: status === "resolved" ? new Date().toISOString() : selected.resolvedAt,
    };
    onUpdateTicket(selected.id, updates);
    setSelected(s => s ? { ...s, ...updates } : s);
    addToast(`Ticket marked as ${status}.`, "success");
  };

  const priorityColor = (p: string) => statusColor(p);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        title="🎧 Support Issues"
        subtitle="Receive, respond to, and resolve user support requests."
        actions={<Badge label={`${unreadCount} unread`} bg={unreadCount > 0 ? "#fee2e2" : "#f1f5f9"} color={unreadCount > 0 ? "#991b1b" : "#475569"} />}
      />

      <div style={{ display: "grid", gridTemplateColumns: selected ? "340px 1fr" : "1fr", gap: 16, alignItems: "start" }}>
        {/* ── Ticket List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Tabs
            tabs={[
              { id: "all", label: "All", badge: tickets.length },
              { id: "open", label: "Open", badge: tickets.filter(t => ["open", "in_progress"].includes(t.status)).length },
              { id: "resolved", label: "Resolved" },
            ]}
            active={activeTab}
            onSelect={setActiveTab}
          />
          <SearchBar value={search} onChange={setSearch} placeholder="Search tickets…" />
          <div style={{ display: "flex", gap: 8 }}>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
              style={{ flex: 1, padding: "7px 10px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 12, color: T.text, background: T.surface }}>
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 560, overflowY: "auto" }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px 0", color: T.textMuted, fontSize: 13 }}>No tickets found.</div>
            )}
            {filtered.map(t => {
              const hasUnread = t.messages.some(m => !m.read && m.senderRole !== "super_admin");
              const sc = statusColor(t.status);
              const pc = priorityColor(t.priority);
              return (
                <div key={t.id} onClick={() => setSelected(t)} style={{
                  padding: "12px 14px", borderRadius: T.radiusCard, cursor: "pointer",
                  border: `1.5px solid ${selected?.id === t.id ? T.primary : T.border}`,
                  background: selected?.id === t.id ? T.primaryLight : T.surface,
                  transition: "all .12s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: hasUnread ? 800 : 600, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: 6 }}>
                      {hasUnread && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: T.danger, marginRight: 6, verticalAlign: "middle" }} />}
                      {t.subject}
                    </div>
                    <Badge label={t.priority} bg={pc.bg} color={pc.text} />
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>{t.shopName} · {t.ownerName}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge label={t.status.replace("_", " ")} bg={sc.bg} color={sc.text} />
                    <span style={{ fontSize: 11, color: T.textMuted }}>{timeAgo(t.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Ticket Detail ── */}
        {selected && (
          <Card style={{ display: "flex", flexDirection: "column", gap: 0, padding: 0, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", gap: 12, background: T.bg }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 4 }}>{selected.subject}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>
                  {selected.shopName} · {selected.ownerName} · {selected.ownerEmail}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Badge label={selected.priority} bg={priorityColor(selected.priority).bg} color={priorityColor(selected.priority).text} />
                <Badge label={selected.status.replace("_", " ")} bg={statusColor(selected.status).bg} color={statusColor(selected.status).text} />
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14, maxHeight: 400 }}>
              {selected.messages.map(msg => {
                const isAdmin = msg.senderRole === "super_admin";
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3 }}>
                      {msg.senderName} · {fmtDateTime(msg.timestamp)}
                    </div>
                    <div style={{
                      maxWidth: "80%", padding: "10px 14px", borderRadius: 12,
                      background: isAdmin ? T.primary : T.bg,
                      color: isAdmin ? "#fff" : T.text,
                      fontSize: 13, lineHeight: 1.6,
                      borderBottomRightRadius: isAdmin ? 2 : 12,
                      borderBottomLeftRadius: isAdmin ? 12 : 2,
                    }}>{msg.message}</div>
                  </div>
                );
              })}
            </div>

            {/* Reply input */}
            {!["resolved", "closed"].includes(selected.status) && (
              <div style={{ borderTop: `1px solid ${T.border}`, padding: 14 }}>
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Write a reply… (visible to shop owner — CC'd to shop admin)"
                  rows={3} style={{
                    width: "100%", padding: "10px 12px", borderRadius: T.radius,
                    border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface,
                    resize: "none", fontFamily: T.fontFamily, boxSizing: "border-box", outline: "none",
                  }} />
                <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
                  <Btn variant="primary" onClick={sendReply} disabled={!replyText.trim()} style={{ flex: 1 }}>↩ Send Reply</Btn>
                  <Btn variant="success" size="sm" onClick={() => updateStatus("resolved")}>✓ Resolve</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => updateStatus("closed")}>Close</Btn>
                </div>
                <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6 }}>
                  ℹ️ Your reply will be visible to the shop owner and CC'd to the shop admin — like an email CC.
                </div>
              </div>
            )}
            {["resolved", "closed"].includes(selected.status) && (
              <div style={{ borderTop: `1px solid ${T.border}`, padding: "12px 18px", display: "flex", gap: 10, alignItems: "center", background: T.bg }}>
                <span style={{ fontSize: 13, color: T.textMuted }}>Ticket is {selected.status}.</span>
                <Btn size="sm" variant="ghost" onClick={() => updateStatus("in_progress")}>Reopen</Btn>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
