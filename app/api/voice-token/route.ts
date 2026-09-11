import { NextResponse } from "next/server";

import { corretorIdentity, env, isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Mint a single-use temporary token for the Voice Agent API.
 *
 * The API key never leaves the server. Tokens are single-use and short-lived,
 * so the client must fetch a fresh one immediately before every connection,
 * including reconnects via session.resume.
 *
 * Auth: this endpoint takes `Authorization: Bearer <key>`. POST /v1/agents
 * and GET /v1/sessions take the bare key. Streaming STT token also takes the
 * bare key. See docs/bmad/stress-test.md 6c.
 *
 * QUALIFY_AGENT_ID is optional. When present the client binds a stored agent;
 * when absent it configures the session inline (local demo).
 */
export async function GET() {
  if (!isConfigured("ASSEMBLYAI_API_KEY")) {
    return NextResponse.json(
      { error: "ASSEMBLYAI_API_KEY não configurada no servidor." },
      { status: 503 },
    );
  }

  const url = new URL("https://agents.assemblyai.com/v1/token");
  url.searchParams.set("expires_in_seconds", "120");
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
    {
      token,
      agentId: isConfigured("QUALIFY_AGENT_ID") ? env.qualifyAgentId : null,
      corretor: corretorIdentity(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
