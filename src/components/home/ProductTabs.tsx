"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type PillOption = { id: string; label: string };

/**
 * Sliding pill toggle. The active background slides between labels with a
 * shared layout animation; no exit animation, so the dropdown bug noted in
 * the handoff does not apply. Used for the detail tabs and the product
 * switcher alike.
 */
export function ProductTabs({ options, active, onChange, layoutGroup, label, className }: { options: readonly PillOption[]; active: string; onChange: (id: string) => void; layoutGroup: string; label: string; className?: string }) {
  return (
    <div role="tablist" aria-label={label} className={cn("inline-flex rounded-full border border-rule bg-paper-2 p-1", className)}>
      {options.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={cn("relative cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200", isActive ? "text-paper" : "text-ink-2 hover:text-ink")}
          >
            {isActive ? <motion.span layoutId={`${layoutGroup}-pill`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} /> : null}
            <span className="relative">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
