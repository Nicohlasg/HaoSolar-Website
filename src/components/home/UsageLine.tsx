"use client";

import { useState, type PointerEvent } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { COLORS } from "@/config/theme";
import { formatSgd } from "@/lib/format";
import { BARS_WINDOW, ROOF_WINDOW } from "@/lib/statement";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** Relative monthly usage shape, so the chart looks like a real year. Illustrative. */
const SHAPE = [0.92, 0.88, 1.0, 1.05, 1.08, 1.0, 0.97, 0.95, 0.9, 0.93, 0.9, 0.96];
const W = 216;
const BASE = 64;
const TOP = 10;
const PAD = 8;
const STEP = (W - PAD * 2) / (MONTHS.length - 1);

const xAt = (i: number) => PAD + i * STEP;
const yAt = (i: number) => BASE - SHAPE[i] * (BASE - TOP);
const pts = (y: (i: number) => number) => MONTHS.map((_, i) => `${xAt(i).toFixed(1)} ${y(i).toFixed(1)}`);

const GRID_PATH = `M ${pts(yAt).join(" L ")}`;

/** Solar area at scrub `t`, from the baseline up to the share the roof covers. */
function solarPath(t: number, share: number): string {
  const top = pts((i) => BASE - (BASE - yAt(i)) * share * t);
  return `M ${xAt(0).toFixed(1)} ${BASE} L ${top.join(" L ")} L ${xAt(MONTHS.length - 1).toFixed(1)} ${BASE} Z`;
}

function solarLine(t: number, share: number): string {
  return `M ${pts((i) => BASE - (BASE - yAt(i)) * share * t).join(" L ")}`;
}

/**
 * Twelve months of electricity as a line: the grid line is what the house
 * draws, the lime area beneath it is the part the roof now covers. The area
 * rises with the scroll as panels land. Hover or touch a month for figures.
 */
export function UsageLine({ progress, solarShare, monthlyBillSgd }: { progress: MotionValue<number>; solarShare: number; monthlyBillSgd: number }) {
  const t = useTransform(progress, BARS_WINDOW, [0, 1], { clamp: true });
  const draw = useTransform(progress, ROOF_WINDOW, [0, 1], { clamp: true });
  const area = useTransform(t, (v) => solarPath(v, solarShare));
  const line = useTransform(t, (v) => solarLine(v, solarShare));
  const [hover, setHover] = useState<number | null>(null);
  const [scrub, setScrub] = useState(() => t.get());
  useMotionValueEvent(t, "change", (v) => {
    if (hover !== null) setScrub(v);
  });

  function onMove(e: PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.round(Math.min(Math.max((x - PAD) / STEP, 0), MONTHS.length - 1)));
    setScrub(t.get());
  }

  const gridSgd = hover === null ? 0 : monthlyBillSgd * SHAPE[hover];
  const roofSgd = gridSgd * solarShare * scrub;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${BASE + 16}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label="Twelve months of electricity use as a line, with the share now covered by solar shaded beneath it"
        onPointerMove={onMove}
        onPointerDown={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <line x1={PAD} y1={BASE} x2={W - PAD} y2={BASE} stroke={COLORS.rule} />
        <motion.path d={area} fill={COLORS.lime} opacity={0.9} />
        <motion.path d={line} fill="none" stroke={COLORS.ink} strokeWidth="1" strokeDasharray="2 2" />
        <motion.path d={GRID_PATH} fill="none" stroke={COLORS.ink} strokeWidth="1.5" strokeLinejoin="round" style={{ pathLength: draw, opacity: draw }} />
        {hover !== null ? (
          <g>
            <line x1={xAt(hover)} y1={TOP - 4} x2={xAt(hover)} y2={BASE} stroke={COLORS.ink2} strokeDasharray="1.5 2" />
            <circle cx={xAt(hover)} cy={yAt(hover)} r="2.5" fill={COLORS.paper} stroke={COLORS.ink} strokeWidth="1.5" />
          </g>
        ) : null}
        {MONTHS.map((m, i) => (
          <text key={m} x={xAt(i)} y={BASE + 11} fontSize="6.5" textAnchor="middle" fill={hover === i ? COLORS.ink : COLORS.ink2} fontFamily="inherit">
            {m.charAt(0)}
          </text>
        ))}
      </svg>
      {hover !== null ? (
        <div
          role="status"
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-sm border border-rule bg-paper px-2 py-1 text-xs shadow-sheet tnum"
          style={{ left: `${(xAt(hover) / W) * 100}%` }}
        >
          <span className="font-medium">{MONTHS[hover]}</span> · {formatSgd(gridSgd)} from the grid
          {roofSgd > 0 ? <span className="text-forest"> · {formatSgd(roofSgd)} from your roof</span> : null}
        </div>
      ) : null}
    </div>
  );
}
