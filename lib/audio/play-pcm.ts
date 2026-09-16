/**
 * Continuous Voice Agent playback on the same AudioContext as the mic.
 *
 * AssemblyAI: write each reply.audio chunk into an output buffer and let
 * the OS drain it. Scheduling discrete AudioBufferSourceNodes (especially
 * after batching) leaves gaps. A second context / setSinkId can also route
 * TTS off the headset.
 *
 * https://www.assemblyai.com/docs/voice-agents/voice-agent-api/audio-format
 */

export const VOICE_AGENT_SAMPLE_RATE = 24000;

export function decodePcm16LeBase64(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const frames = bytes.byteLength >> 1;
  const view = new DataView(bytes.buffer, bytes.byteOffset, frames * 2);
  const float32 = new Float32Array(frames);
  for (let i = 0; i < frames; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }
  return float32;
}

type WorkletBackend = {
  kind: "worklet";
  node: AudioWorkletNode;
  silent: ConstantSourceNode;
};

type ScriptBackend = {
  kind: "script";
  node: ScriptProcessorNode;
  queue: Float32Array[];
  offset: number;
  frac: number;
  primed: boolean;
};

export class PcmPlayer {
  private constructor(
    private readonly ctx: AudioContext,
    private readonly backend: WorkletBackend | ScriptBackend,
  ) {}

  static async attach(ctx: AudioContext): Promise<PcmPlayer> {
    try {
      await ctx.audioWorklet.addModule("/pcm-player.js?v=4");
      const node = new AudioWorkletNode(ctx, "pcm-player", {
        numberOfInputs: 1,
        numberOfOutputs: 1,
        outputChannelCount: [1],
        processorOptions: { sourceSampleRate: VOICE_AGENT_SAMPLE_RATE },
      });
      const silent = ctx.createConstantSource();
      silent.offset.value = 0;
      silent.connect(node);
      node.connect(ctx.destination);
      silent.start();
      return new PcmPlayer(ctx, { kind: "worklet", node, silent });
    } catch {
      return PcmPlayer.attachScript(ctx);
    }
  }

  enqueueBase64(base64: string) {
    if (this.ctx.state === "closed") return;
    const samples = decodePcm16LeBase64(base64);
    if (samples.length === 0) return;

    if (this.backend.kind === "worklet") {
      this.backend.node.port.postMessage({ type: "chunk", samples });
      return;
    }

    this.backend.queue.push(samples);
  }

  /** No-op for the streaming player; kept so reply.done has a single API. */
  drain() {}

  flush() {
    if (this.ctx.state === "closed") return;
    if (this.backend.kind === "worklet") {
      this.backend.node.port.postMessage({ type: "flush" });
      return;
    }
    this.backend.queue = [];
    this.backend.offset = 0;
    this.backend.frac = 0;
    this.backend.primed = false;
  }

  dispose() {
    this.flush();
    try {
      this.backend.node.disconnect();
    } catch {
      // already disconnected
    }
    if (this.backend.kind === "worklet") {
      try {
        this.backend.silent.stop();
        this.backend.silent.disconnect();
      } catch {
        // already stopped
      }
    }
  }

  private static attachScript(ctx: AudioContext): PcmPlayer {
    const node = ctx.createScriptProcessor(2048, 1, 1);
    const backend: ScriptBackend = {
      kind: "script",
      node,
      queue: [],
      offset: 0,
      frac: 0,
      primed: false,
    };
    const player = new PcmPlayer(ctx, backend);
    const step = VOICE_AGENT_SAMPLE_RATE / ctx.sampleRate;
    const primeFrames = Math.floor(VOICE_AGENT_SAMPLE_RATE * 0.08);

    node.onaudioprocess = (event) => {
      const out = event.outputBuffer.getChannelData(0);
      const queued = queuedFrames(backend);
      if (!backend.primed) {
        if (queued >= primeFrames) backend.primed = true;
        else {
          out.fill(0);
          return;
        }
      }
      for (let i = 0; i < out.length; i++) {
        const a = peek(backend, 0);
        if (a == null) {
          out[i] = 0;
          continue;
        }
        const b = peek(backend, 1);
        out[i] = b == null ? a : a + (b - a) * backend.frac;
        backend.frac += step;
        if (backend.frac >= 1) {
          const whole = Math.floor(backend.frac);
          backend.frac -= whole;
          consume(backend, whole);
        }
      }
    };
    node.connect(ctx.destination);
    return player;
  }
}

function queuedFrames(backend: ScriptBackend): number {
  return backend.queue.reduce((sum, chunk) => sum + chunk.length, 0) - backend.offset;
}

function peek(backend: ScriptBackend, distance: number): number | null {
  let remain = backend.offset + distance;
  for (const chunk of backend.queue) {
    if (remain < chunk.length) return chunk[remain] ?? null;
    remain -= chunk.length;
  }
  return null;
}

function consume(backend: ScriptBackend, n: number) {
  backend.offset += n;
  while (backend.queue.length && backend.offset >= (backend.queue[0]?.length ?? 0)) {
    backend.offset -= backend.queue[0]?.length ?? 0;
    backend.queue.shift();
  }
}
