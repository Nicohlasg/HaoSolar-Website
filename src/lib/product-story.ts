/**
 * Scroll timeline for one product stage. Progress runs 0 to 1 over the
 * stage's scroll range. First the product turns a full circle and glides to
 * its side while the details land opposite; then everything holds and the
 * hotspots come alive. Pure functions so the timing is testable.
 */
export type Side = "left" | "right";

/** Progress at which the spin and glide finish. The rest is the hold. */
export const SPIN_END = 0.6;
/** Hotspots fade in from here, once the product has settled. */
export const HOTSPOTS_FROM = 0.55;
/** Window inside which the detail lines land, one after another. */
const DETAILS: [number, number] = [0.18, 0.62];

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Degrees of Y rotation at `progress`: one full turn by SPIN_END, then still. */
export function rotationAt(progress: number): number {
  return 360 * clamp01(progress / SPIN_END);
}

/** 0 to 1 share of the glide from centre to the product's side. */
export function glideAt(progress: number): number {
  return clamp01(progress / SPIN_END);
}

/** Products alternate sides so the page does not lean one way. */
export function sideFor(index: number): Side {
  return index % 2 === 0 ? "right" : "left";
}

/** Progress window during which detail line `index` of `count` lands. */
export function detailWindow(index: number, count: number): [number, number] {
  const n = Math.max(1, count);
  const i = Math.min(Math.max(0, index), n - 1);
  const step = (DETAILS[1] - DETAILS[0]) / n;
  const from = DETAILS[0] + i * step;
  return [from, Math.min(DETAILS[1], from + step * 1.4)];
}
