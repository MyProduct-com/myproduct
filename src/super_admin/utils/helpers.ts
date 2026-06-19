export const fmt = (n: number): string =>
  "KSh " + n.toLocaleString("en-KE", { minimumFractionDigits: 0 });

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

export const fmtDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-KE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const genId = (prefix = "id"): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const daysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const statusColor = (status: string): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    active:       { bg: "#dcfce7", text: "#166534" },
    suspended:    { bg: "#fef9c3", text: "#854d0e" },
    pulled_down:  { bg: "#fee2e2", text: "#991b1b" },
    trial:        { bg: "#dbeafe", text: "#1e40af" },
    expired:      { bg: "#f1f5f9", text: "#475569" },
    open:         { bg: "#fef9c3", text: "#854d0e" },
    in_progress:  { bg: "#dbeafe", text: "#1e40af" },
    resolved:     { bg: "#dcfce7", text: "#166534" },
    closed:       { bg: "#f1f5f9", text: "#475569" },
    sent:         { bg: "#dcfce7", text: "#166534" },
    draft:        { bg: "#f1f5f9", text: "#475569" },
    scheduled:    { bg: "#ede9fe", text: "#5b21b6" },
    full:         { bg: "#ede9fe", text: "#5b21b6" },
    partial:      { bg: "#dbeafe", text: "#1e40af" },
    urgent:       { bg: "#fee2e2", text: "#991b1b" },
    high:         { bg: "#ffedd5", text: "#9a3412" },
    medium:       { bg: "#fef9c3", text: "#854d0e" },
    low:          { bg: "#f1f5f9", text: "#475569" },
  };
  return map[status] ?? { bg: "#f1f5f9", text: "#475569" };
};
