import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { InfiniteSlider } from "@/components/ui/InfiniteSlider";
import { ProgressiveBlur } from "@/components/ui/ProgressiveBlur";
import { Reveal } from "@/components/ui/Reveal";
import { CLIENTS, CLIENTS_HEADLINE, CLIENTS_KICKER } from "@/content/clients";

/**
 * The logo-cloud-4 pattern from the reference list: one slider of client
 * marks in a band that runs edge to edge, hairlines above and below, a
 * progressive blur at both ends so marks dissolve as they leave, and a
 * slower glide while the pointer rests on it. Logos sit at one height so
 * the row reads as a line.
 */
export function LogoCloud() {
  return (
    <section aria-labelledby="clients" className="border-t border-rule bg-paper py-16 sm:py-20">
      <Container>
        <Reveal>
          <h2 id="clients" className="mb-8 text-center">
            <span className="block text-xl font-medium text-ink-2 sm:text-2xl">{CLIENTS_KICKER}</span>
            <span className="mt-1 block font-display text-2xl font-semibold tracking-tight sm:text-3xl">{CLIENTS_HEADLINE}</span>
          </h2>
        </Reveal>
      </Container>
      <Reveal>
        <div className="relative w-full border-y border-rule bg-gradient-to-r from-paper-2 via-transparent to-paper-2 py-6">

          <InfiniteSlider gap={42} reverse speed={60} speedOnHover={20}>
            {CLIENTS.map((c) => (
              <Image
                key={c.slug}
                src={c.src}
                alt={c.name}
                title={c.name}
                width={c.width}
                height={c.height}
                sizes="200px"
                className="pointer-events-none h-7 w-auto max-w-[10rem] select-none object-contain md:h-9"
              />
            ))}
          </InfiniteSlider>

          <ProgressiveBlur blurIntensity={1} className="pointer-events-none absolute left-0 top-0 h-full w-[120px] sm:w-[200px]" direction="left" />
          <ProgressiveBlur blurIntensity={1} className="pointer-events-none absolute right-0 top-0 h-full w-[120px] sm:w-[200px]" direction="right" />
        </div>
      </Reveal>
    </section>
  );
}
