import Link from "next/link";

import { isConfigured } from "@/lib/env";

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
  ];

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Captei Voz</h1>
      <p className="mt-3 text-neutral-600 dark:text-neutral-400">
        O corretor fala rápido. Captei Voz devolve um áudio profissional em
        português — que ele <strong>aprova</strong> antes de qualquer envio.
      </p>

      <nav className="mt-10 grid gap-3">
        <Link
          href="/qualify/demo"
          className="rounded-lg border border-neutral-300 p-4 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          <span className="font-medium">Qualificação ao vivo</span>
          <span className="mt-1 block text-sm text-neutral-600 dark:text-neutral-400">
            Sessão de voz com proprietário que já pediu avaliação. Construído
            primeiro — é o agente de voz de verdade.
          </span>
        </Link>
        <Link
          href="/compose/demo"
          className="rounded-lg border border-neutral-300 p-4 hover:bg-white dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          <span className="font-medium">Mesa de composição</span>
          <span className="mt-1 block text-sm text-neutral-600 dark:text-neutral-400">
            Fale em PT, ES ou EN. Revise o texto e o áudio. Aprove.
          </span>
        </Link>
      </nav>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
          Configuração
        </h2>
        <ul className="mt-3 space-y-1 text-sm">
          {checks.map((check) => (
            <li key={check.name} className="flex items-center gap-2">
              <span aria-hidden>{check.ok ? "✅" : "⚪"}</span>
              <code className="text-neutral-700 dark:text-neutral-300">
                {check.name}
              </code>
              <span className="text-neutral-500">
                {check.ok
                  ? "configurado"
                  : "optional" in check && check.optional
                    ? "opcional — não configurado"
                    : "não configurado"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-neutral-500">
          Valores nunca são exibidos. A chave da API não sai do servidor.
        </p>
      </section>
    </main>
  );
}
