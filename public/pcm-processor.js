// AudioWorklet that captures microphone audio as PCM16.
//
// Resampling happens here rather than by forcing AudioContext to 24 kHz:
// Firefox honours a non-default rate but routes the context around its echo
// canceller, and Safari ignores the option entirely and silently runs at the
// hardware rate. Doing it in the worklet is the only approach that works on
// all three browsers.
//
// Streaming STT rejects frames outside 50–1000 ms. A worklet quantum is 128
// samples (~2.7 ms at 48 kHz), so we buffer before posting.
class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = options?.processorOptions ?? {};
    const inputSampleRate = opts.inputSampleRate || sampleRate;
    const targetSampleRate = opts.targetSampleRate || 24000;
    this.ratio = inputSampleRate / targetSampleRate;
    this.minSamples = Math.ceil(targetSampleRate * 0.05);
    this.pending = [];
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (input) {
      const outLength = Math.floor(input.length / this.ratio);
      for (let i = 0; i < outLength; i++) {
        const sample = input[Math.floor(i * this.ratio)] ?? 0;
        this.pending.push(
          Math.max(-32768, Math.min(32767, Math.round(sample * 32767))),
        );
      }
    }

    while (this.pending.length >= this.minSamples) {
      const chunk = this.pending.splice(0, this.minSamples);
      const pcm16 = new Int16Array(chunk);
      this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    }
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
