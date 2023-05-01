import { RackNode } from '../../../types/RackTypes';

export default class ChannelMerger extends RackNode<ChannelMergerNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'ChannelMerger',
    });
  }

  async init(opt?: ChannelMergerOptions) {
    this.node = new ChannelMergerNode(this.context, opt);
    return this;
  }
}
    