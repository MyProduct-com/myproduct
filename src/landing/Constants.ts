export const C = {
  forest:      "#1A6B3C",
  action:      "#25A55A",
  mint:        "#D4F0E2",
  canvas:      "#F2F9F5",
  ink:         "#111827",
  charcoal:    "#374151",
  slate:       "#6B7280",
  surface:     "#FFFFFF",
  border:      "#E5E7EB",
  ember:       "#E8500A",
  emberSurf:   "#FFF0E8",
  gold:        "#D97706",
};

export const DEMO_SHOPS = [
  {
    emoji: "🛒", name: "FreshMart", tagline: "Farm to doorstep, every day",
    category: "Groceries", revenue: "KSh 1.28M", orders: 432,
    color: "#1A6B3C", products: ["🥦 Sukuma Wiki — KSh 30", "🥛 Fresh Milk 500ml — KSh 65", "🍅 Organic Tomatoes 1kg — KSh 80"],
  },
  {
    emoji: "💻", name: "TechZone", tagline: "Gadgets at your fingertips",
    category: "Electronics", revenue: "KSh 3.57M", orders: 892,
    color: "#1e40af", products: ["🎧 Wireless Earbuds Pro — KSh 3,500", "🔌 USB-C Hub 7-in-1 — KSh 2,800", "📱 Phone Stand — KSh 850"],
  },
  {
    emoji: "📚", name: "BookNest", tagline: "Every page, a new world",
    category: "Books & Education", revenue: "KSh 890K", orders: 1243,
    color: "#7c3aed", products: ["📗 Business Strategy 2025 — KSh 1,200", "📘 Python for Beginners — KSh 950", "📙 Marketing Mastery — KSh 1,100"],
  },
  {
    emoji: "👗", name: "StyleHub", tagline: "Fashion for everyone",
    category: "Fashion", revenue: "KSh 678K", orders: 201,
    color: "#be185d", products: ["👟 Air Max Sneakers — KSh 4,200", "👜 Leather Handbag — KSh 2,900", "🧣 Silk Scarf — KSh 1,400"],
  },
];

export const PACKAGES = [
  {
    id: "starter", name: "Starter", price: 999, cycle: "month",
    shopLimit: 1, popular: false,
    features: ["Up to 50 products", "200 orders/month", "Basic inventory", "Email support"],
    limits: "1 shop",
    color: C.slate,
  },
  {
    id: "growth", name: "Growth", price: 2499, cycle: "month",
    shopLimit: 2, popular: true,
    features: ["500 products", "Unlimited orders", "POS terminal", "5 staff accounts", "Analytics dashboard", "Marketplace listing"],
    limits: "2 shops",
    color: C.action,
  },
  {
    id: "pro", name: "Pro", price: 4999, cycle: "month",
    shopLimit: 3, popular: false,
    features: ["Unlimited products", "Unlimited orders", "Full POS system", "15 staff accounts", "Accounting module", "Custom domain"],
    limits: "3 shops",
    color: C.forest,
  },
  {
    id: "enterprise", name: "Enterprise", price: 9999, cycle: "month",
    shopLimit: 10, popular: false,
    features: ["Everything in Pro", "10 shop locations", "API access", "Priority support", "Dedicated onboarding", "Custom integrations"],
    limits: "10 shops",
    color: C.ink,
  },
];

export const TESTIMONIALS = [
  {
    name: "James Kamau", shop: "FreshMart", location: "Westlands, Nairobi",
    avatar: "JK", color: C.action,
    quote: "I launched my shop in one afternoon. No tech skills needed — the setup wizard walked me through every step. My first order came in within 24 hours.",
    revenue: "KSh 1.28M revenue in first year",
  },
  {
    name: "Diana Njoroge", shop: "BookNest", location: "Nakuru",
    avatar: "DN", color: C.forest,
    quote: "Managing 1,200 products across 3 locations used to be a nightmare. Now everything is in one dashboard. The accounting module alone saves me 10 hours a week.",
    revenue: "3 shops, 1,243 orders processed",
  },
  {
    name: "Patricia Achieng", shop: "TechZone", location: "CBD, Nairobi",
    avatar: "PA", color: "#1e40af",
    quote: "The shared marketplace brought customers I never would have found on my own. My sales doubled in the first month after listing on the platform.",
    revenue: "2x sales after joining marketplace",
  },
];

export const HOW_IT_WORKS = [
  { step: "01", icon: "🚀", title: "Sign up & choose a plan", desc: "Create your account in minutes. Pick the package that fits your business — you can always upgrade." },
  { step: "02", icon: "🏪", title: "Build your shop", desc: "Add your products, set your prices, and customise your store. Your shop is live the moment you publish." },
  { step: "03", icon: "💳", title: "Start accepting payments", desc: "M-Pesa, card, or bank — customers pay the way they prefer. Funds land in your account." },
  { step: "04", icon: "📈", title: "Grow with the platform", desc: "List on the shared marketplace, track orders with our POS, manage staff, and watch your analytics climb." },
];

export const STATS = [
  { value: "2,400+", label: "Products listed" },
  { value: "KSh 6.7M+", label: "Revenue processed" },
  { value: "6+", label: "Active businesses" },
  { value: "98%", label: "Uptime guaranteed" },
];

export const FEATURES = [
  { icon: "🏪", title: "Multi-shop management", desc: "Run multiple locations from one dashboard. Perfect for businesses ready to expand." },
  { icon: "📦", title: "Smart inventory", desc: "Real-time stock tracking with low-stock alerts. Never oversell again." },
  { icon: "💳", title: "M-Pesa & card payments", desc: "Native M-Pesa integration. Accept payments from any customer in Kenya." },
  { icon: "🖥️", title: "Point of Sale", desc: "A full POS system for walk-in customers. Works offline, syncs when back online." },
  { icon: "📊", title: "Analytics & reports", desc: "See what is selling, who is buying, and when. Make decisions with real data." },
  { icon: "🌐", title: "Shared marketplace", desc: "List your products alongside other verified shops and reach thousands of new customers." },
  { icon: "👥", title: "Staff accounts", desc: "Give your team the right access. Cashiers, managers, and inventory staff — each with their own login." },
  { icon: "🎧", title: "Live support", desc: "In-system support chat connects you directly with our team — no waiting on hold." },
  { icon: "📱", title: "Mobile-ready shops", desc: "Every shop is fully responsive. Your customers shop from whatever device they have." },
];