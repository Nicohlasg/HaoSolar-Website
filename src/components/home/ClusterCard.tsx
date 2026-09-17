"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import type { Project } from "@/content/projects";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * The list a cluster opens: every job under that disc, scrollable. Picking
 * a row zooms the map in on that roof and opens its card. Floating beside
 * the cluster on large screens, a panel under the map below.
 */
export function ClusterCard({
  projects,
  floating,
  at,
  side = "right",
  onPick,
  onEnter,
  onLeave,
}: {
  projects: readonly Project[];
  floating: boolean;
  /** Screen position of the cluster in box px. */
  at?: { x: number; y: number };
  side?: "left" | "right";
  onPick: (id: string) => void;
  onEnter?: () => void;
  onLeave?: () => void;
}) {
  const list = (
    <ul className="max-h-64 divide-y divide-rule overflow-y-auto overscroll-contain">
      {projects.map((p) => (
        <li key={p.id}>
          <button type="button" onClick={() => onPick(p.id)} className="group flex w-full cursor-pointer items-center gap-3 px-1 py-2 text-left hover:bg-paper-2">
            <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm bg-paper-2">
              {p.photos?.[0] ? <Image src={p.photos[0].src} alt="" fill sizes="56px" className="object-cover" /> : null}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{p.area}</span>
              <span className="block truncate text-xs text-ink-2">{p.note}</span>
            </span>
            <ZoomIn className="h-4 w-4 shrink-0 text-ink-2 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
  const heading = <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-ink-2">{projects.length} roofs here</p>;

  if (!floating || !at) {
    return (
      <div className="w-full max-w-md rounded-md bg-paper p-3 text-ink shadow-sheet">
        {heading}
        {list}
      </div>
    );
  }
  return (
    <div
      className={cn("absolute z-10 -translate-y-1/2", side === "right" ? "translate-x-8" : "-translate-x-[calc(100%+2rem)]")}
      style={{ left: at.x, top: at.y }}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        style={{ transformOrigin: side === "right" ? "left center" : "right center" }}
        className="w-72 rounded-md bg-paper p-3 text-ink shadow-sheet"
      >
        {heading}
        {list}
      </motion.div>
    </div>
  );
}
