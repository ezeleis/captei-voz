// Continuous Voice Agent playback. reply.audio is 24 kHz PCM16; this
// worklet writes every render quantum at the context rate so there are
// no AudioBufferSourceNode seams. Same AudioContext as the mic — do not
// open a second graph or call setSinkId.

const SOURCE_RATE = 24000;

class PCMPlayer extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const sourceRate =
      options?.processorOptions?.sourceSampleRate || SOURCE_RATE;
    this.step = sourceRate / sampleRate;
    this.primeFrames = Math.floor(sourceRate * 0.08);
    this.cap = sourceRate * 4;
    this.buf = new Float32Array(this.cap);
    this.read = 0;
    this.write = 0;
    this.count = 0;
    this.frac = 0;
    this.primed = false;

    this.port.onmessage = (event) => {
      const msg = event.data;
      if (msg?.type === "flush") {
        this.read = 0;
        this.write = 0;
        this.count = 0;
        this.frac = 0;
        this.primed = false;
        return;
      }
      if (msg?.type !== "chunk") return;
      const samples =
        msg.samples instanceof Float32Array
          ? msg.samples
          : new Float32Array(msg.samples);
      for (let i = 0; i < samples.length; i++) {
        if (this.count >= this.cap) break;
        this.buf[this.write] = samples[i] ?? 0;
        this.write = (this.write + 1) % this.cap;
        this.count += 1;
      }
    };
  }

  process(_inputs, outputs) {
    const out = outputs[0]?.[0];
    if (!out) return true;

    if (!this.primed) {
      if (this.count >= this.primeFrames) this.primed = true;
      else {
        out.fill(0);
        return true;
      }
    }

    for (let i = 0; i < out.length; i++) {
      if (this.count < 1) {
        out[i] = 0;
        continue;
      }
      const i0 = this.read;
      const i1 = (this.read + 1) % this.cap;
      const a = this.buf[i0] ?? 0;
      const b = this.count > 1 ? (this.buf[i1] ?? a) : a;
      out[i] = a + (b - a) * this.frac;
      this.frac += this.step;
      while (this.frac >= 1 && this.count > 0) {
        this.frac -= 1;
        this.read = (this.read + 1) % this.cap;
        this.count -= 1;
      }
    }
    return true;
  }
}

registerProcessor("pcm-player", PCMPlayer);
