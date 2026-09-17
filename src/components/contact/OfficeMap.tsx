import { SITE } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Google Maps embed of the office. Keyless "output=embed" URL; loads only
 * when scrolled near (lazy). Replace with a Maps Embed API key later for
 * custom styling.
 */
export function OfficeMap({ className }: { className?: string }) {
  const q = encodeURIComponent(`${SITE.address.line1}, ${SITE.address.line2}`);
  return (
    <div className={cn("overflow-hidden rounded-md border border-rule bg-paper-2", className)}>
      <iframe
        title="Map of the Hao Solar office at North Link Building"
        src={`https://www.google.com/maps?q=${q}&z=16&output=embed`}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
