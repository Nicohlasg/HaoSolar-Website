"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { RoofTile } from "@/components/home/RoofTile";
import { UsageBars } from "@/components/home/UsageBars";
import { OptionGrid } from "./OptionGrid";
import { Diversion } from "./Diversion";
import { LeadForm } from "./LeadForm";
import { SavingsChart } from "./SavingsChart";
import { SOLAR_MODEL, type ElectricalPhase, type UsagePattern } from "@/config/solar-model";
import { billOffset, co2Tonnes, cumulativeSavings, estimate, isServedByCalculator, treesEquivalent, type PropertyType } from "@/lib/calc";
import { formatNumber, formatSgd } from "@/lib/format";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { CalculatorState, EvAnswer } from "./state";

const M = SOLAR_MODEL;
type HouseType = keyof typeof M.TYPICAL_KWP;

const HOUSE_OPTIONS = [
  { value: "terrace", label: "Terrace house", hint: `${M.TYPICAL_KWP.terrace.low} to ${M.TYPICAL_KWP.terrace.high} kWp` },
  { value: "semi", label: "Semi-detached", hint: `${M.TYPICAL_KWP.semi.low} to ${M.TYPICAL_KWP.semi.high} kWp` },
  { value: "bungalow", label: "Bungalow", hint: `${M.TYPICAL_KWP.bungalow.low} to ${M.TYPICAL_KWP.bungalow.high} kWp` },
  { value: "gcb", label: "Good Class Bungalow", hint: `${M.TYPICAL_KWP.gcb.low} to ${M.TYPICAL_KWP.gcb.high} kWp` },
] as const;

/**
 * One-page calculator: inputs on the left update the statement, chart and
 * environmental figures on the right as you move the sliders.
 */
