import { RackNode } from '../../../types/RackTypes';

export default class BiquadFilter extends RackNode<BiquadFilterNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'BiquadFilter',
      paramOptions: {
        'type': {
          values: ['allpass', 'lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch']
        },
        Q: { min: 0, max: 1 },
        gain: { min: -12, max: 12 }
      }
    });
  }
  
  async init(opt?: BiquadFilterOptions) {
    this.node = new BiquadFilterNode(this.context, opt);
    return this;
  }
}
