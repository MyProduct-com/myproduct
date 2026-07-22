import { format } from "date-fns";
import { CreditCard } from "lucide-react";

export interface UpcomingPayment {
  id: string;
  merchant: string;
  brandIcon?: string | null;
  amount: number;
  dueDate: Date | string;
}

export default function UpcomingPayments({ payments, formatMoney }: { payments: UpcomingPayment[]; formatMoney: (n: number) => string }) {
  if (payments.length === 0) {
    return <p className="text-org-sm text-org-text-secondary text-center py-6">No upcoming payments.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {payments.map((p) => {
        const due = typeof p.dueDate === "string" ? new Date(p.dueDate) : p.dueDate;
        return (
          <div key={p.id} className="flex items-center gap-2.5 p-3 rounded-org-sm bg-org-surface-alt">
            <div className="w-8 h-8 rounded-lg bg-org-primary-light text-org-primary flex items-center justify-center shrink-0">
              <CreditCard size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-org-xs font-org-medium text-org-text-primary truncate">{p.merchant}</p>
              <p className="text-org-xs text-org-text-secondary">{format(due, "MMM d, yyyy")}</p>
              <p className="text-org-sm font-org-semibold text-org-text-primary">{formatMoney(p.amount)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
