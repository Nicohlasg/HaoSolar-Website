export type ProjectCategory = "landed" | "commercial" | "ev";

export type ProjectPhoto = {
  /** Under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  category: ProjectCategory;
  area: string;
  kwp: number | null;
  year: number;
  note: string;
  roofMaterial: string;
  /** Indicative first-year saving, S$. Sample until Hugh supplies real figures. */
  annualSavingsSgd: number | null;
  /** Approximate location for the map marker (district centre, not the house). */
  geo: { lat: number; lng: number };
  /** Customer's Google review line, only where the reviewer gave permission. */
  quote?: string;
  /** Real photos, drone first. First one is the cover. */
  photos?: readonly ProjectPhoto[];
  /** true while the entry is sample data; replaced once Hugh supplies real jobs */
  sample: boolean;
};

/** Full drone frame, exported at native size so the browser can pick any variant. */
const SHOT = { width: 4032, height: 2268 } as const;
/** Upright drone frames, cropped to landscape on 18 Sep 2026 so every photo on the site is landscape; the crops keep the roof and drop the street. */
const CROP_WIDE = { width: 2268, height: 1512 } as const;
const CROP_STEVEN_CLOSE = { width: 2100, height: 1400 } as const;
const CROP_STEVEN_DOWN = { width: 1560, height: 1040 } as const;

/**
 * Real jobs first: the "Yes" folders of the drone shoots plus the curated
 * "to use for website" folder (17 Sep 2026). All exports are stripped of GPS
 * with `npm run photos:clean`; map positions are rounded to about a kilometre.
 * kWp and savings are unknown until Hugh confirms, so those fields stay null
 * and the card shows the roof only. Areas are rough, never the address.
 * Photo order matters: [0] top-down for the hero, [1] for the showcase,
 * [2] for the map card, so the same frame never shows twice on one page.
 * Then the other 21 jobs from the source folders (verdicts No, Redo, Maybe):
 * real roofs, so they earn a dot on the map, but no photo until a reshoot or
 * a yes. Roof type and year are placeholders until Hugh confirms. Positions
 * are district centres; the ones marked "check" were guessed from the street
 * name. Real customer names are never shown.
 */
