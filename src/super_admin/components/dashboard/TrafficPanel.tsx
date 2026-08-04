"use client";
import { useMemo, useState } from "react";
import { TrendingUp, User, ArrowUpRight } from "lucide-react";
import ChartCard from "@/components/dashboard/ChartCard";
import TrafficLineChart from "@/components/dashboard/TrafficLineChart";
import type { SystemMetrics } from "../../types/index";

type PresetRange = "7d" | "30d" | "6m" | "12m" | "custom";

const PRESETS: { id: PresetRange; label: string; days?: number }[] = [
  { id: "7d", label: "7D", days: 7 },
  { id: "30d", label: "30D", days: 30 },
  { id: "6m", label: "6M", days: 182 },
  { id: "12m", label: "12M", days: 365 },
  { id: "custom", label: "Custom" },
];

// Deterministic pseudo-random (seeded by day index) — same value on server
// and client, so this doesn't cause a hydration mismatch like Math.random() would.
function seeded(n: number) {
  const x = Math.sin(n * 9999) * 10000;
  return x - Math.floor(x);
}

/**
 * TEMPORARY mock generator — there is no page-view/analytics table in the
 * schema yet (see project audit). This produces a realistic-looking 2-year
 * daily series so the range-selector UX is fully buildable and testable now.
 * Once a real `PageView` table exists, swap this for a grouped Prisma query
 * over the same date range and the UI above it needs no changes.
 */
function generateDailyTraffic(totalDays: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: { date: Date; visits: number; uniqueVisitors: number }[] = [];
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? 0.72 : 1;
    const growth = 1 + ((totalDays - i) / totalDays) * 0.35;
    const noise = 0.85 + Math.sin(i * 1.7) * 0.08 + seeded(i) * 0.14;
    const visits = Math.round(8000 * weekendDip * growth * noise);
    const uniqueVisitors = Math.round(visits * (0.58 + seeded(i + 500) * 0.1));
    out.push({ date, visits, uniqueVisitors });
  }
  return out;
}

const MAX_HISTORY_DAYS = 730; // 2 years
const ALL_DAYS = generateDailyTraffic(MAX_HISTORY_DAYS);

const MONTH_FMT = new Intl.DateTimeFormat("en-KE", { month: "short", year: "2-digit" });
const DAY_FMT = new Intl.DateTimeFormat("en-KE", { month: "short", day: "numeric" });

function monthInputValue(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

interface Props {
  shopVisits: SystemMetrics["shopVisits"];
}

export default function TrafficPanel({ shopVisits }: Props) {
  const [showShopVisits, setShowShopVisits] = useState(false);
  const [preset, setPreset] = useState<PresetRange>("7d");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twelveMonthsAgo = new Date(today);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);

  const [customFrom, setCustomFrom] = useState(monthInputValue(twelveMonthsAgo));
  const [customTo, setCustomTo] = useState(monthInputValue(today));

  const rangeDays = useMemo(() => {
    if (preset !== "custom") return PRESETS.find((p) => p.id === preset)!.days!;
    const [fy, fm] = customFrom.split("-").map(Number);
    const [ty, tm] = customTo.split("-").map(Number);
    const from = new Date(fy, fm - 1, 1);
    const to = new Date(ty, tm, 0); // end of "to" month
    return Math.max(1, Math.min(MAX_HISTORY_DAYS, Math.round((to.getTime() - from.getTime()) / 86400000) + 1));
  }, [preset, customFrom, customTo]);

  const rangeRows = useMemo(() => ALL_DAYS.slice(-rangeDays), [rangeDays]);

  const chartData = useMemo(() => {
    if (rangeDays <= 31) {
      return rangeRows.map((r) => ({ label: DAY_FMT.format(r.date), value: r.visits }));
    }
    // Aggregate into monthly buckets for longer ranges, matching the Cashflow chart's pattern.
    const buckets = new Map<string, { label: string; value: number; order: number }>();
    for (const r of rangeRows) {
      const key = `${r.date.getFullYear()}-${r.date.getMonth()}`;
      const existing = buckets.get(key);
      if (existing) existing.value += r.visits;
      else buckets.set(key, { label: MONTH_FMT.format(r.date), value: r.visits, order: r.date.getFullYear() * 12 + r.date.getMonth() });
    }
    return Array.from(buckets.values()).sort((a, b) => a.order - b.order);
  }, [rangeRows, rangeDays]);

  const totalViews = rangeRows.reduce((a, b) => a + b.visits, 0);
  const uniqueVisitors = rangeRows.reduce((a, b) => a + b.uniqueVisitors, 0);

  const rangeLabel = preset === "custom"
    ? `${MONTH_FMT.format(new Date(Number(customFrom.split("-")[0]), Number(customFrom.split("-")[1]) - 1))} – ${MONTH_FMT.format(new Date(Number(customTo.split("-")[0]), Number(customTo.split("-")[1]) - 1))}`
    : PRESETS.find((p) => p.id === preset)!.label;

  return (
    <ChartCard
      title={showShopVisits ? "Per-Shop Visits (All Time)" : `Platform Traffic (${rangeLabel})`}
      action={
        <button
          onClick={() => setShowShopVisits((v) => !v)}
          className="text-org-xs font-org-medium text-org-primary hover:underline flex items-center gap-1 shrink-0"
        >
          {showShopVisits ? "Show Platform Traffic" : <>Per-Shop Visits <ArrowUpRight size={13} /></>}
        </button>
      }
    >
      {!showShopVisits && (
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
              <div className="relative">
                <input
                  type="month"
                  value={customFrom}
                  max={customTo}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="text-org-xs border border-org-border rounded-org-sm pl-2 pr-1 py-1 text-org-text-primary bg-org-surface"
                />
              </div>
              <span className="text-org-xs text-org-text-muted">to</span>
              <div className="relative">
                <input
                  type="month"
                  value={customTo}
                  min={customFrom}
                  max={monthInputValue(today)}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="text-org-xs border border-org-border rounded-org-sm pl-2 pr-1 py-1 text-org-text-primary bg-org-surface"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {showShopVisits ? (
        <div className="flex flex-col gap-2.5">
          {shopVisits.length === 0 ? (
            <p className="text-org-sm text-org-text-muted py-6 text-center">No shop visit data yet.</p>
          ) : (
            shopVisits.map((sv) => {
              const maxVisits = Math.max(shopVisits[0]?.visits ?? 1, 1);
              return (
                <div key={sv.shopId} className="flex items-center gap-3">
                  <div className="w-32 text-org-xs font-org-medium text-org-text-primary shrink-0 truncate">{sv.shopName}</div>
                  <div className="flex-1 h-3 bg-org-primary-light rounded-full overflow-hidden">
                    <div className="h-full bg-org-primary rounded-full" style={{ width: `${(sv.visits / maxVisits) * 100}%` }} />
                  </div>
                  <div className="w-16 text-org-xs text-org-text-secondary text-right shrink-0">{sv.visits.toLocaleString()}</div>
                  <div className="w-20 text-org-xs text-org-success font-org-semibold text-right shrink-0">+{sv.today} today</div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div>
          <TrafficLineChart data={chartData} />
          <div className="flex gap-5 mt-3 text-org-xs text-org-text-secondary">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} /> Total views: <strong className="text-org-text-primary">{totalViews.toLocaleString()}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} /> Unique visitors: <strong className="text-org-text-primary">{uniqueVisitors.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      )}
    </ChartCard>
  );
}
