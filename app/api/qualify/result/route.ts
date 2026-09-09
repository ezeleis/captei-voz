import { NextResponse } from "next/server";

import { db } from "@/db";
import { qualifySessions } from "@/db/schema/qualify-sessions";
import { resolveReachableContact } from "@/lib/consent/gate";
import { DEMO_CONTACT_ID } from "@/lib/consent/demo";
import { isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Write-back from the Voice Agent's registrar_qualificacao tool.
 *
 * The gate runs first: a qualification cannot be stored against a contact
 * that would not be reachable. Demo contact is in-memory only when Postgres
 * is not configured.
 */

const memoryLog = new Map<string, unknown>();

export async function POST(request: Request) {
  let body: {
    contactId?: string;
    sessionId?: string;
    qualification?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const contactId = body.contactId;
  if (!contactId) {
    return NextResponse.json({ error: "contactId required" }, { status: 400 });
  }

  const gated = await resolveReachableContact(contactId);
  if (!gated.ok) {
    return NextResponse.json(
      { error: gated.reason, code: gated.code },
      { status: 403 },
    );
  }

  const record = {
    contactId: gated.contact.id,
    sessionId: body.sessionId ?? null,
    qualification: body.qualification ?? null,
    storedAt: new Date().toISOString(),
  };

  if (contactId === DEMO_CONTACT_ID || !isConfigured("DATABASE_URL")) {
    memoryLog.set(contactId, record);
    return NextResponse.json({ ok: true, persisted: "memory", record });
  }

  if (body.sessionId) {
    await db.insert(qualifySessions).values({
      contactId: gated.contact.id,
      sessionId: body.sessionId,
      qualification: body.qualification ?? null,
    });
  }

  return NextResponse.json({ ok: true, persisted: "postgres", record });
}
