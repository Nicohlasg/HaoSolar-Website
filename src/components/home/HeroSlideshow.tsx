"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import { AutoProgress } from "@/components/ui/AutoProgress";
import type { Project } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/motion";

const SLIDE_MS = 5000;
/* Full-bleed background behind a gradient: 82 halves the bytes and still looks clean. */
const HERO_QUALITY = 82;
/** Both directions of the crossfade use this, so no slide appears faster than another. */
const FADE_MS = 900;

/**
 * Auto-advancing slideshow of project photos behind the hero. Stands in
 * until hero footage exists and reports the project on screen so the hero
 * caption can follow it. The progress bar is handed to the parent through
 * `renderProgress`, so it can sit in the hero's bottom bar.
 *
 * The first slide is on screen from the start, so its blurred preview shows
 * immediately and sharpens when the full frame arrives. The slide after the
 * current one is already in the DOM, so its photo is decoded before its turn,
 * and the rotation only starts once the first photo has loaded.
 */
export function HeroSlideshow({ slides, onChange, renderProgress }: { slides: readonly Project[]; onChange: (p: Project) => void; renderProgress?: (node: ReactNode) => void }) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  const [ready, setReady] = useState(false);
  /* Only the slide on screen and the one after it are in the DOM, so they never compete for bandwidth. */
  const [mounted, setMounted] = useState<readonly number[]>([0, 1]);
  const reduced = usePrefersReducedMotion();

  /** Show slide `n` and put the one after it in the DOM, ready for the next crossfade. */
  const show = useCallback(
    (n: number) => {
      setI(n);
      setTick((t) => t + 1);
      const next = (n + 1) % slides.length;
      setMounted((m) => (m.includes(next) ? m : [...m, next]));
    },
    [slides.length],
  );

  useEffect(() => {
    if (reduced || !ready) return;
    const t = window.setInterval(() => show((i + 1) % slides.length), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [reduced, ready, slides.length, i, show]);

  const slide = slides[i];
  useEffect(() => onChange(slide), [slide, onChange]);
  useEffect(() => {
    renderProgress?.(
      <AutoProgress
        key={tick}
        count={slides.length}
        active={i}
        durationMs={SLIDE_MS}
        light
        className="w-32 sm:w-40"
        onSelect={show}
      />,
    );
  }, [renderProgress, tick, slides.length, i, show]);

  const onFirstLoad = useCallback(() => setReady(true), []);

  return (
    <div className="absolute inset-0">
      {slides.map((s, n) =>
        mounted.includes(n) ? (
        <motion.div
          key={s.id}
          className="absolute inset-0"
          initial={{ opacity: n === 0 ? 1 : 0 }}
          animate={{ opacity: n === i ? 1 : 0 }}
          /* Linear on both sides: the pair always sums to one, so the hero never dips or flares. */
          transition={{ duration: reduced ? 0 : FADE_MS / 1000, ease: "linear" }}
        >
          <ProjectPhoto
            project={s}
            fill
            dark
            /* The first is fetched at once; the next waits its turn in the queue. */
            priority={n === 0}
            quality={HERO_QUALITY}
            sizes="(min-width: 1280px) 1280px, 100vw"
            onLoad={n === 0 ? onFirstLoad : undefined}
          />
        </motion.div>
        ) : null,
      )}
    </div>
  );
}
