/**
 * The kit, product by product, for the scroll story. Panel facts come from
 * the Jinko 72HL4-BDV bifacial datasheet (HAO Solar Basic Info folder), the
 * rest from the June 2026 proposal template; anything Hugh has not confirmed
 * is marked toConfirm and shows a red tag. The datasheet gives a 12-year
 * product warranty where the proposal template says 30, hence the tag.
 *
 * `dims` are real centimetres (width, height, depth) so the placeholder
 * cuboid has the right proportions; `face` styles the front of it until a
 * real model or turntable sequence replaces the renderer.
 */
export type ProductId = "panel" | "inverter" | "charger" | "battery";

export type SpecLine = { label: string; value: string; toConfirm?: boolean };

export type ProductTab = { id: string; label: string; lines: readonly SpecLine[] };

/** What a hotspot shows: a real frame or clip where one exists, else the labelled placeholder. */
export type HotspotMedia = { kind: "image"; src: string; alt: string } | { kind: "video"; src: string; poster: string };

export type Hotspot = {
  id: string;
  /** Position on the front face, percent. */
  x: number;
  y: number;
  title: string;
  body: string;
  /** What to photograph or film for this spot. Shown on the placeholder. */
  shot: string;
  media?: HotspotMedia;
};

export type Product = {
  id: ProductId;
  kicker: string;
  name: string;
  line: string;
  dims: { w: number; h: number; d: number };
  face: "panel" | "inverter" | "charger" | "battery";
  tabs: readonly ProductTab[];
  hotspots: readonly Hotspot[];
  toConfirm?: boolean;
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "panel",
    kicker: "On the roof",
    name: "Jinko Tiger Neo 590 W Bifacial",
    line: "Glass on both faces, so it catches light from above and light bouncing off the roof. Still guaranteed at 87% of its power after 30 years.",
    dims: { w: 227.8, h: 113.4, d: 3 },
    face: "panel",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        lines: [
          { label: "Panel", value: "Jinko Tiger Neo, Tier 1, N-type" },
          { label: "Power", value: "590 W, up to 649 W with light off the roof" },
          { label: "Efficiency", value: "22.8%, among the highest on the market" },
          { label: "Size", value: "2278 x 1134 x 30 mm, 31 kg" },
        ],
      },
      {
        id: "why",
        label: "Why it matters",
        lines: [
          { label: "Two-sided", value: "The back face adds power on bright roofs" },
          { label: "Heat", value: "Loses only 0.29% per degree, so hot afternoons cost less" },
          { label: "Low light", value: "Keeps generating in haze and early morning" },
          { label: "Weather", value: "Rated for 5400 Pa of wind and rain, IP68 sealed" },
        ],
      },
      {
        id: "warranty",
        label: "Warranty",
        lines: [
          { label: "Power output", value: "30 years, 87.4% still guaranteed at year 30" },
          { label: "Fade", value: "1% in year one, then 0.4% a year" },
          { label: "Product", value: "12 years from Jinko", toConfirm: true },
          { label: "Workmanship", value: "2 years, ours" },
        ],
      },
    ],
    hotspots: [
      {
        id: "cells",
        x: 42,
        y: 50,
        title: "144 half cells",
        body: "Half-cut N-type cells lose less power to shade and heat than full cells, which matters on a roof that sees 33 degrees most afternoons.",
        shot: "Macro of the cell grid, afternoon light",
        media: { kind: "image", src: "/images/projects/merino-cres/merino-cres-1.jpg", alt: "Rows of Jinko panels on a grey tiled roof, seen from a drone" },
      },
      {
        id: "glass",
        x: 78,
        y: 22,
        title: "Glass front and back",
        body: "Two sheets of 2 mm glass instead of a plastic backsheet: the rear face turns light bouncing off the roof into extra power, and the panel resists moisture for decades.",
        shot: "Raking-light shot across the glass surface",
        media: { kind: "video", src: "/video/after-handover.mp4", poster: "/images/video/after-handover-poster.jpg" },
      },
      {
        id: "frame",
        x: 6,
        y: 70,
        title: "Anodised frame",
        body: "Corrosion-resistant aluminium, clamped to rails, never drilled through the panel. Rated for 5400 Pa on the front and 2400 Pa on the back.",
        shot: "Close-up of a mid clamp on the frame edge",
        media: { kind: "video", src: "/video/install.mp4", poster: "/images/video/install-poster.jpg" },
      },
    ],
  },
  {
    id: "inverter",
    kicker: "On the wall",
    name: "Huawei SUN2000",
    line: "Turns the roof's DC into house AC and puts every watt on your phone.",
    dims: { w: 36.5, h: 36.5, d: 15.6 },
    face: "inverter",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        lines: [
          { label: "Model family", value: "Huawei SUN2000" },
          { label: "Phases", value: "Single or three phase, sized to the house", toConfirm: true },
          { label: "Monitoring", value: "FusionSolar app over Wi-Fi" },
        ],
      },
      {
        id: "monitoring",
        label: "Monitoring",
        lines: [
          { label: "Live", value: "Generation, export and self-use" },
          { label: "Faults", value: "Alerts on the phone, logs checked at every visit" },
          { label: "Battery", value: "Ready for Huawei LUNA storage later", toConfirm: true },
        ],
      },
      {
        id: "warranty",
        label: "Warranty",
        lines: [
          { label: "Inverter", value: "15 years" },
          { label: "Sign-off", value: "LEW certified installation" },
        ],
      },
    ],
    hotspots: [
      { id: "display", x: 50, y: 30, title: "Status LEDs", body: "Three lights tell you at a glance that the roof is generating, the grid is connected and the app is talking.", shot: "Front of the inverter with LEDs lit" },
      { id: "dongle", x: 82, y: 78, title: "Wi-Fi dongle", body: "Plugs in underneath and links the inverter to FusionSolar.", shot: "Underside with the dongle and DC isolator" },
      { id: "isolator", x: 20, y: 80, title: "DC isolator", body: "Cuts the roof off from the inverter for service, a legal requirement we fit every time.", shot: "Isolator switch close-up" },
    ],
  },
  {
    id: "charger",
    kicker: "In the porch",
    name: "EV charger",
    line: "Home and workplace chargers by the same electricians, sized to run on the roof in the daytime.",
    dims: { w: 20, h: 40, d: 12 },
    face: "charger",
    toConfirm: true,
    tabs: [
      {
        id: "overview",
        label: "Overview",
        lines: [
          { label: "Brand", value: "To confirm", toConfirm: true },
          { label: "Types", value: "7 kW single phase, 11 to 22 kW three phase" },
          { label: "Install", value: "About a day", toConfirm: true },
        ],
      },
      {
        id: "power",
        label: "Power",
        lines: [
          { label: "7 kW", value: "Overnight full charge on single phase" },
          { label: "22 kW", value: "Three phase, for two cars or a quick top-up" },
        ],
      },
    ],
    hotspots: [
      { id: "plug", x: 50, y: 78, title: "Type 2 connector", body: "The connector every EV sold in Singapore uses.", shot: "Connector in its holster" },
      { id: "ring", x: 50, y: 28, title: "Status ring", body: "Colour tells you charging, done or waiting for the roof.", shot: "Front with the ring lit" },
    ],
  },
  {
    id: "battery",
    kicker: "Later, if you want",
    name: "Huawei LUNA storage",
    line: "Stacks under the inverter so daytime solar runs the evening.",
    dims: { w: 67, h: 24, d: 15 },
    face: "battery",
    toConfirm: true,
    tabs: [
      {
        id: "overview",
        label: "Overview",
        lines: [
          { label: "Family", value: "Huawei LUNA2000", toConfirm: true },
          { label: "Modules", value: "Stackable, added later without replacing the inverter", toConfirm: true },
        ],
      },
      {
        id: "warranty",
        label: "Warranty",
        lines: [{ label: "Battery", value: "To confirm with Hugh", toConfirm: true }],
      },
    ],
    hotspots: [{ id: "stack", x: 50, y: 50, title: "Stackable modules", body: "Start with one and add more as the household grows.", shot: "Two modules stacked beside an inverter" }],
  },
];
