import { RackNode } from './RackTypes';
// TODO: move pitch detector back to this repo until a better 
// solution to installable rack modules is found
// import { PitchProcessorNode } from 'pitch-node';

// export { PitchProcessorNode };

export class RackOscillatorNode extends RackNode<OscillatorNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Oscillator',
      paramOptions: {
        'type':  { values: ['square', 'sine', 'sawtooth'] },
      }
    });
  }
  
  async init(opt?: OscillatorOptions) {
    this.node = new OscillatorNode(this.context, opt);
    return this;
  }
}

export class RackConvolverNode extends RackNode<ConvolverNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Convolver'});
  }

  async init(opt?: ConvolverOptions) {
    this.node = new ConvolverNode(this.context, opt);
    return this;
  }
}

export class RackBiquadFilterNode extends RackNode<BiquadFilterNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Biquad Filter',
      paramOptions: {
        'type': {
          values: ['lowpass', 'highpass', 'bandpass']
        }
      }
    });
  }

  async init(opt?: BiquadFilterOptions) {
    this.node = new BiquadFilterNode(this.context, opt);
    return this;
  }
}

export class RackGainNode extends RackNode<GainNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Gain',
      paramOptions: {
        'gain': {  min: 0, max: 100 },
      }
    });
  }

  async init(opt?: GainOptions) {
    this.node = new GainNode(this.context, opt);
    return this;
  }
}

export class RackDynamicsCompressorNode extends RackNode<DynamicsCompressorNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Dynamics Compressor'});
  }

  async init(opt?: DynamicsCompressorOptions) {
    this.node = new DynamicsCompressorNode(this.context, opt);
    return this;
  }
}

export class RackPannerNode extends RackNode<PannerNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Panner Node'});
  }

  async init(opt?: PannerOptions) {
    this.node = new PannerNode(this.context, opt);
    return this;
  }
}

export class RackSterioPannerNode extends RackNode<StereoPannerNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Stereo Panner'});
  }
   
  async init(opt?: StereoPannerOptions) {
    this.node = new StereoPannerNode(this.context, opt);
    return this;
  }
}

export class RackAnalyzerNode extends RackNode<AnalyserNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Analyser'});
  }

  async init(opt?: AnalyserOptions) {
    this.node = new AnalyserNode(this.context, opt);
    return this;
  }
}

export class RackWaveShaperNode extends RackNode<WaveShaperNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'WaveShaper'});
  }
  async init(opt?: WaveShaperOptions) {
    this.node = new WaveShaperNode(this.context, opt);
    return this;
  }
}

export class RackConstantSourceNode extends RackNode<ConstantSourceNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Constant Source'});
  }

  async init(opt?: ConstantSourceOptions) {
    this.node = new ConstantSourceNode(this.context, opt);
    return this;
  }
}

export class RackDelayNode extends RackNode<DelayNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Delay' });
  }

  async init(opt?: DelayOptions) {
    this.node = new DelayNode(this.context, opt);
    return this;
  }
}

export class RackChannelNode extends RackNode<ChannelMergerNode> {
  constructor(context: AudioContext){
    super(context, { name: 'Merger' });
  }

  async init(opt?: ChannelMergerOptions) {
    this.node = new ChannelMergerNode(this.context, opt);
    return this;
  }
}

