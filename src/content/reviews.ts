/**
 * Verbatim Google reviews from the company's Google Business Profile, as shown
 * on the current site. First names only. Permission to display is being
 * requested from Hugh; do not add reviews that are not on the profile.
 */
export type Review = {
  name: string;
  quote: string;
  /** Short phrase pulled from the review for the statement-line summary. */
  mentions: string;
};

export const REVIEWS: readonly Review[] = [
  {
    name: "Cheeng",
    quote:
      "They installed solar panels and an EV charger for my home, and also guided me through all the necessary paperwork with SP Group and Geneco, making the whole process smooth and worry-free. The young founder is clearly passionate about what he does.",
    mentions: "Solar and EV charger, SP Group paperwork handled",
  },
  {
    name: "Ailene",
    quote:
      "We are happy with the installation of solar panels, and now we started to see saving for our utility bill! The job is very professional and the installation of panels are seamless and fast! It is completed within a week!",
    mentions: "Completed within a week, savings on the bill",
  },
  {
    name: "Danny",
    quote:
      "Highly capable in the installation of solar panels, electrical devices and electrical wiring. Follow-up action on getting Singapore Powers to install extra meter for dual metering is seamless.",
    mentions: "Dual metering with SP Group arranged",
  },
  {
    name: "Chris",
    quote:
      "His installation work was efficient and tidy, and he completed the installation within 1.5 weeks. I sourced a few other contractors as well, but his quote and services were the most competitive and comprehensive. As of now, there is no defects nor workmanship issues.",
    mentions: "Most competitive quote of several contractors",
  },
  {
    name: "Akida",
    quote:
      "Good workmanship. The boss Hugh is also very friendly, keeps coming down to check and make sure that everything is ok. Definitely will recommend to my friends.",
    mentions: "Hugh comes down to check the work",
  },
  {
    name: "Fanny",
    quote: "Good service and good workmanship.",
    mentions: "Good workmanship",
  },
];
