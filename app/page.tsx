import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="home" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14 sm:py-20">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-tide">
          Mesa do corretor
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          O corretor fala rápido. O proprietário ouve no idioma dele.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Captei Voz devolve um áudio profissional — com identificação CRECI e
          aviso de voz digital — que o corretor{" "}
          <strong className="font-semibold text-ink">aprova</strong> antes de
          qualquer entrega. Nada é enviado por um bot.
        </p>

        <nav className="mt-12 grid gap-4 md:grid-cols-2">
          <Link
            href="/qualify/demo"
            className="group rounded-2xl border border-line bg-foam p-6 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
          >
            <span className="mt-0 block font-display text-2xl font-semibold text-ink">
              Qualificação ao vivo
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Agente de voz com o proprietário que já pediu avaliação. Português,
              espanhol ou inglês.
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
              Mesa de composição
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Fale em PT, ES ou EN. O recado sai no idioma do cliente. Revise,
              ouça, aprove.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Abrir mesa →
            </span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
