"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { leadSchema } from "@/lib/lead-schema";
import { SITE } from "@/config/site";

type Status = "idle" | "sending" | "sent" | "error";

/** Short version of the contact form: name, email, phone, land type. */
export function QuickLeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [property, setProperty] = useState<"landed" | "commercial" | "condo" | "hdb">("landed");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse({ name, email, phone, propertyType: property, message: `Quick enquiry from the homepage for a ${property} property.`, consent, website: "" });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...parsed.data, source: "website_contact" }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="text-lg">
        <span className="font-semibold">Received.</span> We call during opening hours, {SITE.hours}.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="q-name" label="Name" error={errors.name}>
          <Input id="q-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <Field id="q-phone" label="Mobile" error={errors.phone}>
          <Input id="q-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
        </Field>
        <Field id="q-email" label="Email" error={errors.email}>
          <Input id="q-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        </Field>
        <Field id="q-property" label="Property">
          <Select id="q-property" value={property} onChange={(e) => setProperty(e.target.value as typeof property)}>
            <option value="landed">Landed home</option>
            <option value="commercial">Commercial or industrial</option>
            <option value="condo">Condominium</option>
            <option value="hdb">HDB (EV charger only)</option>
          </Select>
        </Field>
      </div>
      <label className="flex items-start gap-3 text-sm text-ink-2">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5 cursor-pointer accent-ink" aria-invalid={!!errors.consent} />
        <span>
          {SITE.legalName} may store these details and contact me about this enquiry. Withdraw any time via {SITE.email}.
        </span>
      </label>
      {errors.consent ? <p role="alert" className="-mt-2 text-sm text-alert">{errors.consent}</p> : null}
      {status === "error" ? <p role="alert" className="text-sm text-alert">Did not send. WhatsApp {SITE.phoneDisplay} instead.</p> : null}
      <div>
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Get my solar plan"}
        </Button>
      </div>
    </form>
  );
}
