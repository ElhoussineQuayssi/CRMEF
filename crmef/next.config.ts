import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
      allowedOrigins: [
        "localhost:3000",
        "3000.*",
        process.env.NEXT_PUBLIC_VERCEL_URL ? process.env.NEXT_PUBLIC_VERCEL_URL : "",
        process.env.CODESPACES ? `${process.env.CODESPACES}.app.github.dev` : "",
        process.env.GITPOD_WORKSPACE_URL ? new URL(process.env.GITPOD_WORKSPACE_URL).hostname : "",
      ].filter(Boolean),
    },
  },
};

export default nextConfig;
