import { PrismaClient, TransactionType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  mockCustomers,
  mockSellers,
  mockAdmin,
  mockProducts,
  mockOrders,
} from "../src/lib/mock-data";
import { MOCK_SHOPS, MOCK_SUPER_ADMIN } from "../src/super_admin/data/mockData";
import { SHOP_THEME_PRESETS } from "../src/lib/shopThemePresets";
import type { Address } from "../src/types/user";
import type { OrderItem as MockOrderItem } from "../src/types/order";

const prisma = new PrismaClient();

const DEV_PASSWORD = "password123";

const ORDER_STATUS_MAP: Record<string, string> = {
  pending: "PENDING",
  confirmed: "CONFIRMED",
  processing: "PROCESSING",
  shipped: "SHIPPED",
  delivered: "DELIVERED",
  cancelled: "CANCELLED",
  refunded: "REFUNDED",
};
const PAYMENT_METHOD_MAP: Record<string, string> = {
  mpesa: "MPESA",
  card: "CARD",
  cash_on_delivery: "CASH_ON_DELIVERY",
};
const PAYMENT_STATUS_MAP: Record<string, string> = {
  pending: "PENDING",
  paid: "PAID",
  failed: "FAILED",
  refunded: "REFUNDED",
};
const PRODUCT_STATUS_MAP: Record<string, string> = {
  live: "LIVE",
  draft: "DRAFT",
  out_of_stock: "OUT_OF_STOCK",
};

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates the finance-overlay data (transactions, savings goal, recipients,
 * scheduled payments, a card) that powers the Finova-style dashboard widgets
 * for a single user, regardless of their role.
 */
async function seedFinanceOverlay(
  userId: string,
  opts: {
    incomeCategories: string[];
    expenseCategories: string[];
    counterparties: string[];
    monthlyIncomeRange: [number, number];
    monthlyExpenseRange: [number, number];
    savingsLabel: string;
    savingsTarget: number;
    recipientNames: string[];
    scheduledMerchants: string[];
    shopId?: string;
  }
) {
  const txRows: {
    userId: string;
    shopId?: string;
    type: TransactionType;
    category: string;
    amount: number;
    counterparty: string;
    account: string;
    status: "COMPLETED" | "PENDING" | "CANCELLED";
    occurredAt: Date;
  }[] = [];

  const accounts = ["Moniex Platinum", "Savings Plus Card", "Travel Rewards Card"];

  // ~6 months of transactions, 3-6 per month
  for (let m = 0; m < 6; m++) {
    const count = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      const isIncome = Math.random() < 0.45;
      const day = m * 30 + Math.floor(Math.random() * 28);
      const range = isIncome ? opts.monthlyIncomeRange : opts.monthlyExpenseRange;
      const amount = Math.round((range[0] + Math.random() * (range[1] - range[0])) / 10) * 10;
      txRows.push({
        userId,
        shopId: opts.shopId,
        type: isIncome ? "INCOME" : "EXPENSE",
        category: pick(isIncome ? opts.incomeCategories : opts.expenseCategories),
        amount,
        counterparty: pick(opts.counterparties),
        account: pick(accounts),
        status: Math.random() < 0.08 ? "CANCELLED" : "COMPLETED",
        occurredAt: daysAgo(day),
      });
    }
  }

  await prisma.transaction.createMany({ data: txRows });

  const achieved = Math.round(opts.savingsTarget * (0.35 + Math.random() * 0.5));
  await prisma.savingsGoal.create({
    data: {
      userId,
      label: opts.savingsLabel,
      targetAmount: opts.savingsTarget,
      achievedAmount: achieved,
      periodStart: daysAgo(30),
      periodEnd: daysAgo(-30),
    },
  });

  await prisma.recipient.createMany({
    data: opts.recipientNames.map((name, i) => ({
      ownerId: userId,
      name,
      avatarUrl: `https://i.pravatar.cc/80?u=${encodeURIComponent(userId + name + i)}`,
      lastPaidAt: daysAgo(i * 4),
    })),
  });

  await prisma.scheduledPayment.createMany({
    data: opts.scheduledMerchants.map((merchant, i) => ({
      userId,
      merchant,
      amount: 500 + Math.floor(Math.random() * 4000),
      dueDate: daysAgo(-(i + 1) * 5),
      status: "upcoming",
    })),
  });

  await prisma.card.create({
    data: {
      userId,
      network: pick(["Mocard", "Visa", "Mastercard"]),
      last4: String(1000 + Math.floor(Math.random() * 9000)).slice(-4),
      holderName: "",
      expiryMonth: 2 + Math.floor(Math.random() * 10),
      expiryYear: 27 + Math.floor(Math.random() * 3),
      balance: Math.round(opts.monthlyIncomeRange[1] * 1.5),
      creditLimit: Math.round(opts.monthlyIncomeRange[1] * 2.2),
    },
  });
}

