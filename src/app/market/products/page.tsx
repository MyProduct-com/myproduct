"use client";
import { Suspense } from "react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { IconSearch, IconFilter, IconX, IconAdjustmentsHorizontal } from "@tabler/icons-react";
import ProductCard from "@/components/ui/ProductCard";
import { mockProducts } from "@/lib/mock-data";
import { ProductCategory } from "@/types/product";

const CATEGORIES: ProductCategory[] = [
  "Electronics", "Fashion", "Beauty & Health", "Grocery",
  "Home & Office", "Computing", "Stationery", "Sports",
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "newest", label: "Newest First" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialQ = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(initialQ);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(50000);

  const filtered = useMemo(() => {
    let products = [...mockProducts].filter((p) => p.status !== "draft");

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (category) {
      products = products.filter((p) => p.category === category);
    }

    products = products.filter((p) => p.price <= priceMax);

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        products.sort((a, b) => b.sales - a.sales);
    }

    return products;
  }, [search, category, sort, priceMax]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">
          {category ? category : search ? `Results for "${search}"` : "All Products"}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} products found</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`w-52 flex-shrink-0 hidden lg:block`}>
          <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm">Filters</h3>

            {/* Category */}
            <div className="mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <div className="space-y-1">
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                    !category ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c === category ? "" : c)}
                    className={`w-full text-left text-sm px-2.5 py-1.5 rounded-lg transition-colors ${
                      category === c ? "bg-green-50 text-green-700 font-medium" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Max Price: KES {priceMax.toLocaleString()}
              </p>
              <input
                type="range"
                min={500}
                max={50000}
                step={500}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>KES 500</span>
                <span>KES 50,000</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IconX size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-green-400 transition-colors"
              >
                <IconAdjustmentsHorizontal size={16} />
                Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-green-500 bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden bg-white rounded-xl border border-gray-100 p-4 mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <IconFilter size={16} /> Filter by Category
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory("")}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !category ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  All
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c === category ? "" : c)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      category === c ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active filters */}
          {(category || search) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full border border-green-200">
                  {category}
                  <button onClick={() => setCategory("")}><IconX size={12} /></button>
                </span>
              )}
              {search && (
                <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-200">
                  &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch("")}><IconX size={12} /></button>
                </span>
              )}
            </div>
          )}

          {/* Products grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-lg font-semibold text-gray-900 mb-1">No products found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
              <button
                onClick={() => { setSearch(""); setCategory(""); }}
                className="mt-4 text-sm text-green-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12 text-center text-gray-400">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
