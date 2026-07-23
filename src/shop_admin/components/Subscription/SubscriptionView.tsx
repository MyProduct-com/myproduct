import { useState } from "react";
import { AlarmClock, RotateCcw, ArrowUp, Check, RefreshCw, Circle } from "lucide-react";
import type { Subscription, SubscriptionPlan } from "../../types/index";
import { fmt, daysUntil, fmtDate } from "../../utils/helpers";

interface SubscriptionViewProps {
  subscription: Subscription;
  plans: SubscriptionPlan[];
  onSubscription: (s: Subscription) => void;
  onToast: (msg: string, type?: "success"|"error"|"info") => void;
}

export default function SubscriptionView({ subscription, plans, onSubscription, onToast }: SubscriptionViewProps) {
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-org-lg font-org-bold text-org-text-primary">Subscription</h1>
        <p className="text-org-sm text-org-text-secondary mt-0.5">Manage your plan, billing, and feature access.</p>
      </div>

      {/* Expiry warning */}
      {expiring && (
        <div className={`flex flex-col sm:flex-row sm:items-center gap-3 rounded-org-sm px-4 py-3 border ${days <= 7 ? "bg-org-danger-bg border-org-danger/30" : "bg-org-warning/10 border-org-warning/30"}`}>
          <AlarmClock size={20} className={`shrink-0 ${days <= 7 ? "text-org-danger" : "text-org-warning"}`} />
          <div className="flex-1 text-org-sm">
            <span className={`font-org-bold ${days <= 7 ? "text-org-danger" : "text-org-warning"}`}>
              {days <= 0 ? "Subscription expired!" : `Expires in ${days} day${days!==1?"s":""}!`}
            </span>
            <span className="text-org-text-secondary ml-2">Renew to avoid service interruption.</span>
          </div>
          <button onClick={() => setShowRenew(true)} className="shrink-0 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Renew Now</button>
        </div>
      )}

      {/* Current plan card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-org-xs font-org-semibold text-org-text-muted uppercase tracking-wide">Current Plan</p>
              <p className="text-org-xl font-org-bold text-org-text-primary mt-1">{currentPlan.name}</p>
            </div>
            <span className={`px-3 py-1 rounded-org-pill font-org-semibold text-org-xs inline-flex items-center gap-1.5 ${subscription.status === "active" ? "bg-org-success-bg text-org-success" : "bg-org-danger-bg text-org-danger"}`}>
              <Circle size={8} fill="currentColor" /> {subscription.status.charAt(0).toUpperCase()+subscription.status.slice(1)}
            </span>
          </div>
          <p className="text-org-xl font-org-bold text-org-text-primary mb-4">
            {fmt(currentPlan.price)}<span className="text-org-sm text-org-text-muted font-org-normal">/month</span>
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
              <p className="text-org-xs text-org-text-muted">Renews</p>
              <p className="font-org-bold text-org-text-primary">{fmtDate(subscription.expiryDate)}</p>
            </div>
            <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
              <p className="text-org-xs text-org-text-muted">Days Left</p>
              <p className={`font-org-bold ${days <= 7 ? "text-org-danger" : "text-org-text-primary"}`}>{Math.max(0, days)} days</p>
            </div>
            <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
              <p className="text-org-xs text-org-text-muted">Auto-Renew</p>
              <p className={`font-org-bold ${subscription.autoRenew ? "text-org-primary" : "text-org-text-muted"}`}>{subscription.autoRenew ? "On" : "Off"}</p>
            </div>
            <div className="bg-org-surface-alt rounded-lg px-3.5 py-2.5">
              <p className="text-org-xs text-org-text-muted">Payment</p>
              <p className="font-org-bold text-org-text-primary capitalize">{subscription.paymentMethod}</p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setShowRenew(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors"><RotateCcw size={14} /> Renew</button>
            <button onClick={() => setShowUpgrade(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-org-sm border border-org-border text-org-text-secondary hover:bg-org-surface-alt text-org-sm font-org-medium transition-colors"><ArrowUp size={14} /> Upgrade</button>
          </div>
        </div>

        {/* Current plan features */}
        <div className="bg-org-surface rounded-org-card shadow-org-card p-4">
          <p className="font-org-bold text-org-md text-org-text-primary mb-3.5">Plan Features</p>
          <div className="flex flex-col">
            {currentPlan.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 border-b border-org-border last:border-0">
                <Check size={14} className="text-org-primary shrink-0" strokeWidth={3} />
                <span className="text-org-sm text-org-text-primary">{f}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 px-3.5 py-3 bg-org-primary-light rounded-org-sm border border-org-primary/20">
            <p className="text-org-xs font-org-bold text-org-primary">Usage Limits</p>
            <p className="text-org-xs text-org-text-secondary mt-1">
              Products: {currentPlan.limits.products < 0 ? "Unlimited" : currentPlan.limits.products} &middot;
              Staff: {currentPlan.limits.staff < 0 ? "Unlimited" : currentPlan.limits.staff} &middot;
              POS: {currentPlan.limits.posTerminals < 0 ? "Unlimited" : currentPlan.limits.posTerminals}
            </p>
          </div>
        </div>
      </div>

      {/* All plans */}
      <div>
        <p className="font-org-bold text-org-md text-org-text-primary mb-3.5">Available Plans</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {plans.map(plan => {
            const isCurrent = plan.id === subscription.planId;
            return (
              <div key={plan.id} className={`relative bg-org-surface rounded-org-card p-5 border-2 ${isCurrent ? "border-org-primary" : "border-org-border"} ${plan.popular ? "shadow-lg" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-org-primary text-white text-[10px] font-org-bold px-3.5 py-1 rounded-org-pill">POPULAR</div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 right-3.5 bg-org-accent text-white text-[10px] font-org-bold px-3.5 py-1 rounded-org-pill">CURRENT</div>
                )}
                <p className="font-org-bold text-org-md text-org-text-primary mb-1">{plan.name}</p>
                <p className="text-org-lg font-org-bold text-org-text-primary mb-3.5">
                  {fmt(plan.price)}<span className="text-org-xs text-org-text-muted font-org-normal">/mo</span>
                </p>
                <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-1.5">
                  {plan.features.map((f,i) => (
                    <li key={i} className="text-org-xs text-org-text-primary flex gap-1.5 items-center">
                      <Check size={12} className="text-org-primary shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => { setSelectedPlan(plan); setShowUpgrade(true); }}
                  className={`w-full py-2 rounded-org-sm text-org-sm font-org-semibold transition-colors ${
                    isCurrent ? "bg-org-surface-alt text-org-text-secondary cursor-not-allowed" : "bg-org-primary hover:bg-org-primary-hover text-white"
                  }`}
                >
                  {isCurrent ? "Current Plan" : "Switch"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upgrade confirm */}
      {showUpgrade && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowUpgrade(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-3 text-org-primary"><ArrowUp size={44} /></div>
            <p className="font-org-bold text-org-md text-org-text-primary mb-2">Switch to {selectedPlan.name}?</p>
            <p className="text-org-sm text-org-text-secondary mb-5">
              You&apos;ll be billed {fmt(selectedPlan.price)}/month starting today. Your new plan starts immediately.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setShowUpgrade(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={confirmUpgrade} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Confirm & Switch</button>
            </div>
          </div>
        </div>
      )}

      {/* Renew confirm */}
      {showRenew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowRenew(false)}>
          <div className="bg-org-surface rounded-org-card shadow-lg w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-3 text-org-primary"><RefreshCw size={44} /></div>
            <p className="font-org-bold text-org-md text-org-text-primary mb-2">Renew {currentPlan.name} Plan?</p>
            <p className="text-org-sm text-org-text-secondary mb-5">
              Extends your subscription by 1 month. New expiry: <strong className="text-org-text-primary">{fmtDate(new Date(new Date(subscription.expiryDate).setMonth(new Date(subscription.expiryDate).getMonth()+1)).toISOString())}</strong>
            </p>
            <div className="bg-org-surface-alt rounded-org-sm p-3.5 mb-5">
              <p className="text-org-lg font-org-bold text-org-text-primary">{fmt(currentPlan.price)}</p>
              <p className="text-org-xs text-org-text-secondary">via {subscription.paymentMethod} to {subscription.billingEmail}</p>
            </div>
            <div className="flex gap-2.5 justify-center">
              <button onClick={() => setShowRenew(false)} className="px-4 py-2 rounded-org-sm border border-org-border text-org-sm font-org-medium text-org-text-secondary hover:bg-org-surface-alt transition-colors">Cancel</button>
              <button onClick={confirmRenew} className="px-4 py-2 rounded-org-sm bg-org-primary hover:bg-org-primary-hover text-white text-org-sm font-org-semibold transition-colors">Pay & Renew</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
