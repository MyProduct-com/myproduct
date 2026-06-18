import type { AdminOrder, AdminProduct, DailyStat, TopProduct, Theme } from "../../types/index";
import { StatCard, Card } from "../layout/UI";
import { fmt, fmtDateTime } from "../../utils/helpers";

interface DashboardProps {
  theme: Theme;
  orders: AdminOrder[];
  products: AdminProduct[];
  dailyStats: DailyStat[];
  topProducts: TopProduct[];
}

function MiniBarChart({ data, theme }: { data: DailyStat[]; theme: Theme }) {
  const maxRev = Math.max(...data.map(d => d.revenue));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = (d.revenue / maxRev) * 100;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ fontSize: 10, color: theme.textMuted, fontWeight: 700 }}>
              {fmt(d.revenue).replace("KSh ", "")}
            </div>
            <div style={{
              width: "100%", background: theme.primaryLight, borderRadius: "4px 4px 0 0",
              height: `${pct}%`, minHeight: 4, position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", inset: 0,
                background: i === data.length - 1 ? theme.primary : theme.accent,
                opacity: 0.7 + (i / data.length) * 0.3,
              }} />
            </div>
            <div style={{ fontSize: 10, color: theme.textMuted }}>{d.date.replace("Jun ", "")}</div>
          </div>
        );
      })}
    </div>
  );
}

function OrdersLineChart({ data, theme }: { data: DailyStat[]; theme: Theme }) {
  const maxOrders = Math.max(...data.map(d => d.orders));
  const W = 300, H = 100, pad = 10;
  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * (W - pad * 2),
    y: H - pad - ((d.orders / maxOrders) * (H - pad * 2)),
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},${H} ` + pts.map(p => `${p.x},${p.y}`).join(" ") + ` ${pts[pts.length-1].x},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 100 }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={theme.primary} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke={theme.primary} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={theme.primary} stroke="#fff" strokeWidth="2" />
      ))}
    </svg>
  );
}

export default function Dashboard({ theme, orders, products, dailyStats, topProducts }: DashboardProps) {
  const todayStats = dailyStats[dailyStats.length - 1];
  const yesterdayStats = dailyStats[dailyStats.length - 2];
  const totalRevenue = dailyStats.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = dailyStats.reduce((s, d) => s + d.orders, 0);
  const pendingOrders = orders.filter(o => o.status === "Pending" || o.status === "Under Processing").length;
  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold).length;
  const revenueGrowth = yesterdayStats ? (((todayStats.revenue - yesterdayStats.revenue) / yesterdayStats.revenue) * 100).toFixed(1) : "0";
  const recentOrders = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  const statusColors: Record<string, string> = {
    "Pending": "#f59e0b", "Under Processing": "#f97316",
    "In Transit": "#6366f1", "Delivered": "#16a34a",
    "Cancelled": "#ef4444",
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: theme.black }}>Dashboard</h2>
        <p style={{ margin: "4px 0 0", color: theme.textMuted, fontSize: 13 }}>
          Overview for the last 7 days · Last updated {new Date().toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard label="7-Day Revenue" value={fmt(totalRevenue)} sub={`Today: ${Number(revenueGrowth) >= 0 ? "+" : ""}${revenueGrowth}%`} icon="💰" color="#16a34a" theme={theme} />
        <StatCard label="Total Orders (7d)" value={totalOrders} sub={`${pendingOrders} pending`} icon="📦" color="#6366f1" theme={theme} />
        <StatCard label="Avg Order Value" value={fmt(Math.round(totalRevenue / totalOrders))} sub="This week" icon="📈" color="#f59e0b" theme={theme} />
        <StatCard label="Low Stock Alerts" value={lowStock} sub={lowStock > 0 ? "Needs attention" : "All good"} icon="⚠️" color={lowStock > 0 ? "#ef4444" : "#16a34a"} theme={theme} />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card theme={theme}>
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 4 }}>Revenue (7 days)</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>Daily revenue in KSh</div>
          <MiniBarChart data={dailyStats} theme={theme} />
        </Card>
        <Card theme={theme}>
          <div style={{ fontWeight: 700, fontSize: 15, color: theme.black, marginBottom: 4 }}>Order Volume</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8 }}>Orders per day</div>
          <OrdersLineChart data={dailyStats} theme={theme} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            {dailyStats.map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.black }}>{d.orders}</div>
                <div style={{ fontSize: 10, color: theme.textMuted }}>{d.date.replace("Jun ","")}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Orders + Top Products */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        {/* Recent Orders */}
        <Card theme={theme} style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black }}>Recent Orders</div>
          </div>
          <div>
            {recentOrders.map(order => (
              <div key={order.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 20px", borderBottom: `1px solid ${theme.border}`,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: theme.black }}>{order.id}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{order.customerName} · {fmtDateTime(order.createdAt)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 800, color: theme.accent, fontSize: 13 }}>{fmt(order.total)}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                    background: (statusColors[order.status] ?? "#94a3b8") + "20",
                    color: statusColors[order.status] ?? "#94a3b8",
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card theme={theme} style={{ padding: 0 }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.black }}>Top Products</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {topProducts.map((p, i) => (
              <div key={p.productId} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 20px",
              }}>
                <span style={{ fontWeight: 800, fontSize: 13, color: theme.textMuted, width: 20 }}>#{i + 1}</span>
                <img src={p.image} alt={p.name} style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: theme.black }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: theme.textMuted }}>{p.unitsSold} units sold</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 13, color: theme.accent }}>{fmt(p.revenue)}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
