"use client";
import { useState } from "react";
import { Check, Loader2, User as UserIcon, Palette, Bell, PanelLeft, RotateCcw } from "lucide-react";
import ChartCard from "@/components/dashboard/ChartCard";
import { THEME_PALETTE, getUiPrefs, setUiPrefs, applyThemeToDocument } from "@/lib/uiPrefs";
import { clearPersistedState } from "@/lib/usePersistedState";

// Keys used by usePersistedState across the super_admin modules — see
// SuperAdminPanel.tsx and MarketplaceModule.tsx. Kept in one place so the
// reset button below can't silently miss one.
const DEMO_DATA_KEYS = [
  "sa-shops", "sa-packages", "sa-tickets", "sa-reminders",
  "sa-marketplace-items", "sa-marketplace-inquiries", "sa-system-admins", "sa-dismissed-notifs",
];

interface Props {
  currentName: string;
  currentEmail: string;
  onNameSaved: (name: string) => void;
  addToast: (msg: string, type?: string) => void;
}

export function SettingsModule({ currentName, currentEmail, onNameSaved, addToast }: Props) {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);

  const [prefs, setPrefs] = useState(() => getUiPrefs());

  const saveName = async () => {
    if (!name.trim() || name.trim() === currentName) return;
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), demoEmail: currentEmail }),
      });
      const body = await res.json();
      if (!res.ok) {
        addToast(body.error ?? "Could not save your name.", "error");
        return;
      }
      onNameSaved(body.name);
      addToast("Name updated.", "success");
    } catch {
      addToast("Could not reach the server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const selectTheme = (themeId: string) => {
    const next = setUiPrefs({ themeId });
    setPrefs(next);
    applyThemeToDocument(themeId);
  };

  const toggleSidebarDefault = () => {
    const next = setUiPrefs({ sidebarDefaultExpanded: !prefs.sidebarDefaultExpanded });
    setPrefs(next);
  };

  const toggleNotif = (key: keyof typeof prefs.notifications) => {
    const next = setUiPrefs({ notifications: { ...prefs.notifications, [key]: !prefs.notifications[key] } });
    setPrefs(next);
  };

  const resetDemoData = () => {
    if (!window.confirm("Reset all shops, packages, tickets, reminders, marketplace listings, and admins back to their starting demo data? This can't be undone.")) return;
    DEMO_DATA_KEYS.forEach(clearPersistedState);
    addToast("Demo data reset. Reloading…", "success");
    window.location.reload();
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Settings</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">Manage your profile and how the dashboard looks and behaves for you.</p>
      </div>

      {/* Profile */}
      <ChartCard title="Profile" action={<UserIcon size={16} className="text-org-text-muted" />}>
        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
          <div className="flex-1">
            <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-org-sm border border-org-border rounded-org-sm px-3 py-2 text-org-text-primary bg-org-surface outline-none focus:border-org-primary"
              maxLength={80}
            />
          </div>
          <button
            onClick={saveName}
            disabled={saving || !name.trim() || name.trim() === currentName}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-org-sm bg-org-primary text-white text-org-sm font-org-semibold hover:bg-org-primary-hover disabled:opacity-40 transition-colors shrink-0"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Save
          </button>
        </div>
        <p className="text-org-xs text-org-text-muted mt-2">{currentEmail}</p>
      </ChartCard>

      {/* Appearance */}
      <ChartCard title="Appearance" subtitle="Accent color used across the dashboard" action={<Palette size={16} className="text-org-text-muted" />}>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {THEME_PALETTE.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTheme(t.id)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                style={{ background: t.primary, borderColor: prefs.themeId === t.id ? t.primary : "transparent" }}
              >
                {prefs.themeId === t.id && <Check size={16} className="text-white" />}
              </span>
              <span className="text-org-xs text-org-text-secondary group-hover:text-org-text-primary">{t.label}</span>
            </button>
          ))}
        </div>
        <p className="text-org-xs text-org-text-muted mt-3">Saved to this browser. Layout customization isn&rsquo;t available yet.</p>
      </ChartCard>

      {/* Notifications */}
      <ChartCard title="Notifications" subtitle="Choose what shows up in the bell menu" action={<Bell size={16} className="text-org-text-muted" />}>
        <div className="flex flex-col divide-y divide-org-border">
          {([
            ["expiring", "Subscriptions expiring soon"],
            ["tickets", "Unread support tickets"],
            ["suspended", "Suspended shops"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-org-sm text-org-text-primary">{label}</span>
              <button
                type="button"
                onClick={() => toggleNotif(key)}
                className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${prefs.notifications[key] ? "bg-org-primary" : "bg-org-border"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${prefs.notifications[key] ? "left-4" : "left-0.5"}`} />
              </button>
            </label>
          ))}
        </div>
      </ChartCard>

      {/* Sidebar */}
      <ChartCard title="Sidebar" action={<PanelLeft size={16} className="text-org-text-muted" />}>
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-org-sm text-org-text-primary">Start with sidebar expanded</p>
            <p className="text-org-xs text-org-text-secondary mt-0.5">Applies next time you load the dashboard.</p>
          </div>
          <button
            type="button"
            onClick={toggleSidebarDefault}
            className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${prefs.sidebarDefaultExpanded ? "bg-org-primary" : "bg-org-border"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${prefs.sidebarDefaultExpanded ? "left-4" : "left-0.5"}`} />
          </button>
        </label>
      </ChartCard>

      {/* Demo data */}
      <ChartCard title="Demo Data" subtitle="This platform isn't connected to a live database yet — actions here are saved to this browser only" action={<RotateCcw size={16} className="text-org-text-muted" />}>
        <div className="flex items-center justify-between gap-3">
          <p className="text-org-sm text-org-text-secondary">Undo every change you've made across Shops, Packages, Tickets, Reminders, Marketplace, and Admins.</p>
          <button
            onClick={resetDemoData}
            className="text-org-sm font-org-semibold text-org-danger border border-org-danger/30 hover:bg-org-danger-bg px-4 py-2 rounded-org-sm transition-colors shrink-0"
          >
            Reset to Demo Data
          </button>
        </div>
      </ChartCard>
    </div>
  );
}
