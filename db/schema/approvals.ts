import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { composeDrafts } from "./compose-drafts";
import { contacts } from "./contacts";

/**
 * Append-only. This is the artefact the gestora is actually buying, and the
 * record that makes the corretor — rather than the algorithm — the author of
 * the message.
 *
 * Retained five years, tracking COFECI Res. 1.551/2025 art. 49 §5.
 */
export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),

  draftId: uuid("draft_id")
    .notNull()
    .references(() => composeDrafts.id, { onDelete: "cascade" }),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),

  approvedByName: varchar("approved_by_name", { length: 200 }).notNull(),
  approvedByCreci: varchar("approved_by_creci", { length: 40 }).notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true })
    .notNull()
    .defaultNow(),

  /** Which consent record was relied on, captured at approval time. */
  consentSource: varchar("consent_source", { length: 40 }).notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),

  /** The exact disclosure wording used, in case it changes later. */
  disclosureText: text("disclosure_text").notNull(),

  /** Exactly what was approved, frozen. */
  approvedText: text("approved_text").notNull(),
});

export type Approval = typeof approvals.$inferSelect;
