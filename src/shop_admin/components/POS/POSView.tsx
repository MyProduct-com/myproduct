import { useState } from "react";
import type { AdminProduct, POSSession, POSCartItem, POSTransaction, Theme } from "../../types/index";
import { fmt, genId } from "../../utils/helpers";
import { Btn, Modal, SectionHeader } from "../layout/UI";

interface POSViewProps {
  theme: Theme;
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

const PAYMENT_OPTS = [
  { id: "mpesa", label: "M-Pesa", icon: "📱" },
  { id: "cash",  label: "Cash",   icon: "💵" },
  { id: "card",  label: "Card",   icon: "💳" },
];

function POSTerminal({
  session, products, theme, onCharge, onClose,
}: {
  session: POSSession;
  products: AdminProduct[];
  theme: Theme;
  onCharge: (items: POSCartItem[], total: number, discount: number, method: string, ref: string) => void;
  onClose: () => void;
}) {
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [payMethod, setPayMethod] = useState("mpesa");
  const [payRef, setPayRef] = useState("");
  const [showPay, setShowPay] = useState(false);

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
    setShowPay(false);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 0, border: `1px solid ${theme.border}`, borderRadius: theme.radiusCard, overflow: "hidden" }}>
      {/* Product panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: theme.bg }}>
        <div style={{ padding: 12, borderBottom: `1px solid ${theme.border}`, background: theme.surface }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: theme.black, marginBottom: 8 }}>
            🖥️ {session.sessionName}
            <span style={{ marginLeft: 8, fontSize: 11, color: theme.primary }}>● Active</span>
          </div>
          <input
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: theme.radius,
              border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, alignContent: "start" }}>
          {filteredProds.map(p => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                background: theme.surface, border: `1.5px solid ${theme.border}`, borderRadius: theme.radius,
                padding: 10, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.primary; e.currentTarget.style.background = theme.primaryLight; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.background = theme.surface; }}
            >
              <img src={p.image} alt={p.name} style={{ width: "100%", height: 70, objectFit: "cover", borderRadius: 6, marginBottom: 6 }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.black, lineHeight: 1.3 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: theme.accent, fontWeight: 800, marginTop: 4 }}>{fmt(p.price)}</div>
              <div style={{ fontSize: 10, color: theme.textMuted }}>{p.unit} · {p.stock} left</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart panel */}
      <div style={{ width: 300, display: "flex", flexDirection: "column", borderLeft: `1px solid ${theme.border}`, background: theme.surface }}>
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${theme.border}`, fontWeight: 800, fontSize: 15, color: theme.black }}>
          🛒 Cart {cart.length > 0 && <span style={{ background: theme.primary, color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{cart.reduce((s,i) => s+i.qty,0)}</span>}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px", color: theme.textMuted }}>
              <div style={{ fontSize: 36 }}>🛒</div>
              <p style={{ fontSize: 13 }}>Tap a product to add it</p>
            </div>
          ) : cart.map(item => (
            <div key={item.productId} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 0",
              borderBottom: `1px solid ${theme.border}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.black }}>{item.name}</div>
                <div style={{ fontSize: 11, color: theme.textMuted }}>{fmt(item.price)} each</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button onClick={() => changeQty(item.productId, -1)} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 4, width: 24, height: 24, cursor: "pointer", fontWeight: 900 }}>−</button>
                <span style={{ fontWeight: 700, fontSize: 13, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                <button onClick={() => changeQty(item.productId, 1)} style={{ background: theme.primary, border: "none", borderRadius: 4, width: 24, height: 24, cursor: "pointer", color: "#fff", fontWeight: 900 }}>+</button>
              </div>
              <div style={{ minWidth: 60, textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 12, color: theme.accent }}>{fmt(item.price * item.qty)}</div>
                <button onClick={() => removeItem(item.productId)} style={{ background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 11 }}>remove</button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding: 14, borderTop: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textMuted, marginBottom: 6 }}>
            <span>Subtotal</span><span>{fmt(subtotal)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>Discount</span>
            <input
              type="number"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value))}
              style={{ width: 80, padding: "4px 8px", borderRadius: 6, border: `1px solid ${theme.border}`, fontSize: 13, textAlign: "right" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 18, color: theme.accent, marginBottom: 14 }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>

          {/* Payment method */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {PAYMENT_OPTS.map(o => (
              <button
                key={o.id}
                onClick={() => setPayMethod(o.id)}
                style={{
                  flex: 1, padding: "7px 4px", border: `2px solid ${payMethod === o.id ? theme.primary : theme.border}`,
                  borderRadius: theme.radius, background: payMethod === o.id ? theme.primaryLight : theme.bg,
                  cursor: "pointer", fontSize: 11, fontWeight: 700, color: payMethod === o.id ? theme.primary : theme.text,
                }}
              >
                {o.icon} {o.label}
              </button>
            ))}
          </div>

          {payMethod === "mpesa" && (
            <input
              placeholder="M-Pesa ref (optional)"
              value={payRef}
              onChange={e => setPayRef(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: theme.radius, border: `1px solid ${theme.border}`, fontSize: 12, boxSizing: "border-box", marginBottom: 10 }}
            />
          )}

          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            style={{
              width: "100%", padding: "12px", background: cart.length === 0 ? theme.border : theme.primary,
              color: "#fff", border: "none", borderRadius: theme.radius,
              fontWeight: 800, fontSize: 15, cursor: cart.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            Charge {fmt(total)}
          </button>
          <button onClick={onClose} style={{ width: "100%", padding: "8px", background: "none", border: "none", color: theme.danger, cursor: "pointer", fontSize: 12, marginTop: 8 }}>
            Close Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default function POSView({ theme, products, sessions, transactions, currentUserId, currentUserName, onSessions, onTransactions, onStockUpdate, onToast }: POSViewProps) {
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [openingFloat, setOpeningFloat] = useState("5000");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession2Id, setActiveSession2Id] = useState<string | null>(null);
  const [receiptTxn, setReceiptTxn] = useState<POSTransaction | null>(null);

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
      paymentMethod: method as any, paymentRef: ref || undefined,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionHeader
        title="Point of Sale"
        subtitle={`${activeSessions.length}/2 sessions active · Today: ${fmt(todaySales)} (${todayTxns.length} transactions)`}
        theme={theme}
        action={
          activeSessions.length < 2
            ? <Btn theme={theme} onClick={() => setShowNewSession(true)}>+ Open Session</Btn>
            : undefined
        }
      />

      {/* Session cards */}
      <div style={{ display: "flex", gap: 16 }}>
        {activeSessions.map(s => (
          <div key={s.id} style={{
            flex: 1, background: theme.surface, border: `1.5px solid ${theme.primary}40`,
            borderRadius: theme.radiusCard, padding: 16,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: theme.black }}>{s.sessionName}</div>
                <div style={{ fontSize: 12, color: theme.textMuted }}>Cashier: {s.cashierName}</div>
              </div>
              <span style={{ fontSize: 11, background: theme.primaryLight, color: theme.primary, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>● Active</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: theme.bg, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.textMuted }}>Sales</div>
                <div style={{ fontWeight: 800, color: theme.accent }}>{fmt(s.totalSales)}</div>
              </div>
              <div style={{ background: theme.bg, borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: theme.textMuted }}>Transactions</div>
                <div style={{ fontWeight: 800, color: theme.black }}>{s.totalTransactions}</div>
              </div>
            </div>
            <Btn theme={theme} style={{ width: "100%" }} onClick={() => { setActiveSessionId(s.id); }}>Open Terminal</Btn>
          </div>
        ))}

        {activeSessions.length === 0 && (
          <div style={{ flex: 1, textAlign: "center", padding: "48px 20px", color: theme.textMuted, border: `2px dashed ${theme.border}`, borderRadius: theme.radiusCard }}>
            <div style={{ fontSize: 48 }}>🖥️</div>
            <p>No active POS sessions. Open a session to start selling.</p>
            <Btn theme={theme} onClick={() => setShowNewSession(true)}>+ Open Session</Btn>
          </div>
        )}
      </div>

      {/* POS Terminal(s) */}
      {session1 && activeSessionId === session1.id && (
        <div style={{ height: 580 }}>
          <POSTerminal
            session={session1} products={products} theme={theme}
            onCharge={(items, total, discount, method, ref) => handleCharge(session1.id, items, total, discount, method, ref)}
            onClose={() => closeSession(session1.id)}
          />
        </div>
      )}
      {session2 && activeSession2Id === session2.id && (
        <div style={{ height: 580 }}>
          <POSTerminal
            session={session2} products={products} theme={theme}
            onCharge={(items, total, discount, method, ref) => handleCharge(session2.id, items, total, discount, method, ref)}
            onClose={() => closeSession(session2.id)}
          />
        </div>
      )}
      {session1 && session2 && (
        <div style={{ display: "flex", gap: 10 }}>
          <Btn theme={theme} variant={activeSessionId === session1.id ? "primary" : "secondary"} onClick={() => setActiveSessionId(session1.id)}>Open {session1.sessionName}</Btn>
          <Btn theme={theme} variant={activeSession2Id === session2.id ? "primary" : "secondary"} onClick={() => setActiveSession2Id(session2.id)}>Open {session2.sessionName}</Btn>
        </div>
      )}

      {/* Recent transactions */}
      {todayTxns.length > 0 && (
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: theme.radiusCard, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${theme.border}`, fontWeight: 700, color: theme.black }}>Today's Transactions</div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {[...todayTxns].reverse().map(t => (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 20px", borderBottom: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.black }}>{t.items.map(i => i.name).join(", ")}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>{new Date(t.createdAt).toLocaleTimeString("en-KE", {hour:"2-digit",minute:"2-digit"})} · {t.paymentMethod}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: theme.accent }}>{fmt(t.total)}</div>
                  {t.discount > 0 && <div style={{ fontSize: 10, color: theme.textMuted }}>-{fmt(t.discount)} discount</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Session Modal */}
      {showNewSession && (
        <Modal title="Open POS Session" onClose={() => setShowNewSession(false)} theme={theme} width={400}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 5, textTransform: "uppercase" }}>Session Name</label>
            <input
              placeholder={`Till ${String.fromCharCode(65 + activeSessions.length)} - Morning`}
              value={newSessionName}
              onChange={e => setNewSessionName(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 5, textTransform: "uppercase" }}>Opening Float (KSh)</label>
            <input
              type="number"
              value={openingFloat}
              onChange={e => setOpeningFloat(e.target.value)}
              style={{ width: "100%", padding: "9px 12px", borderRadius: theme.radius, border: `1.5px solid ${theme.border}`, fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn theme={theme} variant="secondary" onClick={() => setShowNewSession(false)}>Cancel</Btn>
            <Btn theme={theme} onClick={openSession}>Open Session</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
