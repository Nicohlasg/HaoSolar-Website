import { describe, expect, test } from "vitest";
import {
  annualKwh,
  billOffset,
  co2Tonnes,
  cumulativeSavings,
  estimate,
  treesEquivalent,
  isServedByCalculator,
  isValidSingaporePostalCode,
  panelCount,
  systemKwp,
} from "./calc";
import { SOLAR_MODEL } from "@/config/solar-model";

describe("panelCount", () => {
  test("returns zero for a roof with no area", () => {
    expect(panelCount(0)).toBe(0);
    expect(panelCount(-5)).toBe(0);
    expect(panelCount(Number.NaN)).toBe(0);
  });

  test("uses only the usable share of the roof", () => {
    const roof = 100;
    const expected = Math.floor(
      (roof * SOLAR_MODEL.USABLE_ROOF_RATIO) / SOLAR_MODEL.PANEL_AREA_M2,
    );
    expect(panelCount(roof)).toBe(expected);
  });
});

describe("systemKwp", () => {
  test("caps single phase at the configured limit", () => {
    expect(systemKwp(100, "single")).toBe(SOLAR_MODEL.MAX_KWP_BY_PHASE.single);
  });

  test("does not cap a small three phase system", () => {
    expect(systemKwp(10, "three")).toBe((10 * SOLAR_MODEL.PANEL_WATTS) / 1000);
  });
});

describe("annualKwh", () => {
  test("applies yield and performance ratio", () => {
    expect(annualKwh(10)).toBe(
      Math.round(
        10 * SOLAR_MODEL.ANNUAL_YIELD_KWH_PER_KWP * SOLAR_MODEL.PERFORMANCE_RATIO,
      ),
    );
  });
});

describe("estimate", () => {
  const base = {
    roofAreaM2: 120,
    monthlyBillSgd: 420,
    usagePattern: "daytime" as const,
    phase: "three" as const,
  };

  test("never lets the new bill go below zero", () => {
    const result = estimate({ ...base, roofAreaM2: 2000, monthlyBillSgd: 20 });
    expect(result.newMonthlyBillSgd).toBeGreaterThanOrEqual(0);
  });

  test("savings never exceed the current bill", () => {
    const result = estimate({ ...base, roofAreaM2: 2000 });
    expect(result.monthlySavingsSgd).toBeLessThanOrEqual(base.monthlyBillSgd);
  });

  test("returns a price range, low below high", () => {
    const result = estimate(base);
    expect(result.priceLowSgd).toBeLessThan(result.priceHighSgd);
  });

  test("hides export credit while the export rate is unknown", () => {
    const result = estimate(base);
    if (SOLAR_MODEL.EXPORT_RATE_SGD_PER_KWH === null) {
      expect(result.monthlyExportCreditSgd).toBeNull();
    } else {
      expect(result.monthlyExportCreditSgd).not.toBeNull();
    }
  });

  test("evening usage saves less than daytime usage", () => {
    const day = estimate(base);
    const evening = estimate({ ...base, usagePattern: "evening" });
    expect(evening.monthlySavingsSgd).toBeLessThan(day.monthlySavingsSgd);
  });

  test("a small bill does not get a roof-sized system", () => {
    const big = estimate({ ...base, roofAreaM2: 400, monthlyBillSgd: 150 });
    const small = estimate({ ...base, roofAreaM2: 400, monthlyBillSgd: 900 });
    expect(big.systemKwp).toBeLessThan(small.systemKwp);
  });

  test("zero roof gives zero system and infinite payback", () => {
    const result = estimate({ ...base, roofAreaM2: 0 });
    expect(result.systemKwp).toBe(0);
    expect(result.paybackYearsLow).toBe(Infinity);
  });
});

describe("qualification", () => {
  test("serves landed and commercial, diverts hdb and condo", () => {
    expect(isServedByCalculator("landed")).toBe(true);
    expect(isServedByCalculator("commercial")).toBe(true);
    expect(isServedByCalculator("hdb")).toBe(false);
    expect(isServedByCalculator("condo")).toBe(false);
  });

  test("validates a six digit postal code", () => {
    expect(isValidSingaporePostalCode("757695")).toBe(true);
    expect(isValidSingaporePostalCode(" 757695 ")).toBe(true);
    expect(isValidSingaporePostalCode("75769")).toBe(false);
    expect(isValidSingaporePostalCode("75769a")).toBe(false);
  });
});

describe("cumulative savings", () => {
  const result = estimate({ roofAreaM2: 120, monthlyBillSgd: 420, usagePattern: "daytime", phase: "three" });

  test("starts below zero and rises every year", () => {
    const series = cumulativeSavings(result, result.priceLowSgd, 25);
    expect(series).toHaveLength(25);
    expect(series[0]).toBeLessThan(series[24]);
    for (let i = 1; i < series.length; i++) expect(series[i]).toBeGreaterThan(series[i - 1]);
  });

  test("bill offset is between zero and one", () => {
    const o = billOffset(result, 420);
    expect(o).toBeGreaterThan(0);
    expect(o).toBeLessThanOrEqual(1);
  });

  test("co2 and trees scale with generation", () => {
    expect(co2Tonnes(10000)).toBeCloseTo(4.2, 1);
    expect(treesEquivalent(10000)).toBeGreaterThan(100);
  });
});
