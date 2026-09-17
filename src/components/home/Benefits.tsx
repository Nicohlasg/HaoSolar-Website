import { Container } from "@/components/ui/Container";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { HouseIcon, ZapIcon, SunIcon } from "@/components/icons/AnimatedIcons";
import { cn } from "@/lib/cn";

const BENEFITS = [
  {
    title: "The founder is on your roof",
    body: "Hugh surveys, checks the install and answers the phone. Customers write about it in their reviews.",
    Icon: HouseIcon,
    lime: false,
  },
  {
    title: "Solar and EV, no subcontractors",
    body: "Panels, charger and the wiring between them, all by our own electricians. One warranty, one number to call.",
    Icon: ZapIcon,
    lime: true,
  },
  {
    title: "Drawn to fit your roof",
    body: "Layout drawn from a site measurement, simulated before quoting, priced as a fixed number.",
    Icon: SunIcon,
    lime: false,
  },
] as const;

/** Why choose Hao Solar: three neumorphic cards on the page grey. */
export function Benefits() {
  return (
    <section className="border-y border-rule bg-paper-2 py-20 sm:py-24">
      <Container>
        <Reveal direction="left" className="max-w-2xl">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>Fewer hands, more care.</DiaText>
          </h2>
        </Reveal>
        <Reveal as="ul" className="mt-12 grid gap-6 md:grid-cols-3" stagger={0.12}>
          {BENEFITS.map(({ title, body, Icon, lime }) => (
            <RevealItem key={title} as="li" className="neu group p-7">
              <span className={cn("neu-inset inline-flex h-14 w-14 items-center justify-center rounded-2xl", lime ? "text-forest" : "text-ink")}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold leading-tight">{title}</h3>
              <p className="mt-3 text-ink-2">{body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
