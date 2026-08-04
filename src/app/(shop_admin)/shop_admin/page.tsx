"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPanel from "@/shop_admin/AdminPanel";
import { useShopAdminSession } from "@/store/shopAdminSessionStore";

/**
 * Shop Admin (client) dashboard.
 * Requires a per-shop session from /auth/shop-login so reminders are scoped
 * to that client only — Super Admin is the company; Shop Admin is the client.
 */
export default function ShopAdminPage() {
  const router = useRouter();
  const session = useShopAdminSession((s) => s.session);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);
    finish();
    return useShopAdminSession.persist.onFinishHydration(finish);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!session) router.replace("/auth/shop-login");
  }, [hydrated, session, router]);

  if (!hydrated || !session) {
    return (
      <div className="min-h-screen bg-[#F4F6F2] flex items-center justify-center text-sm text-[#6B716C]">
        Loading client workspace…
      </div>
    );
  }

  return <AdminPanel />;
}
