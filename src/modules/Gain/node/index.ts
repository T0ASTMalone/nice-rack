import { RackNode } from "../../../types/RackTypes";

export default class Gain extends RackNode<GainNode> {
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


