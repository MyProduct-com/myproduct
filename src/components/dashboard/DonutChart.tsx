"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useElementWidth } from "./useElementWidth";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data }: { data: DonutSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const { ref, width } = useElementWidth<HTMLDivElement>();
  const size = Math.max(Math.min(width || 280, 280), 180);

  return (
    <div className="flex w-full flex-col items-center">
      <div
        ref={ref}
        className="flex w-full items-center justify-center"
        style={{ width: "100%", height: 200, minHeight: 200 }}
      >
        {width > 0 && data.length > 0 && (
          <PieChart width={size} height={200}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="90%"
              paddingAngle={2}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.label} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                return (
                  <div className="bg-org-text-primary text-white rounded-xl px-3.5 py-2.5 shadow-lg text-org-xs">
                    {p.name}: {p.value} ({total > 0 ? Math.round((Number(p.value) / total) * 100) : 0}%)
                  </div>
                );
              }}
            />
          </PieChart>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 -mt-2">
        {data.map((d) => (
          <span key={d.label} className="flex items-center gap-1.5 text-org-xs text-org-text-secondary">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
            {d.label} {d.value}
          </span>
        ))}
      </div>
    </div>
  );
}
