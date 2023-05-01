interface PitchNodeEvent extends Event {
  pitch: number;
}

export default class PitchNode extends AudioWorkletNode {
  onPitchDetectedCallback?: (pitch: number) => void; 
  numAudioSamplesPerAnalysis?: number;

  init(wasmBytes: ArrayBuffer, onPitchDetectedCallback: () => void, numAudioSamplesPerAnalysis: number) {
    this.onPitchDetectedCallback = onPitchDetectedCallback;
    this.numAudioSamplesPerAnalysis = numAudioSamplesPerAnalysis;
    this.port.onmessage = (event) => this.onmessage(event.data);

    this.port.postMessage({
      type: "send-wasm-module",
      wasmBytes,
    });
  }

  onprocessorerror = (err: Event) => {
    console.log(
      `An error from AudioWorkletProcessor.process() occurred: ${err}`
    );
  };

  onValueChange(cb: (pitch: number) => void) {
    console.log('setting on pitch detect callback');
    this.onPitchDetectedCallback = cb;
  }

  onmessage(event: PitchNodeEvent) {
    if (event.type === 'wasm-module-loaded') {
      this.port.postMessage({
        type: "init-detector",
        sampleRate: this.context.sampleRate,
        numAudioSamplesPerAnalysis: this.numAudioSamplesPerAnalysis
      });
    } else if (event.type === "pitch" && typeof this.onPitchDetectedCallback === "function") {
      console.log('running on pitch detect callback')
      this.onPitchDetectedCallback(event.pitch);
    }
  }
}
