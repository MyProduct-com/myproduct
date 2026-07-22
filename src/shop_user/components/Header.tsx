"use client";

import { useState } from "react";
import { ShoppingCart, Menu, X, Hand } from "lucide-react";
import type { User, Theme } from "../types/index";
import { getLogoIcon } from "@/lib/logoIcons";

interface HeaderProps {
  theme: Theme;
  user: User | null;
  cartCount: number;
  onCartOpen: () => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onSignOut: () => void;
  onThemeEdit: () => void; // kept in props for compatibility but not rendered
}

export default function Header({
  theme,
  user,
  cartCount,
  onCartOpen,
  onLoginClick,
  onSignupClick,
  onSignOut,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const LogoIcon = getLogoIcon(theme.logoIcon);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: theme.primary,
        color: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between"
        style={{ height: 60 }}
      >

        {/* ── Logo ── */}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 shrink-0" />
            <span
              className="font-black text-lg sm:text-xl leading-none tracking-tight truncate"
              style={{ letterSpacing: "-0.5px" }}
            >
              {theme.shopName}
            </span>
          </div>
          {user && (
            <div className="text-[11px] mt-0.5 truncate flex items-center gap-1" style={{ opacity: 0.85 }}>
              Hello, {user.name.split(" ")[0]} <Hand className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* ── Desktop nav controls ── */}
        <div className="hidden sm:flex items-center gap-2">

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2 font-bold text-sm rounded-xl px-4 py-2 transition-all active:scale-95"
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
          >
            <ShoppingCart className="w-4 h-4" /> Cart
            {cartCount > 0 && (
              <span
                className="text-[11px] font-black rounded-full px-1.5 py-0.5 min-w-[20px] text-center leading-none"
                style={{ background: "#fff", color: theme.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onSignOut}
                className="text-sm font-semibold rounded-xl px-3 py-2 transition-all"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold rounded-xl px-4 py-2 transition-all"
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="text-sm font-black rounded-xl px-4 py-2 transition-all active:scale-95"
                style={{
                  background: "#fff",
                  border: "none",
                  color: theme.primary,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* ── Mobile controls ── */}
        <div className="flex sm:hidden items-center gap-2">

          {/* Cart icon — mobile */}
          <button
            onClick={onCartOpen}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.18)", border: "none", color: "#fff", cursor: "pointer", fontSize: 20 }}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black"
                style={{ background: "#fff", color: theme.primary }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-90"
            style={{ background: "rgba(255,255,255,0.18)", border: "none", color: "#fff", cursor: "pointer" }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {menuOpen && (
        <div
          className="sm:hidden border-t px-4 py-3 flex flex-col gap-2"
          style={{ borderColor: "rgba(255,255,255,0.2)", background: theme.primaryDark }}
        >
          {user ? (
            <>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: "rgba(255,255,255,0.25)" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-[11px] text-white/70">Signed in</div>
                </div>
              </div>
              <button
                onClick={() => { onSignOut(); setMenuOpen(false); }}
                className="w-full text-sm font-semibold py-2.5 rounded-xl text-left px-3 transition-colors"
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { onLoginClick(); setMenuOpen(false); }}
                className="flex-1 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                style={{ background: "rgba(255,255,255,0.18)", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Login
              </button>
              <button
                onClick={() => { onSignupClick(); setMenuOpen(false); }}
                className="flex-1 text-sm font-black py-2.5 rounded-xl transition-colors"
                style={{ background: "#fff", color: theme.primary, border: "none", cursor: "pointer" }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}