import { type ReactNode } from "react";
import type { Theme } from "../../types/index";
import { statusColor } from "../../utils/helpers";

interface CardProps {
  children: ReactNode;
  theme: Theme;
  style?: React.CSSProperties;
  onClick?: () => void;
}
export function Card({ children, theme, style, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: theme.radiusCard, padding: 20,
        cursor: onClick ? "pointer" : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  color: string;
  theme: Theme;
}
export function StatCard({ label, value, sub, icon, color, theme }: StatCardProps) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderRadius: theme.radiusCard, padding: "18px 20px",
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: color + "18",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: theme.black, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

interface BadgeProps { status: string; }
export function Badge({ status }: BadgeProps) {
  const c = statusColor(status);
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

interface BtnProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  theme: Theme;
  disabled?: boolean;
  small?: boolean;
  style?: React.CSSProperties;
}
export function Btn({ children, onClick, variant = "primary", theme, disabled, small, style }: BtnProps) {
  const styles: Record<string, React.CSSProperties> = {
    primary:   { background: theme.primary, color: "#fff", border: "none" },
    secondary: { background: theme.surface, color: theme.text, border: `1.5px solid ${theme.border}` },
    danger:    { background: theme.danger,  color: "#fff", border: "none" },
    ghost:     { background: "transparent", color: theme.primary, border: `1.5px solid ${theme.primary}` },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: small ? "6px 12px" : "9px 18px",
        borderRadius: theme.radius, cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 700, fontSize: small ? 12 : 13,
        opacity: disabled ? 0.5 : 1, transition: "opacity 0.15s",
        display: "inline-flex", alignItems: "center", gap: 6,
        ...styles[variant], ...style,
      }}
    >
      {children}
    </button>
  );
}

interface ModalProps {
  title: string;
  onClose: () => void;
  theme: Theme;
  children: ReactNode;
  width?: number;
}
export function Modal({ title, onClose, theme, children, width = 520 }: ModalProps) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background: theme.surface, borderRadius: theme.radiusCard,
        width: "100%", maxWidth: width, maxHeight: "90vh",
        overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
      }}>
        <div style={{
          padding: "18px 24px", borderBottom: `1px solid ${theme.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 17, color: theme.black }}>{title}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 22,
            cursor: "pointer", color: theme.textMuted, lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ overflowY: "auto", padding: 24, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

interface InputProps {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  theme: Theme;
  placeholder?: string;
  required?: boolean;
}
export function Input({ label, value, onChange, type = "text", theme, placeholder, required }: InputProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: theme.danger }}> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: theme.radius,
          border: `1.5px solid ${theme.border}`, fontSize: 14, color: theme.text,
          background: theme.bg, boxSizing: "border-box", outline: "none",
        }}
      />
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  theme: Theme;
}
export function SectionHeader({ title, subtitle, action, theme }: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: theme.black }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.textMuted }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

interface Column<T> {
  header: string;
  key: string;
  render: (row: T) => ReactNode;
  width?: string;
}
interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  theme: Theme;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}
export function Table<T>({ columns, data, theme, onRowClick, emptyMessage }: TableProps<T>) {
  return (
    <div style={{ overflowX: "auto", border: `1px solid ${theme.border}`, borderRadius: theme.radiusCard }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: theme.bg }}>
            {columns.map(col => (
              <th key={col.key} style={{
                padding: "10px 14px", textAlign: "left", fontWeight: 700,
                color: theme.textMuted, fontSize: 11, textTransform: "uppercase",
                letterSpacing: "0.05em", borderBottom: `1px solid ${theme.border}`,
                width: col.width,
              }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "40px 20px", textAlign: "center", color: theme.textMuted }}>
                {emptyMessage ?? "No data found."}
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: `1px solid ${theme.border}`, cursor: onRowClick ? "pointer" : undefined,
                transition: "background 0.12s",
              }}
              onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = theme.bg; }}
              onMouseLeave={e => { e.currentTarget.style.background = ""; }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: "12px 14px", color: theme.text }}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  theme: Theme;
}
export function Select({ label, value, onChange, options, theme }: SelectProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: theme.radius,
          border: `1.5px solid ${theme.border}`, fontSize: 14, color: theme.text,
          background: theme.bg, outline: "none",
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
