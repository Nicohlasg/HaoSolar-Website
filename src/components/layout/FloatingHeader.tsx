"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { SunIcon, ZapIcon, WrenchIcon, HouseIcon, ArrowIcon } from "@/components/icons/AnimatedIcons";
import { NAV } from "@/config/site";
import { SERVICES } from "@/content/services";
import { PROJECT_CATEGORIES } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { MobileNav } from "./MobileNav";

/**
 * Floating frosted-glass pill navigation. Hover a top item and one shared
 * dropdown morphs between them (layoutId). Scrolling down past the hero
 * minimises the bar to a compact pill (bolt, menu, WhatsApp); scrolling up,
 * hovering the top edge, hovering the pill, or focusing into it expands it.
 */
const SERVICE_ICON = { solar: SunIcon, "ev-charger": ZapIcon, maintenance: WrenchIcon } as const;
const HIDE_AFTER_PX = 120;
const TOP_HOVER_PX = 72;

export function FloatingHeader() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);
  const [pinned, setPinned] = useState(false); // mouse near top, over the bar, or focus inside
  const [hovering, setHovering] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < HIDE_AFTER_PX) setVisible(true);
    else if (y > prev + 2) setVisible(false);
    else if (y < prev - 2) setVisible(true);
  });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPinned(e.clientY < TOP_HOVER_PX);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const expanded = visible || pinned || hovering || active !== null;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4"
      initial={false}
      onFocusCapture={() => setPinned(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPinned(false);
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setActive(null);
      }}
    >
      <motion.div
        layout
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
        className={cn(
          "glass flex items-center gap-2 rounded-full",
          expanded ? "h-14 w-full max-w-5xl justify-between px-2 pl-4 sm:h-15" : "h-12 w-auto justify-center px-3",
        )}
      >
        <motion.div layout="position" className="flex">
          <Logo compact={!expanded} tone="ink" />
        </motion.div>

        {expanded ? (
            <motion.nav
              aria-label="Main"
              className="relative hidden items-center md:flex"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.15 } }}
            >
          {NAV.map((item) => {
            const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const hasMenu = item.href === "/services" || item.href === "/projects";
            const isActive = active === item.href;
            return (
              <div key={item.href} className="relative" onMouseEnter={() => setActive(hasMenu ? item.href : null)}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  aria-expanded={hasMenu ? isActive : undefined}
                  onFocus={() => setActive(hasMenu ? item.href : null)}
                  className={cn(
                    "relative block rounded-full px-3.5 py-2 text-[0.95rem] font-medium no-underline transition-colors duration-200",
                    current || isActive ? "text-ink" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {(current || isActive) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-paper/80"
                      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.label}
                </Link>

                {isActive ? (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-4">
                    <motion.div
                      initial={reduced ? false : { opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={reduced ? { duration: 0 } : { type: "spring", mass: 0.5, damping: 12, stiffness: 120 }}
                    >
                      <motion.div layoutId="nav-menu" className="glass glass-solid overflow-hidden rounded-2xl" transition={reduced ? { duration: 0 } : { type: "spring", mass: 0.5, damping: 12, stiffness: 120 }}>
                        <motion.div layout className="h-full w-max p-2">
                          {item.href === "/services" ? <ServicesMenu onPick={() => setActive(null)} /> : <ProjectsMenu onPick={() => setActive(null)} />}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </div>
                ) : null}
              </div>
            );
          })}
            </motion.nav>
        ) : null}

        <motion.div layout="position" className={cn("flex items-center gap-2", !expanded && "md:hidden")}>
          <MobileNav items={NAV} />
        </motion.div>
      </motion.div>
    </motion.header>
  );
}

function ServicesMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-2 p-1">
      {SERVICES.map((s) => {
        const Icon = SERVICE_ICON[s.slug];
        return (
          <Link
            key={s.slug}
            href={`/services#${s.slug}`}
            onClick={onPick}
            className="group w-52 rounded-xl p-2 no-underline transition-colors hover:bg-paper/70"
          >
            <PhotoPlaceholder label={s.short} ratio="16/9" hideCaption className="rounded-lg" />
            <p className="mt-2.5 flex items-center gap-2 font-medium text-ink">
              <Icon className="h-4 w-4" />
              {s.short}
            </p>
            <p className="mt-1 line-clamp-2 text-xs text-ink-2">{s.lead}</p>
          </Link>
        );
      })}
    </div>
  );
}

function ProjectsMenu({ onPick }: { onPick: () => void }) {
  return (
    <div className="grid w-64 gap-1 p-1">
      {PROJECT_CATEGORIES.map((c) => (
        <Link
          key={c.value}
          href={c.value === "all" ? "/projects" : `/projects?type=${c.value}`}
          onClick={onPick}
          className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-2 no-underline transition-colors hover:bg-paper/70 hover:text-ink"
        >
          <HouseIcon className="h-4 w-4" />
          {c.label}
        </Link>
      ))}
      <Link href="/calculator" onClick={onPick} className="group mt-1 flex items-center justify-between rounded-xl bg-lime px-3 py-2.5 text-sm font-medium text-ink no-underline">
        See what your roof could do <ArrowIcon className="h-4 w-4" />
      </Link>
    </div>
  );
}
