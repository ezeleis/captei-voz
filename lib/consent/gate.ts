import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { contacts } from "@/db/schema/contacts";
import { isConfigured } from "@/lib/env";
import { DEMO_CONTACT_ID, demoReachableContact } from "@/lib/consent/demo";

/**
 * THE GATE.
 *
 * This module is the only place in the codebase permitted to resolve a
 * contact for outbound purposes. Everything downstream — compose desk,
 * renderer, delivery handoff — takes an already-gated `ReachableContact` and
 * never a raw id or phone number.
 *
 * If a second code path can resolve a destination, the guarantee this product
 * is built on is gone. See docs/bmad/stress-test.md, claim 1.
 */

/** A contact that has cleared the gate. Only this module can construct one. */
export type ReachableContact = {
  readonly id: string;
  readonly fullName: string;
  readonly phoneE164: string;
  readonly consentSource: string;
  readonly consentAt: Date;
  /** Branding: prevents a plain object being passed off as gated. */
  readonly __gated: unique symbol;
};

export type GateRefusal = {
  ok: false;
  /** Shown to the corretor verbatim. The refusal is a feature, not an error. */
  reason: string;
  code: "not_found" | "no_consent" | "opted_out" | "public_signal_only";
};

export type GateResult = { ok: true; contact: ReachableContact } | GateRefusal;

/**
 * Resolve a contact for outbound use, or refuse with a reason.
 *
 * Refusals are surfaced in the UI rather than swallowed, because the gestora
 * buying this product needs to see the boundary working.
 */
export async function resolveReachableContact(
  contactId: string,
): Promise<GateResult> {
  if (contactId === DEMO_CONTACT_ID) {
    return { ok: true, contact: demoReachableContact() };
  }

  if (!isConfigured("DATABASE_URL")) {
    return {
      ok: false,
      code: "not_found",
      reason: "Contato não encontrado.",
    };
  }

  const [row] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  if (!row) {
    return {
      ok: false,
      code: "not_found",
      reason: "Contato não encontrado.",
    };
  }

  // consentSource and consentAt are NOT NULL at the database level, so a
  // scraped number cannot be written here without fabricating a consent
  // record. This check defends against a nullable column being introduced
  // later, and documents the invariant at the point it matters.
  if (!row.consentSource || !row.consentAt) {
    return {
      ok: false,
      code: "no_consent",
      reason:
        "Este contato não tem registro de consentimento. Nenhuma mensagem pode ser composta ou enviada.",
    };
  }

  if (row.whatsappOptedOut) {
    return {
      ok: false,
      code: "opted_out",
      reason: "Este contato pediu para não receber mensagens.",
    };
  }

  return {
    ok: true,
    contact: {
      id: row.id,
      fullName: row.fullName,
      phoneE164: row.phoneE164,
      consentSource: row.consentSource,
      consentAt: row.consentAt,
    } as ReachableContact,
  };
}

/**
 * Whether a gated contact may receive a voice note *right now*.
 *
 * Consent is necessary but not sufficient. Audio is not a supported WhatsApp
 * template header type, so it can only be delivered free-form, which requires
 * an open customer service window — and that window opens only when the owner
 * messages or calls first. See docs/bmad/stress-test.md, claim 2.
 *
 * This is deliberately separate from `resolveReachableContact`: a contact can
 * be legitimately reachable for a *template* while not being reachable for
 * *audio*.
 */
export function audioWindowState(windowOpensAt: Date | null): {
  open: boolean;
  reason: string;
} {
  if (!windowOpensAt) {
    return {
      open: false,
      reason:
        "A janela de 24h não está aberta. O proprietário precisa enviar uma mensagem primeiro — use o link Click-to-WhatsApp.",
    };
  }

  const expiresAt = new Date(windowOpensAt.getTime() + 24 * 60 * 60 * 1000);
  if (expiresAt <= new Date()) {
    return {
      open: false,
      reason: "A janela de 24h expirou. Aguarde uma nova mensagem do proprietário.",
    };
  }

  return { open: true, reason: "" };
}
