"use client";
import Nav from "@/landing/Nav";
import Footer from "@/landing/Footer";
import { C } from "@/landing/Constants";

const SECTIONS: { title: string; body: string }[] = [
  {
    title: "1. Information we collect",
    body: "When you create an account, open a shop, or place an order on MyProduct, we collect information such as your name, email address, phone number, delivery address, and payment details (processed securely via M-Pesa or our card processor — we never store raw card numbers). Shop owners additionally provide business details such as store name and product catalog data.",
  },
  {
    title: "2. How we use your information",
    body: "We use your information to operate the platform: processing orders and payments, enabling shops to fulfil deliveries, providing customer support, sending order and account notifications, and improving the product. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Sharing with sellers and partners",
    body: "When you place an order, the relevant shop owner receives the information needed to fulfil it (name, delivery address, phone number, order contents). Payment processors and delivery partners receive only what they need to complete a transaction or delivery.",
  },
  {
    title: "4. Data security",
    body: "We use industry-standard measures — encrypted connections, hashed passwords, and access-controlled infrastructure — to protect your data. No system is 100% secure, and we encourage you to use a strong, unique password for your account.",
  },
  {
    title: "5. Your rights",
    body: "You can access, correct, or request deletion of your personal data at any time from your account settings, or by contacting us directly. Shop owners can export their store data on request.",
  },
  {
    title: "6. Cookies",
    body: "We use essential cookies to keep you signed in and remember your preferences (such as theme and sidebar settings). We do not use third-party advertising trackers.",
  },
  {
    title: "7. Changes to this policy",
    body: "We may update this policy as the platform evolves. Material changes will be communicated via email or an in-app notice before they take effect.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: C.canvas, minHeight: "100vh" }}>
      <Nav scrolled={true} />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "120px 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.action, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, color: C.ink, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Privacy Policy
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
          Questions about this policy? Reach us via the contact link in the footer below.
        </p>
      </main>
      <Footer />
    </div>
  );
}
