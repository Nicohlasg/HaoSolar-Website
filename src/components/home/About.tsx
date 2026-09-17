import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { StatementLine } from "@/components/ui/StatementLine";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import Image from "next/image";
import { SITE } from "@/config/site";

/** About: founder, crew, accreditations. Copy from the current site's About page, trimmed. */
export function About() {
  return (
    <section id="about" className="border-y border-rule bg-paper-2/60 py-20 sm:py-24">
      <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <Reveal direction="left">
          <PhotoPlaceholder label="Hugh Chan on a roof with the crew, portrait orientation" ratio="3/4" className="max-w-sm" />
        </Reveal>
        <Reveal direction="right">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>Started by an engineer who still climbs the ladder.</DiaText>
          </h2>
          <p className="mt-5 text-lg text-ink-2">
            Hugh Chan set up Hao Solar in {SITE.since} to do solar and EV charging properly for Singapore homes: measured on site,
            designed and simulated before quoting, installed by a crew he trained, and looked after once the meter is in.
          </p>
          <p className="mt-4 text-ink-2">
            The company serves landed homeowners, commercial buildings and factories. It has been recognised as SME500 and E100 in
            2024, and holds a 5.0 rating on Google from the customers it has served so far.
          </p>
          <ul className="mt-6 flex flex-wrap items-center gap-4" aria-label="Awards">
            {SITE.accreditations.map((a) => (
              <li key={a.label}>
                <Image src={a.image} alt={a.title} width={a.width} height={a.height} className="h-16 w-auto" />
              </li>
            ))}
          </ul>
          <div className="mt-6 max-w-md border-t border-rule pt-2">
            <StatementLine label="Founder" value="Hugh Chan" />
            <StatementLine label="Crew" value="In-house, no subcontractors" />
            <StatementLine label="Awards" value={SITE.accreditations.map((a) => `${a.label} ${a.year}`).join(", ")} />
            <StatementLine label="Certified" value={SITE.certifications.map((c) => c.label.split(":")[0]).join(", ")} />
            <StatementLine label="Office" value="North Link Building, Admiralty" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
