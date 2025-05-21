const withBundleAnalyzer = require("@next/bundle-analyzer")
const { env } = require("./env.mjs")

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.floy.ir",
        pathname: "/**", // Allow all paths
      },
    ],
  },
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
}

module.exports = env.ANALYZE ? withBundleAnalyzer({ enabled: env.ANALYZE })(config) : config 