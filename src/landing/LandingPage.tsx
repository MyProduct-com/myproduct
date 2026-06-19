"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ─── Design tokens (aligned with globals.css brand) ──────────────────────────
const C = {
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

// ─── Demo shops for the animated hero card ─────────────────────────────────
const DEMO_SHOPS = [
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

const PACKAGES = [
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

const TESTIMONIALS = [
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

const HOW_IT_WORKS = [
  { step: "01", icon: "🚀", title: "Sign up & choose a plan", desc: "Create your account in minutes. Pick the package that fits your business — you can always upgrade." },
  { step: "02", icon: "🏪", title: "Build your shop", desc: "Add your products, set your prices, and customise your store. Your shop is live the moment you publish." },
  { step: "03", icon: "💳", title: "Start accepting payments", desc: "M-Pesa, card, or bank — customers pay the way they prefer. Funds land in your account." },
  { step: "04", icon: "📈", title: "Grow with the platform", desc: "List on the shared marketplace, track orders with our POS, manage staff, and watch your analytics climb." },
];

const STATS = [
  { value: "2,400+", label: "Products listed" },
  { value: "KSh 6.7M+", label: "Revenue processed" },
  { value: "6+", label: "Active businesses" },
  { value: "98%", label: "Uptime guaranteed" },
];

const FEATURES = [
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

// ─── Utility ─────────────────────────────────────────────────────────────────
function useScrolled(threshold = 60) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useCycling(length: number, interval = 3600) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % length), interval);
    return () => clearInterval(id);
  }, [length, interval]);
  return [idx, setIdx] as const;
}

// ─── Components ───────────────────────────────────────────────────────────────

function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "none",
      transition: "all 0.3s ease",
      padding: "0 24px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", height: 68, display: "flex", alignItems: "center", gap: 32 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.action})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 900 }}>M</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: scrolled ? C.ink : "#fff", letterSpacing: "-0.02em" }}>MyProduct</span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto", flex: 1, justifyContent: "center" }} className="desktop-nav">
          {["Features", "Pricing", "Marketplace", "About"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              textDecoration: "none", padding: "6px 14px", borderRadius: 8,
              color: scrolled ? C.charcoal : "rgba(255,255,255,0.85)",
              fontWeight: 500, fontSize: 14, transition: "all .15s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = scrolled ? C.canvas : "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; }}>
              {item}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <Link href="/auth/login" style={{
            textDecoration: "none", padding: "8px 16px", borderRadius: 8, fontWeight: 600, fontSize: 14,
            color: scrolled ? C.forest : "rgba(255,255,255,0.9)",
            border: `1.5px solid ${scrolled ? C.border : "rgba(255,255,255,0.3)"}`,
            background: "transparent", transition: "all .15s",
          }}>Log in</Link>
          <Link href="/auth/signup" style={{
            textDecoration: "none", padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14,
            background: scrolled ? C.forest : "#fff",
            color: scrolled ? "#fff" : C.forest,
            boxShadow: "0 2px 8px rgba(0,0,0,.12)", transition: "all .15s",
          }}>Get started free</Link>
        </div>
      </div>
    </nav>
  );
}

function HeroShopCard({ shop, visible }: { shop: typeof DEMO_SHOPS[0]; visible: boolean }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 20, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,.16)",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
      transition: "all 0.55s cubic-bezier(.22,1,.36,1)",
      width: "100%", maxWidth: 360,
    }}>
      {/* Shop header */}
      <div style={{ background: `linear-gradient(135deg, ${shop.color}dd, ${shop.color})`, padding: "22px 22px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{shop.emoji}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#fff", lineHeight: 1.2 }}>{shop.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginTop: 2 }}>{shop.tagline}</div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(255,255,255,.2)", borderRadius: 999, padding: "3px 10px", fontSize: 10, color: "rgba(255,255,255,.9)", fontWeight: 700 }}>LIVE</div>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 14px", flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{shop.revenue}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>Revenue</div>
          </div>
          <div style={{ background: "rgba(255,255,255,.15)", borderRadius: 10, padding: "8px 14px", flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fff" }}>{shop.orders}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.7)" }}>Orders</div>
          </div>
        </div>
      </div>
      {/* Products */}
      <div style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.slate, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Products</div>
        {shop.products.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: i < shop.products.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: 13, color: C.charcoal }}>{p.split(" — ")[0]}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.forest }}>{p.split(" — ")[1]}</span>
          </div>
        ))}
        <button style={{
          marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, border: "none",
          background: `${shop.color}14`, color: shop.color, fontWeight: 700, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>Visit shop ↗</button>
      </div>
    </div>
  );
}

