"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { leadSchema, type LeadInput } from "@/lib/lead-schema";

type FormValues = Omit<LeadInput, "consent"> & { consent: boolean };
import { SITE } from "@/config/site";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: FormValues = {
  name: "",
  phone: "",
  email: "",
  propertyType: "landed",
  message: "",
  consent: false,
  website: "",
};

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
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
        body: JSON.stringify({ ...parsed.data, source: "website_contact" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setValues(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="sheet p-6" role="status">
        <p className="text-xl font-semibold">Received.</p>
        <p className="mt-2 text-ink-2">
          We reply during opening hours, {SITE.hours}. If it is urgent, WhatsApp {SITE.phoneDisplay}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" error={errors.name}>
          <Input id="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} />
        </Field>
        <Field id="phone" label="Mobile" error={errors.phone} hint="We reply on WhatsApp if you prefer.">
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!errors.phone} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          <Input id="email" type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} />
        </Field>
        <Field id="propertyType" label="Property">
          <Select id="propertyType" value={values.propertyType} onChange={(e) => set("propertyType", e.target.value as FormValues["propertyType"])}>
            <option value="landed">Landed home</option>
            <option value="commercial">Commercial or industrial</option>
            <option value="condo">Condominium (MCST approval needed)</option>
            <option value="hdb">HDB (EV charger enquiries only)</option>
          </Select>
        </Field>
      </div>
      <Field id="message" label="What do you need?" error={errors.message} hint="Address, roof type, current monthly bill, whether you drive an EV.">
        <Textarea id="message" value={values.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} />
      </Field>

      {/* Honeypot. Hidden from people, filled by bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-1 h-5 w-5 cursor-pointer accent-ink"
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <label htmlFor="consent" className="text-sm text-ink-2">
          I agree that {SITE.legalName} may store these details and contact me about this enquiry by phone, WhatsApp
          or email. I can withdraw consent at any time by writing to {SITE.email}.
        </label>
      </div>
      {errors.consent ? (
        <p id="consent-error" role="alert" className="-mt-3 text-sm text-alert">
          {errors.consent}
        </p>
      ) : null}

      {status === "error" ? (
        <p role="alert" className="text-sm text-alert">
          The form did not send. WhatsApp {SITE.phoneDisplay} or email {SITE.email} instead.
        </p>
      ) : null}

      <div>
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
