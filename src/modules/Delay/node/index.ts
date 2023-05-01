import { RackNode } from '../../../types/RackTypes';

export default class Delay extends RackNode<DelayNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Delay',
    });
  }

  async init(opt?: DelayOptions) {
    this.node = new DelayNode(this.context, opt);
    return this;
  }
}
    