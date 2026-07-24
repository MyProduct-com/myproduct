"use client";
import { useState } from "react";
import { Package, XCircle, AlertTriangle, Pencil, Trash2, Lightbulb, Search, Info } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import type { SharedProduct } from "@/store/productStore";
import { fmt } from "../../utils/helpers";

const CATEGORIES = [
  "Fruits & Vegetables", "Dairy & Eggs", "Meat & Fish",
  "Bakery", "Pantry", "Beverages", "Snacks", "Household",
];

interface ProductFormState {
  name: string; description: string; price: string; costPrice: string;
  unit: string; category: string; stock: string; lowStockThreshold: string;
  sku: string; supplier: string; image: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "", description: "", price: "", costPrice: "", unit: "",
  category: "Fruits & Vegetables", stock: "", lowStockThreshold: "10",
  sku: "", supplier: "", image: "",
};

interface ProductsViewProps {
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
  /** Open the Add Product modal as soon as the view mounts — set when arriving via a dashboard "Add Product" quick action. */
  openAddOnMount?: boolean;
  /** Pre-filter the list to only low/out-of-stock items — set when arriving via the dashboard's Low Stock alert card. */
  focusLowStock?: boolean;
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-org-pill text-org-xs font-org-semibold ${published ? "bg-org-success-bg text-org-success" : "bg-org-surface-alt text-org-text-secondary"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default function ProductsView({ onToast, openAddOnMount, focusLowStock }: ProductsViewProps) {
  const products      = useProductStore((s) => s.products);
  const addProduct    = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const togglePublish = useProductStore((s) => s.togglePublish);

  const [search, setSearch]               = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [lowStockOnly, setLowStockOnly]   = useState(!!focusLowStock);
  const [showModal, setShowModal]         = useState(!!openAddOnMount);
  const [editProduct, setEditProduct]     = useState<SharedProduct | null>(null);
  const [form, setForm]                   = useState<ProductFormState>(EMPTY_FORM);
  const [showDbSearch, setShowDbSearch]   = useState(false);
  const [dbQuery, setDbQuery]             = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<SharedProduct | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" ? p.published : !p.published);
    const matchStock = !lowStockOnly || p.stock <= p.lowStockThreshold;
    return matchSearch && matchCat && matchStatus && matchStock;
  });

