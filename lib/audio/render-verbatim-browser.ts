/**
 * Verbatim TTS in the browser. The server only mints a token; the greeting
 * goes straight to AssemblyAI TTS. This avoids holding a WebSocket on a
 * serverless function for the length of the note (Vercel hobby caps that).
 *
 * Same contract as lib/assemblyai/render.ts: greeting bypasses the LLM.
 * Always session.end.
 *
 * https://www.assemblyai.com/docs/voice-agents/voice-agent-api/greeting
 */

import { VOICE_AGENT_SAMPLE_RATE } from "@/lib/audio/play-pcm";

export type BrowserRenderResult = {
  audio: string;
  durationMs: number;
};

function concatBase64Pcm(chunks: string[]): { audio: string; bytes: number } {
  let total = 0;
  const parts = chunks.map((chunk) => {
    const raw = atob(chunk);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    total += bytes.length;
    return bytes;
  });
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    merged.set(part, offset);
    offset += part.length;
  }
  let binary = "";
  for (let i = 0; i < merged.length; i++) {
    binary += String.fromCharCode(merged[i]!);
  }
  return { audio: btoa(binary), bytes: merged.length };
}

export async function renderVerbatimInBrowser(
  text: string,
  voiceId: string,
): Promise<BrowserRenderResult> {
  const tokenRes = await fetch("/api/voice-token", { cache: "no-store" });
  const tokenBody = (await tokenRes.json()) as {
    token?: string;
    error?: string;
  };
  if (!tokenRes.ok || !tokenBody.token) {
    throw new Error(tokenBody.error ?? "não foi possível obter o token");
  }

  const wsUrl = new URL("wss://agents.assemblyai.com/v1/ws");
  wsUrl.searchParams.set("token", tokenBody.token);
  const ws = new WebSocket(wsUrl);
  const chunks: string[] = [];

  try {
    return await new Promise<BrowserRenderResult>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("render timed out")),
        180_000,
      );

      const finishOk = () => {
        clearTimeout(timeout);
        const { audio, bytes } = concatBase64Pcm(chunks);
        const durationMs = Math.round(
          (bytes / 2 / VOICE_AGENT_SAMPLE_RATE) * 1000,
        );
        resolve({ audio, durationMs });
      };

      ws.addEventListener("open", () => {
        ws.send(
          JSON.stringify({
            type: "session.update",
            session: {
              system_prompt: "Unused. This session only renders a greeting.",
              greeting: text,
              output: {
                voice: voiceId,
                format: { encoding: "audio/pcm" },
              },
            },
          }),
        );
      });

      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(String(event.data)) as {
          type: string;
          data?: string;
          message?: string;
          code?: string;
        };
        switch (msg.type) {
          case "reply.audio":
            if (msg.data) chunks.push(msg.data);
            break;
          case "reply.done":
            finishOk();
            break;
          case "session.error":
          case "error":
            clearTimeout(timeout);
            reject(new Error(msg.message ?? msg.code ?? "erro na síntese"));
            break;
        }
      });

      ws.addEventListener("error", () => {
        clearTimeout(timeout);
        reject(new Error("falha no websocket de síntese"));
      });
    });
  } finally {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "session.end" }));
      ws.close();
    }
  }
}
