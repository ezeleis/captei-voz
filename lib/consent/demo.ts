import "server-only";

import type { ReachableContact } from "@/lib/consent/gate";

/**
 * Seeded demo contact for the public demo.
 *
 * The CRM this product is meant to read consent from does not exist yet
 * (Epic 1, no leads table). The demo therefore cannot prove a real Track A
 * opt-in. The stress-test required this to be visible, not hidden:
 * faking consent in a demo whose thesis is consent is an honesty risk.
 * See docs/bmad/stress-test.md, adversarial finding 4.
 *
 * This module is the only permitted source of a contact that did not come
 * from the database. The gate still has to construct the ReachableContact —
 * callers must not import this and bypass the gate.
 */

export const DEMO_CONTACT_ID = "demo";
export const DEMO_PROPERTY_ID = "demo";

export const DEMO_PROPERTY = {
  id: DEMO_PROPERTY_ID,
  label: "Apto. 50 m² — Rodovia Virgílio Várzea",
  neighbourhood: "Saco Grande",
} as const;

export const DEMO_CONTACT_ROW = {
  id: DEMO_CONTACT_ID,
  fullName: "Maria Souza",
  phoneE164: "+5548999990000",
  consentSource: "avaliacao_form_seeded",
  consentAt: new Date("2026-09-01T12:00:00.000Z"),
  whatsappOptedOut: false,
  windowOpenedAt: new Date("2026-09-08T12:00:00.000Z"),
} as const;

export function demoReachableContact(): ReachableContact {
  return {
    id: DEMO_CONTACT_ROW.id,
    fullName: DEMO_CONTACT_ROW.fullName,
    phoneE164: DEMO_CONTACT_ROW.phoneE164,
    consentSource: DEMO_CONTACT_ROW.consentSource,
    consentAt: DEMO_CONTACT_ROW.consentAt,
  } as ReachableContact;
}
