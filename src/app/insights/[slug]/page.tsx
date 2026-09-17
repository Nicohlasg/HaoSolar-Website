import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { INSIGHTS, WORKED_EXAMPLES } from "@/content/insights";
import { SOLAR_MODEL } from "@/config/solar-model";
import { estimate } from "@/lib/calc";
import { formatNumber, formatSgd } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = INSIGHTS.find((i) => i.slug === slug);
  return a ? { title: a.title, description: a.summary } : {};
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const article = INSIGHTS.find((i) => i.slug === slug);
  if (!article) notFound();
  const M = SOLAR_MODEL;
  const isWorked = article.slug.startsWith("is-solar-worth-it");

  return (
    <article>
      <section className="border-b border-rule bg-paper-2/60">
        <Container className="max-w-3xl pb-12 pt-28 sm:pb-16 sm:pt-36">
          <Link href="/insights" className="text-sm text-ink-2">
            Solar guides
          </Link>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-sm text-ink-2 tnum">
            {article.readMinutes} min read · updated {article.date}
            {article.draft ? " · draft" : ""}
          </p>
        </Container>
      </section>
      <Container className="max-w-3xl py-12 sm:py-16">
        <div className="grid gap-5 text-lg leading-relaxed text-ink">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {isWorked ? (
          <>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[40rem] text-sm">
                <thead>
                  <tr className="border-b border-ink text-left">
                    <th className="py-2 pr-4 font-semibold">Property type</th>
                    <th className="py-2 pr-4 font-semibold">Typical system</th>
                    <th className="py-2 pr-4 font-semibold">Est. annual generation</th>
                    <th className="py-2 pr-4 font-semibold">Est. year-1 saving</th>
                    <th className="py-2 font-semibold">Typical payback</th>
                  </tr>
                </thead>
                <tbody className="tnum">
                  {WORKED_EXAMPLES.map((row) => {
                    const r = estimate({ roofAreaM2: row.roofM2, monthlyBillSgd: row.bill, usagePattern: "daytime", phase: "three" });
                    const yearly = (r.monthlySavingsSgd + (r.monthlyExportCreditSgd ?? 0)) * 12;
                    return (
                      <tr key={row.type} className="border-b border-rule">
                        <td className="py-2.5 pr-4">{row.type}</td>
                        <td className="py-2.5 pr-4">{r.systemKwp} kWp</td>
                        <td className="py-2.5 pr-4">~{formatNumber(r.annualKwh)} kWh</td>
                        <td className="py-2.5 pr-4">~{formatSgd(yearly)}</td>
                        <td className="py-2.5">
                          ~{r.paybackYearsLow} to {r.paybackYearsHigh} years
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-ink-2">
              Indicative estimates, not a quotation. Assumptions: SP Group tariff {(M.TARIFF_SGD_PER_KWH * 100).toFixed(2)} cents per kWh
              including GST (Q3 2026); export credit about S${M.EXPORT_RATE_SGD_PER_KWH ?? "n/a"} per kWh under the Simplified Credit Treatment
              scheme (to confirm); {Math.round(M.ANNUAL_YIELD_KWH_PER_KWP * M.PERFORMANCE_RATIO).toLocaleString("en-SG")} kWh per kWp a year
              delivered; installed cost S${M.PRICE_PER_KWP_LOW} to S${M.PRICE_PER_KWP_HIGH} per kWp before GST; daytime self-consumption{" "}
              {Math.round(M.SELF_CONSUMPTION.daytime * 100)}%. Homes that use more electricity in daylight reach faster payback. Actual results
              depend on roof orientation, shading and consumption.
            </p>
          </>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-rule pt-8">
          <Button href="/calculator">Run your own numbers</Button>
          <Button href="/contact" variant="outline">
            Book a free survey
          </Button>
        </div>
      </Container>
    </article>
  );
}
