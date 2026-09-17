/** Minimal stroke glyphs for social links, drawn in the site's icon weight. */
type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };

export function FacebookIcon({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M15.5 8h-1.6c-1.1 0-1.9.8-1.9 1.9V12h3.2l-.4 2.6h-2.8V21" />
      <path d="M9.5 12h2.5" />
    </svg>
  );
}

export function InstagramIcon({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M8 10.5V17" />
      <circle cx="8" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
      <path d="M11.5 17v-4a2.5 2.5 0 0 1 5 0v4" />
    </svg>
  );
}

export function TiktokIcon({ className }: P) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
      <path d="M14 4c.4 2.2 2 3.8 4.5 4" />
    </svg>
  );
}
