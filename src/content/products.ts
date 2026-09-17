/**
 * The kit, product by product, for the scroll story. Facts come from the
 * June 2026 proposal template and the Jinko datasheet page in it; anything
 * Hugh has not confirmed is marked toConfirm and shows a red tag.
 *
 * `dims` are real centimetres (width, height, depth) so the placeholder
 * cuboid has the right proportions; `face` styles the front of it until a
 * real model or turntable sequence replaces the renderer.
 */
export type ProductId = "panel" | "inverter" | "charger" | "battery";

export type SpecLine = { label: string; value: string; toConfirm?: boolean };

export type ProductTab = { id: string; label: string; lines: readonly SpecLine[] };

export type Hotspot = {
  id: string;
  /** Position on the front face, percent. */
  x: number;
  y: number;
  title: string;
  body: string;
  /** What to photograph or film for this spot. Shown on the placeholder. */
  shot: string;
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
    name: "Jinko Tiger Neo 590 W",
    line: "Tier 1 N-type panel, 144 half cells, built for thirty years of tropical sun.",
    dims: { w: 227.8, h: 113.4, d: 3 },
    face: "panel",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        lines: [
          { label: "Panel grade", value: "Tier 1, Jinko Tiger Neo" },
          { label: "Wattage", value: "590 W N-type TOPCon" },
          { label: "Cells", value: "144 half cells, mono-crystalline" },
          { label: "Size", value: "2278 x 1134 x 30 mm, 27 kg" },
        ],
      },
      {
        id: "build",
        label: "Build",
        lines: [
          { label: "Front glass", value: "3.2 mm tempered, anti-reflective" },
          { label: "Frame", value: "Anodised aluminium" },
          { label: "Junction box", value: "IP68, Class II protection" },
          { label: "Mounting", value: "Rails and clamps sized to the tile or metal profile" },
        ],
      },
      {
        id: "warranty",
        label: "Warranty",
        lines: [
          { label: "Product", value: "30 years" },
          { label: "Performance", value: "30 years on output" },
          { label: "Workmanship", value: "2 years, ours" },
        ],
      },
    ],
    hotspots: [
      { id: "cells", x: 42, y: 50, title: "144 half cells", body: "Half-cut N-type cells lose less power to shade and heat than full cells, which matters on a roof that sees 33 degrees most afternoons.", shot: "Macro of the cell grid, afternoon light" },
      { id: "glass", x: 78, y: 22, title: "3.2 mm tempered glass", body: "Anti-reflective coating and a hail rating well beyond anything Singapore throws at it.", shot: "Raking-light shot across the glass surface" },
      { id: "frame", x: 6, y: 70, title: "Anodised frame", body: "Corrosion-resistant aluminium, clamped to rails, never drilled through the panel.", shot: "Close-up of a mid clamp on the frame edge" },
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
