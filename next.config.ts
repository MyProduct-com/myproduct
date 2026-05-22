import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow network access for development
  allowedDevOrigins: ['192.168.1.101', 'localhost'],
  
  // Empty turbopack config to silence the warning
  turbopack: {},
  
  // Remove any webpack config that might exist
  // (your error suggests there was a webpack config)
};

export default nextConfig;
