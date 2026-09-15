"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { langChipClass } from "@/app/components/langChip";
import { PcmPlayer } from "@/lib/audio/play-pcm";
import { downloadWav, pcm16LeBase64ToWavBlob } from "@/lib/audio/pcm-to-wav";
import { renderVerbatimInBrowser } from "@/lib/audio/render-verbatim-browser";
import {
  COMPOSE_VOICE_LABEL,
  voiceForNoteLang,
} from "@/lib/assemblyai/voices";
import { assembleFinalNote, type CorretorIdentity } from "@/lib/disclosure";
import { waMeUrl, wavFilename } from "@/lib/handoff";
import {
  NOTE_LANG_LABEL,
  NOTE_LANGS,
  type NoteLang,
} from "@/lib/note-lang";

type DeskState = "idle" | "listening" | "rewriting" | "ready" | "error";
type RenderState = "idle" | "rendering" | "ready" | "playing";

type Props = {
  propertyLabel: string;
  contactName: string;
  contactPhoneE164: string;
};

export function ComposeDesk({
  propertyLabel,
  contactName,
  contactPhoneE164,
}: Props) {
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
  const [copied, setCopied] = useState(false);
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDurationMs, setAudioDurationMs] = useState<number | null>(null);

  const playerRef = useRef<PcmPlayer | null>(null);
  const playCtxRef = useRef<AudioContext | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readyRef = useRef(false);
  const turnsRef = useRef<Map<number, string>>(new Map());

  const stopPlayback = useCallback(() => {
    playerRef.current?.dispose();
    playerRef.current = null;
    void playCtxRef.current?.close();
    playCtxRef.current = null;
    setRenderState((current) => (current === "playing" ? "ready" : current));
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
        setAudioBase64(null);
        setAudioDurationMs(null);
        setRenderState("idle");
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

  const renderAudio = useCallback(async () => {
    if (!finalSpoken) return;
    stopPlayback();
    setRenderState("rendering");
    setError(null);
    try {
      const body = await renderVerbatimInBrowser(
        finalSpoken,
        voiceForNoteLang(noteLang),
      );
      setAudioBase64(body.audio);
      setAudioDurationMs(body.durationMs);
      setRenderState("ready");
    } catch (err) {
      setRenderState("idle");
      setError(err instanceof Error ? err.message : "falha ao gerar o áudio");
    }
  }, [finalSpoken, noteLang, stopPlayback]);

  const downloadAudio = useCallback(() => {
    if (!audioBase64) return;
    downloadWav(
      pcm16LeBase64ToWavBlob(audioBase64),
      wavFilename(contactName, noteLang),
    );
  }, [audioBase64, contactName, noteLang]);

  const copyNote = useCallback(async () => {
    if (!finalSpoken) return;
    try {
      await navigator.clipboard.writeText(finalSpoken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("não foi possível copiar o texto");
    }
  }, [finalSpoken]);

  const playAudio = useCallback(async () => {
    if (!audioBase64) return;
    stopPlayback();
    setRenderState("playing");
    try {
      const ctx = new AudioContext();
      await ctx.resume();
      playCtxRef.current = ctx;
      const player = await PcmPlayer.attach(ctx);
      playerRef.current = player;
      player.enqueueBase64(audioBase64);
      const seconds = (audioDurationMs ?? 0) / 1000 + 0.4;
      window.setTimeout(() => {
        stopPlayback();
      }, Math.max(seconds, 1) * 1000);
    } catch (err) {
      stopPlayback();
      setError(err instanceof Error ? err.message : "falha ao tocar o áudio");
    }
  }, [audioBase64, audioDurationMs, stopPlayback]);

  useEffect(() => {
    return () => {
      cleanup();
      stopPlayback();
    };
  }, [cleanup, stopPlayback]);

  const spokenVoice = COMPOSE_VOICE_LABEL[noteLang];

  return (
    <section className="mt-8 space-y-6">
      <p className="text-sm text-ink-muted">
        Destino: <strong className="text-ink">{contactName}</strong>
        <span className="mx-2 text-line">·</span>
        Imóvel: {propertyLabel}
      </p>

      <div className="space-y-4 rounded-2xl border border-line bg-foam p-4 sm:p-5">
        <fieldset className="flex flex-wrap items-center gap-2 text-sm">
          <legend className="sr-only">Idioma que você vai falar</legend>
          <span className="w-28 shrink-0 text-ink-muted">Vou falar em</span>
          {NOTE_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              disabled={state === "listening" || state === "rewriting"}
              onClick={() => setInputLang(code)}
              className={langChipClass(inputLang === code)}
            >
              {NOTE_LANG_LABEL[code]}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap items-center gap-2 text-sm">
          <legend className="sr-only">Idioma do recado para o proprietário</legend>
          <span className="w-28 shrink-0 text-ink-muted">Recado em</span>
          {NOTE_LANGS.map((code) => (
            <button
              key={code}
              type="button"
              disabled={state === "listening" || state === "rewriting"}
              onClick={() => setOutputLang(code)}
              className={langChipClass(outputLang === code)}
            >
              {NOTE_LANG_LABEL[code]}
            </button>
          ))}
        </fieldset>
        <p className="text-xs text-ink-muted">
          Texto e WAV usam a voz de estoque do recado:{" "}
          <code className="text-ink">{COMPOSE_VOICE_LABEL[outputLang]}</code>
          {rewritten && outputLang !== noteLang
            ? ` — o recado atual ainda está em ${NOTE_LANG_LABEL[noteLang]} (${spokenVoice}). Reescreva para trocar.`
            : null}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {state === "listening" ? (
          <button
            type="button"
            onClick={() => void stopListening()}
            className="listen-pulse rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-foam"
          >
            Parar e reescrever
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void startListening()}
            disabled={state === "rewriting"}
            className="rounded-xl bg-clay px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:bg-clay-hover disabled:opacity-40"
          >
            {state === "rewriting" ? "Reescrevendo…" : "Falar rascunho"}
          </button>
        )}
        {raw && state !== "listening" ? (
          <button
            type="button"
            onClick={() => void rewriteTranscript(raw)}
            disabled={state === "rewriting"}
            className="rounded-xl border border-line bg-foam px-4 py-2.5 text-sm font-medium text-ink transition hover:border-tide disabled:opacity-40"
          >
            Reescrever em {NOTE_LANG_LABEL[outputLang]}
          </button>
        ) : null}
      </div>

      {state === "listening" ? (
        <p className="rounded-xl border border-clay/20 bg-sand px-4 py-3 text-sm text-ink">
          <span className="font-semibold text-clay">Ouvindo…</span>{" "}
          {live || "—"}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-danger/25 bg-danger-bg p-3 text-sm text-danger">
          {error}
        </p>
      ) : null}

      {raw ? (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-line bg-foam p-4 text-sm">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Original
            </h2>
            <p className="mt-2 whitespace-pre-wrap leading-relaxed">{raw}</p>
          </article>
          <article className="rounded-2xl border border-line bg-foam p-4 text-sm">
            <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-muted">
              Reescrito · {NOTE_LANG_LABEL[noteLang]}
            </h2>
            {rewritten ? (
              <textarea
                className="mt-2 w-full resize-y rounded-xl border border-line bg-paper p-3 leading-relaxed text-ink outline-none focus:border-tide"
                rows={8}
                value={rewritten}
                onChange={(event) => {
                  setRewritten(event.target.value);
                  setApproved(false);
                  setAudioBase64(null);
                  setAudioDurationMs(null);
                  setRenderState("idle");
                }}
              />
            ) : (
              <p className="mt-2 text-ink-muted">Aguardando reescrita…</p>
            )}
          </article>
        </div>
      ) : null}

      {finalSpoken && state === "ready" ? (
        <aside className="rounded-2xl border border-line bg-foam p-5 text-sm">
          <h2 className="font-display text-lg font-semibold text-ink">
            Texto que será falado
          </h2>
          <p className="mt-3 whitespace-pre-wrap leading-relaxed">{finalSpoken}</p>
          <p className="mt-4 text-xs text-ink-muted">
            Áudio na voz {spokenVoice}, palavra por palavra.
            {audioDurationMs
              ? ` Último render: ${(audioDurationMs / 1000).toFixed(1)} s.`
              : ""}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void renderAudio()}
              disabled={renderState === "rendering"}
              className="rounded-xl bg-clay px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:bg-clay-hover disabled:opacity-40"
            >
              {renderState === "rendering"
                ? "Gerando áudio…"
                : audioBase64
                  ? "Gerar de novo"
                  : "Gerar áudio"}
            </button>
            <button
              type="button"
              onClick={() => void playAudio()}
              disabled={!audioBase64 || renderState === "rendering"}
              className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-40"
            >
              {renderState === "playing" ? "Tocando…" : "Ouvir"}
            </button>
            <button
              type="button"
              onClick={() => setApproved(true)}
              disabled={!audioBase64}
              className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-40"
            >
              {approved ? "Aprovado" : "Aprovar texto e áudio"}
            </button>
          </div>
        </aside>
      ) : null}

      {approved && audioBase64 ? (
        <aside className="rounded-2xl border border-moss/25 bg-moss-bg p-5 text-sm">
          <h2 className="font-display text-lg font-semibold text-moss">
            Entrega manual
          </h2>
          <p className="mt-2 text-ink">
            O WhatsApp abre o texto; o áudio não vai no link. Baixe o WAV e
            envie na conversa que o proprietário já abriu.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadAudio}
              className="rounded-xl bg-clay px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:bg-clay-hover"
            >
              Baixar WAV
            </button>
            <button
              type="button"
              onClick={() => void copyNote()}
              className="rounded-xl border border-line bg-foam px-4 py-2.5 text-sm font-medium text-ink"
            >
              {copied ? "Texto copiado" : "Copiar texto"}
            </button>
            <a
              href={waMeUrl(contactPhoneE164, finalSpoken)}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-line bg-foam px-4 py-2.5 text-sm font-medium text-ink"
            >
              Abrir WhatsApp
            </a>
          </div>
        </aside>
      ) : null}
    </section>
  );
}
