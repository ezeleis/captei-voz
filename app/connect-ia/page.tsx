import Link from "next/link";
import type { Metadata } from "next";

import { SiteHeader } from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: "Connect IA — Captei",
  description:
    "Captei — copiloto de IA para captação e qualificação de proprietários. Pré-incubação Connect IA, InPETU UFSC.",
};

export default function ConnectIaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader current="connect-ia" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-14 sm:py-20">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-tide">
          InPETU · Edital 02/2026
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-ink">
          Captei no Connect IA
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          <strong className="font-semibold text-ink">Captei</strong> — copiloto
          de IA para captação e qualificação de proprietários, com outreach
          omnichannel (WhatsApp, e-mail, voz) e compliance integrado.
        </p>
        <p className="mt-4 leading-relaxed text-ink-muted">
          Começamos pela captação — o gargalo mais caro das imobiliárias de 3–10
          corretores. No dia a dia, outbound ruim perde mandato; quem já optou
          (“Quanto vale meu imóvel?”) precisa de resposta instantânea em
          PT/ES/EN; automação errada bane o número WhatsApp Business. A mesa
          serve qualquer outbound qualificado, com aprovação humana e{" "}
          <strong className="font-semibold text-ink">sem disparo frio</strong>.
        </p>

        <p className="mt-6 rounded-2xl border border-line bg-foam px-4 py-3 text-sm text-ink">
          Estágio: pré-incubação com demo. Stack multi-provedor; AssemblyAI na
          demo atual.
        </p>

        <ul className="mt-10 space-y-3 text-ink-muted">
          <li>
            <Link
              href="/connect-ia-architecture.svg"
              className="font-semibold text-tide hover:text-ink"
            >
              Diagrama de arquitetura →
            </Link>
          </li>
          <li>
            <a
              href="https://forms.gle/LSNnsPoCuKFNpdJY7"
              className="font-semibold text-tide hover:text-ink"
              rel="noreferrer"
              target="_blank"
            >
              Formulário de inscrição Connect IA →
            </a>
          </li>
          <li>
            <Link
              href="/compose/demo"
              className="font-semibold text-tide hover:text-ink"
            >
              Abrir mesa multicanal →
            </Link>
          </li>
          <li>
            <Link
              href="/qualify/demo"
              className="font-semibold text-tide hover:text-ink"
            >
              Qualificação ao vivo →
            </Link>
          </li>
          <li>
            <Link
              href="/connect-ia/entrevistas"
              className="font-semibold text-tide hover:text-ink"
            >
              Roteiros de entrevista (PT / ES) →
            </Link>
          </li>
        </ul>
      </main>
      <footer className="border-t border-line/80 px-6 py-5 text-center text-sm text-ink-muted">
        Pré-incubação Connect IA · InPETU UFSC · Florianópolis
      </footer>
    </div>
  );
}
