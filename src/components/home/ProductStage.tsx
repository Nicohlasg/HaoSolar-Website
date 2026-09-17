"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ScrubReveal } from "@/components/ui/ScrubReveal";
import { ScrubWords } from "@/components/ui/ScrubWords";
import { PRODUCTS, type Product } from "@/content/products";
import { detailWindow, glideAt, HOTSPOTS_FROM, rotationAt, sideFor } from "@/lib/product-story";
import { EASE_OUT, useIsLargeScreen, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ProductModel } from "./ProductModel";
import { ProductHotspot, type HotspotState } from "./ProductHotspot";
import { ProductTabs } from "./ProductTabs";

/** Distance the product glides from centre to its side, in viewport widths. */
const GLIDE_VW = 22;

const ROWS = { hidden: {}, show: { transition: { staggerChildren: 0.05 } }, exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } };
const ROW = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: EASE_OUT } },
};

function ToConfirm() {
  return <span className="rounded-sm bg-alert px-1.5 py-px text-[0.65rem] font-medium uppercase tracking-wide text-paper">to confirm</span>;
}

/**
 * The copy column. Its top never moves: the block is anchored, so a longer
 * tab only grows downwards. Kicker, name and line lift in word by word with
 * the scroll; tab rows stagger in and out on a switch.
 */
function Details({ product, progress, side }: { product: Product; progress: MotionValue<number>; side: "left" | "right" }) {
  const [tab, setTab] = useState(product.tabs[0].id);
  const current = product.tabs.find((t) => t.id === tab) ?? product.tabs[0];
  const n = 4;
  return (
    <div className={cn("max-w-md", side === "left" && "lg:ml-auto")}>
      <p className="text-xs font-medium uppercase tracking-wide text-forest">
        <ScrubWords text={product.kicker} progress={progress} window={detailWindow(0, n)} />
      </p>
      <h3 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
        <ScrubWords text={product.name} progress={progress} window={detailWindow(0, n)} />
        {product.toConfirm ? (
          <ScrubReveal progress={progress} window={detailWindow(1, n)} x={0} y={6} className="ml-2 inline-block align-middle">
            <ToConfirm />
          </ScrubReveal>
        ) : null}
      </h3>
      <p className="mt-3 text-lg text-ink-2">
        <ScrubWords text={product.line} progress={progress} window={detailWindow(1, n)} stagger={0.6} />
      </p>
      <ScrubReveal progress={progress} window={detailWindow(2, n)} x={0} y={14} className="mt-6">
        <ProductTabs options={product.tabs} active={current.id} onChange={setTab} layoutGroup={`tabs-${product.id}`} label="Product details" />
        <div className="mt-3 border-t border-rule text-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.dl key={current.id} variants={ROWS} initial="hidden" animate="show" exit="exit">
              {current.lines.map((l) => (
                <motion.div key={l.label} variants={ROW} className="leader border-b border-rule py-2">
                  <dt className="flex items-center gap-2 text-ink-2">
                    {l.label}
                    {l.toConfirm ? <ToConfirm /> : null}
                  </dt>
                  <dd className="max-w-[55%]">{l.value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          </AnimatePresence>
        </div>
      </ScrubReveal>
    </div>
  );
}

function Hotspots({ product, progress }: { product: Product; progress: MotionValue<number> }) {
  const [state, setState] = useState<{ id: string; mode: HotspotState } | null>(null);
  const opacity = useTransform(progress, [HOTSPOTS_FROM, HOTSPOTS_FROM + 0.06], [0, 1], { clamp: true });
  const pointer = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  return (
    <motion.div className="absolute inset-0" style={{ opacity, pointerEvents: pointer }}>
      {product.hotspots.map((h) => (
        <ProductHotspot
          key={h.id}
          spot={h}
          state={state?.id === h.id ? state.mode : "closed"}
          onPeek={() => setState({ id: h.id, mode: "peek" })}
          onOpen={() => setState({ id: h.id, mode: "open" })}
          onClose={() => setState(null)}
        />
      ))}
    </motion.div>
  );
}

/**
 * One product's scroll sequence. Large screens: a tall section with a
 * sticky stage; the product starts centred, turns a full circle and glides
 * to its side while the details land opposite, then holds with hotspots
 * live and the product switcher pinned bottom centre. Smaller screens and
 * reduced motion: the same content as a block, product above details.
 */
export function ProductStage({ product, index, onSwitch }: { product: Product; index: number; onSwitch: (id: Product["id"]) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const large = useIsLargeScreen();
  /* The scroll rig only runs on large screens without reduced motion; otherwise everything renders finished. */
  const rig = large && !reduced;
  const side = sideFor(index);
  const sign = side === "right" ? 1 : -1;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  /* Function transform keeps derived values in JS; see the Framer 13 note in handoff.md. */
  const scrubbed = useTransform(scrollYProgress, (v) => v);
  const still = useMotionValue(1);
  const progress = rig ? scrubbed : still;
  const rotateY = useTransform(progress, rotationAt);
  const x = useTransform(progress, (p) => `${glideAt(p) * GLIDE_VW * sign}vw`);
  const scale = useTransform(progress, (p) => 1.15 - 0.15 * glideAt(p));
  const options = PRODUCTS.map((p) => ({ id: p.id, label: p.name }));

  return (
    <div id={`product-${product.id}`} ref={ref} className={cn("relative", rig ? "lg:h-[180svh]" : "py-8")}>
      <div className={cn(rig && "lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden")}>
        <Container className="relative w-full py-16 lg:h-full lg:py-0">
          {/* Product: centred at the start, glides to its side. Below lg it simply sits above the details, turned a little so the depth reads. */}
          <div className="flex justify-center lg:absolute lg:inset-0 lg:items-center">
            <motion.div style={rig ? { x, scale } : undefined} className="relative">
              <ProductModel product={product} rotateY={rig ? rotateY : -24}>
                <Hotspots product={product} progress={progress} />
              </ProductModel>
            </motion.div>
          </div>
          {/* Details are anchored to a fixed top on lg so a longer tab only grows downwards; the grid passes pointer events through except on its own column. */}
          <div className="relative mt-10 lg:pointer-events-none lg:mt-0 lg:grid lg:h-full lg:grid-cols-2 lg:items-start lg:pt-[22svh]">
            <div className={cn("lg:pointer-events-auto", side === "right" ? "lg:col-start-1" : "lg:col-start-2")}>
              <Details product={product} progress={progress} side={side} />
            </div>
          </div>
          <ScrubReveal progress={progress} window={detailWindow(3, 4)} x={0} y={10} className="mt-8 flex justify-center lg:absolute lg:inset-x-0 lg:bottom-8 lg:mt-0">
            <ProductTabs options={options} active={product.id} onChange={(id) => onSwitch(id as Product["id"])} layoutGroup={`switch-${product.id}`} label="Choose a product" className="bg-paper shadow-sheet" />
          </ScrubReveal>
        </Container>
      </div>
    </div>
  );
}
