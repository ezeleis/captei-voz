import "server-only";

import type { NoteLang } from "@/lib/note-lang";

import { complete } from "@/lib/assemblyai/rewrite-shared";

/**
 * AssemblyAI LLM Gateway adapter (single-channel). Captei’s rewrite contract
 * is `LlmRewriter` in `lib/providers/types.ts`; this module and
 * `rewrite-omnichannel.ts` are the current default implementation. Multi-
 * provider routing (`CAPTEI_LLM_PROVIDER`) is documented, not wired — see
 * `docs/architecture/providers.md`.
 *
 * Register transfer: rough spoken PT/ES/EN → professional written note in
 * the owner's language. Facts stay; tone, register and language change.
 * The CRECI block is assembled later so the model cannot invent a number.
 */

function systemPrompt(outputLang: NoteLang): string {
  switch (outputLang) {
    case "es":
      return `Reescribís el borrador hablado de un corretor inmobiliario brasileño como un mensaje profesional de WhatsApp.

IDIOMA OBLIGATORIO: español rioplatense (Argentina / Uruguay). Cada frase en ese registro. Tratamiento de vos y voseo (podés, tenés, pasá, escribime). Si el borrador está en portugués o inglés, traducí los hechos. Está prohibido dejar oraciones en portugués.

Léxico: tasación, departamento, alquiler, metros cuadrados, propietario. Prohibido: tú, vosotros, usted (salvo cita), renta (por alquiler), po, cachái, órale, depa, "suena como vos".

Reglas:
- Conservá los hechos: dirección, precio, tipo, plazo, nombres. No inventes lo que no se dijo.
- Cordial y directo, profesional. Una idea por párrafo corto. Sin lunfardo pesado.
- Sin emojis.
- No agregues CRECI, nombre del corretor ni aviso de voz digital — eso se inserta después.
- Respondé solo con el texto del mensaje, sin comillas y sin prefacio.`;
    case "en":
      return `You rewrite a Brazilian real-estate broker's rough spoken draft into a professional WhatsApp message.

MANDATORY LANGUAGE: English. Every sentence must be in English. If the draft is in Portuguese or Spanish, translate the facts. Do not leave any sentence in Portuguese.

Rules:
- Keep the facts: address, price, type, timeline, names. Do not invent what was not said.
- Cordial, direct. One idea per short paragraph.
- No slang, no emojis, no "sounds like you".
- Do not add CRECI, the broker's name, or a digital-voice disclaimer — those are inserted later.
- Reply with only the message text, no quotes and no preface.`;
    default:
      return `Você reescreve um rascunho falado de um corretor de imóveis brasileiro para uma mensagem de WhatsApp profissional.

IDIOMA OBRIGATÓRIO: português brasileiro. Cada frase deve estar em português do Brasil. Se o rascunho estiver em espanhol ou inglês, traduza os fatos. Não deixe frases no idioma de origem.

Regras:
- Mantenha os fatos: endereço, preço, tipo, prazo, nomes. Não invente o que não foi dito.
- Cordial, direto. Uma ideia por parágrafo curto.
- Sem gíria excessiva, sem emojis, sem "soa como você".
- Não acrescente CRECI, nome do corretor nem aviso de voz digital — isso é inserido depois.
- Responda só com o texto da mensagem, sem aspas e sem prefácio.`;
  }
}

function userPrompt(transcript: string, outputLang: NoteLang): string {
  switch (outputLang) {
    case "es":
      return `Reescribí este borrador en español rioplatense (traducí si hace falta):\n\n${transcript.trim()}`;
    case "en":
      return `Rewrite this draft in English (translate if needed):\n\n${transcript.trim()}`;
    default:
      return `Reescreva este rascunho em português do Brasil (traduza se precisar):\n\n${transcript.trim()}`;
  }
}

export async function rewriteDraft(
  transcript: string,
  outputLang: NoteLang,
): Promise<string> {
  return complete(systemPrompt(outputLang), userPrompt(transcript, outputLang));
}
