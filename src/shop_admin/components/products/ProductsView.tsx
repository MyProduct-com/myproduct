"use client";
import { useState } from "react";
import type { Theme } from "../../types/index";
import { SectionHeader, Btn, Badge, Modal, Input, Select, Table } from "../layout/UI";
import { fmt } from "../../utils/helpers";
import { useProductStore } from "@/store/productStore";
import type { SharedProduct } from "@/store/productStore";

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
  theme: Theme;
  products?: SharedProduct[];
  onUpdate?: (products: SharedProduct[]) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function ProductsView({ theme, onToast }: ProductsViewProps) {
  // ── Shared store ───────────────────────────────────────────────────────────
  const products      = useProductStore((s) => s.products);
  const addProduct    = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const togglePublish = useProductStore((s) => s.togglePublish);

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [search, setSearch]               = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [showModal, setShowModal]         = useState(false);
  const [editProduct, setEditProduct]     = useState<SharedProduct | null>(null);
  const [form, setForm]                   = useState<ProductFormState>(EMPTY_FORM);
  const [showDbSearch, setShowDbSearch]   = useState(false);
  const [dbQuery, setDbQuery]             = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<SharedProduct | null>(null);

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus =
      statusFilter === "All" ||
      (statusFilter === "Published" ? p.published : !p.published);
    return matchSearch && matchCat && matchStatus;
  });

  // ── Open modals ────────────────────────────────────────────────────────────
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

  // ── Save ───────────────────────────────────────────────────────────────────
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

  // ── Toggle publish ─────────────────────────────────────────────────────────
  const handleTogglePublish = (p: SharedProduct) => {
    togglePublish(p.id);
    onToast(
      p.published
        ? `"${p.name}" unpublished — hidden from shop.`
        : `"${p.name}" published — now visible in shop! 🎉`,
      p.published ? "info" : "success"
    );
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
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

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      header: "Product", key: "name",
      render: (p: SharedProduct) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {p.image ? (
            <img src={p.image} alt={p.name}
              style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              📦
            </div>
          )}
          <div>
            <div style={{ fontWeight: 700, color: theme.black }}>{p.name}</div>
            <div style={{ fontSize: 11, color: theme.textMuted }}>SKU: {p.sku}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Category", key: "category",
      render: (p: SharedProduct) => <span style={{ fontSize: 12, color: theme.textMuted }}>{p.category}</span>,
    },
    {
      header: "Price", key: "price",
      render: (p: SharedProduct) => <span style={{ fontWeight: 700, color: theme.black }}>{fmt(p.price)}</span>,
    },
    {
      header: "Stock", key: "stock",
      render: (p: SharedProduct) => (
        <span style={{
          fontWeight: 700,
          color: p.stock === 0 ? "#ef4444" : p.stock <= p.lowStockThreshold ? "#f59e0b" : theme.primary,
        }}>
          {p.stock} {p.unit}
          {p.stock === 0 && <span style={{ marginLeft: 6, fontSize: 10 }}>❌ Out of stock</span>}
          {p.stock > 0 && p.stock <= p.lowStockThreshold && <span style={{ marginLeft: 6, fontSize: 10 }}>⚠️ Low</span>}
        </span>
      ),
    },
    {
      header: "Shop Status", key: "published",
      render: (p: SharedProduct) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Badge status={p.published ? "Published" : "Draft"} />
          {p.published && p.stock === 0 && (
            <span style={{ fontSize: 10, color: "#ef4444" }}>Hidden (no stock)</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions", key: "actions",
      render: (p: SharedProduct) => (
        <div style={{ display: "flex", gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <Btn theme={theme} variant="ghost" small onClick={() => openEdit(p)}>✏️ Edit</Btn>
          <Btn theme={theme} variant={p.published ? "secondary" : "primary"} small onClick={() => handleTogglePublish(p)}>
            {p.published ? "Unpublish" : "Publish"}
          </Btn>
          <Btn theme={theme} variant="danger" small onClick={() => setDeleteConfirm(p)}>🗑</Btn>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      <SectionHeader
        title="Products"
        subtitle={`${products.filter((p) => p.published).length} published · ${products.filter((p) => !p.published).length} drafts · changes reflect in shop instantly`}
        theme={theme}
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowDbSearch(true)}>🔍 Browse DB</Btn>
            <Btn theme={theme} onClick={openAdd}>+ Add Product</Btn>
          </div>
        }
      />

      {/* Info banner */}
      <div style={{
        background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8,
        padding: "10px 14px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 13, color: "#15803d",
      }}>
        <span>💡</span>
        <span>
          <strong>How it works:</strong> Add a product → saved as <strong>Draft</strong>.
          Click <strong>Publish</strong> → appears in shop immediately.
          Click <strong>Unpublish</strong> → hidden from customers instantly.
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <input
            placeholder="Search name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              borderRadius: theme.radius, border: `1.5px solid ${theme.border}`,
              fontSize: 13, boxSizing: "border-box", background: theme.surface, outline: "none",
            }}
          />
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}>🔍</span>
        </div>
        <select
          value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, background: theme.surface }}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, background: theme.surface }}
        >
          <option value="All">All Status</option>
          <option value="Published">Published</option>
          <option value="Draft">Draft</option>
        </select>
      </div>

      <Table columns={columns} data={filtered} theme={theme} emptyMessage="No products found." />

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <Modal
          title={editProduct ? `Edit — ${editProduct.name}` : "Add New Product"}
          onClose={() => setShowModal(false)} theme={theme} width={600}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Product Name *" value={form.name} onChange={setField("name")} theme={theme} required />
            </div>
            <Input label="Selling Price (KSh) *" value={form.price} onChange={setField("price")} type="number" theme={theme} required />
            <Input label="Cost Price (KSh)" value={form.costPrice} onChange={setField("costPrice")} type="number" theme={theme} />
            <Input label="Unit" value={form.unit} onChange={setField("unit")} placeholder="KG, Bunch, 500ml…" theme={theme} />
            <Select label="Category" value={form.category} onChange={setField("category")} theme={theme}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
            <Input label="Stock Qty" value={form.stock} onChange={setField("stock")} type="number" theme={theme} />
            <Input label="Low Stock Alert at" value={form.lowStockThreshold} onChange={setField("lowStockThreshold")} type="number" theme={theme} />
            <Input label="SKU" value={form.sku} onChange={setField("sku")} theme={theme} />
            <Input label="Supplier" value={form.supplier} onChange={setField("supplier")} theme={theme} />
            <div style={{ gridColumn: "1 / -1" }}>
              <Input label="Image URL" value={form.image} onChange={setField("image")} theme={theme} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 5, textTransform: "uppercase" }}>
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setField("description")(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
              />
            </div>
          </div>

          {form.image && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Image preview:</div>
              <img src={form.image} alt="preview" style={{ height: 80, borderRadius: 8, objectFit: "cover" }} />
            </div>
          )}

          {!editProduct && (
            <div style={{ marginTop: 12, padding: "8px 12px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" }}>
              ℹ️ Saved as <strong>Draft</strong> — won&apos;t appear in shop until you click <strong>Publish</strong>.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn theme={theme} onClick={handleSave}>{editProduct ? "Save Changes" : "Add Product"}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <Modal title="Delete Product?" onClose={() => setDeleteConfirm(null)} theme={theme} width={400}>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗑️</div>
            <p style={{ fontWeight: 700, fontSize: 16, color: theme.black, marginBottom: 6 }}>
              Delete &ldquo;{deleteConfirm.name}&rdquo;?
            </p>
            <p style={{ fontSize: 13, color: theme.textMuted, marginBottom: 20 }}>
              This permanently removes it from the shop and admin panel. Cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn theme={theme} variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Btn>
              <Btn theme={theme} variant="danger" onClick={confirmDelete}>Yes, delete it</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── DB Search Modal ── */}
      {showDbSearch && (
        <Modal title="Search Product Database" onClose={() => setShowDbSearch(false)} theme={theme}>
          <input
            autoFocus
            placeholder="Search by name, SKU, or category…"
            value={dbQuery}
            onChange={(e) => setDbQuery(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px", borderRadius: theme.radius,
              border: `2px solid ${theme.primary}`, fontSize: 15,
              boxSizing: "border-box", outline: "none", marginBottom: 16,
            }}
          />
          {dbQuery.length > 1 ? (
            <div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 10 }}>
                {dbResults.length} result{dbResults.length !== 1 ? "s" : ""}
              </div>
              {dbResults.length === 0 ? (
                <div style={{ textAlign: "center", padding: 32, color: theme.textMuted }}>
                  <div style={{ fontSize: 36 }}>🔍</div>
                  <p>No products match &ldquo;{dbQuery}&rdquo;</p>
                </div>
              ) : dbResults.map((p) => (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px",
                  border: `1px solid ${theme.border}`, borderRadius: theme.radius, marginBottom: 8,
                }}>
                  <img src={p.image} alt={p.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: theme.black }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>
                      {p.category} · SKU: {p.sku} · Stock: {p.stock}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: theme.accent }}>{fmt(p.price)}</div>
                    <Badge status={p.published ? "Published" : "Draft"} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: 32, color: theme.textMuted }}>
              <div style={{ fontSize: 40 }}>📦</div>
              <p>Type at least 2 characters to search.</p>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}