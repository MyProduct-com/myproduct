/**
 * Shared cross-role notification contract.
 * Persisted in localStorage until a real notifications API exists.
 */

export type NotificationAudience = "shop_admin" | "shop_customers";

export type NotificationKind =
  | "platform_reminder"
  | "shop_announcement"
  | "system";

export type NotificationSenderRole = "super_admin" | "shop_admin" | "system";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  /** Who should see this. */
  audience: NotificationAudience;
  /** Target shop. Required for both shop_admin and shop_customers rows. */
  shopId: string;
  shopName: string;
  title: string;
  message: string;
  createdAt: string;
  createdBy: string;
  createdByRole: NotificationSenderRole;
  /** Optional link target inside the product (relative path). */
  href?: string;
  /** Originating reminder / announcement id for audit. */
  sourceId?: string;
}

export interface ShopRecipient {
  id: string;
  name: string;
  ownerName: string;
  packageName: string;
  expiresAt: string;
}
