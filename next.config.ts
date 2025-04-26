import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Your image domains / remote patterns
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // 2. ESLint: ignore errors during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Extend Webpack to load .node binaries as raw
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      use: "raw-loader",
    });

    return config;
  },
};

export default nextConfig;
