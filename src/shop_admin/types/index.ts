
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "subadmin";
  avatar?: string;
  privileges: AdminPrivilege[];
  createdAt: string;
  lastLogin: string;
}

export type AdminPrivilege =
  | "products"
  | "orders"
  | "pos"
  | "inventory"
  | "accounting"
  | "staff"
  | "settings"
  | "subscription"
  | "reports";

export interface Shop {
  id: string;
  name: string;
  tagline: string;
  logoIcon: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  timezone: string;
}


export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  stock: number;
  lowStockThreshold: number;
  published: boolean;
  sku: string;
  costPrice: number;
  supplier: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategory =
  | "Fruits & Vegetables"
  | "Dairy & Eggs"
  | "Meat & Fish"
  | "Bakery"
  | "Pantry"
  | "Beverages"
  | "Snacks"
  | "Household";


export type OrderStatus =
  | "Pending"
  | "Under Processing"
  | "Dispatched"
  | "In Transit"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type PaymentStatus = "Pending" | "Paid" | "Refunded" | "Failed";
export type PaymentMethod = "mpesa" | "card" | "cod" | "bank";

export interface OrderItem {
  productId: number;
  productName: string;
  qty: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  trackingCode?: string;
}


export interface POSSession {
  id: string;
  sessionName: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  openingFloat: number;
  closingFloat?: number;
  totalSales: number;
  totalTransactions: number;
  active: boolean;
}

export interface POSCartItem {
  productId: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export interface POSTransaction {
  id: string;
  sessionId: string;
  items: POSCartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  cashierId: string;
  createdAt: string;
}


export interface StockMovement {
  id: string;
  productId: number;
  productName: string;
  type: "in" | "out" | "adjustment" | "loss";
  qty: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: string;
}



export type TransactionType = "sale" | "expense" | "refund" | "purchase" | "salary";

export interface AccountingEntry {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  reference?: string;
  date: string;
  createdBy: string;
}

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  privileges: AdminPrivilege[];
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  pin?: string;
}



export type PlanTier = "starter" | "growth" | "pro" | "enterprise";

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  limits: {
    products: number;
    orders: number;
    staff: number;
    posTerminals: number;
  };
  popular?: boolean;
}

export interface Subscription {
  planId: PlanTier;
  status: "active" | "expired" | "cancelled" | "trial";
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  billingEmail: string;
}




export interface DailyStat {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  unitsSold: number;
  revenue: number;
  image: string;
}


export interface Theme {
  shopName: string;
  shopTagline: string;
  logoIcon: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  black: string;
  danger: string;
  radius: string;
  radiusCard: string;
  fontFamily: string;
}


export type AdminView =
  | "dashboard"
  | "products"
  | "orders"
  | "pos"
  | "inventory"
  | "accounting"
  | "staff"
  | "settings"
  | "subscription";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
