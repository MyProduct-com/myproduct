"use client";
import Nav from "@/landing/Nav";
import Footer from "@/landing/Footer";
import { C } from "@/landing/Constants";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Using MyProduct",
    body: "MyProduct provides a platform for Kenyan businesses to open online shops and for customers to discover and buy from them. By creating an account, you agree to provide accurate information and to use the platform lawfully.",
  },
  {
    title: "2. Shop owner responsibilities",
    body: "Shop owners are responsible for the accuracy of their product listings, honoring stated prices and stock, and fulfilling orders in a timely manner. Listing counterfeit, illegal, or prohibited goods is not permitted and may result in shop suspension.",
  },
  {
    title: "3. Orders and payments",
    body: "Orders are placed directly with the shop you're buying from. Payments made via M-Pesa or card are processed through our integrated payment partners. Refunds and cancellations are handled per each shop's stated return policy.",
  },
  {
    title: "4. Subscription plans",
    body: "Shop owners subscribe to a package (Starter, Growth, Pro, or Enterprise) that determines available features and limits. Plans renew monthly unless cancelled, and can be upgraded or downgraded at any time from Store Settings.",
  },
  {
    title: "5. Platform availability",
    body: "We aim to keep MyProduct available and reliable, but we don't guarantee uninterrupted service. We'll do our best to communicate any planned maintenance in advance.",
  },
  {
    title: "6. Account suspension",
    body: "We may suspend accounts that violate these terms, engage in fraudulent activity, or repeatedly fail to fulfil orders. Shop owners will be notified and given an opportunity to resolve issues where reasonable.",
  },
  {
    title: "7. Limitation of liability",
    body: "MyProduct facilitates transactions between shops and customers but is not a party to the sale itself. We are not liable for disputes over product quality, delivery delays, or other issues between a shop and its customers, though we'll assist in good faith where we can.",
  },
  {
    title: "8. Changes to these terms",
    body: "We may update these terms as the platform grows. Continued use of MyProduct after an update constitutes acceptance of the revised terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.canvas, minHeight: "100vh" }}>
      <Nav scrolled={true} />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: C.ink, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: C.slate, marginBottom: 40 }}>Last updated: July 2026</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{s.title}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: C.charcoal }}>{s.body}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 14, color: C.slate, marginTop: 48 }}>
          Questions about these terms? Reach us via the contact link in the footer below.
        </p>
      </main>
      <Footer />
    </div>
  );
}
