export const NOTE_LANGS = ["pt", "es", "en"] as const;

export type NoteLang = (typeof NOTE_LANGS)[number];

export const NOTE_LANG_LABEL: Record<NoteLang, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
};

export function isNoteLang(value: unknown): value is NoteLang {
  return value === "pt" || value === "es" || value === "en";
}
