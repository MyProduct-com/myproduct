"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CustomerSidebar from "@/components/layout/CustomerSidebar";
import Navbar from "@/components/layout/Navbar";
import { AUTH_DISABLED } from "@/lib/authFlags";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!AUTH_DISABLED && !isAuthenticated) {
      router.push("/auth/login?redirect=/dashboard");
    }
  }, [isAuthenticated, router]);

  if (!AUTH_DISABLED && (!isAuthenticated || !user)) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 gap-6">
        <div className="hidden md:block">
          <CustomerSidebar />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
