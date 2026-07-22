import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupCustomerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const signupSellerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number required"),
  storeName: z.string().min(2, "Store name is required"),
  storeCategory: z.string().optional(),
  location: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(120, "Name is too long"),
  brand: z.string().min(2, "Brand is required"),
  category: z.string().min(1, "Please select a category"),
  price: z.coerce.number().positive("Valid price is required"),
  originalPrice: z.coerce.number().optional(),
  stock: z.coerce.number().nonnegative("Valid stock quantity is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(30, "Description should be at least 30 characters").max(2000, "Description is too long"),
  imageUrl: z.string().url("Valid image URL is required"),
  tags: z.string().optional(),
  status: z.enum(["draft", "live"]),
}).refine((data) => !data.originalPrice || data.originalPrice > data.price, {
  message: "Original price must be higher than selling price",
  path: ["originalPrice"],
});

export const checkoutSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Delivery address is required"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["mpesa", "card", "cash_on_delivery"]),
});

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  county: z.string().min(1, "County is required"),
  isDefault: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupCustomerInput = z.infer<typeof signupCustomerSchema>;
export type SignupSellerInput = z.infer<typeof signupSellerSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
