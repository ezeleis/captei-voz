// AudioWorklet that captures microphone audio as PCM16.
//
// Resampling happens here rather than by forcing AudioContext to 24 kHz:
// Firefox honours a non-default rate but routes the context around its echo
// canceller, and Safari ignores the option entirely and silently runs at the
// hardware rate. Doing it in the worklet is the only approach that works on
// all three browsers.
class PCMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const opts = options?.processorOptions ?? {};
    const inputSampleRate = opts.inputSampleRate || sampleRate;
    const targetSampleRate = opts.targetSampleRate || 24000;
    this.ratio = inputSampleRate / targetSampleRate;
  }

  process(inputs) {
    const input = inputs[0]?.[0];
    if (!input) return true;

    const outLength = Math.floor(input.length / this.ratio);
    const pcm16 = new Int16Array(outLength);
    for (let i = 0; i < outLength; i++) {
      const sample = input[Math.floor(i * this.ratio)] ?? 0;
      pcm16[i] = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    }

    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
