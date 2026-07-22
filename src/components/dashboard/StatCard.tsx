"use client";
import { useState, type ReactNode } from "react";
import { IconDots, IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";
import Sparkline from "./Sparkline";

interface StatCardProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBg?: string;
  /** % change vs. the prior period. Positive renders green with an up-arrow, negative red with a down-arrow. */
  changePct?: number;
  /** Chronological series for the mini sparkline, e.g. last 7-14 days of this metric. */
  sparkline?: number[];
  menu?: { label: string; onClick: () => void }[];
}

export default function StatCard({ label, value, icon, iconBg = "bg-org-primary-light text-org-primary", changePct, sparkline, menu }: StatCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const positive = (changePct ?? 0) >= 0;

  return (
    <div className="relative bg-org-surface rounded-org-card shadow-org-card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        {menu && menu.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-org-text-secondary hover:bg-org-surface-alt transition-colors"
              aria-label="More options"
            >
              <IconDots size={15} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-7 z-20 w-40 bg-org-surface rounded-xl shadow-lg border border-org-border py-1">
                  {menu.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => { m.onClick(); setMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-org-xs text-org-text-primary hover:bg-org-surface-alt transition-colors"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-org-xs text-org-text-secondary font-org-medium mb-1">{label}</p>

      <div className="flex items-end justify-between gap-2">
        <p className="text-org-xl font-org-bold text-org-text-primary leading-none">{value}</p>
        {sparkline && sparkline.length > 1 && (
          <Sparkline data={sparkline} className="h-8 w-16 shrink-0" positive={positive} />
        )}
      </div>

      {typeof changePct === "number" && (
        <div className={`mt-2 inline-flex items-center gap-0.5 text-org-xs font-org-semibold ${positive ? "text-org-success" : "text-org-danger"}`}>
          {positive ? <IconArrowUpRight size={12} /> : <IconArrowDownRight size={12} />}
          {Math.abs(changePct).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-org-surface rounded-org-card shadow-org-card p-4 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-org-surface-alt mb-3" />
      <div className="h-3 w-20 bg-org-surface-alt rounded mb-2" />
      <div className="h-6 w-24 bg-org-surface-alt rounded" />
    </div>
  );
}
