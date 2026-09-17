"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { REVIEWS, type Review } from "@/content/reviews";
import { SITE } from "@/config/site";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Reviews in vertical columns scrolling upward at different speeds on a
 * loop ("testimonials columns" pattern). Hovering a column eases only that
 * column down to a reading pace; keyboard focus pauses all of them.
 * Reduced motion: static grid.
 */
const HOVER_RATE = 0.3;
const RATE_EASE_MS = 450;

/**
 * Eases the playback rate of an element's CSS animation. Changing
 * `animation-duration` mid-run jumps the track; `playbackRate` keeps position.
 */
function useRateEase() {
  const ref = useRef<HTMLUListElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function easeTo(target: number) {
    const animation = ref.current?.getAnimations()[0];
    if (!animation) return;
    cancelAnimationFrame(frame.current);
    const start = animation.playbackRate;
    const startedAt = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - startedAt) / RATE_EASE_MS, 1);
      const eased = 1 - (1 - t) ** 3;
      animation.updatePlaybackRate(start + (target - start) * eased);
      if (t < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  }

  return { ref, easeTo };
}

function Column({ items, duration, className }: { items: readonly Review[]; duration: number; className?: string }) {
  const list = [...items, ...items];
  const { ref, easeTo } = useRateEase();
  return (
    <div
      className={cn("relative h-[32rem] overflow-hidden", className)}
      onMouseEnter={() => easeTo(HOVER_RATE)}
      onMouseLeave={() => easeTo(1)}
    >
      <ul ref={ref} className="column-track flex flex-col gap-5 pb-5" style={{ animationDuration: `${duration}s` }}>
        {list.map((r, i) => (
          <li key={`${r.name}-${i}`} aria-hidden={i >= items.length} className="sheet p-5">
            <p className="text-[0.95rem]">“{r.quote}”</p>
            <p className="mt-3 text-sm text-ink-2">
              {r.name} <span className="text-ink-2">· Google</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TestimonialColumns() {
  const reduced = usePrefersReducedMotion();
  const cols = [REVIEWS.slice(0, 2), REVIEWS.slice(2, 4), REVIEWS.slice(4, 6)];
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">Written by customers on Google.</h2>
          <p className="mt-4 text-lg text-ink-2">
            <a href={SITE.google.placeUrl} target="_blank" rel="noopener noreferrer">
              {SITE.google.rating.toFixed(1)} across {SITE.google.reviewCount} reviews
            </a>
            , quoted as written, first names only.
          </p>
        </div>
        {reduced ? (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <li key={r.name} className="sheet p-5">
                <p className="text-[0.95rem]">“{r.quote}”</p>
                <p className="mt-3 text-sm text-ink-2">{r.name} · Google</p>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="testimonial-columns mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="More Google reviews"
          >
            <Column items={cols[0]} duration={26} />
            <Column items={cols[1]} duration={32} className="hidden sm:block" />
            <Column items={cols[2]} duration={29} className="hidden lg:block" />
          </div>
        )}
        <p className="mt-6 text-center text-xs text-ink-2">Permission to display reviews: pending.</p>
      </Container>
    </section>
  );
}
