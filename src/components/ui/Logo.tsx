import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Official mark (vector, from the .ai file) plus the wordmark. On white
 * surfaces the wordmark is the supplied artwork in the brand greys; in the
 * glass bar those greys vanish over dark sections, so the wordmark is set in
 * the display face with black HAO and grey SOLAR.
 */
export function Logo({
  className,
  compact,
  onDark,
  tone = "brand",
}: {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
  tone?: "brand" | "ink";
}) {
  const fullArtwork = !compact && tone === "brand" && !onDark;
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 no-underline", className)} aria-label="HAOSOLAR, home page">
      {fullArtwork ? (
        <Image src="/images/logo-full.png" alt="" width={1630} height={500} className="h-9 w-auto" priority />
      ) : (
        <Image src="/images/logo-mark.svg" alt="" width={979} height={1316} className="h-8 w-auto" priority />
      )}
      {compact || fullArtwork ? null : (
        <span className="font-display text-[1.35rem] font-semibold leading-none tracking-[-0.02em]">
          <span className={onDark ? "text-paper" : "text-ink"}>HAO</span>
          <span className={onDark ? "text-paper/60" : "text-grey"}>SOLAR</span>
        </span>
      )}
    </Link>
  );
}
