"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Gradient band sweeps across the text once, then settles to the current
 * text colour (the "dia text reveal" pattern in the brand's colours).
 */
export function DiaText({
  children,
  className,
  delay = 0.2,
  duration = 1.6,
  colors = ["#09641f", "#d8ff32", "#ffffff", "#d8ff32", "#09641f"],
}: {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  colors?: string[];
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <span className={className}>{children}</span>;
  const band = colors.join(", ");
  return (
    <motion.span
      className={cn("inline", className)}
      style={{
        backgroundImage: `linear-gradient(100deg, currentColor 0%, currentColor 35%, ${band}, currentColor 65%, currentColor 100%)`,
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      initial={{ backgroundPosition: "100% 0%" }}
      whileInView={{ backgroundPosition: "0% 0%" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.span>
  );
}
