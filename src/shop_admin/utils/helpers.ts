export const fmt = (n: number): string =>
  "KSh " + n.toLocaleString("en-KE", { minimumFractionDigits: 0 });

export const fmtDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-KE", { day: "2-digit", month: "short", year: "numeric" });

export const fmtDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-KE", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export const genId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const daysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const statusColor = (status: string): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    "Pending":           { bg: "#fef9c3", text: "#854d0e" },
    "Under Processing":  { bg: "#ffedd5", text: "#9a3412" },
    "Dispatched":        { bg: "#dbeafe", text: "#1e40af" },
    "In Transit":        { bg: "#e0e7ff", text: "#3730a3" },
    "Delivered":         { bg: "#dcfce7", text: "#166534" },
    "Cancelled":         { bg: "#fee2e2", text: "#991b1b" },
    "Returned":          { bg: "#fce7f3", text: "#9d174d" },
    "Paid":              { bg: "#dcfce7", text: "#166534" },
    "Refunded":          { bg: "#f3e8ff", text: "#6b21a8" },
    "Failed":            { bg: "#fee2e2", text: "#991b1b" },
    "active":            { bg: "#dcfce7", text: "#166534" },
    "expired":           { bg: "#fee2e2", text: "#991b1b" },
    "trial":             { bg: "#fef9c3", text: "#854d0e" },
  };
  return map[status] ?? { bg: "#f1f5f9", text: "#475569" };
};

export const payMethodLabel = (method: string): string => {
  const map: Record<string, string> = {
    mpesa: "M-Pesa", card: "Card", cod: "Cash on Delivery", bank: "Bank Transfer",
  };
  return map[method] ?? method;
};
