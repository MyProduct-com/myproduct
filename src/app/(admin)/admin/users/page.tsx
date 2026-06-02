"use client";
import { useState } from "react";
import { IconSearch, IconUser, IconBan, IconShieldCheck } from "@tabler/icons-react";
import { mockCustomers, mockSellers } from "@/lib/mock-data";

const allUsers = [
  ...mockCustomers.map((c) => ({ ...c, type: "Customer" as const })),
  ...mockSellers.map((s) => ({ ...s, type: "Seller" as const })),
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "seller">("all");

  const filtered = allUsers.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Users</h1>
        <span className="text-sm text-gray-500">{allUsers.length} total users</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <IconSearch size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "seller"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRoleFilter(f)}
              className={`px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                roleFilter === f
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-green-400"
              }`}
            >
              {f === "all" ? "All Users" : f.charAt(0).toUpperCase() + f.slice(1) + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: allUsers.length },
          { label: "Customers", value: mockCustomers.length },
          { label: "Sellers", value: mockSellers.length },
          { label: "Verified Sellers", value: mockSellers.filter((s) => s.isVerified).length },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.role === "seller"
                          ? "bg-orange-50 text-orange-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {user.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{user.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-700 bg-gray-100 hover:bg-green-50 px-2.5 py-1.5 rounded-lg transition-colors">
                        <IconUser size={12} /> View
                      </button>
                      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 bg-gray-100 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors">
                        <IconBan size={12} /> Ban
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {allUsers.length} users
        </div>
      </div>
    </div>
  );
}
