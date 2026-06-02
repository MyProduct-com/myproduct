"use client";
import { useState } from "react";
import { IconUser, IconMail, IconPhone, IconCheck, IconMapPin, IconPlus } from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
  const { user, login } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
  });

  const handleSave = () => {
    if (user) {
      login({ ...user, name: form.name, email: form.email, phone: form.phone });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputCls =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all";

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-bold text-gray-900">My Profile</h1>

      {/* Avatar */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 text-2xl font-bold flex items-center justify-center flex-shrink-0">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role} account</p>
            <button className="text-xs text-green-600 font-semibold hover:underline mt-1">
              Change photo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <IconUser size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <IconMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <div className="relative">
              <IconPhone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              saved ? "bg-green-100 text-green-700" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {saved && <IconCheck size={16} />}
            {saved ? "Changes Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Saved Addresses</h2>
          <button className="flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:underline">
            <IconPlus size={15} /> Add New
          </button>
        </div>
        <div className="p-4 border border-gray-200 rounded-xl flex items-start gap-3">
          <IconMapPin size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">Home</p>
            <p className="text-sm text-gray-500">123 Ngong Road, Nairobi, Kenya</p>
            <div className="flex gap-3 mt-2">
              <button className="text-xs text-green-600 font-semibold hover:underline">Edit</button>
              <button className="text-xs text-red-500 font-semibold hover:underline">Remove</button>
            </div>
          </div>
          <span className="ml-auto text-[10px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
            Default
          </span>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Change Password</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Current password" className={inputCls} />
          <input type="password" placeholder="New password" className={inputCls} />
          <input type="password" placeholder="Confirm new password" className={inputCls} />
          <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
