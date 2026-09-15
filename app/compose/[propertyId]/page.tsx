import { SiteHeader } from "@/app/components/SiteHeader";
import { ComposeDesk } from "./ComposeDesk";
import { DEMO_CONTACT_ID, DEMO_PROPERTY, DEMO_PROPERTY_ID } from "@/lib/consent/demo";
import { resolveReachableContact } from "@/lib/consent/gate";

/**
 * Screen 1 — compose desk. Rewrite on the server, verbatim TTS in the browser.
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
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="compose" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 sm:py-14">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-tide">
          Desk · 02
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-ink">
          Mesa de composição
        </h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Fale o rascunho. O recado sai no idioma do proprietário, na voz de
          estoque desse idioma — você aprova o texto e o áudio antes de
          entregar.
        </p>

        {seeded ? (
          <p className="mt-6 rounded-2xl border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn">
            Destino <strong>semeado</strong>. O áudio só poderia ser entregue
            dentro de uma janela aberta pelo proprietário. Nesta tela a entrega
            é baixar o WAV e abrir o WhatsApp — sem envio automático.
          </p>
        ) : null}

        {!gated.ok ? (
          <p className="mt-6 rounded-2xl border border-danger/25 bg-danger-bg px-4 py-3 text-sm text-danger">
            Recusa do gate: {gated.reason}
          </p>
        ) : (
          <ComposeDesk
            propertyLabel={
              seeded ? DEMO_PROPERTY.label : `Imóvel ${propertyId}`
            }
            contactName={gated.contact.fullName}
            contactPhoneE164={gated.contact.phoneE164}
            seeded={seeded}
          />
        )}
      </main>
    </div>
  );
}
