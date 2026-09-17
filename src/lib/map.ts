import type { ProjectCategory } from "@/content/projects";
import { SG_VIEWBOX, sgProject } from "@/content/singapore-outline";

/** The two views of the island map. Home chargers count as landed work. */
export type MapFilter = "landed" | "commercial";

export const MAP_FILTERS: readonly { value: MapFilter; label: string }[] = [
  { value: "landed", label: "Landed homes" },
  { value: "commercial", label: "Commercial" },
];

export function inFilter(category: ProjectCategory, filter: MapFilter): boolean {
  return filter === "commercial" ? category === "commercial" : category !== "commercial";
}

/** Zoom limits, the button step, and how much further a hovered dot zooms from the current view. */
export const ZOOM = { min: 1, max: 10, step: 1.6, hover: 2.2 } as const;

/** Dots closer than this on screen, in px, merge into one cluster. */
export const CLUSTER_RADIUS_PX = 30;

/** Which side of a point the card opens on, so it never leaves the map box. */
export function cardSide(xPercent: number): "left" | "right" {
  return xPercent > 55 ? "left" : "right";
}

/** Marker position as a percentage of the map box, for HTML overlays. */
export function toPercent(lat: number, lng: number): { x: number; y: number } {
  const { x, y } = sgProject(lat, lng);
  return { x: (x / SG_VIEWBOX.w) * 100, y: (y / SG_VIEWBOX.h) * 100 };
}

/**
 * The map's view: scale `z` about the box centre, then pan by `x`, `y` px.
 * screen = centre + pan + z * (point - centre)
 */
export type View = { z: number; x: number; y: number };
export type Box = { w: number; h: number };
export type Pct = { x: number; y: number };

export const HOME_VIEW: View = { z: 1, x: 0, y: 0 };

/** A point's offset from the box centre in unscaled px. */
export function fromCentre(p: Pct, box: Box): { x: number; y: number } {
  return { x: (p.x / 100 - 0.5) * box.w, y: (p.y / 100 - 0.5) * box.h };
}

/** Where a percentage point lands on screen, in px from the box's top-left. */
export function toBoxPx(p: Pct, box: Box, view: View): { x: number; y: number } {
  const c = fromCentre(p, box);
  return { x: box.w / 2 + view.x + view.z * c.x, y: box.h / 2 + view.y + view.z * c.y };
}

/** Keep the map from being dragged out of its box: the centre may travel half the scaled size. */
export function clampPan(view: View, box: Box): View {
  const maxX = (box.w * view.z) / 2;
  const maxY = (box.h * view.z) / 2;
  return { ...view, x: Math.min(maxX, Math.max(-maxX, view.x)), y: Math.min(maxY, Math.max(-maxY, view.y)) };
}

/** Zoom to `z` while the point `p` (percent) stays where it is on screen. */
export function zoomAround(view: View, p: Pct, z: number, box: Box): View {
  const next = Math.min(ZOOM.max, Math.max(ZOOM.min, z));
  const c = fromCentre(p, box);
  return clampPan({ z: next, x: view.x + (view.z - next) * c.x, y: view.y + (view.z - next) * c.y }, box);
}

export type Cluster<T> = { key: string; items: T[]; at: Pct };

/**
 * Greedy screen-space clustering: dots within `radius` px of a cluster's
 * running centre join it. Recomputed whenever the view changes, so clusters
 * split as the map zooms in. Order is stable so keys survive re-renders.
 */
export function clusterMarkers<T extends { id: string; at: Pct }>(items: readonly T[], box: Box, view: View, radius = CLUSTER_RADIUS_PX): Cluster<T>[] {
  const clusters: { items: T[]; sx: number; sy: number; px: { x: number; y: number } }[] = [];
  for (const it of items) {
    const px = toBoxPx(it.at, box, view);
    const hit = clusters.find((c) => Math.hypot(c.px.x - px.x, c.px.y - px.y) < radius);
    if (hit) {
      hit.items.push(it);
      hit.sx += it.at.x;
      hit.sy += it.at.y;
      const n = hit.items.length;
      hit.px = toBoxPx({ x: hit.sx / n, y: hit.sy / n }, box, view);
    } else {
      clusters.push({ items: [it], sx: it.at.x, sy: it.at.y, px });
    }
  }
  return clusters.map((c) => ({ key: c.items.map((i) => i.id).join("+"), items: c.items, at: { x: c.sx / c.items.length, y: c.sy / c.items.length } }));
}
