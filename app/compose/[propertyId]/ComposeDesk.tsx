"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { langChipClass } from "@/app/components/langChip";
import { downloadWav, pcm16LeBase64ToWavBlob } from "@/lib/audio/pcm-to-wav";
import { renderVerbatimInBrowser } from "@/lib/audio/render-verbatim-browser";
import {
  COMPOSE_VOICE_LABEL,
  voiceForNoteLang,
} from "@/lib/assemblyai/voices";
import {
  assembleEmailMessage,
  assembleVoiceScript,
  assembleWhatsAppText,
} from "@/lib/compose/channels";
import { type CorretorIdentity } from "@/lib/disclosure";
import { waMeUrl, wavFilename } from "@/lib/handoff";
import {
  NOTE_LANG_LABEL,
  NOTE_LANGS,
  type NoteLang,
} from "@/lib/note-lang";

type DeskState = "idle" | "listening" | "rewriting" | "ready" | "error";
type RenderState = "idle" | "rendering" | "ready" | "playing";
type ChannelTab = "whatsapp" | "email" | "audio";

type Props = {
  propertyLabel: string;
  contactName: string;
  contactPhoneE164: string;
};

function channelTabClass(active: boolean): string {
  return active
    ? "rounded-lg bg-clay px-3 py-1.5 text-sm font-semibold text-foam"
    : "rounded-lg border border-line bg-paper px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:border-tide hover:text-ink";
}

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
  const [whatsappText, setWhatsappText] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [channelTab, setChannelTab] = useState<ChannelTab>("whatsapp");
  const [identity, setIdentity] = useState<CorretorIdentity | null>(null);
  const [approved, setApproved] = useState(false);
  const [copied, setCopied] = useState<ChannelTab | "subject" | null>(null);
  const [renderState, setRenderState] = useState<RenderState>("idle");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDurationMs, setAudioDurationMs] = useState<number | null>(null);

  const previewRef = useRef<HTMLAudioElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readyRef = useRef(false);
  const turnsRef = useRef<Map<number, string>>(new Map());

  const stopPlayback = useCallback(() => {
    const el = previewRef.current;
    previewRef.current = null;
    if (el) {
      el.onended = null;
      el.onerror = null;
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
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
          body: JSON.stringify({ transcript, outputLang, propertyLabel }),
        });
        const body = (await response.json()) as {
          rewritten?: string;
          whatsappText?: string;
          emailSubject?: string;
          emailBody?: string;
          finalSpoken?: string;
          identity?: CorretorIdentity | null;
          error?: string;
        };
        if (!response.ok || !body.rewritten) {
          throw new Error(body.error ?? "falha na reescrita");
        }
        setRewritten(body.rewritten);
        setWhatsappText(body.whatsappText ?? "");
        setEmailSubject(body.emailSubject ?? "");
        setEmailBody(body.emailBody ?? "");
        setIdentity(body.identity ?? null);
        setNoteLang(outputLang);
        setChannelTab("whatsapp");
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
    [outputLang, propertyLabel],
  );

  const syncChannelsFromBody = useCallback(
    (body: string, who: CorretorIdentity | null, lang: NoteLang) => {
      if (!who) return;
      setWhatsappText(assembleWhatsAppText(body, who, lang));
      setEmailBody(assembleEmailMessage(body, who, lang));
    },
    [],
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
    setWhatsappText("");
    setEmailSubject("");
    setEmailBody("");
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
    return identity
      ? assembleVoiceScript(rewritten, identity, noteLang)
      : rewritten;
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

  const copyText = useCallback(async (text: string, label: ChannelTab | "subject") => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("não foi possível copiar o texto");
    }
  }, []);

  const playAudio = useCallback(async () => {
    if (!audioBase64) return;
    stopPlayback();
    setRenderState("playing");
    try {
      // Same bytes as Baixar WAV. The streaming worklet is for live qualify
      // and used to drop anything past a 4 s ring buffer.
      const url = URL.createObjectURL(pcm16LeBase64ToWavBlob(audioBase64));
      previewUrlRef.current = url;
      const el = new Audio(url);
      previewRef.current = el;
      el.onended = () => stopPlayback();
      el.onerror = () => {
        stopPlayback();
        setError("falha ao tocar o áudio");
      };
      await el.play();
    } catch (err) {
      stopPlayback();
      setError(err instanceof Error ? err.message : "falha ao tocar o áudio");
    }
  }, [audioBase64, stopPlayback]);

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
          WhatsApp, e-mail e áudio saem no idioma do recado. Voz de estoque:{" "}
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
                  const next = event.target.value;
                  setRewritten(next);
                  syncChannelsFromBody(next, identity, noteLang);
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

      {rewritten && state === "ready" ? (
        <aside className="rounded-2xl border border-line bg-foam p-5 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              Canais de entrega
            </h2>
            <nav className="flex flex-wrap gap-2" aria-label="Canal">
              <button
                type="button"
                onClick={() => setChannelTab("whatsapp")}
                className={channelTabClass(channelTab === "whatsapp")}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannelTab("email")}
                className={channelTabClass(channelTab === "email")}
              >
                E-mail
              </button>
              <button
                type="button"
                onClick={() => setChannelTab("audio")}
                className={channelTabClass(channelTab === "audio")}
              >
                Áudio
              </button>
            </nav>
          </div>

          {channelTab === "whatsapp" ? (
            <div className="mt-4">
              <p className="text-xs text-ink-muted">
                Copiar e colar na conversa que o proprietário já abriu. Envio
                manual — nada é disparado por bot.
              </p>
              <textarea
                className="mt-3 w-full resize-y rounded-xl border border-line bg-paper p-3 leading-relaxed text-ink outline-none focus:border-tide"
                rows={10}
                value={whatsappText}
                onChange={(event) => {
                  setWhatsappText(event.target.value);
                  setApproved(false);
                }}
              />
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void copyText(whatsappText, "whatsapp")}
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  {copied === "whatsapp" ? "Copiado" : "Copiar texto"}
                </button>
                <a
                  href={waMeUrl(contactPhoneE164, whatsappText)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          ) : null}

          {channelTab === "email" ? (
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Assunto
                </span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-tide"
                  value={emailSubject}
                  onChange={(event) => {
                    setEmailSubject(event.target.value);
                    setApproved(false);
                  }}
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                  Corpo
                </span>
                <textarea
                  className="mt-1 w-full resize-y rounded-xl border border-line bg-paper p-3 leading-relaxed text-ink outline-none focus:border-tide"
                  rows={12}
                  value={emailBody}
                  onChange={(event) => {
                    setEmailBody(event.target.value);
                    setApproved(false);
                  }}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void copyText(emailSubject, "subject")}
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  {copied === "subject" ? "Assunto copiado" : "Copiar assunto"}
                </button>
                <button
                  type="button"
                  onClick={() => void copyText(emailBody, "email")}
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  {copied === "email" ? "E-mail copiado" : "Copiar e-mail"}
                </button>
              </div>
            </div>
          ) : null}

          {channelTab === "audio" ? (
            <div className="mt-4">
              <p className="whitespace-pre-wrap leading-relaxed text-ink">
                {finalSpoken}
              </p>
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
                  onClick={() => void copyText(finalSpoken, "audio")}
                  className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-medium text-ink"
                >
                  {copied === "audio" ? "Roteiro copiado" : "Copiar roteiro"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-6 border-t border-line pt-4">
            <button
              type="button"
              onClick={() => setApproved(true)}
              className="rounded-xl bg-tide px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:opacity-90"
            >
              {approved ? "Mensagens aprovadas" : "Aprovar para entrega manual"}
            </button>
          </div>
        </aside>
      ) : null}

      {approved ? (
        <aside className="rounded-2xl border border-moss/25 bg-moss-bg p-5 text-sm">
          <h2 className="font-display text-lg font-semibold text-moss">
            Entrega manual — copiar em cada canal
          </h2>
          <p className="mt-2 text-ink">
            Use os botões acima por canal. O áudio WAV só existe se você gerou
            na aba Áudio; o WhatsApp não anexa áudio pelo link wa.me.
          </p>
          {audioBase64 ? (
            <div className="mt-4">
              <button
                type="button"
                onClick={downloadAudio}
                className="rounded-xl bg-clay px-4 py-2.5 text-sm font-semibold text-foam shadow-sm transition hover:bg-clay-hover"
              >
                Baixar WAV
              </button>
            </div>
          ) : null}
        </aside>
      ) : null}
    </section>
  );
}
