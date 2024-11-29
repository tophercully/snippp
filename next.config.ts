import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },
  distDir: "dist",
};

export default nextConfig;
