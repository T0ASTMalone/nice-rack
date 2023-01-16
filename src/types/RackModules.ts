import { RackNode } from './RackTypes';

import { PitchProcessor } from 'pitch-processor';

export { PitchProcessor }

export class RackOscillatorNode extends RackNode {
  constructor(context: AudioContext, opt?: OscillatorOptions) {
    super(new OscillatorNode(context, opt), { 
      name: 'Oscillator',
      paramOptions: {
        'type':  { values: ['square', 'sine', 'sawtooth'] },
      }
    });
  }
}

export class RackConvolverNode extends RackNode {
  constructor(context: AudioContext, opt?: ConvolverOptions) {
    super(new ConvolverNode(context, opt), { name: 'Convolver'});
  }
}

export class RackBiquadFilterNode extends RackNode {
  constructor(context: AudioContext, opt?: BiquadFilterOptions) {
    super(new BiquadFilterNode(context, opt), { 
      name: 'Biquad Filter',
      paramOptions: {
        'type': {
          values: ['lowpass', 'highpass', 'bandpass']
        }
      }
    });
  }
}

export class RackGainNode extends RackNode {
  constructor(context: AudioContext, opt?: GainOptions) {
    super(new GainNode(context, opt), { 
      name: 'Gain',
      paramOptions: {
        'gain': {  min: 0, max: 100 },
      }
    });
  }
}

export class RackDynamicsCompressorNode extends RackNode {
  constructor(context: AudioContext, opt?: DynamicsCompressorOptions) {
    super(new DynamicsCompressorNode(context, opt), { name: 'Dynamics Compressor'});
  }
}

export class RackPannerNode extends RackNode {
  constructor(context: AudioContext, opt?: PannerOptions) {
    super(new PannerNode(context, opt), { name: 'Panner Node'});
  }
}

export class RackSterioPannerNode extends RackNode {
  constructor(context: AudioContext, opt?: StereoPannerOptions) {
    super(new StereoPannerNode(context, opt), { name: 'Stereo Panner'});
  }
}

export class RackAnalyzerNode extends RackNode {
  constructor(context: AudioContext, opt?: AnalyserOptions) {
    super(new AnalyserNode(context, opt), { name: 'Analyser'});
  }
}

export class RackWaveShaperNode extends RackNode {
  constructor(context: AudioContext, opt?: WaveShaperOptions) {
    super(new WaveShaperNode(context, opt), { name: 'WaveShaper'});
  }
}

export class RackConstantSourceNode extends RackNode {
  constructor(context: AudioContext, opt?: ConstantSourceOptions) {
    super(new ConstantSourceNode(context, opt), { name: 'Constant Source'});
  }
}

export class RackDelayNode extends RackNode {
  constructor(context: AudioContext, opt?: DelayOptions) {
    super(new DelayNode(context, opt), { name: 'Delay' });
  }
}

export class RackChannelNode extends RackNode {
  constructor(context: AudioContext, opt?: ChannelMergerOptions){
    super(new ChannelMergerNode(context, opt), { name: 'Merger' });
  }
}

