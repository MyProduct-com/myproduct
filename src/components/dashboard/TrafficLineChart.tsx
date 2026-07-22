"use client";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  type TooltipContentProps,
} from "recharts";

export interface LineChartPoint {
  label: string;
  value: number;
}

interface Props {
  data: LineChartPoint[];
  formatValue?: (n: number) => string;
  formatAxis?: (n: number) => string;
}

function makeTooltip(formatValue: (n: number) => string) {
  return function LineChartTooltip({ active, payload, label }: TooltipContentProps<number, string>) {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-org-text-primary text-white rounded-xl px-3.5 py-2.5 shadow-lg text-org-xs min-w-25">
        <p className="font-org-semibold mb-1">{label}</p>
        <p>{formatValue(Number(payload[0].value))}</p>
      </div>
    );
  };
}

export default function TrafficLineChart({
  data,
  formatValue = (n) => `${n.toLocaleString()} visits`,
  formatAxis = (n) => n.toLocaleString(),
}: Props) {
  const Tip = makeTooltip(formatValue);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B3A2B" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#1B3A2B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#E4E8E2" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6B716C" }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#6B716C" }} width={44} tickFormatter={formatAxis} />
        <Tooltip content={(props) => <Tip {...(props as TooltipContentProps<number, string>)} />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#1B3A2B"
          strokeWidth={2.5}
          fill="url(#trafficFill)"
          dot={{ r: 4, fill: "#1B3A2B", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
