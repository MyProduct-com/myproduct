"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  NOTIFICATIONS_EVENT,
  clearDismissedForVisible,
  dismissNotification,
  listForShopAdmin,
  listForShopCustomers,
  readDismissedIds,
} from "./bus";
import type { AppNotification } from "./types";

type AudienceMode = "shop_admin" | "shop_customers";

/**
 * Live notification feed for a role + shop. Reacts to localStorage updates
 * (including other tabs via the `storage` event).
 */
export function useNotifications(shopId: string, mode: AudienceMode) {
  const consumerKey = `${mode}:${shopId}`;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(NOTIFICATIONS_EVENT, bump);
    const onStorage = (e: StorageEvent) => {
      if (
        e.key === "mp-shared-notifications" ||
        (e.key && e.key.startsWith("mp-notif-dismissed:"))
      ) {
        bump();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(NOTIFICATIONS_EVENT, bump);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const all = useMemo(() => {
    void tick;
    return mode === "shop_admin"
      ? listForShopAdmin(shopId)
      : listForShopCustomers(shopId);
  }, [shopId, mode, tick]);

  const dismissed = useMemo(() => {
    void tick;
    return new Set(readDismissedIds(consumerKey));
  }, [consumerKey, tick]);

  const visible = useMemo(
    () => all.filter((n) => !dismissed.has(n.id)),
    [all, dismissed]
  );

  const dismiss = useCallback(
    (id: string) => {
      dismissNotification(consumerKey, id);
      setTick((t) => t + 1);
    },
    [consumerKey]
  );

  const clearAll = useCallback(() => {
    clearDismissedForVisible(
      consumerKey,
      all.map((n) => n.id)
    );
    setTick((t) => t + 1);
  }, [consumerKey, all]);

  return {
    notifications: visible,
    allNotifications: all,
    dismiss,
    clearAll,
  };
}

export type { AppNotification };
