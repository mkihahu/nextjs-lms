import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "josmartlms-nextjs-project.t3.tigrisfiles.io",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
