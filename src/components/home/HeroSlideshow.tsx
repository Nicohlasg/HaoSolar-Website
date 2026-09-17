"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import { AutoProgress } from "@/components/ui/AutoProgress";
import type { Project } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/motion";

const SLIDE_MS = 5000;

/**
 * Auto-advancing slideshow of project photos behind the hero. Stands in
 * until hero footage exists and reports the project on screen so the hero
 * caption can follow it. The progress bar is handed to the parent through
 * `renderProgress`, so it can sit in the hero's bottom bar.
 */
export function HeroSlideshow({ slides, onChange, renderProgress }: { slides: readonly Project[]; onChange: (p: Project) => void; renderProgress?: (node: ReactNode) => void }) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % slides.length);
      setTick((n) => n + 1);
    }, SLIDE_MS);
    return () => window.clearInterval(t);
  }, [reduced, slides.length, i]);

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
        onSelect={(n) => {
          setI(n);
          setTick((t) => t + 1);
        }}
      />,
    );
  }, [renderProgress, tick, slides.length, i]);

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <ProjectPhoto project={slide} fill dark priority={i === 0} sizes="100vw" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
