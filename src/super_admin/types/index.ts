// ─── Super Admin Types ────────────────────────────────────────────────────────

export type SuperAdminView =
  | "dashboard"
  | "shops"
  | "isolation"
  | "onboarding"
  | "packages"
  | "dbterminal"
  | "issues"
  | "reminders"
  | "marketplace"
  | "admins";

export type SuperAdminPrivilege =
  | "dashboard"
  | "shops"
  | "isolation"
  | "onboarding"
  | "packages"
  | "dbterminal"
  | "issues"
  | "reminders"
  | "marketplace"
  | "admins";

export interface SuperAdmin {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  privilegeLevel: "full" | "partial";
  privileges: SuperAdminPrivilege[];
  createdAt: string;
  lastLogin: string;
  createdBy?: string;
}

export type ShopStatus = "active" | "suspended" | "pulled_down" | "trial" | "expired";

export interface ManagedShop {
  id: string;
  name: string;
  logoIcon: string;
  tagline: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  address: string;
  status: ShopStatus;
  packageId: string;
  packageName: string;
  packageShopLimit: number;
  shopsCreated: number;
  subscribedAt: string;
  expiresAt: string;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lastActivity: string;
  shopUrl: string;
  adminUrl: string;
  paymentDetails?: PaymentConfig;
  visitCount: number;
  cartAbandoned: number;
}

export interface PaymentConfig {
  mpesaPaybill?: string;
  mpesaBusinessName?: string;
  stripeKey?: string;
  bankName?: string;
  bankAccount?: string;
  bankBranch?: string;
}

export type PackageFeature =
  | "products"
  | "orders"
  | "pos"
  | "inventory"
  | "accounting"
  | "staff"
  | "analytics"
  | "api_access"
  | "custom_domain"
  | "marketplace";

export interface SystemPackage {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  shopLimit: number;
  features: PackageFeature[];
  featureDetails: Record<PackageFeature, string | number | boolean>;
  limits: {
    products: number;   // -1 = unlimited
    orders: number;
    staff: number;
    posTerminals: number;
  };
  popular?: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicket {
  id: string;
  shopId: string;
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  subject: string;
  category: "technical" | "billing" | "product" | "onboarding" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "shop_owner" | "super_admin" | "shop_admin" | "system";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  message: string;
  targetType: "all" | "expiring" | "expired" | "specific" | "package";
  targetPackageId?: string;
  targetShopIds?: string[];
  expiryDaysThreshold?: number;
  sentAt?: string;
  scheduledAt?: string;
  status: "draft" | "sent" | "scheduled";
  recipientCount: number;
  createdBy: string;
  createdAt: string;
}

export interface MarketplaceItem {
  id: string;
  shopId: string;
  shopName: string;
  productName: string;
  productImage: string;
  price: number;
  category: string;
  published: boolean;
  flagged: boolean;
  flagReason?: string;
  clicks: number;
  addedToCart: number;
  purchases: number;
  createdAt: string;
}

export interface SystemMetrics {
  totalShops: number;
  activeShops: number;
  suspendedShops: number;
  totalSubscribers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  totalProducts: number;
  abandonedCarts: number;
  totalPageViews: number;
  activeTickets: number;
  avgResponseTime: number; // hours
  packageBreakdown: { packageName: string; count: number; color: string }[];
  dailyVisits: { date: string; visits: number; uniqueVisitors: number }[];
  shopVisits: { shopId: string; shopName: string; visits: number; today: number }[];
}

export interface IsolationSession {
  shopId: string;
  shopUrl: string;
  loadedAt: string;
  notes: string;
  responses: IsolationLog[];
}

export interface IsolationLog {
  id: string;
  timestamp: string;
  type: "info" | "error" | "warning" | "success";
  message: string;
}

export interface OnboardingForm {
  // User / shop owner
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  password: string;
  // Shop info
  shopName: string;
  shopTagline: string;
  shopLogoIcon: string;
  shopAddress: string;
  // Package
  packageId: string;
  // Payment
  paymentMethod: string;
  // Credentials to send
  sendCredentials: boolean;
}

export interface DBQuery {
  id: string;
  sql: string;
  result?: DBResult;
  error?: string;
  executedAt: string;
  executedBy: string;
  rowCount?: number;
  duration?: number; // ms
}

export interface DBResult {
  columns: string[];
  rows: Record<string, unknown>[];
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
}
