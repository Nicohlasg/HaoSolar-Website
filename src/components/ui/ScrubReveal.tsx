"use client";

import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

/**
 * Fades and slides its children in as `progress` crosses `window`. Scroll
 * backwards and it leaves the same way. Used for statement lines that must
 * arrive in step with the scroll, not on a timer.
 */
export function ScrubReveal({
  progress,
  window,
  children,
  className,
  x = -12,
  y = 0,
}: {
  progress: MotionValue<number>;
  window: [number, number];
  children: ReactNode;
  className?: string;
  x?: number;
  y?: number;
}) {
  const t = useTransform(progress, window, [0, 1], { clamp: true });
  const dx = useTransform(t, [0, 1], [x, 0]);
  const dy = useTransform(t, [0, 1], [y, 0]);
  return (
    <motion.div className={className} style={{ opacity: t, x: dx, y: dy }}>
      {children}
    </motion.div>
  );
}
