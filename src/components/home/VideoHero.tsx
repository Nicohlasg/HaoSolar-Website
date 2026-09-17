"use client";

import { useCallback, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { VideoFrame } from "@/components/media/VideoFrame";
import { PROJECTS, type Project } from "@/content/projects";
import { HERO_CLIP } from "@/content/media";
import { cueAt } from "@/lib/hero";
import { ParallaxLayers } from "./ParallaxLayers";
import { HeroSlideshow } from "./HeroSlideshow";
import { HeroCue } from "./HeroCue";
import { PostalCodeForm } from "./PostalCodeForm";

const TRUST = ["Founder on every site", "Our own crew", "LEW certified"] as const;

/** Roofs the reel (or the slideshow) passes over: photographed landed jobs plus one commercial roof if there is one. */
const REEL = [...PROJECTS.filter((p) => p.category === "landed" && p.photos).slice(0, 5), ...PROJECTS.filter((p) => p.category === "commercial" && p.photos).slice(0, 1)];

/**
 * Full-bleed film hero. The footage owns the frame: gradient only on the
 * lower part, headline bottom-left, a caption chip that names the roof on
 * screen, and a slim bottom bar with the postal code form and the trust
 * line. Until footage arrives the slideshow stands in and drives the chip.
 */
export function VideoHero() {
  const [current, setCurrent] = useState<Project | null>(null);
  const [progress, setProgress] = useState<ReactNode>(null);
  const onTime = useCallback((seconds: number) => {
    const id = cueAt(HERO_CLIP.cues, seconds);
    setCurrent((prev) => (prev?.id === id ? prev : (PROJECTS.find((p) => p.id === id) ?? null)));
  }, []);

  return (
    <ParallaxLayers className="relative isolate min-h-[100svh] overflow-hidden bg-ink text-paper">
      {HERO_CLIP.src ? <VideoFrame clip={HERO_CLIP} fill dark onTime={onTime} /> : <HeroSlideshow slides={REEL} onChange={setCurrent} renderProgress={setProgress} />}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink via-ink/55 to-transparent" />
      {/* Extra bottom room below sm clears the fixed WhatsApp bar. */}
      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-24 pt-28 sm:pb-8" data-parallax="2">
        <div className="max-w-2xl">
          <HeroCue project={current} />
          <h1 className="mt-4 text-[2.4rem] font-semibold leading-[1] sm:text-5xl lg:text-6xl">Sun on the roof, less on the bill.</h1>
          <p className="mt-4 max-w-lg text-lg text-paper/80">Solar and EV chargers for landed homes and factory roofs. Installed by our own crew.</p>
        </div>
        <div className="mt-8 flex flex-col gap-4 border-t border-paper/20 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <PostalCodeForm className="w-full max-w-md" size="md" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/70">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {TRUST.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            {progress}
          </div>
        </div>
      </Container>
    </ParallaxLayers>
  );
}
