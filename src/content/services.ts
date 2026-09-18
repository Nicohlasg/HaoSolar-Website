export type Service = {
  slug: "solar" | "ev-charger" | "maintenance";
  title: string;
  short: string;
  lead: string;
  included: readonly string[];
  /** Lines shown as statement rows on the service section. */
  facts: readonly { label: string; value: string; toConfirm?: boolean }[];
};

export const SERVICES: readonly Service[] = [
  {
    slug: "solar",
    title: "Solar PV for landed and commercial roofs",
    short: "Solar PV",
    lead: "Survey, layout, install and SP Group net metering. One company, first visit to first credit.",
    included: [
      "Free site survey and shading check",
      "Roof drawing and generation simulation",
      "Panels, inverter, mounting and cabling",
      "Isolator, MCB and RCCB, lightning protection and earth bonding",
      "LEW endorsement, as-built layout and SLD submission to SP Group",
      "LEW attendance at power turn-on",
      "Complimentary maintenance after handover",
    ],
    facts: [
      { label: "Typical install time", value: "1 to 1.5 weeks" },
      { label: "Panels", value: "Jinko Tiger Neo 590 W Bifacial, 30-year output warranty" },
      { label: "Inverter", value: "Huawei SUN2000, 15-year warranty" },
      { label: "Performance guarantee", value: "30 years" },
      { label: "Workmanship warranty", value: "2 years" },
      { label: "Payment", value: "60% on confirmation, 35% on completion, 5% on SP commissioning" },
      { label: "Maintenance included", value: "24 months", toConfirm: true },
    ],
  },
  {
    slug: "ev-charger",
    title: "EV charger installation",
    short: "EV chargers",
    lead: "Home and workplace chargers by the same electricians. Sized to run on your roof in the daytime.",
    included: [
      "Load assessment of your existing supply",
      "Charger supply and mounting, indoor or outdoor",
      "Dedicated circuit, isolator and RCD",
      "LEW certification",
      "Pairing with a solar system if you have one",
    ],
    facts: [
      { label: "Charger types", value: "7 kW single phase, 11 to 22 kW three phase" },
      { label: "Charger brands", value: "To confirm", toConfirm: true },
      { label: "Typical install time", value: "1 day", toConfirm: true },
    ],
  },
  {
    slug: "maintenance",
    title: "Maintenance and servicing",
    short: "Maintenance",
    lead: "Cleaning, string checks and the inverter log, so the credit line on your bill stays where it should be.",
    included: [
      "Panel cleaning",
      "Inverter and string output check",
      "Mounting, cabling and roof penetration inspection",
      "Report with generation figures",
    ],
    facts: [
      { label: "Included after our install", value: "24 months", toConfirm: true },
      { label: "Servicing for other installers' systems", value: "Yes, on request" },
    ],
  },
];
