import { NextResponse } from "next/server";
import { leadApiSchema } from "@/lib/lead-schema";

/**
 * Receives a lead from the contact form or the calculator.
 * Draft behaviour: validate, drop honeypot hits, email via Resend when a key
 * is configured, otherwise log to the server console. Supabase write comes
 * with the CRM project.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadApiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed", issues: parsed.error.issues }, { status: 422 });
  }

  const lead = parsed.data;
  // Honeypot: pretend success so bots stop, but record nothing.
  if (lead.website && lead.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const receivedAt = new Date().toISOString();
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_EMAIL;

  if (apiKey && to) {
    const text = [
      `New ${lead.source} lead, ${receivedAt}`,
      `Name: ${lead.name}`,
      `Phone: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Property: ${lead.propertyType}`,
      `Message: ${lead.message}`,
      lead.estimate ? `Estimate: ${JSON.stringify(lead.estimate)}` : "",
      `WhatsApp: https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^(?!65)/, "65")}`,
    ]
      .filter(Boolean)
      .join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? "leads@haosolar.com.sg",
        to,
        subject: `New enquiry: ${lead.name} (${lead.propertyType})`,
        text,
      }),
    });
    if (!res.ok) {
      console.error("[lead] Resend failed", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "Notification failed" }, { status: 502 });
    }
  } else {
    // Draft mode: no mail provider configured. Log without the message body.
    console.info("[lead] received", { source: lead.source, propertyType: lead.propertyType, receivedAt });
  }

  return NextResponse.json({ ok: true });
}
