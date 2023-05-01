import { RackNode } from '../../../types/RackTypes';

export default class Analyser extends RackNode<AnalyserNode> {
  constructor(context: AudioContext) {
    super(context, { 
      name: 'Analyzer',
    });
  }

  async init(opt?: AnalyserOptions) {
    this.node = new AnalyserNode(this.context, opt);
    return this;
  }
}
    
