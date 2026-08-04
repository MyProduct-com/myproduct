import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local LAN hosts used when opening the app from another device / phone.
  allowedDevOrigins: ["192.168.102.246", "192.168.1.101", "localhost"],
  turbopack: {},
  async redirects() {
    return [
      // Wrong auth-prefixed URLs people typed in the address bar
      { source: "/auth/super_admin", destination: "/super_admin", permanent: false },
      { source: "/auth/shop_admin", destination: "/shop_admin", permanent: false },
      { source: "/auth/admin", destination: "/admin", permanent: false },
      { source: "/auth/seller", destination: "/seller", permanent: false },
      { source: "/auth/market", destination: "/market", permanent: false },
      // Hyphen / concatenated typos only — NEVER add case-only variants like
      // /Super_Admin → /super_admin: on Windows that matches case-insensitively
      // and creates an infinite redirect loop on the real /super_admin route.
      { source: "/super-admin", destination: "/super_admin", permanent: false },
      { source: "/superadmin", destination: "/super_admin", permanent: false },
      { source: "/shop-admin", destination: "/shop_admin", permanent: false },
      { source: "/shopadmin", destination: "/shop_admin", permanent: false },
    ];
  },
};

export default nextConfig;
