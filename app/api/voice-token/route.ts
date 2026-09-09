import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Mint a single-use temporary token for the Voice Agent API.
 *
 * The API key never leaves the server. Tokens are single-use and short-lived,
 * so the client must fetch a fresh one immediately before every connection,
 * including reconnects via session.resume.
 *
 * Auth note: this endpoint takes `Authorization: Bearer <key>`, while
 * POST /v1/agents and GET /v1/sessions take the bare key, and the Streaming
 * STT token endpoint also takes the bare key. The inconsistency is in
 * AssemblyAI's own docs — see docs/bmad/stress-test.md 6c.
 */
export async function GET() {
  const url = new URL("https://agents.assemblyai.com/v1/token");
  // 60–300s is a sensible redemption window: long enough for a slow client,
  // short enough to limit replay.
  url.searchParams.set("expires_in_seconds", "120");
  // Cap the session so an abandoned tab cannot bill for the 3-hour maximum.
  url.searchParams.set("max_session_duration_seconds", "600");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${env.assemblyAiApiKey}` },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("voice-token: upstream %d %s", response.status, detail);
    return NextResponse.json(
      { error: "could not mint voice agent token" },
      { status: 502 },
    );
  }

  const { token } = (await response.json()) as { token: string };
  return NextResponse.json(
    { token, agentId: env.qualifyAgentId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
