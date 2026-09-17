"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { StatementLine } from "@/components/ui/StatementLine";
import { ScrubReveal } from "@/components/ui/ScrubReveal";
import { DiaText } from "@/components/ui/DiaText";
import { STATEMENT_CHAPTERS, STATEMENT_HEADLINE, STATEMENT_PROMISES } from "@/content/statement";
import { chapterAt, CTA_WINDOW, HINT_WINDOW, promiseWindow } from "@/lib/statement";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { StatementCard } from "./StatementCard";

function ChapterLine({ index }: { index: number }) {
  const chapter = STATEMENT_CHAPTERS[Math.min(index, STATEMENT_CHAPTERS.length - 1)];
  return (
    <div className="mt-3 min-h-[4rem] sm:mt-6 sm:min-h-[6.5rem]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={chapter.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
          <p className="text-xs font-medium uppercase tracking-wide text-forest">
            0{index + 1} · {chapter.kicker}
          </p>
          <p className="mt-1 text-base text-ink-2 sm:mt-2 sm:text-lg">{chapter.line}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Promises({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  return (
    <div className={cn("border-t border-rule pt-2", className)}>
      {STATEMENT_PROMISES.map((l, i) => (
        <ScrubReveal key={l.label} progress={progress} window={promiseWindow(i, STATEMENT_PROMISES.length)}>
          <StatementLine label={l.label} value={l.value} toConfirm={l.toConfirm} />
        </ScrubReveal>
      ))}
      <ScrubReveal progress={progress} window={CTA_WINDOW} x={0} y={8} className="mt-6">
        <Button href="/calculator" variant="secondary">
          Run it for your roof
        </Button>
      </ScrubReveal>
    </div>
  );
}

/** Scroll rail beside the card: a perforated edge that fills lime with progress. */
function Rail({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden="true" className="absolute -left-4 top-0 bottom-0 hidden w-px bg-rule sm:block">
      <motion.div className="absolute inset-x-0 top-0 bg-lime" style={{ height: "100%", scaleY: progress, originY: 0 }} />
    </div>
  );
}

/** "Scroll" and a bouncing chevron, gone as soon as the visitor moves. */
function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, HINT_WINDOW, [1, 0], { clamp: true });
  return (
    <motion.div aria-hidden="true" style={{ opacity }} className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-wide text-ink-2">
      <span>Scroll to rewrite the bill</span>
      <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </motion.div>
  );
}

/**
 * The bill, rewritten by scrolling. The section is tall; a full-viewport
 * stage sticks inside it while the scroll drives every moment on the card:
 * the roof draws, panels land, the total falls, the promises stamp in, then
 * the finished bill holds for the last fifth of the scroll.
 * Reduced motion: no sticky stage, everything in its final state.
 */
export function StatementSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  /*
   * Framer 13 hands values derived from scrollYProgress to a native CSS
   * scroll timeline. A keyframe window like [0.42, 0.66] then gets browser
   * synthesised 0% and 100% frames and every reveal fades back out at the
   * end. Passing progress through a function transform keeps it in JS.
   */
  const scrubbed = useTransform(scrollYProgress, (v) => v);
  const still = useMotionValue(1);
  const progress = reduced ? still : scrubbed;
  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setChapter(chapterAt(v));
    ref.current?.setAttribute("data-progress", v.toFixed(3));
  });

  return (
    <section ref={ref} className={cn("relative border-b border-rule bg-paper-2/60", reduced ? "py-16 sm:py-24" : "h-[300svh]")}>
      <div className={cn(!reduced && "sticky top-0 flex h-[100svh] items-start overflow-hidden pt-[4.5rem] sm:items-center sm:pt-0")}>
        <Container className="grid w-full items-center gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold sm:text-4xl md:text-[2.75rem]">
              <DiaText>{STATEMENT_HEADLINE}</DiaText>
            </h2>
            <ChapterLine index={reduced ? STATEMENT_CHAPTERS.length - 1 : chapter} />
            <Promises progress={progress} className="mt-4 hidden lg:block" />
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl">
              <Rail progress={progress} />
              <StatementCard progress={progress} />
            </div>
          </div>
        </Container>
        {reduced ? null : <ScrollHint progress={progress} />}
      </div>
      {/* Below lg the stage has no room for the promises; they follow the card instead. */}
      <Container className="pb-16 lg:hidden">
        <Promises progress={progress} className="max-w-md" />
      </Container>
    </section>
  );
}
