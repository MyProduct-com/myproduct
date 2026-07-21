import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { DollarSign, CreditCard, ShoppingCart, Undo2, User, TrendingUp, TrendingDown, Search } from "lucide-react";
import type { AccountingEntry, TransactionType, Theme } from "../../types/index";
import { SectionHeader, Btn, Modal, Input, Select, StatCard, Table } from "../layout/UI";
import { fmt, fmtDate, genId } from "../../utils/helpers";

interface AccountingViewProps {
  theme: Theme;
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

export default function AccountingView({ theme, entries, currentUserId, onEntries, onToast }: AccountingViewProps) {
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
  const isDebit  = (type: TransactionType) => ["expense","salary","purchase","refund"].includes(type);

  const columns = [
    { header: "Date", key: "date", render: (e: AccountingEntry) => <span style={{ fontSize: 12 }}>{fmtDate(e.date)}</span>, width: "90px" },
    {
      header: "Type", key: "type",
      render: (e: AccountingEntry) => {
        const TypeIcon = TYPE_ICONS[e.type];
        return (
          <span title={e.type}><TypeIcon size={18} /></span>
        );
      },
      width: "48px",
    },
    {
      header: "Description", key: "desc",
      render: (e: AccountingEntry) => (
        <div>
          <div style={{ fontWeight: 600, color: theme.black }}>{e.description}</div>
          <div style={{ fontSize: 11, color: theme.textMuted }}>{e.category}{e.reference ? ` · Ref: ${e.reference}` : ""}</div>
        </div>
      ),
    },
    {
      header: "Amount", key: "amount",
      render: (e: AccountingEntry) => (
        <span style={{ fontWeight: 800, color: isIncome(e.type) ? theme.primary : theme.danger }}>
          {isIncome(e.type) ? "+" : "-"}{fmt(e.amount)}
        </span>
      ),
    },
  ];

  // Group by category for summary
  const byCategory = filtered.reduce((acc, e) => {
    const key = e.category;
    if (!acc[key]) acc[key] = 0;
    acc[key] += e.amount;
    return acc;
  }, {} as Record<string,number>);

  return (
    <div>
      <SectionHeader
        title="Accounting"
        subtitle="Revenue, expenses, and profit overview"
        theme={theme}
        action={<Btn theme={theme} onClick={() => setShowAdd(true)}>+ Add Entry</Btn>}
      />

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={fmt(totals.income)} icon={DollarSign} color="#16a34a" theme={theme} />
        <StatCard label="Total Expenses" value={fmt(totals.expense)} icon={CreditCard} color="#ef4444" theme={theme} />
        <StatCard label="Refunds" value={fmt(totals.refunds)} icon={Undo2} color="#f59e0b" theme={theme} />
        <StatCard
          label="Net Profit"
          value={fmt(profit)}
          icon={profit >= 0 ? TrendingUp : TrendingDown}
          color={profit >= 0 ? "#16a34a" : "#ef4444"}
          sub={profit >= 0 ? "Profitable" : "Loss"}
          theme={theme}
        />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input placeholder="Search entries…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"9px 12px 9px 36px", borderRadius:theme.radius, border:`1.5px solid ${theme.border}`, fontSize:13, boxSizing:"border-box", background:theme.surface, outline:"none" }} />
          <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", opacity:0.5, display:"flex" }}><Search size={14} /></span>
        </div>
        {(["All","sale","expense","purchase","refund","salary"] as const).map(t => {
          const FilterIcon = t === "All" ? null : TYPE_ICONS[t as TransactionType];
          return (
            <button key={t} onClick={() => setTypeFilter(t)} style={{
              padding:"7px 14px", borderRadius:theme.radius, border:`1.5px solid ${typeFilter===t ? theme.primary : theme.border}`,
              background: typeFilter===t ? theme.primaryLight : theme.surface,
              color: typeFilter===t ? theme.primary : theme.textMuted,
              fontWeight:700, fontSize:12, cursor:"pointer",
              display:"inline-flex", alignItems:"center", gap:6,
            }}>
              {FilterIcon && <FilterIcon size={14} />}
              {t === "All" ? "All" : t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}>
        <Table columns={columns} data={filtered} theme={theme} emptyMessage="No entries found." />

        {/* Category summary */}
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radiusCard, padding: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: theme.black, marginBottom: 14 }}>By Category</div>
          {Object.entries(byCategory).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: theme.text, fontWeight: 600 }}>{cat}</span>
                <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(amt)}</span>
              </div>
              <div style={{ height: 4, background: theme.border, borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  background: theme.primary,
                  width: `${Math.min(100, (amt / Math.max(...Object.values(byCategory))) * 100)}%`,
                }} />
              </div>
            </div>
          ))}
          {Object.keys(byCategory).length === 0 && (
            <div style={{ color: theme.textMuted, fontSize: 12, textAlign: "center", padding: 20 }}>No data</div>
          )}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAdd && (
        <Modal title="Add Accounting Entry" onClose={() => setShowAdd(false)} theme={theme} width={480}>
          <Select label="Type" value={form.type} onChange={v => setForm(f => ({ ...f, type: v as TransactionType, category: CATEGORIES[v as TransactionType][0] }))}
            options={TYPE_OPTS} theme={theme} />
          <Select label="Category" value={form.category} onChange={setField("category")}
            options={(CATEGORIES[form.type] || []).map(c => ({ value:c, label:c }))} theme={theme} />
          <Input label="Description" value={form.description} onChange={setField("description")} theme={theme} required />
          <Input label="Amount (KSh)" value={form.amount} onChange={setField("amount")} type="number" theme={theme} required />
          <Input label="Reference (optional)" value={form.reference} onChange={setField("reference")} theme={theme} placeholder="Order ID, invoice no…" />
          <Input label="Date" value={form.date} onChange={setField("date")} type="date" theme={theme} />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Btn>
            <Btn theme={theme} onClick={addEntry}>Add Entry</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
