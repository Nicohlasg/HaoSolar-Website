import { REVIEWS } from "@/content/reviews";
import { STRENGTHS_TICKER_CAPTION } from "@/content/strengths";
import { cn } from "@/lib/cn";

/**
 * One slow line of what the reviews say, not how many there are. Reuses the
 * site's marquee (pauses on hover and focus, wraps under reduced motion).
 */
export function ReviewTicker({ className }: { className?: string }) {
  const items = REVIEWS.map((r) => ({ key: r.name, text: r.mentions, name: r.name }));
  return (
    <div className={cn("text-xs", className)}>
      <p className="mb-2 font-medium uppercase tracking-wide text-paper/50">{STRENGTHS_TICKER_CAPTION}</p>
      <div className="marquee overflow-hidden" aria-label="Phrases from customer reviews">
        <ul className="marquee-track [animation-duration:45s]">
          {[false, true].map((clone) =>
            items.map((it) => (
              <li key={`${it.key}-${clone}`} aria-hidden={clone || undefined} className="flex shrink-0 items-center gap-3 whitespace-nowrap text-paper/80">
                <span>{it.text}</span>
                <span className="text-paper/40">{it.name}</span>
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-lime/70" />
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}
