import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};
module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
