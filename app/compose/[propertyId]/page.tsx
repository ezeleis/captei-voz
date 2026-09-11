import Link from "next/link";

import { ComposeDesk } from "./ComposeDesk";
import { DEMO_CONTACT_ID, DEMO_PROPERTY, DEMO_PROPERTY_ID } from "@/lib/consent/demo";
import { resolveReachableContact } from "@/lib/consent/gate";

/**
 * Screen 1 — compose desk. Text first (build step 4).
 * Audio render waits on the greeting-length test.
 */
export default async function ComposePage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const gated = await resolveReachableContact(DEMO_CONTACT_ID);
  const seeded = propertyId === DEMO_PROPERTY_ID;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Início
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Mesa de composição
      </h1>

      {seeded ? (
        <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          Destino <strong>semeado</strong>. O áudio só poderia ser entregue
          dentro de uma janela aberta pelo proprietário — nesta tela o envio
          continua manual. Gere o recado, ouça e aprove.
        </p>
      ) : null}

      {!gated.ok ? (
        <p className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          Recusa do gate: {gated.reason}
        </p>
      ) : (
        <ComposeDesk
          propertyLabel={
            seeded ? DEMO_PROPERTY.label : `Imóvel ${propertyId}`
          }
          contactName={gated.contact.fullName}
        />
      )}
    </main>
  );
}
