import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, action, children, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-org-surface rounded-org-card shadow-org-card p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-org-base font-org-semibold text-org-text-primary">{title}</h3>
          {subtitle && <p className="text-org-xs text-org-text-secondary mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
