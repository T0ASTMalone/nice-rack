// import { RackNode } from "../RackTypes";
import { RackNode } from '../../../types/RackTypes';
import PitchNode from './PitchNode';
import { worklet } from './worklet';

const blob = new Blob([worklet], { type: 'application/javascript; charset=utf-8' });

export default class PitchProcessorClass extends RackNode<PitchNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'PitchProcessor'});
  }

  async init(opt?: any) {
    const url = URL.createObjectURL(blob);

    // const processorUrl = "PitchProcessor.js";
    const response = await window.fetch("/pitch-processor/wasm_audio_bg.wasm");
    const wasmBytes = await response.arrayBuffer();
    const numAudioSamplesPerAnalysis = 1024;

    try {
      await this.context.audioWorklet.addModule(url);   
    } catch (e) {
      const message = e instanceof Error ? e.message : 'unknown';
      throw new Error(
        `Failed to load audio analyzer worklet at url: ${url}. Further info: ${message}`
      ); 
    }

    const node = new PitchNode(this.context, 'pitch-processor-worklet', opt);
    node.init(wasmBytes, () => {}, numAudioSamplesPerAnalysis);

    this.node = node;

    return this;
  }
}
