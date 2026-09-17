"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";

type Direction = "up" | "left" | "right" | "none";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 28 },
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll reveal. Headlines come in from the left, blocks rise from below,
 * children stagger. Final state renders immediately under reduced motion.
 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  stagger = 0.08,
  amount = 0.25,
  className,
  as = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  stagger?: number;
  amount?: number;
  className?: string;
  as?: "div" | "section" | "ul" | "li" | "header" | "span" | "h1" | "h2" | "h3" | "p";
}) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as];
  const off = OFFSET[direction];
  const variants: Variants = {
    hidden: { opacity: 0, x: off.x, y: off.y },
    show: { opacity: 1, x: 0, y: 0, transition: { duration, ease: EASE_OUT, delay, staggerChildren: stagger } },
  };
  if (reduced) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  );
}

/** Child of a staggered Reveal. */
export function RevealItem({ children, className, direction = "up", as = "div" }: { children: ReactNode; className?: string; direction?: Direction; as?: "div" | "li" | "span" | "p" }) {
  const reduced = usePrefersReducedMotion();
  const Tag = motion[as];
  const off = OFFSET[direction];
  if (reduced) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag className={className} variants={{ hidden: { opacity: 0, x: off.x, y: off.y }, show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.6, ease: EASE_OUT } } }}>
      {children}
    </Tag>
  );
}
