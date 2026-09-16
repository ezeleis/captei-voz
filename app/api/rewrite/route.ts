import { NextResponse } from "next/server";

import { rewriteOmnichannel } from "@/lib/assemblyai/rewrite-omnichannel";
import { rewriteDraft } from "@/lib/assemblyai/rewrite";
import {
  assembleEmailMessage,
  assembleVoiceScript,
  assembleWhatsAppText,
} from "@/lib/compose/channels";
import { containsForbiddenClaim } from "@/lib/disclosure";
import { corretorIdentity, isConfigured } from "@/lib/env";
import { isNoteLang, type NoteLang } from "@/lib/note-lang";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function defaultEmailSubject(outputLang: NoteLang, propertyLabel?: string): string {
  const place = propertyLabel?.trim();
  switch (outputLang) {
    case "es":
      return place ? `Consulta sobre ${place}` : "Consulta sobre su propiedad";
    case "en":
      return place ? `Regarding ${place}` : "Regarding your property";
    default:
      return place ? `Contato sobre ${place}` : "Contato sobre seu imóvel";
  }
}

function forbiddenInFields(fields: Record<string, string>): string | null {
  for (const value of Object.values(fields)) {
    const hit = containsForbiddenClaim(value);
    if (hit) return hit;
  }
  return null;
}

export async function POST(request: Request) {
  if (!isConfigured("ASSEMBLYAI_API_KEY")) {
    return NextResponse.json(
      { error: "Serviço de voz indisponível no momento." },
      { status: 503 },
    );
  }

  let body: {
    transcript?: string;
    outputLang?: string;
    propertyLabel?: string;
  };
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
  const propertyLabel = body.propertyLabel?.trim();

  try {
    let coreBody: string;
    let whatsappBody: string;
    let emailSubject: string;
    let emailCore: string;

    try {
      const draft = await rewriteOmnichannel(
        transcript,
        outputLang,
        propertyLabel,
      );
      coreBody = draft.body;
      whatsappBody = draft.whatsappBody;
      emailSubject = draft.emailSubject;
      emailCore = draft.emailBody;
    } catch (omniError) {
      console.warn("omnichannel rewrite fallback:", omniError);
      coreBody = await rewriteDraft(transcript, outputLang);
      whatsappBody = coreBody;
      emailSubject = defaultEmailSubject(outputLang, propertyLabel);
      emailCore = coreBody;
    }

    const who = corretorIdentity();
    const whatsappText = who
      ? assembleWhatsAppText(whatsappBody, who, outputLang)
      : whatsappBody;
    const emailBody = who
      ? assembleEmailMessage(emailCore, who, outputLang)
      : emailCore;
    const finalSpoken = who
      ? assembleVoiceScript(coreBody, who, outputLang)
      : coreBody;

    const forbidden = forbiddenInFields({
      coreBody,
      whatsappText,
      emailSubject,
      emailBody,
      finalSpoken,
    });
    if (forbidden) {
      return NextResponse.json(
        { error: `rewrite produced a forbidden claim: ${forbidden}` },
        { status: 422 },
      );
    }

    return NextResponse.json({
      rewritten: coreBody,
      whatsappText,
      emailSubject,
      emailBody,
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
