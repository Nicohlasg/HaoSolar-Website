"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Hotspot } from "@/content/products";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type HotspotState = "closed" | "peek" | "open";

/** The small frame in the hover card: the real photo, a clip's poster, or the labelled placeholder. */
function Peek({ spot }: { spot: Hotspot }) {
  const m = spot.media;
  if (!m) return <PhotoPlaceholder label={spot.shot} ratio="4/3" hideCaption />;
  const src = m.kind === "image" ? m.src : m.poster;
  const alt = m.kind === "image" ? m.alt : "";
  return (
    <div className="relative w-full overflow-hidden rounded-sm bg-paper-2" style={{ aspectRatio: "4/3" }}>
      <Image src={src} alt={alt} fill sizes="160px" className="object-cover" />
    </div>
  );
}

/**
 * A dot pinned to the product's front face. Hover: a small photo scales up
 * out of the dot. Click: the stage opens the landscape panel with that
 * photo or clip as its background (see HotspotPanel) and hides the other
 * dots. While another spot is open this one fades out.
 */
export function ProductHotspot({
  spot,
  state,
  dimmed,
  onPeek,
  onOpen,
  onClose,
}: {
  spot: Hotspot;
  state: HotspotState;
  /** Another spot is open, so this dot gives way. */
  dimmed: boolean;
  onPeek: () => void;
  onOpen: () => void;
  onClose: () => void;
}) {
  const isOpen = state === "open";
  const peeking = state === "peek";
  // Cards open away from the edge they sit nearest.
  const toLeft = spot.x > 55;
  const toTop = spot.y > 60;
  return (
    <div
      className={cn("absolute transition-opacity duration-300", dimmed && "pointer-events-none opacity-0")}
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
      onPointerLeave={() => peeking && onClose()}
    >
      <button
        type="button"
        aria-label={spot.title}
        aria-expanded={isOpen}
        onPointerEnter={(e) => e.pointerType === "mouse" && state === "closed" && onPeek()}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        className="group relative flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
      >
        <span aria-hidden="true" className={cn("absolute h-6 w-6 rounded-full border border-dashed border-lime/70 motion-safe:animate-[spin_8s_linear_infinite] transition-transform duration-300", peeking ? "scale-125" : "group-hover:scale-110")} />
        <span aria-hidden="true" className="relative h-2 w-2 rounded-full bg-lime ring-2 ring-ink" />
      </button>
      <AnimatePresence>
        {peeking ? (
          <motion.div
            key="peek"
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            style={{ transformOrigin: `${toLeft ? "right" : "left"} ${toTop ? "bottom" : "top"}` }}
            className={cn("absolute z-20 w-40 rounded-md bg-paper p-2 text-ink shadow-sheet", toLeft ? "right-4" : "left-4", toTop ? "bottom-4" : "top-4")}
          >
            <Peek spot={spot} />
            <p className="mt-2 text-sm font-semibold leading-tight">{spot.title}</p>
            <p className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-ink-2">Click to enlarge</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
