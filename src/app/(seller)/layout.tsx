"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SellerSidebar from "@/components/layout/SellerSidebar";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/seller");
    } else if (user?.role !== "seller") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "seller") return null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden md:block sticky top-0 h-screen">
        <SellerSidebar />
      </div>
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-5 py-6">{children}</div>
      </main>
    </div>
  );
}
