"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";

/** Zoom in, zoom out, and back to the whole island. */
export function MapZoomControls({ onIn, onOut, onReset, canIn, canOut, className }: { onIn: () => void; onOut: () => void; onReset: () => void; canIn: boolean; canOut: boolean; className?: string }) {
  const btn = "flex h-9 w-9 cursor-pointer items-center justify-center text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper disabled:cursor-default disabled:opacity-30";
  return (
    <div role="group" aria-label="Map zoom" className={cn("inline-flex flex-col overflow-hidden rounded-md border border-paper/20 bg-ink/70 backdrop-blur", className)}>
      <button type="button" aria-label="Zoom in" onClick={onIn} disabled={!canIn} className={btn}>
        <Plus className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Zoom out" onClick={onOut} disabled={!canOut} className={cn(btn, "border-t border-paper/15")}>
        <Minus className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Show the whole island" onClick={onReset} disabled={!canOut} className={cn(btn, "border-t border-paper/15")}>
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
