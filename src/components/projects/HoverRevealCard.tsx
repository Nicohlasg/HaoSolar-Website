"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import type { Project } from "@/content/projects";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const CATEGORY_LABEL = { landed: "Landed home", commercial: "Commercial", ev: "EV charger" } as const;

/**
 * Photo card. Hover (or tap, or keyboard focus) blurs the photo behind a
 * paper overlay and reveals the job's statement lines and, when there is
 * one, the customer's Google quote.
 */
export function HoverRevealCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const reduced = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className="group relative overflow-hidden rounded-md"
      initial="rest"
      animate={open ? "hover" : "rest"}
      whileHover="hover"
      whileFocus="hover"
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${CATEGORY_LABEL[project.category]} in ${project.area}. Activate to show details.`}
      style={{ cursor: "pointer" }}
    >
      <motion.div variants={{ rest: { scale: 1 }, hover: { scale: reduced ? 1 : 1.04 } }} transition={{ duration: 0.6, ease: EASE_OUT }}>
        <ProjectPhoto project={project} ratio="3/2" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="rounded-md" />
      </motion.div>

      {/* resting caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/70 to-transparent p-4 text-paper">
        <Heading className="text-lg font-semibold leading-tight">{project.area}</Heading>
        <span className="text-sm tnum">{capacityTag(project)}</span>
      </div>

      {/* reveal */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end bg-paper/85 p-4 text-ink backdrop-blur-md"
        variants={{ rest: { opacity: 0, y: reduced ? 0 : 12 }, hover: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
        aria-hidden={!open}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-ink-2">{CATEGORY_LABEL[project.category]}</p>
        <p className="mt-1 text-xl font-semibold leading-tight">{project.area}</p>
        <dl className="mt-3 text-sm">
          <div className="leader py-1">
            <dt className="text-ink-2">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div className="leader py-1">
            <dt className="text-ink-2">System</dt>
            <dd>{project.kwp !== null ? `${project.kwp} kWp` : "Charger"}</dd>
          </div>
          <div className="leader py-1">
            <dt className="text-ink-2">Roof</dt>
            <dd className="max-w-[60%] text-right">{project.note}</dd>
          </div>
        </dl>
        {project.quote ? <blockquote className="mt-3 border-t border-rule pt-3 text-sm">“{project.quote}”</blockquote> : null}
        {project.sample ? <p className={cn("mt-2 text-xs text-alert")}>Sample entry</p> : null}
      </motion.div>
    </motion.article>
  );
}

/** Corner tag: system size when known, "EV" for charger-only jobs, blank until Hugh confirms the size. */
function capacityTag(project: Project): string {
  if (project.kwp !== null) return `${project.kwp} kWp`;
  return project.category === "ev" ? "EV" : "";
}