function Hero() {
  const [shopIdx, setShopIdx] = useCycling(DEMO_SHOPS.length, 4000);
  const [visible, setVisible] = useState(true);

  const goTo = (i: number) => {
    setVisible(false);
    setTimeout(() => { setShopIdx(i); setVisible(true); }, 300);
  };

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, [shopIdx]);

  return (
    <section style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${C.forest} 0%, #0f3d22 55%, #1A6B3C 100%)`,
      display: "flex", alignItems: "center", padding: "100px 24px 60px", position: "relative", overflow: "hidden",
    }}>
      {/* Background texture dots */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
      {/* Glow */}
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 400, height: 400, borderRadius: "50%", background: `${C.action}22`, filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        {/* Left: copy */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.1)", borderRadius: 999, padding: "6px 14px", marginBottom: 24, border: "1px solid rgba(255,255,255,.15)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.action, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.9)", fontWeight: 600 }}>Kenya's shop-in-a-box platform</span>
          </div>

          <h1 style={{
            margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.03em",
            fontFamily: "'Playfair Display', Georgia, serif",
          }}>
            <span style={{ fontSize: "clamp(38px, 5vw, 58px)", color: "#fff", display: "block", fontWeight: 700 }}>
              Your shop.<br />Online.
            </span>
            <span style={{ fontSize: "clamp(38px, 5vw, 58px)", color: C.mint, display: "block", fontWeight: 700, fontStyle: "italic" }}>
              In one afternoon.
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(255,255,255,.78)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
            MyProduct gives Kenyan businesses everything to sell online — products, orders, POS, M-Pesa payments, and a shared marketplace — in one platform, from KSh 999/month.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/auth/signup" style={{
              textDecoration: "none", padding: "14px 28px", borderRadius: 12,
              background: C.action, color: "#fff", fontWeight: 800, fontSize: 16,
              boxShadow: "0 4px 20px rgba(37,165,90,.5)", transition: "transform .15s, box-shadow .15s",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 28px rgba(37,165,90,.6)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = "0 4px 20px rgba(37,165,90,.5)"; }}>
              Start free — no credit card ↗
            </Link>
            <a href="#features" style={{
              textDecoration: "none", padding: "14px 24px", borderRadius: 12,
              background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 600, fontSize: 16,
              border: "1.5px solid rgba(255,255,255,.2)", transition: "background .15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.16)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.1)"; }}>
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div style={{ display: "flex", gap: 20, marginTop: 40, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,.12)" }}>
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.mint }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: animated shop card */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <HeroShopCard shop={DEMO_SHOPS[shopIdx]} visible={visible} />
          {/* Shop selector dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {DEMO_SHOPS.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} style={{
                width: i === shopIdx ? 28 : 8, height: 8, borderRadius: 4,
                background: i === shopIdx ? C.action : "rgba(255,255,255,.3)",
                border: "none", cursor: "pointer", transition: "all .3s", padding: 0,
              }} title={s.name} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", textAlign: "center" }}>
            Real shops built on MyProduct · Tap to explore
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const LOGOS = ["🛒 FreshMart", "💻 TechZone", "📚 BookNest", "👗 StyleHub", "🥬 Mama Mboga", "🔧 AutoParts KE"];
  return (
    <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "16px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: C.slate, fontWeight: 600, flexShrink: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Trusted by</span>
        {LOGOS.map(l => (
          <span key={l} style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, padding: "6px 14px", background: C.canvas, borderRadius: 8, border: `1px solid ${C.border}` }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" style={{ padding: "96px 24px", background: C.canvas }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Everything you need</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            One platform. Every tool.
          </h2>
          <p style={{ fontSize: 17, color: C.slate, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            From your first product listing to multi-location management — MyProduct scales with you.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "24px 22px", transition: "transform .2s, box-shadow .2s",
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; el.style.borderColor = C.mint; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; el.style.borderColor = C.border; }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: C.ink }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: C.slate, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "96px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Simple from day one</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            From signup to first sale<br />in one day
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 0, position: "relative" }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.step} style={{ padding: "32px 28px", position: "relative" }}>
              {i < HOW_IT_WORKS.length - 1 && (
                <div style={{ position: "absolute", top: 52, right: 0, width: "50%", height: 2, background: `linear-gradient(90deg, ${C.mint}, transparent)`, display: "none" }} className="connector" />
              )}
              <div style={{ fontSize: 11, fontWeight: 900, color: C.action, letterSpacing: "0.1em", marginBottom: 14 }}>{step.step}</div>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{step.icon}</div>
              <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: C.ink }}>{step.title}</h3>
              <p style={{ margin: 0, fontSize: 14, color: C.slate, lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 52 }}>
          <Link href="/auth/signup" style={{
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12, background: C.forest, color: "#fff",
            fontWeight: 700, fontSize: 16, boxShadow: "0 4px 16px rgba(26,107,60,.3)",
            transition: "transform .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
            Open my shop today →
          </Link>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <section id="pricing" style={{ padding: "96px 24px", background: C.canvas }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Transparent pricing</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0 16px", letterSpacing: "-0.02em" }}>
            Pay for what you need
          </h2>
          <p style={{ fontSize: 16, color: C.slate, margin: "0 0 28px" }}>Start free for 14 days. No credit card required.</p>

          {/* Billing toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: "6px 10px" }}>
            <button onClick={() => setAnnual(false)} style={{ padding: "7px 18px", borderRadius: 999, border: "none", background: !annual ? C.forest : "transparent", color: !annual ? "#fff" : C.slate, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .2s" }}>Monthly</button>
            <button onClick={() => setAnnual(true)} style={{ padding: "7px 18px", borderRadius: 999, border: "none", background: annual ? C.forest : "transparent", color: annual ? "#fff" : C.slate, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all .2s", display: "flex", alignItems: "center", gap: 8 }}>
              Yearly
              <span style={{ fontSize: 10, background: C.ember, color: "#fff", padding: "2px 7px", borderRadius: 999, fontWeight: 800 }}>-20%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 16 }}>
          {PACKAGES.map(pkg => {
            const price = annual ? Math.round(pkg.price * 0.8) : pkg.price;
            return (
              <div key={pkg.id} style={{
                background: pkg.popular ? C.forest : C.surface,
                border: pkg.popular ? "none" : `1.5px solid ${C.border}`,
                borderRadius: 20, padding: "30px 26px",
                position: "relative",
                boxShadow: pkg.popular ? "0 20px 48px rgba(26,107,60,.25)" : "none",
                transform: pkg.popular ? "scale(1.03)" : "none",
                transition: "transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { if (!pkg.popular) { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 12px 32px rgba(0,0,0,.08)"; } }}
                onMouseLeave={e => { if (!pkg.popular) { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; } }}>
                {pkg.popular && (
                  <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: C.ember, color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>MOST POPULAR</div>
                )}
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: pkg.popular ? C.mint : C.slate }}>{pkg.limits}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, color: pkg.popular ? "#fff" : C.ink, marginBottom: 4 }}>{pkg.name}</div>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: pkg.popular ? C.mint : C.forest }}>KSh {price.toLocaleString()}</span>
                  <span style={{ fontSize: 13, color: pkg.popular ? "rgba(255,255,255,.6)" : C.slate }}>/{pkg.cycle}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                  {pkg.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                      <span style={{ color: pkg.popular ? C.mint : C.action, flexShrink: 0, fontSize: 14, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 13, color: pkg.popular ? "rgba(255,255,255,.85)" : C.charcoal, lineHeight: 1.4 }}>{f}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/signup" style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 14,
                  background: pkg.popular ? C.action : C.forest,
                  color: "#fff",
                  boxShadow: pkg.popular ? "0 4px 16px rgba(37,165,90,.4)" : "none",
                  transition: "opacity .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.87"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}>
                  Start with {pkg.name}
                </Link>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: C.slate }}>
          All plans include a 14-day free trial. Cancel anytime. Need something custom?{" "}
          <a href="#contact" style={{ color: C.action, fontWeight: 600 }}>Talk to us</a>.
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section style={{ padding: "96px 24px", background: C.surface }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Real businesses, real results</span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: C.ink, margin: "12px 0", letterSpacing: "-0.02em" }}>
            Businesses growing on MyProduct
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: C.canvas, border: `1px solid ${C.border}`, borderRadius: 20, padding: "28px 26px" }}>
              <div style={{ fontSize: 28, color: C.action, marginBottom: 14, lineHeight: 1 }}>"</div>
              <p style={{ margin: "0 0 20px", fontSize: 15, color: C.charcoal, lineHeight: 1.75, fontStyle: "italic" }}>{t.quote}</p>

              <div style={{ background: C.mint, borderRadius: 8, padding: "8px 14px", display: "inline-block", marginBottom: 18 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.forest }}>📈 {t.revenue}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.ink }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: C.slate }}>{t.shop} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketplacePreview() {
  const ITEMS = [
    { emoji: "🥦", name: "Sukuma Wiki", shop: "FreshMart", price: "KSh 30", tag: "Groceries" },
    { emoji: "🎧", name: "Wireless Earbuds Pro", shop: "TechZone", price: "KSh 3,500", tag: "Electronics" },
    { emoji: "📗", name: "Business Strategy 2025", shop: "BookNest", price: "KSh 1,200", tag: "Books" },
    { emoji: "👟", name: "Air Max Sneakers", shop: "StyleHub", price: "KSh 4,200", tag: "Fashion" },
    { emoji: "☕", name: "Kenyan AA Coffee 250g", shop: "FreshMart", price: "KSh 480", tag: "Groceries" },
    { emoji: "🔌", name: "USB-C Hub 7-in-1", shop: "TechZone", price: "KSh 2,800", tag: "Electronics" },
  ];
  return (
    <section id="marketplace" style={{ padding: "96px 24px", background: `linear-gradient(180deg, ${C.canvas} 0%, ${C.mint}55 100%)` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Shared marketplace</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: C.ink, margin: "12px 0 18px", letterSpacing: "-0.02em" }}>
              Sell to the whole platform, not just your shop
            </h2>
            <p style={{ fontSize: 16, color: C.slate, lineHeight: 1.7, marginBottom: 28 }}>
              Every MyProduct shop can list on the shared marketplace — a single storefront where customers from across the platform browse products from all verified sellers. More eyeballs, more sales.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Products from all shops in one searchable feed", "Customers can buy from multiple shops in one checkout", "Your shop brand stays front and centre on every listing", "Flagged and moderated by our team for quality"].map(b => (
                <div key={b} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: C.action, flexShrink: 0, fontWeight: 900, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 14, color: C.charcoal }}>{b}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/signup?role=seller" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 12, background: C.forest, color: "#fff", fontWeight: 700, fontSize: 15 }}>
              Join the marketplace →
            </Link>
          </div>

          {/* Grid preview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {ITEMS.map((item, i) => (
              <div key={i} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "16px 14px", transition: "transform .2s, box-shadow .2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = ""; el.style.boxShadow = ""; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 11, color: C.slate, marginBottom: 8 }}>by {item.shop}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.forest }}>{item.price}</span>
                  <span style={{ fontSize: 10, background: C.mint, color: C.forest, padding: "2px 8px", borderRadius: 999, fontWeight: 700 }}>{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" style={{ padding: "96px 24px", background: C.ink, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(37,165,90,.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em" }}>Our mission</span>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: "#fff", margin: "14px 0 24px", letterSpacing: "-0.02em" }}>
          Built for Kenyan businesses,<br />by people who understand them.
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.8, marginBottom: 20 }}>
          MyProduct was built because we saw small and medium businesses in Kenya spending too much time managing inventory on WhatsApp, collecting payments via M-Pesa screenshots, and losing track of orders in shared spreadsheets.
        </p>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.8, marginBottom: 48 }}>
          We built a complete, affordable platform so any Kenyan business owner — whether in Nairobi's CBD or Kisumu's market — can run a professional online shop with no technical skills required.
        </p>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          {[{ icon: "🇰🇪", label: "Kenya-first" }, { icon: "🔒", label: "Secure & reliable" }, { icon: "📞", label: "Local support" }, { icon: "💡", label: "Always improving" }].map(b => (
            <div key={b.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,.8)" }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="contact" style={{ padding: "96px 24px", background: `linear-gradient(135deg, ${C.forest}, #0d3a1e)` }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 700, color: "#fff", margin: "0 0 18px", letterSpacing: "-0.02em" }}>
          Ready to open your shop?
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,.72)", margin: "0 0 40px", lineHeight: 1.7 }}>
          Join hundreds of Kenyan businesses already selling on MyProduct. Get set up in minutes — no technical skills needed.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/signup" style={{
            textDecoration: "none", padding: "16px 36px", borderRadius: 14,
            background: C.action, color: "#fff", fontWeight: 800, fontSize: 17,
            boxShadow: "0 6px 24px rgba(37,165,90,.45)", transition: "transform .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; }}>
            Start free — 14 days, no card required
          </Link>
          <Link href="/shop" style={{
            textDecoration: "none", padding: "16px 28px", borderRadius: 14,
            background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 600, fontSize: 17,
            border: "1.5px solid rgba(255,255,255,.25)", transition: "background .15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.12)"; }}>
            Browse the marketplace
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.45)", marginTop: 24 }}>
          No credit card · Cancel anytime · Support in English & Swahili
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const COL_LINKS: Record<string, { label: string; href: string }[]> = {
    "Platform": [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Marketplace", href: "#marketplace" },
      { label: "How it works", href: "#how-it-works" },
    ],
    "Accounts": [
      { label: "Sign up", href: "/auth/signup" },
      { label: "Log in", href: "/auth/login" },
      { label: "Shop admin", href: "/shop_admin" },
      { label: "Super admin", href: "/super_admin" },
    ],
    "Company": [
      { label: "About us", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
    ],
  };

  return (
    <footer style={{ background: C.ink, borderTop: "1px solid rgba(255,255,255,.07)", padding: "60px 24px 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.forest}, ${C.action})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 900 }}>M</div>
              <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>MyProduct</span>
            </div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7, maxWidth: 280, margin: "0 0 20px" }}>
              Kenya's complete e-commerce platform for small and medium businesses. Launch your shop today.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["📘", "📷", "🐦", "💼"].map((icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, textDecoration: "none", transition: "background .15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.08)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(COL_LINKS).map(([col, links]) => (
            <div key={col}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>{col}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map(l => (
                  <a key={l.label} href={l.href} style={{ fontSize: 14, color: "rgba(255,255,255,.55)", textDecoration: "none", transition: "color .15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.55)"; }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.3)" }}>© {new Date().getFullYear()} MyProduct. Built in Kenya 🇰🇪</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.action, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const scrolled = useScrolled(60);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
        html { scroll-behavior: smooth; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
      <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.canvas, color: C.charcoal, overflowX: "hidden" }}>
        <Nav scrolled={scrolled} />
        <Hero />
        <TrustBar />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <MarketplacePreview />
        <About />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
