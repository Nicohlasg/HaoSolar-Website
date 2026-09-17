"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { SITE, whatsappLink } from "@/config/site";
import { leadSchema } from "@/lib/lead-schema";
import { formatSgd } from "@/lib/format";
import type { CalculatorState } from "./state";
import { estimate } from "@/lib/calc";

type Status = "idle" | "sending" | "sent" | "error";

export function LeadForm({ state, onBack }: { state: CalculatorState; onBack: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [referral, setReferral] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const result = estimate({ roofAreaM2: state.roofAreaM2 ?? 0, monthlyBillSgd: state.monthlyBillSgd, usagePattern: state.usagePattern ?? "daytime", phase: state.phase ?? "unknown" });

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const message = [
      `Calculator lead. Postal ${state.postalCode}, ${state.propertyType}, roof ${state.roofAreaM2} m², ${state.roofMaterial} roof, ${state.storeys} storeys, ${state.phase} phase, bill ${formatSgd(state.monthlyBillSgd)}, retailer ${state.retailer}, usage ${state.usagePattern}, EV ${state.ev}.`,
      referral ? `Referral: ${referral}` : "",
    ]
      .filter(Boolean)
      .join(" ");
    const parsed = leadSchema.safeParse({ name, phone, email, propertyType: state.propertyType ?? "landed", message, consent, website: "" });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...parsed.data,
          source: "website_calculator",
          estimate: {
            systemKwp: result.systemKwp,
            panelCount: result.panelCount,
            monthlySavingsSgd: result.monthlySavingsSgd,
            priceLowSgd: result.priceLowSgd,
            priceHighSgd: result.priceHighSgd,
          },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="sheet p-6 sm:p-8" role="status">
        <p className="text-sm text-ink-2">Survey request received</p>
        <h1 className="mt-1 text-3xl font-semibold">We will call to fix a time.</h1>
        <p className="mt-3 text-ink-2">
          During opening hours, {SITE.hours}. Have your last bill nearby. If it is quicker, WhatsApp us now.
        </p>
        <div className="mt-6">
          <Button href={whatsappLink(`Hi Hao Solar, I just requested a survey for postal code ${state.postalCode}.`)} external>
            <WhatsAppIcon className="h-5 w-5" />
            WhatsApp {SITE.phoneDisplay}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-ink-2">Last step</p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Where should we send the fixed quotation?</h1>
      <p className="mt-3 max-w-xl text-ink-2">
        A free survey turns the range into a number. We do not share your details and we do not chase beyond this
        enquiry unless you ask.
      </p>
      <form onSubmit={onSubmit} noValidate className="mt-8 grid max-w-xl gap-5">
        <Field id="lead-name" label="Name" error={errors.name}>
          <Input id="lead-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <Field id="lead-phone" label="Mobile" error={errors.phone}>
          <Input id="lead-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
        </Field>
        <Field id="lead-email" label="Email" error={errors.email}>
          <Input id="lead-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        </Field>
        <Field id="lead-referral" label="Referral code (optional)">
          <Input id="lead-referral" value={referral} onChange={(e) => setReferral(e.target.value)} />
        </Field>
        <div className="flex items-start gap-3">
          <input id="lead-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 cursor-pointer accent-ink" aria-invalid={!!errors.consent} />
          <label htmlFor="lead-consent" className="text-sm text-ink-2">
            I agree that {SITE.legalName} may store my answers and contact me about this enquiry by phone, WhatsApp or
            email. I can withdraw consent by writing to {SITE.email}.
          </label>
        </div>
        {errors.consent ? <p role="alert" className="-mt-3 text-sm text-alert">{errors.consent}</p> : null}
        {status === "error" ? (
          <p role="alert" className="text-sm text-alert">
            The request did not send. WhatsApp {SITE.phoneDisplay} instead.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Request the free survey"}
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            Back to my statement
          </Button>
        </div>
      </form>
    </div>
  );
}
