
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  stock: number;
  image: string;
  description: string;
}

export interface CartItem {
  productId: number;
  qty: number;
}

/** CartItem enriched with the resolved Product — used inside modals */
export interface CartItemResolved extends CartItem {
  product: Product;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export type OrderStatus  = "Under Processing" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending";

export interface Order {
  id: string;
  date: string;
  items: CartItemResolved[];
  total: number;
  payMethod: string;
  status: OrderStatus;
  payStatus: PaymentStatus;
}

export interface User {
  name: string;
  email: string;
}

// ─── Theme ────────────────────────────────────────────────────────────────────

export interface Theme {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textOnPrimary: string;
  black: string;
  danger: string;
  fontFamily: string;
  shopName: string;
  shopTagline: string;
  logoEmoji: string;
  radius: string;
  radiusCard: string;
}

/** Keys of Theme that hold a CSS colour hex string */
export type ThemeColorKey = keyof {
  [K in keyof Theme as Theme[K] extends string ? K : never]: Theme[K];
};

// ─── Checkout ─────────────────────────────────────────────────────────────────

export interface PlacedOrderPayload {
  items: CartItemResolved[];
  total: number;
  payMethod: string;
}
