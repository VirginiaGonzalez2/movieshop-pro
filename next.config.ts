import type { NextConfig } from "next";

const development = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        remotePatterns: development
            ? // Development
              [
                  {
                      protocol: "https",
                      hostname: "*",
                  },
              ]
            : // Production
              undefined,
    },
};

export default nextConfig;
