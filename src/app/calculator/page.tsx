import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CalculatorLive } from "@/components/calculator/CalculatorLive";

export const metadata: Metadata = {
  title: "Solar savings calculator",
  description: "Move the sliders and watch the estimate: system size, cost range, savings, payback, 25-year cumulative savings and CO₂ avoided, for a Singapore landed home.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CalculatorPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = typeof params.postal === "string" ? params.postal : undefined;
  const initialPostal = raw && /^\d{6}$/.test(raw) ? raw : undefined;

  return (
    <>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="pb-12 pt-28 sm:pb-16 sm:pt-36">
          <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">How much would your roof take off the bill?</h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-2">
            Move the sliders. The statement, the 25-year chart and the CO₂ figures update as you go. A range, never a single price; the fixed number comes after a free survey.
          </p>
        </Container>
      </section>
      <div className="py-12 sm:py-16">
        <CalculatorLive initialPostal={initialPostal} />
      </div>
    </>
  );
}
