import { useState } from "react";
import type { AdminProduct, StockMovement, Theme } from "../../types/index";
import { SectionHeader, Btn, Modal, Table, Input, Select } from "../layout/UI";
import { fmt, fmtDateTime, genId } from "../../utils/helpers";

interface InventoryViewProps {
  theme: Theme;
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

export default function InventoryView({
  theme, products, movements, currentUserId, currentUserName,
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
    onToast(`Stock updated: ${selectedProduct.name} → ${newStock} units`, "success");
    setShowAdjust(false);
  };

  const stockColor = (p: AdminProduct) =>
    p.stock === 0 ? "#ef4444" : p.stock <= p.lowStockThreshold ? "#f59e0b" : theme.primary;

  const columns = [
    {
      header: "Product", key: "name",
      render: (p: AdminProduct) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 700, color: theme.black }}>{p.name}</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>SKU: {p.sku} · {p.supplier}</div>
          </div>
        </div>
      ),
    },
    { header: "Category", key: "cat", render: (p: AdminProduct) => <span style={{ fontSize: 12 }}>{p.category}</span> },
    {
      header: "Stock", key: "stock",
      render: (p: AdminProduct) => (
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: stockColor(p) }}>{p.stock}</div>
          <div style={{ fontSize: 11, color: theme.textMuted }}>{p.unit} · Alert at {p.lowStockThreshold}</div>
        </div>
      ),
    },
    {
      header: "Status", key: "status",
      render: (p: AdminProduct) => {
        const label = p.stock === 0 ? "Out of Stock" : p.stock <= p.lowStockThreshold ? "Low Stock" : "In Stock";
        const color = stockColor(p);
        return (
          <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, background: color + "18", color, fontSize: 11, fontWeight: 700 }}>
            {label}
          </span>
        );
      },
    },
    { header: "Cost", key: "cost", render: (p: AdminProduct) => <span style={{ fontSize: 12 }}>{fmt(p.costPrice)}</span> },
    { header: "Value", key: "value", render: (p: AdminProduct) => <span style={{ fontWeight: 700, color: theme.accent }}>{fmt(p.costPrice * p.stock)}</span> },
    {
      header: "Adjust", key: "adj",
      render: (p: AdminProduct) => (
        <Btn theme={theme} variant="ghost" small onClick={e => { (e as any).stopPropagation(); openAdjust(p); }}>
          ± Adjust
        </Btn>
      ),
    },
  ];

  const totalStockValue = products.reduce((s, p) => s + p.costPrice * p.stock, 0);

  return (
    <div>
      <SectionHeader
        title="Inventory"
        subtitle={`Total stock value: ${fmt(totalStockValue)} · ${lowCount} low stock · ${outCount} out of stock`}
        theme={theme}
      />

      {/* Alert banner */}
      {(lowCount > 0 || outCount > 0) && (
        <div style={{
          background: "#fef9c3", border: "1px solid #fcd34d", borderRadius: theme.radius,
          padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <span style={{ fontWeight: 700, color: "#92400e" }}>Stock Alert: </span>
            <span style={{ color: "#78350f", fontSize: 13 }}>
              {outCount > 0 && `${outCount} item${outCount>1?"s":""} out of stock. `}
              {lowCount > 0 && `${lowCount} item${lowCount>1?"s":""} running low.`}
            </span>
          </div>
          <Btn theme={theme} variant="secondary" small onClick={() => setFilter("Low")} style={{ marginLeft: "auto" }}>View Low Stock</Btn>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            placeholder="Search product or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box", background: theme.surface, outline: "none" }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
        </div>
        {["All","Low","Out"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "9px 16px", borderRadius: theme.radius, border: `1.5px solid ${filter===f ? theme.primary : theme.border}`,
            background: filter===f ? theme.primaryLight : theme.surface,
            color: filter===f ? theme.primary : theme.textMuted,
            fontWeight: 700, fontSize: 12, cursor: "pointer",
          }}>
            {f === "All" ? "All Stock" : f === "Low" ? `⚠️ Low (${lowCount})` : `❌ Out (${outCount})`}
          </button>
        ))}
      </div>

      <Table columns={columns} data={filtered} theme={theme} emptyMessage="No products found." />

      {/* Stock Movements log */}
      <div style={{ marginTop: 28 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: theme.black, marginBottom: 12 }}>Stock Movement Log</div>
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radiusCard, overflow: "hidden" }}>
          {movements.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: theme.textMuted }}>No movements recorded.</div>
          ) : movements.slice(0, 20).map(m => {
            const typeColors: Record<string, string> = { in: "#16a34a", out: "#f59e0b", adjustment: "#6366f1", loss: "#ef4444" };
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 18 }}>{m.type==="in"?"📥":m.type==="out"?"📤":m.type==="loss"?"💔":"⚙️"}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 700, color: theme.black }}>{m.productName}</span>
                  <span style={{ fontSize: 12, color: theme.textMuted, marginLeft: 8 }}>{m.reason}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: typeColors[m.type] }}>
                    {m.type==="in" || m.type==="adjustment" ? "+" : "-"}{m.qty}
                  </div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>{m.previousStock} → {m.newStock}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>{m.userName}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>{fmtDateTime(m.createdAt)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adjust Modal */}
      {showAdjust && selectedProduct && (
        <Modal title={`Adjust Stock: ${selectedProduct.name}`} onClose={() => setShowAdjust(false)} theme={theme} width={440}>
          <div style={{ background: theme.bg, borderRadius: theme.radius, padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>Current Stock</span>
            <span style={{ fontWeight: 800, fontSize: 18, color: stockColor(selectedProduct) }}>{selectedProduct.stock} {selectedProduct.unit}</span>
          </div>
          <Select label="Movement Type" value={movType} onChange={setMovType} options={MOVEMENT_TYPES} theme={theme} />
          <Input label="Quantity" value={qty} onChange={setQty} type="number" theme={theme} required />
          <Input label="Reason / Notes" value={reason} onChange={setReason} theme={theme} placeholder="e.g. Supplier delivery, damaged goods…" />
          <div style={{ background: theme.bg, borderRadius: theme.radius, padding: 12, marginBottom: 16, fontSize: 13 }}>
            New stock will be: <strong style={{ color: theme.accent }}>
              {Math.max(0, selectedProduct.stock + (["in","adjustment"].includes(movType) ? Number(qty) : -Number(qty)))} {selectedProduct.unit}
            </strong>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowAdjust(false)}>Cancel</Btn>
            <Btn theme={theme} onClick={handleAdjust}>Save Adjustment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
