interface RadialGaugeProps {
  /** 0-100 */
  percent: number;
  achieved: string;
  target: string;
  caption?: string;
}

export default function RadialGauge({ percent, achieved, target, caption }: RadialGaugeProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const R = 70;
  const CX = 90;
  const CY = 90;
  // Semi-circle gauge, from 180deg (left) to 0deg (right)
  const startAngle = Math.PI;
  const endAngle = Math.PI - (clamped / 100) * Math.PI;
  const arcPoint = (angle: number) => ({
    x: CX + R * Math.cos(angle),
    y: CY - R * Math.sin(angle) - 10,
  });
  const start = arcPoint(startAngle);
  const end = arcPoint(endAngle);
  const largeArc = clamped > 50 ? 1 : 0;

  const trackStart = arcPoint(Math.PI);
  const trackEnd = arcPoint(0);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 180 100" className="w-full max-w-55">
        <path
          d={`M ${trackStart.x} ${trackStart.y} A ${R} ${R} 0 0 1 ${trackEnd.x} ${trackEnd.y}`}
          fill="none"
          stroke="#E8EFE9"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="#1B3A2B"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <text x="90" y="72" textAnchor="middle" className="fill-org-text-primary" style={{ fontSize: 26, fontWeight: 800 }}>
          {clamped}%
        </text>
        <text x="90" y="90" textAnchor="middle" className="fill-org-text-secondary" style={{ fontSize: 10 }}>
          Progress
        </text>
      </svg>

      <div className="flex items-center gap-5 mt-2 text-org-xs">
        <span className="flex items-center gap-1.5 text-org-text-secondary">
          <span className="w-2 h-2 rounded-full bg-org-primary" /> Achieved <strong className="text-org-text-primary">{achieved}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-org-text-secondary">
          <span className="w-2 h-2 rounded-full bg-org-primary-light" /> Target <strong className="text-org-text-primary">{target}</strong>
        </span>
      </div>
      {caption && <p className="text-org-xs text-org-text-secondary italic text-center mt-2 max-w-50">&ldquo;{caption}&rdquo;</p>}
    </div>
  );
}
