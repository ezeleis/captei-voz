/**
 * PCM16 LE (Voice Agent output) → downloadable WAV.
 *
 * WhatsApp's native voice-note UI wants Ogg/Opus ≤ 512 KB. That encode is
 * post-MVP (ffmpeg). WAV is what the corretor can listen to and attach
 * by hand today.
 */

import { VOICE_AGENT_SAMPLE_RATE } from "@/lib/audio/play-pcm";

function writeAscii(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}

export function pcm16LeBase64ToWavBlob(
  base64: string,
  sampleRate = VOICE_AGENT_SAMPLE_RATE,
): Blob {
  const raw = atob(base64);
  const pcm = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) pcm[i] = raw.charCodeAt(i);

  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + pcm.length, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, pcm.length, true);

  const bytes = new Uint8Array(44 + pcm.length);
  bytes.set(new Uint8Array(header), 0);
  bytes.set(pcm, 44);
  return new Blob([bytes], { type: "audio/wav" });
}

export function downloadWav(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}
