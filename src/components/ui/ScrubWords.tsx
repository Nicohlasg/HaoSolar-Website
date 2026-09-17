"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

function Word({ word, progress, window: win, last }: { word: string; progress: MotionValue<number>; window: [number, number]; last: boolean }) {
  const t = useTransform(progress, win, [0, 1], { clamp: true });
  const y = useTransform(t, [0, 1], ["110%", "0%"]);
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span className="inline-block" style={{ y, opacity: t }}>
        {word}
        {last ? "" : " "}
      </motion.span>
    </span>
  );
}

/**
 * Text that rises word by word out of a clipped line as `progress` crosses
 * `window`. Each word gets its own slice of the window, so the line reads
 * as a staggered lift rather than a fade. Scroll back and it sinks away.
 */
export function ScrubWords({ text, progress, window: win, className, stagger = 0.5 }: { text: string; progress: MotionValue<number>; window: [number, number]; className?: string; stagger?: number }) {
  const words = text.split(" ");
  const span = win[1] - win[0];
  // Each word's window starts a little later; `stagger` is the share of the block window spent staggering.
  const step = (span * stagger) / Math.max(1, words.length - 1);
  const len = span * (1 - stagger);
  return (
    <span className={cn("inline", className)}>
      {words.map((w, i) => (
        <Word key={`${i}-${w}`} word={w} progress={progress} window={[win[0] + i * step, win[0] + i * step + len]} last={i === words.length - 1} />
      ))}
    </span>
  );
}
