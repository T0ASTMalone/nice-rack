import { RackNode } from "../../../types/RackTypes";

const minMax = { min: -1, max: 1 };

export default class Panner extends RackNode<PannerNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Panner',
      paramOptions: {
        positionX: minMax,
        positionY: minMax, 
        positionZ: minMax, 
        orientationX: minMax, 
        orientationY: minMax, 
        orientationZ: minMax, 
      }
    });
  }

  async init(opt?: PannerOptions) {
    this.node = new PannerNode(this.context, opt);
    return this;
  }
}
