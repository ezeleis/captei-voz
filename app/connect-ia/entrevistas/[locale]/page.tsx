import Link from "next/link";
import { marked } from "marked";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/app/components/SiteHeader";
import {
  FIELD_INTERVIEW_LOCALES,
  parseFieldInterviewLocale,
  readFieldInterviewMarkdown,
} from "@/lib/connect-ia/field-interview";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return [{ locale: "pt" }, { locale: "es" }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = parseFieldInterviewLocale(raw);
  if (!locale) return { title: "Entrevista" };
  return {
    title: `${FIELD_INTERVIEW_LOCALES[locale].title} — Captei`,
    description: "Roteiro de entrevista com corretores — Connect IA.",
  };
}

export default async function FieldInterviewPage({ params }: PageProps) {
  const { locale: raw } = await params;
  const locale = parseFieldInterviewLocale(raw);
  if (!locale) notFound();

  const meta = FIELD_INTERVIEW_LOCALES[locale];
  const html = marked.parse(readFieldInterviewMarkdown(locale), {
    async: false,
  });

  return (
    <div className="flex min-h-screen flex-col" lang={meta.lang}>
      <SiteHeader current="connect-ia" />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 pb-24 sm:px-5">
        <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-line/80 bg-paper/95 px-4 py-3 backdrop-blur-md sm:-mx-5 sm:px-5">
          <div className="flex items-center justify-between gap-2 text-sm">
            <Link
              href="/connect-ia/entrevistas"
              className="font-semibold text-tide hover:text-ink"
            >
              ← Idiomas
            </Link>
            {locale === "pt" ? (
              <Link
                href="/connect-ia/entrevistas/es"
                className="text-ink-muted hover:text-ink"
              >
                ES
              </Link>
            ) : (
              <Link
                href="/connect-ia/entrevistas/pt"
                className="text-ink-muted hover:text-ink"
              >
                PT
              </Link>
            )}
          </div>
        </div>

        <article
          className="field-doc"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
    </div>
  );
}
