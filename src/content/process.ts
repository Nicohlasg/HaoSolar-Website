/** The five steps every job goes through. A real sequence, so numbering is legitimate. */
export const PROCESS = [
  {
    n: 1,
    title: "Site survey",
    body: "We come to your house, measure the roof, check shading, look at your switchboard and your last three bills.",
    duration: "About 1 hour",
  },
  {
    n: 2,
    title: "Design and quotation",
    body: "You get a roof drawing, a generation estimate and a fixed quotation. A range on the website, a number on paper.",
    duration: "Within a week",
  },
  {
    n: 3,
    title: "SP Group paperwork",
    body: "We apply for net metering and the dual meter with SP Group and your retailer. You sign, we chase.",
    duration: "Runs in the background",
  },
  {
    n: 4,
    title: "Installation",
    body: "Our own crew, no subcontractors. Hugh comes down to check. Panels, inverter, cabling, LEW sign-off.",
    duration: "1 to 1.5 weeks",
  },
  {
    n: 5,
    title: "Handover and the first bill",
    body: "We show you the monitoring app, hand over the documents and stay on for complimentary maintenance.",
    duration: "Then every month after",
  },
] as const;
