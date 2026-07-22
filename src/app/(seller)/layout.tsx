import { redirect } from "next/navigation";
import { getSafeServerSession } from "@/lib/auth";
import { AUTH_DISABLED } from "@/lib/authFlags";
import SellerDashboardShell from "@/components/layout/SellerDashboardShell";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSafeServerSession();

  if (!AUTH_DISABLED && (!session?.user || session.user.role !== "SELLER")) {
    redirect("/auth/login?redirect=/seller");
  }

  const user = session?.user
    ? { name: session.user.name ?? "Seller", email: session.user.email ?? "", avatarUrl: session.user.image ?? null }
    : { name: "Sarah Njoroge", email: "techhub@myproducts.co.ke", avatarUrl: null };

  return <SellerDashboardShell user={user}>{children}</SellerDashboardShell>;
}
