import { RackNode } from '../../../types/RackTypes';

export default class SterioPanner extends RackNode<StereoPannerNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'StereoPanner',
    });
  }

  async init(opt?: StereoPannerOptions) {
    this.node = new StereoPannerNode(this.context, opt);
    return this;
  }
}
    
