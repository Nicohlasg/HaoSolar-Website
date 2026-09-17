import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DiaText } from "@/components/ui/DiaText";
import { MessageIcon } from "@/components/icons/AnimatedIcons";
import { QuickLeadForm } from "@/components/contact/QuickLeadForm";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { SITE, whatsappLink } from "@/config/site";

/** Home contact: short form, WhatsApp, office map. */
export function ContactSection() {
  return (
    <section id="contact" className="border-t border-rule bg-paper-2/60 py-20 sm:py-24">
      <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal direction="left">
          <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
            <DiaText>Send a note, get a quote.</DiaText>
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-2">Name, number and what kind of roof. We call during opening hours, {SITE.hours}.</p>
          <div className="mt-8 sheet p-5 sm:p-6">
            <QuickLeadForm />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button href={whatsappLink("Hi Hao Solar, I'd like a solar plan for my house.")} external variant="secondary" size="lg" className="group">
              <MessageIcon className="h-5 w-5" />
              Or WhatsApp {SITE.phoneDisplay}
            </Button>
          </div>
        </Reveal>
        <Reveal direction="right">
          <OfficeMap className="h-72 w-full lg:h-[26rem]" />
          <div className="mt-4 text-sm text-ink-2">
            <p className="font-medium text-ink">{SITE.legalName}</p>
            <p>
              {SITE.address.line1}, {SITE.address.line2}
            </p>
            <p>{SITE.hours}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
