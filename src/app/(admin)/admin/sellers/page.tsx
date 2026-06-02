"use client";
import { useState } from "react";
import {
  IconSearch,
  IconCheck,
  IconX,
  IconShieldCheck,
  IconStar,
  IconPackage,
  IconShoppingCart,
} from "@tabler/icons-react";
import { mockSellers } from "@/lib/mock-data";

const PLAN_COLORS: Record<string, string> = {
  starter: "bg-gray-100 text-gray-600",
  growth: "bg-blue-50 text-blue-700",
  business: "bg-purple-50 text-purple-700",
  enterprise: "bg-orange-50 text-orange-700",
};

export default function AdminSellersPage() {
  const [search, setSearch] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "pending">("all");

  const filtered = mockSellers.filter((s) => {
    const matchesSearch =
      !search ||
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase());
    const matchesVerified =
      verifiedFilter === "all" ||
      (verifiedFilter === "verified" && s.isVerified) ||
      (verifiedFilter === "pending" && !s.isVerified);
    return matchesSearch && matchesVerified;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Sellers</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="bg-orange-100 text-orange-700 font-semibold px-2.5 py-1 rounded-full">
            {mockSellers.filter((s) => !s.isVerified).length} pending approval
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sellers..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "verified", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setVerifiedFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                verifiedFilter === f
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Sellers grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((seller) => (
          <div
            key={seller.id}
            className={`bg-white rounded-xl border overflow-hidden ${
              !seller.isVerified ? "border-orange-200" : "border-gray-100"
            }`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
                    {seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{seller.storeName}</p>
                      {seller.isVerified && (
                        <IconShieldCheck size={15} className="text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{seller.email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  {seller.isVerified ? (
                    <span className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  ) : (
                    <span className="text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${PLAN_COLORS[seller.plan]}`}>
                    {seller.plan}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">{seller.location} &bull; Joined {seller.joinedAt}</p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: "Rating", value: seller.storeRating.toFixed(1), icon: <IconStar size={12} />, color: "text-yellow-600" },
                  { label: "Sales", value: seller.totalSales.toLocaleString(), icon: <IconShoppingCart size={12} /> },
                  { label: "Products", value: seller.productCount.toString(), icon: <IconPackage size={12} /> },
                  { label: "Revenue", value: `${(seller.totalRevenue / 1000).toFixed(0)}k`, icon: null },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className={`text-sm font-bold text-gray-900 ${m.color ?? ""}`}>{m.value}</p>
                    <p className="text-[10px] text-gray-400">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!seller.isVerified ? (
                  <>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors">
                      <IconCheck size={14} /> Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors border border-red-200">
                      <IconX size={14} /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                      View Store
                    </button>
                    <button className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium border border-red-100 transition-colors">
                      Suspend
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
