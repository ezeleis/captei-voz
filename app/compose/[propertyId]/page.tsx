import Link from "next/link";

/**
 * Screen 1 — compose desk. Skeleton.
 *
 * Build order puts this after the live agent (build step 4–5), because the
 * live agent is what makes the submission legible as a voice-agent project.
 * See docs/bmad/recommended-mvp.md §9.
 */
export default async function ComposePage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Início
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Mesa de composição
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Imóvel <code>{propertyId}</code>
      </p>

      <ol className="mt-8 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
        <li>1. Segure o microfone e fale — PT, ES ou EN.</li>
        <li>2. Transcrição ao vivo (streaming STT).</li>
        <li>3. Reescrita para português profissional.</li>
        <li>4. Revisão lado a lado com o original.</li>
        <li>5. Renderização do áudio, palavra por palavra.</li>
        <li>6. Aprovação — e só então a entrega manual.</li>
      </ol>

      <p className="mt-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
        Esqueleto. Nenhum envio automático é construído: o áudio só pode ser
        entregue dentro de uma janela de 24h aberta pelo proprietário.
      </p>
    </main>
  );
}
