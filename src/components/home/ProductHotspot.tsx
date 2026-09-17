"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Hotspot } from "@/content/products";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

export type HotspotState = "closed" | "peek" | "open";

/**
 * A dot pinned to the product's front face. Hover: a photo or clip
 * placeholder scales up out of the dot. Click: it grows into a panel with
 * the full note. Click again, or move away, and it shrinks back.
 */
export function ProductHotspot({ spot, state, onPeek, onOpen, onClose }: { spot: Hotspot; state: HotspotState; onPeek: () => void; onOpen: () => void; onClose: () => void }) {
  const isOpen = state === "open";
  const shown = state !== "closed";
  // Cards open away from the edge they sit nearest.
  const toLeft = spot.x > 55;
  const toTop = spot.y > 60;
  return (
    <div className="absolute" style={{ left: `${spot.x}%`, top: `${spot.y}%` }} onPointerLeave={() => !isOpen && onClose()}>
      <button
        type="button"
        aria-label={spot.title}
        aria-expanded={isOpen}
        onPointerEnter={(e) => e.pointerType === "mouse" && state === "closed" && onPeek()}
        onClick={(e) => {
          e.stopPropagation();
          if (isOpen) onClose();
          else onOpen();
        }}
        className="group relative flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
      >
        <span aria-hidden="true" className={cn("absolute h-6 w-6 rounded-full border border-dashed border-lime/70 motion-safe:animate-[spin_8s_linear_infinite] transition-transform duration-300", shown ? "scale-125" : "group-hover:scale-110")} />
        <span aria-hidden="true" className="relative h-2 w-2 rounded-full bg-lime ring-2 ring-ink" />
      </button>
      <AnimatePresence>
        {shown ? (
          <motion.div
            key={isOpen ? "open" : "peek"}
            initial={{ scale: 0.15, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            style={{ transformOrigin: `${toLeft ? "right" : "left"} ${toTop ? "bottom" : "top"}` }}
            className={cn(
              "absolute z-20 rounded-md bg-paper p-2 text-ink shadow-sheet",
              isOpen ? "w-72" : "w-40",
              toLeft ? "right-4" : "left-4",
              toTop ? "bottom-4" : "top-4",
            )}
          >
            <PhotoPlaceholder label={spot.shot} ratio={isOpen ? "16/9" : "4/3"} hideCaption />
            <div className="mt-2 flex items-start justify-between gap-2">
              <p className="text-sm font-semibold leading-tight">{spot.title}</p>
              {isOpen ? (
                <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer rounded-sm p-0.5 text-ink-2 hover:bg-paper-2 hover:text-ink">
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            {isOpen ? <p className="mt-1 text-xs text-ink-2">{spot.body}</p> : <p className="mt-0.5 text-[0.65rem] uppercase tracking-wide text-ink-2">Click for more</p>}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
