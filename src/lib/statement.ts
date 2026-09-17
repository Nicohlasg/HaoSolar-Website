/**
 * Scroll timeline for the statement section. Progress runs 0 to 1 over the
 * section's scroll range; each chapter owns a slice of it. The final "hold"
 * keeps the finished bill on screen for the last fifth of the scroll so an
 * overshoot never takes it away. Pure functions so timing is testable.
 */
export type ChapterId = "roof" | "panels" | "falls" | "stays" | "hold";

export type Chapter = {
  id: ChapterId;
  from: number;
  to: number;
};

export const CHAPTERS: readonly Chapter[] = [
  { id: "roof", from: 0, to: 0.18 },
  { id: "panels", from: 0.18, to: 0.42 },
  { id: "falls", from: 0.42, to: 0.66 },
  { id: "stays", from: 0.66, to: 0.8 },
  { id: "hold", from: 0.8, to: 1 },
];

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** Index of the chapter that owns this progress value. */
export function chapterAt(progress: number): number {
  const p = clamp01(progress);
  const i = CHAPTERS.findIndex((c) => p < c.to);
  return i === -1 ? CHAPTERS.length - 1 : i;
}

function slice(chapter: Chapter, index: number, count: number, overlap: number): [number, number] {
  const n = Math.max(1, count);
  const i = Math.min(Math.max(0, index), n - 1);
  const span = chapter.to - chapter.from;
  const step = span / n;
  const from = chapter.from + i * step;
  const to = Math.min(chapter.to, from + step * overlap);
  return [from, to];
}

/**
 * Progress window during which panel `index` of `count` scales onto the roof.
 * Windows overlap a little so the tiling reads as a wave, not a flipbook.
 */
export function panelWindow(index: number, count: number): [number, number] {
  return slice(CHAPTERS[1], index, count, 1.6);
}

/** Progress window during which promise line `index` of `count` stamps in. */
export function promiseWindow(index: number, count: number): [number, number] {
  return slice(CHAPTERS[3], index, count, 1);
}

/** Window for the roof outline to draw itself. */
export const ROOF_WINDOW: [number, number] = [0.02, CHAPTERS[0].to];

/** Window during which the usage chart turns from grid to solar, in step with the panels. */
export const BARS_WINDOW: [number, number] = [CHAPTERS[1].from, CHAPTERS[1].to];

/** Window for the credit lines and the falling total. */
export const FALL_WINDOW: [number, number] = [CHAPTERS[2].from, CHAPTERS[2].to];

/** Window for the closing action, at the end of the promises. */
export const CTA_WINDOW: [number, number] = [CHAPTERS[3].to - 0.04, CHAPTERS[3].to];

/** The scroll hint fades out as soon as the visitor starts moving. */
export const HINT_WINDOW: [number, number] = [0, 0.05];
