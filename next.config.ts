import withBundleAnalyzer from "@next/bundle-analyzer"
import { type NextConfig } from "next"

import { env } from "./env.mjs"

const config: NextConfig = {
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
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
        pathname: "/**", // Allow all paths
      },
      {
        protocol: "https",
        hostname: "cdn.alibaba.ir",
        pathname: "/**", // Allow all paths
      },
      {
        protocol: "https",
        hostname: "www.flytoday.ir",
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

export default env.ANALYZE ? withBundleAnalyzer({ enabled: env.ANALYZE })(config) : config
