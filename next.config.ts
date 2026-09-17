import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lets a phone on the local network open the dev server. */
  allowedDevOrigins: ["192.168.30.12"],
};

export default nextConfig;
