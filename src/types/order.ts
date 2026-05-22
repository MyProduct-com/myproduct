export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type PaymentMethod = "mpesa" | "card" | "cash";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  icon: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
}