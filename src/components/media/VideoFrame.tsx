"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { MediaClip } from "@/content/media";
import { RoofTile } from "@/components/home/RoofTile";

/**
 * Muted, looping, in-view autoplay video. Without a source it renders a
 * labelled frame that says what to shoot, so layout can be reviewed now.
 * Reduced motion: poster only, no autoplay.
 */
export function VideoFrame({
  clip,
  ratio = "16/9",
  className,
  fill,
  dark,
  onTime,
}: {
  clip: MediaClip;
  ratio?: "16/9" | "4/3" | "1/1" | "9/16";
  className?: string;
  /** Absolute-position to fill the parent (hero background). */
  fill?: boolean;
  /** Placeholder drawn on ink instead of paper. */
  dark?: boolean;
  /** Current playback time in seconds, a few times a second. Drives the hero caption cues. */
  onTime?: (seconds: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.4 });
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (inView) {
      const p = el.play();
      if (p) p.catch(() => setFailed(true));
    } else {
      el.pause();
    }
  }, [inView, reduced]);

  const base = fill ? "absolute inset-0 h-full w-full" : "relative w-full max-w-full overflow-hidden rounded-md";

  if (!clip.src || failed) {
    return (
      <div
        ref={wrapRef}
        role="img"
        aria-label={`Video placeholder: ${clip.shotList}`}
        className={cn(base, dark ? "bg-ink" : "border border-rule bg-paper-2", className)}
        style={fill ? undefined : { aspectRatio: ratio }}
      >
        <svg aria-hidden="true" className={cn("absolute inset-0 h-full w-full", dark ? "text-paper/15" : "text-rule")} preserveAspectRatio="none">
          <defs>
            <pattern id={`hatch-${clip.id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="14" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#hatch-${clip.id})`} />
        </svg>
        {fill ? (
          <>
            {/* Ambient stand-in until footage arrives: the roof plan, faint, drawing itself. */}
            <div aria-hidden="true" className="absolute right-[-10%] top-1/2 w-[70vw] max-w-4xl -translate-y-1/2 opacity-20 sm:right-[-5%] sm:w-[55vw]">
              <RoofTile play reduced={reduced} className="w-full" />
            </div>
            <p className="absolute right-4 top-20 z-10 max-w-xs rounded-sm bg-paper/10 px-2.5 py-1.5 text-xs text-paper/80 backdrop-blur-sm sm:right-6 sm:top-24">
              Video placeholder: {clip.shotList}
            </p>
          </>
        ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <span className={cn("inline-flex h-14 w-14 items-center justify-center rounded-full border", dark ? "border-paper/40 text-paper" : "border-ink text-ink")}>
            <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />
          </span>
          <p className={cn("max-w-sm text-sm", dark ? "text-paper/75" : "text-ink-2")}>
            Video: {clip.shotList}
          </p>
          <p className={cn("text-xs", dark ? "text-paper/50" : "text-ink-2/70")}>{clip.durationHint}</p>
        </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn(base, "bg-ink", className)} style={fill ? undefined : { aspectRatio: ratio }}>
      <video
        ref={ref}
        src={clip.src}
        poster={clip.poster ?? undefined}
        muted
        loop
        playsInline
        preload={fill ? "auto" : "none"}
        autoPlay={!reduced && fill}
        onTimeUpdate={onTime ? (e) => onTime(e.currentTarget.currentTime) : undefined}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={clip.shotList}
      />
    </div>
  );
}
