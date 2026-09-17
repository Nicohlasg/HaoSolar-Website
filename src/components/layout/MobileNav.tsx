"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/config/site";

export function MobileNav({ items }: { items: readonly { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-rule/70 hover:bg-paper/70"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div
          id="mobile-menu"
          className="glass glass-solid fixed inset-x-3 top-[4.75rem] rounded-2xl px-5 pb-5 pt-2"
        >
          <nav aria-label="Main, mobile" className="flex flex-col">
            <NavLinks items={items} onNavigate={() => setOpen(false)} className="py-3 text-base" />
          </nav>
          <Button
            href={whatsappLink("Hi Hao Solar, I'd like to ask about solar for my home.")}
            external
            variant="primary"
            size="lg"
            className="mt-3 w-full"
          >
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp us
          </Button>
        </div>
      ) : null}
    </div>
  );
}
