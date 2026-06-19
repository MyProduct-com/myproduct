import React, { useState, useRef, useEffect } from "react";
import { SA_THEME as T } from "../../data/theme";

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 700,
      padding: "3px 9px", borderRadius: 999, letterSpacing: "0.03em",
      whiteSpace: "nowrap", textTransform: "capitalize",
    }}>{label.replace("_", " ")}</span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: T.surface, border: `1px solid ${T.border}`,
      borderRadius: T.radiusCard, padding: 20, ...style,
    }}>{children}</div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: color ?? T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: T.textMuted }}>{sub}</div>}
    </Card>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "danger" | "ghost" | "accent" | "success" | "warning";
  size?: "sm" | "md";
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: "button" | "submit";
}
export function Btn({ children, onClick, variant = "primary", size = "md", disabled, style, type = "button" }: BtnProps) {
  const palettes = {
    primary: { bg: T.primary, color: "#fff", border: T.primary },
    danger:  { bg: T.danger, color: "#fff", border: T.danger },
    ghost:   { bg: "transparent", color: T.text, border: T.border },
    accent:  { bg: T.accent, color: "#fff", border: T.accent },
    success: { bg: T.success, color: "#fff", border: T.success },
    warning: { bg: T.warning, color: "#fff", border: T.warning },
  };
  const p = palettes[variant];
  const pad = size === "sm" ? "6px 12px" : "9px 18px";
  const fs = size === "sm" ? 12 : 13;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? T.border : p.bg,
        color: disabled ? T.textMuted : p.color,
        border: `1.5px solid ${disabled ? T.border : p.border}`,
        padding: pad, borderRadius: T.radius, fontWeight: 700, fontSize: fs,
        cursor: disabled ? "not-allowed" : "pointer", transition: "opacity .15s",
        fontFamily: T.fontFamily, display: "inline-flex", alignItems: "center", gap: 6,
        ...style,
      }}
      onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
    >{children}</button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  textarea?: boolean;
  rows?: number;
}
export function Input({ label, value, onChange, placeholder, type = "text", disabled, style, textarea, rows = 3 }: InputProps) {
  const base: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: T.radius,
    border: `1.5px solid ${T.border}`, fontSize: 14, color: T.text,
    background: disabled ? T.bg : T.surface, outline: "none",
    fontFamily: T.fontFamily, boxSizing: "border-box",
  };
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} rows={rows} style={{ ...base, resize: "vertical" }} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} disabled={disabled} style={base} />
      }
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, value, onChange, options, style }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; style?: React.CSSProperties;
}) {
  return (
    <div style={{ marginBottom: 14, ...style }}>
      {label && <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "9px 12px", borderRadius: T.radius,
        border: `1.5px solid ${T.border}`, fontSize: 14, color: T.text,
        background: T.surface, outline: "none", fontFamily: T.fontFamily,
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
interface Col<T> { key: string; header: string; render: (row: T) => React.ReactNode; width?: string }
interface TableProps<T> { columns: Col<T>[]; data: T[]; onRowClick?: (row: T) => void; emptyMessage?: string }
export function Table<T>({ columns, data, onRowClick, emptyMessage }: TableProps<T>) {
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${T.border}`, borderRadius: T.radiusCard }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: T.bg }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: T.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: `1px solid ${T.border}`, width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} style={{ padding: "40px 20px", textAlign: "center", color: T.textMuted }}>{emptyMessage ?? "No data found."}</td></tr>
            : data.map((row, i) => (
              <tr key={i} onClick={() => onRowClick?.(row)}
                style={{ borderBottom: `1px solid ${T.border}`, cursor: onRowClick ? "pointer" : undefined, transition: "background .12s" }}
                onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = T.bg; }}
                onMouseLeave={e => { e.currentTarget.style.background = ""; }}
              >
                {columns.map(col => (
                  <td key={col.key} style={{ padding: "12px 14px", color: T.text }}>{col.render(row)}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, width = 560 }: {
  title: string; onClose: () => void; children: React.ReactNode; width?: number;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: T.surface, borderRadius: T.radiusCard, width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: T.textMuted, lineHeight: 1 }}>✕</button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onSelect }: {
  tabs: { id: string; label: string; badge?: number }[];
  active: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20, gap: 2 }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onSelect(tab.id)} style={{
          padding: "10px 18px", border: "none", background: "none", cursor: "pointer",
          fontWeight: active === tab.id ? 700 : 500, fontSize: 13,
          color: active === tab.id ? T.primary : T.textMuted,
          borderBottom: active === tab.id ? `2.5px solid ${T.primary}` : "2.5px solid transparent",
          transition: "all .15s", display: "flex", alignItems: "center", gap: 6, fontFamily: T.fontFamily,
        }}>
          {tab.label}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span style={{ background: T.danger, color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999 }}>{tab.badge}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: T.textMuted }}>🔍</span>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? "Search…"}
        style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: T.radius, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.text, background: T.surface, outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: T.text }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: T.textMuted }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function ToastContainer({ toasts, onDismiss }: { toasts: { id: string; message: string; type: string }[]; onDismiss: (id: string) => void }) {
  const colors: Record<string, { bg: string; color: string }> = {
    success: { bg: T.success, color: "#fff" },
    error:   { bg: T.danger, color: "#fff" },
    info:    { bg: T.primary, color: "#fff" },
    warning: { bg: T.warning, color: "#fff" },
  };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => {
        const c = colors[t.type] ?? colors.info;
        return (
          <div key={t.id} style={{ background: c.bg, color: c.color, padding: "12px 18px", borderRadius: T.radiusCard, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,.18)", display: "flex", alignItems: "center", gap: 12, minWidth: 260, maxWidth: 380 }}>
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => onDismiss(t.id)} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontSize: 16, opacity: .7 }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
export function MiniBarChart({ data, color }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 56 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div title={String(d.value)} style={{ width: "100%", height: Math.max(4, (d.value / max) * 48), background: color ?? T.primary, borderRadius: "3px 3px 0 0", transition: "height .3s" }} />
          <div style={{ fontSize: 9, color: T.textMuted, textAlign: "center" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ title, message, onConfirm, onCancel, danger }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; danger?: boolean;
}) {
  return (
    <Modal title={title} onClose={onCancel} width={420}>
      <p style={{ margin: "0 0 20px", color: T.text, lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant={danger ? "danger" : "primary"} onClick={onConfirm}>Confirm</Btn>
      </div>
    </Modal>
  );
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 40, height: 22, borderRadius: 11, background: checked ? T.primary : T.border,
        position: "relative", transition: "background .2s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: "50%", background: "#fff",
          transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)",
        }} />
      </div>
      {label && <span style={{ fontSize: 13, color: T.text }}>{label}</span>}
    </label>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────
export function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none", fontSize: 13, color: T.text }}>
      <div onClick={() => onChange(!checked)} style={{
        width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked ? T.primary : T.border}`,
        background: checked ? T.primary : T.surface, display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .15s", flexShrink: 0,
      }}>
        {checked && <span style={{ color: "#fff", fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </div>
      {label}
    </label>
  );
}
