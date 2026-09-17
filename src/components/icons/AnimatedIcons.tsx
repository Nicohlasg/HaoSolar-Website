"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, type Variants } from "framer-motion";
import { Sun, Zap, MessageCircle, Wrench, House, ChevronDown, Play, ShieldCheck, ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Lucide icons animated with Framer Motion, in the spirit of animate-ui.
 * Each icon animates on its own hover or when its parent sets `active`
 * (parents pass hover state down). Reduced motion: static.
 */
type IconProps = { className?: string; active?: boolean };

const SPRING = { type: "spring", stiffness: 260, damping: 18 } as const;

/** True while the nearest `.group` ancestor (or the icon itself) is hovered or focused. */
function useGroupHover(ref: RefObject<HTMLElement | null>) {
  const [hover, setHover] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target: HTMLElement = el.closest(".group") ?? el;
    const on = () => setHover(true);
    const off = () => setHover(false);
    target.addEventListener("mouseenter", on);
    target.addEventListener("mouseleave", off);
    target.addEventListener("focusin", on);
    target.addEventListener("focusout", off);
    return () => {
      target.removeEventListener("mouseenter", on);
      target.removeEventListener("mouseleave", off);
      target.removeEventListener("focusin", on);
      target.removeEventListener("focusout", off);
    };
  }, [ref]);
  return hover;
}

function Wrapper({ variants, active, className, children }: { variants: Variants; active?: boolean; className?: string; children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const hovered = useGroupHover(ref);
  const on = !reduced && (active || hovered);
  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      variants={reduced ? undefined : variants}
      initial="rest"
      animate={on ? "hover" : "rest"}
      style={{ transformOrigin: "center" }}
    >
      {children}
    </motion.span>
  );
}

export function SunIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { rotate: 0 }, hover: { rotate: 90, transition: { duration: 0.7, ease: "easeOut" } } }}>
      <Sun className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function ZapIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: [1, 1.25, 1], rotate: [0, -8, 0], transition: { duration: 0.5 } } }}>
      <Zap className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function MessageIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -12, 10, -6, 0], transition: { duration: 0.6 } } }}>
      <MessageCircle className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function WrenchIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -25, 15, 0], transition: { duration: 0.6 } } }}>
      <Wrench className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function HouseIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { y: 0 }, hover: { y: [0, -4, 0], transition: { duration: 0.45, ease: "easeOut" } } }}>
      <House className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function ShieldIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { scale: 1 }, hover: { scale: [1, 1.15, 1], transition: { duration: 0.45 } } }}>
      <ShieldCheck className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function PlayIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { scale: 1, x: 0 }, hover: { scale: 1.15, x: 2, transition: SPRING } }}>
      <Play className={className} aria-hidden="true" />
    </Wrapper>
  );
}

export function ArrowIcon({ className, active }: IconProps) {
  return (
    <Wrapper active={active} variants={{ rest: { x: 0, y: 0 }, hover: { x: 3, y: -3, transition: SPRING } }}>
      <ArrowUpRight className={className} aria-hidden="true" />
    </Wrapper>
  );
}

/** Chevron that rotates when `open`. */
export function ChevronIcon({ className, open }: { className?: string; open: boolean }) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.span className="inline-flex" animate={{ rotate: open ? 180 : 0 }} transition={reduced ? { duration: 0 } : SPRING}>
      <ChevronDown className={className} aria-hidden="true" />
    </motion.span>
  );
}
