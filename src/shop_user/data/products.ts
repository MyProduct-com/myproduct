import { Smartphone, CreditCard, Banknote } from "lucide-react";
import type { Product, PaymentMethod } from "../types/index";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Organic Avocados",
    price: 320,
    unit: "per kg",
    stock: 50,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80",
    description:
      "Creamy, ripe organic avocados sourced directly from highland farms. Rich in healthy fats, vitamins, and minerals. Perfect for salads, toast, guacamole, or eating as-is. Each fruit is hand-picked at peak ripeness and delivered fresh to you within 24 hours of harvest.",
  },
  {
    id: 2,
    name: "Fresh Tomatoes",
    price: 120,
    unit: "per kg",
    stock: 80,
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaad337?w=400&q=80",
    description:
      "Sun-ripened red tomatoes, juicy and full of flavour. Great for cooking, sauces, salads or snacking. Grown without harmful pesticides in fertile Kenyan soils, these tomatoes bring the authentic taste of homegrown goodness to your table every single day.",
  },
  {
    id: 3,
    name: "Honey (Raw)",
    price: 850,
    unit: "500ml jar",
    stock: 20,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
    description:
      "Pure raw honey collected from free-range beehives in the Kenyan highlands. Unprocessed and unfiltered to preserve all natural enzymes, antioxidants, and nutrients. A golden jar of wellness — drizzle over breakfast, stir into tea, or use as a natural sweetener.",
  },
  {
    id: 4,
    name: "Sweet Mangoes",
    price: 200,
    unit: "per kg",
    stock: 30,
    image: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=400&q=80",
    description:
      "Sweet, fragrant mangoes at the peak of the season. Sourced from coastal orchards and delivered fresh. Each mango is carefully selected for ripeness, sweetness, and texture — making them ideal for juicing, slicing, or adding to smoothies and desserts.",
  },
  {
    id: 5,
    name: "Free Range Eggs",
    price: 480,
    unit: "tray of 30",
    stock: 15,
    image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&q=80",
    description:
      "Farm-fresh eggs from free-range hens raised on natural feed. Rich golden yolks and firm whites. These hens roam open pastures and eat a natural diet, which results in eggs with superior taste, nutrition, and quality compared to caged alternatives.",
  },
  {
    id: 6,
    name: "Spinach Bundle",
    price: 60,
    unit: "large bunch",
    stock: 100,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80",
    description:
      "Crisp, dark green spinach — freshly cut and ready to cook. High in iron, calcium, and vitamins A and C. Ideal for sautéeing, soups, smoothies, or as a base for salads. Harvested early morning and delivered the same day for maximum freshness.",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "mpesa", label: "M-Pesa",           icon: Smartphone, desc: "Pay via M-Pesa Till or Paybill" },
  { id: "card",  label: "Card",             icon: CreditCard, desc: "Visa / Mastercard" },
  { id: "cod",   label: "Cash on Delivery", icon: Banknote,   desc: "Pay when your order arrives" },
];
