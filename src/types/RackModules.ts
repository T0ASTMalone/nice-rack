import { RackNode } from './RackTypes';

export class RackOscillatorNode extends RackNode {
  readonly types: string[];

  constructor(context: AudioContext, opt?: OscillatorOptions) {
    super(new OscillatorNode(context, opt), 'Oscillator');
    this.types = ['square', 'sine', 'sawtooth'];
  }
}

export class RackConvolverNode extends RackNode {
  constructor(context: AudioContext, opt?: ConvolverOptions) {
    super(new ConvolverNode(context, opt), 'Convolver');
  }
}

export class RackBiquadFilterNode extends RackNode {
  readonly types: string[];

  constructor(context: AudioContext, opt?: BiquadFilterOptions) {
    super(new BiquadFilterNode(context, opt), 'Biquad Filter');
    this.types = ['lowpass', 'highpass', 'bandpass']
  }
}

export class RackGainNode extends RackNode {
  constructor(context: AudioContext, opt?: GainOptions) {
    super(new GainNode(context, opt), 'Gain');
  }
}

export class RackDynamicsCompressorNode extends RackNode {
  constructor(context: AudioContext, opt?: DynamicsCompressorOptions) {
    super(new DynamicsCompressorNode(context, opt), 'Dynamics Compressor');
  }
}

export class RackPannerNode extends RackNode {
  constructor(context: AudioContext, opt?: PannerOptions) {
    super(new PannerNode(context, opt), 'Panner Node');
  }
}

export class RackSterioPannerNode extends RackNode {
  constructor(context: AudioContext, opt?: StereoPannerOptions) {
    super(new StereoPannerNode(context, opt), 'Stereo Panner');
  }
}

export class RackAnalyzerNode extends RackNode {
  constructor(context: AudioContext, opt?: AnalyserOptions) {
    super(new AnalyserNode(context, opt), 'Analyser');
  }
}

export class RackWaveShaperNode extends RackNode {
  constructor(context: AudioContext, opt?: WaveShaperOptions) {
    super(new WaveShaperNode(context, opt), 'WaveShaper');
  }
}

export class RackConstantSourceNode extends RackNode {
  constructor(context: AudioContext, opt?: ConstantSourceOptions) {
    super(new ConstantSourceNode(context, opt), 'Constant Source');
  }
}

export class RackDelayNode extends RackNode {
  constructor(context: AudioContext, opt?: DelayOptions) {
    super(new DelayNode(context, opt), 'Delay');
  }
}

export class RackChannelNode extends RackNode {
  constructor(context: AudioContext, opt?: ChannelMergerOptions){
    super(new ChannelMergerNode(context, opt), 'Merger');
  }
}
