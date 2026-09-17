import fs from "node:fs";
import path from "node:path";

export const FIELD_INTERVIEW_LOCALES = {
  pt: {
    file: "entrevistas-campo-pt.md",
    title: "Roteiro de entrevista — Português",
    lang: "pt-BR",
  },
  es: {
    file: "entrevistas-campo-es.md",
    title: "Guión de entrevista — Español",
    lang: "es",
  },
} as const;

export type FieldInterviewLocale = keyof typeof FIELD_INTERVIEW_LOCALES;

export function parseFieldInterviewLocale(
  value: string,
): FieldInterviewLocale | null {
  if (value in FIELD_INTERVIEW_LOCALES) {
    return value as FieldInterviewLocale;
  }
  return null;
}

export function readFieldInterviewMarkdown(locale: FieldInterviewLocale): string {
  const { file } = FIELD_INTERVIEW_LOCALES[locale];
  const filePath = path.join(process.cwd(), "docs/connect-ia/proposta", file);
  return fs.readFileSync(filePath, "utf8");
}
