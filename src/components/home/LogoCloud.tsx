import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { CLIENTS, CLIENTS_HEADLINE, CLIENTS_KICKER, type Client } from "@/content/clients";
import { cn } from "@/lib/cn";

/** One row of logos, doubled so the loop is seamless. The second copy is hidden from assistive tech. */
function Row({ items, reverse, duration }: { items: readonly Client[]; reverse?: boolean; duration: string }) {
  return (
    <div className="marquee py-3">
      <ul className={cn("marquee-track items-center gap-10 sm:gap-14", reverse && "[animation-direction:reverse]")} style={{ animationDuration: duration }}>
        {[false, true].map((clone) =>
          items.map((c) => (
            <li key={`${c.slug}-${clone}`} aria-hidden={clone || undefined} className="flex shrink-0 items-center">
              <Image
                src={c.src}
                alt={clone ? "" : c.name}
                title={c.name}
                width={c.width}
                height={c.height}
                sizes="220px"
                className="h-10 w-auto max-w-[11rem] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12 sm:max-w-[13rem]"
              />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

/**
 * Two counter-scrolling rows of client marks with faded edges, after the
 * logo-cloud pattern from the reference list, hand-built on the site's own
 * CSS marquee: pauses on hover and focus, wraps into a static grid under
 * reduced motion. Logos are grey until hovered so the brand colours stay
 * quiet on the page.
 */
export function LogoCloud() {
  const half = Math.ceil(CLIENTS.length / 2);
  return (
    <section aria-labelledby="clients" className="border-t border-rule bg-paper py-16 sm:py-20">
      <Container>
        <Reveal direction="left" className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-forest">{CLIENTS_KICKER}</p>
          <h2 id="clients" className="mt-3 text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>{CLIENTS_HEADLINE}</DiaText>
          </h2>
        </Reveal>
      </Container>
      <Reveal className="mt-10" aria-label="Client logos">
        <Row items={CLIENTS.slice(0, half)} duration="48s" />
        <Row items={CLIENTS.slice(half)} reverse duration="56s" />
      </Reveal>
    </section>
  );
}
