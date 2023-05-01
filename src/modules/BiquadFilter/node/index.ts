import { RackNode } from '../../../types/RackTypes';

export default class BiquadFilter extends RackNode<BiquadFilterNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'BiquadFilter',
      paramOptions: {
        'type': {
          values: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
        }
      }
    });
  }
  
  async init(opt?: BiquadFilterOptions) {
    this.node = new BiquadFilterNode(this.context, opt);
    return this;
  }
}
