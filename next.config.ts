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
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
