"use client";

import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/config/site";
import type { PropertyType } from "@/lib/calc";

/**
 * HDB and condo enquiries do not enter the solar pipeline. They get a plain
 * explanation and the EV charger route instead.
 */
export function Diversion({ type, onBack }: { type: Extract<PropertyType, "hdb" | "condo">; onBack: () => void }) {
  const isHdb = type === "hdb";
  return (
    <div className="sheet border-alert/40 p-6 sm:p-8">
      <p className="text-sm font-medium text-alert">Not a fit for the solar calculator</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
        {isHdb ? "HDB rooftops are not open to private installers." : "A condo roof needs the MCST's approval first."}
      </h2>
      <p className="mt-3 text-ink-2">
        {isHdb
          ? "HDB blocks are covered by the SolarNova programme, so we cannot install panels there. We can still install an EV charger at a landed home or a commercial site you own or manage."
          : "The roof belongs to the management corporation. Once the MCST has agreed in writing we can survey and quote. If you have an EV and a private lot, we can talk about a charger now."}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href={whatsappLink("Hi Hao Solar, I'd like to ask about an EV charger.")} external>
          <WhatsAppIcon className="h-5 w-5" />
          Ask about an EV charger
        </Button>
        <Button variant="outline" onClick={onBack}>
          Change property type
        </Button>
      </div>
    </div>
  );
}
