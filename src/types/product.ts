export type ProductStatus = "live" | "draft" | "out_of_stock";

export type ProductCategory =
  | "Electronics"
  | "Fashion"
  | "Beauty & Health"
  | "Grocery"
  | "Home & Office"
  | "Computing"
  | "Stationery"
  | "Sports"
  | "Baby Products";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  maxStock: number;
  status: ProductStatus;
  sales: number;
  views: number;
  sku: string;
  image: string;
  images?: string[];
  description: string;
  brand: string;
  rating: number;
  reviewCount: number;
  sellerId: string;
  sellerName: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  isNew?: boolean;
}
