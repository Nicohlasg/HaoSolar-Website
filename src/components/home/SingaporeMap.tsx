import { SG_REGIONS, SG_VIEWBOX } from "@/content/singapore-outline";
import { COLORS } from "@/config/theme";

/**
 * Singapore drawn from the URA Master Plan 2019 subzone boundaries (no sea),
 * so the coastline and islands are real. Subzones are hairline; regions get
 * a slightly different tint. Outline only; markers are an HTML layer on top
 * (see MapMarkers) so they can be hovered, tapped and tabbed to.
 */
type Tone = "paper" | "ink";

const REGION_TINT: Record<Tone, Record<string, string>> = {
  paper: {
    "CENTRAL REGION": "#e6ede8",
    "EAST REGION": "#ecf1ed",
    "NORTH REGION": "#f0f4f1",
    "NORTH-EAST REGION": "#e9efeb",
    "WEST REGION": "#f2f5f3",
  },
  ink: {
    "CENTRAL REGION": "#1a1d1b",
    "EAST REGION": "#151816",
    "NORTH REGION": "#121412",
    "NORTH-EAST REGION": "#171a18",
    "WEST REGION": "#101210",
  },
};

const STROKE: Record<Tone, { zone: string; coast: string; coastWidth: string }> = {
  paper: { zone: COLORS.paper, coast: COLORS.forest, coastWidth: "0.5" },
  ink: { zone: "rgba(255,255,255,0.07)", coast: COLORS.forest, coastWidth: "0.45" },
};

export function SingaporeMap({ className, tone = "paper" }: { className?: string; tone?: Tone }) {
  const tint = REGION_TINT[tone];
  const stroke = STROKE[tone];
  return (
    <svg viewBox={`-1 -1 ${SG_VIEWBOX.w + 2} ${SG_VIEWBOX.h + 2}`} className={className} role="img" aria-label="Map of Singapore">
      {/* coastline: every subzone stroked beneath the fills, so only the outer half of the stroke shows, along the sea */}
      <g fill="none" stroke={stroke.coast} strokeWidth={stroke.coastWidth} strokeLinejoin="round" opacity="0.8">
        {Object.values(SG_REGIONS)
          .flat()
          .map((z) => (
            <path key={`o-${z.name}`} d={z.d} />
          ))}
      </g>
      {Object.entries(SG_REGIONS).map(([region, zones]) => (
        <g key={region} fill={tint[region] ?? tint["WEST REGION"]} stroke={stroke.zone} strokeWidth="0.12" strokeLinejoin="round">
          {zones.map((z) => (
            <path key={z.name} d={z.d}>
              <title>{z.name}</title>
            </path>
          ))}
        </g>
      ))}
    </svg>
  );
}
