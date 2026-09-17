"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { PROJECTS } from "@/content/projects";
import { MAP_CAPTION, STRENGTHS, STRENGTHS_HEADLINE, STRENGTHS_KICKER, STRENGTHS_LEDE } from "@/content/strengths";
import { cardSide, clampPan, clusterMarkers, HOME_VIEW, inFilter, MAP_FILTERS, toBoxPx, toPercent, ZOOM, zoomAround, type Box, type MapFilter, type View } from "@/lib/map";
import { EASE_OUT, usePrefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SingaporeMap } from "./SingaporeMap";
import { MapMarkers, type Dot } from "./MapMarkers";
import { MarkerCard } from "./MarkerCard";
import { ClusterCard } from "./ClusterCard";
import { MapZoomControls } from "./MapZoomControls";
import { ReviewTicker } from "./ReviewTicker";

/** Grace period for the cursor to cross from a marker into its card. */
const CLOSE_DELAY_MS = 260;
/** Below this movement a pointer down and up on the map counts as a tap, not a drag. */
const DRAG_THRESHOLD_PX = 4;

function FilterToggle({ value, onChange }: { value: MapFilter; onChange: (v: MapFilter) => void }) {
  return (
    <div role="group" aria-label="Show jobs for" className="inline-flex rounded-full border border-paper/20 bg-ink/70 p-1 backdrop-blur">
      {MAP_FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          aria-pressed={value === f.value}
          onClick={() => onChange(f.value)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
            value === f.value ? "bg-paper text-ink" : "text-paper/70 hover:text-paper",
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function Strengths() {
  return (
    <Reveal as="ul" className="mt-8 border-t border-paper/15" stagger={0.08}>
      {STRENGTHS.map((s) => (
        <RevealItem key={s.label} as="li" className="border-b border-paper/15 py-3">
          <div className="leader text-[0.95rem]">
            <span className="text-paper/70">{s.label}</span>
            <span className="font-semibold text-paper">{s.value}</span>
          </div>
          <p className="mt-0.5 text-xs text-paper/50">{s.proof}</p>
        </RevealItem>
      ))}
    </Reveal>
  );
}

type Target = { kind: "dot"; id: string } | { kind: "cluster"; key: string } | null;

/** Open on enter, close a beat after leaving marker or card, so the cursor can cross between them. */
function useHoverTarget() {
  const [target, setTarget] = useState<Target>(null);
  const timer = useRef<number | null>(null);
  const cancel = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);
  const openDot = useCallback(
    (id: string) => {
      cancel();
      setTarget({ kind: "dot", id });
    },
    [cancel],
  );
  const openCluster = useCallback(
    (key: string) => {
      cancel();
      setTarget({ kind: "cluster", key });
    },
    [cancel],
  );
  const close = useCallback(() => {
    cancel();
    setTarget(null);
  }, [cancel]);
  const leave = useCallback(() => {
    cancel();
    timer.current = window.setTimeout(() => setTarget(null), CLOSE_DELAY_MS);
  }, [cancel]);
  useEffect(() => cancel, [cancel]);
  return { target, openDot, openCluster, close, leave, cancel };
}

/** The map box's size in px, kept current on resize. */
function useBox(ref: React.RefObject<HTMLDivElement | null>): Box {
  const [box, setBox] = useState<Box>({ w: 1, h: 1 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setBox({ w: el.clientWidth || 1, h: el.clientHeight || 1 });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return box;
}

/**
 * One stage: the island sits to the right of the copy. The visitor zooms
 * with the buttons, Ctrl or Cmd plus wheel, or by hovering a dot; drags to
 * pan. Dots that crowd together on screen merge into a numbered disc that
 * opens a list; zooming in splits them back into single dots with cards.
 * Below lg everything stacks and the cards become panels under the map.
 */
export function IslandMap() {
  const [filter, setFilter] = useState<MapFilter>("landed");
  const reduced = usePrefersReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const box = useBox(frameRef);
  const [view, setView] = useState<View>(HOME_VIEW);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; y: number; vx: number; vy: number; moved: boolean } | null>(null);
  const { target, openDot, openCluster, close, leave, cancel } = useHoverTarget();

  /* Every real job is a dot, photographed or not. */
  const projects = useMemo(() => PROJECTS.filter((p) => !p.sample), []);
  const hasCommercial = projects.some((p) => p.category === "commercial");
  const dots: Dot[] = useMemo(
    () => projects.filter((p) => inFilter(p.category, filter)).map((p) => ({ id: p.id, at: toPercent(p.geo.lat, p.geo.lng), project: p })),
    [projects, filter],
  );

  /* Hovering a dot zooms in a step further from the current view, around that dot; leaving returns to the view. */
  const activeDot = target?.kind === "dot" ? (dots.find((d) => d.id === target.id) ?? null) : null;
  const shown = activeDot ? zoomAround(view, activeDot.at, view.z * ZOOM.hover, box) : view;
  const clusters = useMemo(() => clusterMarkers(dots, box, view), [dots, box, view]);
  const activeCluster = target?.kind === "cluster" ? (clusters.find((c) => c.key === target.key) ?? null) : null;
  const activePx = activeDot ? toBoxPx(activeDot.at, box, shown) : activeCluster ? toBoxPx(activeCluster.at, box, shown) : null;

  const zoomBy = useCallback((factor: number) => setView((v) => zoomAround(v, { x: 50, y: 50 }, v.z * factor, box)), [box]);
  const reset = useCallback(() => setView(HOME_VIEW), []);
  const pick = useCallback(
    (id: string) => {
      const d = dots.find((x) => x.id === id);
      if (!d) return;
      setView((v) => zoomAround(v, d.at, Math.max(v.z * 2.5, 3), box));
      openDot(id);
    },
    [dots, box, openDot],
  );

  /* Ctrl or Cmd plus wheel zooms at the cursor; a plain wheel keeps scrolling the page. Native listener so preventDefault works. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.002);
      setView((v) => {
        // Undo the current view to find the map point under the cursor, then zoom around it.
        const cx = (e.clientX - r.left - r.width / 2 - v.x) / v.z;
        const cy = (e.clientY - r.top - r.height / 2 - v.y) / v.z;
        const pct = { x: (cx / r.width + 0.5) * 100, y: (cy / r.height + 0.5) * 100 };
        return zoomAround(v, pct, v.z * factor, { w: r.width, h: r.height });
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
      close();
    }
    setView((v) => clampPan({ ...v, x: d.vx + dx, y: d.vy + dy }, box));
  }
  function onPointerUp() {
    drag.current = null;
    setDragging(false);
  }

  const floatingCard =
    activeDot && activePx ? (
      <MarkerCard project={activeDot.project} floating at={activePx} side={cardSide((activePx.x / box.w) * 100)} onEnter={cancel} onLeave={close} />
    ) : activeCluster && activePx ? (
      <ClusterCard projects={activeCluster.items.map((i) => i.project)} floating at={activePx} side={cardSide((activePx.x / box.w) * 100)} onPick={pick} onEnter={cancel} onLeave={close} />
    ) : null;
  const zoomControls = <MapZoomControls onIn={() => zoomBy(ZOOM.step)} onOut={() => zoomBy(1 / ZOOM.step)} onReset={reset} canIn={view.z < ZOOM.max} canOut={view.z > ZOOM.min} />;

  return (
    <section className="island-stage relative min-h-[100svh] overflow-hidden text-paper" aria-labelledby="island-map">
      <div className="relative min-h-[100svh]">
        <Container className="relative z-10 pointer-events-none pt-16 pb-10 lg:pt-24 lg:pb-0">
          <div className="max-w-sm">
            <Reveal direction="left">
              <p className="text-xs font-medium uppercase tracking-wide text-lime">{STRENGTHS_KICKER}</p>
              <h2 id="island-map" className="mt-3 text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
                <DiaText colors={["#d8ff32", "#ffffff", "#d8ff32"]}>{STRENGTHS_HEADLINE}</DiaText>
              </h2>
              <p className="mt-4 text-lg text-paper/75">{STRENGTHS_LEDE}</p>
            </Reveal>
            <Strengths />
            <ReviewTicker className="mt-6" />
          </div>
        </Container>

        {/* Map box: full width below lg; on lg it sits to the right of the copy, vertically centred. */}
        <div className="relative mx-auto w-full lg:absolute lg:right-[3%] lg:top-1/2 lg:w-[min(56%,130svh)] lg:-translate-y-1/2">
          <div className="lg:hidden">
            <Container className="pb-6">
              <FilterToggle value={filter} onChange={setFilter} />
            </Container>
          </div>
          {/* No clip here: the zoomed island bleeds to the section's edges, which clip at the viewport. */}
          <div
            ref={frameRef}
            className={cn("relative touch-none", dragging ? "cursor-grabbing" : "cursor-grab")}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <motion.div
              className="relative"
              animate={{ scale: shown.z, x: shown.x, y: shown.y }}
              transition={reduced || dragging ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT }}
              style={{ transformOrigin: "50% 50%" }}
            >
              <SingaporeMap tone="ink" className="h-auto w-full" />
              <MapMarkers
                clusters={clusters}
                zoom={shown.z}
                activeId={activeDot?.id ?? null}
                activeClusterKey={activeCluster?.key ?? null}
                onOpen={openDot}
                onOpenCluster={openCluster}
                onLeave={leave}
                onClose={close}
              />
            </motion.div>
            <div className="hidden lg:block">{floatingCard}</div>
          </div>
        </div>

        <div className="lg:hidden">
          <Container className="pt-6 pb-16">
            {activeDot ? (
              <MarkerCard project={activeDot.project} floating={false} />
            ) : activeCluster ? (
              <ClusterCard projects={activeCluster.items.map((i) => i.project)} floating={false} onPick={pick} />
            ) : (
              <p className="text-sm text-paper/60">Tap a dot on the map. Numbered discs hold several roofs.</p>
            )}
            <div className="mt-4">{zoomControls}</div>
            <p className="mt-6 text-xs text-paper/50">{MAP_CAPTION}</p>
          </Container>
        </div>

        <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block">
          <FilterToggle value={filter} onChange={setFilter} />
        </div>
        <div className="absolute bottom-6 right-10 hidden items-end gap-4 lg:flex">
          <p className="pointer-events-none max-w-xs text-right text-xs text-paper/50">
            {filter === "commercial" && !hasCommercial ? "Commercial roofs are being photographed. Back soon." : MAP_CAPTION}
            <span className="mt-1 block text-paper/35">Drag to pan. Ctrl or ⌘ and scroll to zoom.</span>
          </p>
          {zoomControls}
        </div>
      </div>
    </section>
  );
}