  const openAdd = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p: SharedProduct) => {
    setEditProduct(p);
    setForm({
      name: p.name, description: p.description,
      price: String(p.price), costPrice: String(p.costPrice),
      unit: p.unit, category: p.category,
      stock: String(p.stock), lowStockThreshold: String(p.lowStockThreshold),
      sku: p.sku, supplier: p.supplier, image: p.image,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.price) {
      onToast("Name and price are required.", "error");
      return;
    }
    if (editProduct) {
      updateProduct(editProduct.id, {
        name: form.name, description: form.description,
        price: Number(form.price), costPrice: Number(form.costPrice),
        unit: form.unit, category: form.category,
        stock: Number(form.stock), lowStockThreshold: Number(form.lowStockThreshold),
        sku: form.sku, supplier: form.supplier, image: form.image,
      });
      onToast(`"${form.name}" updated.`, "success");
    } else {
      addProduct({
        name: form.name, description: form.description,
        price: Number(form.price), costPrice: Number(form.costPrice),
        unit: form.unit, category: form.category,
        stock: Number(form.stock), lowStockThreshold: Number(form.lowStockThreshold),
        sku: form.sku, supplier: form.supplier, image: form.image,
        published: false,
      });
      onToast(`"${form.name}" added as draft. Publish when ready.`, "success");
    }
    setShowModal(false);
  };

  const handleTogglePublish = (p: SharedProduct) => {
    togglePublish(p.id);
    onToast(
      p.published
        ? `"${p.name}" unpublished — hidden from shop.`
        : `"${p.name}" published — now visible in shop!`,
      p.published ? "info" : "success"
    );
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    deleteProduct(deleteConfirm.id);
    onToast(`"${deleteConfirm.name}" deleted.`, "info");
    setDeleteConfirm(null);
  };

  const setField = (k: keyof ProductFormState) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const dbResults = products.filter(
    (p) =>
      dbQuery.length > 1 &&
      (p.name.toLowerCase().includes(dbQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(dbQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(dbQuery.toLowerCase()))
  );

  const inputCls = "w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary";
  const labelCls = "block text-org-xs font-org-medium text-org-text-secondary mb-1.5";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-org-lg font-org-bold text-org-text-primary">Products</h1>
          <p className="text-org-sm text-org-text-secondary mt-0.5">
            {products.filter((p) => p.published).length} published &middot; {products.filter((p) => !p.published).length} drafts &middot; changes reflect in shop instantly
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowDbSearch(true)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">
            <Search size={14} /> Browse DB
          </button>
          <button onClick={openAdd} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">
            + Add Product
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-org-success-bg border border-org-success/30 rounded-org-sm px-3.5 py-2.5 text-org-sm text-org-success">
        <Lightbulb size={16} className="shrink-0 mt-0.5" />
        <span>
          <strong>How it works:</strong> Add a product → saved as <strong>Draft</strong>.
          Click <strong>Publish</strong> → appears in shop immediately.
          Click <strong>Unpublish</strong> → hidden from customers instantly.
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary outline-none focus:border-org-primary"
          />
        </div>
        <div className="flex gap-2">
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary">
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-org-sm border border-org-border text-org-sm bg-org-surface text-org-text-primary">
            <option value="All">All Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <button
            onClick={() => setLowStockOnly((v) => !v)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-org-sm border text-org-sm font-org-medium transition-colors ${
              lowStockOnly ? "bg-org-warning/15 border-org-warning text-org-warning" : "border-org-border text-org-text-secondary hover:bg-org-surface-alt"
            }`}
          >
            <AlertTriangle size={14} /> Low stock
          </button>
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.length === 0 ? (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No products found.</p>
        ) : filtered.map((p) => (
          <div key={p.id} className="bg-org-surface rounded-org-card shadow-org-card p-3.5">
            <div className="flex items-center gap-3">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-org-surface-alt flex items-center justify-center shrink-0"><Package size={20} className="text-org-text-muted" /></div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-org-medium text-org-text-primary truncate">{p.name}</p>
                <p className="text-org-xs text-org-text-muted">SKU: {p.sku}</p>
              </div>
              <StatusBadge published={p.published} />
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-org-border text-org-sm">
              <span className="font-org-semibold text-org-text-primary">{fmt(p.price)}</span>
              <span className={p.stock === 0 ? "text-org-danger" : p.stock <= p.lowStockThreshold ? "text-org-warning" : "text-org-text-secondary"}>
                {p.stock} {p.unit} {p.stock === 0 ? "(out)" : p.stock <= p.lowStockThreshold ? "(low)" : ""}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => openEdit(p)} className="flex-1 text-center text-org-xs font-org-medium text-org-text-secondary bg-org-surface-alt rounded-org-sm py-2">Edit</button>
              <button onClick={() => handleTogglePublish(p)} className={`flex-1 text-center text-org-xs font-org-medium rounded-org-sm py-2 ${p.published ? "text-org-text-secondary bg-org-surface-alt" : "text-white bg-org-primary"}`}>
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => setDeleteConfirm(p)} className="w-9 h-9 flex items-center justify-center rounded-org-sm text-org-danger bg-org-danger-bg shrink-0"><Trash2 size={14} /></button>
            </div>
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
                <th className="px-4 py-3 text-right font-org-medium">Price</th>
                <th className="px-4 py-3 text-right font-org-medium">Stock</th>
                <th className="px-4 py-3 text-left font-org-medium">Status</th>
                <th className="px-4 py-3 text-right font-org-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-org-border">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-org-text-secondary">No products found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="hover:bg-org-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-org-surface-alt flex items-center justify-center shrink-0"><Package size={18} className="text-org-text-muted" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="font-org-medium text-org-text-primary truncate max-w-[200px]">{p.name}</p>
                        <p className="text-org-xs text-org-text-muted">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-org-text-secondary">{p.category}</td>
                  <td className="px-4 py-3 text-right font-org-semibold text-org-text-primary">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-org-semibold ${p.stock === 0 ? "text-org-danger" : p.stock <= p.lowStockThreshold ? "text-org-warning" : "text-org-text-primary"}`}>
                      {p.stock} {p.unit}
                    </span>
                    {p.stock === 0 && <span className="ml-1.5 text-[10px] text-org-danger inline-flex items-center gap-0.5"><XCircle size={10} /> out</span>}
                    {p.stock > 0 && p.stock <= p.lowStockThreshold && <span className="ml-1.5 text-[10px] text-org-warning inline-flex items-center gap-0.5"><AlertTriangle size={10} /> low</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <StatusBadge published={p.published} />
                      {p.published && p.stock === 0 && <span className="text-[10px] text-org-danger">Hidden (no stock)</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-primary hover:bg-org-primary-light transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleTogglePublish(p)} className={`px-2.5 py-1 rounded-org-sm text-org-xs font-org-semibold transition-colors ${p.published ? "text-org-text-secondary bg-org-surface-alt hover:bg-org-border" : "text-white bg-org-primary hover:bg-org-primary-hover"}`}>
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => setDeleteConfirm(p)} className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-danger hover:bg-org-danger-bg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">{editProduct ? `Edit — ${editProduct.name}` : "Add New Product"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className={labelCls}>Product Name *</label>
                <input value={form.name} onChange={(e) => setField("name")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Selling Price (KSh) *</label>
                <input type="number" value={form.price} onChange={(e) => setField("price")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Cost Price (KSh)</label>
                <input type="number" value={form.costPrice} onChange={(e) => setField("costPrice")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Unit</label>
                <input value={form.unit} onChange={(e) => setField("unit")(e.target.value)} placeholder="KG, Bunch, 500ml…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => setField("category")(e.target.value)} className={inputCls}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Stock Qty</label>
                <input type="number" value={form.stock} onChange={(e) => setField("stock")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Low Stock Alert at</label>
                <input type="number" value={form.lowStockThreshold} onChange={(e) => setField("lowStockThreshold")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>SKU</label>
                <input value={form.sku} onChange={(e) => setField("sku")(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Supplier</label>
                <input value={form.supplier} onChange={(e) => setField("supplier")(e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Image URL</label>
                <input value={form.image} onChange={(e) => setField("image")(e.target.value)} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={(e) => setField("description")(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
              </div>
            </div>

            {form.image && (
              <div className="mt-3">
                <p className="text-org-xs text-org-text-muted mb-1">Image preview:</p>
                <img src={form.image} alt="preview" className="h-20 rounded-lg object-cover" />
              </div>
            )}

            {!editProduct && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-org-warning/10 border border-org-warning/30 rounded-org-sm text-org-xs text-org-warning">
                <Info size={14} className="shrink-0" /> Saved as <strong>Draft</strong> — won&apos;t appear in shop until you click <strong>Publish</strong>.
              </div>
            )}

            <div className="flex gap-2.5 mt-5 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">{editProduct ? "Save Changes" : "Add Product"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-sm p-5 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-3 text-org-danger"><Trash2 size={44} /></div>
            <p className="font-org-bold text-org-md text-org-text-primary mb-1.5">Delete &ldquo;{deleteConfirm.name}&rdquo;?</p>
            <p className="text-org-sm text-org-text-secondary mb-5">This permanently removes it from the shop and admin panel. Cannot be undone.</p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-org-sm bg-org-danger hover:opacity-90 text-white text-org-sm font-org-semibold transition-colors">Yes, delete it</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DB Search Modal ── */}
      {showDbSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowDbSearch(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">Search Product Database</h2>
            <input
              autoFocus
              placeholder="Search by name, SKU, or category…"
              value={dbQuery}
              onChange={(e) => setDbQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-org-sm border-2 border-org-primary text-org-md outline-none mb-4"
            />
            {dbQuery.length > 1 ? (
              <div>
                <p className="text-org-xs text-org-text-muted mb-2.5">{dbResults.length} result{dbResults.length !== 1 ? "s" : ""}</p>
                {dbResults.length === 0 ? (
                  <div className="text-center py-8 text-org-text-secondary">
                    <div className="flex justify-center mb-1.5"><Search size={32} /></div>
                    <p>No products match &ldquo;{dbQuery}&rdquo;</p>
                  </div>
                ) : dbResults.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 border border-org-border rounded-org-sm mb-2">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-org-medium text-org-text-primary truncate">{p.name}</p>
                      <p className="text-org-xs text-org-text-muted">{p.category} &middot; SKU: {p.sku} &middot; Stock: {p.stock}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-org-bold text-org-text-primary">{fmt(p.price)}</p>
                      <StatusBadge published={p.published} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-org-text-secondary">
                <div className="flex justify-center mb-1.5"><Package size={36} /></div>
                <p>Type at least 2 characters to search.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
