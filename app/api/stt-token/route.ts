import { NextResponse } from "next/server";

import { env, isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Mint a single-use temporary token for Real-time (streaming) STT.
 *
 * The compose desk transcribes live rather than uploading a finished file:
 * both technology paths this hackathon sanctions are real-time, and nothing
 * blesses batch transcription as the foundation of a submission.
 * See docs/bmad/stress-test.md, claim 4.
 *
 * Auth note: this endpoint takes the BARE key, not `Bearer`. The Voice Agent
 * token endpoint is the opposite. Also note AssemblyAI's docs describe this as
 * a POST in prose while every code sample issues a GET; GET is what the
 * samples do, so GET is what we do.
 */
export async function GET() {
  if (!isConfigured("ASSEMBLYAI_API_KEY")) {
    return NextResponse.json(
      { error: "Serviço de voz indisponível no momento." },
      { status: 503 },
    );
  }

  const url = new URL("https://streaming.assemblyai.com/v3/token");
  url.searchParams.set("expires_in_seconds", "120");
  url.searchParams.set("max_session_duration_seconds", "300");

  const response = await fetch(url, {
    headers: { Authorization: env.assemblyAiApiKey },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("stt-token: upstream %d %s", response.status, detail);
    return NextResponse.json(
      { error: "could not mint streaming token" },
      { status: 502 },
    );
  }

  const { token } = (await response.json()) as { token: string };
  return NextResponse.json(
    { token },
    { headers: { "Cache-Control": "no-store" } },
  );
}
