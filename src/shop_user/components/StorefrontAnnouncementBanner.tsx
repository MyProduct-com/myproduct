"use client";

import { X, Megaphone } from "lucide-react";
import { useNotifications } from "@/lib/notifications/useNotifications";

interface Props {
  shopId: string;
  /** When true, banner uses shop theme primary via CSS variables / inline. */
  primaryColor?: string;
}

/**
 * Shows the latest shop announcement from Shop Admin on the storefront.
 * Customers can dismiss it for this browser session (persisted per shop).
 */
export default function StorefrontAnnouncementBanner({ shopId, primaryColor = "#16a34a" }: Props) {
  const { notifications, dismiss } = useNotifications(shopId, "shop_customers");
  const latest = notifications[0];

  if (!latest) return null;

  return (
    <div
      className="w-full text-white"
      style={{ background: primaryColor }}
      role="status"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-start gap-3">
        <Megaphone size={16} className="shrink-0 mt-0.5 opacity-90" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{latest.title}</p>
          <p className="text-xs opacity-90 mt-0.5 whitespace-pre-wrap">{latest.message}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => dismiss(latest.id)}
          className="shrink-0 p-1 rounded hover:bg-white/15 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
