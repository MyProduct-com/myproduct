import { Product } from "@/types/product";

export const mockProducts: Product[] = [
  { id: "1",  name: "Organic Broccoli 500g",  category: "Grocery",     price: 120,  stock: 48, maxStock: 100, status: "live",         sales: 241, views: 1840, sku: "BRC-001", icon: "🥦" },
  { id: "2",  name: "Whole Milk 1L",           category: "Grocery",     price: 65,   stock: 8,  maxStock: 100, status: "live",         sales: 189, views: 1220, sku: "MLK-001", icon: "🥛" },
  { id: "3",  name: "Body Lotion 200ml",        category: "Beauty",      price: 350,  stock: 0,  maxStock: 80,  status: "out_of_stock", sales: 74,  views: 960,  sku: "BTY-001", icon: "🧴" },
  { id: "4",  name: "Sourdough Bread",          category: "Grocery",     price: 180,  stock: 22, maxStock: 50,  status: "live",         sales: 156, views: 880,  sku: "BRD-001", icon: "🍞" },
  { id: "5",  name: "Wireless Earbuds",         category: "Electronics", price: 1800, stock: 12, maxStock: 30,  status: "live",         sales: 43,  views: 720,  sku: "ELC-001", icon: "🎧" },
  { id: "6",  name: "Avocado Oil 250ml",        category: "Grocery",     price: 420,  stock: 0,  maxStock: 40,  status: "draft",        sales: 0,   views: 0,    sku: "OIL-001", icon: "🫒" },
  { id: "7",  name: "Shea Butter Cream",        category: "Beauty",      price: 280,  stock: 35, maxStock: 60,  status: "live",         sales: 98,  views: 640,  sku: "BTY-002", icon: "🧈" },
  { id: "8",  name: "Notebook A4",              category: "Stationery",  price: 120,  stock: 5,  maxStock: 100, status: "live",         sales: 62,  views: 310,  sku: "STN-001", icon: "📓" },
  { id: "9",  name: "Green Tea 100g",           category: "Grocery",     price: 220,  stock: 30, maxStock: 60,  status: "live",         sales: 88,  views: 540,  sku: "TEA-001", icon: "🍵" },
  { id: "10", name: "Face Wash 150ml",          category: "Beauty",      price: 390,  stock: 0,  maxStock: 50,  status: "out_of_stock", sales: 55,  views: 480,  sku: "BTY-003", icon: "🧼" },
  { id: "11", name: "USB-C Cable 1m",           category: "Electronics", price: 250,  stock: 60, maxStock: 80,  status: "live",         sales: 130, views: 420,  sku: "ELC-002", icon: "🔌" },
  { id: "12", name: "Coconut Water 500ml",      category: "Grocery",     price: 85,   stock: 9,  maxStock: 120, status: "live",         sales: 200, views: 1100, sku: "DRK-001", icon: "🥥" },
];