"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import type { Project } from "@/content/projects";
import { clampCentre, type Box } from "@/lib/map";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Half the floating card's size in px, for keeping it inside the map box. Rough: the card grows with a quote. */
const HALF = { w: 160, h: 176 } as const;
const HALF_FOCUS = { w: 272, h: 230 } as const;
/** Card widths in px, animated between on "View more". */
const WIDTH = { card: 320, focus: 544 } as const;

const CATEGORY_LABEL: Record<Project["category"], string> = {
  landed: "Landed home",
  commercial: "Commercial",
  ev: "EV charger",
};

function Facts({ project }: { project: Project }) {
  const size = project.kwp !== null ? `${project.kwp} kWp` : project.note;
  return (
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
  );
}

function Notes({ project }: { project: Project }) {
  return (
    <>
      {project.quote ? <p className="mt-2 border-t border-rule pt-2 text-xs text-ink-2">&ldquo;{project.quote}&rdquo;</p> : null}
      {project.sample ? <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-wide text-alert">Sample until real jobs are supplied</p> : null}
      {!project.photos ? <p className="mt-2 text-xs text-ink-2">Photo on the next shoot.</p> : null}
    </>
  );
}

/** The compact card: one frame and the facts, with the way into the focused view. */
function CardBody({ project, onViewMore }: { project: Project; onViewMore?: () => void }) {
  return (
    <>
      <ProjectPhoto project={project} index={2} ratio="16/9" sizes="320px" />
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="font-display text-base font-semibold leading-tight">{project.area}</p>
        <p className="text-xs text-ink-2 tnum">{project.year}</p>
      </div>
      <Facts project={project} />
      <Notes project={project} />
      {onViewMore ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewMore();
          }}
          className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-ink-2"
        >
          View more
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </>
  );
}

/**
 * The focused view: every frame of the roof, the facts beside the main
 * one, and a close control. The rest of the map has faded out around it.
 */
function FocusBody({ project, onClose }: { project: Project; onClose: () => void }) {
  const frames = project.photos ?? [];
  const others = frames.map((_, i) => i).filter((i) => i !== 2);
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-medium uppercase tracking-wide text-ink-2">{CATEGORY_LABEL[project.category]}</p>
          <p className="font-display text-xl font-semibold leading-tight">{project.area}</p>
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className="-mr-1 -mt-1 cursor-pointer rounded-full p-1.5 text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1.5fr_1fr]">
        <ProjectPhoto project={project} index={2} ratio="16/9" sizes="(min-width: 640px) 320px, 90vw" />
        <div>
          <p className="text-xs text-ink-2 tnum">{project.year}</p>
          <Facts project={project} />
          <Notes project={project} />
        </div>
      </div>
      {others.length > 0 ? (
        <ul className="mt-3 grid grid-cols-3 gap-2" aria-label="More frames">
          {others.map((i) => (
            <li key={frames[i].src}>
              <ProjectPhoto project={project} index={i} ratio="3/2" sizes="180px" />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 flex items-center justify-between border-t border-rule pt-3 text-xs">
        <span className="text-ink-2">Click outside to go back to the island.</span>
        <Link href="/projects" className="inline-flex items-center gap-1 font-medium">
          All projects
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}

/**
 * The card a marker opens. On large screens it grows out of the dot itself
 * (the dot gives way), clamped to the map box, and "View more" turns it into
 * the focused view while the other markers fade. Below lg it is a panel
 * under the map. `onClose` is only wired in the focused view.
 */
export function MarkerCard({
  project,
  floating,
  at,
  box,
  focused = false,
  onViewMore,
  onClose,
  onEnter,
  onLeave,
}: {
  project: Project;
  floating: boolean;
  /** Screen position of the marker in box px; the map can be zoomed and panned, so percent is not enough. */
  at?: { x: number; y: number };
  box?: Box;
  focused?: boolean;
  onViewMore?: () => void;
  onClose?: () => void;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const body = focused && onClose ? <FocusBody project={project} onClose={onClose} /> : <CardBody project={project} onViewMore={onViewMore} />;

  if (!floating || !at || !box) {
    return (
      <article className="w-full max-w-md rounded-md bg-paper p-3 text-ink shadow-sheet" aria-live="polite">
        {body}
      </article>
    );
  }

  /* The zoom keeps the marker where it was, so the card is centred on that spot and clamped to the box. */
  const centre = clampCentre(at, box, focused ? HALF_FOCUS : HALF);
  return (
    <div className={cn("absolute -translate-x-1/2 -translate-y-1/2", focused ? "z-20" : "z-10")} style={{ left: centre.x, top: centre.y }} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <motion.article
        key={project.id}
        data-marker-card
        initial={{ scale: 0.1, opacity: 0, width: WIDTH.card }}
        animate={{ scale: 1, opacity: 1, width: focused ? WIDTH.focus : WIDTH.card }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        style={{ transformOrigin: "50% 50%" }}
        className={cn("max-w-[calc(100vw-2rem)] rounded-md bg-paper text-ink shadow-sheet", focused ? "p-5" : "p-4")}
        aria-live="polite"
        onClick={(e) => e.stopPropagation()}
      >
        {body}
      </motion.article>
    </div>
  );
}
