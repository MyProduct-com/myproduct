export type UserRole = "customer" | "seller" | "admin";

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  county: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Customer extends User {
  role: "customer";
  addresses: Address[];
  loyaltyPoints: number;
}

export interface Seller extends User {
  role: "seller";
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  storeRating: number;
  totalSales: number;
  totalRevenue: number;
  productCount: number;
  isVerified: boolean;
  plan: "starter" | "growth" | "business" | "enterprise";
  categories: string[];
  location: string;
  joinedAt: string;
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}
