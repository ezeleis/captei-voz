/**
 * Vendor-neutral provider contracts for Captei.
 *
 * Product logic lives in `lib/compose/` and `lib/consent/`. Speech, rewrite
 * and live-qualify are adapters. Today every adapter is AssemblyAI
 * (`lib/assemblyai/*`). Do not route on `CAPTEI_*_PROVIDER` until a second
 * adapter exists — see `docs/architecture/providers.md`.
 */

import type { NoteLang } from "@/lib/note-lang";

/** Core omnichannel copy — no CRECI, no disclosure (assembled in compose/). */
export type OmnichannelDraft = {
  body: string;
  whatsappBody: string;
  emailSubject: string;
  emailBody: string;
};

export type SttPartial = {
  text: string;
  isFinal: boolean;
};

export type SttStreamingOptions = {
  languageCodes: string[];
  onTranscript: (partial: SttPartial) => void;
  onError?: (message: string) => void;
};

/**
 * Live streaming transcription. Call `end()` (Terminate) — never just
 * close the socket.
 */
export type SttSession = {
  sendPcm(chunk: ArrayBuffer): void;
  end(): Promise<void>;
};

export interface SttProvider {
  startStreaming(options: SttStreamingOptions): Promise<SttSession>;
}

export type RewriteInput = {
  transcript: string;
  outputLang: NoteLang;
  propertyLabel?: string;
};

export interface LlmRewriter {
  rewriteOmnichannel(input: RewriteInput): Promise<OmnichannelDraft>;
}

/** Signed 16-bit little-endian PCM. Not the Web Audio `AudioBuffer`. */
export type RenderedSpeech = {
  pcm: ArrayBuffer;
  sampleRate: number;
  channels: 1;
};

export interface TtsRenderer {
  renderSpeech(text: string, voiceRef: string): Promise<RenderedSpeech>;
}

export type QualifySessionOptions = {
  language: NoteLang;
  voiceRef: string;
  onAssistantAudio?: (pcm: ArrayBuffer) => void;
  onTranscript?: (role: "owner" | "agent", text: string) => void;
  onError?: (message: string) => void;
};

/**
 * Consented live qualify. Call `end()` (`session.end`) — never just
 * close the socket.
 */
export type QualifySessionHandle = {
  sendAudio(chunk: ArrayBuffer): void;
  end(): Promise<void>;
};

export interface VoiceAgentProvider {
  startQualifySession(
    options: QualifySessionOptions,
  ): Promise<QualifySessionHandle>;
}
