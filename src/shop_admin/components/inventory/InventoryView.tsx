import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Search, XCircle, ArrowDownToLine, ArrowUpFromLine, HeartCrack, Settings2, ArrowRight } from "lucide-react";
import type { AdminProduct, StockMovement } from "../../types/index";
import ChartCard from "@/components/dashboard/ChartCard";
import { fmt, fmtDateTime, genId } from "../../utils/helpers";

interface InventoryViewProps {
  products: AdminProduct[];
  movements: StockMovement[];
  currentUserId: string;
  currentUserName: string;
  onProducts: (p: AdminProduct[]) => void;
  onMovements: (m: StockMovement[]) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const MOVEMENT_TYPES = [
  { value: "in",          label: "Stock In (Restock)" },
  { value: "out",         label: "Stock Out (Manual)" },
  { value: "adjustment",  label: "Adjustment" },
  { value: "loss",        label: "Loss / Damage / Expiry" },
];

const TYPE_TONE: Record<string, string> = { in: "text-org-success", out: "text-org-warning", adjustment: "text-org-accent", loss: "text-org-danger" };
const TYPE_ICON: Record<string, LucideIcon> = { in: ArrowDownToLine, out: ArrowUpFromLine, loss: HeartCrack, adjustment: Settings2 };

export default function InventoryView({
  products, movements, currentUserId, currentUserName,
  onProducts, onMovements, onToast,
}: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showAdjust, setShowAdjust] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [movType, setMovType] = useState("in");
  const [qty, setQty] = useState("1");
  const [reason, setReason] = useState("");

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ? true :
      filter === "Low" ? p.stock <= p.lowStockThreshold :
      filter === "Out" ? p.stock === 0 : true;
    return matchSearch && matchFilter;
  });

  const lowCount = products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length;
  const outCount = products.filter(p => p.stock === 0).length;
  const totalStockValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);

  const openAdjust = (p: AdminProduct) => {
    setSelectedProduct(p); setMovType("in"); setQty("1"); setReason(""); setShowAdjust(true);
  };

  const handleAdjust = () => {
    if (!selectedProduct || !qty || Number(qty) <= 0) { onToast("Enter a valid quantity.", "error"); return; }
    const delta = movType === "in" || movType === "adjustment" ? Number(qty) : -Number(qty);
    const newStock = Math.max(0, selectedProduct.stock + delta);

    const mov: StockMovement = {
      id: genId("sm"), productId: selectedProduct.id, productName: selectedProduct.name,
      type: movType as StockMovement["type"], qty: Number(qty),
      previousStock: selectedProduct.stock, newStock,
      reason: reason || movType, userId: currentUserId, userName: currentUserName,
      createdAt: new Date().toISOString(),
    };

    onProducts(products.map(p => p.id === selectedProduct.id ? { ...p, stock: newStock, updatedAt: new Date().toISOString() } : p));
    onMovements([mov, ...movements]);
    onToast(`Stock updated: ${selectedProduct.name} -> ${newStock} units`, "success");
    setShowAdjust(false);
  };

  const stockTone = (p: AdminProduct) =>
    p.stock === 0 ? "text-org-danger" : p.stock <= p.lowStockThreshold ? "text-org-warning" : "text-org-primary";
  const stockLabel = (p: AdminProduct) =>
    p.stock === 0 ? "Out of Stock" : p.stock <= p.lowStockThreshold ? "Low Stock" : "In Stock";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Inventory</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">
          Total stock value: {fmt(totalStockValue)} &middot; {lowCount} low stock &middot; {outCount} out of stock
        </p>
      </div>

      {/* Alert banner */}
      {(lowCount > 0 || outCount > 0) && (
        <div className="flex items-center gap-3 bg-org-warning/10 border border-org-warning/30 rounded-org-sm px-4 py-3">
          <AlertTriangle size={20} className="text-org-warning shrink-0" />
          <div className="flex-1 text-org-sm">
            <span className="font-org-bold text-org-warning">Stock Alert: </span>
            <span className="text-org-text-secondary">
              {outCount > 0 && `${outCount} item${outCount>1?"s":""} out of stock. `}
              {lowCount > 0 && `${lowCount} item${lowCount>1?"s":""} running low.`}
            </span>
          </div>
          <button onClick={() => setFilter("Low")} className="text-org-xs font-org-semibold text-org-warning hover:underline shrink-0">View Low Stock</button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input
            placeholder="Search product or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary"
          />
        </div>
        <div className="flex gap-2">
          {["All","Low","Out"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm text-org-xs font-org-semibold whitespace-nowrap transition-colors ${
              filter===f ? "bg-org-primary-light text-org-primary border border-org-primary" : "bg-org-surface text-org-text-secondary border border-org-border"
            }`}>
              {f === "All" ? "All Stock" : f === "Low" ? <><AlertTriangle size={14} /> Low ({lowCount})</> : <><XCircle size={14} /> Out ({outCount})</>}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No products found.</p>
        ) : filtered.map((p) => (
          <div key={p.id} className="bg-org-surface rounded-org-card shadow-org-card p-3.5">
            <div className="flex items-center gap-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-org-medium text-org-text-primary truncate">{p.name}</p>
                <p className="text-org-xs text-org-text-muted">SKU: {p.sku} &middot; {p.supplier}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-org-bold text-org-md ${stockTone(p)}`}>{p.stock}</p>
                <p className="text-org-xs text-org-text-muted">{p.unit}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-org-border text-org-xs">
              <span className={`font-org-semibold ${stockTone(p)}`}>{stockLabel(p)}</span>
              <span className="text-org-text-secondary">Value: {fmt(p.costPrice * p.stock)}</span>
            </div>
            <button onClick={() => openAdjust(p)} className="w-full mt-2.5 text-center text-org-xs font-org-semibold text-org-primary bg-org-primary-light rounded-org-sm py-2">± Adjust Stock</button>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-org-surface rounded-org-card shadow-org-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-org-sm">
            <thead className="bg-org-surface-alt border-b border-org-border">
              <tr className="text-org-xs text-org-text-muted uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-org-medium">Product</th>
                <th className="px-4 py-3 text-left font-org-medium">Category</th>
                <th className="px-4 py-3 text-left font-org-medium">Stock</th>
                <th className="px-4 py-3 text-left font-org-medium">Status</th>
                <th className="px-4 py-3 text-right font-org-medium">Cost</th>
                <th className="px-4 py-3 text-right font-org-medium">Value</th>
                <th className="px-4 py-3 text-right font-org-medium">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-org-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-org-text-secondary">No products found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-org-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-org-medium text-org-text-primary truncate max-w-[200px]">{p.name}</p>
                        <p className="text-org-xs text-org-text-muted">SKU: {p.sku} &middot; {p.supplier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-org-text-secondary">{p.category}</td>
                  <td className="px-4 py-3">
                    <p className={`font-org-bold text-org-md ${stockTone(p)}`}>{p.stock}</p>
                    <p className="text-org-xs text-org-text-muted">{p.unit} &middot; Alert at {p.lowStockThreshold}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-1 rounded-org-pill text-org-xs font-org-semibold bg-org-surface-alt ${stockTone(p)}`}>{stockLabel(p)}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-org-text-secondary">{fmt(p.costPrice)}</td>
                  <td className="px-4 py-3 text-right font-org-semibold text-org-text-primary">{fmt(p.costPrice * p.stock)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openAdjust(p)} className="text-org-xs font-org-semibold text-org-primary hover:underline">± Adjust</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Movements log */}
      <ChartCard title="Stock Movement Log">
        {movements.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No movements recorded.</p>
        ) : (
          <div className="flex flex-col">
            {movements.slice(0, 20).map(m => {
              const MovementIcon = TYPE_ICON[m.type] ?? Settings2;
              return (
                <div key={m.id} className="flex items-center gap-3 py-2.5 border-b border-org-border last:border-0">
                  <MovementIcon size={16} className={`shrink-0 ${TYPE_TONE[m.type]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-org-sm font-org-medium text-org-text-primary truncate">{m.productName}</p>
                    <p className="text-org-xs text-org-text-secondary truncate">{m.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-org-semibold text-org-sm ${TYPE_TONE[m.type]}`}>{m.type==="in" || m.type==="adjustment" ? "+" : "-"}{m.qty}</p>
                    <p className="text-org-xs text-org-text-muted flex items-center gap-1 justify-end">{m.previousStock} <ArrowRight size={11} /> {m.newStock}</p>
                  </div>
                  <div className="text-right shrink-0 min-w-[100px] hidden sm:block">
                    <p className="text-org-xs text-org-text-muted">{m.userName}</p>
                    <p className="text-org-xs text-org-text-muted">{fmtDateTime(m.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ChartCard>

      {/* Adjust Modal */}
      {showAdjust && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowAdjust(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">Adjust Stock: {selectedProduct.name}</h2>
            <div className="flex justify-between items-center bg-org-surface-alt rounded-org-sm p-3.5 mb-4">
              <span className="text-org-sm text-org-text-secondary">Current Stock</span>
              <span className={`font-org-bold text-org-md ${stockTone(selectedProduct)}`}>{selectedProduct.stock} {selectedProduct.unit}</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Movement Type</label>
                <select value={movType} onChange={(e) => setMovType(e.target.value)} className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary">
                  {MOVEMENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Quantity</label>
                <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary" />
              </div>
              <div>
                <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Reason / Notes</label>
                <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Supplier delivery, damaged goods…" className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary" />
              </div>
            </div>
            <div className="bg-org-surface-alt rounded-org-sm p-3 mt-4 text-org-sm text-org-text-secondary">
              New stock will be: <strong className="text-org-text-primary">
                {Math.max(0, selectedProduct.stock + (["in","adjustment"].includes(movType) ? Number(qty) : -Number(qty)))} {selectedProduct.unit}
              </strong>
            </div>
            <div className="flex gap-2.5 justify-end mt-5">
              <button onClick={() => setShowAdjust(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={handleAdjust} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Save Adjustment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
