"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, ArrowLeft, ShieldCheck } from "lucide-react";
import { MOCK_SHOPS } from "@/super_admin/data/mockData";
import { getLogoIcon } from "@/lib/logoIcons";
import { useShopAdminSession, type ShopAdminSession } from "@/store/shopAdminSessionStore";

interface ClientShopOption {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  packageName: string;
  logoIcon: string;
  tagline: string;
  address: string;
  phone: string;
  status: string;
}

function loadClientShops(): ClientShopOption[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("sa-shops");
    if (raw) {
      const parsed = JSON.parse(raw) as Array<Record<string, string>>;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((s) => ({
          id: s.id,
          name: s.name,
          ownerName: s.ownerName,
          ownerEmail: s.ownerEmail,
          packageName: s.packageName,
          logoIcon: s.logoIcon || "Store",
          tagline: s.tagline || "",
          address: s.address || "",
          phone: s.ownerPhone || "",
          status: s.status || "active",
        }));
      }
    }
  } catch {
    // fall through to mocks
  }
  return MOCK_SHOPS.map((s) => ({
    id: s.id,
    name: s.name,
    ownerName: s.ownerName,
    ownerEmail: s.ownerEmail,
    packageName: s.packageName,
    logoIcon: s.logoIcon,
    tagline: s.tagline,
    address: s.address,
    phone: s.ownerPhone,
    status: s.status,
  }));
}

function toSession(shop: ClientShopOption): ShopAdminSession {
  return {
    shopId: shop.id,
    shopName: shop.name,
    ownerName: shop.ownerName,
    ownerEmail: shop.ownerEmail,
    packageName: shop.packageName,
    logoIcon: shop.logoIcon,
    tagline: shop.tagline,
    address: shop.address,
    phone: shop.phone,
  };
}

function ShopLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselect = searchParams.get("shopId");
  const login = useShopAdminSession((s) => s.login);
  const existing = useShopAdminSession((s) => s.session);

  const [shops, setShops] = useState<ClientShopOption[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setShops(loadClientShops());
  }, []);

  useEffect(() => {
    if (existing) router.replace("/shop_admin");
  }, [existing, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.ownerEmail.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q)
    );
  }, [shops, query]);

  const enterAs = (shop: ClientShopOption) => {
    login(toSession(shop));
    router.push("/shop_admin");
  };

  useEffect(() => {
    if (!preselect || shops.length === 0) return;
    const match = shops.find((s) => s.id === preselect);
    if (match) enterAs(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselect, shops]);

  return (
    <div className="min-h-screen bg-[#F4F6F2] flex flex-col">
      <header className="h-14 bg-white border-b border-[#E4E8E2] flex items-center px-4 sm:px-6 justify-between">
        <Link href="/" className="flex items-center gap-2 text-[#1B3A2B] font-semibold">
          <ShieldCheck size={18} />
          MyProduct
        </Link>
        <Link href="/super_admin" className="text-sm text-[#6B716C] hover:text-[#1B3A2B]">
          Company admin →
        </Link>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[#6B716C] hover:text-[#1B3A2B] mb-6">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="bg-white rounded-2xl border border-[#E4E8E2] shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#E8EFE9] text-[#1B3A2B] flex items-center justify-center">
              <Store size={18} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#111827]">Shop client sign-in</h1>
              <p className="text-sm text-[#6B716C]">
                You are a MyProduct client. Choose your shop to open its admin panel.
              </p>
            </div>
          </div>

          <p className="text-xs text-[#6B716C] mb-4 mt-4">
            Demo mode: pick your shop as the client identity. Platform reminders from Super Admin
            only appear for <strong>this</strong> shop.
          </p>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shop, owner, or email…"
            className="w-full mb-4 px-3 py-2.5 rounded-lg border border-[#E4E8E2] text-sm outline-none focus:border-[#1B3A2B]"
          />

          <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-[#6B716C] text-center py-8">No shops found.</p>
            ) : (
              filtered.map((shop) => {
                const Icon = getLogoIcon(shop.logoIcon);
                return (
                  <button
                    key={shop.id}
                    type="button"
                    onClick={() => enterAs(shop)}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#E4E8E2] hover:border-[#1B3A2B] hover:bg-[#F4F6F2] text-left transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#E8EFE9] text-[#1B3A2B] flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#111827] truncate">{shop.name}</p>
                      <p className="text-xs text-[#6B716C] truncate">
                        {shop.ownerName} · {shop.ownerEmail}
                      </p>
                      <p className="text-xs text-[#6B716C]">
                        {shop.packageName} · {shop.status}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ShopLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F2]" />}>
      <ShopLoginContent />
    </Suspense>
  );
}
