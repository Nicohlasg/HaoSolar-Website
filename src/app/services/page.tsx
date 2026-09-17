import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { StatementLine } from "@/components/ui/StatementLine";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { SERVICES } from "@/content/services";
import { whatsappLink } from "@/config/site";
import { FaqChat } from "@/components/services/FaqChat";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Solar PV installation, EV charger installation and maintenance for landed homes and commercial roofs in Singapore.",
};

const PHOTO: Record<string, string> = {
  solar: "crew installing panels on a tiled terrace roof",
  "ev-charger": "wall-mounted EV charger in a landed home porch",
  maintenance: "panel cleaning with inverter check",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="pb-14 pt-28 sm:pb-20 sm:pt-36">
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">
            What we install, what is included, what to confirm.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">
            Three services, one crew. Landed homes and commercial roofs. Not HDB, and condos only with MCST approval.
          </p>
          <nav aria-label="Services" className="mt-8 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <a key={s.slug} href={`#${s.slug}`} className="rounded-sm border border-ink px-3 py-1.5 text-sm font-medium no-underline hover:bg-paper">
                {s.short}
              </a>
            ))}
          </nav>
        </Container>
      </section>

      {SERVICES.map((s, i) => (
        <section key={s.slug} id={s.slug} className={i % 2 === 1 ? "border-y border-rule bg-paper-2/60" : undefined}>
          <Container className="grid gap-10 py-20 md:grid-cols-[1.2fr_1fr] md:gap-16 sm:py-24">
            <div>
              <h2 className="text-3xl font-semibold sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-lg text-ink-2">{s.lead}</p>
              <h3 className="mt-8 text-base font-semibold">Included in the quotation</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {s.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={whatsappLink(`Hi Hao Solar, I'd like a quote for ${s.title.toLowerCase()}.`)} external>
                  Ask for a quote on WhatsApp
                </Button>
                {s.slug === "solar" ? (
                  <Button href="/calculator" variant="outline">
                    Estimate my roof first
                  </Button>
                ) : null}
              </div>
            </div>
            <div>
              <PhotoPlaceholder label={PHOTO[s.slug]} ratio="4/3" />
              <div className="sheet mt-5 p-5">
                <h3 className="text-base font-semibold">Key facts</h3>
                <div className="mt-2">
                  {s.facts.map((f) => (
                    <StatementLine key={f.label} label={f.label} value={f.value} toConfirm={f.toConfirm} />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      ))}
      <FaqChat />
    </>
  );
}
