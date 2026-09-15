import { SiteHeader } from "@/app/components/SiteHeader";
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="qualify" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-clay">
          Agente · 01
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink">
          Qualificação ao vivo
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          O proprietário já pediu avaliação. O agente confirma o imóvel —
          sem inventar preço.
        </p>

        {seeded ? (
          <p className="mt-6 rounded-2xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn">
            Contato <strong>semeado para o hackathon</strong>. O CRM de captação
            ainda não existe, então este opt-in não é de um formulário real.
            Está visível de propósito: a tese do produto é consentimento, e o
            demo não esconde o atalho.
          </p>
        ) : null}

        {!gated.ok ? (
          <p className="mt-6 rounded-2xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
            Recusa do gate: {gated.reason}
          </p>
        ) : (
          <QualifySession
            contactId={gated.contact.id}
            contactName={gated.contact.fullName}
          />
        )}
      </main>
    </div>
  );
}
