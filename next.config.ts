import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  basePath: "/binauralplayer",
  images: { unoptimized: true },
};

export default nextConfig;
