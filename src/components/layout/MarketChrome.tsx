import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * The Navbar+Footer wrapper every /market/* page needs — used to live in
 * market/layout.tsx, but that made it impossible for /market/[slug] (a shop's
 * own themed storefront) to opt out. Each page now wraps itself with this
 * instead, so the storefront route can render bare.
 */
export default function MarketChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
