import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Smartphone, Banknote, CreditCard, Monitor, ShoppingCart, Circle } from "lucide-react";
import type { AdminProduct, POSSession, POSCartItem, POSTransaction } from "../../types/index";
import { fmt, genId } from "../../utils/helpers";

interface POSViewProps {
  products: AdminProduct[];
  sessions: POSSession[];
  transactions: POSTransaction[];
  currentUserId: string;
  currentUserName: string;
  onSessions: (s: POSSession[]) => void;
  onTransactions: (t: POSTransaction[]) => void;
  onStockUpdate: (productId: number, delta: number) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

const PAYMENT_OPTS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "mpesa", label: "M-Pesa", icon: Smartphone },
  { id: "cash",  label: "Cash",   icon: Banknote },
  { id: "card",  label: "Card",   icon: CreditCard },
];

function POSTerminal({
  session, products, onCharge, onClose,
}: {
  session: POSSession;
  products: AdminProduct[];
  onCharge: (items: POSCartItem[], total: number, discount: number, method: string, ref: string) => void;
  onClose: () => void;
}) {
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState("mpesa");
  const [payRef, setPayRef] = useState("");

  const publishedProducts = products.filter(p => p.published && p.stock > 0);
  const filteredProds = publishedProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: AdminProduct) => {
    setCart(c => {
      const existing = c.find(i => i.productId === p.id);
      if (existing) return c.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { productId: p.id, name: p.name, price: p.price, qty: 1, image: p.image }];
    });
  };
  const changeQty = (id: number, delta: number) => {
    setCart(c => c.map(i => i.productId === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };
  const removeItem = (id: number) => setCart(c => c.filter(i => i.productId !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = Math.max(0, subtotal - discount);

  const handleCharge = () => {
    if (cart.length === 0) return;
    onCharge(cart, total, discount, payMethod, payRef);
    setCart([]);
    setDiscount(0);
    setPayRef("");
  };

  return (
    <div className="flex flex-col lg:flex-row border border-org-border rounded-org-card overflow-hidden">
      {/* Product panel */}
      <div className="flex-1 flex flex-col bg-org-bg lg:max-h-[640px]">
        <div className="p-3 border-b border-org-border bg-org-surface">
          <div className="font-org-bold text-org-sm text-org-text-primary mb-2 flex items-center gap-1.5">
            <Monitor size={16} /> {session.sessionName}
            <span className="ml-2 text-org-xs text-org-primary inline-flex items-center gap-1"><Circle size={8} fill="currentColor" /> Active</span>
          </div>
          <input
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 content-start max-h-[400px] lg:max-h-none">
          {filteredProds.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="bg-org-surface border border-org-border rounded-org-sm p-2.5 text-left hover:border-org-primary hover:bg-org-primary-light transition-colors"
            >
              <img src={p.image} alt={p.name} className="w-full h-16 object-cover rounded-lg mb-1.5" />
              <p className="text-org-xs font-org-bold text-org-text-primary leading-tight truncate">{p.name}</p>
              <p className="text-org-xs font-org-bold text-org-text-primary mt-1">{fmt(p.price)}</p>
              <p className="text-[10px] text-org-text-muted">{p.unit} &middot; {p.stock} left</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      <div className="w-full lg:w-75 flex flex-col border-t lg:border-t-0 lg:border-l border-org-border bg-org-surface">
        <div className="px-4 py-3 border-b border-org-border font-org-bold text-org-md text-org-text-primary flex items-center gap-1.5">
          <ShoppingCart size={16} /> Cart {cart.length > 0 && <span className="bg-org-primary text-white rounded-org-pill px-2 py-0.5 text-org-xs">{cart.reduce((s,i) => s+i.qty,0)}</span>}
        </div>

        <div className="flex-1 overflow-y-auto p-2.5 max-h-64 lg:max-h-none">
          {cart.length === 0 ? (
            <div className="text-center py-8 px-4 text-org-text-secondary">
              <div className="flex justify-center mb-1.5"><ShoppingCart size={32} /></div>
              <p className="text-org-sm">Tap a product to add it</p>
            </div>
          ) : cart.map(item => (
            <div key={item.productId} className="flex items-center gap-2 py-2 border-b border-org-border last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-org-xs font-org-bold text-org-text-primary truncate">{item.name}</p>
                <p className="text-org-xs text-org-text-muted">{fmt(item.price)} each</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => changeQty(item.productId, -1)} className="w-6 h-6 rounded bg-org-bg border border-org-border font-org-bold">−</button>
                <span className="font-org-bold text-org-sm min-w-5 text-center">{item.qty}</span>
                <button onClick={() => changeQty(item.productId, 1)} className="w-6 h-6 rounded bg-org-primary text-white font-org-bold">+</button>
              </div>
              <div className="min-w-15 text-right shrink-0">
                <p className="font-org-bold text-org-xs text-org-text-primary">{fmt(item.price * item.qty)}</p>
                <button onClick={() => removeItem(item.productId)} className="text-org-danger text-[11px]">remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="p-3.5 border-t border-org-border">
          <div className="flex justify-between text-org-sm text-org-text-secondary mb-1.5">
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-org-sm text-org-text-secondary">Discount</span>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded border border-org-border text-org-sm text-right"
            />
          </div>
          <div className="flex justify-between font-org-bold text-org-lg text-org-text-primary mb-3.5">
            <span>Total</span><span>{fmt(total)}</span>
          </div>

          {/* Payment method */}
          <div className="flex gap-1.5 mb-2.5">
            {PAYMENT_OPTS.map(o => (
              <button
                key={o.id}
                onClick={() => setPayMethod(o.id)}
                className={`flex-1 py-1.5 px-1 rounded-org-sm border-2 text-org-xs font-org-bold flex flex-col items-center gap-0.5 transition-colors ${
                  payMethod === o.id ? "border-org-primary bg-org-primary-light text-org-primary" : "border-org-border bg-org-bg text-org-text-primary"
                }`}
              >
                <o.icon size={14} /> {o.label}
              </button>
            ))}
          </div>

          {payMethod === "mpesa" && (
            <input
              placeholder="M-Pesa ref (optional)"
              value={payRef}
              onChange={e => setPayRef(e.target.value)}
              className="w-full p-2 rounded-org-sm border border-org-border text-org-xs mb-2.5"
            />
          )}

          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            className={`w-full py-3 rounded-org-sm text-white font-org-bold text-org-md transition-colors ${cart.length === 0 ? "bg-org-border cursor-not-allowed" : "bg-org-primary hover:bg-org-primary-hover"}`}
          >
            Charge {fmt(total)}
          </button>
          <button onClick={onClose} className="w-full py-2 bg-transparent text-org-danger text-org-xs mt-2">
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function POSView({ products, sessions, transactions, currentUserId, currentUserName, onSessions, onTransactions, onStockUpdate, onToast }: POSViewProps) {
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [openingFloat, setOpeningFloat] = useState("5000");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession2Id, setActiveSession2Id] = useState<string | null>(null);

  const activeSessions = sessions.filter(s => s.active);
  const session1 = activeSessions[0] ?? null;
  const session2 = activeSessions[1] ?? null;

  const openSession = () => {
    if (activeSessions.length >= 2) { onToast("Maximum 2 POS sessions allowed.", "error"); return; }
    const sess: POSSession = {
      id: genId("ses"),
      sessionName: newSessionName || `Till ${String.fromCharCode(65 + activeSessions.length)} - ${new Date().toLocaleTimeString("en-KE", {hour:"2-digit",minute:"2-digit"})}`,
      cashierId: currentUserId,
      cashierName: currentUserName,
      openedAt: new Date().toISOString(),
      openingFloat: Number(openingFloat),
      totalSales: 0,
      totalTransactions: 0,
      active: true,
    };
    onSessions([...sessions, sess]);
    setShowNewSession(false);
    setNewSessionName("");
    onToast(`Session "${sess.sessionName}" opened.`, "success");
  };

  const closeSession = (sessionId: string) => {
    const sess = sessions.find(s => s.id === sessionId)!;
    onSessions(sessions.map(s => s.id === sessionId ? { ...s, active: false, closedAt: new Date().toISOString() } : s));
    onToast(`Session "${sess.sessionName}" closed. Sales: ${fmt(sess.totalSales)}`, "info");
    if (activeSessionId === sessionId) setActiveSessionId(null);
    if (activeSession2Id === sessionId) setActiveSession2Id(null);
  };

  const handleCharge = (sessionId: string, items: POSCartItem[], total: number, discount: number, method: string, ref: string) => {
    const txn: POSTransaction = {
      id: genId("txn"), sessionId, items, subtotal: total + discount, discount, total,
      paymentMethod: method as POSTransaction["paymentMethod"], paymentRef: ref || undefined,
      cashierId: currentUserId, createdAt: new Date().toISOString(),
    };
    onTransactions([...transactions, txn]);
    onSessions(sessions.map(s => s.id === sessionId ? { ...s, totalSales: s.totalSales + total, totalTransactions: s.totalTransactions + 1 } : s));
    items.forEach(item => onStockUpdate(item.productId, -item.qty));
    onToast(`Sale complete: ${fmt(total)} via ${method}`, "success");
  };

  const todayTxns = transactions.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString());
  const todaySales = todayTxns.reduce((s, t) => s + t.total, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-org-lg font-org-bold text-org-text-primary">Point of Sale</h1>
          <p className="text-org-sm text-org-text-secondary mt-0.5">
            {activeSessions.length}/2 sessions active &middot; Today: {fmt(todaySales)} ({todayTxns.length} transactions)
          </p>
        </div>
        {activeSessions.length < 2 && (
          <button onClick={() => setShowNewSession(true)} className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">
            + Open Session
          </button>
        )}
      </div>

      {/* Session cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeSessions.map(s => (
          <div key={s.id} className="bg-org-surface border border-org-primary/25 rounded-org-card p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-org-bold text-org-text-primary">{s.sessionName}</p>
                <p className="text-org-xs text-org-text-secondary">Cashier: {s.cashierName}</p>
              </div>
              <span className="text-org-xs bg-org-primary-light text-org-primary px-2.5 py-1 rounded-org-pill font-org-semibold inline-flex items-center gap-1"><Circle size={7} fill="currentColor" /> Active</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
                <p className="text-org-xs text-org-text-muted">Sales</p>
                <p className="font-org-bold text-org-text-primary">{fmt(s.totalSales)}</p>
              </div>
              <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
                <p className="text-org-xs text-org-text-muted">Transactions</p>
                <p className="font-org-bold text-org-text-primary">{s.totalTransactions}</p>
              </div>
            </div>
            <button onClick={() => setActiveSessionId(s.id)} className="w-full py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Open Terminal</button>
          </div>
        ))}

        {activeSessions.length === 0 && (
          <div className="sm:col-span-2 text-center py-12 px-5 text-org-text-secondary border-2 border-dashed border-org-border rounded-org-card">
            <div className="flex justify-center mb-2"><Monitor size={44} /></div>
            <p className="mb-3">No active POS sessions. Open a session to start selling.</p>
            <button onClick={() => setShowNewSession(true)} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">+ Open Session</button>
          </div>
        )}
      </div>

      {/* POS Terminal(s) */}
      {session1 && activeSessionId === session1.id && (
        <POSTerminal
          session={session1} products={products}
          onCharge={(items, total, discount, method, ref) => handleCharge(session1.id, items, total, discount, method, ref)}
          onClose={() => closeSession(session1.id)}
        />
      )}
      {session2 && activeSession2Id === session2.id && (
        <POSTerminal
          session={session2} products={products}
          onCharge={(items, total, discount, method, ref) => handleCharge(session2.id, items, total, discount, method, ref)}
          onClose={() => closeSession(session2.id)}
        />
      )}
      {session1 && session2 && (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button onClick={() => setActiveSessionId(session1.id)} className={`flex-1 py-2 rounded-org-sm text-org-sm font-org-semibold transition-colors ${activeSessionId === session1.id ? "bg-org-primary text-white" : "border border-org-border text-org-text-secondary"}`}>Open {session1.sessionName}</button>
          <button onClick={() => setActiveSession2Id(session2.id)} className={`flex-1 py-2 rounded-org-sm text-org-sm font-org-semibold transition-colors ${activeSession2Id === session2.id ? "bg-org-primary text-white" : "border border-org-border text-org-text-secondary"}`}>Open {session2.sessionName}</button>
        </div>
      )}

      {/* Recent transactions */}
      {todayTxns.length > 0 && (
        <div className="bg-org-surface border border-org-border rounded-org-card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-org-border font-org-bold text-org-text-primary">Today&apos;s Transactions</div>
          <div className="max-h-60 overflow-y-auto">
            {[...todayTxns].reverse().map(t => (
              <div key={t.id} className="flex items-center justify-between gap-3 px-5 py-2.5 border-b border-org-border last:border-0">
                <div className="min-w-0">
                  <p className="text-org-xs font-org-bold text-org-text-primary truncate">{t.items.map(i => i.name).join(", ")}</p>
                  <p className="text-org-xs text-org-text-muted">{new Date(t.createdAt).toLocaleTimeString("en-KE", {hour:"2-digit",minute:"2-digit"})} &middot; {t.paymentMethod}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-org-bold text-org-text-primary">{fmt(t.total)}</p>
                  {t.discount > 0 && <p className="text-[10px] text-org-text-muted">-{fmt(t.discount)} discount</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowNewSession(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-org-md font-org-bold text-org-text-primary mb-4">Open POS Session</h2>
            <div className="mb-3.5">
              <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Session Name</label>
              <input
                placeholder={`Till ${String.fromCharCode(65 + activeSessions.length)} - Morning`}
                value={newSessionName}
                onChange={e => setNewSessionName(e.target.value)}
                className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm"
              />
            </div>
            <div className="mb-5">
              <label className="block text-org-xs font-org-medium text-org-text-secondary mb-1.5">Opening Float (KSh)</label>
              <input
                type="number"
                value={openingFloat}
                onChange={e => setOpeningFloat(e.target.value)}
                className="w-full px-3 py-2 rounded-org-sm border border-org-border text-org-sm"
              />
            </div>
            <div className="flex gap-2.5 justify-end">
              <button onClick={() => setShowNewSession(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={openSession} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Open Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
