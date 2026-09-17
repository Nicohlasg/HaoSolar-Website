"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { COLORS } from "@/config/theme";
import { EASE_OUT } from "@/lib/motion";
import { panelWindow, ROOF_WINDOW } from "@/lib/statement";

/**
 * A terrace house seen from above, drawn in the statement's line grammar.
 * Placeholder for the satellite roof image the calculator will show later.
 *
 * Two modes. With `progress` (a scroll motion value) the outline draws and
 * the panels tile in step with the scroll. Without it, `play` runs the same
 * sequence once on a timer, which is what the calculator uses.
 */
const ROWS = 2;
const COLS = 6;
const PANEL_W = 19;
const PANEL_H = 21;
const GAP = 3;
const SLOPES = [
  { y: 27 }, // upper slope
  { y: 80 }, // lower slope
];

export const MAX_DRAWN_PANELS = ROWS * COLS * SLOPES.length;

type PanelPos = { x: number; y: number; i: number };

function layoutPanels(count: number): PanelPos[] {
  const panels: PanelPos[] = [];
  let i = 0;
  for (const slope of SLOPES) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        panels.push({ x: 34 + c * (PANEL_W + GAP), y: slope.y + r * (PANEL_H + GAP), i: i++ });
      }
    }
  }
  return panels.slice(0, Math.max(0, Math.min(count, MAX_DRAWN_PANELS)));
}

const PANEL_STYLE = { rx: 1, fill: COLORS.ink, stroke: COLORS.lime, strokeWidth: 1 } as const;

function ScrubPanel({ p, progress, count }: { p: PanelPos; progress: MotionValue<number>; count: number }) {
  const t = useTransform(progress, panelWindow(p.i, count), [0, 1], { clamp: true });
  return <motion.rect x={p.x} y={p.y} width={PANEL_W} height={PANEL_H} {...PANEL_STYLE} style={{ scale: t, opacity: t, originX: "50%", originY: "50%" }} />;
}

function TimedPanel({ p, on, reduced }: { p: PanelPos; on: boolean; reduced: boolean }) {
  return (
    <motion.rect
      x={p.x}
      y={p.y}
      width={PANEL_W}
      height={PANEL_H}
      {...PANEL_STYLE}
      style={{ originX: 0.5, originY: 0.5 }}
      initial={reduced ? false : { scale: 0, opacity: 0 }}
      animate={on ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE_OUT, delay: reduced ? 0 : 0.9 + p.i * 0.04 }}
    />
  );
}

function ScrubOutline({ progress }: { progress: MotionValue<number> }) {
  const draw = useTransform(progress, ROOF_WINDOW, [0, 1], { clamp: true });
  const ridge = useTransform(progress, [ROOF_WINDOW[0] + 0.08, ROOF_WINDOW[1]], [0, 1], { clamp: true });
  return (
    <>
      <motion.rect x="28" y="20" width="144" height="110" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth="1.5" style={{ pathLength: draw, opacity: draw }} />
      <motion.line x1="28" y1="75" x2="172" y2="75" stroke={COLORS.ink} strokeWidth="1" strokeDasharray="4 2" style={{ pathLength: ridge, opacity: ridge }} />
    </>
  );
}

function TimedOutline({ on, reduced }: { on: boolean; reduced: boolean }) {
  const draw = on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 };
  return (
    <>
      <motion.rect x="28" y="20" width="144" height="110" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth="1.5" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={draw} transition={{ duration: 0.8, ease: EASE_OUT }} />
      <motion.line x1="28" y1="75" x2="172" y2="75" stroke={COLORS.ink} strokeWidth="1" strokeDasharray="4 2" initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={draw} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }} />
    </>
  );
}

export function RoofTile({
  play = false,
  reduced = false,
  progress,
  panelCount = MAX_DRAWN_PANELS,
  className,
}: {
  play?: boolean;
  reduced?: boolean;
  /** Scroll progress 0 to 1. When set, the drawing follows the scroll instead of a timer. */
  progress?: MotionValue<number>;
  /** Panels to draw, capped at the 24 the plan has room for. */
  panelCount?: number;
  className?: string;
}) {
  const shown = layoutPanels(panelCount);
  const on = reduced || play;

  return (
    <svg viewBox="0 0 200 150" role="img" aria-label="Plan view of a terrace house roof with solar panels" className={className}>
      {/* plot boundary */}
      <rect x="6" y="6" width="188" height="138" fill={COLORS.paper2} stroke={COLORS.rule} strokeDasharray="3 3" />
      {progress ? <ScrubOutline progress={progress} /> : <TimedOutline on={on} reduced={reduced} />}
      {shown.map((p) => (progress ? <ScrubPanel key={p.i} p={p} progress={progress} count={shown.length} /> : <TimedPanel key={p.i} p={p} on={on} reduced={reduced} />))}
      {/* north arrow and label */}
      <text x="180" y="140" fontSize="7" fill={COLORS.ink2} textAnchor="end" fontFamily="inherit">
        N ↑
      </text>
    </svg>
  );
}
