"use client";

import type { Project } from "@/content/projects";
import type { Cluster } from "@/lib/map";
import { cn } from "@/lib/cn";

const CATEGORY_LABEL: Record<Project["category"], string> = { landed: "landed home", commercial: "commercial roof", ev: "EV charger" };

export type Dot = { id: string; at: { x: number; y: number }; project: Project };

/**
 * Dots and clusters over the map, placed by percentage inside the scaled
 * layer and counter-scaled by `1 / zoom` so they keep their size on screen.
 * A single dot: dashed ring turning slowly, faster while active. A cluster:
 * a bigger disc with the count; hovering it lists the roofs, clicking it
 * zooms until they stand apart. Hover on a mouse, tap on touch, focus on a
 * keyboard all open a dot's card. While one roof is focused every other
 * marker fades out and stops taking the pointer.
 */
export function MapMarkers({
  clusters,
  zoom,
  activeId,
  activeClusterKey,
  focusedId,
  onOpen,
  onOpenCluster,
  onSplitCluster,
  onLeave,
  onClose,
}: {
  clusters: readonly Cluster<Dot>[];
  zoom: number;
  activeId: string | null;
  activeClusterKey: string | null;
  /** The roof in the focused view, if any; everything else fades. */
  focusedId: string | null;
  onOpen: (id: string) => void;
  onOpenCluster: (key: string) => void;
  /** Click on a cluster: zoom in until its roofs are separate dots. */
  onSplitCluster: (key: string) => void;
  /** Mouse left a marker; the card may still be entered, so the close is deferred. */
  onLeave: () => void;
  onClose: () => void;
}) {
  const counter = `translate(-50%, -50%) scale(${1 / zoom})`;
  const faded = "opacity-0 pointer-events-none";
  return (
    // Tapping empty map closes the card; marker clicks stop propagation below.
    <div className="absolute inset-0" onClick={onClose}>
      {clusters.map((c) => {
        const pos = { left: `${c.at.x}%`, top: `${c.at.y}%`, transform: counter };
        if (c.items.length > 1) {
          const isActive = activeClusterKey === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-label={`${c.items.length} jobs here, click to zoom in on them`}
              aria-pressed={isActive}
              onPointerEnter={(e) => e.pointerType === "mouse" && onOpenCluster(c.key)}
              onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
              onClick={(e) => {
                e.stopPropagation();
                onSplitCluster(c.key);
              }}
              onFocus={() => onOpenCluster(c.key)}
              className={cn("group absolute flex h-14 w-14 cursor-zoom-in items-center justify-center rounded-full transition-[transform,opacity] duration-500", isActive && "h-20 w-20", focusedId && faded)}
              style={pos}
            >
              <span aria-hidden="true" className={cn("absolute h-12 w-12 rounded-full border border-dashed border-lime/60 motion-safe:animate-[spin_14s_linear_infinite] transition-transform duration-500", isActive ? "scale-110" : "group-hover:scale-105")} />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-lime font-display text-sm font-semibold text-ink ring-2 ring-ink tnum">{c.items.length}</span>
            </button>
          );
        }
        const { project: p, id } = c.items[0];
        const isActive = activeId === id;
        const isCharger = p.category === "ev";
        return (
          <button
            key={c.key}
            type="button"
            aria-label={`${p.area}, ${p.kwp !== null ? `${p.kwp} kWp` : CATEGORY_LABEL[p.category]}`}
            aria-pressed={isActive}
            onPointerEnter={(e) => e.pointerType === "mouse" && onOpen(id)}
            onPointerLeave={(e) => e.pointerType === "mouse" && onLeave()}
            onClick={(e) => {
              e.stopPropagation();
              onOpen(id);
            }}
            onFocus={() => onOpen(id)}
            className={cn(
              "group absolute flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-[opacity,transform] duration-500",
              // While active the hit area grows so the cursor can drift during the zoom without leaving the marker.
              isActive && "h-20 w-20",
              focusedId && focusedId !== id && faded,
            )}
            style={pos}
          >
            {/* The card grows beside this spot on large screens, so the dot itself gives way to it. */}
            <span aria-hidden="true" className={cn("relative flex h-9 w-9 items-center justify-center transition-opacity duration-300", isActive && "lg:opacity-0")}>
              <span
                className={cn(
                  "absolute h-7 w-7 rounded-full border border-dashed motion-safe:animate-[spin_9s_linear_infinite] transition-transform duration-500",
                  isCharger ? "border-paper/50" : "border-lime/60",
                  isActive ? "scale-125 motion-safe:animate-[spin_3s_linear_infinite]" : "scale-100 group-hover:scale-110",
                )}
              />
              <span className={cn("relative h-2.5 w-2.5 rounded-full ring-2 ring-ink transition-transform duration-300", isCharger ? "bg-paper" : "bg-lime", isActive && "scale-125")} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