export function CalculatorLive({ initialPostal }: { initialPostal?: string }) {
  const reduced = usePrefersReducedMotion();
  const [property, setProperty] = useState<PropertyType>("landed");
  const [house, setHouse] = useState<HouseType>("terrace");
  const [roofArea, setRoofArea] = useState<number>(M.TYPICAL_KWP.terrace.roofM2);
  const [bill, setBill] = useState(350);
  const [usage, setUsage] = useState<UsagePattern>("daytime");
  const [phase, setPhase] = useState<ElectricalPhase>("three");
  const [ev, setEv] = useState<EvAnswer>("notyet");
  const [showLead, setShowLead] = useState(false);

  const result = useMemo(() => estimate({ roofAreaM2: roofArea, monthlyBillSgd: bill, usagePattern: usage, phase }), [roofArea, bill, usage, phase]);
  const offset = billOffset(result, bill);
  const low = useMemo(() => cumulativeSavings(result, result.priceLowSgd), [result]);
  const high = useMemo(() => cumulativeSavings(result, result.priceHighSgd), [result]);
  const share = Math.min(result.monthlySavingsSgd / Math.max(bill, 1), 1);
  const diverted = !isServedByCalculator(property);

  function pickHouse(h: HouseType) {
    setHouse(h);
    setRoofArea(M.TYPICAL_KWP[h].roofM2);
  }

  const leadState: CalculatorState = {
    propertyType: property,
    postalCode: initialPostal ?? "",
    roofAreaM2: roofArea,
    roofMaterial: null,
    storeys: null,
    phase,
    monthlyBillSgd: bill,
    retailer: null,
    usagePattern: usage,
    ev,
  };

  return (
    <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-14">
      {/* Inputs */}
      <div className="grid gap-8 lg:sticky lg:top-24 lg:self-start">
        <div>
          <h2 className="text-lg font-semibold">1. Property</h2>
          <div className="mt-3">
            <OptionGrid
              name="Property type"
              value={property}
              onChange={setProperty}
              options={[
                { value: "landed", label: "Landed house" },
                { value: "commercial", label: "Commercial or industrial" },
                { value: "condo", label: "Condominium" },
                { value: "hdb", label: "HDB flat" },
              ]}
            />
          </div>
          {diverted && (property === "hdb" || property === "condo") ? (
            <div className="mt-4">
              <Diversion type={property} onBack={() => setProperty("landed")} />
            </div>
          ) : null}
        </div>

        {!diverted ? (
          <>
            {property === "landed" ? (
              <div>
                <h2 className="text-lg font-semibold">2. House type</h2>
                <div className="mt-3">
                  <OptionGrid name="House type" value={house} onChange={pickHouse} options={HOUSE_OPTIONS} />
                </div>
              </div>
            ) : null}

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{property === "landed" ? "3" : "2"}. Usable roof area</h2>
                <span className="font-display text-2xl font-semibold tnum">{roofArea} m²</span>
              </div>
              <input type="range" aria-label="Usable roof area in square metres" min={20} max={property === "commercial" ? 2000 : 600} step={5} value={roofArea} onChange={(e) => setRoofArea(Number(e.target.value))} className="mt-3 w-full cursor-pointer accent-ink" />
              <p className="mt-1 text-xs text-ink-2">Roughly the roof footprint. The survey measures it properly.</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold">{property === "landed" ? "4" : "3"}. Monthly electricity bill</h2>
                <span className="font-display text-2xl font-semibold tnum">{formatSgd(bill)}</span>
              </div>
              <input type="range" aria-label="Monthly bill in Singapore dollars" min={100} max={5000} step={10} value={bill} onChange={(e) => setBill(Number(e.target.value))} className="mt-3 w-full cursor-pointer accent-ink" />
              <div className="mt-3 flex items-center gap-3">
                <label htmlFor="bill-exact" className="text-sm text-ink-2">
                  Exact amount
                </label>
                <Input id="bill-exact" type="number" inputMode="decimal" min={0} value={bill} onChange={(e) => setBill(Math.max(0, Number(e.target.value)))} className="max-w-32 tnum" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">{property === "landed" ? "5" : "4"}. When is electricity used?</h2>
              <div className="mt-3">
                <OptionGrid
                  name="Usage pattern"
                  value={usage}
                  onChange={setUsage}
                  options={[
                    { value: "daytime", label: "Fairly even through the day", hint: `${Math.round(M.SELF_CONSUMPTION.daytime * 100)}% self-consumption` },
                    { value: "evening", label: "Mostly mornings and evenings", hint: `${Math.round(M.SELF_CONSUMPTION.evening * 100)}% self-consumption` },
                  ]}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="text-lg font-semibold">Supply</h2>
                <div className="mt-3">
                  <OptionGrid name="Electrical phase" columns={1} value={phase} onChange={setPhase} options={[{ value: "single", label: "Single phase" }, { value: "three", label: "Three phase" }, { value: "unknown", label: "Not sure" }]} />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">EV</h2>
                <div className="mt-3">
                  <OptionGrid name="EV" columns={1} value={ev} onChange={setEv} options={[{ value: "yes", label: "I drive an EV" }, { value: "notyet", label: "Thinking about it" }, { value: "no", label: "No" }]} />
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Results */}
      {!diverted ? (
        <div className="grid gap-6">
          <article className="sheet p-5 sm:p-7" aria-live="polite">
            <header className="flex flex-col gap-2 border-b border-ink pb-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold leading-tight">Your estimated system</p>
                <p className="text-sm text-ink-2">Updates as you move the sliders. Indicative only.</p>
              </div>
              <div className="text-sm text-ink-2 tnum sm:text-right">
                <p>Tariff {(M.TARIFF_SGD_PER_KWH * 100).toFixed(2)}¢/kWh</p>
                <p>Updated {M.TARIFF_LAST_UPDATED}</p>
              </div>
            </header>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
              <Stat label="Recommended size" value={<><CountUp to={result.systemKwp} decimals={1} duration={0.5} start /> kWp</>} note={`${result.panelCount} panels`} />
              <Stat label="Est. system cost" value={`${formatSgd(result.priceLowSgd)} to ${formatSgd(result.priceHighSgd)}`} note="incl. GST, before survey" small />
              <Stat label="Annual generation" value={<><CountUp to={result.annualKwh} duration={0.5} start /> kWh</>} note="first year" />
              <Stat label="Bill offset" value={<><CountUp to={Math.round(offset * 100)} duration={0.5} start />%</>} note="of your current bill" />
              <Stat label="Monthly savings" value={<CountUp to={result.monthlySavingsSgd + (result.monthlyExportCreditSgd ?? 0)} duration={0.5} start format={(v) => formatSgd(v)} />} note="used at home plus export credit" />
              <Stat label="Payback" value={`${result.paybackYearsLow} to ${result.paybackYearsHigh} yrs`} note="simple, no escalation" small />
            </div>

            <div className="mt-6 grid grid-cols-[6rem_1fr] items-center gap-4 sm:grid-cols-[8rem_1fr]">
              <RoofTile play reduced={reduced} panelCount={result.panelCount} className="w-full" />
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-2">Monthly usage, grid vs your roof</p>
                <UsageBars play reduced={reduced} solarShare={share} />
              </div>
            </div>

            <div className="mt-5 text-[0.95rem]">
              <div className="leader py-1.5">
                <span>Your bill today</span>
                <span>{formatSgd(bill)} / mth</span>
              </div>
              <div className="leader py-1.5">
                <span>Generated on your roof and used at home</span>
                <span className="stamp font-semibold">−{formatSgd(result.monthlySavingsSgd)} / mth</span>
              </div>
              {result.monthlyExportCreditSgd !== null ? (
                <div className="leader py-1.5">
                  <span>Exported to the grid ({formatNumber(result.monthlyExportKwh)} kWh)</span>
                  <span className="stamp font-semibold">−{formatSgd(result.monthlyExportCreditSgd)} / mth</span>
                </div>
              ) : null}
              <div className="leader mt-1 border-t border-ink pt-3 text-lg font-semibold">
                <span>Estimated amount payable</span>
                <span>{formatSgd(Math.max(bill - result.monthlySavingsSgd - (result.monthlyExportCreditSgd ?? 0), 0))} / mth</span>
              </div>
            </div>
          </article>

          <article className="sheet p-5 sm:p-7">
            <p className="font-display text-lg font-semibold">Cumulative savings over {M.SYSTEM_LIFE_YEARS} years</p>
            <p className="text-sm text-ink-2">Net of the system cost, with {M.ANNUAL_DEGRADATION * 100}% a year panel degradation and a flat tariff.</p>
            <div className="mt-4">
              <SavingsChart low={low} high={high} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              {[4, 9, 19, M.SYSTEM_LIFE_YEARS - 1].map((i) => (
                <div key={i} className="leader">
                  <span className="text-ink-2">Year {i + 1}</span>
                  <span className="font-medium">{formatSgd(low[i])}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="neu p-6 sm:p-7">
            <p className="font-display text-lg font-semibold">Environmental impact</p>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              <div>
                <p className="font-display text-4xl font-semibold text-forest tnum"><CountUp to={co2Tonnes(result.annualKwh)} decimals={1} duration={0.5} start /></p>
                <p className="text-sm text-ink-2">tonnes of CO₂ avoided a year</p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-forest tnum">≈ <CountUp to={treesEquivalent(result.annualKwh)} duration={0.5} start /></p>
                <p className="text-sm text-ink-2">trees a year, equivalent</p>
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-forest tnum"><CountUp to={co2Tonnes(result.annualKwh, M.WARRANTY_YEARS.panels)} duration={0.5} start /></p>
                <p className="text-sm text-ink-2">tonnes avoided over {M.WARRANTY_YEARS.panels} years</p>
              </div>
            </div>
          </article>

          {ev !== "no" ? (
            <p className="text-sm text-ink-2">
              EV charging: a {phase === "three" ? "11 to 22 kW three-phase" : "7 kW"} charger can be installed with the system and run on daytime generation. Priced at the survey.
            </p>
          ) : null}

          <p className="text-xs text-ink-2">
            * Indicative estimates, not a quotation. Based on SP Group&rsquo;s regulated tariff of {(M.TARIFF_SGD_PER_KWH * 100).toFixed(2)} cents/kWh (Q3 2026, incl. GST), an export credit of about S${M.EXPORT_RATE_SGD_PER_KWH ?? "n/a"}/kWh under the Simplified Credit Treatment scheme (to confirm), {Math.round(M.ANNUAL_YIELD_KWH_PER_KWP * M.PERFORMANCE_RATIO).toLocaleString("en-SG")} kWh per kWp a year delivered ({Math.round(M.PERFORMANCE_RATIO * 100)}% performance ratio), an installed cost of S${M.PRICE_PER_KWP_LOW} to S${M.PRICE_PER_KWP_HIGH}/kWp before GST, and daytime self-consumption of {Math.round(M.SELF_CONSUMPTION.evening * 100)}% to {Math.round(M.SELF_CONSUMPTION.daytime * 100)}% depending on the option chosen, with the remainder exported. The tariff is revised quarterly. Actual savings depend on roof orientation, shading and consumption. A personalised estimate comes with every free site survey.
          </p>

          {showLead ? (
            <div className="sheet p-5 sm:p-7">
              <LeadForm state={leadState} onBack={() => setShowLead(false)} />
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => setShowLead(true)}>
                Book the free site survey
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Ask a question first
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </Container>
  );
}

function Stat({ label, value, note, small }: { label: string; value: React.ReactNode; note?: string; small?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-2">{label}</p>
      <p className={small ? "mt-1 font-display text-lg font-semibold leading-tight tnum" : "mt-1 font-display text-3xl font-semibold leading-none tnum"}>{value}</p>
      {note ? <p className="mt-1 text-xs text-ink-2">{note}</p> : null}
    </div>
  );
}
