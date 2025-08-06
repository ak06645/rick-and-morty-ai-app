import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",               // match /api/any/thing
        destination: "http://localhost:5000/api/:path*",  // proxy to your Express server   
      },
    ];
  },
};

export default nextConfig;