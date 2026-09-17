"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function NavLinks({
  items,
  onNavigate,
  className,
}: {
  items: readonly { href: string; label: string }[];
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-sm px-3 py-2 text-[0.95rem] font-medium text-ink-2 transition-colors duration-200 hover:bg-paper-2 hover:text-ink",
              active && "text-ink underline decoration-lime decoration-[3px] underline-offset-[6px]",
              className,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
