import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";

import { approvals } from "./schema/approvals";
import { composeDrafts } from "./schema/compose-drafts";
import { contacts } from "./schema/contacts";
import { properties } from "./schema/properties";
import { qualifySessions } from "./schema/qualify-sessions";

export const schema = {
  approvals,
  composeDrafts,
  contacts,
  properties,
  qualifySessions,
};

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof postgres> | undefined;
};

const client = globalForDb.client ?? postgres(env.databaseUrl);
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
