/**
 * Process timeline geometry, all in px from the top of the track.
 *
 * The bead sits on a fixed viewport line, so its track position is simply
 * scroll progress times track height. Each step dot waits at its step (`from`),
 * rides with the bead while its sticky title is stuck, and stays behind at
 * `to` once the title scrolls away. Below `md` nothing sticks: `from === to`.
 */

/** Viewport line the bead rides on: sticky title top (8rem) plus half the 2.5rem dot. */
export const BEAD_LINE_PX = 148;

export type Stop = { from: number; to: number };

export function dotCentre(bead: number, stop: Stop): number {
  return Math.min(Math.max(bead, stop.from), stop.to);
}

export function isReached(bead: number, stop: Stop): boolean {
  return bead >= stop.from;
}
