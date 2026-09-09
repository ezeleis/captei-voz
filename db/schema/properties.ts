import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

/**
 * The captação subject. Holds no personal data.
 *
 * Track B public signals live here rather than in `contacts`, so a discovered
 * listing can be stored and worked without any person being recorded. The
 * provenance columns are mandatory for anything ad-sourced: without source URL,
 * portal and capture timestamp you cannot demonstrate the data was manifestly
 * public, and the LGPD Art. 7 §4 basis evaporates.
 */
export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 200 }).notNull(),
  neighbourhood: varchar("neighbourhood", { length: 120 }),
  propertyType: varchar("property_type", { length: 60 }),

  // Provenance — required when the property came from a public ad.
  sourceUrl: text("source_url"),
  portal: varchar("portal", { length: 60 }),
  capturedAt: timestamp("captured_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Property = typeof properties.$inferSelect;