async function main() {
  console.log("Clearing existing data…");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.address.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.savingsGoal.deleteMany();
  await prisma.recipient.deleteMany();
  await prisma.scheduledPayment.deleteMany();
  await prisma.card.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

  // ── Admin ──
  const admin = await prisma.user.create({
    data: {
      name: mockAdmin.name,
      email: mockAdmin.email,
      phone: mockAdmin.phone,
      role: UserRole.ADMIN,
      passwordHash,
    },
  });

  // ── Super Admin ──
  const superAdmin = await prisma.user.create({
    data: {
      name: MOCK_SUPER_ADMIN.name,
      email: MOCK_SUPER_ADMIN.email,
      role: UserRole.SUPER_ADMIN,
      passwordHash,
    },
  });

  // ── Sellers ──
  const sellerIdMap = new Map<string, string>();
  for (const s of mockSellers) {
    const user = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        phone: s.phone,
        image: s.avatar,
        role: UserRole.SELLER,
        passwordHash,
        createdAt: new Date(s.createdAt),
        sellerProfile: {
          create: {
            storeName: s.storeName,
            storeSlug: s.storeSlug,
            storeDescription: s.storeDescription,
            storeLogo: s.storeLogo,
            storeBanner: s.storeBanner,
            storeRating: s.storeRating,
            isVerified: s.isVerified,
            plan: s.plan,
            location: s.location,
            joinedAt: new Date(s.joinedAt),
          },
        },
      },
    });
    sellerIdMap.set(s.id, user.id);
  }

  // ── Customers ──
  const customerIdMap = new Map<string, string>();
  for (const c of mockCustomers) {
    const user = await prisma.user.create({
      data: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        image: c.avatar,
        role: UserRole.CUSTOMER,
        passwordHash,
        loyaltyPoints: c.loyaltyPoints,
        createdAt: new Date(c.createdAt),
        addresses: {
          create: c.addresses.map((a: Address) => ({
            label: a.label,
            street: a.street,
            city: a.city,
            county: a.county,
            isDefault: a.isDefault,
          })),
        },
      },
    });
    customerIdMap.set(c.id, user.id);
  }

  // ── Shops (shop_admin domain) ──
  // Distinct, muted brand themes per shop so "Discover Shops" and each
  // storefront actually look different from one another, not just the
  // single default green theme repeated six times.
  const shopIdMap = new Map<string, string>();
  const shopOwnerIdMap = new Map<string, string>();
  for (const shop of MOCK_SHOPS) {
    const owner = await prisma.user.create({
      data: {
        name: shop.ownerName,
        email: shop.ownerEmail,
        role: UserRole.SHOP_ADMIN,
        passwordHash,
      },
    });
    const preset = SHOP_THEME_PRESETS[shop.id];
    const created = await prisma.shop.create({
      data: {
        ownerId: owner.id,
        name: shop.name,
        slug: shop.id,
        tagline: shop.tagline,
        logoIcon: shop.logoIcon ?? "Store",
        status: shop.status,
        packageName: shop.packageName,
        shopsCreated: shop.shopsCreated,
        packageShopLimit: shop.packageShopLimit,
        expiresAt: shop.expiresAt ? new Date(shop.expiresAt) : null,
        ...(preset
          ? {
              themePrimary: preset.primary,
              themePrimaryDark: preset.primaryDark,
              themePrimaryLight: preset.primaryLight,
              themeAccent: preset.accent,
              themeSurface: preset.surface,
              themeBorder: preset.border,
            }
          : {}),
      },
    });
    shopIdMap.set(shop.id, created.id);
    shopOwnerIdMap.set(shop.id, owner.id);
  }

  // ── Products ──
  const productIdMap = new Map<string, string>();
  for (const p of mockProducts) {
    const sellerId = sellerIdMap.get(p.sellerId);
    if (!sellerId) continue;
    const created = await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock,
        maxStock: p.maxStock,
        status: PRODUCT_STATUS_MAP[p.status] as never,
        sales: p.sales,
        views: p.views,
        sku: p.sku,
        image: p.image,
        description: p.description,
        brand: p.brand,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isFeatured: !!p.isFeatured,
        isFlashDeal: !!p.isFlashDeal,
        isNew: !!p.isNew,
        sellerId,
      },
    });
    productIdMap.set(p.id, created.id);
  }

  // ── Orders ──
  for (const o of mockOrders) {
    const customerId = customerIdMap.get(o.customerId);
    if (!customerId) continue;

    const items: { productId: string; sellerId: string; quantity: number; price: number; subtotal: number }[] = [];
    for (const item of o.items as MockOrderItem[]) {
      const productId = productIdMap.get(item.productId);
      const sellerId = sellerIdMap.get(item.sellerId);
      if (!productId || !sellerId) continue;
      items.push({
        productId,
        sellerId,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      });
    }

    await prisma.order.create({
      data: {
        customerId,
        subtotal: o.subtotal,
        deliveryFee: o.deliveryFee,
        total: o.total,
        status: ORDER_STATUS_MAP[o.status] as never,
        paymentMethod: PAYMENT_METHOD_MAP[o.paymentMethod] as never,
        paymentStatus: PAYMENT_STATUS_MAP[o.paymentStatus] as never,
        deliveryAddress: o.deliveryAddress,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
        items: { create: items },
      },
    });
  }

  console.log("Seeding finance-overlay data (transactions, goals, recipients, payments, cards)…");

  await seedFinanceOverlay(admin.id, {
    incomeCategories: ["Platform Fees", "Commission"],
    expenseCategories: ["Seller Payouts", "Infrastructure", "Refunds"],
    counterparties: mockSellers.map((s) => s.storeName),
    monthlyIncomeRange: [40000, 120000],
    monthlyExpenseRange: [10000, 60000],
    savingsLabel: "Platform reserve fund",
    savingsTarget: 500000,
    recipientNames: mockSellers.map((s) => s.name),
    scheduledMerchants: ["AWS Hosting", "SMS Gateway", "Payment Processor Fees"],
  });

  await seedFinanceOverlay(superAdmin.id, {
    incomeCategories: ["Shop Subscriptions", "Marketplace Commission"],
    expenseCategories: ["Support Costs", "Infrastructure"],
    counterparties: MOCK_SHOPS.map((s) => s.name),
    monthlyIncomeRange: [60000, 180000],
    monthlyExpenseRange: [15000, 70000],
    savingsLabel: "Platform growth fund",
    savingsTarget: 800000,
    recipientNames: MOCK_SHOPS.map((s) => s.ownerName),
    scheduledMerchants: ["Cloud Hosting", "Support Tooling", "Payment Gateway Fees"],
  });

  for (const s of mockSellers) {
    const userId = sellerIdMap.get(s.id)!;
    await seedFinanceOverlay(userId, {
      incomeCategories: ["Sales", "Payout"],
      expenseCategories: ["Refund", "Platform Fee", "Restock"],
      counterparties: mockCustomers.map((c) => c.name),
      monthlyIncomeRange: [8000, 60000],
      monthlyExpenseRange: [1000, 15000],
      savingsLabel: `${s.storeName} growth target`,
      savingsTarget: 100000,
      recipientNames: mockCustomers.map((c) => c.name),
      scheduledMerchants: ["Subscription Plan", "Ad Spend", "Delivery Partner"],
    });
  }

  for (const c of mockCustomers) {
    const userId = customerIdMap.get(c.id)!;
    await seedFinanceOverlay(userId, {
      incomeCategories: ["Refund", "Cashback"],
      expenseCategories: ["Shopping", "Food & Dining", "Bills"],
      counterparties: mockSellers.map((s) => s.storeName),
      monthlyIncomeRange: [500, 3000],
      monthlyExpenseRange: [500, 8000],
      savingsLabel: "Next purchase fund",
      savingsTarget: 20000,
      recipientNames: mockSellers.map((s) => s.storeName),
      scheduledMerchants: ["Netflix Premium", "iCloud Storage", "Spotify Premium"],
    });
  }

  for (const shop of MOCK_SHOPS) {
    const userId = shopOwnerIdMap.get(shop.id)!;
    const shopId = shopIdMap.get(shop.id)!;
    await seedFinanceOverlay(userId, {
      shopId,
      incomeCategories: ["Shop Sales", "POS Sales"],
      expenseCategories: ["Restock", "Staff Wages", "Subscription Fee"],
      counterparties: ["Walk-in Customer", "Online Order"],
      monthlyIncomeRange: [10000, 80000],
      monthlyExpenseRange: [3000, 25000],
      savingsLabel: `${shop.name} revenue target`,
      savingsTarget: 150000,
      recipientNames: ["Supplier A", "Supplier B", "Delivery Rider"],
      scheduledMerchants: ["Shop Subscription", "POS Hardware Lease"],
    });
  }

  console.log("Done.");
  console.log(`Dev login for every seeded user: password = "${DEV_PASSWORD}"`);
  console.log(`Admin: ${admin.email}`);
  console.log(`Super Admin: ${superAdmin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
