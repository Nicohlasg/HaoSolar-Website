"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/config/theme";
import { formatSgd } from "@/lib/format";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";

/** Cumulative net savings over the system life, low and high price cases. Pure SVG, animates on change. */
export function SavingsChart({ low, high }: { low: number[]; high: number[] }) {
  const reduced = usePrefersReducedMotion();
  const W = 640;
  const H = 260;
  const padL = 56;
  const padB = 28;
  const padT = 12;
  const years = low.length;
  const all = [...low, ...high];
  const min = Math.min(0, ...all);
  const max = Math.max(...all, 1);
  const x = (i: number) => padL + (i / (years - 1)) * (W - padL - 12);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);
  const path = (s: number[]) => s.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const zeroY = y(0);
  const breakeven = low.findIndex((v) => v >= 0);
  const ticks = [min, 0, max / 2, max].filter((v, i, a) => a.indexOf(v) === i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Cumulative savings over the system life">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={padL} x2={W - 12} y1={y(t)} y2={y(t)} stroke={COLORS.rule} strokeDasharray={t === 0 ? undefined : "3 3"} />
          <text x={padL - 8} y={y(t) + 4} fontSize="11" textAnchor="end" fill={COLORS.ink2} fontFamily="inherit">
            {formatSgd(t).replace("S$", "")}
          </text>
        </g>
      ))}
      {[0, 5, 10, 15, 20, years - 1].map((i) => (
        <text key={i} x={x(i)} y={H - 8} fontSize="11" textAnchor="middle" fill={COLORS.ink2} fontFamily="inherit">
          Y{i + 1}
        </text>
      ))}
      <motion.path d={`${path(high)} L${x(years - 1)} ${zeroY} L${x(0)} ${zeroY} Z`} fill={COLORS.lime} opacity="0.22" initial={false} animate={{ d: `${path(high)} L${x(years - 1)} ${zeroY} L${x(0)} ${zeroY} Z` }} transition={{ duration: 0.6, ease: EASE_OUT }} />
      <motion.path d={path(high)} fill="none" stroke={COLORS.forest} strokeWidth="2" strokeDasharray="5 4" initial={false} animate={{ d: path(high) }} transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }} />
      <motion.path d={path(low)} fill="none" stroke={COLORS.ink} strokeWidth="2.5" initial={false} animate={{ d: path(low) }} transition={reduced ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT }} />
      {breakeven >= 0 ? (
        <g>
          <line x1={x(breakeven)} x2={x(breakeven)} y1={padT} y2={H - padB} stroke={COLORS.ink} strokeDasharray="2 3" opacity="0.5" />
          <text x={x(breakeven) + 6} y={padT + 12} fontSize="11" fill={COLORS.ink} fontFamily="inherit">
            breakeven, year {breakeven + 1}
          </text>
        </g>
      ) : null}
      <g fontSize="11" fontFamily="inherit">
        <line x1={W - 170} x2={W - 150} y1={padT + 30} y2={padT + 30} stroke={COLORS.ink} strokeWidth="2.5" />
        <text x={W - 144} y={padT + 34} fill={COLORS.ink2}>low price</text>
        <line x1={W - 90} x2={W - 70} y1={padT + 30} y2={padT + 30} stroke={COLORS.forest} strokeWidth="2" strokeDasharray="5 4" />
        <text x={W - 64} y={padT + 34} fill={COLORS.ink2}>high price</text>
      </g>
    </svg>
  );
}
