"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";

/**
 * Counts from `from` to `to` once the element is in view (or immediately when
 * `start` is true). Renders the final value at once under reduced motion.
 */
export function CountUp({
  from = 0,
  to,
  duration = 1.2,
  delay = 0,
  format,
  decimals = 0,
  start,
  className,
}: {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  /** Client-only formatter. Server components pass `decimals` instead. */
  format?: (v: number) => string;
  decimals?: number;
  /** When provided, overrides in-view detection. */
  start?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();
  const shouldStart = start ?? inView;
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (reduced || !shouldStart) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [shouldStart, from, to, duration, delay, reduced]);

  const shown = reduced ? to : value;
  const text = format
    ? format(shown)
    : shown.toLocaleString("en-SG", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
