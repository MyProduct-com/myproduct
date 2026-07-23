import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ShoppingBag, Package, Monitor, ClipboardList, Wallet, Users, Settings,
  Ticket, BarChart3, KeyRound, Pencil, Trash2, Check,
} from "lucide-react";
import type { SubAdmin, AdminPrivilege } from "../../types/index";
import { fmtDateTime, genId } from "../../utils/helpers";

const ALL_PRIVILEGES: { id: AdminPrivilege; label: string; icon: LucideIcon }[] = [
  { id:"products",     label:"Products",      icon: ShoppingBag },
  { id:"orders",       label:"Orders",        icon: Package },
  { id:"pos",          label:"Point of Sale", icon: Monitor },
  { id:"inventory",    label:"Inventory",     icon: ClipboardList },
  { id:"accounting",   label:"Accounting",    icon: Wallet },
  { id:"staff",        label:"Staff Mgmt",    icon: Users },
  { id:"settings",     label:"Settings",      icon: Settings },
  { id:"subscription", label:"Subscription",  icon: Ticket },
  { id:"reports",      label:"Reports",       icon: BarChart3 },
];

interface StaffViewProps {
  staff: SubAdmin[];
  onStaff: (s: SubAdmin[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const EMPTY_FORM = { name:"", email:"", phone:"", role:"", pin:"", privileges: [] as AdminPrivilege[] };

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-org-pill text-org-xs font-org-semibold ${active ? "bg-org-success-bg text-org-success" : "bg-org-surface-alt text-org-text-secondary"}`}>
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function StaffView({ staff, onStaff, onToast }: StaffViewProps) {
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

  const initials = (name: string) => name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const inputCls = "w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary";
  const labelCls = "block text-org-xs font-org-medium text-org-text-secondary mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-org-lg font-org-bold text-org-text-primary">Staff & Sub-Admins</h1>
          <p className="text-org-sm text-org-text-secondary mt-0.5">{staff.filter(s=>s.active).length} active &middot; {staff.filter(s=>!s.active).length} inactive</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">
          + Add Sub-Admin
        </button>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {staff.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No staff added yet.</p>
        ) : staff.map((s) => (
          <div key={s.id} className="bg-org-surface rounded-org-card shadow-org-card p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-org-primary-light text-org-primary flex items-center justify-center font-org-bold text-org-xs shrink-0">{initials(s.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="font-org-medium text-org-text-primary truncate">{s.name}</p>
                <p className="text-org-xs text-org-text-muted truncate">{s.email}</p>
              </div>
              <ActiveBadge active={s.active} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-org-border text-org-xs text-org-text-secondary">
              <span>{s.role || "—"}</span>
              <span>{s.phone}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {s.privileges.slice(0,4).map(p => (
                <span key={p} className="text-[10px] px-2 py-0.5 rounded-org-pill bg-org-primary-light text-org-primary font-org-semibold">{p}</span>
              ))}
              {s.privileges.length > 4 && <span className="text-[10px] text-org-text-muted">+{s.privileges.length-4}</span>}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => openPrivileges(s)} className="flex-1 text-center text-org-xs font-org-medium text-org-text-secondary bg-org-surface-alt rounded-org-sm py-2">Access</button>
              <button onClick={() => openEdit(s)} className="w-9 h-9 flex items-center justify-center rounded-org-sm text-org-text-secondary bg-org-surface-alt shrink-0"><Pencil size={14} /></button>
              <button onClick={() => toggleActive(s.id)} className={`flex-1 text-center text-org-xs font-org-semibold rounded-org-sm py-2 ${s.active ? "text-org-text-secondary bg-org-surface-alt" : "text-white bg-org-primary"}`}>
                {s.active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => removeStaff(s.id)} className="w-9 h-9 flex items-center justify-center rounded-org-sm text-org-danger bg-org-danger-bg shrink-0"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-org-surface rounded-org-card shadow-org-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-org-sm">
            <thead className="bg-org-surface-alt border-b border-org-border">
              <tr className="text-org-xs text-org-text-muted uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-org-medium">Staff Member</th>
                <th className="px-4 py-3 text-left font-org-medium">Role</th>
                <th className="px-4 py-3 text-left font-org-medium">Phone</th>
                <th className="px-4 py-3 text-left font-org-medium">Privileges</th>
                <th className="px-4 py-3 text-left font-org-medium">Last Login</th>
                <th className="px-4 py-3 text-left font-org-medium">Status</th>
                <th className="px-4 py-3 text-right font-org-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-org-border">
              {staff.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-org-text-secondary">No staff added yet.</td></tr>
              ) : staff.map((s) => (
                <tr key={s.id} className="hover:bg-org-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-org-primary-light text-org-primary flex items-center justify-center font-org-bold text-org-xs shrink-0">{initials(s.name)}</div>
                      <div className="min-w-0">
                        <p className="font-org-medium text-org-text-primary truncate">{s.name}</p>
                        <p className="text-org-xs text-org-text-muted truncate">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-org-text-secondary">{s.role || "—"}</td>
                  <td className="px-4 py-3 text-org-text-secondary">{s.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.privileges.slice(0,3).map(p => {
                        const PrivIcon = ALL_PRIVILEGES.find(x=>x.id===p)?.icon;
                        return (
                          <span key={p} className="text-[10px] px-2 py-0.5 rounded-org-pill bg-org-primary-light text-org-primary font-org-semibold inline-flex items-center gap-1">
                            {PrivIcon && <PrivIcon size={10} />} {p}
                          </span>
                        );
                      })}
                      {s.privileges.length > 3 && <span className="text-[10px] text-org-text-muted">+{s.privileges.length-3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-org-xs text-org-text-muted">{s.lastLogin ? fmtDateTime(s.lastLogin) : "Never"}</td>
                  <td className="px-4 py-3"><ActiveBadge active={s.active} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => openPrivileges(s)} className="inline-flex items-center gap-1 text-org-xs font-org-medium text-org-text-secondary hover:text-org-primary"><KeyRound size={12} /> Access</button>
                      <button onClick={() => openEdit(s)} className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-primary hover:bg-org-primary-light transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => toggleActive(s.id)} className={`px-2.5 py-1 rounded-org-sm text-org-xs font-org-semibold transition-colors ${s.active ? "text-org-text-secondary bg-org-surface-alt hover:bg-org-border" : "text-white bg-org-primary hover:bg-org-primary-hover"}`}>
                        {s.active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => removeStaff(s.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-danger hover:bg-org-danger-bg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">{editStaff ? "Edit Staff Member" : "Add Sub-Admin"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Full Name</label>
                <input value={form.name} onChange={(e) => setField("name")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setField("email")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Phone</label>
                <input value={form.phone} onChange={(e) => setField("phone")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Role Title</label>
                <input value={form.role} onChange={(e) => setField("role")(e.target.value)} placeholder="Cashier, Manager…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>PIN (4 digits)</label>
                <input type="password" value={form.pin} onChange={(e) => setField("pin")(e.target.value)} placeholder="For POS login" className={inputCls} />
              </div>
            </div>

            <div className="mt-4">
              <p className="text-org-xs font-org-semibold text-org-text-secondary uppercase tracking-wide mb-2.5">Module Access</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_PRIVILEGES.map(p => {
                  const checked = form.privileges.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleFormPriv(p.id)}
                      className={`px-2.5 py-2 rounded-org-sm border-2 text-left flex items-center gap-1.5 text-org-xs font-org-semibold transition-colors ${
                        checked ? "border-org-primary bg-org-primary-light text-org-primary" : "border-org-border bg-org-bg text-org-text-secondary"
                      }`}
                    >
                      <p.icon size={14} /> {p.label}
                      {checked && <Check size={14} className="ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">{editStaff ? "Save Changes" : "Add Staff"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Privileges Modal */}
      {showPrivModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowPrivModal(null)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-lg p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-1">Access Control: {showPrivModal.name}</h2>
            <p className="text-org-sm text-org-text-secondary mb-4">Role: <strong className="text-org-text-primary">{showPrivModal.role}</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {ALL_PRIVILEGES.map(p => {
                const checked = tempPrivs.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePriv(p.id)}
                    className={`px-3.5 py-3 rounded-org-sm border-2 text-left flex items-center gap-2.5 transition-colors ${
                      checked ? "border-org-primary bg-org-primary-light" : "border-org-border bg-org-bg"
                    }`}
                  >
                    <p.icon size={20} className={checked ? "text-org-primary" : "text-org-text-secondary"} />
                    <div>
                      <p className={`text-org-sm font-org-semibold ${checked ? "text-org-primary" : "text-org-text-primary"}`}>{p.label}</p>
                      <p className="text-[10px] text-org-text-muted">{checked ? "Enabled" : "Disabled"}</p>
                    </div>
                    {checked && <Check size={16} className="ml-auto text-org-primary" />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowPrivModal(null)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={savePrivileges} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Save Privileges</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
