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
 * Used by compose TTS and live qualify. `lola` is the only Spanish voice
 * (🇪🇸; no Argentine TTS exists). Spanish *copy* is Río de la Plata; the
 * accent is still `lola`. Female — gender cannot match `rafael`.
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
