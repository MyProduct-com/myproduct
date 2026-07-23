import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { DollarSign, CreditCard, ShoppingCart, Undo2, User, TrendingUp, TrendingDown, Search } from "lucide-react";
import type { AccountingEntry, TransactionType } from "../../types/index";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import RangeRevenueChart from "@/components/dashboard/RangeRevenueChart";
import { generateDemoDailyRevenue } from "@/lib/demoTimeSeries";
import { fmt, fmtDate, genId } from "../../utils/helpers";

interface AccountingViewProps {
  entries: AccountingEntry[];
  currentUserId: string;
  onEntries: (e: AccountingEntry[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const TYPE_OPTS: { value: TransactionType; label: string }[] = [
  { value: "sale",     label: "Sale" },
  { value: "expense",  label: "Expense" },
  { value: "purchase", label: "Purchase / Inventory" },
  { value: "refund",   label: "Refund" },
  { value: "salary",   label: "Salary / Payroll" },
];

const CATEGORIES: Record<TransactionType, string[]> = {
  sale:     ["Sales","POS Sales","Online Orders"],
  expense:  ["Utilities","Logistics","Supplies","Marketing","Rent","Miscellaneous"],
  purchase: ["Inventory","Equipment"],
  refund:   ["Refunds"],
  salary:   ["Payroll"],
};

const TYPE_ICONS: Record<TransactionType, LucideIcon> = {
  sale: DollarSign, expense: CreditCard, purchase: ShoppingCart, refund: Undo2, salary: User,
};

// TEMPORARY — accounting entries are a flat mock list with no continuous
// daily history yet, so the range-selector chart runs on the same demo
// series pattern used elsewhere until real day-by-day revenue is queryable.
const DEMO_DAILY_REVENUE = generateDemoDailyRevenue(730, 31000);

export default function AccountingView({ entries, currentUserId, onEntries, onToast }: AccountingViewProps) {
  const [typeFilter, setTypeFilter] = useState<TransactionType | "All">("All");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "sale" as TransactionType, description: "", amount: "", category: "Sales", reference: "", date: new Date().toISOString().slice(0,10) });

  const setField = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const filtered = entries.filter(e => {
    const matchType = typeFilter === "All" || e.type === typeFilter;
    const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) || (e.reference ?? "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const totals = {
    income:  entries.filter(e => e.type === "sale").reduce((s,e) => s+e.amount, 0),
    expense: entries.filter(e => ["expense","salary","purchase"].includes(e.type)).reduce((s,e) => s+e.amount, 0),
    refunds: entries.filter(e => e.type === "refund").reduce((s,e) => s+e.amount, 0),
  };
  const profit = totals.income - totals.expense - totals.refunds;

  const addEntry = () => {
    if (!form.description || !form.amount) { onToast("Description and amount required.", "error"); return; }
    const entry: AccountingEntry = {
      id: genId("acc"), ...form, amount: Number(form.amount),
      reference: form.reference || undefined, createdBy: currentUserId,
    };
    onEntries([entry, ...entries]);
    onToast("Entry added.", "success");
    setShowAdd(false);
    setForm({ type:"sale", description:"", amount:"", category:"Sales", reference:"", date: new Date().toISOString().slice(0,10) });
  };

  const isIncome = (type: TransactionType) => type === "sale";

  // Group by category for summary
  const byCategory = filtered.reduce((acc, e) => {
    const key = e.category;
    if (!acc[key]) acc[key] = 0;
    acc[key] += e.amount;
    return acc;
  }, {} as Record<string,number>);
  const maxCategoryAmt = Math.max(1, ...Object.values(byCategory));

  const inputCls = "w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary";
  const labelCls = "block text-org-xs font-org-medium text-org-text-secondary mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-org-lg font-org-bold text-org-text-primary">Accounting</h1>
          <p className="text-org-sm text-org-text-secondary mt-0.5">Revenue, expenses, and profit overview</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">
          + Add Entry
        </button>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Revenue" value={fmt(totals.income)} icon={<DollarSign size={16} />} />
        <StatCard label="Total Expenses" value={fmt(totals.expense)} icon={<CreditCard size={16} />} iconBg="bg-org-danger-bg text-org-danger" />
        <StatCard label="Refunds" value={fmt(totals.refunds)} icon={<Undo2 size={16} />} iconBg="bg-org-warning/15 text-org-warning" />
        <StatCard
          label="Net Profit"
          value={fmt(profit)}
          icon={profit >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          iconBg={profit >= 0 ? "bg-org-success-bg text-org-success" : "bg-org-danger-bg text-org-danger"}
        />
      </div>

      {/* Revenue chart */}
      <RangeRevenueChart title="Revenue Trend" data={DEMO_DAILY_REVENUE} currency="KES" />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input placeholder="Search entries…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {(["All","sale","expense","purchase","refund","salary"] as const).map(t => {
            const FilterIcon = t === "All" ? null : TYPE_ICONS[t as TransactionType];
            return (
              <button key={t} onClick={() => setTypeFilter(t)} className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-org-sm text-org-xs font-org-semibold whitespace-nowrap transition-colors ${
                typeFilter===t ? "bg-org-primary-light text-org-primary border border-org-primary" : "bg-org-surface text-org-text-secondary border border-org-border"
              }`}>
                {FilterIcon && <FilterIcon size={14} />}
                {t === "All" ? "All" : t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Entries" className="lg:col-span-2">
          {filtered.length === 0 ? (
            <p className="text-org-sm text-org-text-secondary text-center py-8">No entries found.</p>
          ) : (
            <div className="flex flex-col">
              {filtered.map((e) => {
                const TypeIcon = TYPE_ICONS[e.type];
                return (
                  <div key={e.id} className="flex items-center gap-3 py-2.5 border-b border-org-border last:border-0">
                    <TypeIcon size={16} className="text-org-text-muted shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-org-sm font-org-medium text-org-text-primary truncate">{e.description}</p>
                      <p className="text-org-xs text-org-text-secondary">{e.category}{e.reference ? ` · Ref: ${e.reference}` : ""} &middot; {fmtDate(e.date)}</p>
                    </div>
                    <span className={`font-org-bold text-org-sm shrink-0 ${isIncome(e.type) ? "text-org-success" : "text-org-danger"}`}>
                      {isIncome(e.type) ? "+" : "-"}{fmt(e.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

        {/* Category summary */}
        <ChartCard title="By Category">
          {Object.keys(byCategory).length === 0 ? (
            <p className="text-org-sm text-org-text-secondary text-center py-8">No data</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
                <div key={cat}>
                  <div className="flex justify-between text-org-sm mb-1">
                    <span className="text-org-text-secondary font-org-medium">{cat}</span>
                    <span className="font-org-semibold text-org-text-primary">{fmt(amt)}</span>
                  </div>
                  <div className="h-1.5 bg-org-surface-alt rounded-org-pill overflow-hidden">
                    <div className="h-full bg-org-primary rounded-org-pill" style={{ width: `${Math.min(100, (amt / maxCategoryAmt) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      {/* Add Entry Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowAdd(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-md p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">Add Accounting Entry</h2>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Type</label>
                <select value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value as TransactionType, category: CATEGORIES[e.target.value as TransactionType][0] }))} className={inputCls}>
                  {TYPE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => setField("category")(e.target.value)} className={inputCls}>
                  {(CATEGORIES[form.type] || []).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <input value={form.description} onChange={(e) => setField("description")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Amount (KSh)</label>
                <input type="number" value={form.amount} onChange={(e) => setField("amount")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Reference (optional)</label>
                <input value={form.reference} onChange={(e) => setField("reference")(e.target.value)} placeholder="Order ID, invoice no…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setField("date")(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={addEntry} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
