export type ProductStatus = "live" | "draft" | "out_of_stock";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  maxStock: number;
  status: ProductStatus;
  sales: number;
  views: number;
  sku: string;
  icon: string;
}