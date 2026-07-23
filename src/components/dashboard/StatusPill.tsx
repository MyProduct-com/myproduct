type Tone = "success" | "danger" | "warning" | "neutral" | "info";

const TONES: Record<Tone, string> = {
  success: "bg-org-success-bg text-org-success",
  danger: "bg-org-danger-bg text-org-danger",
  warning: "bg-org-warning/15 text-org-warning",
  neutral: "bg-org-surface-alt text-org-text-secondary",
  info: "bg-org-accent/15 text-org-accent",
};

const STATUS_TONE: Record<string, Tone> = {
  completed: "success",
  delivered: "success",
  paid: "success",
  active: "success",
  confirmed: "success",
  cancelled: "danger",
  refunded: "danger",
  failed: "danger",
  returned: "danger",
  pending: "warning",
  processing: "warning",
  under_processing: "warning",
  shipped: "info",
  in_transit: "info",
  dispatched: "info",
};

export default function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status.toLowerCase().replace(/\s+/g, "_")] ?? "neutral";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-org-pill text-org-xs font-org-semibold capitalize ${TONES[tone]}`}>
      {status.toLowerCase()}
    </span>
  );
}
