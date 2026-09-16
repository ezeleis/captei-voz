import {
  assembleFinalNote,
  humanReplyAffordance,
  identificationBlock,
  type CorretorIdentity,
  writtenDisclosure,
} from "@/lib/disclosure";
import type { NoteLang } from "@/lib/note-lang";

export function assembleWhatsAppText(
  whatsappBody: string,
  who: CorretorIdentity,
  lang: NoteLang,
): string {
  return [
    writtenDisclosure(lang),
    identificationBlock(who, lang),
    whatsappBody.trim(),
    humanReplyAffordance(lang),
  ].join("\n\n");
}

function emailGreeting(lang: NoteLang): string {
  switch (lang) {
    case "es":
      return "Estimado/a propietario/a,";
    case "en":
      return "Dear property owner,";
    default:
      return "Prezado(a) proprietário(a),";
  }
}

export function assembleEmailMessage(
  emailCore: string,
  who: CorretorIdentity,
  lang: NoteLang,
): string {
  return [
    emailGreeting(lang),
    "",
    emailCore.trim(),
    "",
    writtenDisclosure(lang),
    identificationBlock(who, lang),
    humanReplyAffordance(lang),
  ].join("\n");
}

/** Voice note — spoken disclosure + CRECI block (existing path). */
export function assembleVoiceScript(
  body: string,
  who: CorretorIdentity,
  lang: NoteLang,
): string {
  return assembleFinalNote(body, who, lang);
}
