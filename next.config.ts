import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Avoid build issues on small EC2 instances
  typescript: {
    ignoreBuildErrors: true,
  },

  // Helps with image formats like AVIF/WebP issues in Turbopack
  images: {
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },

  // Better compatibility on server builds
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;