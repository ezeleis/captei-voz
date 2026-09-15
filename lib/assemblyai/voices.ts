import type { NoteLang } from "@/lib/note-lang";

/**
 * Stock Voice Agent voices for composed-note TTS.
 *
 * AssemblyAI has no clone API and no standalone TTS. Synthesis lives inside
 * the Voice Agent pipeline (`output.voice` on session.update). Voices are
 * language-specific: putting English through `rafael` yields Portuguese-
 * accented English. Catalog (2026-09-14):
 * https://www.assemblyai.com/docs/voice-agents/voice-agent-api/voices
 *
 * Qualify stays on QUALIFY_VOICE_ID (`rafael`). This map is compose-only.
 * `lola` is the only Spanish voice and is female — gender cannot match
 * `rafael`. That is a catalog limit, not a product choice.
 */

export const COMPOSE_VOICE_BY_LANG: Record<NoteLang, string> = {
  pt: "rafael",
  es: "lola",
  en: "michael",
};

export const COMPOSE_VOICE_LABEL: Record<NoteLang, string> = {
  pt: "rafael · português",
  es: "lola · español",
  en: "michael · English (US)",
};

export function voiceForNoteLang(lang: NoteLang): string {
  return COMPOSE_VOICE_BY_LANG[lang];
}
