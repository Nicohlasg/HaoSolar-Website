/**
 * Commercial and institutional clients for the logo marquee, from the list
 * the user supplied on 18 Sep 2026 plus Trisome. Logos are the organisations'
 * own marks, used nominatively to say whose roofs the crew has worked on;
 * files live under /public/images/clients. `width` and `height` are the
 * file's pixel size so next/image can reserve the box; the marquee renders
 * every logo at one height and lets the width follow.
 */
export type Client = { slug: string; name: string; src: string; width: number; height: number };

export const CLIENTS_KICKER = "Commercial and institutional clients";
export const CLIENTS_HEADLINE = "Roofs we have been trusted with.";

export const CLIENTS: readonly Client[] = [
  { slug: "southpoint", name: "SouthPoint", src: "/images/clients/southpoint.png", width: 1404, height: 256 },
  { slug: "tanglin-club", name: "The Tanglin Club", src: "/images/clients/tanglin-club.png", width: 1565, height: 332 },
  { slug: "riverwalk", name: "The Riverwalk", src: "/images/clients/riverwalk.png", width: 1704, height: 248 },
  { slug: "thomson-medical", name: "Thomson Medical", src: "/images/clients/thomson-medical.svg", width: 800, height: 400 },
  { slug: "holiday-inn-atrium", name: "Holiday Inn Singapore Atrium", src: "/images/clients/holiday-inn-atrium.svg", width: 800, height: 400 },
  { slug: "pub", name: "PUB, Singapore's National Water Agency", src: "/images/clients/pub.png", width: 2721, height: 501 },
  { slug: "singapore-polytechnic", name: "Singapore Polytechnic", src: "/images/clients/singapore-polytechnic.png", width: 2400, height: 529 },
  { slug: "ura", name: "Urban Redevelopment Authority", src: "/images/clients/ura.png", width: 936, height: 345 },
  { slug: "home-team-academy", name: "Home Team Academy", src: "/images/clients/home-team-academy.png", width: 330, height: 330 },
  { slug: "qualcomm", name: "Qualcomm", src: "/images/clients/qualcomm.svg", width: 800, height: 200 },
  { slug: "ntu", name: "Nanyang Technological University", src: "/images/clients/ntu.png", width: 3006, height: 1079 },
  { slug: "camden-medical", name: "Camden Medical Centre", src: "/images/clients/camden-medical.svg", width: 800, height: 400 },
  { slug: "colonnade", name: "The Colonnade", src: "/images/clients/colonnade.png", width: 1352, height: 468 },
  { slug: "trisome", name: "Trisome Technical Services & Supply", src: "/images/clients/trisome.png", width: 445, height: 145 },
];
