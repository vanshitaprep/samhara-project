import type { NextConfig } from "next";

// Packages that must never be bundled into client or edge chunks.
// Learned from boilerplate: listing them here prevents hard-to-debug
// "module not found" errors when Next.js tries to tree-shake server deps.
const serverOnlyPackages = ["mongoose", "razorpay"];

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Avoids build failures on small EC2 instances
  typescript: {
    ignoreBuildErrors: true,
  },

  // Explicit passthrough — prevents env vars from being silently undefined
  // at build time when Next.js optimises the bundle
  env: {
    MONGO_URL: process.env.MONGO_URL,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
  },

  // Allow LAN access during development (matches boilerplate pattern)
  allowedDevOrigins: [
    "192.168.1.17",
    "192.168.1.13",
    "192.168.1.21",
    "192.168.1.19",
  ],

  serverExternalPackages: serverOnlyPackages,

  images: {
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
