import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { SERVICES } from "@/content/services";
import { SunIcon, ZapIcon, WrenchIcon, ArrowIcon } from "@/components/icons/AnimatedIcons";

const ICON = { solar: SunIcon, "ev-charger": ZapIcon, maintenance: WrenchIcon } as const;

export function ServicesTeaser() {
  return (
    <section className="border-y border-rule bg-paper-2/60 py-20 sm:py-24">
      <Container>
        <Reveal direction="left" className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>What goes on the roof and in the garage.</DiaText>
          </h2>
        </Reveal>
        <ul className="mt-10 divide-y divide-rule border-y border-rule">
          {SERVICES.map((s) => {
            const Icon = ICON[s.slug];
            return (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="group grid gap-3 py-7 no-underline transition-colors hover:bg-paper md:grid-cols-[1.1fr_1.4fr_auto] md:items-center md:gap-8"
                >
                  <h3 className="flex items-center gap-3 text-2xl font-semibold leading-tight">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    {s.title}
                  </h3>
                  <p className="text-ink-2">{s.lead}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-ink">
                    What is included <ArrowIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
