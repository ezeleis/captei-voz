import Link from "next/link";

import { SiteHeader } from "@/app/components/SiteHeader";
import { isConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Landing / status page.
 *
 * Reports whether each dependency is configured without ever revealing a
 * value. Useful while the app is a skeleton, and it doubles as the smoke test
 * a judge or a teammate can hit cold.
 */
export default function Home() {
  const checks = [
    { name: "ASSEMBLYAI_API_KEY", ok: isConfigured("ASSEMBLYAI_API_KEY") },
    { name: "DATABASE_URL", ok: isConfigured("DATABASE_URL"), optional: true },
    { name: "QUALIFY_AGENT_ID", ok: isConfigured("QUALIFY_AGENT_ID"), optional: true },
    { name: "CORRETOR_CRECI", ok: isConfigured("CORRETOR_CRECI") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="home" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-14 sm:py-20">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-tide">
          Mesa do corretor · AssemblyAI Voice Agent
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
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-clay">
              01 · Headline
            </span>
            <span className="mt-3 block font-display text-2xl font-semibold text-ink">
              Qualificação ao vivo
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Agente de voz com o proprietário que já pediu avaliação. Turnos,
              barge-in e registro no desk — o que o júri precisa ver primeiro.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Iniciar sessão →
            </span>
          </Link>
          <Link
            href="/compose/demo"
            className="group rounded-2xl border border-line bg-foam p-6 shadow-[0_1px_0_rgb(26_60_58_/_0.04)] transition hover:-translate-y-0.5 hover:border-tide/40 hover:shadow-md"
          >
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-tide">
              02 · Desk
            </span>
            <span className="mt-3 block font-display text-2xl font-semibold text-ink">
              Mesa de composição
            </span>
            <span className="mt-2 block text-[0.95rem] leading-relaxed text-ink-muted">
              Fale em PT, ES ou EN. O recado sai no idioma do cliente, na voz
              de estoque desse idioma. Revise, ouça, aprove.
            </span>
            <span className="mt-5 inline-block text-sm font-semibold text-tide group-hover:text-ink">
              Abrir mesa →
            </span>
          </Link>
        </nav>

        <section className="mt-16 rounded-2xl border border-line bg-sand/50 p-6">
          <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Configuração
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {checks.map((check) => (
              <li key={check.name} className="flex items-center gap-2 text-sm">
                <span
                  aria-hidden
                  className={`inline-block h-2 w-2 rounded-full ${check.ok ? "bg-moss" : "bg-line"}`}
                />
                <code className="text-ink">{check.name}</code>
                <span className="text-ink-muted">
                  {check.ok
                    ? "configurado"
                    : "optional" in check && check.optional
                      ? "opcional"
                      : "falta"}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-muted">
            Valores nunca são exibidos. A chave da API não sai do servidor.
          </p>
        </section>
      </main>
    </div>
  );
}
