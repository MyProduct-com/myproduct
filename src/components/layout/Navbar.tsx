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
  IconUser,
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
  const cartCount = useCartStore((s) => s.count());
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
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-green-600 text-white text-xs py-1.5 px-4 text-center hidden sm:block">
        Free delivery on orders over KES 2,000 &nbsp;&bull;&nbsp; Same-day delivery in Nairobi &nbsp;&bull;&nbsp;
        <Link href="/auth/signup?role=seller" className="underline font-semibold hover:text-green-100 ml-1">
          Start Selling Today
        </Link>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 text-gray-500 hover:text-green-600 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-1">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span className="text-green-600">My</span>
              <span className="text-gray-900">Products</span>
            </span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-auto">
            <div className="flex w-full rounded-lg overflow-hidden border-2 border-green-600 focus-within:border-green-700 transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2.5 text-sm outline-none bg-white text-gray-800 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-5 transition-colors flex items-center gap-1.5 font-medium text-sm"
              >
                <IconSearch size={17} />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-1">
            {/* Wishlist */}
            <Link
              href={isAuthenticated ? "/dashboard/wishlist" : "/auth/login"}
              className="relative p-2.5 text-gray-500 hover:text-green-600 transition-colors"
              title="Wishlist"
            >
              <IconHeart size={22} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 text-gray-500 hover:text-green-600 transition-colors"
              title="Cart"
            >
              <IconShoppingCart size={22} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {mounted && isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <IconChevronDown size={14} className="hidden md:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 bg-green-50">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-green-700 capitalize font-medium">{user.role} account</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <IconLayoutDashboard size={16} /> Dashboard
                      </Link>
                      {user.role === "customer" && (
                        <Link
                          href="/dashboard/orders"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <IconPackage size={16} /> My Orders
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                      >
                        <IconLogout size={16} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 ml-1">
                <Link
                  href="/auth/login"
                  className="hidden sm:block text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearch} className="flex rounded-lg overflow-hidden border-2 border-green-600">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-sm outline-none bg-white"
            />
            <button type="submit" className="bg-green-600 text-white px-4">
              <IconSearch size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Category navigation bar */}
      <nav className="bg-gray-900 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors">
              <IconMenu2 size={16} />
              All Categories
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-4 py-2.5 text-gray-300 hover:text-white hover:bg-gray-800 text-sm whitespace-nowrap flex-shrink-0 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-sm text-gray-700 py-2 px-2 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
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
                  className="flex-1 text-center py-2.5 border border-green-600 text-green-600 rounded-lg text-sm font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 text-center py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold"
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
