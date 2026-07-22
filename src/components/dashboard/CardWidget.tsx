"use client";
import { useState } from "react";

export interface CardWidgetData {
  network: string;
  last4: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  balance: number;
  creditLimit: number;
}

export default function CardWidget({ card, formatMoney }: { card: CardWidgetData; formatMoney: (n: number) => string }) {
  const [enabled, setEnabled] = useState(true);
  const usedPct = card.creditLimit > 0 ? Math.min(100, Math.round((card.balance / card.creditLimit) * 100)) : 0;

  return (
    <div>
      <div
        className="rounded-org-card p-5 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B3A2B 0%, #142B20 100%)" }}
      >
        <div className="flex items-start justify-between mb-8">
          <span className="text-org-sm font-org-semibold tracking-wide">{card.network}</span>
          <span className="text-org-sm font-org-semibold italic opacity-90">amazon</span>
        </div>

        <div className="w-9 h-7 rounded-md bg-white/25 mb-4" />

        <p className="text-org-md font-org-semibold tracking-[0.15em] mb-4">
          &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {card.last4}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-org-xs opacity-70">{card.holderName || "Card holder"}</p>
            <p className="text-org-sm font-org-medium">
              {String(card.expiryMonth).padStart(2, "0")}/{String(card.expiryYear).padStart(2, "0")}
            </p>
          </div>
          <button
            onClick={() => setEnabled((v) => !v)}
            className={`w-9 h-5 rounded-full relative transition-colors ${enabled ? "bg-white/80" : "bg-white/25"}`}
            aria-label="Toggle card"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-org-primary transition-all ${enabled ? "left-4" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-org-xs text-org-text-secondary mb-1">Total Balance</p>
        <p className="text-org-xl font-org-bold text-org-text-primary mb-3">{formatMoney(card.balance)}</p>
        <div className="h-2 rounded-full bg-org-primary-light overflow-hidden flex">
          <div className="h-full bg-org-primary" style={{ width: `${usedPct}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-2 text-org-xs text-org-text-secondary">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-org-primary" /> Used {usedPct}%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-org-primary-light" /> Remaining {100 - usedPct}%</span>
        </div>
      </div>
    </div>
  );
}
