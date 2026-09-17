import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { StatementLine } from "@/components/ui/StatementLine";
import Image from "next/image";
import { OfficeMap } from "@/components/contact/OfficeMap";
import { ContactForm } from "@/components/contact/ContactForm";
import { SITE, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "WhatsApp, call or send an enquiry to Hao Solar. Open 8am to 6pm daily.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="pb-14 pt-28 sm:pb-20 sm:pt-36">
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">Send us the address and the last bill.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">
            That is enough for a first answer. WhatsApp is fastest. The form goes to the same people.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={whatsappLink("Hi Hao Solar, here is my address and my last bill.")} external size="lg">
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp {SITE.phoneDisplay}
            </Button>
            <Button href={`tel:${SITE.phoneE164}`} variant="outline" size="lg">
              Call {SITE.phoneDisplay}
            </Button>
          </div>
        </Container>
      </section>
      <Container className="grid gap-12 py-16 md:grid-cols-[1.2fr_1fr] md:gap-16 sm:py-20">
        <div>
          <h2 className="text-2xl font-semibold">Enquiry form</h2>
          <p className="mt-2 text-ink-2">We reply during opening hours, {SITE.hours}.</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
        <aside>
          <div className="sheet p-5 sm:p-6">
            <h2 className="text-base font-semibold">Office</h2>
            <div className="mt-2">
              <StatementLine label="Company" value={SITE.legalName} />
              <StatementLine label="UEN" value={SITE.uen} />
              <StatementLine label="Hours" value={SITE.hours} />
              <StatementLine label="Email" value={<a href={`mailto:${SITE.email}`}>{SITE.email}</a>} />
            </div>
            <address className="mt-4 not-italic text-ink-2">
              {SITE.address.line1}
              <br />
              {SITE.address.line2}
            </address>
          </div>
          <OfficeMap className="mt-5 h-72 w-full" />
          <div className="sheet mt-5 flex items-center gap-4 p-4">
            <Image src="/images/google-review-qr.png" alt="QR code linking to Hao Solar's Google reviews" width={132} height={132} className="h-20 w-20" />
            <div className="text-sm">
              <p className="font-medium">Already a customer?</p>
              <p className="text-ink-2">
                Scan to leave a Google review, or{" "}
                <a href={SITE.google.placeUrl} target="_blank" rel="noopener noreferrer">
                  open the review page
                </a>
                .
              </p>
            </div>
          </div>
        </aside>
      </Container>
    </>
  );
}
