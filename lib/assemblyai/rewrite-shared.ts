import "server-only";

import { env } from "@/lib/env";

export async function complete(
  system: string,
  user: string,
  maxTokens = 600,
): Promise<string> {
  const response = await fetch(
    "https://llm-gateway.assemblyai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: env.assemblyAiApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3.5-4b-32k-fast",
        max_tokens: maxTokens,
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
