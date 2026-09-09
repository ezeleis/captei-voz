import Link from "next/link";

import { QualifySession } from "./QualifySession";
import { DEMO_CONTACT_ID } from "@/lib/consent/demo";
import { resolveReachableContact } from "@/lib/consent/gate";

/**
 * Screen 2 — consented live qualify.
 *
 * Built FIRST. This is the conversational loop (turn detection, barge-in,
 * tool calling) that makes the submission a voice-agent project.
 * See docs/bmad/stress-test.md, claim 4.
 */
export default async function QualifyPage({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  const gated = await resolveReachableContact(contactId);
  const seeded = contactId === DEMO_CONTACT_ID;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Início
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Qualificação ao vivo
      </h1>

      {seeded ? (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Contato <strong>semeado para o hackathon</strong>. O CRM de captação
          ainda não existe, então este opt-in não é de um formulário real.
          Está visível de propósito: a tese do produto é consentimento, e o
          demo não esconde o atalho.
        </p>
      ) : null}

      {!gated.ok ? (
        <p className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          Recusa do gate: {gated.reason}
        </p>
      ) : (
        <QualifySession
          contactId={gated.contact.id}
          contactName={gated.contact.fullName}
        />
      )}
    </main>
  );
}
