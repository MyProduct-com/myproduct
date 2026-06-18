import type {
  AdminProduct, AdminOrder, SubAdmin, AccountingEntry,
  StockMovement, POSSession, POSTransaction, Subscription,
  SubscriptionPlan, DailyStat, TopProduct, AdminUser,
} from "../types/index";

// ─── Admin User ───────────────────────────────────────────────────────────────
export const MOCK_ADMIN: AdminUser = {
  id: "adm_001",
  name: "James Kamau",
  email: "james@freshmart.co.ke",
  role: "superadmin",
  privileges: ["products","orders","pos","inventory","accounting","staff","settings","subscription","reports"],
  createdAt: "2024-01-15",
  lastLogin: new Date().toISOString(),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const MOCK_PRODUCTS: AdminProduct[] = [
  { id:1, name:"Sukuma Wiki (Kale)", description:"Fresh farm kale, tender leaves, harvested daily.", price:30, unit:"Bunch", category:"Fruits & Vegetables", image:"https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", stock:120, lowStockThreshold:20, published:true, sku:"VEG-001", costPrice:10, supplier:"Green Farms Ltd", createdAt:"2024-01-10", updatedAt:"2024-06-01" },
  { id:2, name:"Tomatoes", description:"Ripe red tomatoes, perfect for cooking and salads.", price:80, unit:"KG", category:"Fruits & Vegetables", image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400", stock:85, lowStockThreshold:15, published:true, sku:"VEG-002", costPrice:40, supplier:"Rift Valley Agro", createdAt:"2024-01-10", updatedAt:"2024-06-01" },
  { id:3, name:"Fresh Milk", description:"Pure whole milk from grass-fed cows.", price:65, unit:"500ml", category:"Dairy & Eggs", image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", stock:60, lowStockThreshold:10, published:true, sku:"DAI-001", costPrice:45, supplier:"Brookside Dairy", createdAt:"2024-01-10", updatedAt:"2024-06-02" },
  { id:4, name:"Eggs", description:"Free-range farm eggs, packed in trays of 30.", price:420, unit:"Tray", category:"Dairy & Eggs", image:"https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", stock:8, lowStockThreshold:10, published:true, sku:"DAI-002", costPrice:350, supplier:"Kenchic Ltd", createdAt:"2024-01-10", updatedAt:"2024-06-03" },
  { id:5, name:"Unga wa Ugali (2KG)", description:"Premium maize flour, finely milled.", price:180, unit:"2KG", category:"Pantry", image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400", stock:200, lowStockThreshold:30, published:true, sku:"PAN-001", costPrice:120, supplier:"Unga Group", createdAt:"2024-01-10", updatedAt:"2024-06-01" },
  { id:6, name:"Cooking Oil", description:"Pure sunflower cooking oil, cholesterol free.", price:320, unit:"2L", category:"Pantry", image:"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400", stock:45, lowStockThreshold:10, published:true, sku:"PAN-002", costPrice:250, supplier:"Bidco Africa", createdAt:"2024-01-10", updatedAt:"2024-06-01" },
  { id:7, name:"Bananas", description:"Sweet ripe bananas, great for energy.", price:50, unit:"Bunch", category:"Fruits & Vegetables", image:"https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", stock:3, lowStockThreshold:10, published:true, sku:"FRT-001", costPrice:30, supplier:"Meru Farmers Coop", createdAt:"2024-01-10", updatedAt:"2024-06-03" },
  { id:8, name:"Bread (White)", description:"Soft white bread loaf, freshly baked.", price:65, unit:"Loaf", category:"Bakery", image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400", stock:30, lowStockThreshold:10, published:false, sku:"BAK-001", costPrice:40, supplier:"Supa Loaf Bakery", createdAt:"2024-01-10", updatedAt:"2024-06-02" },
  { id:9, name:"Beef (Minced)", description:"Fresh lean minced beef, no additives.", price:550, unit:"KG", category:"Meat & Fish", image:"https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=400", stock:18, lowStockThreshold:5, published:true, sku:"MEA-001", costPrice:400, supplier:"Nyama Fresh Ltd", createdAt:"2024-01-10", updatedAt:"2024-06-04" },
  { id:10, name:"Chai Tea Masala", description:"Authentic spiced tea blend, 50 bags.", price:120, unit:"Box", category:"Beverages", image:"https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400", stock:55, lowStockThreshold:10, published:true, sku:"BEV-001", costPrice:70, supplier:"Kericho Gold", createdAt:"2024-01-10", updatedAt:"2024-06-01" },
];

// ─── Orders ───────────────────────────────────────────────────────────────────
export const MOCK_ORDERS: AdminOrder[] = [
  { id:"ORD-2024-001", customerId:"c1", customerName:"Grace Wanjiku", customerPhone:"0712 345 678", customerEmail:"grace@gmail.com", items:[{productId:1,productName:"Sukuma Wiki",qty:2,unitPrice:30,totalPrice:60},{productId:3,productName:"Fresh Milk",qty:3,unitPrice:65,totalPrice:195}], subtotal:255, deliveryFee:100, total:355, status:"Delivered", paymentStatus:"Paid", paymentMethod:"mpesa", paymentRef:"QHJ34K78LM", address:"Westlands, Nairobi", createdAt:"2024-06-10T08:30:00Z", updatedAt:"2024-06-10T16:00:00Z", dispatchedAt:"2024-06-10T10:00:00Z", deliveredAt:"2024-06-10T16:00:00Z", trackingCode:"TRK-001" },
  { id:"ORD-2024-002", customerId:"c2", customerName:"Peter Omondi", customerPhone:"0722 456 789", customerEmail:"peter@gmail.com", items:[{productId:5,productName:"Unga wa Ugali",qty:2,unitPrice:180,totalPrice:360},{productId:6,productName:"Cooking Oil",qty:1,unitPrice:320,totalPrice:320}], subtotal:680, deliveryFee:100, total:780, status:"In Transit", paymentStatus:"Paid", paymentMethod:"mpesa", paymentRef:"RKT56M92NP", address:"Karen, Nairobi", createdAt:"2024-06-11T09:15:00Z", updatedAt:"2024-06-11T12:00:00Z", dispatchedAt:"2024-06-11T11:00:00Z", trackingCode:"TRK-002" },
  { id:"ORD-2024-003", customerId:"c3", customerName:"Amina Hassan", customerPhone:"0733 567 890", customerEmail:"amina@gmail.com", items:[{productId:2,productName:"Tomatoes",qty:3,unitPrice:80,totalPrice:240},{productId:4,productName:"Eggs",qty:1,unitPrice:420,totalPrice:420}], subtotal:660, deliveryFee:100, total:760, status:"Under Processing", paymentStatus:"Paid", paymentMethod:"card", address:"Kilimani, Nairobi", createdAt:"2024-06-12T07:45:00Z", updatedAt:"2024-06-12T08:00:00Z" },
  { id:"ORD-2024-004", customerId:"c4", customerName:"David Kipchoge", customerPhone:"0744 678 901", customerEmail:"david@gmail.com", items:[{productId:9,productName:"Beef Minced",qty:2,unitPrice:550,totalPrice:1100},{productId:10,productName:"Chai Tea",qty:2,unitPrice:120,totalPrice:240}], subtotal:1340, deliveryFee:100, total:1440, status:"Pending", paymentStatus:"Pending", paymentMethod:"cod", address:"Langata, Nairobi", createdAt:"2024-06-12T10:30:00Z", updatedAt:"2024-06-12T10:30:00Z" },
  { id:"ORD-2024-005", customerId:"c5", customerName:"Sarah Muthoni", customerPhone:"0755 789 012", customerEmail:"sarah@gmail.com", items:[{productId:7,productName:"Bananas",qty:3,unitPrice:50,totalPrice:150},{productId:1,productName:"Sukuma Wiki",qty:1,unitPrice:30,totalPrice:30}], subtotal:180, deliveryFee:100, total:280, status:"Cancelled", paymentStatus:"Refunded", paymentMethod:"mpesa", paymentRef:"PLM78K34QR", address:"Ruaraka, Nairobi", createdAt:"2024-06-11T14:20:00Z", updatedAt:"2024-06-11T15:00:00Z" },
];

// ─── Staff / SubAdmins ────────────────────────────────────────────────────────
export const MOCK_STAFF: SubAdmin[] = [
  { id:"sub_001", name:"Mary Njeri", email:"mary@freshmart.co.ke", phone:"0701 111 222", role:"Cashier", privileges:["pos"], active:true, createdAt:"2024-02-01", lastLogin:"2024-06-12T08:00:00Z", pin:"1234" },
  { id:"sub_002", name:"John Mwangi", email:"john@freshmart.co.ke", phone:"0702 222 333", role:"Inventory Manager", privileges:["inventory","products"], active:true, createdAt:"2024-02-15", lastLogin:"2024-06-11T17:00:00Z", pin:"5678" },
  { id:"sub_003", name:"Lucy Achieng", email:"lucy@freshmart.co.ke", phone:"0703 333 444", role:"Order Dispatcher", privileges:["orders"], active:true, createdAt:"2024-03-01", lastLogin:"2024-06-12T07:30:00Z", pin:"9012" },
  { id:"sub_004", name:"Robert Otieno", email:"robert@freshmart.co.ke", phone:"0704 444 555", role:"Accountant", privileges:["accounting","reports"], active:false, createdAt:"2024-03-10", pin:"3456" },
];

// ─── Accounting ───────────────────────────────────────────────────────────────
export const MOCK_ACCOUNTING: AccountingEntry[] = [
  { id:"acc_001", type:"sale", description:"Online order #ORD-2024-001", amount:355, category:"Sales", reference:"ORD-2024-001", date:"2024-06-10", createdBy:"system" },
  { id:"acc_002", type:"sale", description:"POS sale - Session A", amount:1250, category:"Sales", date:"2024-06-10", createdBy:"sub_001" },
  { id:"acc_003", type:"expense", description:"Electricity bill - June", amount:8500, category:"Utilities", date:"2024-06-10", createdBy:"adm_001" },
  { id:"acc_004", type:"purchase", description:"Stock restock - Vegetables", amount:15000, category:"Inventory", reference:"PO-2024-001", date:"2024-06-11", createdBy:"sub_002" },
  { id:"acc_005", type:"sale", description:"Online order #ORD-2024-002", amount:780, category:"Sales", reference:"ORD-2024-002", date:"2024-06-11", createdBy:"system" },
  { id:"acc_006", type:"salary", description:"Staff salary - May", amount:45000, category:"Payroll", date:"2024-06-01", createdBy:"adm_001" },
  { id:"acc_007", type:"expense", description:"Delivery fuel", amount:3200, category:"Logistics", date:"2024-06-11", createdBy:"sub_003" },
  { id:"acc_008", type:"refund", description:"Refund - ORD-2024-005", amount:180, category:"Refunds", reference:"ORD-2024-005", date:"2024-06-11", createdBy:"adm_001" },
  { id:"acc_009", type:"sale", description:"POS sale - Session B", amount:2100, category:"Sales", date:"2024-06-12", createdBy:"sub_001" },
  { id:"acc_010", type:"expense", description:"Packaging materials", amount:2500, category:"Supplies", date:"2024-06-12", createdBy:"adm_001" },
];

// ─── Stock Movements ──────────────────────────────────────────────────────────
export const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  { id:"sm_001", productId:7, productName:"Bananas", type:"out", qty:5, previousStock:8, newStock:3, reason:"Online orders", userId:"system", userName:"System", createdAt:"2024-06-12T09:00:00Z" },
  { id:"sm_002", productId:4, productName:"Eggs", type:"in", qty:10, previousStock:0, newStock:10, reason:"Restock delivery", userId:"sub_002", userName:"John Mwangi", createdAt:"2024-06-12T08:00:00Z" },
  { id:"sm_003", productId:1, productName:"Sukuma Wiki", type:"out", qty:3, previousStock:123, newStock:120, reason:"Orders & POS", userId:"system", userName:"System", createdAt:"2024-06-12T10:00:00Z" },
  { id:"sm_004", productId:3, productName:"Fresh Milk", type:"loss", qty:4, previousStock:64, newStock:60, reason:"Expired stock", userId:"sub_002", userName:"John Mwangi", createdAt:"2024-06-11T18:00:00Z" },
];

// ─── POS ──────────────────────────────────────────────────────────────────────
export const MOCK_POS_SESSIONS: POSSession[] = [
  { id:"ses_001", sessionName:"Till A - Morning", cashierId:"sub_001", cashierName:"Mary Njeri", openedAt:"2024-06-12T07:00:00Z", openingFloat:5000, totalSales:12500, totalTransactions:18, active:true },
  { id:"ses_002", sessionName:"Till B - Morning", cashierId:"adm_001", cashierName:"James Kamau", openedAt:"2024-06-12T07:30:00Z", openingFloat:5000, totalSales:8750, totalTransactions:12, active:true },
];

export const MOCK_POS_TRANSACTIONS: POSTransaction[] = [
  { id:"txn_001", sessionId:"ses_001", items:[{productId:1,name:"Sukuma Wiki",price:30,qty:2,image:""},{productId:3,name:"Fresh Milk",price:65,qty:1,image:""}], subtotal:125, discount:0, total:125, paymentMethod:"mpesa", paymentRef:"ABC123", cashierId:"sub_001", createdAt:"2024-06-12T08:15:00Z" },
  { id:"txn_002", sessionId:"ses_001", items:[{productId:5,name:"Unga wa Ugali",price:180,qty:1,image:""}], subtotal:180, discount:10, total:170, paymentMethod:"cash" as any, cashierId:"sub_001", createdAt:"2024-06-12T09:30:00Z" },
];

// ─── Subscription ─────────────────────────────────────────────────────────────
export const MOCK_SUBSCRIPTION: Subscription = {
  planId: "growth",
  status: "active",
  startDate: "2024-05-15",
  expiryDate: "2024-07-15",
  autoRenew: true,
  paymentMethod: "mpesa",
  billingEmail: "james@freshmart.co.ke",
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id:"starter", name:"Starter", price:999, billingCycle:"monthly", features:["Up to 50 products","100 orders/month","1 staff account","Basic reports","Email support"], limits:{products:50,orders:100,staff:1,posTerminals:1} },
  { id:"growth", name:"Growth", price:2499, billingCycle:"monthly", features:["Up to 500 products","Unlimited orders","5 staff accounts","Advanced reports","2 POS terminals","Priority support"], limits:{products:500,orders:-1,staff:5,posTerminals:2}, popular:true },
  { id:"pro", name:"Pro", price:4999, billingCycle:"monthly", features:["Unlimited products","Unlimited orders","15 staff accounts","Full analytics","5 POS terminals","Accounting module","Dedicated support"], limits:{products:-1,orders:-1,staff:15,posTerminals:5} },
  { id:"enterprise", name:"Enterprise", price:9999, billingCycle:"monthly", features:["Everything in Pro","Custom integrations","Unlimited POS","API access","SLA guarantee","Onboarding manager"], limits:{products:-1,orders:-1,staff:-1,posTerminals:-1} },
];

// ─── Analytics ────────────────────────────────────────────────────────────────
export const MOCK_DAILY_STATS: DailyStat[] = [
  { date:"Jun 6",  revenue:12400, orders:8,  customers:7,  avgOrderValue:1550 },
  { date:"Jun 7",  revenue:18200, orders:14, customers:12, avgOrderValue:1300 },
  { date:"Jun 8",  revenue:9800,  orders:6,  customers:6,  avgOrderValue:1633 },
  { date:"Jun 9",  revenue:22100, orders:18, customers:15, avgOrderValue:1228 },
  { date:"Jun 10", revenue:31500, orders:24, customers:20, avgOrderValue:1313 },
  { date:"Jun 11", revenue:27800, orders:21, customers:18, avgOrderValue:1324 },
  { date:"Jun 12", revenue:15600, orders:11, customers:9,  avgOrderValue:1418 },
];

export const MOCK_TOP_PRODUCTS: TopProduct[] = [
  { productId:5, name:"Unga wa Ugali",   unitsSold:142, revenue:25560, image:"https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100" },
  { productId:6, name:"Cooking Oil",     unitsSold:98,  revenue:31360, image:"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100" },
  { productId:3, name:"Fresh Milk",      unitsSold:215, revenue:13975, image:"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100" },
  { productId:2, name:"Tomatoes",        unitsSold:187, revenue:14960, image:"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100" },
  { productId:9, name:"Beef (Minced)",   unitsSold:54,  revenue:29700, image:"https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=100" },
];
