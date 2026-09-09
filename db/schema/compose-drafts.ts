import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { contacts } from "./contacts";
import { properties } from "./properties";

/**
 * One row per compose attempt.
 *
 * The raw transcript is kept alongside the rewrite on purpose: it is the only
 * way to later audit whether the rewrite changed what the corretor actually
 * meant. A product whose defence is "a human approved it" needs to be able to
 * show what the human was comparing against.
 */
export const composeDrafts = pgTable("compose_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),

  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  contactId: uuid("contact_id")
    .notNull()
    .references(() => contacts.id, { onDelete: "cascade" }),

  /** Detected input language: pt | es | en. */
  inputLanguage: varchar("input_language", { length: 5 }),
  rawTranscript: text("raw_transcript").notNull(),

  targetLanguage: varchar("target_language", { length: 5 })
    .notNull()
    .default("pt"),
  rewrittenText: text("rewritten_text"),

  /** Exactly what the TTS will speak, disclosure and CRECI block included. */
  finalSpokenText: text("final_spoken_text"),

  /** Storage reference for the rendered Ogg/Opus note. Never a data URL. */
  renderedAudioRef: text("rendered_audio_ref"),
  voiceId: varchar("voice_id", { length: 40 }),

  status: varchar("status", { length: 20 }).notNull().default("draft"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ComposeDraft = typeof composeDrafts.$inferSelect;
