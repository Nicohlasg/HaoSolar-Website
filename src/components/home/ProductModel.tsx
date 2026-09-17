"use client";

import type { ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";
import type { Product } from "@/content/products";
import { useIsLargeScreen } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Placeholder renderer: a CSS cuboid with the product's real proportions
 * and a styled front face, turned by `rotateY` and tilted a little.
 * Hotspots render as children on the front face. Swap this component for a
 * GLB (three / react-three-fiber) or a turntable image sequence when real
 * assets arrive; the stage only supplies `rotateY` and the children.
 */
const FACE_STYLE: Record<Product["face"], string> = {
  panel: "bg-[#0d1a14] bg-[linear-gradient(90deg,rgba(216,255,50,0.35)_1px,transparent_1px),linear-gradient(0deg,rgba(216,255,50,0.35)_1px,transparent_1px)] bg-[size:8.33%_16.66%] border border-grey/60",
  inverter: "bg-gradient-to-br from-paper to-grey/70 border border-grey",
  charger: "bg-gradient-to-b from-paper-2 to-grey/80 border border-grey",
  battery: "bg-gradient-to-r from-paper-2 via-paper to-paper-2 border border-grey",
};

/** Longest edge in pixels, large screens and small. */
const MAX_PX = { lg: 440, sm: 260 };

export function ProductModel({ product, rotateY, className, children }: { product: Product; rotateY: MotionValue<number> | number; className?: string; children?: ReactNode }) {
  const large = useIsLargeScreen();
  const { w, h, d } = product.dims;
  const k = (large ? MAX_PX.lg : MAX_PX.sm) / Math.max(w, h);
  const W = w * k;
  const H = h * k;
  const D = Math.max(d * k, 10);
  /* Every face is centred in the box and pushed out along its own axis: the classic CSS cube. */
  const side = { width: D, height: H, left: (W - D) / 2, top: 0 };
  const cap = { width: W, height: D, left: 0, top: (H - D) / 2 };

  return (
    <div className={cn("relative", className)} style={{ width: W, height: H, perspective: 1400 }}>
      <motion.div className="relative h-full w-full" style={{ transformStyle: "preserve-3d", rotateY, rotateX: -8 }}>
        <div aria-hidden="true" className="absolute inset-0 border border-grey/40 bg-ink-2" style={{ transform: `rotateY(180deg) translateZ(${D / 2}px)` }} />
        <div aria-hidden="true" className="absolute bg-ink-2/90" style={{ ...side, transform: `rotateY(90deg) translateZ(${W / 2}px)` }} />
        <div aria-hidden="true" className="absolute bg-ink-2/90" style={{ ...side, transform: `rotateY(-90deg) translateZ(${W / 2}px)` }} />
        <div aria-hidden="true" className="absolute bg-ink-2/70" style={{ ...cap, transform: `rotateX(90deg) translateZ(${H / 2}px)` }} />
        <div aria-hidden="true" className="absolute bg-ink/80" style={{ ...cap, transform: `rotateX(-90deg) translateZ(${H / 2}px)` }} />
        {/* front, with hotspots */}
        <div className={cn("absolute inset-0 rounded-[3px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]", FACE_STYLE[product.face])} style={{ transform: `translateZ(${D / 2}px)` }}>
          {product.face === "inverter" ? <div aria-hidden="true" className="absolute left-[18%] top-[18%] h-[14%] w-[64%] rounded-sm bg-ink/85" /> : null}
          {product.face === "charger" ? <div aria-hidden="true" className="absolute left-[30%] top-[18%] h-[22%] w-[40%] rounded-full border-4 border-lime/80" /> : null}
          {product.face === "battery" ? <div aria-hidden="true" className="absolute inset-x-[6%] top-1/2 h-px bg-grey" /> : null}
          {children}
        </div>
      </motion.div>
    </div>
  );
}
