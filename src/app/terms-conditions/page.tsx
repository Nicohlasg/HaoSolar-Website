import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Terms and conditions" };

/** STUB. Hugh supplies the standard quotation terms. */
export default function TermsPage() {
  return (
    <Container className="max-w-3xl pb-16 pt-28 sm:pb-20 sm:pt-32">
      <h1 className="text-4xl font-semibold">Terms and conditions</h1>
      <p className="mt-4 text-alert">Draft placeholder. Standard terms to be supplied by Hao Solar.</p>
    </Container>
  );
}
