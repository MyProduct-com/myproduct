"use client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  type TooltipContentProps,
} from "recharts";

export interface CashflowPoint {
  label: string; // e.g. "Jan"
  income: number;
  expense: number;
}

function CashflowTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-org-text-primary text-white rounded-xl px-3.5 py-2.5 shadow-lg text-org-xs min-w-30">
      <p className="font-org-semibold mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey as string} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-white/70">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.dataKey === "income" ? "Income" : "Expense"}
          </span>
          <span className="font-org-semibold">KES {Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function CashflowChart({ data }: { data: CashflowPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4} barCategoryGap="20%">
        <CartesianGrid vertical={false} stroke="#E4E8E2" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6B716C" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6B716C" }} width={36} tickFormatter={(v) => `${v / 1000}k`} />
        <Tooltip content={(props) => <CashflowTooltip {...(props as TooltipContentProps<number, string>)} />} cursor={{ fill: "#F4F6F2" }} />
        <Bar dataKey="income" fill="#1B3A2B" radius={[4, 4, 0, 0]} maxBarSize={14} />
        <Bar dataKey="expense" fill="#6B8F71" radius={[4, 4, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}
