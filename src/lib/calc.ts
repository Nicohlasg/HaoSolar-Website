import {
  SOLAR_MODEL,
  type ElectricalPhase,
  type UsagePattern,
} from "@/config/solar-model";

export type CalcInput = {
  roofAreaM2: number;
  monthlyBillSgd: number;
  usagePattern: UsagePattern;
  phase: ElectricalPhase;
};

export type CalcResult = {
  panelCount: number;
  systemKwp: number;
  annualKwh: number;
  monthlyKwh: number;
  monthlyGridKwh: number;
  monthlySelfUsedKwh: number;
  monthlyExportKwh: number;
  monthlySavingsSgd: number;
  monthlyExportCreditSgd: number | null;
  newMonthlyBillSgd: number;
  priceLowSgd: number;
  priceHighSgd: number;
  paybackYearsLow: number;
  paybackYearsHigh: number;
  co2KgPerYear: number;
};

const M = SOLAR_MODEL;

function round(value: number, dp = 0): number {
  const f = 10 ** dp;
  return Math.round(value * f) / f;
}

/** Panels that fit on the usable share of the roof. */
export function panelCount(roofAreaM2: number): number {
  if (!Number.isFinite(roofAreaM2) || roofAreaM2 <= 0) return 0;
  return Math.floor((roofAreaM2 * M.USABLE_ROOF_RATIO) / M.PANEL_AREA_M2);
}

/** System size in kWp, capped by the electrical phase. */
export function systemKwp(panels: number, phase: ElectricalPhase): number {
  const raw = (panels * M.PANEL_WATTS) / 1000;
  return round(Math.min(raw, M.MAX_KWP_BY_PHASE[phase]), 2);
}

export function annualKwh(kwp: number): number {
  return round(kwp * M.ANNUAL_YIELD_KWH_PER_KWP * M.PERFORMANCE_RATIO);
}

/** Panels needed to cover annual consumption times the oversize factor. */
export function panelsForBill(monthlyBillSgd: number): number {
  const annualKwh = (monthlyBillSgd / M.TARIFF_SGD_PER_KWH) * 12 * M.OVERSIZE_FACTOR;
  const kwpNeeded = annualKwh / (M.ANNUAL_YIELD_KWH_PER_KWP * M.PERFORMANCE_RATIO);
  return Math.max(0, Math.ceil((kwpNeeded * 1000) / M.PANEL_WATTS));
}

export function estimate(input: CalcInput): CalcResult {
  const panels = Math.min(panelCount(input.roofAreaM2), panelsForBill(input.monthlyBillSgd));
  const kwp = systemKwp(panels, input.phase);
  const yearlyKwh = annualKwh(kwp);
  const monthlyKwh = yearlyKwh / 12;

  const gridKwh = input.monthlyBillSgd / M.TARIFF_SGD_PER_KWH;
  const selfShare = M.SELF_CONSUMPTION[input.usagePattern];
  const selfUsed = Math.min(monthlyKwh * selfShare, gridKwh);
  const exported = Math.max(monthlyKwh - selfUsed, 0);

  const savings = selfUsed * M.TARIFF_SGD_PER_KWH;
  const exportCredit =
    M.EXPORT_RATE_SGD_PER_KWH === null
      ? null
      : exported * M.EXPORT_RATE_SGD_PER_KWH;

  const newBill = Math.max(input.monthlyBillSgd - savings - (exportCredit ?? 0), 0);

  const priceLow = kwp * M.PRICE_PER_KWP_LOW * (1 + M.GST_RATE);
  const priceHigh = kwp * M.PRICE_PER_KWP_HIGH * (1 + M.GST_RATE);
  const annualBenefit = (savings + (exportCredit ?? 0)) * 12;

  return {
    panelCount: panels,
    systemKwp: kwp,
    annualKwh: yearlyKwh,
    monthlyKwh: round(monthlyKwh),
    monthlyGridKwh: round(gridKwh),
    monthlySelfUsedKwh: round(selfUsed),
    monthlyExportKwh: round(exported),
    monthlySavingsSgd: round(savings),
    monthlyExportCreditSgd: exportCredit === null ? null : round(exportCredit),
    newMonthlyBillSgd: round(newBill),
    priceLowSgd: round(priceLow, -2),
    priceHighSgd: round(priceHigh, -2),
    paybackYearsLow: annualBenefit > 0 ? round(priceLow / annualBenefit, 1) : Infinity,
    paybackYearsHigh: annualBenefit > 0 ? round(priceHigh / annualBenefit, 1) : Infinity,
    co2KgPerYear: round(yearlyKwh * M.CO2_KG_PER_KWH),
  };
}

export type PropertyType = "landed" | "commercial" | "condo" | "hdb";

/** Cumulative net position per year: starts at minus the price, adds each year's benefit with degradation and escalation. */
export function cumulativeSavings(result: CalcResult, price: number, years = M.SYSTEM_LIFE_YEARS): number[] {
  const yearOne = (result.monthlySavingsSgd + (result.monthlyExportCreditSgd ?? 0)) * 12;
  const out: number[] = [];
  let total = -price;
  for (let y = 1; y <= years; y++) {
    const benefit = yearOne * (1 - M.ANNUAL_DEGRADATION) ** (y - 1) * (1 + M.TARIFF_ESCALATION) ** (y - 1);
    total += benefit;
    out.push(round(total));
  }
  return out;
}

export function co2Tonnes(annualKwh: number, years = 1): number {
  return round((annualKwh * M.CO2_KG_PER_KWH * years) / 1000, 1);
}

export function treesEquivalent(annualKwh: number): number {
  return Math.round(co2Tonnes(annualKwh) * M.TREES_PER_TONNE_CO2);
}

/** Share of the current bill covered by savings plus export credit, 0 to 1. */
export function billOffset(result: CalcResult, monthlyBillSgd: number): number {
  if (monthlyBillSgd <= 0) return 0;
  return Math.min((result.monthlySavingsSgd + (result.monthlyExportCreditSgd ?? 0)) / monthlyBillSgd, 1);
}

/** Which properties the calculator can serve. Others get a diversion. */
export function isServedByCalculator(type: PropertyType): boolean {
  return type === "landed" || type === "commercial";
}

export function isValidSingaporePostalCode(value: string): boolean {
  return /^\d{6}$/.test(value.trim());
}
