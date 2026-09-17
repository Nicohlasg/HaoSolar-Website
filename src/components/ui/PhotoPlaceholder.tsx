import { cn } from "@/lib/cn";

/**
 * A labelled frame sized for a real photograph. Replaced with next/image once
 * Hugh supplies project photos. The label says what to shoot.
 */
export function PhotoPlaceholder({
  label,
  ratio = "4/3",
  className,
  hideCaption,
  dark,
}: {
  label: string;
  ratio?: "4/3" | "3/2" | "16/9" | "1/1" | "3/4";
  className?: string;
  /** Parent draws its own caption (hover cards). Label stays in the accessible name. */
  hideCaption?: boolean;
  /** Ink frame for dark surfaces (hero, film sections). */
  dark?: boolean;
}) {
  return (
    <figure
      aria-label={hideCaption ? `Photo placeholder: ${label}` : undefined}
      className={cn(
        "relative w-full max-w-full overflow-hidden rounded-md border",
        dark ? "border-paper/15 bg-ink" : "border-rule bg-paper-2",
        className,
      )}
      style={{ aspectRatio: ratio }}
    >
      <svg aria-hidden="true" className={cn("absolute inset-0 h-full w-full", dark ? "text-paper/15" : "text-rule")} preserveAspectRatio="none">
        <defs>
          <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hatch)" />
      </svg>
      {hideCaption ? null : (
        <figcaption className="absolute bottom-3 left-3 max-w-[85%] rounded-sm bg-paper px-2.5 py-1.5 text-xs text-ink-2 shadow-sm">
          Photo: {label}
        </figcaption>
      )}
    </figure>
  );
}
