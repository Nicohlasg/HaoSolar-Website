"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { isValidSingaporePostalCode } from "@/lib/calc";
import { cn } from "@/lib/cn";

export function PostalCodeForm({ className, size = "lg" }: { className?: string; size?: "md" | "lg" }) {
  const id = useId();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim();
    if (!isValidSingaporePostalCode(trimmed)) {
      setError("Enter the 6-digit postal code of the house.");
      return;
    }
    setError(null);
    router.push(`/calculator?postal=${trimmed}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="sr-only">
        Postal code
      </label>
      <div className="flex flex-col gap-2 xs:flex-row">
        <Input
          id={id}
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="[0-9]{6}"
          maxLength={6}
          placeholder="Postal code, e.g. 757695"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("tnum", size === "lg" && "h-13 text-lg")}
        />
        <Button type="submit" size={size} className="shrink-0">
          See my roof
        </Button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm text-alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
