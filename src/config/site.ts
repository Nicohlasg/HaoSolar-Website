/**
 * Company facts shown on the site. Every value here was confirmed by Hugh or
 * taken from public registration records. Do not add unconfirmed claims.
 */
export const SITE = {
  name: "Hao Solar",
  legalName: "Hao Solar Pte Ltd",
  uen: "202349083N",
  since: 2023,
  address: {
    line1: "10 Admiralty St, #01-39 North Link Building",
    line2: "Singapore 757695",
  },
  email: "info@haosolar.org",
  phoneDisplay: "+65 8020 8530",
  phoneE164: "+6580208530",
  /** wa.me requires digits only. Which number this is (business or Hugh's) is still to be confirmed. */
  whatsappNumber: "6580208530",
  hours: "8am to 6pm, daily",
  url: "https://haosolar.com.sg",
  accreditations: [
    { label: "SME500", year: 2024, title: "SME500 Singapore Award Winner 2024", image: "/images/badges/sme500-2024.jpg", width: 500, height: 393 },
    { label: "E100", year: 2024, title: "Singapore Entrepreneur 100 Award, 2024 winner", image: "/images/badges/e100-2024.png", width: 800, height: 688 },
  ],
  /**
   * Management-system certificates from the brand folder (EQA IMS, SAC-accredited).
   * Certificate numbers date from 2018, before the 2023 incorporation, so the
   * holder name (Hao Solar or SAC Solar Solutions) is to be confirmed with Hugh.
   */
  certifications: [
    { label: "ISO 9001:2015", subject: "Quality management", cert: "QS-18-1943", image: "/images/badges/iso-9001.jpg" },
    { label: "ISO 14001:2015", subject: "Environmental management", cert: "ES-18-1944", image: "/images/badges/iso-14001.jpg" },
    { label: "ISO 45001:2018", subject: "Occupational health and safety", cert: "OSH-18-1945", image: "/images/badges/iso-45001.jpg" },
  ],
  /** Social links, decoded from the Linktree QR in the brand folder. */
  socials: {
    facebook: "https://www.facebook.com/haosolar/" as string | null,
    instagram: "https://www.instagram.com/haosolar" as string | null,
    tiktok: "https://tiktok.com/@haosolar" as string | null,
    linkedin: "https://www.linkedin.com/company/haosolar" as string | null,
    linktree: "https://linktr.ee/qr/3e61ce55-e1b7-43b4-b0c7-05dd6a532d83",
  },
  google: {
    rating: 5.0,
    reviewCount: 7,
    placeUrl:
      "https://search.google.com/local/reviews?placeid=ChIJI97TdjKPI00R0SqFCDmCQEs",
  },
} as const;

export const NAV = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/calculator", label: "Savings calculator" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
