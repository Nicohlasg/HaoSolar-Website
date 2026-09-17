import type { ElectricalPhase, UsagePattern } from "@/config/solar-model";
import type { PropertyType } from "@/lib/calc";

export type RoofMaterial = "tile" | "metal" | "concrete" | "mixed" | "unsure";
export type Storeys = "1" | "2" | "3" | "4+";
export type Retailer = "sp" | "geneco" | "keppel" | "sembcorp" | "senoko" | "tuas" | "union" | "other";
export type EvAnswer = "yes" | "notyet" | "no";

export type CalculatorState = {
  propertyType: PropertyType | null;
  postalCode: string;
  roofAreaM2: number | null;
  roofMaterial: RoofMaterial | null;
  storeys: Storeys | null;
  phase: ElectricalPhase | null;
  monthlyBillSgd: number;
  retailer: Retailer | null;
  usagePattern: UsagePattern | null;
  ev: EvAnswer | null;
};

export const STEPS = [
  "property",
  "postal",
  "roof",
  "material",
  "storeys",
  "phase",
  "bill",
  "retailer",
  "usage",
  "ev",
  "result",
  "lead",
] as const;

export type StepId = (typeof STEPS)[number];

export const INITIAL_STATE: CalculatorState = {
  propertyType: null,
  postalCode: "",
  roofAreaM2: null,
  roofMaterial: null,
  storeys: null,
  phase: null,
  monthlyBillSgd: 350,
  retailer: null,
  usagePattern: null,
  ev: null,
};

export const STORAGE_KEY = "haosolar.calculator.v1";

/** Whether the current step has an answer, so Next can enable. */
export function isStepComplete(step: StepId, s: CalculatorState): boolean {
  switch (step) {
    case "property":
      return s.propertyType !== null;
    case "postal":
      return /^\d{6}$/.test(s.postalCode);
    case "roof":
      return s.roofAreaM2 !== null && s.roofAreaM2 > 0;
    case "material":
      return s.roofMaterial !== null;
    case "storeys":
      return s.storeys !== null;
    case "phase":
      return s.phase !== null;
    case "bill":
      return s.monthlyBillSgd > 0;
    case "retailer":
      return s.retailer !== null;
    case "usage":
      return s.usagePattern !== null;
    case "ev":
      return s.ev !== null;
    default:
      return true;
  }
}
