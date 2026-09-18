/**
 * Every coefficient the calculator uses lives here, with its source.
 * Hugh reviews and corrects these values. Nothing in the UI may hard-code a
 * number that belongs in this file.
 *
 * PLACEHOLDER = not yet confirmed by Hugh. The result screen labels any figure
 * that depends on a placeholder as indicative.
 */
export const SOLAR_MODEL = {
  /** Panel nameplate. Jinko Tiger Neo 590 W Bifacial (72HL4-BDV), from the June 2026 proposal template and the datasheet. */
  PANEL_WATTS: 590,
  /** Roof area one panel occupies, m². Jinko Tiger Neo is 2278 x 1134 mm = 2.58 m²; small allowance for clamps and rails. */
  PANEL_AREA_M2: 2.7,
  /** Share of gross roof area usable after setbacks, obstructions and orientation. PLACEHOLDER */
  USABLE_ROOF_RATIO: 0.6,
  /** System losses (temperature, soiling, inverter, wiring). Singapore typical 0.78 to 0.82. PLACEHOLDER */
  PERFORMANCE_RATIO: 0.8,
  /**
   * Specific yield, kWh per kWp per year, before the performance ratio.
   * Back-solved from the June 2026 proposal template: 40.68 MWh a year from
   * 31.86 kWp = 1,277 kWh/kWp delivered; 1,277 / 0.8 = 1,596 raw.
   */
  ANNUAL_YIELD_KWH_PER_KWP: 1596,
  /**
   * SP Group regulated tariff, S$ per kWh, including 9% GST.
   * Q3 2026 (1 Jul to 30 Sep): 31.91 cents before GST, 34.78 cents with GST.
   * Revised quarterly. Next revision 1 Oct 2026.
   */
  TARIFF_SGD_PER_KWH: 0.3478,
  TARIFF_LAST_UPDATED: "2026-09-14",
  /**
   * What SP Group pays for exported energy, S$ per kWh. Depends on the
   * Simplified Credit Treatment or Enhanced Central Intermediary Scheme.
   * Hugh registers net metering for every customer and knows the basis.
   * null = unknown. The calculator hides the export line until this is set.
   */
  EXPORT_RATE_SGD_PER_KWH: 0.26 as number | null,
  /** Source note for the export rate: a competitor's public calculator states about S$0.26/kWh under the Simplified Credit Treatment scheme. PLACEHOLDER until Hugh confirms the basis. */
  EXPORT_RATE_SOURCE: "Simplified Credit Treatment, approx. S$0.26/kWh, competitor calculator disclaimer, Sep 2026. To confirm.",
  /** Share of generation used on site, by household usage pattern. PLACEHOLDER */
  SELF_CONSUMPTION: {
    daytime: 0.7,
    evening: 0.45,
  },
  /**
   * Installed cost range, S$ per kWp before GST. The June 2026 proposal
   * template prices 31.86 kWp at S$28,500 incl. GST = S$820/kWp ex-GST, which
   * is a large system; small landed systems cost more per kWp. Hugh to
   * confirm the band. PLACEHOLDER (upper bound especially)
   */
  PRICE_PER_KWP_LOW: 820,
  PRICE_PER_KWP_HIGH: 1400,
  GST_RATE: 0.09,
  /** Grid emission factor, kg CO2 per kWh. EMA 2023 operating margin approx 0.417. */
  CO2_KG_PER_KWH: 0.417,
  /** Trees needed to absorb one tonne of CO2 a year, rough public figure (about 45). Illustrative only. */
  TREES_PER_TONNE_CO2: 45,
  /** System life used for cumulative savings. Panel warranty is 30 years. */
  SYSTEM_LIFE_YEARS: 25,
  /** Annual panel output degradation. Jinko Tiger Neo warranty curve is about 0.4%/yr; 0.5% is conservative. */
  ANNUAL_DEGRADATION: 0.005,
  /** Tariff escalation per year in the cumulative chart. 0 = flat, conservative. */
  TARIFF_ESCALATION: 0,
  /** Typical system size by property type, kWp, for the calculator presets. Landed sizes from the SG market; commercial is open-ended. */
  TYPICAL_KWP: {
    terrace: { low: 10, high: 15, roofM2: 100 },
    semi: { low: 15, high: 30, roofM2: 150 },
    bungalow: { low: 20, high: 40, roofM2: 220 },
    gcb: { low: 40, high: 100, roofM2: 450 },
  },
  /** Cap the recommended system at this multiple of annual consumption; beyond it the roof only exports at the lower credit rate. */
  OVERSIZE_FACTOR: 1.25,
  /** Hard cap on system size by electrical phase, kWp. Single phase supply limits inverter size. PLACEHOLDER */
  MAX_KWP_BY_PHASE: {
    single: 7,
    three: 40,
    unknown: 40,
  },
  /** Months of complimentary maintenance mentioned in Google reviews. TO CONFIRM with Hugh. */
  MAINTENANCE_MONTHS_INCLUDED: 24,
  /** Warranty terms from the June 2026 proposal template (page 5). */
  WARRANTY_YEARS: {
    performance: 30,
    panels: 30,
    inverter: 15,
    workmanship: 2,
  },
  /** Commercial terms from the proposal template (page 7). */
  TERMS: {
    quotationValidityDays: 30,
    depositPct: 60,
    completionPct: 35,
    commissioningPct: 5,
  },
} as const;

export type UsagePattern = keyof typeof SOLAR_MODEL.SELF_CONSUMPTION;
export type ElectricalPhase = keyof typeof SOLAR_MODEL.MAX_KWP_BY_PHASE;
