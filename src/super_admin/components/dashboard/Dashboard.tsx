import React, { useState } from "react";
import { SA_THEME as T } from "../../data/theme";
import type { SuperAdmin, SystemMetrics } from "../../types/index";
import { StatCard, Card, Badge, Btn, MiniBarChart } from "../layout/UI";
import { fmt, fmtDate } from "../../utils/helpers";
import { statusColor } from "../../utils/helpers";
import type { ManagedShop } from "../../types/index";

interface Props {
  admin: SuperAdmin;
  metrics: SystemMetrics;
  shops: ManagedShop[];
  onNavigate: (v: string) => void;
}

export function SuperAdminDashboard({ admin, metrics, shops, onNavigate }: Props) {
  const [showShopVisits, setShowShopVisits] = useState(false);

  const pc = statusColor(admin.privilegeLevel);
  const expiringShops = shops.filter(s => {
    const days = Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000);
    return days <= 14 && days > 0 && s.status !== "pulled_down";
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.primary} 0%, ${T.accent} 100%)`,
        borderRadius: T.radiusCard, padding: "22px 26px",
        display: "flex", alignItems: "center", gap: 18,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, color: "#fff", fontWeight: 900, flexShrink: 0,
        }}>
          {admin.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Welcome back, {admin.name.split(" ")[0]} 👋</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.75)", marginTop: 3 }}>
            Super Admin · {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", marginBottom: 4 }}>Privilege Level</div>
          <Badge label={admin.privilegeLevel === "full" ? "✦ Full Privilege" : "◑ Partial Privilege"} bg="rgba(255,255,255,.2)" color="#fff" />
          {admin.privilegeLevel === "partial" && (
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
              {admin.privileges.length} of 10 modules active
            </div>
          )}
        </div>
      </div>

      {/* ── Key Metrics ── */}
      <div>
        <h3 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>System Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          <StatCard icon="🏪" label="Total Shops" value={metrics.totalShops} sub={`${metrics.activeShops} active`} color={T.primary} />
          <StatCard icon="👥" label="Subscribers" value={metrics.totalSubscribers} sub="registered users" color={T.accent} />
          <StatCard icon="💰" label="Total Revenue" value={fmt(metrics.totalRevenue)} sub={`${fmt(metrics.monthlyRevenue)} this month`} color={T.success} />
          <StatCard icon="📦" label="Total Orders" value={metrics.totalOrders.toLocaleString()} sub="all shops" />
          <StatCard icon="🛍️" label="Abandoned Carts" value={metrics.abandonedCarts} sub="unpurchased carts" color={T.warning} />
          <StatCard icon="👁️" label="Page Views" value={metrics.totalPageViews.toLocaleString()} sub="total visits" color={T.primary} />
          <StatCard icon="🎧" label="Open Tickets" value={metrics.activeTickets} sub={`Avg ${metrics.avgResponseTime}h response`} color={metrics.activeTickets > 0 ? T.danger : T.success} />
          <StatCard icon="⚠️" label="Suspended" value={metrics.suspendedShops} sub="shops suspended" color={T.danger} />
        </div>
      </div>

      {/* ── Subscriber + Package Breakdown ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Package distribution */}
        <Card>
          <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Package Distribution</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {metrics.packageBreakdown.map(pkg => (
              <div key={pkg.packageName} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: pkg.color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 13, color: T.text }}>{pkg.packageName}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{pkg.count}</div>
                <div style={{ width: 80, height: 8, background: T.bg, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(pkg.count / metrics.totalShops) * 100}%`, background: pkg.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Shop utilisation */}
        <Card>
          <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Package Utilisation</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shops.map(s => {
              const pct = Math.round((s.shopsCreated / s.packageShopLimit) * 100);
              return (
                <div key={s.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ color: T.text, fontWeight: 600 }}>{s.logoEmoji} {s.name}</span>
                    <span style={{ color: T.textMuted }}>{s.shopsCreated}/{s.packageShopLimit} shops</span>
                  </div>
                  <div style={{ height: 6, background: T.bg, borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? T.success : pct >= 75 ? T.warning : T.primary, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Traffic Chart ── */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {showShopVisits ? "Per-Shop Visits (All Time)" : "Platform Daily Traffic (7 days)"}
          </h4>
          <Btn variant="ghost" size="sm" onClick={() => setShowShopVisits(v => !v)}>
            {showShopVisits ? "Show Platform Traffic" : "Per-Shop Visits ↗"}
          </Btn>
        </div>

        {showShopVisits ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {metrics.shopVisits.map(sv => (
              <div key={sv.shopId} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 140, fontSize: 12, fontWeight: 600, color: T.text, flexShrink: 0 }}>{sv.shopName}</div>
                <div style={{ flex: 1, height: 12, background: T.bg, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(sv.visits / metrics.shopVisits[0].visits) * 100}%`, background: T.primary, borderRadius: 6 }} />
                </div>
                <div style={{ width: 60, fontSize: 12, color: T.textMuted, textAlign: "right" }}>{sv.visits.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: T.success, minWidth: 64, textAlign: "right", fontWeight: 600 }}>+{sv.today} today</div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <MiniBarChart
              data={metrics.dailyVisits.map(d => ({ label: d.date, value: d.visits }))}
              color={T.primary}
            />
            <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 12, color: T.textMuted }}>
              <span>📈 Total views: <strong style={{ color: T.text }}>{metrics.dailyVisits.reduce((a, b) => a + b.visits, 0).toLocaleString()}</strong></span>
              <span>👤 Unique visitors: <strong style={{ color: T.text }}>{metrics.dailyVisits.reduce((a, b) => a + b.uniqueVisitors, 0).toLocaleString()}</strong></span>
            </div>
          </div>
        )}
      </Card>

      {/* ── Expiring Subscriptions Alert ── */}
      {expiringShops.length > 0 && (
        <Card style={{ borderLeft: `4px solid ${T.warning}` }}>
          <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: T.warning }}>⚠️ Subscriptions Expiring Soon</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {expiringShops.map(s => {
              const days = Math.ceil((new Date(s.expiresAt).getTime() - Date.now()) / 86400000);
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                  <span>{s.logoEmoji} <strong>{s.name}</strong> — {s.ownerName}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: days <= 3 ? T.danger : T.warning, fontWeight: 700 }}>{days}d left ({fmtDate(s.expiresAt)})</span>
                    <Btn size="sm" variant="ghost" onClick={() => onNavigate("reminders")}>Send Reminder</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Quick Actions ── */}
      <Card>
        <h4 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Actions</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Btn onClick={() => onNavigate("onboarding")} variant="primary">🚀 Onboard New User</Btn>
          <Btn onClick={() => onNavigate("issues")} variant="ghost">🎧 View Support Tickets</Btn>
          <Btn onClick={() => onNavigate("reminders")} variant="ghost">📣 Send Reminder</Btn>
          <Btn onClick={() => onNavigate("shops")} variant="ghost">🏪 Manage Shops</Btn>
          <Btn onClick={() => onNavigate("marketplace")} variant="ghost">🌐 Marketplace</Btn>
          {admin.privilegeLevel === "full" && (
            <Btn onClick={() => onNavigate("dbterminal")} variant="accent">🖥️ DB Terminal</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}
