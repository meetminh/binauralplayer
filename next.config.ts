import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/binauralplayer",
  images: { unoptimized: true },
  distDir: 'out',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  generateBuildId: () => 'build',
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
