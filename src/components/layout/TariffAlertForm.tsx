"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { SOLAR_MODEL } from "@/config/solar-model";

type Status = "idle" | "sending" | "sent" | "error";

/** Footer newsletter with a real reason: a note when SP Group revises the tariff. */
export function TariffAlertForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website: "" }) });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <p role="status" className="text-sm text-ink">Noted. You will hear from us when the tariff changes.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2">
      <label htmlFor="tariff-email" className="sr-only">
        Email address
      </label>
      <div className="neu-inset flex items-center rounded-full p-1 pl-4">
        <input
          id="tariff-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink placeholder:text-ink-2/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          aria-label="Subscribe to tariff alerts"
          className="neu-sm neu-press inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-lime text-ink transition-colors hover:bg-lime-deep disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="text-xs text-ink-2">
        Current tariff {(SOLAR_MODEL.TARIFF_SGD_PER_KWH * 100).toFixed(2)}¢/kWh, revised quarterly. One email per change, nothing else.
      </p>
      {status === "error" ? <p role="alert" className="text-xs text-alert">Did not send. Try again later.</p> : null}
    </form>
  );
}
