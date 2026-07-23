"use client";

import { useState } from "react";
import type { Theme } from "../types/index";

interface NewsletterProps {
  theme: Theme;
}

export default function Newsletter({ theme }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="px-4 sm:px-6 py-4 sm:py-6">
      <div
        className="max-w-6xl mx-auto rounded-4xl p-8 sm:p-14 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        style={{ background: theme.primaryLight }}
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: theme.black }}>
            Get restock alerts
          </h2>
          <p className="text-sm sm:text-base max-w-sm" style={{ color: theme.textMuted }}>
            A short weekly note on what&apos;s fresh, what&apos;s back in stock, and what&apos;s about to sell out.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 min-w-0 px-4.5 py-3.5 rounded-full text-sm outline-none"
            style={{ border: `1px solid ${theme.border}`, background: "#fff", color: theme.text }}
          />
          <button
            type="submit"
            className="px-6 py-3.5 rounded-full text-sm font-semibold text-white whitespace-nowrap transition-opacity"
            style={{ background: sent ? theme.accent : theme.black }}
          >
            {sent ? "Subscribed!" : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
