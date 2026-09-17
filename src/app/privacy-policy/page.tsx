import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";

export const metadata: Metadata = { title: "Privacy policy" };

/** STUB. To be rewritten for PDPA before launch: what is stored, retention, withdrawal. */
export default function PrivacyPolicyPage() {
  return (
    <Container className="max-w-3xl pb-16 pt-28 sm:pb-20 sm:pt-32">
      <h1 className="text-4xl font-semibold">Privacy policy</h1>
      <p className="mt-4 text-alert">Draft placeholder. The PDPA policy covering the enquiry form and the calculator is being written.</p>
      <p className="mt-6 text-ink-2">
        {SITE.legalName} collects the details you enter in the enquiry form or the savings calculator (name, contact
        details, property information) to respond to your enquiry. To withdraw consent or ask what we hold, write to{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </Container>
  );
}
