import { SOLAR_MODEL } from "@/config/solar-model";

export type Insight = {
  slug: string;
  title: string;
  summary: string;
  readMinutes: number;
  date: string;
  draft?: boolean;
  /** Markdown-ish paragraphs; rendered as simple blocks. */
  body: readonly string[];
};

const T = SOLAR_MODEL;
const tariffCents = (T.TARIFF_SGD_PER_KWH * 100).toFixed(2);

export const INSIGHTS: readonly Insight[] = [
  {
    slug: "is-solar-worth-it-singapore-landed-home-2026",
    title: "Is solar worth it for a Singapore landed home? A 2026 worked example",
    summary: `At SP Group's Q3 2026 tariff of ${tariffCents} cents per kWh, a rooftop system on a landed home typically pays back in a handful of years, then runs for the rest of its 30-year warranty.`,
    readMinutes: 5,
    date: "2026-09-15",
    body: [
      `Electricity in Singapore costs ${tariffCents} cents per kWh including GST on SP Group's regulated tariff for July to September 2026, the highest on record. A roof that generates part of that electricity removes it from the bill at the full tariff, and anything not used at home is exported through the dual meter and credited.`,
      "The table on this page shows what that looks like for the four common landed property types, using the same model that runs the calculator on this site. The assumptions are listed underneath, and every number stays an estimate until the survey.",
      "Payback assumes the household uses most of what the roof generates in the daytime. Homes with someone in during the day, air-conditioning running, a pool pump or an EV on charge reach higher self-consumption and shorter payback. Homes that are empty in the day export more and pay back a little later.",
      "Roof orientation, shading from neighbouring buildings and the roof material all move the result. That is why every quotation follows a site survey, and why the calculator gives a range.",
    ],
  },
  {
    slug: "sp-group-net-metering-explained",
    title: "What happens to the electricity you do not use: SP Group net metering explained",
    summary: "Dual metering, the Simplified Credit Treatment scheme, and why the export rate on your bill is lower than the tariff you pay.",
    readMinutes: 4,
    date: "2026-09-15",
    draft: true,
    body: [
      "Draft. Written once Hugh confirms the export rate basis his customers are on.",
    ],
  },
  {
    slug: "solar-and-ev-charger-together",
    title: "Charging an EV from your own roof: sizing the system for a car",
    summary: "A 7 kW home charger draws as much as a small house. Pairing it with panels changes the maths on both.",
    readMinutes: 4,
    date: "2026-09-15",
    draft: true,
    body: ["Draft. Needs a real customer example from Hugh's EV installs."],
  },
];

/** Worked example rows for the first article, computed from the model so they stay consistent with the calculator. */
export const WORKED_EXAMPLES = [
  { type: "Terrace house", roofM2: T.TYPICAL_KWP.terrace.roofM2, bill: 350 },
  { type: "Semi-detached", roofM2: T.TYPICAL_KWP.semi.roofM2, bill: 600 },
  { type: "Bungalow", roofM2: T.TYPICAL_KWP.bungalow.roofM2, bill: 900 },
  { type: "Good Class Bungalow", roofM2: T.TYPICAL_KWP.gcb.roofM2, bill: 1800 },
] as const;
