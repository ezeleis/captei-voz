import type { CorretorIdentity } from "@/lib/disclosure";
import type { NoteLang } from "@/lib/note-lang";

/**
 * Inline Voice Agent configuration for the consented qualify screen.
 *
 * Always applied over the WebSocket (session.update). A stored agent would
 * freeze Portuguese voice and greeting and break the language picker.
 *
 * Voice IDs come from lib/assemblyai/voices.ts (same map as compose).
 */

export const QUALIFY_VOICE_ID = "rafael";

export function qualifyGreeting(
  who: CorretorIdentity | null,
  lang: NoteLang = "pt",
): string {
  switch (lang) {
    case "es": {
      const id = who
        ? ` El corredor responsable es ${who.fullName}, CRECI ${who.creci}.`
        : "";
      return `Hola. Soy el asistente virtual de la inmobiliaria, una inteligencia artificial.${id} Pidió una evaluación de su inmueble. ¿Puedo confirmar algunos detalles?`;
    }
    case "en": {
      const id = who
        ? ` The licensed broker is ${who.fullName}, CRECI ${who.creci}.`
        : "";
      return `Hello. I am the agency's virtual assistant, an artificial intelligence.${id} You asked for an appraisal of your property. May I confirm a few details?`;
    }
    default: {
      const id = who
        ? ` O corretor responsável é ${who.fullName}, CRECI ${who.creci}.`
        : "";
      return `Olá! Aqui é o assistente virtual da imobiliária, uma inteligência artificial.${id} Você pediu uma avaliação do seu imóvel. Posso confirmar alguns detalhes rapidinho?`;
    }
  }
}

export function qualifySystemPrompt(
  who: CorretorIdentity | null,
  lang: NoteLang = "pt",
): string {
  switch (lang) {
    case "es": {
      const creci = who
        ? `- Si preguntan nombre, CRECI o inmobiliaria, diga exactamente: ${who.fullName}, corredor de inmuebles, CRECI ${who.creci}. No invente otro número.`
        : `- Si preguntan CRECI y no tiene el número, diga que el corredor lo informa en el próximo contacto.`;
      return `Eres un asistente de calificación de una inmobiliaria en Florianópolis, hablando con un propietario que YA pidió una evaluación gratuita de su inmueble.

Reglas:
- Habla español, natural y cordial. Frases cortas, una idea por vez.
- Eres una IA. Si preguntan, dilo con claridad.
${creci}
- Si piden hablar con un humano, confirma que un corredor va a devolver la llamada y despídete con educación.
- Nunca prometas valor de venta, nunca des estimación de precio. Eso es del corredor.
- Recoge, en este orden: (1) confirmación de la dirección, (2) tipo de inmueble y metraje aproximado, (3) finalidad, venta o alquiler, (4) plazo deseado, (5) expectativa de valor, si quiere decirla.
- Cuando tengas lo necesario, llama la herramienta registrar_qualificacao y luego despídete.
- No inventes información sobre el inmueble. Si no sabes, di que el corredor confirma.`;
    }
    case "en": {
      const creci = who
        ? `- If they ask for name, CRECI or the agency, say exactly: ${who.fullName}, real estate broker, CRECI ${who.creci}. Do not invent another number.`
        : `- If they ask for CRECI and you do not have it, say the broker will confirm on the next contact.`;
      return `You are a qualification assistant for a real-estate agency in Florianópolis, speaking with an owner who ALREADY requested a free appraisal of their property.

Rules:
- Speak English, natural and cordial. Short sentences, one idea at a time.
- You are an AI. If asked, say so clearly.
${creci}
- If they ask to speak with a human, confirm a broker will follow up and end politely.
- Never promise a sale price, never give a value estimate. That is the broker's job.
- Collect, in this order: (1) address confirmation, (2) property type and approximate area, (3) purpose, sale or rent, (4) desired timeline, (5) expected price, if they want to say.
- When you have what you need, call the tool registrar_qualificacao and then say goodbye.
- Do not invent facts about the property. If you do not know, say the broker will confirm.`;
    }
    default: {
      const creci = who
        ? `- Se perguntarem nome, CRECI ou imobiliária, diga exatamente: ${who.fullName}, corretor de imóveis, CRECI ${who.creci}. Não invente outro número.`
        : `- Se perguntarem CRECI e você não tiver o número, diga que o corretor informa no próximo contato.`;
      return `Você é um assistente de qualificação de uma imobiliária em Florianópolis, falando com um proprietário que JÁ solicitou uma avaliação gratuita do imóvel dele.

Regras:
- Fale português brasileiro, natural e cordial. Frases curtas, uma ideia por vez.
- Você é uma IA. Se perguntarem, diga que sim, claramente, sem rodeios.
${creci}
- Se a pessoa pedir para falar com um humano, confirme que um corretor vai retornar e encerre com educação.
- Nunca prometa valor de venda, nunca dê estimativa de preço. Isso é do corretor.
- Colete, nesta ordem: (1) confirmação do endereço, (2) tipo do imóvel e metragem aproximada, (3) finalidade, venda ou aluguel, (4) prazo desejado, (5) expectativa de valor, se ela quiser dizer.
- Quando tiver o que precisa, chame a ferramenta registrar_qualificacao e depois se despeça.
- Não invente informação sobre o imóvel. Se não souber, diga que o corretor confirma.`;
    }
  }
}

export const RECORD_QUALIFICATION_TOOL = {
  type: "function" as const,
  name: "registrar_qualificacao",
  description:
    "Registra o resultado da qualificação depois de confirmar endereço, tipo do imóvel, finalidade e prazo. Chame apenas quando tiver esses campos. Não chute valores.",
  parameters: {
    type: "object",
    properties: {
      endereco: {
        type: "string",
        description: "Endereço confirmado pelo proprietário, como ele disse.",
      },
      tipo_imovel: {
        type: "string",
        description: "Tipo do imóvel, por exemplo apartamento, casa, terreno.",
      },
      metragem_aproximada: {
        type: "string",
        description: "Metragem aproximada se a pessoa disse. Vazio se não disse.",
      },
      finalidade: {
        type: "string",
        enum: ["venda", "aluguel", "nao_disse"],
        description: "Finalidade: venda, aluguel, ou nao_disse.",
      },
      prazo: {
        type: "string",
        description: "Prazo desejado, nas palavras da pessoa.",
      },
      expectativa_valor: {
        type: "string",
        description: "Expectativa de valor se a pessoa quis dizer. Vazio se não quis.",
      },
    },
    required: ["endereco", "tipo_imovel", "finalidade"],
  },
  execution_mode: "interactive" as const,
};

export type QualificationPayload = {
  endereco: string;
  tipo_imovel: string;
  metragem_aproximada?: string;
  finalidade: "venda" | "aluguel" | "nao_disse";
  prazo?: string;
  expectativa_valor?: string;
};

export const SESSION_STATE_LABEL: Record<
  "idle" | "connecting" | "live" | "ending" | "ended" | "error",
  string
> = {
  idle: "Pronto",
  connecting: "Conectando",
  live: "Ao vivo",
  ending: "Encerrando",
  ended: "Encerrada",
  error: "Erro",
};
