import Link from "next/link";
import type { Metadata } from "next";

import { SiteHeader } from "@/app/components/SiteHeader";
import { FIELD_INTERVIEW_LOCALES } from "@/lib/connect-ia/field-interview";

export const metadata: Metadata = {
  title: "Entrevistas — Connect IA",
  description: "Roteiros de entrevista com corretores (campo) — Captei Connect IA.",
};

export default function EntrevistasIndexPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="connect-ia" />
      <main className="mx-auto w-full max-w-lg flex-1 px-5 py-10 sm:px-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-tide">
          Validação de mercado
        </p>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink">
          Entrevistas com corretores
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          Roteiro para usar no celular em visitas às imobiliárias. 15–20 min ·
          gravar com consentimento.
        </p>

        <ul className="mt-8 space-y-3">
          {(Object.keys(FIELD_INTERVIEW_LOCALES) as Array<
            keyof typeof FIELD_INTERVIEW_LOCALES
          >).map((locale) => {
            const meta = FIELD_INTERVIEW_LOCALES[locale];
            return (
              <li key={locale}>
                <Link
                  href={`/connect-ia/entrevistas/${locale}`}
                  className="block rounded-2xl border border-line bg-foam px-5 py-4 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:border-tide/40"
                >
                  <span className="font-display text-xl font-semibold text-ink">
                    {meta.title}
                  </span>
                  <span className="mt-1 block text-sm text-ink-muted">
                    Abrir roteiro →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-sm text-ink-muted">
          <Link href="/connect-ia" className="font-semibold text-tide hover:text-ink">
            ← Connect IA
          </Link>
        </p>
      </main>
    </div>
  );
}
