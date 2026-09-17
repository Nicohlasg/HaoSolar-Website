import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/config/site";

/** One-tap WhatsApp bar on phones, full width so it never covers the numerals. Desktop has the header button. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi Hao Solar, I'd like to ask about solar for my home.")}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-center gap-2 bg-ink text-paper font-medium transition-colors hover:bg-ink-2 sm:hidden"
    >
      <WhatsAppIcon className="h-6 w-6" />
      WhatsApp us
    </a>
  );
}
