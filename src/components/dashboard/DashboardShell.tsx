"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Search, SlidersHorizontal, Bell, ChevronDown, Menu, X,
  PanelLeftClose, PanelLeftOpen, Settings, LogOut, type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import ConfirmDialog from "./ConfirmDialog";

/** Either a real route (`href`) or an SPA view switch (`onClick` + `active`). */
export interface ShellItem {
  key: string;
  label: string;
  icon?: LucideIcon;
  href?: string;
  exact?: boolean;
  onClick?: () => void;
  active?: boolean;
  badge?: number;
}

export interface ShellNotification {
  id: string;
  title: string;
  message: string;
  tone?: "info" | "warning" | "danger";
}

interface DashboardShellProps {
  brand: { name: string; icon: LucideIcon };
  railItems: ShellItem[];
  navItems: ShellItem[];
  user: { name: string; email?: string | null; avatarUrl?: string | null };
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filterOptions?: { label: string; value: string }[];
  onFilterSelect?: (value: string) => void;
  notifications?: ShellNotification[];
  onClearNotifications?: () => void;
  onSettingsClick?: () => void;
  defaultRailExpanded?: boolean;
}

function useIsActive() {
  const pathname = usePathname();
  return (item: ShellItem) => {
    if (item.href) return item.exact ? pathname === item.href : pathname.startsWith(item.href);
    return !!item.active;
  };
}

