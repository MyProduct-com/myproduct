import React, { useState } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { SuperAdmin, SuperAdminPrivilege } from "../../types/index";
import { Card, Btn, Input, SectionHeader, Badge, Modal, Checkbox, ConfirmDialog } from "../layout/UI";
import { statusColor, fmtDate, fmtDateTime, genId } from "../../utils/helpers";

interface Props {
  admins: SuperAdmin[];
  currentAdminId: string;
  onSave: (admin: SuperAdmin) => void;
  onRemove: (id: string) => void;
  addToast: (msg: string, type?: string) => void;
}

const ALL_PRIVILEGES: { id: SuperAdminPrivilege; label: string; desc: string; requireFull?: boolean }[] = [
  { id: "dashboard",   label: "Dashboard",        desc: "View system overview, metrics, and reports" },
  { id: "shops",       label: "Shops & Users",    desc: "View, suspend, and manage all shops" },
  { id: "isolation",   label: "Isolation Lab",    desc: "Load and test shops in sandboxed environment" },
  { id: "onboarding",  label: "Onboard Users",    desc: "Create accounts and set up shops for new users" },
  { id: "packages",    label: "Packages",         desc: "Create and edit subscription packages" },
  { id: "dbterminal",  label: "DB Terminal",      desc: "Direct read-only SQL terminal access", requireFull: true },
  { id: "issues",      label: "Support Issues",   desc: "View and respond to support tickets" },
  { id: "reminders",   label: "Reminders",        desc: "Send bulk communications to users" },
  { id: "marketplace", label: "Marketplace",      desc: "Moderate marketplace listings and inquiries" },
  { id: "admins",      label: "Admin Management", desc: "Add, edit, and remove other system admins", requireFull: true },
];

const BLANK_ADMIN: Omit<SuperAdmin, "id" | "createdAt" | "lastLogin"> = {
  name: "", email: "", privilegeLevel: "partial", privileges: ["dashboard", "issues"],
};

