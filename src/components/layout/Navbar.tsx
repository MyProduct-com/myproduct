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
    <header className="w-full bg-white sticky top-0 z-50 border-b border-[#E5E7EB]">
      {/* Announcement bar */}
      <div className="bg-[#1A6B3C] text-white text-[11px] font-[500] py-1.5 px-4 text-center tracking-[0.02em] hidden sm:block">
        Free delivery on orders over KES 2,000 &nbsp;&bull;&nbsp; Same-day delivery in Nairobi &nbsp;&bull;&nbsp;
        <Link href="/auth/signup?role=seller" className="underline font-[600] hover:text-[#D4F0E2] ml-1 transition-colors">
          Start Selling Today
        </Link>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-14">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 text-[#6B7280] hover:text-[#1A6B3C] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX size={21} /> : <IconMenu2 size={21} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-[18px] font-[600] tracking-[-0.01em]">
              <span className="text-[#1A6B3C]">My</span>
              <span className="text-[#111827]">Products</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-auto">
            <div className="flex w-full rounded-[8px] overflow-hidden border border-[#E5E7EB] focus-within:border-[#25A55A] transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="flex-1 px-4 py-2 text-[13px] outline-none bg-white text-[#111827] placeholder-[#9CA3AF]"
              />
              <button
                type="submit"
                className="bg-[#25A55A] hover:bg-[#1A6B3C] text-white px-4 flex items-center gap-1.5 font-[500] text-[13px] transition-colors"
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
              className="relative p-2 text-[#6B7280] hover:text-[#1A6B3C] transition-colors"
              title="Wishlist"
            >
              <IconHeart size={20} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8500A] text-white text-[9px] font-[600] rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-[#6B7280] hover:text-[#1A6B3C] transition-colors"
              title="Cart"
            >
              <IconShoppingCart size={20} />
              {mounted && cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#E8500A] text-white text-[9px] font-[600] rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {mounted && isAuthenticated && user ? (
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-[8px] text-[#374151] hover:bg-[#F3F4F6] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D4F0E2] text-[#1A6B3C] text-[12px] font-[600] flex items-center justify-center flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-[13px] font-[500] max-w-[80px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <IconChevronDown size={13} className="hidden md:block text-[#9CA3AF]" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-[12px] shadow-lg border border-[#E5E7EB] py-1 z-50">
                      <div className="px-4 py-2.5 border-b border-[#F3F4F6]">
                        <p className="text-[13px] font-[600] text-[#111827]">{user.name}</p>
                        <p className="text-[11px] text-[#25A55A] font-[500] capitalize">{user.role}</p>
                      </div>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F2F9F5] hover:text-[#1A6B3C] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <IconLayoutDashboard size={15} /> Dashboard
                      </Link>
                      {user.role === "customer" && (
                        <Link
                          href="/dashboard/orders"
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#374151] hover:bg-[#F2F9F5] hover:text-[#1A6B3C] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <IconPackage size={15} /> My Orders
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-[#dc2626] hover:bg-[#fef2f2] transition-colors border-t border-[#F3F4F6] mt-1"
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
                  className="hidden sm:block text-[13px] font-[500] text-[#374151] hover:text-[#1A6B3C] px-3 py-1.5 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-[13px] font-[500] bg-[#25A55A] hover:bg-[#1A6B3C] text-white px-4 py-[9px] rounded-[8px] transition-colors"
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
          <form onSubmit={handleSearch} className="flex rounded-[8px] overflow-hidden border border-[#E5E7EB]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 text-[13px] outline-none bg-white"
            />
            <button type="submit" className="bg-[#25A55A] text-white px-3">
              <IconSearch size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* Category navigation bar */}
      <nav className="bg-[#111827] hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center overflow-x-auto">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#25A55A] text-white text-[13px] font-[500] whitespace-nowrap flex-shrink-0 rounded-[6px] my-1.5 mx-1 transition-colors">
              <IconMenu2 size={14} />
              All Categories
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className="px-3 py-2 text-[#D1D5DB] hover:text-white text-[13px] font-[400] whitespace-nowrap flex-shrink-0 transition-colors rounded-[6px] mx-0.5 my-1.5 hover:bg-[#1F2937]"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <p className="text-[11px] font-[500] text-[#6B7280] uppercase tracking-[0.05em] mb-2">
              Categories
            </p>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-[13px] text-[#374151] py-2 px-2 rounded-[8px] hover:bg-[#F2F9F5] hover:text-[#1A6B3C] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
            {mounted && !isAuthenticated && (
              <div className="flex gap-2 pt-3 mt-2 border-t border-[#F3F4F6]">
                <Link
                  href="/auth/login"
                  className="flex-1 text-center py-2.5 border border-[#25A55A] text-[#1A6B3C] rounded-[8px] text-[13px] font-[500]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex-1 text-center py-2.5 bg-[#25A55A] text-white rounded-[8px] text-[13px] font-[500]"
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
