import { redirect } from "next/navigation";
import { getSafeServerSession } from "@/lib/auth";
import { AUTH_DISABLED } from "@/lib/authFlags";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  if (!AUTH_DISABLED) {
    const session = await getSafeServerSession();
    if (!session?.user) redirect("/auth/login?redirect=/super_admin");
    if (session.user.role !== "SUPER_ADMIN") redirect("/");
  }

  return <div style={{ margin: 0, padding: 0 }}>{children}</div>;
}
