import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    reactCompiler: true,
    swcPlugins: [
      [
        "@preact-signals/safe-react/swc",
        {
          // you should use `auto` mode to track only components which uses `.value` access.
          // Can be useful to avoid tracking of server side components
          mode: "auto",
        } /* plugin options here */,
      ],
    ],
  },
  // distDir: "dist",
};

export default nextConfig;
