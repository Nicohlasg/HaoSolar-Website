import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lets a phone on the local network open the dev server. */
  allowedDevOrigins: ["192.168.30.12"],
  images: {
    /* Next re-encodes at quality 75 by default, which softens the drone photos. */
    qualities: [75, 90],
  },
};

export default nextConfig;
