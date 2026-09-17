"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";

/** Exponential ease-out used for every authored moment on the site. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const SNAP: Transition = { duration: 0.5, ease: EASE_OUT };
export const SLOW: Transition = { duration: 0.9, ease: EASE_OUT };

const LG_QUERY = "(min-width: 1024px)";

/**
 * True at Tailwind's `lg` breakpoint and up. Scroll rigs only run there;
 * smaller screens get the finished state as a plain block. Starts true so
 * the server render matches the desktop layout.
 */
export function useIsLargeScreen(): boolean {
  const [large, setLarge] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const update = () => setLarge(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return large;
}

/**
 * True when the visitor prefers reduced motion. Components render their final
 * state immediately in that case instead of animating into it.
 */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
