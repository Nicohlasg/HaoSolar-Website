"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ProjectPhoto } from "@/components/ui/ProjectPhoto";
import { PROJECTS, type Project, type ProjectCategory } from "@/content/projects";
import { AutoProgress } from "@/components/ui/AutoProgress";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

const CATEGORY_LABEL = { landed: "Landed home", commercial: "Commercial", ev: "EV charger" } as const;
const AUTO_MS = 5500;
/* Panel swap: slow enough to read as one move, photo zooms once the panel has opened. */
const SWAP_S = 1.1;
const ZOOM_S = 2.4;
const OPEN_GROW = 5;
const GAP_REM = 0.75;

/**
 * Large horizontal panels, one open at a time. Auto-advances every 5.5 s,
 * hover or tap opens a panel and pauses. Mobile: stacked, same behaviour.
 * Panels grow with `flex-grow`, never a layout transform, so text never
 * stretches; the detail block keeps a fixed width and is clipped instead.
 */
export function ProjectShowcase({
  category = "landed",
  title = "Recent roofs.",
  lede = "Hover or tap a roof for the numbers.",
  tone = "paper",
}: {
  category?: ProjectCategory;
  title?: string;
  lede?: string;
  tone?: "paper" | "plain";
}) {
  /* Photographed jobs lead; unphotographed ones fill in only while there are fewer than three with photos. */
  const inCategory = PROJECTS.filter((p) => p.category === category);
  const shot = inCategory.filter((p) => p.photos);
  const items = (shot.length >= 3 ? shot : inCategory).slice(0, 5);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || reduced) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % items.length), AUTO_MS);
    return () => window.clearInterval(t);
  }, [paused, reduced, items.length, active]);


  return (
    <section className={cn("py-20 sm:py-24", tone === "paper" && "border-y border-rule bg-paper-2/60")}>
      <Container>
        <Reveal direction="left" className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
              <DiaText>{title}</DiaText>
            </h2>
            <p className="mt-3 text-ink-2">{lede}</p>
          </div>
          <Link href={`/projects?type=${category}`} className="font-medium">
            All {category === "commercial" ? "commercial" : "landed"} projects
          </Link>
        </Reveal>

        <div
          className="@container mt-10 flex h-[34rem] flex-col gap-3 sm:h-[30rem] sm:flex-row"
          style={{ "--open-w": openWidth(items.length) } as React.CSSProperties}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="list"
        >
          {items.map((p, i) => (
            <Panel key={p.id} project={p} active={active === i} onActivate={() => setActive(i)} reduced={reduced} />
          ))}
        </div>
        <AutoProgress variant="morph" count={items.length} active={active} durationMs={AUTO_MS} paused={paused} onSelect={setActive} className="mt-4 -ml-2" />
      </Container>
    </section>
  );
}

/** Width of the open panel once it has finished growing, so its text is laid out once and never rewraps. */
function openWidth(count: number): string {
  const gaps = (count - 1) * GAP_REM;
  return `calc((100cqw - ${gaps}rem) * ${OPEN_GROW} / ${OPEN_GROW + count - 1})`;
}

function Panel({ project, active, onActivate, reduced }: { project: Project; active: boolean; onActivate: () => void; reduced: boolean }) {
  return (
    <motion.div
      role="listitem"
      className="relative min-h-0 basis-0 cursor-pointer overflow-hidden rounded-md border border-rule bg-paper-2"
      initial={false}
      animate={{ flexGrow: active ? OPEN_GROW : 1 }}
      transition={reduced ? { duration: 0 } : { duration: SWAP_S, ease: EASE_OUT }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      aria-current={active ? "true" : undefined}
      aria-label={`${CATEGORY_LABEL[project.category]}, ${project.area}`}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: active && !reduced ? 1.06 : 1 }}
        transition={active ? { duration: ZOOM_S, ease: EASE_OUT, delay: SWAP_S * 0.6 } : { duration: SWAP_S, ease: EASE_OUT }}
      >
        <ProjectPhoto project={project} index={1} fill sizes="(min-width: 640px) 60vw, 100vw" />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

      {/* collapsed label */}
      <motion.div
        className="absolute inset-x-0 bottom-0 p-4 text-paper sm:bottom-auto sm:left-0 sm:top-0 sm:h-full sm:w-14 sm:p-0"
        initial={false}
        animate={{ opacity: active ? 0 : 1 }}
        transition={{ duration: reduced ? 0 : 0.5, ease: EASE_OUT, delay: active || reduced ? 0 : SWAP_S * 0.5 }}
      >
        <span className="block text-lg font-semibold sm:absolute sm:bottom-4 sm:left-1/2 sm:origin-bottom-left sm:-rotate-90 sm:whitespace-nowrap sm:pl-2 sm:text-base">
          {project.area}
        </span>
      </motion.div>

      {/* expanded detail */}
      <motion.div
        className="absolute bottom-0 left-0 grid w-full gap-2 p-5 text-paper sm:w-(--open-w) sm:p-7"
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
        transition={reduced ? { duration: 0 } : { duration: active ? 0.7 : 0.35, ease: EASE_OUT, delay: active ? SWAP_S * 0.55 : 0 }}
        aria-hidden={!active}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-paper/70">{CATEGORY_LABEL[project.category]}</p>
        <p className="font-display text-3xl font-semibold leading-none sm:text-4xl">{project.area}</p>
        <dl className="mt-2 grid max-w-md grid-cols-2 gap-x-6 gap-y-1 text-sm text-paper/85 tnum sm:grid-cols-4">
          <div>
            <dt className="text-xs text-paper/60">Capacity</dt>
            <dd>{project.kwp !== null ? `${project.kwp} kWp` : project.category === "ev" ? "Charger" : "To confirm"}</dd>
          </div>
          <div>
            <dt className="text-xs text-paper/60">Roof</dt>
            <dd>{project.roofMaterial}</dd>
          </div>
          <div>
            <dt className="text-xs text-paper/60">Yearly saving</dt>
            <dd>{project.annualSavingsSgd !== null ? `~S$${project.annualSavingsSgd.toLocaleString("en-SG")}` : "n/a"}</dd>
          </div>
          <div>
            <dt className="text-xs text-paper/60">Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
        <p className="text-sm text-paper/75">{project.note}</p>
        {project.quote ? <p className="mt-2 max-w-md text-sm text-paper/85">“{project.quote}”</p> : null}
        {project.sample ? <p className="text-xs text-lime">Sample entry, photo to come</p> : null}
      </motion.div>
    </motion.div>
  );
}
