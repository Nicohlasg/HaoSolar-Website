"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { COLORS } from "@/config/theme";
import { EASE_OUT } from "@/lib/motion";
import { BARS_WINDOW } from "@/lib/statement";

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
/** Relative monthly usage shape, so the chart looks like a real year. Illustrative. */
const SHAPE = [0.92, 0.88, 1.0, 1.05, 1.08, 1.0, 0.97, 0.95, 0.9, 0.93, 0.9, 0.96];
const H = 64;
const W = 12;
const GAP = 6;
const WIDTH = MONTHS.length * (W + GAP);

type BarGeometry = { x: number; full: number; solar: number };

function ScrubBar({ g, progress }: { g: BarGeometry; progress: MotionValue<number> }) {
  const solarH = useTransform(progress, BARS_WINDOW, [0, g.solar], { clamp: true });
  const gridH = useTransform(solarH, (s) => g.full - s);
  const solarY = useTransform(solarH, (s) => H - s);
  return (
    <>
      <motion.rect x={g.x} y={H - g.full} width={W} fill={COLORS.ink2} opacity={0.55} style={{ height: gridH }} />
      <motion.rect x={g.x} width={W} fill={COLORS.lime} style={{ y: solarY, height: solarH }} />
    </>
  );
}

function TimedBar({ g, i, on, reduced, delay }: { g: BarGeometry; i: number; on: boolean; reduced: boolean; delay: number }) {
  const transition = { duration: 0.7, ease: EASE_OUT, delay: reduced ? 0 : delay + i * 0.04 };
  return (
    <>
      {/* grid portion, shrinks from full to remainder */}
      <motion.rect x={g.x} width={W} fill={COLORS.ink2} opacity={0.55} initial={reduced ? false : { y: H - g.full, height: g.full }} animate={on ? { y: H - g.full, height: g.full - g.solar } : { y: H - g.full, height: g.full }} transition={transition} />
      {/* solar portion, rises from the base */}
      <motion.rect x={g.x} width={W} fill={COLORS.lime} initial={reduced ? false : { y: H, height: 0 }} animate={on ? { y: H - g.solar, height: g.solar } : { y: H, height: 0 }} transition={transition} />
    </>
  );
}

/**
 * The 12-month usage chart every statement carries. Grid share in ink,
 * solar share in lime rising from the base once panels are in. With
 * `progress` the lime climbs with the scroll; otherwise `play` runs it once.
 */
export function UsageBars({
  play = false,
  reduced = false,
  progress,
  solarShare,
  delay = 0,
}: {
  play?: boolean;
  reduced?: boolean;
  /** Scroll progress 0 to 1. When set, the bars follow the scroll instead of a timer. */
  progress?: MotionValue<number>;
  /** 0 to 1, share of the monthly bar covered by solar */
  solarShare: number;
  delay?: number;
}) {
  const on = reduced || play;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${H + 14}`} className="h-auto w-full" role="img" aria-label="Twelve months of electricity use, with the share now covered by solar">
      {MONTHS.map((m, i) => {
        const full = SHAPE[i] * (H - 8);
        const g: BarGeometry = { x: i * (W + GAP), full, solar: full * solarShare };
        return (
          <g key={i}>
            {progress ? <ScrubBar g={g} progress={progress} /> : <TimedBar g={g} i={i} on={on} reduced={reduced} delay={delay} />}
            <text x={g.x + W / 2} y={H + 11} fontSize="7" textAnchor="middle" fill={COLORS.ink2} fontFamily="inherit">
              {m}
            </text>
          </g>
        );
      })}
      <line x1="0" y1={H} x2={WIDTH} y2={H} stroke={COLORS.rule} />
    </svg>
  );
}
