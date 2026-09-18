"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type InfiniteSliderProps = {
  children: ReactNode;
  /** Space between items, px. */
  gap?: number;
  /** Travel speed, px per second. */
  speed?: number;
  /** Speed while the pointer rests on the track; the change eases in. */
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

/** The track's rendered size, kept current on resize. */
function useSize(ref: React.RefObject<HTMLDivElement | null>): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setSize({ width: el.scrollWidth, height: el.scrollHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

/**
 * Motion-primitives' InfiniteSlider, ported to framer-motion and a
 * ResizeObserver. The children render twice and the track slides by half
 * its width on a loop, so the join is seamless. Hover changes the speed
 * smoothly instead of stopping. Under reduced motion the track stands still.
 */
export function InfiniteSlider({ children, gap = 16, speed = 100, speedOnHover, direction = "horizontal", reverse = false, className }: InfiniteSliderProps) {
  const reduced = usePrefersReducedMotion();
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(ref);
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const size = direction === "horizontal" ? width : height;
    if (!size) return;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;
    const distanceToTravel = Math.abs(to - from);
    const duration = distanceToTravel / currentSpeed;

    if (isTransitioning) {
      const remainingDistance = Math.abs(translation.get() - to);
      const controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: remainingDistance / currentSpeed,
        onComplete: () => {
          setIsTransitioning(false);
          setKey((k) => k + 1);
        },
      });
      return () => controls.stop();
    }
    const controls = animate(translation, [from, to], {
      ease: "linear",
      duration,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
      onRepeat: () => translation.set(from),
    });
    return () => controls.stop();
  }, [key, translation, currentSpeed, width, height, gap, isTransitioning, direction, reverse, reduced]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speedOnHover);
        },
        onHoverEnd: () => {
          setIsTransitioning(true);
          setCurrentSpeed(speed);
        },
      }
    : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{ ...(direction === "horizontal" ? { x: translation } : { y: translation }), gap: `${gap}px`, flexDirection: direction === "horizontal" ? "row" : "column" }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
