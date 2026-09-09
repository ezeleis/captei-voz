import { jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { contacts } from "./contacts";

/**
 * One row per consented live-qualify conversation.
 *
 * `sessionId` is AssemblyAI's, so the recording and timeline can be re-fetched
 * later — artifact URLs are pre-signed and expire, so we store the id, not the
 * URL. Deleting a contact must cascade here too: a titular deletion request has
 * to remove the session and its recording, not just the contact row.
 */
export const qualifySessions = pgTable("qualify_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),

  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),

  /** AssemblyAI session id, e.g. sess_9a648a2a… */
  sessionId: varchar("session_id", { length: 80 }).notNull().unique(),

  /** Written back by the agent's tool call. */
  qualification: jsonb("qualification"),

  recordingRef: text("recording_ref"),

  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
});

export type QualifySession = typeof qualifySessions.$inferSelect;