export function AdminsModule({ admins, currentAdminId, onSave, onRemove, addToast }: Props) {
  const [editing, setEditing] = useState<SuperAdmin | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<SuperAdmin | null>(null);
  const [newPass, setNewPass] = useState("");

  const openNew = () => {
    setEditing({ ...BLANK_ADMIN, id: genId("sa"), createdAt: new Date().toISOString(), lastLogin: "" } as SuperAdmin);
    setIsNew(true);
    setNewPass("");
  };

  const openEdit = (a: SuperAdmin) => { setEditing({ ...a }); setIsNew(false); setNewPass(""); };

  const togglePrivilege = (p: SuperAdminPrivilege) => {
    if (!editing) return;
    if (editing.privilegeLevel === "full") return; // full admins get all
    const has = editing.privileges.includes(p);
    setEditing(e => e ? { ...e, privileges: has ? e.privileges.filter(x => x !== p) : [...e.privileges, p] } : e);
  };

  const handlePrivilegeLevel = (level: "full" | "partial") => {
    if (!editing) return;
    const privileges = level === "full"
      ? ALL_PRIVILEGES.map(p => p.id)
      : editing.privileges.filter(p => !ALL_PRIVILEGES.find(ap => ap.id === p && ap.requireFull));
    setEditing(e => e ? { ...e, privilegeLevel: level, privileges } : e);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name.trim()) { addToast("Name is required.", "error"); return; }
    if (!editing.email.includes("@")) { addToast("Valid email is required.", "error"); return; }
    if (isNew && !newPass) { addToast("Password is required for new admin.", "error"); return; }
    onSave(editing);
    addToast(`Admin "${editing.name}" ${isNew ? "created" : "updated"}.`, "success");
    setEditing(null);
  };

  const handleRemove = () => {
    if (!confirmRemove) return;
    onRemove(confirmRemove.id);
    addToast(`Admin "${confirmRemove.name}" removed.`, "warning");
    setConfirmRemove(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <SectionHeader
        title="🛡️ System Admins"
        subtitle="Manage who has access to this super admin portal and what they can do."
        actions={<Btn variant="primary" onClick={openNew}>+ Add Admin</Btn>}
      />

      {/* Stats */}
      <div style={{ display: "flex", gap: 12 }}>
        {[
          { label: "Total Admins", value: admins.length, color: T.primary },
          { label: "Full Privilege", value: admins.filter(a => a.privilegeLevel === "full").length, color: T.accent },
          { label: "Partial Privilege", value: admins.filter(a => a.privilegeLevel === "partial").length, color: T.primary },
        ].map(s => (
          <div key={s.label} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: "10px 16px" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Admin list */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {admins.map(admin => {
          const isCurrentUser = admin.id === currentAdminId;
          const pc = statusColor(admin.privilegeLevel);
          return (
            <Card key={admin.id} style={{ position: "relative" }}>
              {isCurrentUser && (
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <Badge label="You" bg={T.primaryLight} color={T.primary} />
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${T.primary}, ${T.accent})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 900, fontSize: 16, flexShrink: 0,
                }}>
                  {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.text, marginBottom: 2 }}>{admin.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.email}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge label={admin.privilegeLevel === "full" ? "Full Privilege" : "Partial Privilege"} bg={pc.bg} color={pc.text} />
                <span style={{ fontSize: 11, color: T.textMuted, alignSelf: "center" }}>{admin.privileges.length} modules</span>
              </div>

              {/* Module pills */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {ALL_PRIVILEGES.map(p => (
                  <span key={p.id} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 999,
                    background: admin.privileges.includes(p.id) ? T.primaryLight : T.bg,
                    color: admin.privileges.includes(p.id) ? T.primary : T.textMuted,
                    fontWeight: admin.privileges.includes(p.id) ? 700 : 400,
                  }}>{p.label}</span>
                ))}
              </div>

              <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 12 }}>
                Created {fmtDate(admin.createdAt)} {admin.createdBy && `· by admin`}
                {admin.lastLogin && ` · Last login: ${fmtDateTime(admin.lastLogin)}`}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn size="sm" variant="primary" onClick={() => openEdit(admin)} style={{ flex: 1 }}>✏️ Edit</Btn>
                {!isCurrentUser && (
                  <Btn size="sm" variant="danger" onClick={() => setConfirmRemove(admin)}>Remove</Btn>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Edit / Create Modal ── */}
      {editing && (
        <Modal title={isNew ? "Add System Admin" : `Edit — ${editing.name}`} onClose={() => setEditing(null)} width={600}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Input label="Full Name *" value={editing.name} onChange={v => setEditing(e => e ? { ...e, name: v } : e)} placeholder="e.g. Beatrice Otieno" />
            <Input label="Email *" value={editing.email} onChange={v => setEditing(e => e ? { ...e, email: v } : e)} placeholder="beatrice@system.admin" type="email" />
          </div>
          {isNew && (
            <Input label="Temporary Password *" value={newPass} onChange={setNewPass} placeholder="Min. 8 characters" type="password" />
          )}

          {/* Privilege level */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Privilege Level</div>
            <div style={{ display: "flex", gap: 10 }}>
              {(["full", "partial"] as const).map(level => (
                <div key={level} onClick={() => handlePrivilegeLevel(level)} style={{
                  flex: 1, padding: "12px 16px", borderRadius: T.radiusCard, cursor: "pointer",
                  border: `2px solid ${editing.privilegeLevel === level ? T.primary : T.border}`,
                  background: editing.privilegeLevel === level ? T.primaryLight : T.surface,
                  transition: "all .15s",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.text, marginBottom: 3 }}>
                    {level === "full" ? "✦ Full Privilege" : "◑ Partial Privilege"}
                  </div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>
                    {level === "full"
                      ? "All modules including DB Terminal and Admin Management."
                      : "Select specific modules this admin can access."}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Module permissions (partial only) */}
          {editing.privilegeLevel === "partial" && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Module Access</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ALL_PRIVILEGES.map(p => {
                  const locked = p.requireFull;
                  return (
                    <div key={p.id} style={{ opacity: locked ? 0.45 : 1 }}>
                      <Checkbox
                        checked={editing.privileges.includes(p.id)}
                        onChange={() => !locked && togglePrivilege(p.id)}
                        label={p.label}
                      />
                      {locked && <div style={{ fontSize: 10, color: T.textMuted, marginLeft: 26 }}>Full privilege only</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={handleSave}>💾 {isNew ? "Create Admin" : "Save Changes"}</Btn>
          </div>
        </Modal>
      )}

      {/* Confirm remove */}
      {confirmRemove && (
        <ConfirmDialog
          title="Remove Admin"
          message={`Are you sure you want to remove "${confirmRemove.name}" from system admin access? This action cannot be undone.`}
          onConfirm={handleRemove}
          onCancel={() => setConfirmRemove(null)}
          danger
        />
      )}
    </div>
  );
}
