"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { PROCESS } from "@/content/process";
import { usePrefersReducedMotion } from "@/lib/motion";
import { BEAD_LINE_PX, dotCentre, isReached, type Stop } from "@/lib/timeline";

const PHOTO_FOR_STEP: Record<number, string[]> = {
  1: ["Hugh measuring a roof with the customer", "switchboard and last three bills on the table"],
  2: ["roof layout drawing on a laptop", "printed quotation with the roof plan"],
  3: ["SP Group application form", "dual meter after the swap"],
  4: ["crew fixing rails on a tiled roof", "panels going up, inverter wiring"],
  5: ["customer with the monitoring app open", "first bill with the solar credit line"],
};

const MD_QUERY = "(min-width: 768px)";
const DOT_HALF_PX = 20;
const GOO_ID = "timeline-goo";

/**
 * Journey timeline: the step title sticks on the left with a dot on a
 * vertical track, the content scrolls on the right. A bead rides the track on
 * a fixed viewport line; each step dot rides with it while its title is stuck,
 * then stays behind, and a goo filter stretches the bead out of one dot and
 * melts it into the next.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { stops, height } = useStops(ref);
  const { scrollYProgress } = useScroll({ target: ref, offset: [`start ${BEAD_LINE_PX}px`, `end ${BEAD_LINE_PX}px`] });
  /* Identity transform keeps derived values in JS (Framer 13 scroll-timeline gotcha, see handoff). */
  const progress = useTransform(scrollYProgress, (v) => v);
  const bead = useTransform(progress, (p) => {
    if (stops.length === 0) return 0;
    return Math.min(Math.max(p * height, stops[0].from), stops[stops.length - 1].to);
  });

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal direction="left" className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>Five steps from survey to sun.</DiaText>
          </h2>
          <p className="mt-4 text-lg text-ink-2">The same order on every job, with the time each step takes.</p>
        </Reveal>

        <div ref={ref} className="relative mt-14">
          {/* track, beneath the dots */}
          <div aria-hidden="true" className="absolute left-[19px] top-0 h-full w-[2px] bg-rule md:left-[calc(33%-1px)]">
            <motion.div className="w-full bg-gradient-to-b from-forest via-lime to-lime/40" style={{ height: reduced ? "100%" : bead }} />
          </div>

          <ol className="grid gap-16 md:gap-24">
            {PROCESS.map((step) => (
              <li key={step.n} data-step className="relative grid gap-6 md:grid-cols-[33%_1fr] md:gap-12">
                {/* sticky title column */}
                <div data-title className="relative pl-14 md:sticky md:top-32 md:self-start md:pl-0 md:pr-14">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-paper md:left-auto md:right-[-20px]">
                    <span className={reduced ? "h-4 w-4 rounded-full bg-forest" : "h-1.5 w-1.5 rounded-full bg-rule"} />
                  </span>
                  <p className="font-display text-sm font-semibold text-ink-2 tnum">Step {step.n}</p>
                  <h3 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl">{step.title}</h3>
                  <p className="mt-3 text-sm text-ink-2 tnum">{step.duration}</p>
                </div>

                {/* content */}
                <Reveal direction="up" className="pl-14 md:pl-0">
                  <p className="max-w-xl text-lg text-ink-2">{step.body}</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {PHOTO_FOR_STEP[step.n].map((label) => (
                      <PhotoPlaceholder key={label} label={label} ratio="4/3" />
                    ))}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* bead and filled dots, above the rings */}
          {reduced || stops.length === 0 ? null : (
            <div aria-hidden="true" className="pointer-events-none absolute left-[20px] top-0 h-full w-16 -translate-x-1/2 md:left-[33%]">
              <GooFilter />
              <div className="relative h-full" style={{ filter: `url(#${GOO_ID})` }}>
                {stops.map((stop, i) => (
                  <Blob key={i} bead={bead} stop={stop} />
                ))}
                <motion.span className="absolute left-1/2 top-0 -ml-2 -mt-2 h-4 w-4 rounded-full bg-forest" style={{ y: bead }} />
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function Blob({ bead, stop }: { bead: MotionValue<number>; stop: Stop }) {
  const y = useTransform(bead, (b) => dotCentre(b, stop));
  const scale = useTransform(bead, (b) => (isReached(b, stop) ? 1 : 0));
  return <motion.span className="absolute left-1/2 top-0 -ml-2 -mt-2 h-4 w-4 rounded-full bg-forest" style={{ y, scale }} />;
}

function GooFilter() {
  return (
    <svg className="absolute h-0 w-0" focusable="false">
      <defs>
        <filter id={GOO_ID}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Where each step dot starts and stops riding, measured from the DOM.
 * Re-measured whenever the list resizes; below `md` titles do not stick, so
 * `from === to`.
 */
function useStops(ref: React.RefObject<HTMLDivElement | null>) {
  const [stops, setStops] = useState<Stop[]>([]);
  const [height, setHeight] = useState(0);

  const measure = useCallback(() => {
    const root = ref.current;
    if (!root) return;
    const sticky = window.matchMedia(MD_QUERY).matches;
    const next = Array.from(root.querySelectorAll<HTMLElement>("[data-step]")).map((li) => {
      const title = li.querySelector<HTMLElement>("[data-title]");
      const from = li.offsetTop + DOT_HALF_PX;
      const to = sticky && title ? li.offsetTop + li.offsetHeight - title.offsetHeight + DOT_HALF_PX : from;
      return { from, to };
    });
    setStops(next);
    setHeight(root.offsetHeight);
  }, [ref]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, measure]);

  return { stops, height };
}
