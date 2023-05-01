import { RackNode } from "../../../types/RackTypes";

export default class Panner extends RackNode<PannerNode> {
  constructor(context: AudioContext) {
    super(context, { name: 'Panner'});
  }

  async init(opt?: PannerOptions) {
    this.node = new PannerNode(this.context, opt);
    return this;
  }
}
