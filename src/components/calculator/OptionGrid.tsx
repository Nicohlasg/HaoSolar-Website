"use client";

import { cn } from "@/lib/cn";

export type Option<T extends string> = { value: T; label: string; hint?: string };

/** Radio group drawn as large tap targets. One question per screen. */
export function OptionGrid<T extends string>({
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  name: string;
  options: readonly Option<T>[];
  value: T | null;
  onChange: (v: T) => void;
  columns?: 1 | 2 | 3 | 4;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4",
      )}
    >
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.value)}
            className={cn(
              "min-h-14 cursor-pointer rounded-sm border px-4 py-3 text-left transition-colors duration-200",
              selected ? "border-ink bg-ink text-paper" : "border-rule bg-paper hover:border-ink",
            )}
          >
            <span className="block font-medium">{o.label}</span>
            {o.hint ? <span className={cn("block text-sm", selected ? "text-paper/70" : "text-ink-2")}>{o.hint}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
