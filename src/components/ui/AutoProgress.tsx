"use client";

import { motion } from "framer-motion";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const MORPH_MS = 600;

/**
 * Progress for auto-advancing components, one segment per item; the active
 * segment fills over `durationMs`. Remount (via `key`) to restart the fill.
 *
 * `bars` (default): equal thin segments.
 * `morph`: dots, the active one stretched into a bar that fills; moving on
 * shrinks it back to a dot while the next dot stretches.
 */
export function AutoProgress({
  count,
  active,
  durationMs,
  paused,
  onSelect,
  className,
  light,
  variant = "bars",
}: {
  count: number;
  active: number;
  durationMs: number;
  paused?: boolean;
  onSelect?: (i: number) => void;
  className?: string;
  light?: boolean;
  variant?: "bars" | "morph";
}) {
  const reduced = usePrefersReducedMotion();
  if (variant === "morph") {
    return (
      <div className={cn("flex items-center", className)} role="tablist" aria-label="Slides">
        {Array.from({ length: count }).map((_, i) => (
          <MorphSegment
            key={i}
            index={i}
            count={count}
            active={i === active}
            done={i < active}
            durationMs={durationMs}
            paused={paused}
            reduced={reduced}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={cn("flex gap-1.5", className)} role="tablist" aria-label="Slides">
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === active;
        const done = i < active;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={`Slide ${i + 1} of ${count}`}
            onClick={onSelect ? () => onSelect(i) : undefined}
            className={cn("relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full", light ? "bg-paper/25" : "bg-rule")}
          >
            <motion.span
              key={`${i}-${isActive}`}
              className={cn("absolute inset-y-0 left-0 rounded-full", light ? "bg-paper" : "bg-ink")}
              initial={{ width: done ? "100%" : "0%" }}
              animate={{ width: isActive || done ? "100%" : "0%" }}
              transition={isActive && !reduced ? { duration: durationMs / 1000, ease: "linear" } : { duration: 0 }}
            />
          </button>
        );
      })}
    </div>
  );
}

function MorphSegment({
  index,
  count,
  active,
  done,
  durationMs,
  paused,
  reduced,
  onSelect,
}: {
  index: number;
  count: number;
  active: boolean;
  done: boolean;
  durationMs: number;
  paused?: boolean;
  reduced: boolean;
  onSelect?: (i: number) => void;
}) {
  /* Hovering holds the slide, so the bar shows full instead of freezing mid-fill. */
  const isHeld = paused || reduced;
  const fillTransition = active && !isHeld ? { duration: durationMs / 1000, ease: "linear" as const } : { duration: 0 };
  /* The button is the 24 px touch target; the dot or bar inside is the visual. */
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={`Slide ${index + 1} of ${count}`}
      onClick={onSelect ? () => onSelect(index) : undefined}
      className="flex h-6 min-w-6 cursor-pointer items-center justify-center"
    >
      <motion.span
        className={cn("relative block h-2 overflow-hidden rounded-full", done ? "bg-ink" : "bg-rule")}
        initial={false}
        animate={{ width: active ? "3.5rem" : "0.5rem" }}
        transition={reduced ? { duration: 0 } : { duration: MORPH_MS / 1000, ease: EASE_OUT }}
      >
        {active ? (
          <motion.span
            key={isHeld ? "held" : "running"}
            className="absolute inset-y-0 left-0 rounded-full bg-ink"
            initial={{ width: isHeld ? "100%" : "0%" }}
            animate={{ width: "100%" }}
            transition={fillTransition}
          />
        ) : null}
      </motion.span>
    </button>
  );
}
