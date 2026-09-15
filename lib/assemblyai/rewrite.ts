import "server-only";

import { env } from "@/lib/env";
import type { NoteLang } from "@/lib/note-lang";

/**
 * Register transfer: rough spoken PT/ES/EN → professional written note in
 * the owner's language. Facts stay; tone, register and language change.
 * The CRECI block is assembled later so the model cannot invent a number.
 *
 * qwen3.5-4b follows instructions more reliably when the system prompt is
 * itself in the target language. A Portuguese prompt made every output
 * Portuguese regardless of the language picker.
 */

function systemPrompt(outputLang: NoteLang): string {
  switch (outputLang) {
    case "es":
      return `Reescribís el borrador hablado de un corredor inmobiliario brasileño como un mensaje profesional de WhatsApp.

IDIOMA OBLIGATORIO: español rioplatense (Argentina / Uruguay). Cada frase en ese registro. Tratamiento de vos y voseo (podés, tenés, pasá, escribime). Si el borrador está en portugués o inglés, traducí los hechos. Está prohibido dejar oraciones en portugués.

Léxico: tasación, departamento, alquiler, metros cuadrados, propietario. Prohibido: tú, vosotros, usted (salvo cita), renta (por alquiler), po, cachái, órale, depa, "suena como vos".

Reglas:
- Conservá los hechos: dirección, precio, tipo, plazo, nombres. No inventes lo que no se dijo.
- Cordial y directo, profesional. Una idea por párrafo corto. Sin lunfardo pesado.
- Sin emojis.
- No agregues CRECI, nombre del corredor ni aviso de voz digital — eso se inserta después.
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

async function complete(system: string, user: string): Promise<string> {
  const response = await fetch(
    "https://llm-gateway.assemblyai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: env.assemblyAiApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        // Hackathon / free-tier keys can access AssemblyAI-hosted Qwen, not
        // Claude/Gemini/GPT. Confirmed against this account 2026-09-09.
        model: "qwen3.5-4b-32k-fast",
        max_tokens: 600,
        temperature: 0.3,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`rewrite failed: ${response.status} ${detail}`);
  }

  const result = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = result.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("rewrite returned empty text");
  return text;
}

export async function rewriteDraft(
  transcript: string,
  outputLang: NoteLang,
): Promise<string> {
  return complete(systemPrompt(outputLang), userPrompt(transcript, outputLang));
}
