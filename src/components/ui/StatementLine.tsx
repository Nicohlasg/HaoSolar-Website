import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "credit" | "muted" | "total";

export function StatementLine({
  label,
  value,
  tone = "default",
  toConfirm,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  tone?: Tone;
  toConfirm?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "leader py-1.5 text-[0.95rem]",
        tone === "muted" && "text-ink-2",
        tone === "total" && "text-lg font-semibold border-t border-ink pt-3 mt-1",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        {label}
        {toConfirm ? (
          <span className="rounded-sm bg-alert px-1.5 py-px text-[0.65rem] font-medium uppercase tracking-wide text-paper">
            to confirm
          </span>
        ) : null}
      </span>
      <span className={cn(tone === "credit" && "stamp font-semibold")}>{value}</span>
    </div>
  );
}
