"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * A number tied to scroll. Maps `progress` across `window` onto `from` to `to`
 * and renders the formatted value without re-rendering React on every frame.
 */
export function ScrubNumber({
  progress,
  window,
  from,
  to,
  format,
  className,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  from: number;
  to: number;
  format: (v: number) => string;
  className?: string;
}) {
  const value = useTransform(progress, window, [from, to], { clamp: true });
  const text = useTransform(value, format);
  return <motion.span className={className}>{text}</motion.span>;
}
