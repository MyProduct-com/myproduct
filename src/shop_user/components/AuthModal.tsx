import { useState } from "react";
import type { User, Theme } from "../types/index.js";

type AuthMode = "login" | "signup";

interface AuthForm {
  name: string;
  email: string;
  password: string;
}

interface AuthModalProps {
  theme: Theme;
  initialMode?: AuthMode;
  onAuth: (user: User) => void;
  onClose: () => void;
}

export default function AuthModal({
  theme,
  initialMode = "login",
  onAuth,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState<AuthForm>({ name: "", email: "", password: "" });

  const handleSubmit = (): void => {
    const name =
      mode === "signup"
        ? form.name || form.email.split("@")[0]
        : form.email.split("@")[0];
    onAuth({ name, email: form.email });
  };

  const setField = (field: keyof AuthForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: theme.bg, borderRadius: theme.radiusCard, maxWidth: 400, width: "100%", padding: 28, fontFamily: theme.fontFamily, boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: theme.black }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: theme.textMuted }}>×</button>
        </div>

        {mode === "signup" && (
          <input
            placeholder="Your name"
            value={form.name}
            onChange={setField("name")}
            style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${theme.border}`, fontSize: 14, marginBottom: 10, boxSizing: "border-box" }}
          />
        )}
        <input
          placeholder="Email address"
          value={form.email}
          onChange={setField("email")}
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${theme.border}`, fontSize: 14, marginBottom: 10, boxSizing: "border-box" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={setField("password")}
          style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${theme.border}`, fontSize: 14, marginBottom: 16, boxSizing: "border-box" }}
        />

        <button
          onClick={handleSubmit}
          style={{ width: "100%", padding: "13px", background: theme.primary, color: "#fff", border: "none", borderRadius: theme.radius, fontWeight: 800, fontSize: 15, cursor: "pointer" }}
        >
          {mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: theme.textMuted }}>
          {mode === "login" ? "No account? " : "Have an account? "}
          <span
            onClick={() => setMode(m => m === "login" ? "signup" : "login")}
            style={{ color: theme.primary, fontWeight: 700, cursor: "pointer" }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}