export const PROJECTS: readonly Project[] = [
  {
    id: "merino",
    category: "landed",
    area: "Alexandra", // from the drone GPS, check the area name
    kwp: null,
    year: 2026,
    note: "Detached, glazed tile roof, panels on three faces",
    roofMaterial: "Glazed clay tiles",
    annualSavingsSgd: null,
    geo: { lat: 1.29, lng: 103.806 },
    photos: [
      { src: "/images/projects/merino-cres/merino-cres-2.jpg", alt: "Drone view of a detached house from the street side, panels on the front and side faces of its grey tiled roof", ...SHOT },
      { src: "/images/projects/merino-cres/merino-cres-4.jpg", alt: "Drone view of the detached house showing the full panel array and the surrounding estate", ...SHOT },
      { src: "/images/projects/merino-cres/merino-cres-3.jpg", alt: "Drone view of the grey tiled roof and its panels between orange-roofed neighbours", ...SHOT },
      { src: "/images/projects/merino-cres/merino-cres-1.jpg", alt: "Drone view down onto the detached house's grey tiled roof covered in solar panels", ...CROP_WIDE },
    ],
    sample: false,
  },
  {
    id: "greenwood",
    category: "landed",
    area: "Bukit Timah",
    kwp: null,
    year: 2026,
    note: "Semi-detached, terracotta tiles",
    roofMaterial: "Clay tiles",
    annualSavingsSgd: null,
    geo: { lat: 1.3355, lng: 103.7975 },
    photos: [
      { src: "/images/projects/greenwood-ave/greenwood-ave-1.jpg", alt: "Drone view of a semi-detached house in Bukit Timah with solar panels on its terracotta roof, neighbours either side", ...SHOT },
      { src: "/images/projects/greenwood-ave/greenwood-ave-2.jpg", alt: "Drone view of the Bukit Timah house and its garden, panels on the main roof", ...SHOT },
      { src: "/images/projects/greenwood-ave/greenwood-ave-3.jpg", alt: "Drone view straight down onto the Bukit Timah roof and its panel rows", ...CROP_WIDE },
    ],
    sample: false,
  },
  {
    id: "steven",
    category: "landed",
    area: "Stevens",
    kwp: null,
    year: 2026,
    note: "Detached, flat concrete roof, large array",
    roofMaterial: "Concrete",
    annualSavingsSgd: null,
    geo: { lat: 1.3145, lng: 103.8285 },
    photos: [
      { src: "/images/projects/steven-rd/steven-rd-1.jpg", alt: "Aerial view of a detached house near Stevens Road, its flat roof lined with rows of solar panels", ...SHOT },
      { src: "/images/projects/steven-rd/steven-rd-3.jpg", alt: "Close aerial view of the panel rows on the Stevens Road roof", ...CROP_STEVEN_CLOSE },
      { src: "/images/projects/steven-rd/steven-rd-2.jpg", alt: "Aerial view straight down onto the Stevens Road roof showing the panel array", ...CROP_STEVEN_DOWN },
    ],
    sample: false,
  },
  {
    id: "inggu",
    category: "landed",
    area: "Sembawang",
    kwp: null,
    year: 2026,
    note: "Terrace, metal sheet roof",
    roofMaterial: "Metal sheet",
    annualSavingsSgd: null,
    geo: { lat: 1.459, lng: 103.838 },
    photos: [
      { src: "/images/projects/inggu-rd/inggu-rd-1.jpg", alt: "Drone view of solar panels on the metal sheet roof of a terrace house in Sembawang", ...SHOT },
      { src: "/images/projects/inggu-rd/inggu-rd-2.jpg", alt: "Drone view of the Sembawang terrace roof with panels near the ridge", ...SHOT },
    ],
    sample: false,
  },
  {
    id: "namly",
    category: "landed",
    area: "Bukit Timah",
    kwp: null,
    year: 2026,
    note: "Detached, Namly estate",
    roofMaterial: "Clay tiles",
    annualSavingsSgd: null,
    geo: { lat: 1.3235, lng: 103.7885 },
    photos: [
      { src: "/images/projects/namly-pl/namly-pl-1.jpg", alt: "Drone view straight down onto a detached house in Bukit Timah, panels on every face of its terracotta hip roof, pool beside it", ...SHOT },
    ],
    sample: false,
  },
  {
    id: "kasau",
    category: "landed",
    area: "Kranji", // from the drone GPS, check the area name
    kwp: null,
    year: 2026,
    note: "Landed, flat and pitched roof sections",
    roofMaterial: "To confirm",
    annualSavingsSgd: null,
    geo: { lat: 1.417, lng: 103.759 },
    photos: [
      { src: "/images/projects/jalan-kasau/jalan-kasau-1.jpg", alt: "Drone view straight down onto a landed house in Kranji, panel rows across two grey roof sections beside a tree-lined road", ...SHOT },
    ],
    sample: false,
  },
  {
    id: "inggu-2",
    category: "landed",
    area: "Sembawang",
    kwp: null,
    year: 2026,
    note: "Landed, a few doors from another of our roofs",
    roofMaterial: "To confirm",
    annualSavingsSgd: null,
    geo: { lat: 1.461, lng: 103.841 },
    photos: [
      { src: "/images/projects/inggu-rd-b/inggu-rd-b-1.jpg", alt: "Drone view over a row of landed houses in Sembawang with pools, solar panels on the grey roofs, street and parked cars alongside", ...SHOT },
    ],
    sample: false,
  },
  { id: "peakville", category: "landed", area: "Serangoon", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3545, lng: 103.869 }, sample: false }, // district guessed from the street name, check
  { id: "westcoast", category: "landed", area: "West Coast", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.305, lng: 103.758 }, sample: false },
  { id: "astrid", category: "landed", area: "Holland", kwp: null, year: 2026, note: "Detached, Queen Astrid Park", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3175, lng: 103.792 }, sample: false },
  { id: "paras", category: "landed", area: "Seletar Hills", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.388, lng: 103.875 }, sample: false }, // district guessed from the street name, check
  { id: "bumbong", category: "landed", area: "Serangoon Gardens", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.364, lng: 103.866 }, sample: false }, // district guessed from the street name, check
  { id: "seagull", category: "landed", area: "Sembawang", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.449, lng: 103.825 }, sample: false }, // district guessed from the street name, check
  { id: "serenade-1", category: "landed", area: "Yio Chu Kang", kwp: null, year: 2026, note: "Landed, Serenade Walk", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.385, lng: 103.864 }, sample: false }, // district guessed from the street name, check
  { id: "serenade-2", category: "landed", area: "Yio Chu Kang", kwp: null, year: 2026, note: "Landed, Serenade Walk", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3838, lng: 103.8628 }, sample: false }, // district guessed from the street name, check
  { id: "serenade-3", category: "landed", area: "Yio Chu Kang", kwp: null, year: 2026, note: "Landed, Serenade Walk", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3844, lng: 103.8652 }, sample: false }, // district guessed from the street name, check
  { id: "sappan", category: "landed", area: "Seletar", kwp: null, year: 2026, note: "Landed, off Jalan Kayu", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3948, lng: 103.876 }, sample: false },
  { id: "lucky", category: "landed", area: "Siglap", kwp: null, year: 2026, note: "Landed, Lucky Heights", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.317, lng: 103.927 }, sample: false },
  { id: "trevose", category: "landed", area: "Bukit Timah", kwp: null, year: 2026, note: "Landed, Trevose estate", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3245, lng: 103.817 }, sample: false },
  { id: "hillcrest", category: "landed", area: "Bukit Timah", kwp: null, year: 2026, note: "Landed, Hillcrest", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3372, lng: 103.794 }, sample: false },
  { id: "lentor", category: "landed", area: "Lentor", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3835, lng: 103.836 }, sample: false },
  { id: "corfe", category: "landed", area: "Bukit Timah", kwp: null, year: 2026, note: "Landed, Corfe Place", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.327, lng: 103.801 }, sample: false }, // district guessed from the street name, check
  { id: "pariburong", category: "landed", area: "Sembawang Hills", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.373, lng: 103.829 }, sample: false }, // district guessed from the street name, check
  { id: "seraya", category: "landed", area: "Kembangan", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.3195, lng: 103.913 }, sample: false }, // district guessed from the street name, check
  { id: "kathi", category: "landed", area: "Serangoon", kwp: null, year: 2026, note: "Landed", roofMaterial: "To confirm", annualSavingsSgd: null, geo: { lat: 1.352, lng: 103.87 }, sample: false }, // district guessed from the street name, check
];

export const PROJECT_CATEGORIES: readonly { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "landed", label: "Landed homes" },
  { value: "commercial", label: "Commercial" },
  { value: "ev", label: "EV chargers" },
];

/**
 * The five roofs the hero shows, in order. Every frame on the site is now
 * landscape (the upright ones were cropped on 18 Sep 2026). Chosen by the
 * user from the "to use for website" drone folder (18 Sep 2026).
 */
export const HERO_REEL_IDS = ["namly", "inggu-2", "kasau", "merino", "greenwood"] as const;

/** The hero roofs, skipping any id whose photos are not in yet. */
export const HERO_REEL: readonly Project[] = HERO_REEL_IDS.map((id) => PROJECTS.find((p) => p.id === id)).filter(
  (p): p is Project => Boolean(p?.photos),
);
