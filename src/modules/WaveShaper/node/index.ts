import { RackNode } from '../../../types/RackTypes';

export default class WaveShaper extends RackNode<WaveShaperNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'WaveShaper',
    });
  }

  async init(opt?: WaveShaperOptions) {
    this.node = new WaveShaperNode(this.context, opt);
    return this;
  }
}
    
