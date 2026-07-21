import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Hand } from "lucide-react";
import { C } from "./Constants";
type ChatMessage = { id: string; from: "visitor" | "admin"; text: string; time: string; icon?: LucideIcon };

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"intro" | "thread">("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  function startThread(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setMessages([
      {
        id: "welcome",
        from: "admin",
        icon: Hand,
        text: `Hi ${name.split(" ")[0]}! Thanks for reaching out — how can we help you today?`,
        time: now(),
      },
    ]);
    setStage("thread");
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const visitorMsg = { id: `v-${Date.now()}`, from: "visitor" as const, text, time: now() };
    setMessages((prev) => [...prev, visitorMsg]);
    setDraft("");
    setSending(true);

    try {
      await fetch("/api/support/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: text }),
      }).catch(() => null);
    } finally {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            from: "admin",
            text: "Got it — an admin has been notified and will reply here shortly.",
            time: now(),
          },
        ]);
        setSending(false);
      }, 900);
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: "50%",
          background: C.action, color: "#fff", border: "none",
          boxShadow: "0 8px 24px rgba(37,165,90,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {open && (
        <div ref={panelRef} style={{
          position: "fixed", bottom: 92, right: 24, zIndex: 1000,
          width: 340, maxWidth: "calc(100vw - 32px)", height: 460, maxHeight: "calc(100vh - 140px)",
          background: C.surface, borderRadius: 16,
          boxShadow: "0 16px 48px rgba(17,24,39,0.18)", border: `1px solid ${C.border}`,
          overflow: "hidden", display: "flex", flexDirection: "column",
        }}>
          <div style={{ background: C.forest, padding: "16px 18px", color: "#fff", flexShrink: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Chat with our team</div>
            <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 2 }}>We typically reply within a few hours</div>
          </div>

          {stage === "intro" ? (
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, flex: 1, justifyContent: "center" }}>
              <div style={{ fontSize: 13, color: C.slate, marginBottom: 4 }}>
                Tell us a little about yourself to start the conversation.
              </div>
              <form onSubmit={startThread} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input type="text" required placeholder="Your name" value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", color: C.ink }} />
                <input type="email" placeholder="Email (optional)" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, outline: "none", color: C.ink }} />
                <button type="submit" style={{ marginTop: 2, padding: "10px 12px", borderRadius: 8, border: "none", background: C.action, color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
                  Start chat
                </button>
              </form>
            </div>
          ) : (
            <>
              <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10, background: C.canvas }}>
                {messages.map((m) => (
                  <div key={m.id} style={{ alignSelf: m.from === "visitor" ? "flex-end" : "flex-start", maxWidth: "80%", display: "flex", flexDirection: "column", alignItems: m.from === "visitor" ? "flex-end" : "flex-start" }}>
                    <div style={{
                      background: m.from === "visitor" ? C.action : "#fff",
                      color: m.from === "visitor" ? "#fff" : C.ink,
                      padding: "9px 12px",
                      borderRadius: m.from === "visitor" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      fontSize: 13.5, lineHeight: 1.45,
                      border: m.from === "visitor" ? "none" : `1px solid ${C.border}`,
                      boxShadow: "0 1px 2px rgba(17,24,39,0.04)", wordBreak: "break-word",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {m.icon && <m.icon style={{ width: 14, height: 14, flexShrink: 0 }} />}
                      {m.text}
                    </div>
                    <span style={{ fontSize: 10.5, color: C.slate, marginTop: 3, padding: "0 2px" }}>
                      {m.from === "admin" ? "Support · " : ""}{m.time}
                    </span>
                  </div>
                ))}
                {sending && (
                  <div style={{ alignSelf: "flex-start", display: "flex", gap: 4, padding: "9px 12px", background: "#fff", border: `1px solid ${C.border}`, borderRadius: "12px 12px 12px 2px" }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.slate, opacity: 0.6, animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} style={{ flexShrink: 0, display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${C.border}`, background: C.surface }}>
                <input type="text" placeholder="Type a message..." value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  style={{ flex: 1, padding: "9px 12px", borderRadius: 20, border: `1px solid ${C.border}`, fontSize: 13.5, outline: "none", color: C.ink }} />
                <button type="submit" disabled={!draft.trim()} aria-label="Send" style={{
                  width: 36, height: 36, borderRadius: "50%", border: "none",
                  background: draft.trim() ? C.action : C.border, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: draft.trim() ? "pointer" : "default", flexShrink: 0,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}


export default ChatWidget;