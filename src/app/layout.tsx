import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyProducts — Kenya's Online Marketplace",
  description: "Shop electronics, fashion, groceries, beauty and more. Fast delivery across Kenya. Thousands of verified sellers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
