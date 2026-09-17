import type { ChapterId } from "@/lib/statement";
import { SOLAR_MODEL } from "@/config/solar-model";

/**
 * Copy for the statement section. One line per scroll chapter, then the four
 * promises that stamp in at the end. Headline is rewritten in the copy pass.
 */
export const STATEMENT_HEADLINE = "Watch the number fall.";

export const STATEMENT_CHAPTERS: readonly { id: ChapterId; kicker: string; line: string }[] = [
  { id: "roof", kicker: "Your roof", line: "Every bill starts with the same roof. Ours starts by measuring it." },
  { id: "panels", kicker: "Panels land", line: "Each panel takes a bite out of the grid. Watch the lime climb." },
  { id: "falls", kicker: "The number falls", line: "What your roof makes, you stop paying for. What it exports, SP credits." },
  { id: "stays", kicker: "The rest stays", line: "Same meter, same retailer, same house. Only the total moves." },
];

export const STATEMENT_PROMISES: readonly { label: string; value: string; toConfirm?: boolean }[] = [
  { label: "Contractors on your roof", value: "1, ours" },
  { label: "Solar and EV charger", value: "Same crew" },
  { label: "Site checks by the boss", value: "Every job" },
  { label: "Maintenance after install", value: `${SOLAR_MODEL.MAINTENANCE_MONTHS_INCLUDED} months`, toConfirm: true },
];
