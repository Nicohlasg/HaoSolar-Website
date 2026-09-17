import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email().max(120),
  website: z.string().max(0).optional().default(""),
});

/**
 * Tariff-alert sign-up. Draft: validates and logs. Production: write to the
 * CRM's subscribers table and send a confirmation via Resend.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  console.info("[subscribe] tariff alerts", { at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
