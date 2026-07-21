import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Shared product type both admin and shop use ──────────────────────────────
export interface SharedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  costPrice: number;
  unit: string;
  category: string;
  stock: number;
  lowStockThreshold: number;
  image: string;
  sku: string;
  supplier: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Seed data — same products from mock but in shared store ──────────────────
const SEED_PRODUCTS: SharedProduct[] = [
  {
    id: 1, name: "Sukuma Wiki (Kale)",
    description: "Fresh farm kale, tender leaves, harvested daily.",
    price: 30, costPrice: 10, unit: "Bunch", category: "Fruits & Vegetables",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400",
    stock: 120, lowStockThreshold: 20, published: true,
    sku: "VEG-001", supplier: "Green Farms Ltd",
    createdAt: "2024-01-10", updatedAt: "2024-06-01",
  },
  {
    id: 2, name: "Tomatoes",
    description: "Ripe red tomatoes, perfect for cooking and salads.",
    price: 80, costPrice: 40, unit: "KG", category: "Fruits & Vegetables",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    stock: 85, lowStockThreshold: 15, published: true,
    sku: "VEG-002", supplier: "Rift Valley Agro",
    createdAt: "2024-01-10", updatedAt: "2024-06-01",
  },
  {
    id: 3, name: "Fresh Milk",
    description: "Pure whole milk from grass-fed cows.",
    price: 65, costPrice: 45, unit: "500ml", category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    stock: 60, lowStockThreshold: 10, published: true,
    sku: "DAI-001", supplier: "Brookside Dairy",
    createdAt: "2024-01-10", updatedAt: "2024-06-02",
  },
  {
    id: 4, name: "Eggs",
    description: "Free-range farm eggs, packed in trays of 30.",
    price: 420, costPrice: 350, unit: "Tray", category: "Dairy & Eggs",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400",
    stock: 8, lowStockThreshold: 10, published: true,
    sku: "DAI-002", supplier: "Kenchic Ltd",
    createdAt: "2024-01-10", updatedAt: "2024-06-03",
  },
  {
    id: 5, name: "Unga wa Ugali (2KG)",
    description: "Premium maize flour, finely milled.",
    price: 180, costPrice: 120, unit: "2KG", category: "Pantry",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    stock: 200, lowStockThreshold: 30, published: true,
    sku: "PAN-001", supplier: "Unga Group",
    createdAt: "2024-01-10", updatedAt: "2024-06-01",
  },
  {
    id: 6, name: "Cooking Oil",
    description: "Pure sunflower cooking oil, cholesterol free.",
    price: 320, costPrice: 250, unit: "2L", category: "Pantry",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
    stock: 45, lowStockThreshold: 10, published: true,
    sku: "PAN-002", supplier: "Bidco Africa",
    createdAt: "2024-01-10", updatedAt: "2024-06-01",
  },
  {
    id: 7, name: "Bananas",
    description: "Sweet ripe bananas, great for energy.",
    price: 50, costPrice: 30, unit: "Bunch", category: "Fruits & Vegetables",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    stock: 3, lowStockThreshold: 10, published: true,
    sku: "FRT-001", supplier: "Meru Farmers Coop",
    createdAt: "2024-01-10", updatedAt: "2024-06-03",
  },
  {
    id: 8, name: "Bread (White)",
    description: "Soft white bread loaf, freshly baked.",
    price: 65, costPrice: 40, unit: "Loaf", category: "Bakery",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    stock: 30, lowStockThreshold: 10, published: false,
    sku: "BAK-001", supplier: "Supa Loaf Bakery",
    createdAt: "2024-01-10", updatedAt: "2024-06-02",
  },
  {
    id: 9, name: "Beef (Minced)",
    description: "Fresh lean minced beef, no additives.",
    price: 550, costPrice: 400, unit: "KG", category: "Meat & Fish",
    image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400",
    stock: 18, lowStockThreshold: 5, published: true,
    sku: "MEA-001", supplier: "Nyama Fresh Ltd",
    createdAt: "2024-01-10", updatedAt: "2024-06-04",
  },
  {
    id: 10, name: "Chai Tea Masala",
    description: "Authentic spiced tea blend, 50 bags.",
    price: 120, costPrice: 70, unit: "Box", category: "Beverages",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
    stock: 55, lowStockThreshold: 10, published: true,
    sku: "BEV-001", supplier: "Kericho Gold",
    createdAt: "2024-01-10", updatedAt: "2024-06-01",
  },
];

// ── Store interface ───────────────────────────────────────────────────────────
interface ProductStore {
  products: SharedProduct[];

  // Admin actions
  addProduct:     (p: Omit<SharedProduct, "id" | "createdAt" | "updatedAt">) => void;
  updateProduct:  (id: number, changes: Partial<SharedProduct>) => void;
  deleteProduct:  (id: number) => void;
  togglePublish:  (id: number) => void;

  // Shop reads (computed — only published + in stock)
  getShopProducts: () => SharedProduct[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,

      addProduct: (p) =>
        set((s) => ({
          products: [
            ...s.products,
            {
              ...p,
              id:        Date.now(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),

      updateProduct: (id, changes) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id
              ? { ...p, ...changes, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      deleteProduct: (id) =>
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
        })),

      togglePublish: (id) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id
              ? { ...p, published: !p.published, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      // Only published products with stock > 0 are visible in the shop
      getShopProducts: () =>
        get().products.filter((p) => p.published && p.stock > 0),
    }),
    {
      name: "freshmart-products", // persists in localStorage
    }
  )
);