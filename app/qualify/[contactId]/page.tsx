import Link from "next/link";

/**
 * Screen 2 — consented live qualify. Skeleton.
 *
 * Built FIRST (build step 3). This is the screen with a real conversational
 * loop — turn detection, barge-in, tool calling — and it is what makes this a
 * voice-agent submission rather than a voice-powered tool.
 * See docs/bmad/stress-test.md, claim 4.
 */
export default async function QualifyPage({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Início
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Qualificação ao vivo
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Contato <code>{contactId}</code>
      </p>

      <p className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
        Sessão de voz com um proprietário que já enviou “Quanto vale o meu
        imóvel?” e registrou consentimento. O agente confirma o imóvel, a
        finalidade, o prazo e a expectativa de preço, e grava o resultado.
      </p>

      <p className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        Esqueleto. Requer <code>ASSEMBLYAI_API_KEY</code> no servidor e um
        agente publicado (<code>QUALIFY_AGENT_ID</code>). Use Chrome ou Edge.
      </p>
    </main>
  );
}
