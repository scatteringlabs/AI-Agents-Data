/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});
const nextConfig = {
  // output: "export",
  // reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
};

module.exports =
  process.env.NODE_ENV === "development" ? nextConfig : withPWA(nextConfig);
