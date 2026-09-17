"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * Mouse parallax for the hero: the background layer drifts a few pixels
 * against the cursor, the text layer with it, so the section reads as
 * depth rather than a flat card. Pointer devices only; still under
 * reduced motion and on touch.
 */
export function ParallaxLayers({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(sx, (v) => v * -14);
  const bgY = useTransform(sy, (v) => v * -10);
  const fgX = useTransform(sx, (v) => v * 8);
  const fgY = useTransform(sy, (v) => v * 6);

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const [bg, overlay, fg] = Array.isArray(children) ? children : [children];
  return (
    <section ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="absolute inset-[-3%]" style={{ x: bgX, y: bgY }}>
        {bg}
      </motion.div>
      {overlay}
      <motion.div style={{ x: fgX, y: fgY }}>{fg}</motion.div>
    </section>
  );
}
