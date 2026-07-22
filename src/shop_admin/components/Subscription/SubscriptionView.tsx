import { useState } from "react";
import { AlarmClock, RotateCcw, ArrowUp, Check, RefreshCw, Circle } from "lucide-react";
import type { Subscription, SubscriptionPlan, Theme } from "../../types/index";
import { SectionHeader, Btn, Card, Modal } from "../layout/UI";
import { fmt, daysUntil, fmtDate } from "../../utils/helpers";

interface SubscriptionViewProps {
  theme: Theme;
  subscription: Subscription;
  plans: SubscriptionPlan[];
  onSubscription: (s: Subscription) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

export default function SubscriptionView({ theme, subscription, plans, onSubscription, onToast }: SubscriptionViewProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showRenew, setShowRenew] = useState(false);

  const currentPlan = plans.find(p => p.id === subscription.planId)!;
  const days = daysUntil(subscription.expiryDate);
  const expiring = days <= 14;

  const confirmUpgrade = () => {
    if (!selectedPlan) return;
    const newExpiry = new Date();
    newExpiry.setMonth(newExpiry.getMonth() + 1);
    onSubscription({ ...subscription, planId: selectedPlan.id, startDate: new Date().toISOString().slice(0,10), expiryDate: newExpiry.toISOString().slice(0,10), status: "active" });
    onToast(`Upgraded to ${selectedPlan.name} plan!`, "success");
    setShowUpgrade(false);
    setSelectedPlan(null);
  };

  const confirmRenew = () => {
    const newExpiry = new Date(subscription.expiryDate);
    newExpiry.setMonth(newExpiry.getMonth() + 1);
    onSubscription({ ...subscription, expiryDate: newExpiry.toISOString().slice(0,10), status: "active" });
    onToast("Subscription renewed for 1 month.", "success");
    setShowRenew(false);
  };

  const statusColor = subscription.status === "active" ? theme.primary : "#ef4444";

