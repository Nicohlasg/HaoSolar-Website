import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Lets a phone on the local network open the dev server. */
  allowedDevOrigins: ["192.168.30.12"],
  images: {
    /* Next re-encodes at quality 75 by default, which softens the drone photos. */
    qualities: [75, 82, 90],
    /* 1280 and 2560 keep the full-bleed hero from rounding up to 1920 and 3840. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1920, 2048, 2560, 3840],
  },
};

export default nextConfig;
