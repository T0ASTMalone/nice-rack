import { RackNode } from "../../../types/RackTypes";

export default class DynamicCompressor extends RackNode<DynamicsCompressorNode> {
  constructor(context: AudioContext) {
    super(context, {
      name: 'DynamicCompressor',
      paramOptions: {
        // max would be 6 db but audio param max is 0
        threshold: { min: -66.6, max: 0 },
        knee: { min: 0, max: 18 },
        // max would be 42 but audio param max is 20
        ratio: { min: 1, max: 20 },
        attack: { min: 0.00001, max: 1 },
        // max would be 3 but audio param max is 1 
        release: { min: 0.001, max: 1 },
      }
    });
  }

  async init(opt?: DynamicsCompressorOptions) {
    this.node = new DynamicsCompressorNode(this.context, opt);
    return this;
  }
}
