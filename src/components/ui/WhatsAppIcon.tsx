/** Simple speech-bubble glyph drawn in the site's stroke weight. */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Z" />
      <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.6-1.9-.9-.9.9a4 4 0 0 1-2.1-2.1l.9-.9-.9-1.9Z" />
    </svg>
  );
}
