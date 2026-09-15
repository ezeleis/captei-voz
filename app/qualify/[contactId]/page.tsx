import { SiteHeader } from "@/app/components/SiteHeader";
import { QualifySession } from "./QualifySession";
import { resolveReachableContact } from "@/lib/consent/gate";

export default async function QualifyPage({
  params,
}: {
  params: Promise<{ contactId: string }>;
}) {
  const { contactId } = await params;
  const gated = await resolveReachableContact(contactId);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="qualify" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Qualificação ao vivo
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          O proprietário já pediu avaliação. O agente confirma o imóvel no
          idioma dele — sem inventar preço.
        </p>

        {!gated.ok ? (
          <p className="mt-6 rounded-2xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
            {gated.reason}
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
