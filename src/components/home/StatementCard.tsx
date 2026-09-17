"use client";

import { useId, useMemo, useState } from "react";
import type { MotionValue } from "framer-motion";
import { estimate } from "@/lib/calc";
import { formatSgd } from "@/lib/format";
import { FALL_WINDOW } from "@/lib/statement";
import { SOLAR_MODEL } from "@/config/solar-model";
import { ScrubNumber } from "@/components/ui/ScrubNumber";
import { ScrubReveal } from "@/components/ui/ScrubReveal";
import { RoofTile } from "./RoofTile";
import { UsageLine } from "./UsageLine";

/** Illustrative household. Labelled as such on the card. */
const ILLUSTRATION = {
  roofAreaM2: 90,
  usagePattern: "daytime" as const,
  phase: "three" as const,
};
const BILL = { default: 480, min: 150, max: 1500, step: 10 } as const;

const CREDIT_WINDOW: [number, number] = [FALL_WINDOW[0], FALL_WINDOW[0] + 0.06];
const EXPORT_WINDOW: [number, number] = [FALL_WINDOW[0] + 0.03, FALL_WINDOW[0] + 0.09];

function BillSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const id = useId();
  return (
    <div className="mt-3 rounded-sm bg-paper-2 px-3 py-2 sm:mt-4 sm:py-2.5">
      <label htmlFor={id} className="leader text-sm">
        <span className="text-ink-2">Your monthly bill today</span>
        <span className="font-semibold">{formatSgd(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={BILL.min}
        max={BILL.max}
        step={BILL.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-ink"
      />
    </div>
  );
}

/**
 * The bill, rewritten as you scroll. `progress` is the section's scroll
 * progress; every moment on the card is a function of it, so scrolling back
 * puts the panels away and the number climbs again. The slider changes the
 * household's bill and every figure follows.
 */
export function StatementCard({ progress }: { progress: MotionValue<number> }) {
  const [bill, setBill] = useState<number>(BILL.default);
  const result = useMemo(() => estimate({ ...ILLUSTRATION, monthlyBillSgd: bill }), [bill]);
  const solarShare = Math.min(result.monthlySavingsSgd / bill, 1);
  const tariffCents = (SOLAR_MODEL.TARIFF_SGD_PER_KWH * 100).toFixed(2);

  return (
    <article className="sheet relative w-full max-w-xl p-4 sm:p-7" aria-label="Illustrative savings statement">
      <header className="flex flex-col gap-1 border-b border-ink pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <p className="font-display text-base font-semibold leading-tight sm:text-lg">Estimated savings statement</p>
          <p className="text-xs text-ink-2 sm:text-sm">Prepared for a landed home, Singapore</p>
        </div>
        <p className="text-xs text-ink-2 tnum sm:text-right sm:text-sm">
          Period: 12 months <span className="sm:hidden">·</span> <span className="sm:block">Tariff: {tariffCents}¢/kWh</span>
        </p>
      </header>

      <BillSlider value={bill} onChange={setBill} />

      <div className="mt-4 grid grid-cols-[5.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
        <RoofTile progress={progress} panelCount={result.panelCount} className="w-full" />
        <dl className="text-xs sm:text-sm [&_dt]:min-w-0">
          <div className="leader py-1">
            <dt className="text-ink-2">Premises</dt>
            <dd className="whitespace-nowrap">Terrace, tiled roof</dd>
          </div>
          <div className="leader py-1">
            <dt className="text-ink-2">Usable roof</dt>
            <dd className="whitespace-nowrap">{ILLUSTRATION.roofAreaM2} m²</dd>
          </div>
          <div className="leader py-1">
            <dt className="text-ink-2">System</dt>
            <dd className="whitespace-nowrap">
              {result.systemKwp} kWp · {result.panelCount} panels
            </dd>
          </div>
          <div className="leader py-1">
            <dt className="text-ink-2">Generation</dt>
            <dd className="whitespace-nowrap">{result.annualKwh.toLocaleString("en-SG")} kWh / yr</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-2">Grid line, roof beneath it</p>
        <UsageLine progress={progress} solarShare={solarShare} monthlyBillSgd={bill} />
      </div>

      <div className="mt-3 text-sm sm:text-[0.95rem]">
        <div className="leader py-1.5">
          <span>From the grid, before solar</span>
          <span>{formatSgd(bill)} / mth</span>
        </div>
        <ScrubReveal progress={progress} window={CREDIT_WINDOW} className="leader py-1.5">
          <span>Made on your roof, used at home</span>
          <span className="stamp font-semibold">
            −<ScrubNumber progress={progress} window={FALL_WINDOW} from={0} to={result.monthlySavingsSgd} format={formatSgd} /> / mth
          </span>
        </ScrubReveal>
        {result.monthlyExportCreditSgd !== null ? (
          <ScrubReveal progress={progress} window={EXPORT_WINDOW} className="leader py-1.5">
            <span>Exported to the grid, credited</span>
            <span className="stamp font-semibold">
              −<ScrubNumber progress={progress} window={FALL_WINDOW} from={0} to={result.monthlyExportCreditSgd} format={formatSgd} /> / mth
            </span>
          </ScrubReveal>
        ) : null}
        <div className="leader mt-1 border-t border-ink pt-3 text-base font-semibold sm:text-lg">
          <span>Amount payable</span>
          <span>
            <ScrubNumber progress={progress} window={FALL_WINDOW} from={bill} to={result.newMonthlyBillSgd} format={formatSgd} /> / mth
          </span>
        </div>
      </div>

      <footer className="mt-4 hidden border-t border-dashed border-rule pt-3 text-xs text-ink-2 sm:block">
        <p>Illustration: 3-storey terrace, {ILLUSTRATION.roofAreaM2} m² usable roof, placeholder rates. Indicative only. Your figures come from your roof and a free site survey.</p>
      </footer>
    </article>
  );
}
