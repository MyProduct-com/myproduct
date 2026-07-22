interface SparklineProps {
  data: number[];
  className?: string;
  positive?: boolean;
}

export default function Sparkline({ data, className = "", positive = true }: SparklineProps) {
  if (data.length < 2) return null;

  const W = 100;
  const H = 32;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `0,${H} ${line} ${W},${H}`;
  const color = positive ? "#2E7D4F" : "#D64545";
  const gradId = `spark-grad-${positive ? "up" : "down"}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
