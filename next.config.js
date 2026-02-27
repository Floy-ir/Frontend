const withBundleAnalyzer = require("@next/bundle-analyzer")

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
      { protocol: "https", hostname: "cdn.floy.ir", pathname: "/**" },
      { protocol: "https", hostname: "commons.wikimedia.org", pathname: "/**" },
    ],
  },
  rewrites: async () => [
    { source: "/healthz", destination: "/api/health" },
    { source: "/api/healthz", destination: "/api/health" },
    { source: "/health", destination: "/api/health" },
    { source: "/ping", destination: "/api/health" },
  ],
  experimental: {
    turbopack: {
      root: __dirname,
    },
  },
}

module.exports = async () => {
  const { env } = await import("./env.mjs")
  return env.ANALYZE ? withBundleAnalyzer({ enabled: env.ANALYZE })(config) : config
}
