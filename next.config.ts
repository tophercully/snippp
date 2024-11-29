import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },
  distDir: "dist",
  /* other config options here */
};

export default nextConfig;
