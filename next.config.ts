import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfbbykqtfwferargabmz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
