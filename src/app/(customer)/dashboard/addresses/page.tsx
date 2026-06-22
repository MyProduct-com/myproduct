"use client";
import { useState } from "react";
import { IconMapPin, IconPlus, IconTrash, IconEdit, IconCheck, IconX } from "@tabler/icons-react";
import { useAuthStore } from "@/store/authStore";

type AddressForm = {
  label: string;
  street: string;
  city: string;
  county: string;
  isDefault: boolean;
};

export default function AddressesPage() {
  const { user, login } = useAuthStore();
  const isCustomer = user?.role === "customer";
  const addresses = (user as any)?.addresses ?? [];

  const emptyForm: AddressForm = { label: "Home", street: "", city: "", county: "", isDefault: false };
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);

  if (!user) return null;

  const saveUserAddresses = (newAddresses: any[]) => {
    // reuse login to persist updated user object
    login({ ...(user as any), addresses: newAddresses });
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingIndex(null);
    setShowForm(true);
  };

  const handleEdit = (idx: number) => {
    const a = addresses[idx];
    setForm({ label: a.label, street: a.street, city: a.city, county: a.county, isDefault: !!a.isDefault });
    setEditingIndex(idx);
    setShowForm(true);
  };

  const handleDelete = (idx: number) => {
    const filtered = addresses.filter((_: any, i: number) => i !== idx);
    saveUserAddresses(filtered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr = { id: Date.now().toString(), ...form };
    let next: any[] = [];
    if (editingIndex !== null) {
      next = addresses.map((a: any, i: number) => (i === editingIndex ? { ...a, ...newAddr } : a));
    } else {
      next = [...addresses, newAddr];
    }

    if (form.isDefault) {
      next = next.map((a: any, i: number) => ({ ...a, isDefault: i === next.length - 1 ? true : !!a.isDefault }));
      // ensure only one default
      next = next.map((a: any, i: number) => ({ ...a, isDefault: a.isDefault && (form.isDefault ? a.id === newAddr.id : a.isDefault) }));
    }

    // If setting default on edit, normalize defaults
    if (form.isDefault && editingIndex !== null) {
      next = next.map((a: any, i: number) => ({ ...a, isDefault: i === editingIndex }));
    }

    saveUserAddresses(next);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Addresses</h1>
          <p className="text-sm text-gray-500">Manage your saved delivery addresses</p>
        </div>
        <div>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm">
            <IconPlus size={16} /> Add Address
          </button>
        </div>
      </div>

      {!isCustomer ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6">Only customers can manage addresses.</div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <IconMapPin size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900 mb-1">No addresses saved</p>
          <p className="text-sm text-gray-500 mb-4">Add a delivery address to speed up checkout.</p>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm">
            <IconPlus size={16} /> Add Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((a: any, idx: number) => (
            <div key={a.id ?? idx} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <IconMapPin size={18} className="text-green-600" />
                  <p className="font-semibold text-gray-900">{a.label} {a.isDefault ? <span className="text-xs text-white bg-green-600 px-2 py-0.5 rounded-full ml-2">Default</span> : null}</p>
                </div>
                <p className="text-sm text-gray-500 mt-1">{a.street}, {a.city}, {a.county}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleEdit(idx)} className="text-sm text-gray-600 hover:text-gray-900">
                  <IconEdit size={18} />
                </button>
                <button onClick={() => handleDelete(idx)} className="text-sm text-red-500 hover:text-red-600">
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <IconX size={18} />
            </button>
            <h2 className="Text-lg font-semibold mb-3">{editingIndex !== null ? "Edit Address" : "Add Address"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Label</label>
                <input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Street</label>
                <input value={form.street} onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">City</label>
                  <input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">County</label>
                  <input value={form.county} onChange={(e) => setForm((f) => ({ ...f, county: e.target.value }))} className="w-full px-4 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="default" type="checkbox" checked={form.isDefault} onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))} />
                <label htmlFor="default" className="text-sm text-gray-700">Set as default address</label>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-green-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
