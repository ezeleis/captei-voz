import { SiteHeader } from "@/app/components/SiteHeader";
import { ComposeDesk } from "./ComposeDesk";
import { DEMO_CONTACT_ID, DEMO_PROPERTY, DEMO_PROPERTY_ID } from "@/lib/consent/demo";
import { resolveReachableContact } from "@/lib/consent/gate";

export default async function ComposePage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;
  const gated = await resolveReachableContact(DEMO_CONTACT_ID);
  const demo = propertyId === DEMO_PROPERTY_ID;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="compose" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Mesa de composição
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Fale o rascunho. O recado sai no idioma do proprietário — você
          aprova o texto e o áudio antes de entregar.
        </p>

        <p className="mt-6 rounded-2xl border border-line bg-foam px-4 py-3 text-sm text-ink-muted">
          A entrega é o arquivo de áudio e o texto, numa conversa que o
          proprietário já abriu. Nada é enviado automaticamente.
        </p>

        {!gated.ok ? (
          <p className="mt-6 rounded-2xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
            {gated.reason}
          </p>
        ) : (
          <ComposeDesk
            propertyLabel={demo ? DEMO_PROPERTY.label : `Imóvel ${propertyId}`}
            contactName={gated.contact.fullName}
            contactPhoneE164={gated.contact.phoneE164}
          />
        )}
      </main>
    </div>
  );
}
