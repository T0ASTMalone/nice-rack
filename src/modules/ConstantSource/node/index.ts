import { RackNode } from '../../../types/RackTypes';

export default class ConstantSource extends RackNode<ConstantSourceNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'ConstantSource',
    });
  }

  async init(opt?: ConstantSourceOptions) {
    this.node = new ConstantSourceNode(this.context, opt);
    return this;
  }
}
    
