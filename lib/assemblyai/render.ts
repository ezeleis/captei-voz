import "server-only";

import { env } from "@/lib/env";

/**
 * Render approved text to speech, verbatim.
 *
 * AssemblyAI sells no standalone TTS — synthesis exists only inside the Voice
 * Agent pipeline. The seam we use is the `greeting` field, which their docs
 * describe unambiguously:
 *
 *   "The greeting is sent straight to the TTS engine. It is not run through
 *    the LLM first. Whatever string you put here is exactly what the user
 *    hears, word for word."
 *
 * That property is why this path was chosen over `reply.create` or the system
 * prompt: both route through the LLM, which would mean the corretor approves
 * one text and the owner hears a paraphrase of it. For a product whose entire
 * defence is the approval step, that is disqualifying.
 *
 * Cost/latency shape, which the UI must accommodate rather than hide:
 *  - audio arrives at roughly playback rate, so a 35s note takes ~35s;
 *  - billing is on wall-clock socket-open time, not audio seconds;
 *  - never leave the socket open — an abandoned session bills up to 3 hours.
 *
 * UNVERIFIED: the maximum greeting length is undocumented. Run the
 * greeting-length test before relying on this for a full-length note. If long
 * greetings truncate, chunk the text and concatenate the PCM.
 * See docs/bmad/recommended-mvp.md §4.
 */

export type RenderResult = {
  /** Raw PCM, signed 16-bit little-endian, mono. */
  pcm: Buffer;
  sampleRate: 24000;
};

async function mintToken(): Promise<string> {
  const url = new URL("https://agents.assemblyai.com/v1/token");
  url.searchParams.set("expires_in_seconds", "60");
  url.searchParams.set("max_session_duration_seconds", "300");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${env.assemblyAiApiKey}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`token mint failed: ${response.status}`);
  }
  const { token } = (await response.json()) as { token: string };
  return token;
}

export async function renderVerbatim(
  text: string,
  voiceId: string,
): Promise<RenderResult> {
  const token = await mintToken();
  const wsUrl = new URL("wss://agents.assemblyai.com/v1/ws");
  wsUrl.searchParams.set("token", token);

  const ws = new WebSocket(wsUrl);
  const chunks: Buffer[] = [];

  try {
    return await new Promise<RenderResult>((resolve, reject) => {
      // Hard ceiling so a stalled render can never bill indefinitely.
      const timeout = setTimeout(
        () => reject(new Error("render timed out")),
        180_000,
      );

      const settleOk = () => {
        clearTimeout(timeout);
        resolve({ pcm: Buffer.concat(chunks), sampleRate: 24000 });
      };
      const settleErr = (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      };

      ws.addEventListener("open", () => {
        // Inline configuration: greeting, voice and output format are all
        // immutable after session.ready, so they must go in the first update.
        // No agent_id — inline and stored config are mutually exclusive.
        ws.send(
          JSON.stringify({
            type: "session.update",
            session: {
              // Never used: we send no input.audio and the greeting bypasses
              // the LLM. Present only because the field is required.
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
            if (msg.data) chunks.push(Buffer.from(msg.data, "base64"));
            break;
          case "reply.done":
            // The greeting has finished speaking. Nothing else will arrive,
            // because we never send input.audio.
            settleOk();
            break;
          case "session.error":
          case "error":
            settleErr(new Error(`${msg.code ?? "error"}: ${msg.message}`));
            break;
        }
      });

      ws.addEventListener("error", () => settleErr(new Error("websocket error")));
      ws.addEventListener("close", () => {
        if (chunks.length > 0) settleOk();
        else settleErr(new Error("socket closed before any audio"));
      });
    });
  } finally {
    // Non-negotiable. Closing without session.end leaves a billable 30-second
    // resume grace window; never closing at all bills up to 3 hours.
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "session.end" }));
      ws.close();
    }
  }
}
