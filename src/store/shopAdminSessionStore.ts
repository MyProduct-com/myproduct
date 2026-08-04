"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Per-client Shop Admin identity.
 * Super Admin (company) manages many shops; each Shop Admin session is one client shop.
 */
export interface ShopAdminSession {
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  packageName: string;
  logoIcon: string;
  tagline: string;
  address: string;
  phone: string;
}

interface ShopAdminSessionStore {
  session: ShopAdminSession | null;
  login: (session: ShopAdminSession) => void;
  logout: () => void;
}

export const useShopAdminSession = create<ShopAdminSessionStore>()(
  persist(
    (set) => ({
      session: null,
      login: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    { name: "mp-shop-admin-session" }
  )
);
