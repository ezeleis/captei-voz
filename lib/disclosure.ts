import type { NoteLang } from "@/lib/note-lang";

/**
 * Every composed note carries four things. Three of them were specified by
 * COFECI Resolução 1.551/2025 art. 49, which was annulled in February 2026 on
 * registry-competence grounds unrelated to its AI provisions. It remains the
 * clearest statement of what the profession's regulator expects, and a
 * CRECI ethics panel can reach the same result today through Res. 326/92
 * art. 5. See docs/bmad/stress-test.md, amendment A3.
 */

export type CorretorIdentity = {
  fullName: string;
  /** e.g. "SC 12345". Comes from the verified profile, never user input. */
  creci: string;
};

/**
 * Spoken at the top of the audio itself, not only in a text caption the owner
 * may never read. Short on purpose: it has to survive being heard once.
 */
export function spokenDisclosure(lang: NoteLang = "pt"): string {
  switch (lang) {
    case "es":
      return "Mensaje grabado con voz digital.";
    case "en":
      return "This message was recorded with a digital voice.";
    default:
      return "Mensagem gravada com voz digital.";
  }
}

/**
 * Non-editable identification block. This is deliberately returned as a whole
 * string rather than as template variables, so there is no seam at which a
 * corretor can delete the CRECI number and still send.
 */
export function identificationBlock(
  who: CorretorIdentity,
  lang: NoteLang = "pt",
): string {
  switch (lang) {
    case "es":
      return `${who.fullName}, corredor de inmuebles, CRECI ${who.creci}.`;
    case "en":
      return `${who.fullName}, real estate broker, CRECI ${who.creci}.`;
    default:
      return `${who.fullName}, corretor de imóveis, CRECI ${who.creci}.`;
  }
}

/** Satisfies both COFECI art. 49 §1 and Meta's escalation-path requirement. */
export function humanReplyAffordance(lang: NoteLang = "pt"): string {
  switch (lang) {
    case "es":
      return "Si prefiere, responda en cualquier momento y hablo directamente con usted.";
    case "en":
      return "If you prefer, reply at any time and I will speak with you directly.";
    default:
      return "Se preferir, responda a qualquer momento e eu falo diretamente com você.";
  }
}

/**
 * Assemble the full text that will be spoken, in order.
 *
 * The corretor approves exactly this string, and exactly this string is what
 * the TTS speaks — the Voice Agent `greeting` field bypasses the LLM, so there
 * is no paraphrase between approval and delivery. That property is the whole
 * reason the render path was chosen. See docs/bmad/recommended-mvp.md §4.
 */
export function assembleFinalNote(
  body: string,
  who: CorretorIdentity,
  lang: NoteLang = "pt",
): string {
  return [
    spokenDisclosure(lang),
    identificationBlock(who, lang),
    body.trim(),
    humanReplyAffordance(lang),
  ].join(" ");
}

/**
 * Claims that must never ship. Enforced here so the list lives in code rather
 * than only in a document nobody rereads.
 *
 * "Soa como você" on a stock voice is false as to an essential characteristic
 * of the service (CDC art. 37 §1, strict liability). The other two create
 * binding contractual terms under CDC art. 30.
 */
export const FORBIDDEN_CLAIMS = [
  "soa como você",
  "sounds like you",
  "suena como tú",
  "suena como usted",
  "100% em conformidade com a lgpd",
] as const;

export function containsForbiddenClaim(copy: string): string | null {
  const haystack = copy.toLowerCase();
  return FORBIDDEN_CLAIMS.find((claim) => haystack.includes(claim)) ?? null;
}
