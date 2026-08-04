"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  type TooltipContentProps,
} from "recharts";
import { useElementWidth } from "./useElementWidth";

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

/**
 * Uses a measured pixel width instead of ResponsiveContainer.
 * Recharts 3's ResponsiveContainer often paints nothing (0-size) inside
 * overflow scroll layouts — which is why Platform Traffic looked empty.
 */
export default function TrafficLineChart({
  data,
  formatValue = (n) => `${n.toLocaleString()} visits`,
  formatAxis = (n) => n.toLocaleString(),
}: Props) {
  const Tip = makeTooltip(formatValue);
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const chartWidth = Math.max(width, 1);

  return (
    <div ref={ref} className="w-full" style={{ width: "100%", height: 220, minHeight: 220 }}>
      {width > 0 && (
        <AreaChart
          width={chartWidth}
          height={220}
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
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
      )}
    </div>
  );
}
