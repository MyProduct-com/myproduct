"use client";
import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconCheck, IconX, IconEye } from "@tabler/icons-react";
import { mockProducts, mockSellers } from "@/lib/mock-data";
import { useEffect } from "react";
import type { ProductStatus } from "@/types/product";

const STATUS_CONFIG: Record<ProductStatus, { label: string; cls: string }> = {
  live: { label: "Live", cls: "bg-green-50 text-green-700 border-green-200" },
  draft: { label: "Draft", cls: "bg-gray-50 text-gray-600 border-gray-200" },
  out_of_stock: { label: "Out of Stock", cls: "bg-red-50 text-red-700 border-red-200" },
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");
  const [sellerFilter, setSellerFilter] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [pageSize] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = mockProducts.filter((p) => {
    const matchesSearch =
      !debouncedSearch ||
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesSeller = sellerFilter === "all" || p.sellerId === sellerFilter;
    return matchesSearch && matchesStatus && matchesSeller;
  });

  // Only show results when admin searches or filters by seller, to avoid loading large lists.
  const shouldShowResults = !!debouncedSearch || sellerFilter !== "all";

  const shown = filtered.slice(0, page * pageSize);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">All Products</h1>
        <span className="text-sm text-gray-500">{mockProducts.length} total</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, seller, category..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={sellerFilter}
            onChange={(e) => {
              setSellerFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl text-sm border border-gray-200 bg-white"
          >
            <option value="all">All POS (select to filter)</option>
            {mockSellers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.storeName}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            {(["all", "live", "draft", "out_of_stock"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                  statusFilter === s
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
                }`}
              >
                {s === "all"
                  ? "All"
                  : s === "out_of_stock"
                  ? "Out of Stock"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {!shouldShowResults ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Please enter a search term or select a POS to find products. This avoids loading the entire product catalog.
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Seller</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Stock</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {shown.map((p) => {
                    const sc = STATUS_CONFIG[p.status];
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover bg-gray-100 shrink-0"
                            />
                            <p className="font-medium text-gray-900 max-w-40 truncate">{p.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.sellerName}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{p.category}</td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-900">
                          KES {p.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">{p.stock}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${sc.cls}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/products/${p.id}`}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <IconEye size={14} />
                            </Link>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors">
                              <IconCheck size={14} />
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <IconX size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 flex items-center justify-between">
              <div>
                Showing {shown.length} of {filtered.length} matched
              </div>
              <div>
                {shown.length < filtered.length ? (
                  <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-xl bg-green-600 text-white text-sm">
                    Load more
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
