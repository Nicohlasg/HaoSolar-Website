import { z } from "zod";

/** Shared between the contact form (client) and /api/lead (server). */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^(\+65\s?)?[3689]\d{3}\s?\d{4}$/, "Enter a Singapore number, e.g. 8020 8530."),
  email: z.string().trim().email("Enter a valid email address.").max(120),
  propertyType: z.enum(["landed", "commercial", "condo", "hdb"]),
  message: z.string().trim().min(10, "Tell us a little more, at least a sentence.").max(2000),
  consent: z.literal(true, { error: "We need your consent to contact you." }),
  /** Honeypot: must stay empty. */
  website: z.string().max(0).optional().default(""),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export const leadApiSchema = leadSchema.extend({
  source: z.enum(["website_contact", "website_calculator"]).default("website_contact"),
  estimate: z.record(z.string(), z.union([z.number(), z.string(), z.null()])).optional(),
});
