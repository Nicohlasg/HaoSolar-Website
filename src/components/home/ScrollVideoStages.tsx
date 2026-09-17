"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useScroll, useSpring } from "framer-motion";
import { ChevronRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { VideoFrame } from "@/components/media/VideoFrame";
import { MEDIA_SECTIONS } from "@/content/media";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Cinematic scroll: the clip sits full-screen and sticky while three
 * chapters of copy scroll past; the clip crossfades per chapter. A floating
 * pill at the bottom shows the chapter name and a ring that fills with
 * scroll progress. Pattern from the "scroll-triggered video hero", in the
 * brand's colours. Reduced motion: chapters stack as plain sections.
 */
const CHAPTER_CTA = [
  { label: "Book the free survey", href: "/contact" },
  { label: "See recent roofs", href: "/projects" },
  { label: "Run the calculator", href: "/calculator" },
] as const;

const textContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const textReveal = { hidden: { y: "100%", opacity: 0 }, visible: { y: "0%", opacity: 1, transition: { duration: 0.8, ease: EASE_OUT } } };
const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: "easeOut" as const } } };

function FilmGrain() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 opacity-[0.07] mix-blend-overlay">
      <div
        className="absolute inset-0 h-full w-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

function ChapterNav({ activeIndex, progress, visible }: { activeIndex: number; progress: ReturnType<typeof useScroll>["scrollYProgress"]; visible: boolean }) {
  const smooth = useSpring(progress, { stiffness: 100, damping: 30 });
  const chapter = MEDIA_SECTIONS[activeIndex];
  return (
    <motion.div
      className={cn(
        "fixed bottom-20 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-paper/10 bg-ink/85 p-2 pl-5 shadow-2xl backdrop-blur-xl sm:bottom-8",
        !visible && "pointer-events-none",
      )}
      initial={false}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      aria-hidden={!visible}
    >
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-paper/50">Chapter 0{activeIndex + 1}</span>
        <AnimatePresence mode="wait">
          <motion.span key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-w-[8rem] text-xs font-bold text-paper">
            {chapter.title}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="18" className="stroke-paper/15" strokeWidth="2" fill="none" />
          <motion.circle cx="24" cy="24" r="18" className="stroke-lime" strokeWidth="2" fill="none" style={{ pathLength: smooth }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-paper">
          <PlayCircle size={16} className="text-paper" />
        </div>
      </div>
    </motion.div>
  );
}

export function ScrollVideoStages() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { amount: 0.05 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  const n = MEDIA_SECTIONS.length;

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setActive(Math.min(Math.floor(v * n), n - 1)));
    return () => unsub();
  }, [scrollYProgress, n]);

  if (reduced) {
    return (
      <section className="bg-ink py-20 text-paper">
        <Container className="grid gap-16">
          {MEDIA_SECTIONS.map((s, i) => (
            <article key={s.id} className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <VideoFrame clip={s.clip} dark className="border border-paper/15" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-lime">Chapter 0{i + 1}</p>
                <h3 className="mt-3 text-3xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-paper/75">{s.line}</p>
              </div>
            </article>
          ))}
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative w-full bg-ink text-paper" style={{ height: `${n * 100}svh` }} aria-label="From first visit to first credit">
      {/* background: sticky, crossfading per chapter */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="absolute inset-0 h-full w-full overflow-hidden bg-ink">
          {MEDIA_SECTIONS.map((s, i) => (
            <motion.div
              key={s.id}
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === active ? 1 : 0, zIndex: i === active ? 10 : 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              aria-hidden={i !== active}
            >
              <VideoFrame clip={s.clip} fill dark />
              <div className="absolute inset-0 bg-ink/40" />
            </motion.div>
          ))}
          <FilmGrain />
        </div>
      </div>

      <ChapterNav activeIndex={active} progress={scrollYProgress} visible={inView} />

      {/* content: one viewport per chapter, scrolling over the sticky background */}
      <div className="pointer-events-none absolute inset-0 top-0 z-30">
        {MEDIA_SECTIONS.map((s, i) => (
          <div key={s.id} className="flex h-[100svh] w-full items-center justify-start px-6 md:px-24">
            <motion.div variants={textContainer} initial="hidden" whileInView="visible" viewport={{ once: false, margin: "-20%" }} className="pointer-events-auto max-w-4xl">
              <motion.div variants={fadeIn} className="mb-6 flex items-center gap-4">
                <div className="h-0.5 w-12 bg-lime" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-lime">Chapter 0{i + 1}</span>
              </motion.div>
              <div className="mb-6 overflow-hidden py-2">
                <motion.h2 variants={textReveal} className="text-4xl font-semibold leading-none tracking-tight text-paper md:text-7xl">
                  {s.title}
                </motion.h2>
              </div>
              <motion.div variants={fadeIn} className="max-w-md rounded-2xl border border-paper/10 bg-paper/5 p-6 shadow-2xl backdrop-blur-md">
                <p className="text-lg font-light leading-relaxed text-paper/85">{s.line}</p>
                <dl className="mt-4 grid gap-1 border-t border-paper/15 pt-3 text-sm text-paper/80 [&_.leader::before]:border-paper/30">
                  {s.facts.map((f) => (
                    <div key={f.label} className="leader">
                      <dt>{f.label}</dt>
                      <dd className="tnum">{f.value}{f.toConfirm ? " (to confirm)" : ""}</dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Link href={CHAPTER_CTA[i].href} className="group mt-10 inline-flex items-center gap-4 font-semibold text-paper no-underline">
                  <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-paper/30">
                    <span className="absolute inset-0 translate-y-full bg-lime transition-transform duration-300 group-hover:translate-y-0" />
                    <ChevronRight size={20} className="relative z-10 transition-colors duration-300 group-hover:text-ink" />
                  </span>
                  <span className="text-xs uppercase tracking-widest">{CHAPTER_CTA[i].label}</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
