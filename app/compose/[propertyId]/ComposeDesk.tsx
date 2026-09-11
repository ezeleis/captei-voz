"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { assembleFinalNote, type CorretorIdentity } from "@/lib/disclosure";
import {
  NOTE_LANG_LABEL,
  NOTE_LANGS,
  type NoteLang,
} from "@/lib/note-lang";

type DeskState = "idle" | "listening" | "rewriting" | "ready" | "error";

type Props = {
  propertyLabel: string;
  contactName: string;
};

export function ComposeDesk({ propertyLabel, contactName }: Props) {
  const [state, setState] = useState<DeskState>("idle");
  const [inputLang, setInputLang] = useState<NoteLang>("pt");
  const [outputLang, setOutputLang] = useState<NoteLang>("pt");
  const [noteLang, setNoteLang] = useState<NoteLang>("pt");
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState("");
  const [raw, setRaw] = useState("");
  const [rewritten, setRewritten] = useState("");
  const [identity, setIdentity] = useState<CorretorIdentity | null>(null);
  const [approved, setApproved] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readyRef = useRef(false);
  const turnsRef = useRef<Map<number, string>>(new Map());

  const cleanup = useCallback(() => {
    readyRef.current = false;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void audioCtxRef.current?.close();
    audioCtxRef.current = null;
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "Terminate" }));
      ws.close();
    }
  }, []);

  const combinedTurns = useCallback(() => {
    return [...turnsRef.current.entries()]
      .sort(([a], [b]) => a - b)
      .map(([, text]) => text)
      .filter(Boolean)
      .join(" ")
      .trim();
  }, []);

  const rewriteTranscript = useCallback(
    async (transcript: string) => {
      setState("rewriting");
      setError(null);
      try {
        const response = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, outputLang }),
        });
        const body = (await response.json()) as {
          rewritten?: string;
          identity?: CorretorIdentity | null;
          error?: string;
        };
        if (!response.ok || !body.rewritten) {
          throw new Error(body.error ?? "falha na reescrita");
        }
        setRewritten(body.rewritten);
        setIdentity(body.identity ?? null);
        setNoteLang(outputLang);
        setApproved(false);
        setState("ready");
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "falha na reescrita");
      }
    },
    [outputLang],
  );

  const stopListening = useCallback(async () => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "ForceEndpoint" }));
      await new Promise((resolve) => setTimeout(resolve, 600));
      ws.send(JSON.stringify({ type: "Terminate" }));
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    const transcript = combinedTurns();
    cleanup();
    setRaw(transcript);
    setLive("");
    if (!transcript) {
      setState("idle");
      return;
    }
    await rewriteTranscript(transcript);
  }, [cleanup, combinedTurns, rewriteTranscript]);

  const startListening = useCallback(async () => {
    setError(null);
    setApproved(false);
    setRewritten("");
    setIdentity(null);
    setRaw("");
    setLive("");
    turnsRef.current = new Map();
    setState("listening");

    try {
      const tokenRes = await fetch("/api/stt-token", { cache: "no-store" });
      const tokenBody = (await tokenRes.json()) as {
        token?: string;
        error?: string;
      };
      if (!tokenRes.ok || !tokenBody.token) {
        throw new Error(tokenBody.error ?? "não foi possível obter o token");
      }

      const audioCtx = new AudioContext();
      await audioCtx.resume();
      audioCtxRef.current = audioCtx;
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

      const wsUrl = new URL("wss://streaming.assemblyai.com/v3/ws");
      wsUrl.searchParams.set("speech_model", "universal-3-5-pro");
      wsUrl.searchParams.set("sample_rate", "24000");
      wsUrl.searchParams.set("mode", "max_accuracy");
      // Monolingual session. Default multilingual code-switch mixes PT/ES/EN
      // in one utterance. The corretor picks the language they are speaking.
      wsUrl.searchParams.append("language_codes", inputLang);
      wsUrl.searchParams.set("token", tokenBody.token);
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      worklet.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
        if (!readyRef.current || ws.readyState !== WebSocket.OPEN) return;
        ws.send(event.data);
      };

      ws.addEventListener("message", (event) => {
        const msg = JSON.parse(String(event.data)) as {
          type?: string;
          transcript?: string;
          turn_order?: number;
          end_of_turn?: boolean;
          turn_is_formatted?: boolean;
          error?: string;
        };
        if (msg.type === "Begin") {
          readyRef.current = true;
          return;
        }
        if (msg.type === "Error") {
          setError(msg.error ?? "erro no streaming");
          setState("error");
          cleanup();
          return;
        }
        if (msg.type !== "Turn" || !msg.transcript) return;
        const order = msg.turn_order ?? 0;
        if (msg.end_of_turn && msg.turn_is_formatted) {
          turnsRef.current.set(order, msg.transcript);
        }
        const previous = [...turnsRef.current.entries()]
          .filter(([key]) => key < order)
          .sort(([a], [b]) => a - b)
          .map(([, text]) => text);
        setLive([...previous, msg.transcript].join(" "));
      });

      ws.addEventListener("error", () => {
        setError("falha no websocket de transcrição");
        setState("error");
        cleanup();
      });
    } catch (err) {
      cleanup();
      setState("error");
      setError(err instanceof Error ? err.message : "falha ao iniciar o microfone");
    }
  }, [cleanup, inputLang]);

  const finalSpoken = useMemo(() => {
    if (!rewritten) return "";
    return identity ? assembleFinalNote(rewritten, identity, noteLang) : rewritten;
  }, [identity, noteLang, rewritten]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <section className="mt-8 space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Destino: <strong>{contactName}</strong> · Imóvel: {propertyLabel}
      </p>

      <div className="space-y-3">
        <fieldset className="flex flex-wrap items-center gap-2 text-sm">
          <legend className="sr-only">Idioma que você vai falar</legend>
          <span className="text-neutral-500">Vou falar em</span>
          {NOTE_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              disabled={state === "listening" || state === "rewriting"}
              onClick={() => setInputLang(code)}
              className={`rounded-full border px-3 py-1 ${
                inputLang === code
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {NOTE_LANG_LABEL[code]}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap items-center gap-2 text-sm">
          <legend className="sr-only">Idioma do recado para o proprietário</legend>
          <span className="text-neutral-500">Recado em</span>
          {NOTE_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              disabled={state === "listening" || state === "rewriting"}
              onClick={() => setOutputLang(code)}
              className={`rounded-full border px-3 py-1 ${
                outputLang === code
                  ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {NOTE_LANG_LABEL[code]}
            </button>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-wrap gap-3">
        {state === "listening" ? (
          <button
            type="button"
            onClick={() => void stopListening()}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white"
          >
            Parar e reescrever
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startListening()}
            disabled={state === "rewriting"}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
          >
            {state === "rewriting" ? "Reescrevendo…" : "Falar rascunho"}
          </button>
        )}
        {raw && state !== "listening" ? (
          <button
            type="button"
            onClick={() => void rewriteTranscript(raw)}
            disabled={state === "rewriting"}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm disabled:opacity-40 dark:border-neutral-700"
          >
            Reescrever em {NOTE_LANG_LABEL[outputLang]}
          </button>
        ) : null}
      </div>

      {state === "listening" ? (
        <p className="text-sm text-neutral-500">Ouvindo… {live || "—"}</p>
      ) : null}

      {error ? (
        <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

      {raw ? (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-lg border border-neutral-300 p-4 text-sm dark:border-neutral-700">
            <h2 className="font-medium">Original</h2>
            <p className="mt-2 whitespace-pre-wrap">{raw}</p>
          </article>
          <article className="rounded-lg border border-neutral-300 p-4 text-sm dark:border-neutral-700">
            <h2 className="font-medium">Reescrito</h2>
            {rewritten ? (
              <textarea
                className="mt-2 w-full resize-y rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                rows={8}
                value={rewritten}
                onChange={(event) => {
                  setRewritten(event.target.value);
                  setApproved(false);
                }}
              />
            ) : (
              <p className="mt-2 text-neutral-500">Aguardando reescrita…</p>
            )}
          </article>
        </div>
      ) : null}

      {finalSpoken && state === "ready" ? (
        <aside className="rounded-lg border border-neutral-300 p-4 text-sm dark:border-neutral-700">
          <h2 className="font-medium">Texto que será falado</h2>
          {!identity ? (
            <p className="mt-2 text-amber-800 dark:text-amber-200">
              Falta CORRETOR_FULL_NAME / CORRETOR_CRECI no .env.local — o bloco
              de identificação não foi anexado.
            </p>
          ) : null}
          <p className="mt-2 whitespace-pre-wrap">{finalSpoken}</p>
          <p className="mt-4 text-xs text-neutral-500">
            Áudio ainda não é gerado nesta tela. Aprovação registra o texto.
          </p>
          <button
            type="button"
            onClick={() => setApproved(true)}
            className="mt-3 rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
          >
            {approved ? "Aprovado" : "Aprovar texto"}
          </button>
        </aside>
      ) : null}
    </section>
  );
}
