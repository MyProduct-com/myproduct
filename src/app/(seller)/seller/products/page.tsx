"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { mockProducts } from "@/lib/mock-data";
import type { ProductStatus } from "@/types/product";

const DEMO_SELLER_ID = "seller-2";

const STATUS_CONFIG: Record<ProductStatus, { label: string; cls: string }> = {
  live: { label: "Live", cls: "bg-org-success-bg text-org-success" },
  draft: { label: "Draft", cls: "bg-org-surface-alt text-org-text-secondary" },
  out_of_stock: { label: "Out of Stock", cls: "bg-org-danger-bg text-org-danger" },
};

export default function SellerProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

  const sellerProducts = mockProducts.filter((p) => p.sellerId === DEMO_SELLER_ID);

  const filtered = sellerProducts.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Products</h1>
        <Link
          href="/seller/products/add"
          className="inline-flex items-center justify-center gap-2 bg-org-primary hover:bg-org-primary-hover text-white font-org-semibold px-4 py-2.5 rounded-org-sm text-org-sm transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-org-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU..."
            className="w-full pl-9 pr-4 py-2.5 border border-org-border rounded-org-sm text-org-sm outline-none focus:border-org-primary transition-all bg-org-surface text-org-text-primary"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {(["all", "live", "draft", "out_of_stock"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-org-sm text-org-sm font-org-medium transition-colors capitalize whitespace-nowrap shrink-0 ${
                statusFilter === s
                  ? "bg-org-primary text-white"
                  : "bg-org-surface text-org-text-secondary border border-org-border hover:border-org-primary"
              }`}
            >
              {s === "all" ? "All" : s === "out_of_stock" ? "Out of Stock" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: sellerProducts.length },
          { label: "Live", value: sellerProducts.filter((p) => p.status === "live").length },
          { label: "Low Stock", value: sellerProducts.filter((p) => p.stock <= 10 && p.stock > 0).length },
        ].map((s) => (
          <div key={s.label} className="bg-org-surface rounded-org-card shadow-org-card px-4 py-3 text-center">
            <p className="text-org-xl font-org-bold text-org-text-primary">{s.value}</p>
            <p className="text-org-xs text-org-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {filtered.map((p) => {
          const sc = STATUS_CONFIG[p.status];
          const isLowStock = p.stock <= 10 && p.stock > 0;
          return (
            <div key={p.id} className="bg-org-surface rounded-org-card shadow-org-card p-3.5">
              <div className="flex items-center gap-3">
                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-org-surface-alt shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-org-medium text-org-text-primary truncate">{p.name}</p>
                  <p className="text-org-xs text-org-text-muted font-mono">{p.sku}</p>
                </div>
                <span className={`text-org-xs font-org-semibold px-2.5 py-1 rounded-org-pill shrink-0 ${sc.cls}`}>{sc.label}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-org-border text-org-sm">
                <span className="font-org-semibold text-org-text-primary">KES {p.price.toLocaleString()}</span>
                <span className={isLowStock ? "text-org-warning font-org-semibold" : "text-org-text-secondary"}>
                  {p.stock === 0 ? <span className="text-org-danger">0 in stock</span> : `${p.stock} in stock`}
                </span>
                <span className="text-org-text-secondary">{p.sales} sold</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Link href={`/products/${p.id}`} className="flex-1 text-center text-org-xs font-org-medium text-org-text-secondary bg-org-surface-alt rounded-org-sm py-2">View</Link>
                <button className="flex-1 text-center text-org-xs font-org-medium text-org-primary bg-org-primary-light rounded-org-sm py-2">Edit</button>
                <button className="w-9 h-9 flex items-center justify-center rounded-org-sm text-org-danger bg-org-danger-bg shrink-0"><Trash2 size={14} /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-org-sm text-org-text-secondary text-center py-8">No products match your filters.</p>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-org-surface rounded-org-card shadow-org-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-org-sm">
            <thead className="bg-org-surface-alt border-b border-org-border">
              <tr className="text-org-xs text-org-text-muted uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-org-medium">Product</th>
                <th className="px-4 py-3 text-left font-org-medium">SKU</th>
                <th className="px-4 py-3 text-left font-org-medium">Status</th>
                <th className="px-4 py-3 text-right font-org-medium">Price</th>
                <th className="px-4 py-3 text-right font-org-medium">Stock</th>
                <th className="px-4 py-3 text-right font-org-medium">Sales</th>
                <th className="px-4 py-3 text-right font-org-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-org-border">
              {filtered.map((p) => {
                const sc = STATUS_CONFIG[p.status];
                const isLowStock = p.stock <= 10 && p.stock > 0;
                return (
                  <tr key={p.id} className="hover:bg-org-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-org-surface-alt shrink-0" />
                        <div className="min-w-0">
                          <p className="font-org-medium text-org-text-primary truncate max-w-[200px]">{p.name}</p>
                          <p className="text-org-xs text-org-text-muted">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-org-text-muted font-mono text-org-xs">{p.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`text-org-xs font-org-semibold px-2.5 py-1 rounded-org-pill ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-org-semibold text-org-text-primary">
                      KES {p.price.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-right font-org-semibold ${isLowStock ? "text-org-warning" : "text-org-text-primary"}`}>
                      {p.stock === 0 ? <span className="text-org-danger">0</span> : p.stock}
                      {isLowStock && p.stock > 0 && (
                        <span className="ml-1 text-[10px] text-org-warning">(low)</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-org-text-secondary">{p.sales}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${p.id}`}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-text-primary hover:bg-org-surface-alt transition-colors"
                          title="View"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-primary hover:bg-org-primary-light transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-org-text-muted hover:text-org-danger hover:bg-org-danger-bg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-org-border text-org-xs text-org-text-muted">
          Showing {filtered.length} of {sellerProducts.length} products
        </div>
      </div>
    </div>
  );
}
