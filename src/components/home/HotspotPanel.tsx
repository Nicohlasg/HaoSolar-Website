"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import type { Hotspot } from "@/content/products";
import { EASE_OUT } from "@/lib/motion";

/** The media a hotspot opens, filling the panel: a frame, a muted clip, or the labelled placeholder until footage exists. */
function Backdrop({ spot }: { spot: Hotspot }) {
  const m = spot.media;
  if (!m) return <PhotoPlaceholder label={spot.shot} ratio="16/9" hideCaption dark className="absolute inset-0 h-full w-full rounded-none border-0" />;
  if (m.kind === "image") return <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 60rem, 92vw" quality={85} className="object-cover" />;
  return <video src={m.src} poster={m.poster} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />;
}

/**
 * A hotspot opened: a landscape panel over the stage with the photo or clip
 * as its background and the note in the corner. The product behind fades
 * (the stage handles that). A click outside, the close control or Escape
 * shrinks it back.
 */
export function HotspotPanel({ spot, onClose }: { spot: Hotspot; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4" onClick={onClose} role="presentation">
      <motion.figure
        role="dialog"
        aria-modal="true"
        aria-label={spot.title}
        initial={{ scale: 0.55, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        onClick={(e) => e.stopPropagation()}
        className="relative aspect-video w-[min(60rem,92vw)] max-h-[85svh] overflow-hidden rounded-md bg-ink text-paper shadow-sheet"
      >
        <Backdrop spot={spot} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-paper/20 bg-ink/60 text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="font-display text-2xl font-semibold leading-tight sm:text-3xl">{spot.title}</p>
          <p className="mt-2 max-w-xl text-sm text-paper/85 sm:text-base">{spot.body}</p>
          <p className="mt-3 text-[0.65rem] font-medium uppercase tracking-wide text-paper/50">Click outside to close</p>
        </figcaption>
      </motion.figure>
    </div>
  );
}
