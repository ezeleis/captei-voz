import { NextResponse } from "next/server";

import { QUALIFY_VOICE_ID } from "@/lib/assemblyai/qualify-config";
import { renderVerbatim } from "@/lib/assemblyai/render";
import { containsForbiddenClaim } from "@/lib/disclosure";
import { isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 180;

const MAX_CHARS = 2000;

/**
 * Render approved note text verbatim via the Voice Agent greeting field.
 * Greeting bypasses the LLM — the owner hears exactly this string.
 * See docs/bmad/recommended-mvp.md §4.
 */
export async function POST(request: Request) {
  if (!isConfigured("ASSEMBLYAI_API_KEY")) {
    return NextResponse.json(
      { error: "ASSEMBLYAI_API_KEY não configurada no servidor." },
      { status: 503 },
    );
  }

  let body: { text?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }
  if (text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `text exceeds ${MAX_CHARS} characters` },
      { status: 400 },
    );
  }

  const forbidden = containsForbiddenClaim(text);
  if (forbidden) {
    return NextResponse.json(
      { error: `text contains a forbidden claim: ${forbidden}` },
      { status: 422 },
    );
  }

  try {
    const result = await renderVerbatim(text, QUALIFY_VOICE_ID);
    const durationMs = Math.round(
      (result.pcm.length / 2 / result.sampleRate) * 1000,
    );
    return NextResponse.json({
      audio: result.pcm.toString("base64"),
      sampleRate: result.sampleRate,
      durationMs,
      voice: QUALIFY_VOICE_ID,
    });
  } catch (error) {
    console.error("render:", error);
    return NextResponse.json(
      { error: "não foi possível gerar o áudio" },
      { status: 502 },
    );
  }
}
