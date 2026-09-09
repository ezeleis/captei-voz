import "server-only";

/**
 * Server-side environment access.
 *
 * `ASSEMBLYAI_API_KEY` must never reach the browser. Every browser session
 * uses a short-lived, single-use token minted by our own server. Importing
 * `server-only` above turns any accidental client import into a build error
 * rather than a leaked key.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. See .env.example.`,
    );
  }
  return value;
}

export const env = {
  get assemblyAiApiKey(): string {
    return required("ASSEMBLYAI_API_KEY");
  },
  get databaseUrl(): string {
    return required("DATABASE_URL");
  },
  /** Output of publishing agents/qualify-owner.jsonc. Safe to log. */
  get qualifyAgentId(): string {
    return required("QUALIFY_AGENT_ID");
  },
};

/** True when a var is present, without throwing. For health checks. */
export function isConfigured(name: string): boolean {
  return Boolean(process.env[name]);
}
