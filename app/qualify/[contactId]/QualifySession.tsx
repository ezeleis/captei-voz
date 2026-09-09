"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  QUALIFY_GREETING,
  QUALIFY_SYSTEM_PROMPT,
  QUALIFY_VOICE_ID,
  RECORD_QUALIFICATION_TOOL,
  type QualificationPayload,
} from "@/lib/assemblyai/qualify-config";

type SessionState = "idle" | "connecting" | "live" | "ending" | "ended" | "error";

type LogLine = {
  id: number;
  role: "user" | "agent" | "system";
  text: string;
};

type Props = {
  contactId: string;
  contactName: string;
};

export function QualifySession({ contactId, contactName }: Props) {
  const [state, setState] = useState<SessionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [qualification, setQualification] = useState<QualificationPayload | null>(
    null,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const playbackTimeRef = useRef(0);
  const readyRef = useRef(false);
  const lastEventRef = useRef<string | null>(null);
  const pendingToolsRef = useRef<
    Array<{ call_id: string; result: unknown }>
  >([]);
  const sessionIdRef = useRef<string | null>(null);
  const logIdRef = useRef(0);

  const appendLog = useCallback((role: LogLine["role"], text: string) => {
    const id = ++logIdRef.current;
    setLog((prev) => [...prev, { id, role, text }]);
  }, []);

  const flushTools = useCallback(() => {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    if (lastEventRef.current !== "reply.done") return;
    if (pendingToolsRef.current.length === 0) return;
    for (const tool of pendingToolsRef.current) {
      ws.send(
        JSON.stringify({
          type: "tool.result",
          call_id: tool.call_id,
          result: JSON.stringify(tool.result),
        }),
      );
    }
    pendingToolsRef.current = [];
  }, []);

  const cleanup = useCallback(() => {
    readyRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }, []);

  const endSession = useCallback(() => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      setState("ending");
      ws.send(JSON.stringify({ type: "session.end" }));
      return;
    }
    cleanup();
    setState("ended");
  }, [cleanup]);

  const startSession = useCallback(async () => {
    setError(null);
    setQualification(null);
    setLog([]);
    setState("connecting");

    try {
      const tokenRes = await fetch("/api/voice-token", { cache: "no-store" });
      const tokenBody = (await tokenRes.json()) as {
        token?: string;
        agentId?: string | null;
        error?: string;
      };
      if (!tokenRes.ok || !tokenBody.token) {
        throw new Error(tokenBody.error ?? "não foi possível obter o token");
      }

      const audioCtx = new AudioContext();
      await audioCtx.resume();
      audioCtxRef.current = audioCtx;
      playbackTimeRef.current = audioCtx.currentTime;

      await audioCtx.audioWorklet.addModule("/pcm-processor.js");
      const worklet = new AudioWorkletNode(audioCtx, "pcm-processor", {
        processorOptions: {
          inputSampleRate: audioCtx.sampleRate,
          targetSampleRate: 24000,
        },
      });

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false },
      });
      streamRef.current = stream;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(worklet);

      const wsUrl = new URL("wss://agents.assemblyai.com/v1/ws");
      wsUrl.searchParams.set("token", tokenBody.token);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      worklet.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
        if (!readyRef.current || ws.readyState !== WebSocket.OPEN) return;
        const bytes = new Uint8Array(event.data);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]!);
        }
        ws.send(
          JSON.stringify({
            type: "input.audio",
            audio: btoa(binary),
          }),
        );
      };

      ws.addEventListener("open", () => {
        const session = tokenBody.agentId
          ? { agent_id: tokenBody.agentId }
          : {
              system_prompt: QUALIFY_SYSTEM_PROMPT,
              greeting: QUALIFY_GREETING,
              tools: [RECORD_QUALIFICATION_TOOL],
              input: { language_codes: ["pt"] },
              output: {
                voice: QUALIFY_VOICE_ID,
                format: { encoding: "audio/pcm" },
              },
            };
        ws.send(JSON.stringify({ type: "session.update", session }));
      });

      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(String(event.data)) as {
          type: string;
          session_id?: string;
          text?: string;
          data?: string;
          name?: string;
          call_id?: string;
          arguments?: Record<string, unknown>;
          status?: string;
          message?: string;
          code?: string;
        };

        switch (msg.type) {
          case "session.ready":
            readyRef.current = true;
            sessionIdRef.current = msg.session_id ?? null;
            setState("live");
            appendLog("system", "Sessão pronta. Pode falar.");
            break;
          case "transcript.user":
            if (msg.text) appendLog("user", msg.text);
            break;
          case "transcript.agent":
            if (msg.text) appendLog("agent", msg.text);
            break;
          case "reply.started":
          case "input.speech.started":
            lastEventRef.current = msg.type;
            break;
          case "reply.audio":
            if (msg.data && audioCtxRef.current) playPcm(audioCtxRef.current, msg.data, playbackTimeRef);
            break;
          case "reply.done":
            lastEventRef.current = "reply.done";
            if (msg.status === "interrupted") {
              pendingToolsRef.current = [];
              if (audioCtxRef.current) {
                playbackTimeRef.current = audioCtxRef.current.currentTime;
              }
            } else {
              flushTools();
            }
            break;
          case "tool.call": {
            if (msg.name === "registrar_qualificacao" && msg.call_id) {
              const payload = (msg.arguments ?? {}) as QualificationPayload;
              setQualification(payload);
              appendLog("system", "Qualificação registrada pelo agente.");
              void fetch("/api/qualify/result", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contactId,
                  sessionId: sessionIdRef.current,
                  qualification: payload,
                }),
              });
              pendingToolsRef.current.push({
                call_id: msg.call_id,
                result: { ok: true, message: "Qualificação gravada para o corretor." },
              });
              flushTools();
            }
            break;
          }
          case "session.ended":
            cleanup();
            setState("ended");
            appendLog("system", "Sessão encerrada.");
            break;
          case "session.error":
          case "error":
            setError(msg.message ?? msg.code ?? "erro na sessão");
            setState("error");
            cleanup();
            break;
        }
      });

      ws.addEventListener("close", () => {
        if (readyRef.current) {
          cleanup();
          setState((current) => (current === "ending" ? "ended" : current));
        }
      });
    } catch (err) {
      cleanup();
      setState("error");
      setError(err instanceof Error ? err.message : "falha ao iniciar a sessão");
    }
  }, [appendLog, cleanup, contactId, flushTools]);

  useEffect(() => {
    const onHide = () => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "session.end" }));
      }
    };
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "session.end" }));
      }
      cleanup();
    };
  }, [cleanup]);

  return (
    <section className="mt-8 space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Falando com <strong>{contactName}</strong>. Use Chrome ou Edge. Fones
        ajudam se o eco cancelar mal.
      </p>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => void startSession()}
          disabled={state === "connecting" || state === "live" || state === "ending"}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {state === "connecting" ? "Conectando…" : "Iniciar conversa"}
        </button>
        <button
          type="button"
          onClick={endSession}
          disabled={state !== "live"}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-neutral-700"
        >
          Encerrar
        </button>
      </div>

      <p className="text-xs uppercase tracking-wide text-neutral-500">
        Estado: {state}
      </p>

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {qualification ? (
        <aside className="rounded-lg border border-neutral-300 p-4 text-sm dark:border-neutral-700">
          <h2 className="font-medium">Qualificação gravada</h2>
          <dl className="mt-2 grid grid-cols-[8rem_1fr] gap-y-1">
            <dt className="text-neutral-500">Endereço</dt>
            <dd>{qualification.endereco}</dd>
            <dt className="text-neutral-500">Tipo</dt>
            <dd>{qualification.tipo_imovel}</dd>
            <dt className="text-neutral-500">Finalidade</dt>
            <dd>{qualification.finalidade}</dd>
            {qualification.prazo ? (
              <>
                <dt className="text-neutral-500">Prazo</dt>
                <dd>{qualification.prazo}</dd>
              </>
            ) : null}
          </dl>
        </aside>
      ) : null}

      <ol className="space-y-2 text-sm">
        {log.map((line) => (
          <li key={line.id}>
            <span className="text-neutral-500">
              {line.role === "user"
                ? "Proprietário"
                : line.role === "agent"
                  ? "Agente"
                  : "Sistema"}
              :{" "}
            </span>
            {line.text}
          </li>
        ))}
      </ol>
    </section>
  );
}

function playPcm(
  audioCtx: AudioContext,
  base64: string,
  playbackTimeRef: { current: number },
) {
  const raw = atob(base64);
  const pcm16 = new Int16Array(raw.length / 2);
  for (let i = 0; i < pcm16.length; i++) {
    pcm16[i] = raw.charCodeAt(i * 2) | (raw.charCodeAt(i * 2 + 1) << 8);
  }
  const float32 = new Float32Array(pcm16.length);
  for (let i = 0; i < pcm16.length; i++) {
    float32[i] = (pcm16[i] ?? 0) / 32768;
  }
  const buffer = audioCtx.createBuffer(1, float32.length, 24000);
  buffer.getChannelData(0).set(float32);
  const src = audioCtx.createBufferSource();
  src.buffer = buffer;
  src.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  playbackTimeRef.current = Math.max(playbackTimeRef.current, now);
  src.start(playbackTimeRef.current);
  playbackTimeRef.current += buffer.duration;
}
