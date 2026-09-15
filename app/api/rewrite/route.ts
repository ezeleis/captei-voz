import { NextResponse } from "next/server";

import { rewriteDraft } from "@/lib/assemblyai/rewrite";
import {
  assembleFinalNote,
  containsForbiddenClaim,
} from "@/lib/disclosure";
import { corretorIdentity, isConfigured } from "@/lib/env";
import { isNoteLang, type NoteLang } from "@/lib/note-lang";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isConfigured("ASSEMBLYAI_API_KEY")) {
    return NextResponse.json(
      { error: "Serviço de voz indisponível no momento." },
      { status: 503 },
    );
  }

  let body: { transcript?: string; outputLang?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const transcript = body.transcript?.trim();
  if (!transcript) {
    return NextResponse.json({ error: "transcript required" }, { status: 400 });
  }

  const outputLang: NoteLang = isNoteLang(body.outputLang)
    ? body.outputLang
    : "pt";

  try {
    const rewritten = await rewriteDraft(transcript, outputLang);
    const forbidden = containsForbiddenClaim(rewritten);
    if (forbidden) {
      return NextResponse.json(
        { error: `rewrite produced a forbidden claim: ${forbidden}` },
        { status: 422 },
      );
    }

    const who = corretorIdentity();
    const finalSpoken = who
      ? assembleFinalNote(rewritten, who, outputLang)
      : rewritten;

    return NextResponse.json({
      rewritten,
      finalSpoken,
      outputLang,
      identity: who,
    });
  } catch (error) {
    console.error("rewrite:", error);
    return NextResponse.json(
      { error: "não foi possível reescrever o rascunho" },
      { status: 502 },
    );
  }
}
