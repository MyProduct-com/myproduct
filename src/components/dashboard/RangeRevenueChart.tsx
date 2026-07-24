"use client";
import { useEffect, useMemo, useState } from "react";
import { TrendingUp, Receipt } from "lucide-react";
import ChartCard from "./ChartCard";
import TrafficLineChart from "./TrafficLineChart";

export type PresetRange = "7d" | "30d" | "6m" | "12m" | "custom";

const PRESETS: { id: PresetRange; label: string; days?: number }[] = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "6m", label: "6M", days: 182 },
  { id: "12m", label: "12M", days: 365 },
  { id: "custom", label: "Custom" },
];

const MONTH_FMT = new Intl.DateTimeFormat("en-KE", { month: "short", year: "2-digit" });
const DAY_FMT = new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric" });

function monthInputValue(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export interface DailyRevenuePoint {
  date: Date | string;
  revenue: number;
}

interface Props {
  title?: string;
  data: DailyRevenuePoint[];
  /** Currency prefix only — kept a plain string (not a formatter function)
   * since this is a Client Component and can't accept functions as props
   * from a Server Component caller. */
  currency?: string;
  /** Preset the range selector starts on. Uncontrolled after that — only used as the initial value. */
  defaultPreset?: PresetRange;
  /** Reports the effective window back to the parent (e.g. so KPI cards above the chart can match it). */
  onRangeChange?: (range: { days: number; label: string }) => void;
}

export default function RangeRevenueChart({ title = "Revenue Overview", data, currency = "KES", defaultPreset = "30d", onRangeChange }: Props) {
  const formatMoney = (n: number) => `${currency} ${n.toLocaleString()}`;
  const rows = useMemo(
    () => data.map((r) => ({ date: typeof r.date === "string" ? new Date(r.date) : r.date, revenue: r.revenue })),
    [data]
  );
  const maxDays = rows.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const [preset, setPreset] = useState<PresetRange>(defaultPreset);
  const [customFrom, setCustomFrom] = useState(monthInputValue(twelveMonthsAgo));
  const [customTo, setCustomTo] = useState(monthInputValue(today));

  const rangeDays = useMemo(() => {
    if (preset !== "custom") return Math.min(maxDays, PRESETS.find((p) => p.id === preset)!.days!);
    const [fy, fm] = customFrom.split("-").map(Number);
    const [ty, tm] = customTo.split("-").map(Number);
    const from = new Date(fy, fm - 1, 1);
    const to = new Date(ty, tm, 0);
    return Math.max(1, Math.min(maxDays, Math.round((to.getTime() - from.getTime()) / 86400000) + 1));
  }, [preset, customFrom, customTo, maxDays]);

  const rangeRows = useMemo(() => rows.slice(-rangeDays), [rows, rangeDays]);

  const chartData = useMemo(() => {
    if (rangeDays <= 31) {
      return rangeRows.map((r) => ({ label: DAY_FMT.format(r.date), value: r.revenue }));
    }
    const buckets = new Map<string, { label: string; value: number; order: number }>();
    for (const r of rangeRows) {
      const key = `${r.date.getFullYear()}-${r.date.getMonth()}`;
      const existing = buckets.get(key);
      if (existing) existing.value += r.revenue;
      else buckets.set(key, { label: MONTH_FMT.format(r.date), value: r.revenue, order: r.date.getFullYear() * 12 + r.date.getMonth() });
    }
    return Array.from(buckets.values()).sort((a, b) => a.order - b.order);
  }, [rangeRows, rangeDays]);

  const totalRevenue = rangeRows.reduce((a, b) => a + b.revenue, 0);
  const orderDays = rangeRows.filter((r) => r.revenue > 0).length;

  const rangeLabel = preset === "custom"
    ? `${MONTH_FMT.format(new Date(Number(customFrom.split("-")[0]), Number(customFrom.split("-")[1]) - 1))} – ${MONTH_FMT.format(new Date(Number(customTo.split("-")[0]), Number(customTo.split("-")[1]) - 1))}`
    : PRESETS.find((p) => p.id === preset)!.label;

  useEffect(() => {
    onRangeChange?.({ days: rangeDays, label: rangeLabel });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays, rangeLabel]);

  return (
    <ChartCard title={`${title} (${rangeLabel})`}>
      <div className="flex flex-wrap items-center gap-1.5 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id)}
            className={`px-3 py-1.5 rounded-org-pill text-org-xs font-org-medium transition-colors ${
              preset === p.id ? "bg-org-primary text-white" : "bg-org-surface-alt text-org-text-secondary hover:text-org-text-primary"
            }`}
          >
            {p.label}
          </button>
        ))}
        {preset === "custom" && (
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="month"
              value={customFrom}
              max={customTo}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="text-org-xs border border-org-border rounded-org-sm pl-2 pr-1 py-1 text-org-text-primary bg-org-surface"
            />
            <span className="text-org-xs text-org-text-muted">to</span>
            <input
              type="month"
              value={customTo}
              min={customFrom}
              max={monthInputValue(today)}
              onChange={(e) => setCustomTo(e.target.value)}
              className="text-org-xs border border-org-border rounded-org-sm pl-2 pr-1 py-1 text-org-text-primary bg-org-surface"
            />
          </div>
        )}
      </div>

      <TrafficLineChart
        data={chartData}
        formatValue={(n) => formatMoney(n)}
        formatAxis={(n) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k` : String(n))}
      />

      <div className="flex gap-5 mt-3 text-org-xs text-org-text-secondary">
        <span className="flex items-center gap-1.5">
          <TrendingUp size={14} /> Total revenue: <strong className="text-org-text-primary">{formatMoney(totalRevenue)}</strong>
        </span>
        <span className="flex items-center gap-1.5">
          <Receipt size={14} /> Days with sales: <strong className="text-org-text-primary">{orderDays}</strong>
        </span>
      </div>
    </ChartCard>
  );
}
