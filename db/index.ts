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
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

function createDb() {
  const client = globalForDb.client ?? postgres(env.databaseUrl);
  if (process.env.NODE_ENV !== "production") globalForDb.client = client;
  return drizzle(client, { schema });
}

/**
 * Lazy so pages that do not need Postgres (the landing page, the demo
 * qualify path) can render when DATABASE_URL is unset. Accessing `db`
 * without the URL still throws, via `env.databaseUrl`.
 */
export const db: ReturnType<typeof drizzle<typeof schema>> = new Proxy(
  {} as ReturnType<typeof drizzle<typeof schema>>,
  {
    get(_target, prop, receiver) {
      const instance = (globalForDb.db ??= createDb());
      const value = Reflect.get(instance, prop, receiver);
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