  return (
    <div>
      <SectionHeader title="Subscription" subtitle="Manage your plan, billing, and feature access." theme={theme} />

      {/* Expiry warning */}
      {expiring && (
        <div style={{
          background: days <= 7 ? "#fee2e2" : "#fef9c3",
          border: `1px solid ${days <= 7 ? "#fca5a5" : "#fcd34d"}`,
          borderRadius: theme.radius, padding:"12px 16px", marginBottom:20,
          display:"flex", alignItems:"center", gap:10,
        }}>
          <AlarmClock size={20} color={days <= 7 ? "#991b1b" : "#92400e"} />
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:700, color: days <= 7 ? "#991b1b" : "#92400e" }}>
              {days <= 0 ? "Subscription expired!" : `Expires in ${days} day${days!==1?"s":""}!`}
            </span>
            <span style={{ fontSize:13, color: days <= 7 ? "#7f1d1d" : "#78350f", marginLeft:8 }}>
              Renew to avoid service interruption.
            </span>
          </div>
          <Btn theme={theme} onClick={() => setShowRenew(true)}>Renew Now</Btn>
        </div>
      )}

      {/* Current plan card */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
        <Card theme={theme}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
            <div>
              <div style={{ fontSize:12, color:theme.textMuted, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Current Plan</div>
              <div style={{ fontSize:28, fontWeight:900, color:theme.black, marginTop:4 }}>{currentPlan.name}</div>
            </div>
            <span style={{ padding:"4px 14px", borderRadius:20, background:statusColor+"18", color:statusColor, fontWeight:700, fontSize:12, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Circle size={8} fill="currentColor" /> {subscription.status.charAt(0).toUpperCase()+subscription.status.slice(1)}
            </span>
          </div>
          <div style={{ fontSize:24, fontWeight:900, color:theme.accent, marginBottom:16 }}>
            {fmt(currentPlan.price)}<span style={{ fontSize:13, color:theme.textMuted, fontWeight:500 }}>/month</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
            <div style={{ background:theme.bg, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:theme.textMuted }}>Renews</div>
              <div style={{ fontWeight:700, color:theme.black }}>{fmtDate(subscription.expiryDate)}</div>
            </div>
            <div style={{ background:theme.bg, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:theme.textMuted }}>Days Left</div>
              <div style={{ fontWeight:700, color: days <= 7 ? "#ef4444" : theme.black }}>{Math.max(0, days)} days</div>
            </div>
            <div style={{ background:theme.bg, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:theme.textMuted }}>Auto-Renew</div>
              <div style={{ fontWeight:700, color: subscription.autoRenew ? theme.primary : theme.textMuted }}>{subscription.autoRenew ? "On" : "Off"}</div>
            </div>
            <div style={{ background:theme.bg, borderRadius:8, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:theme.textMuted }}>Payment</div>
              <div style={{ fontWeight:700, color:theme.black, textTransform:"capitalize" }}>{subscription.paymentMethod}</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn theme={theme} onClick={() => setShowRenew(true)}><RotateCcw size={14} /> Renew</Btn>
            <Btn theme={theme} variant="ghost" onClick={() => setShowUpgrade(true)}><ArrowUp size={14} /> Upgrade</Btn>
          </div>
        </Card>

        {/* Current plan features */}
        <Card theme={theme}>
          <div style={{ fontWeight:700, fontSize:15, color:theme.black, marginBottom:14 }}>Plan Features</div>
          {currentPlan.features.map((f, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", borderBottom: i < currentPlan.features.length-1 ? `1px solid ${theme.border}` : "none" }}>
              <Check size={14} color={theme.primary} strokeWidth={3} />
              <span style={{ fontSize:13, color:theme.text }}>{f}</span>
            </div>
          ))}
          <div style={{ marginTop:16, padding:"12px 14px", background:theme.primaryLight, borderRadius:theme.radius, border:`1px solid ${theme.primary}30` }}>
            <div style={{ fontSize:12, fontWeight:700, color:theme.primary }}>Usage Limits</div>
            <div style={{ fontSize:12, color:theme.textMuted, marginTop:4 }}>
              Products: {currentPlan.limits.products < 0 ? "Unlimited" : currentPlan.limits.products} ·
              Staff: {currentPlan.limits.staff < 0 ? "Unlimited" : currentPlan.limits.staff} ·
              POS: {currentPlan.limits.posTerminals < 0 ? "Unlimited" : currentPlan.limits.posTerminals}
            </div>
          </div>
        </Card>
      </div>

      {/* All plans */}
      <div style={{ fontWeight:700, fontSize:16, color:theme.black, marginBottom:14 }}>Available Plans</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16 }}>
        {plans.map(plan => {
          const isCurrent = plan.id === subscription.planId;
          return (
            <div key={plan.id} style={{
              background: theme.surface, border: `2px solid ${isCurrent ? theme.primary : theme.border}`,
              borderRadius: theme.radiusCard, padding:20, position:"relative",
              boxShadow: plan.popular ? "0 8px 24px rgba(22,163,74,0.12)" : undefined,
            }}>
              {plan.popular && (
                <div style={{
                  position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                  background:theme.primary, color:"#fff", fontSize:10, fontWeight:800,
                  padding:"3px 14px", borderRadius:20,
                }}>POPULAR</div>
              )}
              {isCurrent && (
                <div style={{
                  position:"absolute", top:-12, right:14,
                  background:theme.accent, color:"#fff", fontSize:10, fontWeight:800,
                  padding:"3px 14px", borderRadius:20,
                }}>CURRENT</div>
              )}
              <div style={{ fontWeight:800, fontSize:18, color:theme.black, marginBottom:4 }}>{plan.name}</div>
              <div style={{ fontSize:22, fontWeight:900, color:theme.accent, marginBottom:14 }}>
                {fmt(plan.price)}<span style={{ fontSize:12, color:theme.textMuted, fontWeight:500 }}>/mo</span>
              </div>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 16px", display:"flex", flexDirection:"column", gap:6 }}>
                {plan.features.map((f,i) => (
                  <li key={i} style={{ fontSize:12, color:theme.text, display:"flex", gap:6, alignItems:"center" }}>
                    <Check size={12} color={theme.primary} />{f}
                  </li>
                ))}
              </ul>
              <Btn
                theme={theme}
                variant={isCurrent ? "secondary" : "primary"}
                disabled={isCurrent}
                style={{ width:"100%" }}
                onClick={() => { setSelectedPlan(plan); setShowUpgrade(true); }}
              >
                {isCurrent ? "Current Plan" : "Switch"}
              </Btn>
            </div>
          );
        })}
      </div>

      {/* Upgrade confirm */}
      {showUpgrade && selectedPlan && (
        <Modal title="Confirm Plan Change" onClose={() => setShowUpgrade(false)} theme={theme} width={420}>
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:theme.primary }}><ArrowUp size={48} /></div>
            <div style={{ fontWeight:800, fontSize:18, color:theme.black, marginBottom:8 }}>
              Switch to {selectedPlan.name}?
            </div>
            <div style={{ fontSize:13, color:theme.textMuted, marginBottom:20 }}>
              You'll be billed {fmt(selectedPlan.price)}/month starting today.
              Your new plan starts immediately.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Btn theme={theme} variant="secondary" onClick={() => setShowUpgrade(false)}>Cancel</Btn>
              <Btn theme={theme} onClick={confirmUpgrade}>Confirm & Switch</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Renew confirm */}
      {showRenew && (
        <Modal title="Renew Subscription" onClose={() => setShowRenew(false)} theme={theme} width={420}>
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:12, color:theme.primary }}><RefreshCw size={48} /></div>
            <div style={{ fontWeight:800, fontSize:18, color:theme.black, marginBottom:8 }}>
              Renew {currentPlan.name} Plan?
            </div>
            <div style={{ fontSize:13, color:theme.textMuted, marginBottom:20 }}>
              Extends your subscription by 1 month. New expiry: <strong>{fmtDate(new Date(new Date(subscription.expiryDate).setMonth(new Date(subscription.expiryDate).getMonth()+1)).toISOString())}</strong>
            </div>
            <div style={{ background:theme.bg, borderRadius:theme.radius, padding:14, marginBottom:20 }}>
              <div style={{ fontSize:22, fontWeight:900, color:theme.accent }}>{fmt(currentPlan.price)}</div>
              <div style={{ fontSize:12, color:theme.textMuted }}>via {subscription.paymentMethod} to {subscription.billingEmail}</div>
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Btn theme={theme} variant="secondary" onClick={() => setShowRenew(false)}>Cancel</Btn>
              <Btn theme={theme} onClick={confirmRenew}>Pay & Renew</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
