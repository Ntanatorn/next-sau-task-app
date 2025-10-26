/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xfyjejejanqgmhgzkggo.supabase.co', // ✅ โดเมน Supabase ของคุณ
        port: '',
        pathname: '/**', // อนุญาตทุก path ใน storage
      },
    ],
  },
};

module.exports = nextConfig;
