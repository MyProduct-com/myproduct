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

// Constrained, org-token palette — success/warning/danger/neutral, plus a
// brand-green "info" tone instead of the old ad-hoc blue/violet/orange mix.
const SUCCESS = { bg: "#E5F3EA", text: "#2E7D4F" };
const WARNING = { bg: "#FAF0E1", text: "#C98A2C" };
const DANGER  = { bg: "#FBEAEA", text: "#D64545" };
const INFO    = { bg: "#E8EFE9", text: "#1B3A2B" };
const NEUTRAL = { bg: "#FAFBF9", text: "#6B716C" };

export const statusColor = (status: string): { bg: string; text: string } => {
  const map: Record<string, { bg: string; text: string }> = {
    active:       SUCCESS,
    suspended:    WARNING,
    pulled_down:  DANGER,
    trial:        INFO,
    expired:      NEUTRAL,
    open:         WARNING,
    in_progress:  INFO,
    resolved:     SUCCESS,
    closed:       NEUTRAL,
    sent:         SUCCESS,
    draft:        NEUTRAL,
    scheduled:    INFO,
    full:         SUCCESS,
    partial:      WARNING,
    urgent:       DANGER,
    high:         WARNING,
    medium:       NEUTRAL,
    low:          NEUTRAL,
  };
  return map[status] ?? NEUTRAL;
};
