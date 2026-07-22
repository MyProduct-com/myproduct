"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IconSearch,
  IconShoppingCart,
  IconHeart,
  IconMenu2,
  IconX,
  IconChevronDown,
  IconPackage,
  IconLogout,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

const categories = [
  "Electronics",
  "Fashion",
  "Beauty & Health",
  "Grocery",
  "Home & Office",
  "Computing",
  "Stationery",
  "Sports",
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const cartCount = useCartStore((s) => s.distinctCount());
  const wishlistCount = useWishlistStore((s) => s.count());
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "seller") return "/seller";
    return "/dashboard";
  };

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-gray-200">
      {/* Announcement bar */}
      <div className="bg-[#1A6B3C] text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-[0.02em] hidden sm:block">
        Free delivery on orders over KES 2,000 &nbsp;&bull;&nbsp; Same-day delivery in Nairobi &nbsp;&bull;&nbsp;
        <Link href="/auth/signup?role=seller" className="underline font-semibold hover:text-border-mint ml-1 transition-colors">
          Start Selling Today
        </Link>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-14">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 text-gray-500 hover:text-[#1A6B3C] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX size={21} /> : <IconMenu2 size={21} />}
          </button>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-[18px] font-semibold tracking-[-0.01em]">
              <span className="text-[#1A6B3C]">My</span>
              <span className="text-gray-900">Products</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-auto">
            <div className="flex w-full rounded-md overflow-hidden border border-gray-200 focus-within:border-[#25A55A] transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2 text-org-sm outline-none bg-white text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#25A55A] hover:bg-[#1A6B3C] text-white px-4 flex items-center gap-1.5 font-medium text-org-sm transition-colors"
              >
                <IconSearch size={15} />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-0.5">
            {/* Wishlist */}
            <Link
              href={isAuthenticated ? "/dashboard/wishlist" : "/auth/login"}
              className="relative p-2 text-gray-500 hover:text-[#1A6B3C] transition-colors"
              title="Wishlist"
            >
              <IconHeart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8500A] text-white text-[9px] font-semibold rounded-full min-w-3.5 h-3.5 flex items-center justify-center px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-500 hover:text-[#1A6B3C] transition-colors"
              title="Cart"
            >
              <IconShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8500A] text-white text-[9px] font-semibold rounded-full min-w-3.5 h-3.5 flex items-center justify-center px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {mounted && isAuthenticated && user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-border-mint text-[#1A6B3C] text-org-xs font-semibold flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-org-sm font-medium max-w-20 truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <IconChevronDown size={13} className="hidden md:block text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-org-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-[11px] text-[#25A55A] font-medium capitalize">{user.role}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2.5 px-4 py-2 text-org-sm text-gray-700 hover:bg-canvas hover:text-[#1A6B3C] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <IconLayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user.role === "customer" && (
                        <Link
                          href="/dashboard/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-org-sm text-gray-700 hover:bg-canvas hover:text-[#1A6B3C] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <IconPackage size={15} /> My Orders
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-org-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                      >
                        <IconLogout size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : mounted ? (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/auth/login"
                  className="hidden sm:block text-org-sm font-medium text-gray-700 hover:text-[#1A6B3C] px-3 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-org-sm font-medium bg-[#25A55A] hover:bg-[#1A6B3C] text-white px-4 py-2.25 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="w-20 hidden sm:block" />
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-2.5">
          <form onSubmit={handleSearch} className="flex rounded-md overflow-hidden border border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-org-sm outline-none bg-white"
            />
            <button type="submit" className="bg-[#25A55A] text-white px-3">
              <IconSearch size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Category navigation bar */}
      <nav className="bg-gray-900 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#25A55A] text-white text-org-sm font-medium whitespace-nowrap shrink-0 rounded-[6px] my-1.5 mx-1 transition-colors">
              <IconMenu2 size={14} />
              All Categories
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-3 py-2 text-gray-300 hover:text-white text-org-sm font-normal whitespace-nowrap shrink-0 transition-colors rounded-[6px] mx-0.5 my-1.5 hover:bg-gray-800"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-org-sm text-gray-700 py-2 px-2 rounded-md hover:bg-canvas hover:text-[#1A6B3C] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
            {mounted && !isAuthenticated && (
              <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center py-2.5 border border-[#25A55A] text-[#1A6B3C] rounded-md text-org-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 text-center py-2.5 bg-[#25A55A] text-white rounded-md text-org-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