function Badge({ count, inline = false }: { count?: number; inline?: boolean }) {
  if (!count) return null;
  return (
    <span
      className={`${inline ? "" : "absolute -top-1 -right-1"} min-w-4 h-4 px-1 rounded-full bg-org-danger text-white text-[9px] font-org-bold flex items-center justify-center`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

function ShellLink({
  item, className, onNavigate, showLabel = false,
}: { item: ShellItem; className: (active: boolean) => string; onNavigate?: () => void; showLabel?: boolean }) {
  const isActive = useIsActive();
  const active = isActive(item);
  const handleClick = () => {
    item.onClick?.();
    onNavigate?.();
  };
  const content = (
    <>
      {item.icon && <item.icon size={18} className="shrink-0" />}
      {(showLabel || !item.icon) && <span className={item.icon ? "flex-1" : undefined}>{item.label}</span>}
      <Badge count={item.badge} inline={showLabel} />
    </>
  );
  if (item.href) {
    return (
      <Link href={item.href} title={item.label} onClick={onNavigate} className={`relative cursor-pointer ${className(active)}`}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" title={item.label} onClick={handleClick} className={`relative cursor-pointer ${className(active)}`}>
      {content}
    </button>
  );
}

/**
 * Persistent lg+ sidebar. Collapsed = icon-only rail (default). Expanded =
 * wide, labeled sidebar (icon + text per item), toggled from the header.
 */
function Rail({ brand, railItems, expanded }: Pick<DashboardShellProps, "brand" | "railItems"> & { expanded: boolean }) {
  return (
    <aside
      className={`hidden lg:flex shrink-0 bg-org-primary flex-col py-5 gap-2 overflow-y-auto overflow-x-hidden transition-[width] duration-200 ${
        expanded ? "w-64 items-stretch px-3" : "w-16 items-center"
      }`}
    >
      <div className={`flex items-center gap-2.5 mb-4 shrink-0 ${expanded ? "px-1.5" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
          <brand.icon size={18} />
        </div>
        {expanded && <span className="text-white text-org-md font-org-semibold truncate">{brand.name}</span>}
      </div>
      <nav className="flex flex-col gap-1.5">
        {railItems.map((item) =>
          expanded ? (
            <ShellLink
              key={item.key}
              item={item}
              showLabel
              className={(active) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-org-sm text-org-sm font-org-medium text-left transition-colors ${
                  active ? "bg-white text-org-primary" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            />
          ) : (
            <ShellLink
              key={item.key}
              item={item}
              className={(active) =>
                `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  active ? "bg-white text-org-primary" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`
              }
            />
          )
        )}
      </nav>
    </aside>
  );
}

/** Labeled slide-in drawer — mobile/tablet nav below lg. */
function MobileDrawer({
  open, onClose, brand, railItems, navItems,
}: { open: boolean; onClose: () => void } & Pick<DashboardShellProps, "brand" | "railItems" | "navItems">) {
  if (!open) return null;
  const allItems = [...navItems, ...railItems];
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-org-primary flex flex-col py-5 px-3">
        <div className="flex items-center justify-between px-2 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
              <brand.icon size={16} />
            </div>
            <span className="text-white text-org-md font-org-semibold">{brand.name}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 cursor-pointer" aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {allItems.map((item) => (
            <ShellLink
              key={item.key}
              item={item}
              onNavigate={onClose}
              showLabel
              className={(active) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-org-sm text-org-sm font-org-medium text-left transition-colors ${
                  active ? "bg-white text-org-primary" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

const NOTIF_TONE: Record<string, string> = {
  info: "bg-org-accent",
  warning: "bg-org-warning",
  danger: "bg-org-danger",
};

export default function DashboardShell({
  brand, railItems, navItems, user, children, headerExtra,
  searchPlaceholder = "Search…", onSearch, filterOptions, onFilterSelect,
  notifications = [], onClearNotifications, onSettingsClick, defaultRailExpanded = false,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(defaultRailExpanded);
  useEffect(() => {
    // Re-applies whenever the caller's preferred default changes — e.g. once
    // after an async localStorage read resolves post-mount, or live if the
    // user changes their "start expanded" setting elsewhere in the app.
    setRailExpanded(defaultRailExpanded);
  }, [defaultRailExpanded]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const submitSearch = () => {
    if (searchValue.trim()) onSearch?.(searchValue.trim());
  };

  return (
    <div className="h-screen bg-org-bg flex overflow-hidden" style={{ fontFamily: "var(--org-font)" }}>
      <Rail brand={brand} railItems={railItems} expanded={railExpanded} />
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} brand={brand} railItems={railItems} navItems={navItems} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top nav */}
        <header className="h-14 sm:h-16 shrink-0 bg-org-surface border-b border-org-border flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-8 h-8 -ml-1 rounded-lg flex items-center justify-center text-org-text-secondary hover:bg-org-surface-alt shrink-0 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => setRailExpanded((v) => !v)}
              className="hidden lg:flex w-8 h-8 -ml-1 rounded-lg items-center justify-center text-org-text-secondary hover:bg-org-surface-alt shrink-0 cursor-pointer"
              aria-label={railExpanded ? "Collapse sidebar" : "Expand sidebar"}
              title={railExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {railExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div className="w-7 h-7 rounded-lg bg-org-primary-light text-org-primary flex items-center justify-center shrink-0">
              <brand.icon size={15} />
            </div>
            <span className="text-org-md font-org-semibold text-org-text-primary hidden sm:inline truncate">{brand.name}</span>
          </div>

          {navItems.length > 0 && !searchOpen && (
            <nav className="hidden md:flex items-center gap-1 bg-org-surface-alt rounded-org-pill p-1 overflow-x-auto">
              {navItems.map((item) => (
                <ShellLink
                  key={item.key}
                  item={item}
                  className={(active) =>
                    `px-4 py-1.5 rounded-org-pill text-org-sm font-org-medium whitespace-nowrap transition-colors ${
                      active ? "bg-org-primary text-white" : "text-org-text-secondary hover:text-org-text-primary"
                    }`
                  }
                />
              ))}
            </nav>
          )}

          {searchOpen && (
            <div className="flex-1 flex items-center gap-2 max-w-md">
              <input
                autoFocus
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); if (e.key === "Escape") setSearchOpen(false); }}
                placeholder={searchPlaceholder}
                className="flex-1 text-org-sm border border-org-border rounded-org-pill px-4 py-1.5 text-org-text-primary bg-org-surface outline-none focus:border-org-primary"
              />
              <button onClick={submitSearch} className="text-org-xs font-org-semibold text-org-primary hover:underline shrink-0 cursor-pointer">
                Search
              </button>
              <button onClick={() => { setSearchOpen(false); setSearchValue(""); }} className="text-org-text-muted hover:text-org-text-primary shrink-0 cursor-pointer" aria-label="Close search">
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {headerExtra}

            {!searchOpen && (
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex w-9 h-9 rounded-full items-center justify-center text-org-text-secondary hover:bg-org-surface-alt transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={16} />
              </button>
            )}

            {filterOptions && filterOptions.length > 0 && (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setFilterOpen((v) => !v)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-org-text-secondary hover:bg-org-surface-alt transition-colors cursor-pointer"
                  aria-label="Filter"
                >
                  <SlidersHorizontal size={16} />
                </button>
                {filterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setFilterOpen(false)} />
                    <div className="absolute right-0 top-11 z-20 w-48 bg-org-surface rounded-xl shadow-lg border border-org-border py-1">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { onFilterSelect?.(opt.value); setFilterOpen(false); }}
                          className="w-full text-left px-3 py-2 text-org-sm text-org-text-primary hover:bg-org-surface-alt transition-colors cursor-pointer"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-org-text-secondary hover:bg-org-surface-alt transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={16} />
                {notifications.length > 0 && <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-org-danger" />}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-72 max-w-[85vw] bg-org-surface rounded-xl shadow-lg border border-org-border py-1 max-h-80 overflow-y-auto">
                    <div className="px-3 py-2 flex items-center justify-between border-b border-org-border">
                      <span className="text-org-xs font-org-semibold text-org-text-muted uppercase tracking-wide">Notifications</span>
                      {notifications.length > 0 && onClearNotifications && (
                        <button
                          onClick={() => { onClearNotifications(); setNotifOpen(false); }}
                          className="text-org-xs font-org-medium text-org-primary hover:underline cursor-pointer"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    {notifications.length === 0 ? (
                      <p className="px-3 py-4 text-org-sm text-org-text-secondary text-center">No new notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="px-3 py-2.5 border-b border-org-border last:border-0 flex items-start gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${NOTIF_TONE[n.tone ?? "info"]}`} />
                          <div className="min-w-0">
                            <p className="text-org-sm font-org-medium text-org-text-primary truncate">{n.title}</p>
                            <p className="text-org-xs text-org-text-secondary">{n.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 pl-0.5 sm:pl-1 cursor-pointer">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-org-primary-light text-org-primary flex items-center justify-center text-org-sm font-org-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-org-sm font-org-medium text-org-text-primary">{user.name}</span>
                  {user.email && <span className="text-org-xs text-org-text-muted">{user.email}</span>}
                </span>
                <ChevronDown size={14} className="text-org-text-muted hidden md:block" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-11 z-20 w-44 bg-org-surface rounded-xl shadow-lg border border-org-border py-1">
                    <button
                      onClick={() => { setMenuOpen(false); onSettingsClick?.(); }}
                      className="w-full text-left px-3 py-2 text-org-sm text-org-text-primary hover:bg-org-surface-alt transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Settings size={15} /> Settings
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); setSignOutOpen(true); }}
                      className="w-full text-left px-3 py-2 text-org-sm text-org-danger hover:bg-org-surface-alt transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-6">{children}</main>
      </div>

      <ConfirmDialog
        open={signOutOpen}
        title="Sign out?"
        message="You'll need to sign in again to access your dashboard."
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onCancel={() => setSignOutOpen(false)}
        onConfirm={() => { setSignOutOpen(false); signOut({ callbackUrl: "/" }); }}
      />
    </div>
  );
}
