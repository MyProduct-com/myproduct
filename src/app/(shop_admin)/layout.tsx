import AdminPanel from "@/shop_admin/AdminPanel";

export default function ShopAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <AdminPanel />
      {children}
    </div>
  );
}