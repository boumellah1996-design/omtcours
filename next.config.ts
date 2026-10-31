import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow Vercel production builds to finish even with TypeScript errors.
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
