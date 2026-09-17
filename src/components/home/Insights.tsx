import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { ArrowIcon } from "@/components/icons/AnimatedIcons";
import { INSIGHTS } from "@/content/insights";

export function Insights() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <Reveal direction="left" className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
              <DiaText>Read up before we climb up.</DiaText>
            </h2>
            <p className="mt-4 text-lg text-ink-2">What we tell people at the survey, written down.</p>
          </div>
          <Link href="/insights" className="group inline-flex items-center gap-1 font-medium">
            All guides <ArrowIcon className="h-4 w-4" />
          </Link>
        </Reveal>
        <Reveal as="ul" className="mt-12 grid gap-8 md:grid-cols-3" stagger={0.1}>
          {INSIGHTS.map((a) => (
            <RevealItem key={a.slug} as="li">
              <Link href={`/insights/${a.slug}`} className="group block no-underline">
                <PhotoPlaceholder label={`cover image for: ${a.title}`} ratio="16/9" hideCaption />
                <p className="mt-4 text-xs text-ink-2 tnum">
                  {a.readMinutes} min read{a.draft ? " · draft" : ""}
                </p>
                <h3 className="mt-1 text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-lime group-hover:decoration-[3px] group-hover:underline-offset-4">{a.title}</h3>
                <p className="mt-2 text-sm text-ink-2">{a.summary}</p>
              </Link>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
