import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SITE } from "@/config/site";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { MotionFooter } from "@/components/layout/MotionFooter";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Hao Solar | Solar PV and EV charger installation, Singapore",
    template: "%s | Hao Solar",
  },
  description:
    "Solar panels and EV chargers for landed homes and commercial roofs in Singapore. One in-house crew, founder on site, SP Group paperwork handled.",
  openGraph: {
    type: "website",
    siteName: "Hao Solar",
    locale: "en_SG",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

/*
THESIS: The homeowner's monthly electricity statement, re-issued by Hao Solar
with a solar credit line and a smaller amount payable. Refuses the gradient
hero and card grid every installer site ships.
OWN-WORLD: white statement paper, ink text, dotted leaders, tabular numerals,
hairline rules, dashed perforations, a 12-month usage bar chart, one lime
(#d8ff32) reserved for credits, savings and the primary action.
STORY: recognise your own bill, watch the number fall, see who does the work,
enter a postal code or tap WhatsApp.
FIRST VIEWPORT: headline left with postal code field and WhatsApp; right, a
statement card whose premises block is the roof, panels tile in, bars shrink,
amount payable counts down, lime credit line slides in.
FORM: the utility bill, position 3 of 7 grounded candidates, seed 43a7a5f5.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, and DESIGN.md.
*/
const DIRECTION_CONTRACT =
  "<!-- impeccable direction contract | seed 43a7a5f5 | form: the rewritten electricity bill | see layout.tsx -->";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${archivo.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <div hidden dangerouslySetInnerHTML={{ __html: DIRECTION_CONTRACT }} />
        <FloatingHeader />
        <main className="flex-1 pb-14 sm:pb-0">{children}</main>
        <MotionFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
