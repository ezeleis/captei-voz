"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { langChipClass } from "@/app/components/langChip";
import { PcmPlayer } from "@/lib/audio/play-pcm";
import {
  RECORD_QUALIFICATION_TOOL,
  SESSION_STATE_LABEL,
  qualifyGreeting,
  qualifySystemPrompt,
  type QualificationPayload,
} from "@/lib/assemblyai/qualify-config";
import { COMPOSE_VOICE_LABEL, voiceForNoteLang } from "@/lib/assemblyai/voices";
import type { CorretorIdentity } from "@/lib/disclosure";
import {
  NOTE_LANG_LABEL,
  NOTE_LANGS,
  type NoteLang,
} from "@/lib/note-lang";

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
  const [ownerLang, setOwnerLang] = useState<NoteLang>("pt");
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [qualification, setQualification] = useState<QualificationPayload | null>(
    null,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
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
    playerRef.current?.dispose();
    playerRef.current = null;
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
        corretor?: CorretorIdentity | null;
        error?: string;
      };
      if (!tokenRes.ok || !tokenBody.token) {
        throw new Error(tokenBody.error ?? "não foi possível obter o token");
      }

      // One context for mic and TTS. A second context with latencyHint
      // "playback" or setSinkId can send audio to speakers while the
      // headset is only opened for capture — playback then sounds dead.
      const audioCtx = new AudioContext();
      await audioCtx.resume();
      audioCtxRef.current = audioCtx;
      playerRef.current = await PcmPlayer.attach(audioCtx);

      await audioCtx.audioWorklet.addModule("/pcm-processor.js?v=2");
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
      audioCtx.createMediaStreamSource(stream).connect(worklet);

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
        const who = tokenBody.corretor ?? null;
        // Inline only. A stored agent_id would freeze Portuguese voice and greeting.
        ws.send(
          JSON.stringify({
            type: "session.update",
            session: {
              system_prompt: qualifySystemPrompt(who, ownerLang),
              greeting: qualifyGreeting(who, ownerLang),
              tools: [RECORD_QUALIFICATION_TOOL],
              input: { language_codes: [ownerLang] },
              output: {
                voice: voiceForNoteLang(ownerLang),
                format: { encoding: "audio/pcm" },
              },
            },
          }),
        );
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
            if (msg.data) playerRef.current?.enqueueBase64(msg.data);
            break;
          case "reply.done":
            lastEventRef.current = "reply.done";
            if (msg.status === "interrupted") {
              pendingToolsRef.current = [];
              playerRef.current?.flush();
            } else {
              playerRef.current?.drain();
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
  }, [appendLog, cleanup, contactId, flushTools, ownerLang]);

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
      <p className="text-sm text-ink-muted">
        Falando com <strong className="text-ink">{contactName}</strong>. Fones
        ajudam se houver eco.
      </p>

      <fieldset className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-foam p-4 text-sm sm:p-5">
        <legend className="sr-only">Idioma da conversa</legend>
        <span className="w-28 shrink-0 text-ink-muted">Conversar em</span>
        {NOTE_LANGS.map((code) => (
          <button
            key={code}
            type="button"
            disabled={state === "connecting" || state === "live" || state === "ending"}
            onClick={() => setOwnerLang(code)}
            className={langChipClass(ownerLang === code)}
          >
            {NOTE_LANG_LABEL[code]}
          </button>
        ))}
        <p className="w-full text-xs text-ink-muted">
          Voz: <span className="text-ink">{COMPOSE_VOICE_LABEL[ownerLang]}</span>
        </p>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void startSession()}
          disabled={state === "connecting" || state === "live" || state === "ending"}
          className="rounded-xl bg-clay px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:bg-clay-hover disabled:opacity-40"
        >
          {state === "connecting" ? "Conectando…" : "Iniciar conversa"}
        </button>
        <button
          type="button"
          onClick={endSession}
          disabled={state !== "live"}
          className="rounded-xl border border-line bg-foam px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-40"
        >
          Encerrar
        </button>
        <span
          className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
            state === "live"
              ? "bg-moss-bg text-moss"
              : state === "error"
                ? "bg-danger-bg text-danger"
                : "bg-sand text-ink-muted"
          }`}
        >
          {SESSION_STATE_LABEL[state]}
        </span>
      </div>

      {error ? (
        <p className="rounded-2xl border border-danger/25 bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {qualification ? (
        <aside className="rounded-2xl border border-moss/25 bg-moss-bg p-5 text-sm">
          <h2 className="font-display text-lg font-semibold text-moss">
            Qualificação gravada
          </h2>
          <dl className="mt-3 grid grid-cols-[7.5rem_1fr] gap-y-1.5">
            <dt className="text-ink-muted">Endereço</dt>
            <dd>{qualification.endereco}</dd>
            <dt className="text-ink-muted">Tipo</dt>
            <dd>{qualification.tipo_imovel}</dd>
            <dt className="text-ink-muted">Finalidade</dt>
            <dd>{qualification.finalidade}</dd>
            {qualification.prazo ? (
              <>
                <dt className="text-ink-muted">Prazo</dt>
                <dd>{qualification.prazo}</dd>
              </>
            ) : null}
          </dl>
        </aside>
      ) : null}

      <ol className="space-y-3">
        {log.map((line) => {
          const isAgent = line.role === "agent";
          const isUser = line.role === "user";
          return (
            <li
              key={line.id}
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                isAgent
                  ? "bg-ink text-foam"
                  : isUser
                    ? "ml-auto bg-foam border border-line text-ink"
                    : "bg-sand text-ink-muted"
              }`}
            >
              <span
                className={`block text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
                  isAgent ? "text-sand/80" : "text-ink-muted"
                }`}
              >
                {isUser ? "Proprietário" : isAgent ? "Agente" : "Sistema"}
              </span>
              <span className="mt-1 block">{line.text}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
