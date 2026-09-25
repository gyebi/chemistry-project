import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Avoid spawning a detached TypeScript CLI process during builds.
    useTypeScriptCli: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
