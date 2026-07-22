import Link from "next/link";
import { format } from "date-fns";
import {
  ShoppingBag, Utensils, Receipt, Wallet, TrendingUp, Banknote, Undo2,
  Percent, Package, Users, Server, Megaphone, Coins, ArrowDownLeft, ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import StatusPill from "./StatusPill";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  shopping: ShoppingBag,
  "food & dining": Utensils,
  bills: Receipt,
  refund: Undo2,
  cashback: Coins,
  sales: TrendingUp,
  "shop sales": TrendingUp,
  "pos sales": TrendingUp,
  payout: Banknote,
  "seller payouts": Banknote,
  "platform fee": Percent,
  "platform fees": Percent,
  commission: Percent,
  "marketplace commission": Percent,
  restock: Package,
  "staff wages": Users,
  "subscription fee": Server,
  "shop subscriptions": Server,
  infrastructure: Server,
  "support costs": Users,
  "ad spend": Megaphone,
};

function iconFor(category: string, type: "INCOME" | "EXPENSE"): LucideIcon {
  return CATEGORY_ICONS[category.toLowerCase()] ?? (type === "INCOME" ? ArrowDownLeft : ArrowUpRight);
}

export interface TransactionRow {
  id: string;
  category: string;
  counterparty: string;
  account: string;
  occurredAt: Date | string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  status: string;
}

interface TransactionsTableProps {
  rows: TransactionRow[];
  formatMoney: (n: number) => string;
  page?: number;
  pageCount?: number;
  basePath?: string;
}

export default function TransactionsTable({ rows, formatMoney, page = 1, pageCount = 1, basePath }: TransactionsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-org-sm text-org-text-secondary">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-org-sm min-w-150">
          <thead>
            <tr className="text-org-xs text-org-text-muted uppercase tracking-wide border-b border-org-border">
              <th className="px-5 pb-2.5 text-left font-org-medium">Icon</th>
              <th className="px-2 pb-2.5 text-left font-org-medium">Transaction Name &amp; Category</th>
              <th className="px-2 pb-2.5 text-left font-org-medium">Account</th>
              <th className="px-2 pb-2.5 text-left font-org-medium">Date &amp; Time</th>
              <th className="px-2 pb-2.5 text-right font-org-medium">Amount</th>
              <th className="px-5 pb-2.5 text-right font-org-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const Icon = iconFor(r.category, r.type);
              const date = typeof r.occurredAt === "string" ? new Date(r.occurredAt) : r.occurredAt;
              const isCancelled = r.status.toLowerCase() === "cancelled";
              return (
                <tr key={r.id} className="border-b border-org-border last:border-0 hover:bg-org-surface-alt transition-colors">
                  <td className="px-5 py-3">
                    <div className="w-8 h-8 rounded-lg bg-org-primary-light text-org-primary flex items-center justify-center">
                      <Icon size={15} />
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <p className="font-org-medium text-org-text-primary">{r.counterparty}</p>
                    <p className="text-org-xs text-org-text-secondary">{r.category}</p>
                  </td>
                  <td className="px-2 py-3 text-org-text-secondary">{r.account}</td>
                  <td className="px-2 py-3">
                    <p className="text-org-text-primary">{format(date, "MMM d, yyyy")}</p>
                    <p className="text-org-xs text-org-text-secondary">{format(date, "HH:mm")}</p>
                  </td>
                  <td className={`px-2 py-3 text-right font-org-semibold ${isCancelled ? "text-org-danger" : "text-org-text-primary"}`}>
                    {r.type === "EXPENSE" ? "-" : "+"}{formatMoney(r.amount)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusPill status={r.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {basePath && pageCount > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4 text-org-xs">
          <Link
            href={`${basePath}${Math.max(1, page - 1)}`}
            className={`px-3 py-1.5 rounded-org-sm border border-org-border ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-org-surface-alt"}`}
          >
            Prev
          </Link>
          <span className="text-org-text-secondary">Page {page} of {pageCount}</span>
          <Link
            href={`${basePath}${Math.min(pageCount, page + 1)}`}
            className={`px-3 py-1.5 rounded-org-sm border border-org-border ${page >= pageCount ? "pointer-events-none opacity-40" : "hover:bg-org-surface-alt"}`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}
