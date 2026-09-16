import "server-only";

import type { NoteLang } from "@/lib/note-lang";

import { complete } from "@/lib/assemblyai/rewrite-shared";

export type OmnichannelDraft = {
  /** Core message body — no CRECI, no disclosure. */
  body: string;
  /** Shorter variant tuned for WhatsApp line breaks. */
  whatsappBody: string;
  emailSubject: string;
  /** Email core paragraphs — no greeting/signature. */
  emailBody: string;
};

function omnichannelSystemPrompt(outputLang: NoteLang): string {
  const langLabel =
    outputLang === "es"
      ? "español rioplatense"
      : outputLang === "en"
        ? "English"
        : "português brasileiro";

  return `You rewrite a Brazilian real-estate broker's rough spoken draft into professional outbound copy for multiple channels.

MANDATORY OUTPUT LANGUAGE for all fields: ${langLabel}. Translate facts if the draft is in another language.

Return ONLY valid JSON with exactly these keys (no markdown fences):
{
  "body": "professional message body — facts preserved, cordial, one idea per short paragraph",
  "whatsappBody": "shorter WhatsApp version — same facts, tighter, use line breaks between ideas",
  "emailSubject": "concise email subject about the property outreach (≤ 80 chars)",
  "emailBody": "formal email core — greeting omitted, signature omitted, 2–4 short paragraphs"
}

Rules for all fields:
- Keep facts: address, price, type, timeline, names. Do not invent.
- No emojis. No slang. No "sounds like you" / "soa como você".
- Do NOT include CRECI, broker name, or AI/voice disclaimers — added later by the app.
- No quotes around JSON values beyond standard JSON string escaping.`;
}

function omnichannelUserPrompt(
  transcript: string,
  outputLang: NoteLang,
  propertyLabel?: string,
): string {
  const propertyLine = propertyLabel
    ? `\nProperty context: ${propertyLabel}`
    : "";
  switch (outputLang) {
    case "es":
      return `Reescribí este borrador para los tres canales:${propertyLine}\n\n${transcript.trim()}`;
    case "en":
      return `Rewrite this draft for all three channels:${propertyLine}\n\n${transcript.trim()}`;
    default:
      return `Reescreva este rascunho para os três canais:${propertyLine}\n\n${transcript.trim()}`;
  }
}

function parseOmnichannelJson(raw: string): OmnichannelDraft {
  const trimmed = raw.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(unfenced) as Partial<OmnichannelDraft>;
  const body = parsed.body?.trim();
  const whatsappBody = parsed.whatsappBody?.trim();
  const emailSubject = parsed.emailSubject?.trim();
  const emailBody = parsed.emailBody?.trim();

  if (!body || !whatsappBody || !emailSubject || !emailBody) {
    throw new Error("omnichannel rewrite returned incomplete JSON");
  }

  return { body, whatsappBody, emailSubject, emailBody };
}

export async function rewriteOmnichannel(
  transcript: string,
  outputLang: NoteLang,
  propertyLabel?: string,
): Promise<OmnichannelDraft> {
  const text = await complete(
    omnichannelSystemPrompt(outputLang),
    omnichannelUserPrompt(transcript, outputLang, propertyLabel),
    900,
  );
  return parseOmnichannelJson(text);
}
