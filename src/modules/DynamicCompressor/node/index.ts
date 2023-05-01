import { RackNode } from "../../../types/RackTypes";

export default class DynamicCompressor extends RackNode<DynamicsCompressorNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'DynamicCompressor'});
  }

  async init(opt?: DynamicsCompressorOptions) {
    this.node = new DynamicsCompressorNode(this.context, opt);
    return this;
  }
}
