"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/content/projects";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";

/**
 * The caption chip over the footage: names the roof on screen and what it
 * saves. Commercial roofs show size and roof type instead, so industrial
 * visitors see themselves in the first viewport. Swaps as the reel moves.
 */
export function HeroCue({ project }: { project: Project | null }) {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="min-h-[2.25rem]" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {project ? (
          <motion.p
            key={project.id}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="inline-flex flex-wrap items-center gap-x-2 rounded-sm bg-ink/60 px-3 py-1.5 text-sm text-paper/85 backdrop-blur-sm tnum"
          >
            <span className="font-medium text-paper">{project.area}</span>
            {project.category === "commercial" ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.kwp} kWp</span>
                <span aria-hidden="true">·</span>
                <span>{project.roofMaterial.toLowerCase()}</span>
              </>
            ) : project.annualSavingsSgd !== null ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  saves <span className="stamp font-semibold">~S${project.annualSavingsSgd.toLocaleString("en-SG")}</span> a year
                </span>
              </>
            ) : null}
            {project.sample ? <span className="text-[0.65rem] font-medium uppercase tracking-wide text-alert">sample</span> : null}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
