import "./pitch-processor/TextEncoder.js"
import init, { WasmPitchDetector } from "./pitch-processor/wasm_audio.js";

class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.samples = [];
    this.totalSamples = 0;

    this.port.onmessage = (event) => this.onmessage(event.data);

    this.detector = null;
  }

  async onmessage(event) {
    if (event.type === "send-wasm-module") {
      console.log('PitchProcessor send-wasm-module')
      await init(await WebAssembly.compile(event.wasmBytes))
      this.port.postMessage({ type: 'wasm-module-loaded' });
    } else if (event.type === 'init-detector') {
      console.log('PitchProcessor init-detector')
      const { sampleRate, numAudioSamplesPerAnalysis } = event;

      this.numAudioSamplesPerAnalysis = numAudioSamplesPerAnalysis;

      this.detector = WasmPitchDetector.new(sampleRate, numAudioSamplesPerAnalysis);

      this.samples = new Array(numAudioSamplesPerAnalysis).fill(0);
      this.totalSamples = 0;
    }
  };

  bypass(inputs, outputs) {
    let input = inputs[0];
    let output = outputs[0];

    for(let channel = 0; channel < input.length; ++channel){
      output[channel].set(input[channel]);
    }
  }

  process(inputs, outputs) {
    const inputChannels = inputs[0];

    const inputSamples = inputChannels[0];

    if (!inputSamples) {
      this.bypass(inputs, outputs);
      return true;
    }

    if (this.totalSamples < this.numAudioSamplesPerAnalysis) {
      for (const sampleValue of inputSamples) {
        this.samples[this.totalSamples++] = sampleValue;
      }
    } else {
      // Buffer is already full. We do not want the buffer to grow continually,
      // so instead will "cycle" the samples through it so that it always
      // holds the latest ordered samples of length equal to
      // numAudioSamplesPerAnalysis.

      // Shift the existing samples left by the length of new samples (128).
      const numNewSamples = inputSamples.length;
      const numExistingSamples = this.samples.length - numNewSamples;
      for (let i = 0; i < numExistingSamples; i++) {
        this.samples[i] = this.samples[i + numNewSamples];
      }
      // Add the new samples onto the end, into the 128-wide slot vacated by
      // the previous copy.
      for (let i = 0; i < numNewSamples; i++) {
        this.samples[numExistingSamples + i] = inputSamples[i];
      }
      this.totalSamples += inputSamples.length;
    }
    // Once our buffer has enough samples, pass them to the Wasm pitch detector.
    if (this.totalSamples >= this.numAudioSamplesPerAnalysis && this.detector) {
      const result = this.detector.detect_pitch(this.samples);
      if (result !== 0) {
        this.port.postMessage({ type: "pitch", pitch: result });
      }
    } 


    this.bypass(inputs, outputs);
    // Returning true tells the Audio system to keep going.
    return true;
  }
}

registerProcessor("PitchProcessor", PitchProcessor);
