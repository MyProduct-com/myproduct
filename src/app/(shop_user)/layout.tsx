import  ShopStorefront  from "@/shop_user/ShopStorefront";

export default function ShopUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ShopStorefront />
      {children}
    </div>
  );
}