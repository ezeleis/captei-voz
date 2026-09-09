import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Mirrors the CRM's contacts table deliberately, including the constraint that
 * does the work: consentSource and consentAt are both NOT NULL.
 *
 * A number scraped from a portal ad cannot be written here without fabricating
 * a consent record. That is the point — the schema refuses the design mistake
 * rather than a policy document discouraging it.
 * See CRM/docs/captacao/02-legal-constraints.md §4.
 */
export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 200 }).notNull(),
  phoneE164: varchar("phone_e164", { length: 20 }).notNull().unique(),

  consentSource: varchar("consent_source", { length: 40 }).notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),

  whatsappOptedOut: boolean("whatsapp_opted_out").notNull().default(false),

  /**
   * When the owner last messaged or called us. Audio may only be delivered
   * within 24h of this timestamp, because audio cannot be sent as a template.
   * Null means no window has ever opened and no voice note may be sent.
   * See docs/bmad/stress-test.md, claim 2.
   */
  windowOpenedAt: timestamp("window_opened_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Contact = typeof contacts.$inferSelect;
