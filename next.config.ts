import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.9", "192.168.1.8:3000"],
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.8:3000", "192.168.1.8"],
    },
  },
};

export default nextConfig;
