"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, Hand, ArrowUpRight } from "lucide-react";
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

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Best Sellers", href: "#bestsellers" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

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
  const [scrolled, setScrolled] = useState(false);
  const LogoIcon = getLogoIcon(theme.logoIcon);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? theme.black : "#fff";
  const mutedTextColor = scrolled ? theme.textMuted : "rgba(255,255,255,0.85)";

  return (
    <header
      id="top"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? theme.surface : "transparent",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.1)" : "none",
        borderBottom: scrolled ? `1px solid ${theme.border}` : "1px solid transparent",
        fontFamily: theme.fontFamily,
      }}
    >
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4"
        style={{ height: 64 }}
      >

        {/* ── Logo ── */}
        <div className="flex flex-col justify-center min-w-0 shrink-0">
          <div className="flex items-center gap-2">
            <LogoIcon className="w-6 h-6 shrink-0" style={{ color: textColor }} />
            <span
              className="font-black text-lg sm:text-xl leading-none tracking-tight truncate"
              style={{ letterSpacing: "-0.5px", color: textColor }}
            >
              {theme.shopName}
            </span>
          </div>
          {user && (
            <div className="text-[11px] mt-0.5 truncate flex items-center gap-1" style={{ color: mutedTextColor }}>
              Hello, {user.name.split(" ")[0]} <Hand className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* ── Desktop menu items ── */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{ color: textColor }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ── Desktop nav controls ── */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">

          {/* Cart button */}
          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-1.5 font-semibold text-sm transition-opacity"
            style={{ color: textColor, background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <ShoppingCart className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -right-2 text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center leading-none"
                style={{ background: theme.primary, color: "#fff" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                style={{ background: theme.primary, color: "#fff" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={onSignOut}
                className="text-sm font-semibold transition-opacity"
                style={{ color: textColor, background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onLoginClick}
                className="text-sm font-semibold transition-opacity"
                style={{ color: textColor, background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Login
              </button>
              <button
                onClick={onSignupClick}
                className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full pl-4 pr-3 py-2.5 transition-opacity"
                style={{ background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Sign Up
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: theme.primary }}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
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
            style={{ background: "none", border: "none", color: textColor, cursor: "pointer" }}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black"
                style={{ background: theme.primary, color: "#fff" }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-90"
            style={{ background: "none", border: "none", color: textColor, cursor: "pointer" }}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {menuOpen && (
        <div
          className="sm:hidden border-t px-4 py-3 flex flex-col gap-2"
          style={{ borderColor: theme.border, background: theme.surface }}
        >
          <div className="flex flex-col gap-1 mb-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: theme.bg, color: theme.text }}
              >
                {item.label}
              </a>
            ))}
          </div>
          {user ? (
            <>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: theme.bg }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: theme.primary, color: "#fff" }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: theme.text }}>{user.name}</div>
                  <div className="text-[11px]" style={{ color: theme.textMuted }}>Signed in</div>
                </div>
              </div>
              <button
                onClick={() => { onSignOut(); setMenuOpen(false); }}
                className="w-full text-sm font-semibold py-2.5 rounded-xl text-left px-3 transition-colors"
                style={{ background: theme.bg, color: theme.text, border: "none", cursor: "pointer" }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { onLoginClick(); setMenuOpen(false); }}
                className="flex-1 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                style={{ background: theme.bg, color: theme.text, border: "none", cursor: "pointer" }}
              >
                Login
              </button>
              <button
                onClick={() => { onSignupClick(); setMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold py-2.5 rounded-xl transition-colors"
                style={{ background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
              >
                Sign Up <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
