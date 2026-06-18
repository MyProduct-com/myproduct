import type { Toast } from "../../types/index";

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  const bgMap: Record<string, string> = {
    success: "#16a34a",
    error: "#ef4444",
    info: "#3b82f6",
  };
  const iconMap: Record<string, string> = {
    success: "✓", error: "✕", info: "ℹ",
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: bgMap[t.type] ?? "#334155",
          color: "#fff", padding: "12px 16px", borderRadius: 10,
          display: "flex", alignItems: "center", gap: 12, minWidth: 280,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)", fontSize: 14, fontWeight: 500,
          animation: "slideIn 0.2s ease",
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 900, flexShrink: 0,
          }}>
            {iconMap[t.type]}
          </span>
          <span style={{ flex: 1 }}>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none",
              color: "#fff", width: 22, height: 22, borderRadius: "50%",
              cursor: "pointer", fontSize: 14, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
