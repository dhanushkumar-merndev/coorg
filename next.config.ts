import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.9", "192.168.1.8:3000"],
  // Next 16 defaults images.qualities to [75] and coerces anything else down to
  // the nearest allowed value. The full-bleed chapter heroes are the LCP image
  // on every page, so 88 has to be declared for it to actually be used.
  images: { qualities: [75, 88] },
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.8:3000", "192.168.1.8"],
    },
  },
};

export default nextConfig;