import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ijtueoelejhgvjbynecb.supabase.co", // Para tus futuras fotos de Supabase Storage
      },
    ],
  },
};

export default nextConfig;
