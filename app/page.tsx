import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="home" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14 sm:py-20">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-tide">
          Captação e qualificação
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Copiloto de IA para captação e qualificação — WhatsApp, e-mail e
          voz.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Compliance-first: o corretor{" "}
          <strong className="font-semibold text-ink">aprova</strong> cada
          recado. Consentimento LGPD/Meta. Sem disparo frio.
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
          Começamos pelo mandato; a mesa serve todo outbound qualificado.
        </p>

        <nav className="mt-12 grid gap-4 md:grid-cols-3">
          <Link
            href="/qualify/demo"
            className="group rounded-2xl border border-line bg-foam p-6 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
          >
            <span className="mt-0 block font-display text-2xl font-semibold text-ink">
              Qualificação ao vivo
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Agente de voz com o proprietário que já pediu avaliação.
              Português, espanhol ou inglês.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Iniciar sessão →
            </span>
          </Link>
          <Link
            href="/compose/demo"
            className="group rounded-2xl border border-line bg-foam p-6 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
          >
            <span className="mt-0 block font-display text-2xl font-semibold text-ink">
              Mesa multicanal
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Fale o rascunho. Saem WhatsApp, e-mail e áudio no idioma do
              cliente. Revise, aprove, entregue.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Abrir mesa →
            </span>
          </Link>
          <Link
            href="/connect-ia"
            className="group rounded-2xl border border-line bg-foam p-6 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
          >
            <span className="mt-0 block font-display text-2xl font-semibold text-ink">
              Connect IA
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Pré-incubação InPETU UFSC. Pitch, diagrama e formulário de
              inscrição.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Ver proposta →
            </span>
          </Link>
        </nav>
      </main>
      <footer className="border-t border-line/80 px-6 py-5 text-center text-sm text-ink-muted">
        Pré-incubação Connect IA · InPETU UFSC · Florianópolis
      </footer>
    </div>
  );
}
