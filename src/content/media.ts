/**
 * Video sections. `src` and `poster` stay null until Hugh supplies footage;
 * the VideoFrame component then renders a labelled placeholder that says
 * what to shoot. Paths, once available, go under /public/video and /public/images.
 */
import type { HeroCue } from "@/lib/hero";

export type MediaClip = {
  id: string;
  src: string | null;
  poster: string | null;
  /** What the clip should show. Shown on the placeholder frame. */
  shotList: string;
  durationHint: string;
};

export type MediaSection = {
  id: string;
  title: string;
  line: string;
  clip: MediaClip;
  facts: readonly { label: string; value: string; toConfirm?: boolean }[];
};

/**
 * The hero reel: drone passes over several finished roofs. `cues` name the
 * project on screen from each second so the caption chip follows the
 * footage. Empty until the reel is cut; the slideshow fallback supplies the
 * project itself. Project ids come from content/projects.ts.
 */
export const HERO_CLIP: MediaClip & { cues: readonly HeroCue[] } = {
  id: "hero",
  src: null,
  poster: null,
  shotList: "Drone reel: 4 to 6 finished roofs, one slow pass each, landed and one commercial, 20 to 30 second loop",
  durationHint: "20 to 30 s loop, muted",
  cues: [],
};

export const MEDIA_SECTIONS: readonly MediaSection[] = [
  {
    id: "survey",
    title: "Survey and design",
    line: "We measure the roof, read your last three bills and draw the layout before you see a number.",
    clip: {
      id: "survey",
      src: null,
      poster: null,
      shotList: "Screen recording of the roof simulation tool placing panels on a real house, 20 to 30 s",
      durationHint: "20 to 30 s",
    },
    facts: [
      { label: "Site survey", value: "Free, about 1 hour" },
      { label: "Quotation", value: "Fixed price, within a week" },
    ],
  },
  {
    id: "install",
    title: "Installation",
    line: "Our own crew, no subcontractors. Hugh comes down to check.",
    clip: {
      id: "install",
      src: null,
      poster: null,
      shotList: "Site footage: mounting rails, panels going up, inverter wiring, Hugh checking the work, 30 to 45 s",
      durationHint: "30 to 45 s",
    },
    facts: [
      { label: "Typical duration", value: "1 to 1.5 weeks" },
      { label: "Sign-off", value: "LEW certified" },
    ],
  },
  {
    id: "after",
    title: "After handover",
    line: "SP Group meter swapped, monitoring app on your phone, and the credit line on your next bill.",
    clip: {
      id: "after",
      src: null,
      poster: null,
      shotList: "Phone screen recording of the monitoring app, then a real bill with the solar credit line (name blurred), 15 to 20 s",
      durationHint: "15 to 20 s",
    },
    facts: [
      { label: "Maintenance included", value: "24 months", toConfirm: true },
      { label: "Net metering", value: "Registered with SP Group by us" },
    ],
  },
];
