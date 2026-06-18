import { useState } from "react";
import type { SubAdmin, AdminPrivilege, Theme } from "../../types/index";
import { SectionHeader, Btn, Modal, Input, Badge, Table } from "../layout/UI";
import { fmtDateTime, genId } from "../../utils/helpers";

const ALL_PRIVILEGES: { id: AdminPrivilege; label: string; icon: string }[] = [
  { id:"products",     label:"Products",      icon:"🛍️" },
  { id:"orders",       label:"Orders",        icon:"📦" },
  { id:"pos",          label:"Point of Sale", icon:"🖥️" },
  { id:"inventory",    label:"Inventory",     icon:"📋" },
  { id:"accounting",   label:"Accounting",    icon:"💰" },
  { id:"staff",        label:"Staff Mgmt",    icon:"👥" },
  { id:"settings",     label:"Settings",      icon:"⚙️" },
  { id:"subscription", label:"Subscription",  icon:"🎫" },
  { id:"reports",      label:"Reports",       icon:"📊" },
];

interface StaffViewProps {
  theme: Theme;
  staff: SubAdmin[];
  onStaff: (s: SubAdmin[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const EMPTY_FORM = { name:"", email:"", phone:"", role:"", pin:"", privileges: [] as AdminPrivilege[] };

export default function StaffView({ theme, staff, onStaff, onToast }: StaffViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [editStaff, setEditStaff] = useState<SubAdmin | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showPrivModal, setShowPrivModal] = useState<SubAdmin | null>(null);
  const [tempPrivs, setTempPrivs] = useState<AdminPrivilege[]>([]);

  const setField = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const togglePriv = (priv: AdminPrivilege) => {
    setTempPrivs(p => p.includes(priv) ? p.filter(x => x !== priv) : [...p, priv]);
  };
  const toggleFormPriv = (priv: AdminPrivilege) => {
    setForm(f => ({
      ...f,
      privileges: f.privileges.includes(priv) ? f.privileges.filter(x => x !== priv) : [...f.privileges, priv],
    }));
  };

  const openAdd = () => { setEditStaff(null); setForm(EMPTY_FORM); setShowAdd(true); };
  const openEdit = (s: SubAdmin) => {
    setEditStaff(s);
    setForm({ name:s.name, email:s.email, phone:s.phone, role:s.role, pin:s.pin||"", privileges:[...s.privileges] });
    setShowAdd(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) { onToast("Name and email required.", "error"); return; }
    if (editStaff) {
      onStaff(staff.map(s => s.id === editStaff.id ? { ...s, ...form } : s));
      onToast("Staff member updated.", "success");
    } else {
      const newStaff: SubAdmin = {
        id: genId("sub"), ...form, active: true, createdAt: new Date().toISOString(),
      };
      onStaff([...staff, newStaff]);
      onToast(`${form.name} added as sub-admin.`, "success");
    }
    setShowAdd(false);
  };

  const toggleActive = (id: string) => {
    const s = staff.find(x => x.id === id)!;
    onStaff(staff.map(x => x.id === id ? { ...x, active: !x.active } : x));
    onToast(`${s.name} ${s.active ? "deactivated" : "activated"}.`, "info");
  };

  const removeStaff = (id: string) => {
    const s = staff.find(x => x.id === id)!;
    onStaff(staff.filter(x => x.id !== id));
    onToast(`${s.name} removed.`, "info");
  };

  const openPrivileges = (s: SubAdmin) => {
    setShowPrivModal(s);
    setTempPrivs([...s.privileges]);
  };

  const savePrivileges = () => {
    if (!showPrivModal) return;
    onStaff(staff.map(s => s.id === showPrivModal.id ? { ...s, privileges: tempPrivs } : s));
    onToast(`Privileges updated for ${showPrivModal.name}.`, "success");
    setShowPrivModal(null);
  };

  const columns = [
    {
      header: "Staff Member", key: "name",
      render: (s: SubAdmin) => {
        const initials = s.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
        return (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{
              width:36, height:36, borderRadius:"50%", background:theme.primaryLight,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontWeight:800, fontSize:12, color:theme.primary, flexShrink:0,
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight:700, color:theme.black }}>{s.name}</div>
              <div style={{ fontSize:11, color:theme.textMuted }}>{s.email}</div>
            </div>
          </div>
        );
      },
    },
    { header:"Role", key:"role", render:(s:SubAdmin) => <span style={{ fontSize:12, fontWeight:600 }}>{s.role}</span> },
    { header:"Phone", key:"phone", render:(s:SubAdmin) => <span style={{ fontSize:12 }}>{s.phone}</span> },
    {
      header:"Privileges", key:"privs",
      render:(s:SubAdmin) => (
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
          {s.privileges.slice(0,3).map(p => (
            <span key={p} style={{ fontSize:10, padding:"2px 7px", borderRadius:20, background:theme.primaryLight, color:theme.primary, fontWeight:700 }}>
              {ALL_PRIVILEGES.find(x=>x.id===p)?.icon} {p}
            </span>
          ))}
          {s.privileges.length > 3 && <span style={{ fontSize:10, color:theme.textMuted }}>+{s.privileges.length-3}</span>}
        </div>
      ),
    },
    {
      header:"Last Login", key:"login",
      render:(s:SubAdmin) => <span style={{ fontSize:11, color:theme.textMuted }}>{s.lastLogin ? fmtDateTime(s.lastLogin) : "Never"}</span>,
    },
    { header:"Status", key:"status", render:(s:SubAdmin) => <Badge status={s.active ? "active" : "Inactive"} /> },
    {
      header:"Actions", key:"actions",
      render:(s:SubAdmin) => (
        <div style={{ display:"flex", gap:6 }} onClick={e => e.stopPropagation()}>
          <Btn theme={theme} variant="ghost" small onClick={()=>openPrivileges(s)}>🔑 Access</Btn>
          <Btn theme={theme} variant="secondary" small onClick={()=>openEdit(s)}>✏️</Btn>
          <Btn theme={theme} variant={s.active?"secondary":"primary"} small onClick={()=>toggleActive(s.id)}>
            {s.active ? "Deactivate" : "Activate"}
          </Btn>
          <Btn theme={theme} variant="danger" small onClick={()=>removeStaff(s.id)}>🗑</Btn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Staff & Sub-Admins"
        subtitle={`${staff.filter(s=>s.active).length} active · ${staff.filter(s=>!s.active).length} inactive`}
        theme={theme}
        action={<Btn theme={theme} onClick={openAdd}>+ Add Sub-Admin</Btn>}
      />

      <Table columns={columns} data={staff} theme={theme} emptyMessage="No staff added yet." />

      {/* Add/Edit Modal */}
      {showAdd && (
        <Modal title={editStaff ? "Edit Staff Member" : "Add Sub-Admin"} onClose={() => setShowAdd(false)} theme={theme} width={520}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div style={{ gridColumn:"1/-1" }}><Input label="Full Name" value={form.name} onChange={setField("name")} theme={theme} required /></div>
            <Input label="Email" value={form.email} onChange={setField("email")} type="email" theme={theme} required />
            <Input label="Phone" value={form.phone} onChange={setField("phone")} theme={theme} />
            <Input label="Role Title" value={form.role} onChange={setField("role")} placeholder="Cashier, Manager…" theme={theme} />
            <Input label="PIN (4 digits)" value={form.pin} onChange={setField("pin")} type="password" theme={theme} placeholder="For POS login" />
          </div>

          <div style={{ marginTop:4 }}>
            <div style={{ fontSize:12, fontWeight:600, color:theme.textMuted, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.05em" }}>
              Module Access
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
              {ALL_PRIVILEGES.map(p => {
                const checked = form.privileges.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleFormPriv(p.id)}
                    style={{
                      padding:"8px 10px", borderRadius:theme.radius,
                      border:`2px solid ${checked ? theme.primary : theme.border}`,
                      background:checked ? theme.primaryLight : theme.bg,
                      cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:6,
                      fontSize:12, fontWeight:700, color:checked ? theme.primary : theme.textMuted,
                    }}
                  >
                    <span>{p.icon}</span> {p.label}
                    {checked && <span style={{ marginLeft:"auto" }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:20 }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn theme={theme} onClick={handleSave}>{editStaff ? "Save Changes" : "Add Staff"}</Btn>
          </div>
        </Modal>
      )}

      {/* Privileges Modal */}
      {showPrivModal && (
        <Modal title={`Access Control: ${showPrivModal.name}`} onClose={() => setShowPrivModal(null)} theme={theme} width={480}>
          <div style={{ fontSize:13, color:theme.textMuted, marginBottom:16 }}>
            Role: <strong style={{ color:theme.black }}>{showPrivModal.role}</strong>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:10, marginBottom:20 }}>
            {ALL_PRIVILEGES.map(p => {
              const checked = tempPrivs.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePriv(p.id)}
                  style={{
                    padding:"12px 14px", borderRadius:theme.radius,
                    border:`2px solid ${checked ? theme.primary : theme.border}`,
                    background:checked ? theme.primaryLight : theme.bg,
                    cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:10,
                    transition:"all 0.15s",
                  }}
                >
                  <span style={{ fontSize:20 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:checked ? theme.primary : theme.text }}>{p.label}</div>
                    <div style={{ fontSize:10, color:theme.textMuted }}>{checked ? "Enabled" : "Disabled"}</div>
                  </div>
                  {checked && <span style={{ marginLeft:"auto", color:theme.primary, fontWeight:900 }}>✓</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowPrivModal(null)}>Cancel</Btn>
            <Btn theme={theme} onClick={savePrivileges}>Save Privileges</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
