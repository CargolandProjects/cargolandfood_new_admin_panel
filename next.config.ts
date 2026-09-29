import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // Allows all Cloudinary accounts and paths
      },
      {
        protocol: "http",
        hostname: "example.com",
      },
    ],
  },
};

export default nextConfig;
