"use client";

import { motion } from "framer-motion";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import type { Project } from "@/content/projects";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Half the floating card's height, for keeping it inside the map box. */
const CARD_HALF_H = "11rem";

const CATEGORY_LABEL: Record<Project["category"], string> = {
  landed: "Landed home",
  commercial: "Commercial",
  ev: "EV charger",
};

function CardBody({ project }: { project: Project }) {
  const size = project.kwp !== null ? `${project.kwp} kWp` : project.note;
  return (
    <>
      <ProjectPhoto project={project} index={2} ratio="16/9" sizes="320px" />
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="font-display text-base font-semibold leading-tight">{project.area}</p>
        <p className="text-xs text-ink-2 tnum">{project.year}</p>
      </div>
      <dl className="mt-1.5 text-xs">
        <div className="leader py-0.5">
          <dt className="text-ink-2">{CATEGORY_LABEL[project.category]}</dt>
          <dd>{size}</dd>
        </div>
        {project.category !== "ev" ? (
          <div className="leader py-0.5">
            <dt className="text-ink-2">Roof</dt>
            <dd>{project.roofMaterial}</dd>
          </div>
        ) : null}
        {project.annualSavingsSgd !== null ? (
          <div className="leader py-0.5">
            <dt className="text-ink-2">Saves a year</dt>
            <dd className="stamp font-semibold">~S${project.annualSavingsSgd.toLocaleString("en-SG")}</dd>
          </div>
        ) : null}
      </dl>
      {project.quote ? <p className="mt-2 border-t border-rule pt-2 text-xs text-ink-2">&ldquo;{project.quote}&rdquo;</p> : null}
      {project.sample ? <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wide text-alert">Sample until real jobs are supplied</p> : null}
      {!project.photos ? <p className="mt-2 text-xs text-ink-2">Photo on the next shoot.</p> : null}
    </>
  );
}

/**
 * The card a marker opens: a photo of that roof or charger (placeholder
 * until Hugh supplies it), the facts, and the review line if there is one.
 * On large screens the map zooms in around the marker, the dot gives way and
 * the card grows out beside it, closing when the cursor leaves it. Below lg
 * it is a panel under the map.
 */
export function MarkerCard({
  project,
  floating,
  at,
  side = "right",
  onEnter,
  onLeave,
}: {
  project: Project;
  floating: boolean;
  /** Screen position of the marker in box px; the map can be zoomed and panned, so percent is not enough. */
  at?: { x: number; y: number };
  side?: "left" | "right";
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  if (!floating || !at) {
    return (
      <article className="w-full max-w-md rounded-md bg-paper p-3 text-ink shadow-sheet" aria-live="polite">
        <CardBody project={project} />
      </article>
    );
  }

  /* The zoom keeps the marker where it was, so the card sits beside that spot, clamped vertically to the box. */
  const top = `clamp(${CARD_HALF_H}, ${at.y}px, calc(100% - ${CARD_HALF_H}))`;
  return (
    <div
      className={cn("absolute z-10 -translate-y-1/2", side === "right" ? "translate-x-5" : "-translate-x-[calc(100%+1.25rem)]")}
      style={{ left: at.x, top }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <motion.article
        key={project.id}
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 }}
        style={{ transformOrigin: side === "right" ? "left center" : "right center" }}
        className="w-80 rounded-md bg-paper p-4 text-ink shadow-sheet"
        aria-live="polite"
      >
        <CardBody project={project} />
      </motion.article>
    </div>
  );
}
