import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { INSIGHTS } from "@/content/insights";

export const metadata: Metadata = {
  title: "Solar guides for Singapore",
  description: "Plain-language guides on solar for landed homes in Singapore: savings, net metering, EV charging.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="pb-14 pt-28 sm:pb-20 sm:pt-36">
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">Read up before we climb up.</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">Short, honest reads. Numbers come from the same model as the calculator.</p>
        </Container>
      </section>
      <Container className="py-14 sm:py-20">
        <ul className="grid gap-8 md:grid-cols-3">
          {INSIGHTS.map((a) => (
            <li key={a.slug}>
              <Link href={`/insights/${a.slug}`} className="group block no-underline">
                <PhotoPlaceholder label={`cover image for: ${a.title}`} ratio="16/9" hideCaption />
                <p className="mt-4 text-xs text-ink-2 tnum">
                  {a.readMinutes} min read{a.draft ? " · draft" : ""}
                </p>
                <h2 className="mt-1 text-xl font-semibold leading-snug group-hover:underline group-hover:decoration-lime group-hover:decoration-[3px] group-hover:underline-offset-4">{a.title}</h2>
                <p className="mt-2 text-sm text-ink-2">{a.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
