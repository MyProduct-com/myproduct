export interface User {
  id: string;
  phone: string;
  name: string;
  plan: "starter" | "growth" | "business" | "enterprise";
  shops: string[];
  createdAt: string;
}