import type { AppNotification, ShopRecipient } from "./types";

export const NOTIFICATIONS_STORAGE_KEY = "mp-shared-notifications";
export const NOTIFICATIONS_EVENT = "mp-notifications:change";

const MAX_ITEMS = 400;

function dismissKey(consumerKey: string) {
  return `mp-notif-dismissed:${consumerKey}`;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readAllNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  const list = safeParse<AppNotification[]>(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY), []);
  return Array.isArray(list) ? list : [];
}

export function writeAllNotifications(items: AppNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT));
}

export function publishNotifications(items: AppNotification[]) {
  if (items.length === 0) return;
  const next = [...items, ...readAllNotifications()];
  writeAllNotifications(next);
}

export function readDismissedIds(consumerKey: string): string[] {
  if (typeof window === "undefined") return [];
  const list = safeParse<string[]>(localStorage.getItem(dismissKey(consumerKey)), []);
  return Array.isArray(list) ? list : [];
}

export function dismissNotification(consumerKey: string, id: string) {
  if (typeof window === "undefined") return;
  const prev = readDismissedIds(consumerKey);
  if (prev.includes(id)) return;
  localStorage.setItem(dismissKey(consumerKey), JSON.stringify([...prev, id]));
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT));
}

export function clearDismissedForVisible(consumerKey: string, visibleIds: string[]) {
  if (typeof window === "undefined") return;
  const prev = readDismissedIds(consumerKey);
  const merged = Array.from(new Set([...prev, ...visibleIds]));
  localStorage.setItem(dismissKey(consumerKey), JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent(NOTIFICATIONS_EVENT));
}

function personalize(
  template: string,
  shop: ShopRecipient,
  extras?: { days?: number }
): string {
  const days =
    extras?.days ??
    Math.ceil((new Date(shop.expiresAt).getTime() - Date.now()) / 86400000);
  return template
    .split("{{name}}").join(shop.ownerName)
    .split("{{shop}}").join(shop.name)
    .split("{{package}}").join(shop.packageName)
    .split("{{days}}").join(String(days));
}

function genId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Super Admin reminder → one inbox item per recipient shop (Shop Admin audience).
 */
export function fanOutPlatformReminder(input: {
  reminderId: string;
  title: string;
  message: string;
  createdBy: string;
  recipients: ShopRecipient[];
}): AppNotification[] {
  const createdAt = new Date().toISOString();
  const items: AppNotification[] = input.recipients.map((shop) => ({
    id: genId("ntf"),
    kind: "platform_reminder",
    audience: "shop_admin",
    shopId: shop.id,
    shopName: shop.name,
    title: personalize(input.title, shop),
    message: personalize(input.message, shop),
    createdAt,
    createdBy: input.createdBy,
    createdByRole: "super_admin",
    sourceId: input.reminderId,
    href: "/shop_admin",
  }));
  publishNotifications(items);
  return items;
}

/**
 * Shop Admin broadcast → visible on that shop's storefront for customers.
 */
export function publishShopAnnouncement(input: {
  shopId: string;
  shopName: string;
  title: string;
  message: string;
  createdBy: string;
}): AppNotification {
  const item: AppNotification = {
    id: genId("ann"),
    kind: "shop_announcement",
    audience: "shop_customers",
    shopId: input.shopId,
    shopName: input.shopName,
    title: input.title.trim(),
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy,
    createdByRole: "shop_admin",
    href: `/market/${input.shopId}`,
  };
  publishNotifications([item]);
  return item;
}

export function listForShopAdmin(
  shopId: string,
  opts?: { /** Demo shop_admin panel: show platform messages for every shop. */
    allShops?: boolean }
): AppNotification[] {
  const rows = readAllNotifications().filter((n) => n.audience === "shop_admin");
  if (opts?.allShops) return rows;
  return rows.filter((n) => n.shopId === shopId);
}

export function listForShopCustomers(shopId: string): AppNotification[] {
  return readAllNotifications().filter(
    (n) => n.audience === "shop_customers" && n.shopId === shopId
  );
}
