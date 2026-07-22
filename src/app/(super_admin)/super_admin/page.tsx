import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AUTH_DISABLED } from "@/lib/authFlags";
import { getSuperAdminDashboardData } from "@/super_admin/data/getDashboardData";
import SuperAdminPanel from "@/super_admin/SuperAdminPanel";

const FALLBACK_SESSION_USER = { name: "Alex Kariuki", email: "", image: null as string | null };

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions);

  if (!AUTH_DISABLED && (!session?.user || session.user.role !== "SUPER_ADMIN")) {
    redirect("/auth/login?redirect=/super_admin");
  }

  const sessionUser = session?.user
    ? { name: session.user.name ?? "Super Admin", email: session.user.email ?? "", image: session.user.image ?? null }
    : FALLBACK_SESSION_USER;

  const dashboardData = await getSuperAdminDashboardData();

  return <SuperAdminPanel sessionUser={sessionUser} dashboardData={dashboardData} />;
}
