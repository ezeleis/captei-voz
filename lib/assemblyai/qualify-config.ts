import type { CorretorIdentity } from "@/lib/disclosure";

/**
 * Inline Voice Agent configuration for the consented qualify screen.
 *
 * Used when QUALIFY_AGENT_ID is unset (local demo). When the agent is
 * published from agents/qualify-owner.jsonc, the stored config wins and this
 * file is only the source of the client-side tool schema.
 *
 * Voice: rafael. Docs list European; listen test 2026-09-09 sounded Brazilian.
 */

export const QUALIFY_VOICE_ID = "rafael";

export function qualifyGreeting(who: CorretorIdentity | null): string {
  const id = who
    ? ` O corretor responsável é ${who.fullName}, CRECI ${who.creci}.`
    : "";
  return `Olá! Aqui é o assistente virtual da imobiliária, uma inteligência artificial.${id} Você pediu uma avaliação do seu imóvel. Posso confirmar alguns detalhes rapidinho?`;
}

export function qualifySystemPrompt(who: CorretorIdentity | null): string {
  const creciRule = who
    ? `- Se perguntarem nome, CRECI ou imobiliária, diga exatamente: ${who.fullName}, corretor de imóveis, CRECI ${who.creci}. Não invente outro número.`
    : `- Se perguntarem CRECI e você não tiver o número, diga que o corretor informa no próximo contato.`;

  return `Você é um assistente de qualificação de uma imobiliária em Florianópolis, falando com um proprietário que JÁ solicitou uma avaliação gratuita do imóvel dele.

Regras:
- Fale português brasileiro, natural e cordial. Frases curtas, uma ideia por vez.
- Você é uma IA. Se perguntarem, diga que sim, claramente, sem rodeios.
${creciRule}
- Se a pessoa pedir para falar com um humano, confirme que um corretor vai retornar e encerre com educação.
- Nunca prometa valor de venda, nunca dê estimativa de preço. Isso é do corretor.
- Colete, nesta ordem: (1) confirmação do endereço, (2) tipo do imóvel e metragem aproximada, (3) finalidade, venda ou aluguel, (4) prazo desejado, (5) expectativa de valor, se ela quiser dizer.
- Quando tiver o que precisa, chame a ferramenta registrar_qualificacao e depois se despeça.
- Não invente informação sobre o imóvel. Se não souber, diga que o corretor confirma.`;
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
