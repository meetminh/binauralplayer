import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // Only use 'export' in production
  ...(!isDev && { output: "export" }),
  // Only apply basePath in production (GitHub Pages)
  ...(!isDev && { basePath: "/binauralplayer" }),
  images: { unoptimized: true },
  distDir: 'out',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  generateBuildId: () => 'build',
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
